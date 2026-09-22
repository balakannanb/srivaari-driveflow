import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Banknote,
  Boxes,
  ShieldCheck,
  Truck,
  BookOpenCheck,
  Settings2,
  Bell,
  Search,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/enquiries", label: "Enquiries & CRM", icon: Users },
  { to: "/bookings", label: "Bookings & Proforma", icon: ClipboardList },
  { to: "/finance", label: "Finance & Refinance", icon: Banknote },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/insurance", label: "Insurance & RTO", icon: ShieldCheck },
  { to: "/deliveries", label: "Deliveries", icon: Truck },
  { to: "/accounts", label: "Showroom Accounts", icon: BookOpenCheck },
  { to: "/masters", label: "Masters & Users", icon: Settings2 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="grid size-10 place-items-center rounded-xl bg-brand-gradient text-primary-foreground font-display text-lg font-bold">
            S
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold tracking-wide text-foreground">SRIVAARI</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Automobiles</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 pb-6">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-primary/10 !text-primary" }}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="m-3 rounded-xl border border-border bg-surface p-3">
          <p className="text-xs font-semibold text-foreground">Main Showroom</p>
          <p className="text-[11px] text-muted-foreground">Madurai · FY 2026-27</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-card/85 px-4 backdrop-blur md:px-8">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted-foreground max-w-md">
            <Search className="size-4" />
            <span>Search customer, booking or chassis number</span>
          </div>
          <button className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground">
            <Bell className="size-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-foreground">R. Karthik</p>
              <p className="text-xs text-muted-foreground">Showroom Manager</p>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              RK
            </div>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-4 py-2 lg:hidden">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground"
              activeProps={{ className: "bg-primary/10 !text-primary" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
