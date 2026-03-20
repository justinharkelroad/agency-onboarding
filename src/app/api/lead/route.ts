import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "justin@hfiagencies.com";

export async function POST(request: Request) {
  try {
    const { name, email, agency, phone } = await request.json();

    if (!name || !email || !agency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Save to database
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("leads").insert({
      name,
      email,
      agency_name: agency,
      phone: phone || null,
    });

    if (error) {
      console.error("Lead save error:", error);
    }

    // 2. Send confirmation email to the lead
    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Thanks for your interest — AgencyBrain Pages",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; color: #1b1d33; margin-bottom: 8px;">Hey ${name},</h1>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Thanks for reaching out about a website for <strong>${agency}</strong>. We got your info and someone from our team will be in touch shortly.
            </p>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              In the meantime, here's what to expect:
            </p>
            <ul style="font-size: 15px; color: #555; line-height: 1.8; padding-left: 20px;">
              <li>A quick call or email to learn about your agency</li>
              <li>Template recommendations based on your brand</li>
              <li>A live preview site within 48 hours of kickoff</li>
            </ul>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Talk soon,<br/>
              <strong>The AgencyBrain Pages Team</strong>
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="font-size: 12px; color: #999;">
              AgencyBrain Pages — Premium websites for insurance agencies<br/>
              <a href="https://agencybrainpages.com" style="color: #b74b2a;">agencybrainpages.com</a>
            </p>
          </div>
        `,
      }).catch((err) => console.error("Confirmation email error:", err));

      // 3. Send notification email to you
      await resend.emails.send({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        subject: `New Lead: ${agency} — ${name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; color: #1b1d33; margin-bottom: 16px;">New Lead Submitted</h1>
            <table style="font-size: 15px; color: #333; line-height: 1.8; border-collapse: collapse;">
              <tr><td style="padding: 4px 16px 4px 0; color: #999;">Name</td><td style="padding: 4px 0;"><strong>${name}</strong></td></tr>
              <tr><td style="padding: 4px 16px 4px 0; color: #999;">Email</td><td style="padding: 4px 0;"><a href="mailto:${email}" style="color: #b74b2a;">${email}</a></td></tr>
              <tr><td style="padding: 4px 16px 4px 0; color: #999;">Agency</td><td style="padding: 4px 0;"><strong>${agency}</strong></td></tr>
              <tr><td style="padding: 4px 16px 4px 0; color: #999;">Phone</td><td style="padding: 4px 0;">${phone || "Not provided"}</td></tr>
            </table>
            <div style="margin-top: 24px;">
              <a href="https://agencybrainpages.com/admin" style="display: inline-block; background: #b74b2a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View in Dashboard</a>
            </div>
          </div>
        `,
      }).catch((err) => console.error("Notification email error:", err));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
