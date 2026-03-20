import { NextResponse } from "next/server";

const VERCEL_API = "https://api.vercel.com";

export async function POST(request: Request) {
  try {
    const { projectId, domain } = await request.json();

    if (!projectId || !domain) {
      return NextResponse.json({ error: "Missing projectId or domain" }, { status: 400 });
    }

    const vercelToken = process.env.VERCEL_API_TOKEN;
    if (!vercelToken) {
      return NextResponse.json({ error: "Vercel API token not configured" }, { status: 500 });
    }

    const teamId = process.env.VERCEL_TEAM_ID || undefined;
    const params = teamId ? `?teamId=${teamId}` : "";

    // Add domain to the Vercel project
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

    const data = await res.json();

    if (!res.ok) {
      // 409 = already added (that's fine)
      if (res.status === 409) {
        return NextResponse.json({
          domain,
          verified: true,
          message: "Domain already configured",
        });
      }
      return NextResponse.json(
        { error: data.error?.message || `Failed: ${res.status}` },
        { status: res.status }
      );
    }

    // Also add www variant if they gave us a bare domain
    if (!domain.startsWith("www.") && !domain.includes(".www.")) {
      await fetch(
        `${VERCEL_API}/v10/projects/${projectId}/domains${params}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: `www.${domain}` }),
        }
      );
    }

    return NextResponse.json({
      domain: data.name,
      verified: data.verified,
      message: data.verified
        ? "Domain added and verified"
        : "Domain added — DNS verification pending",
    });
  } catch (err) {
    console.error("Domain API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
