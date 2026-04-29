import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const DEMO = [
  {
    renter_name: "Amira Al-Mansoori",
    renter_email: "amira.almansoori@example.com",
    property: "Palm Jumeirah · Frond G · Villa 12",
    start_date: addDays(-350),
    end_date: addDays(5),
    notes: "Premium tenant. Renewal verbal-confirmed.",
    status: "active",
  },
  {
    renter_name: "James Whitford",
    renter_email: "james.whitford@example.com",
    property: "Downtown · Burj Vista · Apt 2304",
    start_date: addDays(-340),
    end_date: addDays(12),
    notes: "Pending renewal terms negotiation.",
    status: "active",
  },
  {
    renter_name: "Sofia Petrova",
    renter_email: "sofia.petrova@example.com",
    property: "Dubai Marina · Princess Tower · 5612",
    start_date: addDays(-330),
    end_date: addDays(21),
    notes: "Long-term tenant, 3rd renewal cycle.",
    status: "active",
  },
  {
    renter_name: "Hassan Khoury",
    renter_email: "hassan.khoury@example.com",
    property: "Emirates Hills · Villa 47",
    start_date: addDays(-300),
    end_date: addDays(45),
    notes: "High-value contract — VIP handling.",
    status: "active",
  },
  {
    renter_name: "Eleanor Ashworth",
    renter_email: "eleanor.ashworth@example.com",
    property: "Jumeirah Bay · Bulgari Residence · 1102",
    start_date: addDays(-280),
    end_date: addDays(90),
    notes: "New tenant, references verified.",
    status: "active",
  },
  {
    renter_name: "Marco Bianchi",
    renter_email: "marco.bianchi@example.com",
    property: "DIFC · Index Tower · Office 4408",
    start_date: addDays(-200),
    end_date: addDays(180),
    notes: "Commercial lease.",
    status: "active",
  },
  {
    renter_name: "Yuki Tanaka",
    renter_email: "yuki.tanaka@example.com",
    property: "Bluewaters · Bay Residences · Apt 808",
    start_date: addDays(-380),
    end_date: addDays(-3),
    notes: "Lapsed — awaiting renter response.",
    status: "active",
  },
  {
    renter_name: "Olivia Sterling",
    renter_email: "olivia.sterling@example.com",
    property: "JBR · Sadaf 3 · Apt 2104",
    start_date: addDays(-720),
    end_date: addDays(-365),
    notes: "Renewed last cycle.",
    status: "renewed",
  },
];

export async function POST() {
  const { count } = await supabaseAdmin
    .from("contracts")
    .select("*", { count: "exact", head: true });

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { ok: false, error: `Refusing to seed: ${count} contracts already exist. Truncate first.` },
      { status: 409 }
    );
  }

  const { error, data } = await supabaseAdmin.from("contracts").insert(DEMO).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, inserted: data?.length ?? 0 });
}

export async function GET() {
  return NextResponse.json({
    info: "POST this endpoint to seed 8 demo contracts. Will refuse if any rows already exist.",
    demo_count: DEMO.length,
  });
}
