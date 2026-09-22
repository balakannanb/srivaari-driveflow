import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, StatCard, StatusPill, statusTone } from "@/components/ui-kit";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { branches, inr, models, users } from "@/lib/data";
import { Building2, Bike, UserCog, Tags } from "lucide-react";

export const Route = createFileRoute("/masters")({
  head: () => ({
    meta: [
      { title: "Masters & User Roles — Srivaari Automobiles" },
      {
        name: "description",
        content:
          "Branch management, model and pricing master catalogue, and showroom user role administration.",
      },
      { property: "og:title", content: "Masters & User Roles — Srivaari Automobiles" },
      {
        property: "og:description",
        content: "Configure branches, model pricing and staff access in one place.",
      },
    ],
  }),
  component: Masters,
});

function Masters() {
  return (
    <AppShell>
      <PageHeader
        title="Masters & User Roles"
        subtitle="Branches, model pricing catalogue and staff access control"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Branches" value={String(branches.length)} icon={Building2} />
        <StatCard label="Models in catalogue" value={String(models.length)} icon={Bike} />
        <StatCard label="Active users" value={String(users.filter((u) => u.status === "Active").length)} icon={UserCog} />
        <StatCard label="Price lists" value="FY 2026-27" icon={Tags} />
      </div>

      <div className="mt-6 grid gap-6">
        <Panel title="Model & pricing master" description="Ex-showroom, insurance and RTO components">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Colours</TableHead>
                  <TableHead className="text-right">Ex-showroom</TableHead>
                  <TableHead className="text-right">Insurance</TableHead>
                  <TableHead className="text-right">RTO</TableHead>
                  <TableHead className="text-right">On-road</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.variant}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {m.colors.map((c) => (
                          <Badge key={c} variant="secondary">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{inr(m.exShowroom)}</TableCell>
                    <TableCell className="text-right text-sm">{inr(m.insurance)}</TableCell>
                    <TableCell className="text-right text-sm">{inr(m.rto)}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">
                      {inr(m.exShowroom + m.insurance + m.rto)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Branches" description="Showroom locations and managers">
            <ul className="divide-y divide-border">
              {branches.map((b) => (
                <li key={b.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.city} · Manager {b.manager}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{b.id}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Users & roles" description="Access is scoped per branch">
            <ul className="divide-y divide-border">
              {users.map((u) => (
                <li key={u.name} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.role} · {u.branch}
                    </p>
                  </div>
                  <StatusPill label={u.status} tone={statusTone(u.status)} />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
