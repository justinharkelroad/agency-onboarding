import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { name, email, agency, phone } = await request.json();

    if (!name || !email || !agency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from("leads").insert({
      name,
      email,
      agency_name: agency,
      phone: phone || null,
    });

    if (error) {
      // Table might not exist yet — log but don't fail
      console.error("Lead save error:", error);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
