import Link from "next/link";
import Image from "next/image";
import { FileText, Plus, Bell, LayoutDashboard } from "lucide-react";

export default function Sidebar() {
  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, #2b1d12 0%, #1c130a 100%)",
        color: "var(--sidebar-fg)",
        borderRight: "1px solid #0e0905",
        boxShadow: "inset -1px 0 0 rgba(201,164,92,0.15)",
      }}
    >
      <div className="px-6 pt-8 pb-5 flex flex-col items-center text-center">
        <div
          className="rounded-md p-3 mb-3"
          style={{ background: "var(--bone)", border: "1px solid var(--gold-deep)" }}
        >
          <Image src="/elite.png" alt="Elite Venture Properties" width={84} height={84} priority />
        </div>
        <div className="serif text-[15px] tracking-[0.18em] uppercase" style={{ color: "var(--gold-soft)" }}>
          Elite Venture
        </div>
        <div className="text-[10px] tracking-[0.3em] uppercase mt-1" style={{ color: "#8a7754" }}>
          Properties
        </div>
      </div>

      <div className="mx-6 mb-5 gold-rule" />

      <nav className="flex flex-col gap-1 px-3">
        <NavItem href="/" icon={<LayoutDashboard size={15} />} label="Dashboard" />
        <NavItem href="/new" icon={<Plus size={15} />} label="New Contract" />
        <NavItem href="/?filter=expiring" icon={<Bell size={15} />} label="Expiring Soon" />
        <NavItem href="/?filter=all" icon={<FileText size={15} />} label="All Contracts" />
      </nav>

      <div className="mt-auto px-6 py-5 text-[10px] tracking-[0.2em] uppercase" style={{ color: "#7a6644" }}>
        Renewals · v0.1
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 rounded-md text-[13px] transition hover:bg-[#3d2a1a]/60"
      style={{ color: "var(--sidebar-fg)" }}
    >
      <span style={{ color: "var(--gold)" }}>{icon}</span>
      <span className="tracking-wide">{label}</span>
    </Link>
  );
}
