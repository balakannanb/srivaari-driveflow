import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
import { enquiries as seed, models, type Enquiry } from "@/lib/data";
import { Users, PhoneCall, Bike, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries & CRM — Srivaari Automobiles" },
      {
        name: "description",
        content:
          "Capture walk-ins, test-ride bookings and model preferences, then convert leads into bookings.",
      },
      { property: "og:title", content: "Enquiries & CRM — Srivaari Automobiles" },
      {
        property: "og:description",
        content: "Showroom lead capture, follow-ups and lead-to-booking conversion.",
      },
    ],
  }),
  component: Enquiries,
});

function Enquiries() {
  const [rows, setRows] = useState<Enquiry[]>(seed);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    model: models[0]!.name,
    interest: "Finance",
    source: "Walk-in",
  });

  const visible = useMemo(
    () => (filter === "All" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );

  const addLead = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Customer name and phone number are required");
      return;
    }
    const lead: Enquiry = {
      id: `ENQ-${2042 + rows.length - seed.length}`,
      name: form.name,
      phone: form.phone,
      source: form.source,
      model: form.model,
      interest: form.interest as Enquiry["interest"],
      testRide: "—",
      followUp: "Tomorrow",
      status: "New",
      executive: "Priya",
    };
    setRows([lead, ...rows]);
    setForm({ ...form, name: "", phone: "" });
    toast.success(`${lead.name} added to the enquiry register`);
  };

  const convert = (id: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, status: "Converted" } : r)));
    toast.success("Lead converted — booking draft created with the same details");
  };

  return (
    <AppShell>
      <PageHeader
        title="Enquiries & CRM"
        subtitle="Walk-ins, calls and digital leads with test-ride and follow-up tracking"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total leads" value={String(rows.length)} icon={Users} />
        <StatCard
          label="Follow-ups due"
          value={String(rows.filter((r) => r.followUp !== "—").length)}
          icon={PhoneCall}
        />
        <StatCard
          label="Test rides booked"
          value={String(rows.filter((r) => r.testRide !== "—").length)}
          icon={Bike}
        />
        <StatCard
          label="Converted"
          value={String(rows.filter((r) => r.status === "Converted").length)}
          icon={CheckCircle2}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="New enquiry" description="Capture once, reuse at booking">
          <div className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Customer name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Arun Kumar"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Mobile number</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="98430 11245"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Model of interest</Label>
              <Select value={form.model} onValueChange={(v) => setForm({ ...form, model: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.name}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Purchase mode</Label>
                <Select
                  value={form.interest}
                  onValueChange={(v) => setForm({ ...form, interest: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Walk-in", "Phone", "Referral", "Instagram", "Exchange mela"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full" onClick={addLead}>
              Save enquiry
            </Button>
          </div>
        </Panel>

        <Panel
          title="Enquiry register"
          description="Click convert to carry details into a booking"
          className="lg:col-span-2"
          action={
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["All", "New", "Contacted", "Test Ride", "Converted", "Lost"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Test ride</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.phone} · {r.source}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{r.model}</p>
                      <p className="text-xs text-muted-foreground">{r.interest}</p>
                    </TableCell>
                    <TableCell className="text-sm">{r.testRide}</TableCell>
                    <TableCell className="text-sm">{r.followUp}</TableCell>
                    <TableCell>
                      <StatusPill label={r.status} tone={statusTone(r.status)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={r.status === "Converted" || r.status === "Lost"}
                        onClick={() => convert(r.id)}
                      >
                        Convert
                      </Button>
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
