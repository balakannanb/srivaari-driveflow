import { type ReactNode, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDownUp, ChevronLeft, ChevronRight, Inbox, MoreHorizontal, Pencil, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatCurrency, toneForStatus, type RecordRow, type Tone } from "@/lib/domain";

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
    <div>{eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>}<h1 className="font-display text-3xl font-semibold text-foreground lg:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground lg:text-base">{description}</p></div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </header>;
}

export function StatusBadge({ status, tone }: { status: string; tone?: Tone }) {
  const selected = tone ?? toneForStatus(status);
  return <Badge className={cn("border px-2.5 py-1 font-semibold", selected === "success" && "border-success/20 bg-success-soft text-success", selected === "warning" && "border-warning/20 bg-warning-soft text-warning", selected === "danger" && "border-destructive/20 bg-destructive-soft text-destructive", selected === "info" && "border-primary/20 bg-primary-soft text-primary", selected === "neutral" && "border-border bg-muted text-muted-foreground")}>{status}</Badge>;
}

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return <Card className={cn("glass-card border-border/70 shadow-soft", className)}>{children}</Card>;
}

export function KpiCard({ label, value, trend, icon }: { label: string; value: string; trend: string; icon: ReactNode }) {
  return <GlassCard className="group overflow-hidden p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-float"><div className="flex items-start justify-between"><div className="ambient-highlight grid size-10 place-items-center rounded-xl border border-primary/10 text-primary">{icon}</div><span className="rounded-lg bg-success-soft px-2 py-1 text-xs font-semibold text-success">{trend}</span></div><p className="mt-5 font-display text-3xl font-semibold text-foreground">{value}</p><p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p></GlassCard>;
}

export function JourneyStepper({ active = 5 }: { active?: number }) {
  const steps = ["Enquiry", "Proforma", "Booking", "Payment", "Finance", "Insurance", "Registration", "Delivery"];
  return <div className="overflow-x-auto pb-2"><div className="flex min-w-[780px] items-start">{steps.map((step, index) => <div key={step} className="relative flex flex-1 flex-col items-center text-center"><div className={cn("absolute left-0 top-4 h-0.5 w-full", index === 0 ? "hidden" : index <= active ? "bg-primary" : "bg-border")} /><div className={cn("relative z-10 grid size-8 place-items-center rounded-full border-2 text-xs font-bold", index < active && "border-primary bg-primary text-primary-foreground", index === active && "border-primary bg-background text-primary shadow-glow", index > active && "border-border bg-background text-muted-foreground")}>{index < active ? "✓" : index + 1}</div><span className={cn("mt-2 text-xs font-semibold", index <= active ? "text-foreground" : "text-muted-foreground")}>{step}</span></div>)}</div></div>;
}

const linkClass = "font-semibold text-primary hover:underline";

function RecordLink({ basePath, id }: { basePath: string; id: string }) {
  if (basePath === "/bookings") return <Link to="/bookings/$id" params={{ id }} className={linkClass}>{id}</Link>;
  if (basePath === "/enquiries") return <Link to="/enquiries/$id" params={{ id }} className={linkClass}>{id}</Link>;
  if (basePath === "/proforma") return <Link to="/proforma/$id" params={{ id }} className={linkClass}>{id}</Link>;
  if (basePath === "/finance/applications") return <Link to="/finance/applications/$id" params={{ id }} className={linkClass}>{id}</Link>;
  if (basePath === "/finance/refinance") return <Link to="/finance/refinance/$id" params={{ id }} className={linkClass}>{id}</Link>;
  if (basePath === "/insurance") return <Link to="/insurance/$id" params={{ id }} className={linkClass}>{id}</Link>;
  if (basePath === "/registration") return <Link to="/registration/$id" params={{ id }} className={linkClass}>{id}</Link>;
  if (basePath === "/deliveries") return <Link to="/deliveries/$id" params={{ id }} className={linkClass}>{id}</Link>;
  return <span className="font-semibold text-primary">{id}</span>;
}

