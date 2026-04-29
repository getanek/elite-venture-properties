import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, BUCKET } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json({ error: "missing path" }, { status: 400 });
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 5);
  if (error || !data) return NextResponse.json({ error: error?.message }, { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}
