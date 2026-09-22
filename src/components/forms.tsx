import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Search, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard, PageHeader } from "@/components/shared";
import { ProformaForm } from "@/components/proforma-form";
import { BookingForm } from "@/components/booking-form";
import { expenseCategories, incomeCategories, type LedgerEntry, type RecordRow, type Vehicle } from "@/lib/domain";
import { branches } from "@/lib/masters";
import { useSession } from "@/lib/branch-context";
import { nextId, useStore } from "@/lib/store";

type FieldType = "text" | "tel" | "email" | "date" | "number" | "select" | "textarea";
type FieldDef = { name: string; label: string; type?: FieldType; placeholder?: string; options?: string[]; required?: boolean; full?: boolean };
type Section = { title: string; description?: string; fields: FieldDef[] };

export type FormModule =
  | "customer" | "followup" | "proforma" | "booking" | "vehicle"
  | "finance" | "refinance" | "insurance" | "registration" | "delivery" | "transaction";

type ListTo =
  | "/customers" | "/followups" | "/proforma" | "/bookings" | "/inventory"
  | "/finance/applications" | "/finance/refinance" | "/insurance" | "/registration" | "/deliveries" | "/accounts";

const paymentModes = ["Cash", "UPI", "Bank Transfer", "Card", "Cheque"];
const rtoOffices = ["TN-09 Chennai Central", "TN-13 Ambattur", "TN-10 Chennai North", "TN-22 Sholinganallur", "TN-85 Poonamallee"];

const customerSection: Section = {
  title: "Customer",
  description: "Search an existing customer — details carry to every later stage.",
  fields: [
    { name: "customerPhone", label: "Customer phone", type: "tel", placeholder: "10-digit mobile number", required: true },
    { name: "customerName", label: "Customer name", placeholder: "Full name", required: true },
  ],
};

