"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewContractPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/contracts", { method: "POST", body: fd });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Upload failed");
      setSubmitting(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-[11px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--gold-deep)" }}>
        New Tenancy
      </div>
      <h1 className="serif text-4xl font-medium" style={{ color: "var(--walnut-deep)" }}>
        Register Contract
      </h1>
      <p className="text-sm mt-2 mb-6" style={{ color: "var(--muted)" }}>
        Upload the signed agreement and set the rental end date. Renewal warnings will dispatch
        automatically before expiry.
      </p>

      <div className="gold-rule mb-6" />

      <form onSubmit={onSubmit} className="wood-panel rounded-xl p-7 space-y-5">
        <Field label="Renter Name" name="renter_name" required />
        <Field label="Renter Email" name="renter_email" type="email" required />
        <Field label="Property / Unit" name="property" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date" name="start_date" type="date" />
          <Field label="End Date" name="end_date" type="date" required />
        </div>
        <div>
          <Label>Contract PDF (Scan)</Label>
          <input
            name="pdf"
            type="file"
            accept="application/pdf,image/*"
            className="input-wood block w-full text-sm rounded-md p-2.5"
          />
        </div>
        <div>
          <Label>Notes</Label>
          <textarea name="notes" rows={3} className="input-wood block w-full text-sm rounded-md p-2.5" />
        </div>
        {error && (
          <div className="text-sm" style={{ color: "var(--danger)" }}>
            {error}
          </div>
        )}
        <div className="pt-2">
          <button
            disabled={submitting}
            className="btn-gold px-6 py-2.5 rounded-md text-sm font-medium tracking-wide disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save Contract"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[10px] tracking-[0.25em] uppercase font-semibold mb-1.5"
      style={{ color: "var(--walnut-light)" }}
    >
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span style={{ color: "var(--danger)" }}> *</span>}
      </Label>
      <input
        name={name}
        type={type}
        required={required}
        className="input-wood block w-full text-sm rounded-md p-2.5"
      />
    </div>
  );
}
