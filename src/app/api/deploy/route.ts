import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateConfigTS, agencySlug, type AgencyData } from "@/lib/generateConfig";
import crypto from "crypto";

const VERCEL_API = "https://api.vercel.com";
const GITHUB_API = "https://api.github.com";
const TEMPLATE_REPO = "justinharkelroad/agency-template";
const TEMPLATE_BRANCH = "main";

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
}

/** Fetch the full file tree from the GitHub template repo */
async function fetchTemplateFiles(githubToken: string): Promise<
  Array<{ path: string; content: string; encoding: "utf-8" | "base64" }>
> {
  // Get the tree recursively
  const treeRes = await fetch(
    `${GITHUB_API}/repos/${TEMPLATE_REPO}/git/trees/${TEMPLATE_BRANCH}?recursive=1`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: "application/vnd.github+json" } }
  );
  if (!treeRes.ok) {
    throw new Error(`GitHub tree fetch failed: ${treeRes.status} ${await treeRes.text()}`);
  }
  const tree = await treeRes.json();

  // Filter to only files we need (skip node_modules, dist, .git, etc.)
  const skipPrefixes = ["node_modules/", "dist/", ".git/", ".vercel/"];
  const blobs = tree.tree.filter(
    (item: { type: string; path: string }) =>
      item.type === "blob" && !skipPrefixes.some((p) => item.path.startsWith(p))
  );

  // Fetch each blob's content
  const files = await Promise.all(
    blobs.map(async (blob: { path: string; sha: string }) => {
      const blobRes = await fetch(
        `${GITHUB_API}/repos/${TEMPLATE_REPO}/git/blobs/${blob.sha}`,
        { headers: { Authorization: `Bearer ${githubToken}`, Accept: "application/vnd.github+json" } }
      );
      if (!blobRes.ok) {
        throw new Error(`GitHub blob fetch failed for ${blob.path}: ${blobRes.status}`);
      }
      const blobData = await blobRes.json();
      return {
        path: blob.path,
        content: blobData.content,
        encoding: blobData.encoding as "utf-8" | "base64",
      };
    })
  );

  return files;
}

/** Upload a file to Vercel and return its SHA */
async function uploadFileToVercel(
  content: Buffer,
  vercelToken: string,
  teamId?: string
): Promise<string> {
  const sha = crypto.createHash("sha1").update(content).digest("hex");
  const params = teamId ? `?teamId=${teamId}` : "";

  const res = await fetch(`${VERCEL_API}/v2/files${params}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/octet-stream",
      "x-vercel-digest": sha,
      "Content-Length": content.length.toString(),
    },
    body: new Uint8Array(content),
  });

  // 200 = uploaded, 409 = already exists (both are fine)
  if (!res.ok && res.status !== 409) {
    throw new Error(`Vercel file upload failed: ${res.status} ${await res.text()}`);
  }

  return sha;
}

/** Create or find a Vercel project for this agency */
async function ensureVercelProject(
  slug: string,
  vercelToken: string,
  teamId?: string
): Promise<string> {
  const params = teamId ? `?teamId=${teamId}` : "";

  // Try to get existing project
  const getRes = await fetch(`${VERCEL_API}/v9/projects/${slug}${params}`, {
    headers: { Authorization: `Bearer ${vercelToken}` },
  });

  if (getRes.ok) {
    const project = await getRes.json();
    return project.id;
  }

  // Create new project
  const createRes = await fetch(`${VERCEL_API}/v10/projects${params}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: slug,
      framework: "vite",
      buildCommand: "npm run build",
      outputDirectory: "dist",
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Vercel project creation failed: ${createRes.status} ${await createRes.text()}`);
  }

  const project = await createRes.json();

  // Disable SSO/deployment protection so agency sites are publicly accessible
  await fetch(`${VERCEL_API}/v9/projects/${project.id}${params}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ssoProtection: null }),
  });

  return project.id;
}