const moduleConfig: Record<FormModule, { singular: string; listTo: ListTo; recordKey: string; idPrefix: string; sections: Section[] }> = {
  customer: {
    singular: "Customer", listTo: "/customers", recordKey: "", idPrefix: "CUS",
    sections: [
      { title: "Personal information", fields: [
        { name: "name", label: "Full name", required: true, placeholder: "Enter customer name" },
        { name: "phone", label: "Phone number", type: "tel", required: true, placeholder: "10-digit mobile number" },
        { name: "email", label: "Email", type: "email", placeholder: "name@example.com" },
        { name: "dob", label: "Date of birth", type: "date" },
      ] },
      { title: "Address & identification", fields: [
        { name: "address", label: "Address", placeholder: "Door number, street and area", full: true },
        { name: "city", label: "City / area", placeholder: "Velachery, Chennai" },
        { name: "idType", label: "ID type", type: "select", options: ["Aadhaar", "PAN", "Driving Licence", "Voter ID"] },
        { name: "idNumber", label: "ID number", placeholder: "Enter document number" },
        { name: "notes", label: "Notes", type: "textarea", placeholder: "Optional remarks", full: true },
      ] },
    ],
  },
  followup: {
    singular: "Follow-up", listTo: "/followups", recordKey: "followups", idPrefix: "FU",
    sections: [customerSection, { title: "Follow-up details", description: "Follow-ups are made for customers who already have a proforma invoice.", fields: [
      { name: "proforma", label: "Proforma invoice", type: "select", options: [], required: true },
      { name: "mode", label: "Contact mode", type: "select", options: ["Phone call", "WhatsApp", "Showroom visit", "Home visit"] },
      { name: "followUp", label: "Next follow-up date", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Open", "Follow-up Due", "Converted", "Lost"] },
      { name: "remarks", label: "Discussion notes", type: "textarea", placeholder: "What the customer said", full: true },
    ] }],
  },
  proforma: { singular: "Proforma Invoice", listTo: "/proforma", recordKey: "proforma", idPrefix: "PI", sections: [] },
  booking: { singular: "Booking", listTo: "/bookings", recordKey: "bookings", idPrefix: "BK", sections: [] },
  vehicle: {
    singular: "Vehicle", listTo: "/inventory", recordKey: "", idPrefix: "VEH",
    sections: [{ title: "Vehicle details", fields: [
      { name: "model", label: "Model", required: true, placeholder: "TVS Jupiter" },
      { name: "variant", label: "Variant", placeholder: "ZX SmartXonnect" },
      { name: "colour", label: "Colour", placeholder: "Starlight Blue" },
      { name: "chassis", label: "Chassis number", required: true, placeholder: "MD626AG48R1K42175" },
      { name: "engine", label: "Engine number", placeholder: "AG4KR184921" },
      { name: "branch", label: "Branch", type: "select", options: [] },
    ] }, { title: "Dealer, stock & pricing", fields: [
      { name: "dealer", label: "Dealer", type: "select", options: [], required: true },
      { name: "receivedOn", label: "Stock received on", type: "date" },
      { name: "purchasePrice", label: "Purchase price", type: "number", placeholder: "95800" },
      { name: "sellingPrice", label: "Selling price", type: "number", placeholder: "108450" },
      { name: "status", label: "Status", type: "select", options: ["Available", "Reserved", "Booked", "In Transit", "Delivered"] },
    ] }],
  },
  finance: {
    singular: "Finance Application", listTo: "/finance/applications", recordKey: "finance", idPrefix: "FIN",
    sections: [customerSection, { title: "Loan details", fields: [
      { name: "booking", label: "Linked booking", type: "select", options: [] },
      { name: "partner", label: "Finance provider", type: "select", options: [], required: true },
      { name: "loanAmount", label: "Loan amount", type: "number", placeholder: "78000" },
      { name: "downPayment", label: "Down payment", type: "number", placeholder: "30450" },
      { name: "tenure", label: "Tenure (months)", type: "select", options: ["12", "18", "24", "36", "48"] },
      { name: "emi", label: "Monthly EMI", type: "number", placeholder: "4120" },
      { name: "status", label: "Status", type: "select", options: ["Submitted", "Under Review", "Approved", "Rejected", "Disbursed"] },
      { name: "documents", label: "Documents pending", type: "textarea", placeholder: "Aadhaar, PAN, bank statement...", full: true },
    ] }],
  },
  refinance: {
    singular: "Refinance", listTo: "/finance/refinance", recordKey: "refinance", idPrefix: "REF",
    sections: [customerSection, { title: "Existing finance", fields: [
      { name: "currentPartner", label: "Current financier", type: "select", options: [] },
      { name: "outstanding", label: "Outstanding amount", type: "number", placeholder: "64000" },
      { name: "vehicleNumber", label: "Vehicle number", placeholder: "TN 09 BK 4821" },
      { name: "existingEmi", label: "Existing EMI", type: "number", placeholder: "3800" },
    ] }, { title: "New finance", fields: [
      { name: "newPartner", label: "New financier", type: "select", options: [] },
      { name: "newAmount", label: "Requested amount", type: "number", placeholder: "90000" },
      { name: "tenure", label: "Tenure (months)", type: "select", options: ["12", "18", "24", "36", "48"] },
      { name: "status", label: "Status", type: "select", options: ["Documents Pending", "Submitted", "Approved", "Rejected", "Disbursed"] },
    ] }],
  },
  insurance: {
    singular: "Insurance", listTo: "/insurance", recordKey: "insurance", idPrefix: "INS",
    sections: [customerSection, { title: "Policy details", fields: [
      { name: "booking", label: "Linked booking", type: "select", options: [] },
      { name: "provider", label: "Insurance provider", type: "select", options: [], required: true },
      { name: "policyType", label: "Policy type", type: "select", options: ["Comprehensive", "Third party", "Own damage"] },
      { name: "policyNumber", label: "Policy number", placeholder: "UII/2026/8891245" },
      { name: "premium", label: "Premium amount", type: "number", placeholder: "6840" },
      { name: "startDate", label: "Start date", type: "date" },
      { name: "endDate", label: "Expiry date", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Requested", "Quote Received", "Policy Issued", "Expired"] },
    ] }],
  },
  registration: {
    singular: "Registration", listTo: "/registration", recordKey: "registration", idPrefix: "REG",
    sections: [customerSection, { title: "RTO details", fields: [
      { name: "booking", label: "Linked booking", type: "select", options: [] },
      { name: "rto", label: "RTO office", type: "select", options: rtoOffices, required: true },
      { name: "applicationNumber", label: "Application number", placeholder: "TN09/2026/89142" },
      { name: "appliedOn", label: "Applied on", type: "date" },
      { name: "fees", label: "Registration fees", type: "number", placeholder: "4200" },
      { name: "vehicleNumber", label: "Allotted number", placeholder: "TN 09 BM 4821" },
      { name: "status", label: "Status", type: "select", options: ["Documents Pending", "Submitted", "Processing", "Number Allotted", "Completed"] },
    ] }],
  },
  delivery: {
    singular: "Delivery", listTo: "/deliveries", recordKey: "deliveries", idPrefix: "DEL",
    sections: [customerSection, { title: "Handover details", fields: [
      { name: "booking", label: "Linked booking", type: "select", options: [], required: true },
      { name: "date", label: "Delivery date", type: "date" },
      { name: "time", label: "Delivery time", placeholder: "11:30 AM" },
      { name: "deliveredBy", label: "Delivered by", placeholder: "Kannan" },
      { name: "status", label: "Status", type: "select", options: ["Scheduled", "Ready", "Blocked", "Delivered"] },
      { name: "accessories", label: "Accessories handed over", type: "textarea", full: true },
    ] }],
  },
  transaction: {
    singular: "Transaction", listTo: "/accounts", recordKey: "", idPrefix: "TXN",
    sections: [{ title: "Transaction", fields: [
      { name: "type", label: "Entry type", type: "select", options: ["Income", "Expense"], required: true },
      { name: "category", label: "Category", type: "select", options: [], required: true },
      { name: "amount", label: "Amount", type: "number", placeholder: "18500", required: true },
      { name: "mode", label: "Payment mode", type: "select", options: paymentModes },
      { name: "date", label: "Date", type: "date" },
      { name: "booking", label: "Linked booking", type: "select", options: [] },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ] }],
  },
};

function Field({ field, value, onChange }: { field: FieldDef; value: string; onChange: (next: string) => void }) {
  return <div className={field.full ? "grid gap-2 md:col-span-2" : "grid gap-2"}>
    <span className="text-sm font-semibold text-foreground">{field.label}{field.required && <span className="ml-1 text-destructive">*</span>}</span>
    {field.type === "select" ? (
      <Select {...(value ? { value } : {})} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder={`Select ${field.label.toLowerCase()}`}/></SelectTrigger>
        <SelectContent>{(field.options ?? []).map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
      </Select>
    ) : field.type === "textarea" ? (
      <Textarea value={value} placeholder={field.placeholder ?? ""} onChange={(event) => onChange(event.target.value)} rows={3}/>
    ) : (
      <Input type={field.type ?? "text"} value={value} placeholder={field.placeholder ?? ""} required={field.required ?? false} onChange={(event) => onChange(event.target.value)}/>
    )}
  </div>;
}

export function RecordFormPage({ module, mode = "new", id }: { module: FormModule; mode?: "new" | "edit"; id?: string }) {
  if (module === "proforma") return <ProformaForm mode={mode} {...(id ? { id } : {})}/>;
  if (module === "booking") return <BookingForm mode={mode} {...(id ? { id } : {})}/>;
  return <GenericForm module={module} mode={mode} {...(id ? { id } : {})}/>;
}

function GenericForm({ module, mode, id }: { module: FormModule; mode: "new" | "edit"; id?: string }) {
  const config = moduleConfig[module];
  const navigate = useNavigate();
  const session = useSession();
  const store = useStore();
  const [values, setValues] = useState<Record<string, string>>({});
  const [lookup, setLookup] = useState("");

  const branchId = session.scopeId ?? branches[0]!.id;
  const scopedBookings = store.bookings.filter((booking) => session.inScope(booking.branchId));
  const scopedProformas = store.proformas.filter((entry) => session.inScope(entry.branchId));

  const optionsFor = (name: string): string[] | null => {
    if (name === "dealer") return store.dealers.map((dealer) => dealer.name);
    if (name === "branch") return branches.map((branch) => branch.name);
    if (name === "provider") return store.insuranceProviders.map((entry) => entry.name);
    if (name === "partner" || name === "newPartner" || name === "currentPartner") return store.financeProviders.map((entry) => entry.name);
    if (name === "booking") return scopedBookings.map((booking) => booking.id);
    if (name === "proforma") return scopedProformas.map((entry) => entry.id);
    if (name === "category") return values["type"] === "Expense" ? expenseCategories : incomeCategories;
    return null;
  };

  const sections = useMemo(() => config.sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => {
      const dynamic = optionsFor(field.name);
      return dynamic ? { ...field, options: dynamic } : field;
    }),
  })), [config.sections, store, values["type"], session.scopeId]);

  const hasCustomerSection = sections.some((section) => section.title === "Customer");
  const matched = lookup.length >= 3 ? store.customers.find((entry) => entry.phone.includes(lookup) || entry.name.toLowerCase().includes(lookup.toLowerCase())) : undefined;
  const set = (name: string, next: string) => setValues((current) => ({ ...current, [name]: next }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const stamp = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    if (module === "customer") {
      const created = store.addCustomer({ name: values["name"] ?? "", phone: values["phone"] ?? "", email: values["email"] ?? "", address: values["address"] ?? "", location: values["city"] ?? "Chennai", branchId });
      toast.success(`${created.name} saved as ${created.id}`);
      navigate({ to: "/customers" });
      return;
    }

    if (module === "vehicle") {
      const branch = branches.find((entry) => entry.name === values["branch"]) ?? branches.find((entry) => entry.id === branchId) ?? branches[0]!;
      const dealer = store.dealers.find((entry) => entry.name === values["dealer"]);
      const vehicle: Vehicle = {
        id: nextId("VEH"), branchId: branch.id,
        model: values["model"] ?? "", variant: values["variant"] ?? "", colour: values["colour"] ?? "",
        chassis: values["chassis"] ?? "", engine: values["engine"] ?? "",
        purchasePrice: Number(values["purchasePrice"] ?? 0), sellingPrice: Number(values["sellingPrice"] ?? 0),
        status: values["status"] ?? "Available",
        ...(dealer ? { dealerId: dealer.id } : {}),
      };
      store.addVehicle(vehicle);
      toast.success(`${vehicle.model} added to ${branch.name}`);
      navigate({ to: "/inventory" });
      return;
    }

    if (module === "transaction") {
      const kind = values["type"] === "Expense" ? "expense" : "income";
      const entry: LedgerEntry = {
        id: nextId("TXN"), branchId, kind,
        category: values["category"] ?? (kind === "income" ? incomeCategories[0]! : expenseCategories[0]!),
        amount: Number(values["amount"] ?? 0),
        date: values["date"] || new Date().toISOString().slice(0, 10),
        ...(values["booking"] ? { bookingId: values["booking"] } : {}),
        ...(values["mode"] ? { mode: values["mode"] } : {}),
        ...(values["notes"] ? { notes: values["notes"] } : {}),
      };
      store.addLedgerEntry(entry);
      toast.success(`${values["type"] ?? "Income"} of ₹${entry.amount} recorded`);
      navigate({ to: "/accounts" });
      return;
    }

    if (config.recordKey && mode === "new") {
      const row: RecordRow = {
        id: `${config.idPrefix}-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        branchId,
        primary: values["customerName"] || matched?.name || "New record",
        secondary: values["provider"] || values["partner"] || values["newPartner"] || values["proforma"] || values["booking"] || values["rto"] || "—",
        detail: values["remarks"] || values["documents"] || values["accessories"] || "Created just now",
        date: stamp,
        status: values["status"] || "Open",
        ...(values["loanAmount"] || values["premium"] || values["newAmount"] || values["fees"]
          ? { amount: Number(values["loanAmount"] ?? values["premium"] ?? values["newAmount"] ?? values["fees"] ?? 0) }
          : {}),
      };
      store.addRecord(config.recordKey, row);
    }

    toast.success(mode === "edit" ? `${config.singular} ${id ?? ""} updated` : `${config.singular} created successfully`);
    navigate({ to: config.listTo });
  };

  return <div className="mx-auto max-w-5xl space-y-6">
    <PageHeader
      {...(mode === "edit" && id ? { eyebrow: id } : {})}
      title={mode === "edit" ? `Edit ${config.singular}` : `New ${config.singular}`}
      description={mode === "edit" ? "Update the saved details. Connected stages pick up the change automatically." : "Enter the information once — it flows to every connected stage."}
      actions={<Button variant="outline" asChild><Link to={config.listTo}><ArrowLeft/> Back</Link></Button>}
    />

    <form onSubmit={submit} className="space-y-5">
      {hasCustomerSection && mode === "new" && <GlassCard className="ambient-highlight p-6">
        <h2 className="font-display text-lg font-bold">Find existing customer</h2>
        <p className="mt-1 text-sm text-muted-foreground">Search by phone or name so details never need retyping.</p>
        <div className="relative mt-4"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary"/><Input className="pl-9" value={lookup} onChange={(event) => setLookup(event.target.value)} placeholder="Enter phone number or name"/></div>
        {matched && <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-success/20 bg-success-soft p-4">
          <span className="grid size-9 place-items-center rounded-full bg-success text-primary-foreground"><Check className="size-4"/></span>
          <div className="min-w-0 flex-1"><p className="font-semibold">{matched.name}</p><p className="text-sm text-muted-foreground">{matched.phone} · {matched.location}</p></div>
          <Button type="button" variant="outline" onClick={() => { setValues((current) => ({ ...current, customerName: matched.name, customerPhone: matched.phone })); toast.success(`${matched.name} selected`); }}>Use customer</Button>
        </div>}
      </GlassCard>}

      {sections.map((section) => <GlassCard key={section.title} className="p-6 lg:p-7">
        <h2 className="font-display text-lg font-bold">{section.title}</h2>
        {section.description && <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>}
        <div className="mt-5 grid gap-5 md:grid-cols-2">{section.fields.map((field) => <Field key={field.name} field={field} value={values[field.name] ?? ""} onChange={(next) => set(field.name, next)}/>)}</div>
      </GlassCard>)}

      <GlassCard className="p-6">
        <h2 className="font-display text-lg font-bold">Documents</h2>
        <Button type="button" variant="outline" onClick={() => toast.success("Document attached")} className="mt-4 h-24 w-full border-dashed border-primary/30 bg-primary-soft/70 text-primary hover:bg-primary-soft"><Upload className="mr-2 size-4"/> Upload supporting documents</Button>
      </GlassCard>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" asChild><Link to={config.listTo}>Cancel</Link></Button>
        <Button type="submit">{mode === "edit" ? "Save changes" : `Save ${config.singular}`}</Button>
      </div>
    </form>
  </div>;
}
