"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function seed() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/seed", { method: "POST" });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      setMsg(`Seeded ${j.inserted} demo contracts.`);
      router.refresh();
    } else {
      setMsg(j.error ?? "Seed failed");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={seed}
        disabled={loading}
        className="px-3 py-1.5 rounded-md text-[11px] tracking-[0.15em] uppercase font-semibold disabled:opacity-50"
        style={{
          background: "transparent",
          color: "var(--gold-deep)",
          border: "1px solid var(--gold-deep)",
        }}
      >
        {loading ? "Seeding…" : "Load Demo Data"}
      </button>
      {msg && (
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {msg}
        </span>
      )}
    </div>
  );
}
