import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, StatCard, StatusPill, statusTone } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bookings, inr, models } from "@/lib/data";
import { ClipboardList, IndianRupee, FileText, Wallet } from "lucide-react";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings & Proforma — Srivaari Automobiles" },
      {
        name: "description",
        content:
          "Vehicle bookings, advance payments, variant selection and instant proforma quotations.",
      },
      { property: "og:title", content: "Bookings & Proforma — Srivaari Automobiles" },
      {
        property: "og:description",
        content: "Manage advances, on-road pricing and booking confirmations.",
      },
    ],
  }),
  component: Bookings,
});

function Bookings() {
  const [modelId, setModelId] = useState(models[0]!.id);
  const [accessories, setAccessories] = useState(3500);
  const [advance, setAdvance] = useState(20000);
  const model = models.find((m) => m.id === modelId)!;
  const onRoad = model.exShowroom + model.insurance + model.rto + accessories;

  return (
    <AppShell>
      <PageHeader
        title="Bookings & Proforma"
        subtitle="Confirm bookings, collect advances and issue proforma quotations"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active bookings" value={String(bookings.length)} icon={ClipboardList} />
        <StatCard
          label="Advance collected"
          value={inr(bookings.reduce((s, b) => s + b.advance, 0))}
          icon={Wallet}
        />
        <StatCard
          label="Balance receivable"
          value={inr(bookings.reduce((s, b) => s + b.balance, 0))}
          icon={IndianRupee}
        />
        <StatCard
          label="Proformas pending"
          value={String(bookings.filter((b) => b.status === "Proforma").length)}
          icon={FileText}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Panel
          title="Proforma calculator"
          description="On-road price build-up"
          className="lg:col-span-2"
        >
          <div className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label>Model & variant</Label>
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} — {m.variant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Colour</Label>
              <Select key={model.id} defaultValue={model.colors[0] ?? ""}>
                <SelectTrigger>
                  <SelectValue placeholder={model.colors[0]} />
                </SelectTrigger>
                <SelectContent>
                  {model.colors.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="acc">Accessories</Label>
                <Input
                  id="acc"
                  type="number"
                  value={accessories}
                  onChange={(e) => setAccessories(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="adv">Advance</Label>
                <Input
                  id="adv"
                  type="number"
                  value={advance}
                  onChange={(e) => setAdvance(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 text-sm">
              {[
                ["Ex-showroom", model.exShowroom],
                ["Insurance", model.insurance],
                ["RTO & road tax", model.rto],
                ["Accessories", accessories],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between py-1 text-muted-foreground">
                  <span>{label}</span>
                  <span className="font-medium text-foreground">{inr(Number(value))}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border pt-2 font-display text-base font-bold text-foreground">
                <span>On-road price</span>
                <span>{inr(onRoad)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm text-muted-foreground">
                <span>Balance after advance</span>
                <span className="font-semibold text-primary">{inr(onRoad - advance)}</span>
              </div>
            </div>

            <Button className="w-full" onClick={() => toast.success("Proforma generated and ready to print")}>
              Generate proforma
            </Button>
          </div>
        </Panel>

        <Panel title="Booking register" description="All bookings for September 2026" className="lg:col-span-3">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">On-road</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{b.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.id} · {b.date}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{b.model}</p>
                      <p className="text-xs text-muted-foreground">{b.color}</p>
                    </TableCell>
                    <TableCell className="text-sm">{b.mode}</TableCell>
                    <TableCell className="text-right text-sm">{inr(b.onRoad)}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{inr(b.balance)}</TableCell>
                    <TableCell>
                      <StatusPill label={b.status} tone={statusTone(b.status)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
