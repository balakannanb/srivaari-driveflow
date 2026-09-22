import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IndianRupee, Users, Boxes, Truck, ArrowRight } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, StatCard, StatusPill, statusTone } from "@/components/ui-kit";
import { bookings, enquiries, inr, loans, monthlySales, stock } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — Srivaari Automobiles" },
      {
        name: "description",
        content:
          "Live showroom KPIs for Srivaari Automobiles: enquiries, bookings, finance pipeline, stock and deliveries.",
      },
      { property: "og:title", content: "Executive Dashboard — Srivaari Automobiles" },
      {
        property: "og:description",
        content: "Real-time bike showroom and finance operations at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const pipeline = loans.filter((l) => l.stage !== "Disbursed");
  return (
    <AppShell>
      <PageHeader
        title="Executive Dashboard"
        subtitle="Monday, 22 September 2026 · Main Showroom, Madurai"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open enquiries" value="38" delta="+12% vs last week" icon={Users} />
        <StatCard label="Bookings this month" value="94" delta="+9 vs August" icon={Truck} />
        <StatCard label="Finance disbursed" value={inr(4820000)} delta="61 cases" icon={IndianRupee} />
        <StatCard label="Stock on hand" value="126 units" delta="18 ageing > 30 days" icon={Boxes} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel
          title="Cash vs finance sales"
          description="Units retailed per month"
          className="lg:col-span-2"
        >
          <div className="h-72 p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="cash" name="Cash" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="finance" name="Finance" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Finance pipeline" description="NBFC cases awaiting disbursement">
          <ul className="divide-y divide-border">
            {pipeline.map((loan) => (
              <li key={loan.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{loan.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    {loan.nbfc} · {inr(loan.amount)}
                  </p>
                </div>
                <StatusPill label={loan.stage} tone={statusTone(loan.stage)} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Latest enquiries"
          description="Leads captured in the last 48 hours"
          action={
            <Link to="/enquiries" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              View all <ArrowRight className="size-4" />
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {enquiries.slice(0, 4).map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{e.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.model} · {e.interest} · {e.executive}
                  </p>
                </div>
                <StatusPill label={e.status} tone={statusTone(e.status)} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Bookings awaiting action"
          description="Allotment, finance and delivery follow-ups"
          action={
            <Link to="/bookings" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              View all <ArrowRight className="size-4" />
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {bookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {b.customer} · {b.model}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {b.id} · balance {inr(b.balance)}
                  </p>
                </div>
                <StatusPill label={b.status} tone={statusTone(b.status)} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Ageing stock alert" description="Units in yard for more than 30 days">
          <ul className="divide-y divide-border">
            {stock
              .filter((s) => s.ageDays > 30)
              .map((s) => (
                <li key={s.chassis} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {s.model} · {s.color}
                    </p>
                    <p className="text-xs text-muted-foreground">Chassis {s.chassis}</p>
                  </div>
                  <StatusPill label={`${s.ageDays} days`} tone="warning" />
                </li>
              ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
