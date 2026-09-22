import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, StatCard, StatusPill, statusTone } from "@/components/ui-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { loans as seed, inr, type Loan } from "@/lib/data";
import { Banknote, FileCheck2, Clock, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Finance & Refinance Hub — Srivaari Automobiles" },
      {
        name: "description",
        content:
          "Track NBFC loan applications, document checklists, approvals, disbursements and used-bike refinance cases.",
      },
      { property: "og:title", content: "Finance & Refinance Hub — Srivaari Automobiles" },
      {
        property: "og:description",
        content: "NBFC pipeline from login to disbursement, including refinance workflow.",
      },
    ],
  }),
  component: Finance,
});

const stages: Loan["stage"][] = ["Login", "Documents", "Approved", "DO Issued", "Disbursed"];

function Finance() {
  const [loans, setLoans] = useState<Loan[]>(seed);

  const toggleDoc = (loanId: string, label: string) =>
    setLoans(
      loans.map((l) =>
        l.id === loanId
          ? { ...l, docs: l.docs.map((d) => (d.label === label ? { ...d, done: !d.done } : d)) }
          : l,
      ),
    );

  const cards = (type: Loan["type"]) =>
    loans
      .filter((l) => l.type === type)
      .map((loan) => {
        const done = loan.docs.filter((d) => d.done).length;
        const pct = Math.round((done / loan.docs.length) * 100);
        return (
          <div key={loan.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  {loan.customer}
                </p>
                <p className="text-xs text-muted-foreground">
                  {loan.id} · {loan.nbfc} · {loan.tenure}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-bold text-foreground">{inr(loan.amount)}</p>
                <StatusPill label={loan.stage} tone={statusTone(loan.stage)} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {stages.map((s) => {
                const reached = stages.indexOf(s) <= stages.indexOf(loan.stage);
                return (
                  <div key={s} className="flex-1">
                    <div
                      className={`h-1.5 rounded-full ${reached ? "bg-primary" : "bg-muted"}`}
                    />
                    <p className="mt-1 text-[10px] text-muted-foreground">{s}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Document checklist</span>
                <span>
                  {done}/{loan.docs.length} collected
                </span>
              </div>
              <Progress value={pct} className="h-1.5" />
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {loan.docs.map((d) => (
                  <label key={d.label} className="flex items-center gap-2 text-sm text-foreground">
                    <Checkbox checked={d.done} onCheckedChange={() => toggleDoc(loan.id, d.label)} />
                    {d.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      });

  return (
    <AppShell>
      <PageHeader
        title="Finance & Refinance Hub"
        subtitle="NBFC applications, document checklists, approvals and disbursements"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Live cases" value={String(loans.length)} icon={Banknote} />
        <StatCard
          label="Approved / DO issued"
          value={String(loans.filter((l) => ["Approved", "DO Issued"].includes(l.stage)).length)}
          icon={FileCheck2}
        />
        <StatCard
          label="Awaiting documents"
          value={String(loans.filter((l) => l.stage === "Documents" || l.stage === "Login").length)}
          icon={Clock}
        />
        <StatCard
          label="Refinance cases"
          value={String(loans.filter((l) => l.type === "Refinance").length)}
          icon={RefreshCcw}
        />
      </div>

      <Tabs defaultValue="new" className="mt-6">
        <TabsList>
          <TabsTrigger value="new">New bike loans</TabsTrigger>
          <TabsTrigger value="refi">Used bike refinance</TabsTrigger>
        </TabsList>
        <TabsContent value="new" className="mt-4 grid gap-4 xl:grid-cols-2">
          {cards("New")}
        </TabsContent>
        <TabsContent value="refi" className="mt-4 grid gap-4 xl:grid-cols-2">
          {cards("Refinance")}
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Panel title="NBFC partners" description="Payout and turnaround performance">
          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Bajaj Finance", tat: "6 hrs", payout: "3.2%", cases: 28 },
              { name: "TVS Credit", tat: "9 hrs", payout: "2.8%", cases: 19 },
              { name: "Hero FinCorp", tat: "1 day", payout: "2.5%", cases: 11 },
              { name: "Shriram Finance", tat: "2 days", payout: "3.6%", cases: 8 },
            ].map((n) => (
              <div key={n.name} className="rounded-xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold text-foreground">{n.name}</p>
                <p className="mt-2 text-xs text-muted-foreground">Avg. approval {n.tat}</p>
                <p className="text-xs text-muted-foreground">Payout {n.payout}</p>
                <p className="mt-2 font-display text-xl font-bold text-primary">{n.cases}</p>
                <p className="text-[11px] text-muted-foreground">cases this month</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
