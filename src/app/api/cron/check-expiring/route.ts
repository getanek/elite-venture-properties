import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend, warningEmailHtml } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function daysUntil(date: string) {
  const d = new Date(date).getTime();
  return Math.ceil((d - Date.now()) / (1000 * 60 * 60 * 24));
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const warningDays = (process.env.WARNING_DAYS ?? "30,14,7,1")
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));

  const adminEmail = process.env.ADMIN_EMAIL!;
  const fromEmail = process.env.FROM_EMAIL ?? "notifications@antoxmedia.com";

  const { data: contracts, error } = await supabaseAdmin
    .from("contracts")
    .select("*")
    .eq("status", "active");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sent: { contract: string; days: number; recipient: string }[] = [];

  for (const c of contracts ?? []) {
    const days = daysUntil(c.end_date);
    if (days < 0) continue;
    const trigger = warningDays.find((w) => days === w);
    if (trigger === undefined) continue;

    for (const recipient of [c.renter_email, adminEmail]) {
      const audience: "admin" | "renter" = recipient === adminEmail ? "admin" : "renter";

      const { data: existing } = await supabaseAdmin
        .from("contract_notifications")
        .select("id")
        .eq("contract_id", c.id)
        .eq("days_before", trigger)
        .eq("recipient", recipient)
        .maybeSingle();
      if (existing) continue;

      const html = warningEmailHtml({
        renterName: c.renter_name,
        property: c.property,
        endDate: c.end_date,
        daysLeft: days,
        audience,
      });

      const subject =
        audience === "admin"
          ? `⚠️ Action needed: ${c.renter_name}'s contract expires in ${days}d`
          : `⚠️ Your rental contract expires in ${days} day${days === 1 ? "" : "s"}`;

      const { error: sendErr } = await resend.emails.send({
        from: fromEmail,
        to: recipient,
        subject,
        html,
      });
      if (sendErr) continue;

      await supabaseAdmin.from("contract_notifications").insert({
        contract_id: c.id,
        days_before: trigger,
        recipient,
      });

      sent.push({ contract: c.renter_name, days, recipient });
    }
  }

  return NextResponse.json({ ok: true, sent_count: sent.length, sent });
}
