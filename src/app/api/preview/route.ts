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

async function fetchTemplateFiles(githubToken: string) {
  const treeRes = await fetch(
    `${GITHUB_API}/repos/${TEMPLATE_REPO}/git/trees/${TEMPLATE_BRANCH}?recursive=1`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: "application/vnd.github+json" } }
  );
  if (!treeRes.ok) throw new Error(`GitHub tree fetch failed: ${treeRes.status}`);
  const tree = await treeRes.json();

  const skipPrefixes = ["node_modules/", "dist/", ".git/", ".vercel/"];
  const blobs = tree.tree.filter(
    (item: { type: string; path: string }) =>
      item.type === "blob" && !skipPrefixes.some((p) => item.path.startsWith(p))
  );

  const files = await Promise.all(
    blobs.map(async (blob: { path: string; sha: string }) => {
      const blobRes = await fetch(
        `${GITHUB_API}/repos/${TEMPLATE_REPO}/git/blobs/${blob.sha}`,
        { headers: { Authorization: `Bearer ${githubToken}`, Accept: "application/vnd.github+json" } }
      );
      if (!blobRes.ok) throw new Error(`GitHub blob fetch failed for ${blob.path}`);
      const blobData = await blobRes.json();
      return { path: blob.path, content: blobData.content, encoding: blobData.encoding as "utf-8" | "base64" };
    })
  );
  return files;
}

async function uploadFileToVercel(content: Buffer, vercelToken: string, teamId?: string): Promise<string> {
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
  if (!res.ok && res.status !== 409) throw new Error(`File upload failed: ${res.status}`);
  return sha;
}

export async function POST(request: Request) {
  try {
    const { submissionId, template } = await request.json();
    if (!submissionId || !template) {
      return NextResponse.json({ error: "Missing submissionId or template" }, { status: 400 });
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
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Override template for this preview
    const agency = { ...submission, template } as AgencyData & { id: string };
    if (!agency.formspree_id) agency.formspree_id = "test";

    // 2. Generate config
    const configContent = generateConfigTS(agency);

    // 3. Fetch template files
    const templateFiles = await fetchTemplateFiles(githubToken);

    // 4. Upload files
    const fileDigests: Array<{ file: string; sha: string; size: number }> = [];
    for (const file of templateFiles) {
      let buffer: Buffer;
      if (file.path === "src/config.ts") {
        buffer = Buffer.from(configContent, "utf-8");
      } else if (file.path === "index.html") {
        let html = file.encoding === "base64"
          ? Buffer.from(file.content, "base64").toString("utf-8")
          : file.content;
        const headScripts = (agency as any).custom_head_scripts || "";
        const bodyScripts = (agency as any).custom_body_scripts || "";
        if (headScripts) html = html.replace("</head>", `${headScripts}\n</head>`);
        if (bodyScripts) html = html.replace("</body>", `${bodyScripts}\n</body>`);
        buffer = Buffer.from(html, "utf-8");
      } else if (file.encoding === "base64") {
        buffer = Buffer.from(file.content, "base64");
      } else {
        buffer = Buffer.from(file.content, "utf-8");
      }
      const sha = await uploadFileToVercel(buffer, vercelToken, teamId);
      fileDigests.push({ file: file.path, sha, size: buffer.length });
    }

    // 5. Deploy as a preview (separate project name so it doesn't conflict)
    const slug = agencySlug(agency.agency_name);
    const previewName = `${slug}-preview-${template}`;
    const params = teamId ? `?teamId=${teamId}` : "";

    const deployRes = await fetch(`${VERCEL_API}/v13/deployments${params}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: previewName,
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
      return NextResponse.json({ error: `Preview deploy failed: ${body}` }, { status: 500 });
    }

    const deployment = await deployRes.json();
    const deployId = deployment.uid || deployment.id;

    // 6. Disable SSO on the preview project
    const projectId = deployment.projectId;
    if (projectId) {
      await fetch(`${VERCEL_API}/v9/projects/${projectId}${params}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${vercelToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ssoProtection: null }),
      });
    }

    // 7. Wait for build
    let buildState = "BUILDING";
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const checkRes = await fetch(`${VERCEL_API}/v13/deployments/${deployId}`, {
        headers: { Authorization: `Bearer ${vercelToken}` },
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        buildState = checkData.readyState || checkData.state;
        if (buildState === "READY" || buildState === "ERROR") break;
      }
    }

    if (buildState === "ERROR") {
      return NextResponse.json({ error: "Preview build failed" }, { status: 500 });
    }

    const previewUrl = `https://${deployment.url}`;

    return NextResponse.json({
      url: previewUrl,
      template,
      deploymentId: deployId,
    });
  } catch (err) {
    console.error("Preview error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
