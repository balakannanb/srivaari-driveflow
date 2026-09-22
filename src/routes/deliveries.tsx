import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { StatCard, StatusPill, statusTone } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { deliveries as seed, type Delivery } from "@/lib/data";
import { Truck, ClipboardCheck, DoorOpen, Sparkles } from "lucide-react";

export const Route = createFileRoute("/deliveries")({
  head: () => ({
    meta: [
      { title: "Deliveries & Handover — Srivaari Automobiles" },
      {
        name: "description",
        content:
          "Pre-delivery inspection checklists, accessory fitments, gate passes and customer handover confirmation.",
      },
      { property: "og:title", content: "Deliveries & Handover — Srivaari Automobiles" },
      {
        property: "og:description",
        content: "PDI, gate pass and handover tracking for every delivery slot.",
      },
    ],
  }),
  component: Deliveries,
});

function Deliveries() {
  const [rows, setRows] = useState<Delivery[]>(seed);

  const togglePdi = (booking: string, label: string) =>
    setRows(
      rows.map((d) =>
        d.booking === booking
          ? { ...d, pdi: d.pdi.map((p) => (p.label === label ? { ...p, done: !p.done } : p)) }
          : d,
      ),
    );

  const handover = (booking: string) => {
    setRows(
      rows.map((d) =>
        d.booking === booking ? { ...d, status: "Handed Over", gatePass: true } : d,
      ),
    );
    toast.success("Gate pass issued and handover recorded");
  };

  return (
    <AppShell>
      <PageHeader
        title="Deliveries & Handover"
        subtitle="PDI checklists, accessory fitments, gate passes and customer confirmation"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Scheduled deliveries" value={String(rows.length)} icon={Truck} />
        <StatCard
          label="PDI complete"
          value={String(rows.filter((d) => d.pdi.every((p) => p.done)).length)}
          icon={ClipboardCheck}
        />
        <StatCard
          label="Gate passes issued"
          value={String(rows.filter((d) => d.gatePass).length)}
          icon={DoorOpen}
        />
        <StatCard
          label="Accessory fitments"
          value={String(rows.reduce((s, d) => s + d.accessories.length, 0))}
          icon={Sparkles}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {rows.map((d) => {
          const ready = d.pdi.every((p) => p.done);
          return (
            <div key={d.booking} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold text-foreground">
                    {d.customer}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {d.booking} · {d.model} · {d.slot}
                  </p>
                </div>
                <StatusPill label={d.status} tone={statusTone(d.status)} />
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {d.pdi.map((p) => (
                  <label key={p.label} className="flex items-center gap-2 text-sm text-foreground">
                    <Checkbox
                      checked={p.done}
                      disabled={d.status === "Handed Over"}
                      onCheckedChange={() => togglePdi(d.booking, p.label)}
                    />
                    {p.label}
                  </label>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {d.accessories.map((a) => (
                  <Badge key={a} variant="secondary">
                    {a}
                  </Badge>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                  {d.gatePass ? "Gate pass issued" : "Gate pass pending"}
                </p>
                <Button
                  size="sm"
                  disabled={!ready || d.status === "Handed Over"}
                  onClick={() => handover(d.booking)}
                >
                  {d.status === "Handed Over" ? "Delivered" : "Confirm handover"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