export function EditLink({ basePath, id, children, className }: { basePath: string; id: string; children: ReactNode; className?: string }) {
  if (basePath === "/bookings") return <Link to="/bookings/$id/edit" params={{ id }} className={className}>{children}</Link>;
  if (basePath === "/customers") return <Link to="/customers/$id/edit" params={{ id }} className={className}>{children}</Link>;
  if (basePath === "/inventory") return <Link to="/inventory/$id/edit" params={{ id }} className={className}>{children}</Link>;
  if (basePath === "/enquiries") return <Link to="/enquiries/$id/edit" params={{ id }} className={className}>{children}</Link>;
  if (basePath === "/proforma") return <Link to="/proforma/$id/edit" params={{ id }} className={className}>{children}</Link>;
  if (basePath === "/finance/applications") return <Link to="/finance/applications/$id/edit" params={{ id }} className={className}>{children}</Link>;
  if (basePath === "/finance/refinance") return <Link to="/finance/refinance/$id/edit" params={{ id }} className={className}>{children}</Link>;
  if (basePath === "/insurance") return <Link to="/insurance/$id/edit" params={{ id }} className={className}>{children}</Link>;
  if (basePath === "/registration") return <Link to="/registration/$id/edit" params={{ id }} className={className}>{children}</Link>;
  return <Link to="/deliveries/$id/edit" params={{ id }} className={className}>{children}</Link>;
}

export function RowActions({ basePath, id }: { basePath: string; id: string }) {
  return <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions for ${id}`}><MoreHorizontal/></Button></DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem asChild><RecordLink basePath={basePath} id={id}/></DropdownMenuItem>
      <DropdownMenuItem asChild><EditLink basePath={basePath} id={id}><span className="flex w-full items-center gap-2"><Pencil className="size-4"/> Edit</span></EditLink></DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}

export function ModernTable({ rows, basePath }: { rows: RecordRow[]; basePath: string }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(query.toLowerCase())), [query, rows]);
  return <GlassCard className="overflow-hidden"><div className="ambient-highlight flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary"/><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search records..."/></div><Button variant="outline" size="sm"><ArrowDownUp/> Sort</Button></div>
    {filtered.length === 0 ? <EmptyState title="No matching records" description="Try another search or clear your filters." /> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-muted/45 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3.5">Record</th><th className="px-5 py-3.5">Customer / Asset</th><th className="px-5 py-3.5">Details</th><th className="px-5 py-3.5">Date</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Amount</th><th className="w-12"/></tr></thead><tbody>{filtered.map((row) => <tr key={row.id} className="border-t border-border/55 transition-colors duration-200 hover:bg-primary-soft/45"><td className="px-5 py-4"><RecordLink basePath={basePath} id={row.id}/></td><td className="px-5 py-4"><p className="font-semibold text-foreground">{row.primary}</p><p className="text-xs text-muted-foreground">{row.secondary}</p></td><td className="px-5 py-4 text-sm text-muted-foreground">{row.detail}</td><td className="px-5 py-4 text-sm text-muted-foreground">{row.date}</td><td className="px-5 py-4"><StatusBadge status={row.status}/></td><td className="px-5 py-4 text-right font-semibold">{row.amount ? formatCurrency(row.amount) : "—"}</td><td><RowActions basePath={basePath} id={row.id}/></td></tr>)}</tbody></table></div>}
    <div className="flex items-center justify-between border-t border-border/70 px-5 py-3"><span className="text-xs text-muted-foreground">Showing {filtered.length} of {rows.length} records</span><div className="flex gap-1"><Button variant="ghost" size="icon" disabled={page === 1} onClick={() => setPage(1)}><ChevronLeft/></Button><Button variant="outline" size="sm">{page}</Button><Button variant="ghost" size="icon" onClick={() => setPage(page + 1)}><ChevronRight/></Button></div></div>
  </GlassCard>;
}

export function EmptyState({ title, description }: { title: string; description: string }) { return <div className="grid min-h-64 place-items-center p-8 text-center"><div><div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground"><Inbox/></div><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>; }

export function FormField({ label, placeholder, type = "text", required = false, defaultValue }: { label: string; placeholder?: string; type?: string; required?: boolean; defaultValue?: string }) { return <label className="grid gap-2 text-sm font-semibold text-foreground">{label}{required && <span className="sr-only">required</span>}<Input type={type} defaultValue={defaultValue} placeholder={placeholder} required={required}/></label>; }