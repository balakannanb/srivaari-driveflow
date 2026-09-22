import { useState } from "react";
import { Lock, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard, PageHeader, StatusBadge } from "@/components/shared";
import { SelectField, TextField } from "@/components/form-kit";
import { formatCurrency, staffRoles } from "@/lib/domain";
import { branches } from "@/lib/masters";
import { useSession } from "@/lib/branch-context";
import { useStore } from "@/lib/store";

type MasterKey = "dealers" | "staff" | "partners" | "insuranceProviders" | "financeProviders";
type FieldSpec = { key: string; label: string; type?: "text" | "select" | "number"; options?: string[] };

const specs: Record<MasterKey, { title: string; description: string; prefix: string; columns: { key: string; label: string }[]; fields: FieldSpec[] }> = {
  dealers: {
    title: "Dealers", description: "Companies and persons the showroom purchases vehicles from.", prefix: "DLR",
    columns: [{ key: "name", label: "Dealer" }, { key: "contactPerson", label: "Contact" }, { key: "phone", label: "Phone" }, { key: "gst", label: "GST" }, { key: "status", label: "Status" }],
    fields: [{ key: "name", label: "Dealer name" }, { key: "contactPerson", label: "Contact person" }, { key: "phone", label: "Phone" }, { key: "email", label: "Email" }, { key: "address", label: "Address" }, { key: "gst", label: "GST / Tax number" }, { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }, { key: "remarks", label: "Remarks" }],
  },
  staff: {
    title: "Staff", description: "Showroom team members, their branch and role.", prefix: "STF",
    columns: [{ key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "branchId", label: "Branch" }, { key: "phone", label: "Phone" }, { key: "status", label: "Status" }],
    fields: [{ key: "name", label: "Name" }, { key: "phone", label: "Phone" }, { key: "email", label: "Email" }, { key: "address", label: "Address" }, { key: "role", label: "Role", type: "select", options: staffRoles }, { key: "branchId", label: "Branch", type: "select", options: branches.map((branch) => branch.id) }, { key: "joiningDate", label: "Joining date" }, { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }],
  },
  partners: {
    title: "Partners", description: "Investors and co-founders of the business.", prefix: "PTR",
    columns: [{ key: "name", label: "Partner" }, { key: "share", label: "Share" }, { key: "investment", label: "Investment" }, { key: "since", label: "Since" }, { key: "status", label: "Status" }],
    fields: [{ key: "name", label: "Name" }, { key: "phone", label: "Phone" }, { key: "email", label: "Email" }, { key: "address", label: "Address" }, { key: "since", label: "Partner since" }, { key: "investment", label: "Investment (₹)", type: "number" }, { key: "share", label: "Ownership share" }, { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }, { key: "remarks", label: "Remarks" }],
  },
  insuranceProviders: {
    title: "Insurance Providers", description: "Insurers selected on every insurance transaction.", prefix: "INP",
    columns: [{ key: "name", label: "Provider" }, { key: "contactPerson", label: "Contact" }, { key: "phone", label: "Phone" }, { key: "details", label: "Policy details" }, { key: "status", label: "Status" }],
    fields: [{ key: "name", label: "Provider name" }, { key: "contactPerson", label: "Contact person" }, { key: "phone", label: "Phone" }, { key: "email", label: "Email" }, { key: "address", label: "Address" }, { key: "details", label: "Policy / service details" }, { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }, { key: "remarks", label: "Remarks" }],
  },
  financeProviders: {
    title: "Finance Providers", description: "NBFCs and banks used for customer finance.", prefix: "FNP",
    columns: [{ key: "name", label: "Provider" }, { key: "contactPerson", label: "Contact" }, { key: "phone", label: "Phone" }, { key: "details", label: "Scheme details" }, { key: "status", label: "Status" }],
    fields: [{ key: "name", label: "Finance provider name" }, { key: "contactPerson", label: "Contact person" }, { key: "phone", label: "Phone" }, { key: "email", label: "Email" }, { key: "address", label: "Branch / contact details" }, { key: "details", label: "Scheme details" }, { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }, { key: "remarks", label: "Remarks" }],
  },
};