/** Assign a subdomain to the Vercel project */
async function assignDomain(
  projectId: string,
  domain: string,
  vercelToken: string,
  teamId?: string
): Promise<void> {
  const params = teamId ? `?teamId=${teamId}` : "";

  const res = await fetch(
    `${VERCEL_API}/v10/projects/${projectId}/domains${params}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domain }),
    }
  );

  // 409 = domain already assigned (fine)
  if (!res.ok && res.status !== 409) {
    const body = await res.text();
    // Don't fail deployment if domain assignment fails — the site is still live on .vercel.app
    console.error(`Domain assignment warning: ${res.status} ${body}`);
  }
}

export async function POST(request: Request) {
  try {
    const { submissionId } = await request.json();
    if (!submissionId) {
      return NextResponse.json({ error: "Missing submissionId" }, { status: 400 });
    }

    const vercelToken = getEnv("VERCEL_API_TOKEN");
    const githubToken = getEnv("GITHUB_TOKEN");
    const teamId = process.env.VERCEL_TEAM_ID || undefined;
    const supabase = getSupabaseAdmin();

    // 1. Fetch submission
    const { data: submission, error: fetchError } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const agency = submission as AgencyData & { id: string; vercel_project_id?: string };

    // 2. Validate required fields
    if (!agency.template) {
      return NextResponse.json({ error: "Template not selected" }, { status: 400 });
    }
    // Formspree is optional — deploy works without it, contact form just won't submit
    if (!agency.formspree_id) {
      agency.formspree_id = "test";
    }

    // 3. Generate config.ts
    const configContent = generateConfigTS(agency);

    // 4. Fetch template files from GitHub
    const templateFiles = await fetchTemplateFiles(githubToken);

    // 5. Upload all files to Vercel (swap config.ts with generated version)
    const fileDigests: Array<{ file: string; sha: string; size: number }> = [];

    for (const file of templateFiles) {
      let buffer: Buffer;

      if (file.path === "src/config.ts") {
        // Replace with generated config
        buffer = Buffer.from(configContent, "utf-8");
      } else if (file.path === "index.html") {
        // Inject custom scripts into index.html
        let html = file.encoding === "base64"
          ? Buffer.from(file.content, "base64").toString("utf-8")
          : file.content;
        const headScripts = (agency as any).custom_head_scripts || "";
        const bodyScripts = (agency as any).custom_body_scripts || "";
        if (headScripts) {
          html = html.replace("</head>", `${headScripts}\n</head>`);
        }
        if (bodyScripts) {
          html = html.replace("</body>", `${bodyScripts}\n</body>`);
        }
        buffer = Buffer.from(html, "utf-8");
      } else if (file.encoding === "base64") {
        buffer = Buffer.from(file.content, "base64");
      } else {
        buffer = Buffer.from(file.content, "utf-8");
      }

      const sha = await uploadFileToVercel(buffer, vercelToken, teamId);
      fileDigests.push({ file: file.path, sha, size: buffer.length });
    }

    // 6. Create or reuse Vercel project
    const slug = agencySlug(agency.agency_name);
    const projectId = agency.vercel_project_id || await ensureVercelProject(slug, vercelToken, teamId);

    // 7. Create deployment
    const params = teamId ? `?teamId=${teamId}` : "";
    const deployRes = await fetch(`${VERCEL_API}/v13/deployments${params}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: slug,
        project: projectId,
        files: fileDigests,
        projectSettings: {
          framework: "vite",
          buildCommand: "npm run build",
          outputDirectory: "dist",
          installCommand: "npm install",
        },
      }),
    });

    if (!deployRes.ok) {
      const body = await deployRes.text();
      return NextResponse.json(
        { error: `Deployment failed: ${body}` },
        { status: 500 }
      );
    }

    const deployment = await deployRes.json();

    // 8. The deployment URL is directly accessible once built
    // Use the Vercel-assigned URL which auto-updates for the project
    const deploymentUrl = `https://${deployment.url}`;

    // 9. Also try custom domain (will silently fail if not owned)
    const subdomain = `${slug}.agencybrainpages.com`;
    await assignDomain(projectId, subdomain, vercelToken, teamId);

    // 10. Update database with the direct deployment URL
    const deployedUrl = deploymentUrl;
    await supabase
      .from("submissions")
      .update({
        status: "live",
        deployed_url: deployedUrl,
        vercel_project_id: projectId,
        vercel_deployment_id: deployment.uid || deployment.id,
        deployed_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    return NextResponse.json({
      url: deployedUrl,
      deploymentId: deployment.uid || deployment.id,
      projectId,
      vercelUrl: `https://${deployment.url}`,
    });
  } catch (err) {
    console.error("Deploy error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
