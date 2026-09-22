import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

const tones: Record<string, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/15 text-warning-foreground",
  danger: "bg-destructive/10 text-destructive",
};

export function StatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {label}
    </span>
  );
}

export function statusTone(status: string): keyof typeof tones {
  const map: Record<string, keyof typeof tones> = {
    New: "info",
    Contacted: "warning",
    "Test Ride": "info",
    Converted: "success",
    Lost: "danger",
    Proforma: "warning",
    Confirmed: "info",
    Allotted: "info",
    Delivered: "success",
    Available: "success",
    Login: "warning",
    Documents: "warning",
    Approved: "info",
    "DO Issued": "info",
    Disbursed: "success",
    Pending: "warning",
    Issued: "success",
    Submitted: "info",
    Registered: "success",
    Scheduled: "warning",
    Ready: "info",
    "Handed Over": "success",
    Active: "success",
    Inactive: "neutral",
  };
  return map[status] ?? "neutral";
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="border-border/70 shadow-card">
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p>
          {delta ? <p className="mt-1 text-xs text-success">{delta}</p> : null}
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-border/70 shadow-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-0">{children}</div>
    </Card>
  );
}
