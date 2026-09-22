import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, StatCard, StatusPill, statusTone } from "@/components/ui-kit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compliance, inr } from "@/lib/data";
import { ShieldCheck, Receipt, FileSignature, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Insurance & RTO Registration — Srivaari Automobiles" },
      {
        name: "description",
        content:
          "Policy issuance, road tax payment, RTO documentation and registration number assignment.",
      },
      { property: "og:title", content: "Insurance & RTO — Srivaari Automobiles" },
      {
        property: "og:description",
        content: "Compliance tracking from policy issue to registration number.",
      },
    ],
  }),
  component: Insurance,
});

function Insurance() {
  return (
    <AppShell>
      <PageHeader
        title="Insurance & RTO Registration"
        subtitle="Policies, road tax, RTO submissions and registration numbers"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Policies issued"
          value={String(compliance.filter((c) => c.policyStatus === "Issued").length)}
          icon={ShieldCheck}
        />
        <StatCard
          label="Road tax paid"
          value={inr(compliance.filter((c) => c.taxPaid).reduce((s, c) => s + c.roadTax, 0))}
          icon={Receipt}
        />
        <StatCard
          label="At RTO"
          value={String(compliance.filter((c) => c.rtoStage === "Submitted").length)}
          icon={FileSignature}
        />
        <StatCard
          label="Registered"
          value={String(compliance.filter((c) => c.rtoStage === "Registered").length)}
          icon={BadgeCheck}
        />
      </div>

      <div className="mt-6 grid gap-6">
        <Panel title="Compliance tracker" description="One row per delivered or pending vehicle">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking</TableHead>
                  <TableHead>Insurer & policy</TableHead>
                  <TableHead>Policy</TableHead>
                  <TableHead className="text-right">Road tax</TableHead>
                  <TableHead>RTO stage</TableHead>
                  <TableHead>Registration no.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {compliance.map((c) => (
                  <TableRow key={c.booking}>
                    <TableCell>
                      <p className="font-medium text-foreground">{c.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.booking} · {c.model}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{c.insurer}</p>
                      <p className="font-mono text-xs text-muted-foreground">{c.policyNo}</p>
                    </TableCell>
                    <TableCell>
                      <StatusPill label={c.policyStatus} tone={statusTone(c.policyStatus)} />
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {inr(c.roadTax)}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {c.taxPaid ? "paid" : "due"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusPill label={c.rtoStage} tone={statusTone(c.rtoStage)} />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{c.regNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>

        <Panel title="RTO document checklist" description="Standard file for every new registration">
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Form 20 — application",
              "Form 21 — sale certificate",
              "Form 22 — roadworthiness",
              "Invoice copy",
              "Insurance policy copy",
              "Address & ID proof",
              "Road tax receipt",
              "Form 34 — hypothecation (finance)",
              "PUC certificate",
            ].map((d) => (
              <div
                key={d}
                className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground"
              >
                {d}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
