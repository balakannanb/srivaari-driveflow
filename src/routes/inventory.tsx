import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, StatCard, StatusPill, statusTone } from "@/components/ui-kit";
import { Input } from "@/components/ui/input";
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
import { stock } from "@/lib/data";
import { Boxes, Warehouse, Timer, PackageCheck } from "lucide-react";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory Management — Srivaari Automobiles" },
      {
        name: "description",
        content:
          "Showroom and yard stock with chassis and engine numbers, ageing and booking allocation.",
      },
      { property: "og:title", content: "Inventory Management — Srivaari Automobiles" },
      {
        property: "og:description",
        content: "Track every unit from yard arrival to booking allotment.",
      },
    ],
  }),
  component: Inventory,
});

function Inventory() {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("All");

  const rows = useMemo(
    () =>
      stock.filter(
        (s) =>
          (loc === "All" || s.location === loc) &&
          (s.chassis.toLowerCase().includes(q.toLowerCase()) ||
            s.model.toLowerCase().includes(q.toLowerCase()) ||
            s.engine.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, loc],
  );

  return (
    <AppShell>
      <PageHeader
        title="Inventory Management"
        subtitle="Showroom, yard and in-transit stock with allocation to confirmed bookings"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total units" value={String(stock.length)} icon={Boxes} />
        <StatCard
          label="Available"
          value={String(stock.filter((s) => s.status === "Available").length)}
          icon={PackageCheck}
        />
        <StatCard
          label="In yard"
          value={String(stock.filter((s) => s.location === "Yard").length)}
          icon={Warehouse}
        />
        <StatCard
          label="Ageing > 30 days"
          value={String(stock.filter((s) => s.ageDays > 30).length)}
          icon={Timer}
        />
      </div>

      <div className="mt-6">
        <Panel
          title="Stock register"
          description="Search by chassis, engine or model"
          action={
            <div className="flex gap-2">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search chassis / model"
                className="w-52"
              />
              <Select value={loc} onValueChange={setLoc}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["All", "Showroom", "Yard", "Transit"].map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Chassis no.</TableHead>
                  <TableHead>Engine no.</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Ageing</TableHead>
                  <TableHead>Allotted to</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.chassis}>
                    <TableCell>
                      <p className="font-medium text-foreground">{s.model}</p>
                      <p className="text-xs text-muted-foreground">{s.color}</p>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{s.chassis}</TableCell>
                    <TableCell className="font-mono text-xs">{s.engine}</TableCell>
                    <TableCell className="text-sm">{s.location}</TableCell>
                    <TableCell className="text-sm">
                      <span className={s.ageDays > 30 ? "font-semibold text-warning-foreground" : ""}>
                        {s.ageDays} days
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{s.allottedTo ?? "—"}</TableCell>
                    <TableCell>
                      <StatusPill label={s.status} tone={statusTone(s.status)} />
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
