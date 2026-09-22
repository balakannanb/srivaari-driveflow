import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, StatCard } from "@/components/ui-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { daybook, inr, ledgers, monthlySales } from "@/lib/data";
import { Wallet, Landmark, ReceiptIndianRupee, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Showroom Accounts — Srivaari Automobiles" },
      {
        name: "description",
        content:
          "Daily cash and bank daybooks, customer ledger reconciliation, receipt vouchers and monthly summaries.",
      },
      { property: "og:title", content: "Showroom Accounts — Srivaari Automobiles" },
      {
        property: "og:description",
        content: "Daybook, ledgers and monthly financial summary for the showroom.",
      },
    ],
  }),
  component: Accounts,
});

function Accounts() {
  const receipts = daybook.reduce((s, v) => s + v.debit, 0);
  const payments = daybook.reduce((s, v) => s + v.credit, 0);
  const revenue = monthlySales.map((m) => ({
    month: m.month,
    revenue: (m.cash + m.finance) * 120000,
  }));

  return (
    <AppShell>
      <PageHeader
        title="Showroom Accounts"
        subtitle="Daybook, customer ledgers and monthly financial summary"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Receipts today" value={inr(receipts)} icon={Wallet} />
        <StatCard label="Payments today" value={inr(payments)} icon={ReceiptIndianRupee} />
        <StatCard label="Net cash position" value={inr(receipts - payments)} icon={Landmark} />
        <StatCard
          label="Outstanding from customers"
          value={inr(ledgers.reduce((s, l) => s + l.balance, 0))}
          icon={TrendingUp}
        />
      </div>

      <div className="mt-6">
        <Panel title="Monthly revenue trend" description="Estimated retail turnover">
          <div className="h-64 p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(v) => `${Math.round(Number(v) / 100000)}L`}
                />
                <Tooltip
                  formatter={(v) => inr(Number(v))}
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Tabs defaultValue="daybook" className="mt-6">
        <TabsList>
          <TabsTrigger value="daybook">Daybook</TabsTrigger>
          <TabsTrigger value="ledger">Customer ledgers</TabsTrigger>
        </TabsList>

        <TabsContent value="daybook" className="mt-4">
          <Panel title="Cash & bank daybook" description="22 September 2026">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voucher</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Narration</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                    <TableHead className="text-right">Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {daybook.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell>
                        <p className="font-mono text-xs">{v.id}</p>
                        <p className="text-xs text-muted-foreground">{v.date}</p>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{v.party}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.narration}</TableCell>
                      <TableCell className="text-sm">{v.mode}</TableCell>
                      <TableCell className="text-right text-sm text-success">
                        {v.debit ? inr(v.debit) : "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm text-destructive">
                        {v.credit ? inr(v.credit) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="ledger" className="mt-4">
          <Panel title="Customer ledger reconciliation" description="Billed vs received vs financed">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Booking</TableHead>
                    <TableHead className="text-right">Billed</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                    <TableHead className="text-right">Financed</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgers.map((l) => (
                    <TableRow key={l.booking}>
                      <TableCell className="text-sm font-medium">{l.customer}</TableCell>
                      <TableCell className="font-mono text-xs">{l.booking}</TableCell>
                      <TableCell className="text-right text-sm">{inr(l.billed)}</TableCell>
                      <TableCell className="text-right text-sm">{inr(l.received)}</TableCell>
                      <TableCell className="text-right text-sm">{inr(l.financed)}</TableCell>
                      <TableCell className="text-right text-sm font-semibold">
                        {inr(l.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