function MasterTable({ masterKey }: { masterKey: MasterKey }) {
  const store = useStore();
  const spec = specs[masterKey];
  const rows = store[masterKey] as unknown as Record<string, string | number>[];
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const save = () => {
    if (!draft["name"]) { toast.error("Enter a name"); return; }
    const record: Record<string, string | number> = { id: `${spec.prefix}-${String(rows.length + 1).padStart(2, "0")}`, ...draft };
    if (masterKey === "partners") record["investment"] = Number(draft["investment"] ?? 0);
    if (!record["status"]) record["status"] = "Active";
    store.saveMaster(masterKey, record as never);
    setDraft({});
    setOpen(false);
    toast.success(`${draft["name"]} added to ${spec.title}`);
  };

  return <GlassCard className="overflow-hidden">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 p-4">
      <div><h2 className="font-display text-lg font-bold">{spec.title}</h2><p className="text-sm text-muted-foreground">{spec.description}</p></div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button size="sm"><Plus/> Add</Button></DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add to {spec.title}</DialogTitle></DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {spec.fields.map((field) => field.type === "select"
              ? <SelectField key={field.key} label={field.label} value={draft[field.key] ?? ""} onChange={(value) => setDraft((current) => ({ ...current, [field.key]: value }))} options={(field.options ?? []).map((value) => ({ value, label: masterKey === "staff" && field.key === "branchId" ? branches.find((branch) => branch.id === value)?.name ?? value : value }))}/>
              : <TextField key={field.key} label={field.label} type={field.type === "number" ? "number" : "text"} value={draft[field.key] ?? ""} onChange={(value) => setDraft((current) => ({ ...current, [field.key]: value }))}/>)}
          </div>
          <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground"><tr>{spec.columns.map((column) => <th key={column.key} className="px-5 py-3.5">{column.label}</th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={String(row["id"])} className="border-t border-border/55 hover:bg-primary-soft/40">
          {spec.columns.map((column) => <td key={column.key} className="px-5 py-4 text-sm">
            {column.key === "status" ? <StatusBadge status={String(row["status"])}/>
              : column.key === "branchId" ? branches.find((branch) => branch.id === row["branchId"])?.name ?? "—"
              : column.key === "investment" ? formatCurrency(Number(row["investment"] ?? 0))
              : column.key === "name" ? <span className="font-semibold text-foreground">{String(row[column.key] ?? "—")}</span>
              : String(row[column.key] ?? "—")}
          </td>)}
        </tr>)}</tbody>
      </table>
    </div>
  </GlassCard>;
}

export function MastersPage() {
  const session = useSession();
  if (!session.isOwner) return <div className="mx-auto max-w-xl">
    <GlassCard className="p-10 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-xl bg-destructive-soft text-destructive"><Lock/></span>
      <h1 className="mt-5 font-display text-2xl font-bold">Owner access only</h1>
      <p className="mt-2 text-sm text-muted-foreground">Staff, partners, providers and branch configuration are restricted to the business owner.</p>
    </GlassCard>
  </div>;

  return <div className="space-y-6">
    <PageHeader title="Masters" description="Owner-only configuration: branches, dealers, staff, partners and service providers."/>
    <Tabs defaultValue="branches">
      <TabsList className="max-w-full justify-start overflow-x-auto">
        <TabsTrigger value="branches">Branches</TabsTrigger>
        <TabsTrigger value="dealers">Dealers</TabsTrigger>
        <TabsTrigger value="staff">Staff</TabsTrigger>
        <TabsTrigger value="partners">Partners</TabsTrigger>
        <TabsTrigger value="insuranceProviders">Insurance Providers</TabsTrigger>
        <TabsTrigger value="financeProviders">Finance Providers</TabsTrigger>
      </TabsList>
      <TabsContent value="branches" className="mt-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{branches.map((branch) => <GlassCard key={branch.id} className="p-5">
          <div className="flex items-start justify-between"><div><h2 className="font-display text-lg font-bold">{branch.name}</h2><p className="text-sm text-muted-foreground">{branch.code} · {branch.city}</p></div><StatusBadge status={branch.status}/></div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{branch.address}</p>
          <p className="mt-2 text-sm font-semibold">{branch.phone}</p>
        </GlassCard>)}</div>
      </TabsContent>
      {(["dealers", "staff", "partners", "insuranceProviders", "financeProviders"] as MasterKey[]).map((key) => <TabsContent key={key} value={key} className="mt-5"><MasterTable masterKey={key}/></TabsContent>)}
    </Tabs>
  </div>;
}
