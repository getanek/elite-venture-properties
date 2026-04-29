import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, BUCKET } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const renter_name = String(fd.get("renter_name") ?? "").trim();
    const renter_email = String(fd.get("renter_email") ?? "").trim();
    const property = String(fd.get("property") ?? "").trim() || null;
    const start_date = String(fd.get("start_date") ?? "") || null;
    const end_date = String(fd.get("end_date") ?? "");
    const notes = String(fd.get("notes") ?? "") || null;
    const pdf = fd.get("pdf") as File | null;

    if (!renter_name || !renter_email || !end_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let pdf_path: string | null = null;
    if (pdf && pdf.size > 0) {
      const ext = pdf.name.split(".").pop() ?? "pdf";
      pdf_path = `${Date.now()}-${renter_email.replace(/[^a-z0-9]/gi, "_")}.${ext}`;
      const buf = Buffer.from(await pdf.arrayBuffer());
      const up = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(pdf_path, buf, { contentType: pdf.type, upsert: false });
      if (up.error) {
        return NextResponse.json({ error: `Upload failed: ${up.error.message}` }, { status: 500 });
      }
    }

    const { error } = await supabaseAdmin.from("contracts").insert({
      renter_name,
      renter_email,
      property,
      start_date,
      end_date,
      notes,
      pdf_path,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
