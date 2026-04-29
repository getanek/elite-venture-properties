import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import SeedButton from "@/components/SeedButton";

export const dynamic = "force-dynamic";

function daysUntil(date: string) {
  const d = new Date(date).getTime();
  return Math.ceil((d - Date.now()) / (1000 * 60 * 60 * 24));
}

function badge(days: number) {
  if (days < 0) return { label: "Expired", color: "var(--danger)" };
  if (days <= 7) return { label: `${days}d left`, color: "var(--danger)" };
  if (days <= 14) return { label: `${days}d left`, color: "var(--warn)" };
  if (days <= 30) return { label: `${days}d left`, color: "var(--amber)" };
  return { label: `${days}d left`, color: "var(--success)" };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const { data, error } = await supabaseAdmin
    .from("contracts")
    .select("*")
    .order("end_date", { ascending: true });

  const contracts = (data ?? []).filter((c) => {
    if (filter === "expiring") return daysUntil(c.end_date) <= 30;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-2">
        <div>
          <div
            className="text-[11px] tracking-[0.3em] uppercase mb-2"
            style={{ color: "var(--gold-deep)" }}
          >
            Portfolio
          </div>
          <h1 className="serif text-4xl font-medium" style={{ color: "var(--walnut-deep)" }}>
            Contracts
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {filter === "expiring"
              ? "Tenancies expiring within thirty days."
              : "Active rental tenancies — sorted by end date."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {contracts.length === 0 && <SeedButton />}
          <Link
            href="/new"
            className="btn-gold px-5 py-2.5 rounded-md text-sm font-medium tracking-wide"
          >
            + New Contract
          </Link>
        </div>
      </div>

      <div className="gold-rule mt-6 mb-6" />

      {error && (
        <div className="text-sm mb-4" style={{ color: "var(--danger)" }}>
          DB error: {error.message}
        </div>
      )}

      <div className="wood-panel rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--parchment-soft)" }}>
              {["Renter", "Property", "End Date", "Status", "Document"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-[10px] tracking-[0.25em] uppercase font-semibold"
                  style={{ color: "var(--walnut-light)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center" style={{ color: "var(--muted)" }}>
                  <div className="serif text-lg mb-2">No tenancies on file.</div>
                  <div className="flex items-center justify-center gap-4">
                    <Link href="/new" style={{ color: "var(--gold-deep)" }} className="underline text-sm">
                      Add your first contract
                    </Link>
                    <span style={{ color: "var(--border)" }}>·</span>
                    <SeedButton />
                  </div>
                </td>
              </tr>
            )}
            {contracts.map((c) => {
              const days = daysUntil(c.end_date);
              const b = badge(days);
              return (
                <tr key={c.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td className="px-5 py-4">
                    <div className="serif text-[15px]" style={{ color: "var(--walnut-deep)" }}>
                      {c.renter_name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                      {c.renter_email}
                    </div>
                  </td>
                  <td className="px-5 py-4" style={{ color: "var(--walnut-mid)" }}>
                    {c.property ?? "—"}
                  </td>
                  <td className="px-5 py-4 serif" style={{ color: "var(--walnut-deep)" }}>
                    {c.end_date}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] tracking-[0.15em] uppercase font-semibold text-white"
                      style={{ background: b.color }}
                    >
                      {b.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {c.pdf_path ? (
                      <a
                        className="text-xs underline tracking-wide"
                        style={{ color: "var(--gold-deep)" }}
                        href={`/api/contracts/file?path=${encodeURIComponent(c.pdf_path)}`}
                        target="_blank"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        —
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
