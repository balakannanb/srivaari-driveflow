import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Search, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard, PageHeader } from "@/components/shared";
import { addCustomer, addVehicleRequirement, customers, records, vehicles } from "@/lib/mock-service";

type FieldType = "text" | "tel" | "email" | "date" | "number" | "select" | "textarea";
type FieldDef = { name: string; label: string; type?: FieldType; placeholder?: string; options?: string[]; required?: boolean; full?: boolean };
type Section = { title: string; description?: string; fields: FieldDef[] };

export type FormModule =
  | "customer" | "enquiry" | "proforma" | "booking" | "vehicle"
  | "finance" | "refinance" | "insurance" | "registration" | "delivery" | "transaction";

type ListTo =
  | "/customers" | "/enquiries" | "/proforma" | "/bookings" | "/inventory"
  | "/finance/applications" | "/finance/refinance" | "/insurance" | "/registration" | "/deliveries" | "/accounts";

const paymentModes = ["Cash", "UPI", "Bank Transfer", "Card", "Cheque"];
const financePartners = ["TVS Credit", "Cholamandalam Finance", "Bajaj Finance", "IDFC FIRST Bank", "Shriram Finance", "HDFC Bank"];
const insurers = ["United India Insurance", "ICICI Lombard", "Bajaj Allianz", "New India Assurance", "TATA AIG"];
const rtoOffices = ["TN-09 Chennai Central", "TN-13 Ambattur", "TN-10 Chennai North", "TN-22 Sholinganallur", "TN-85 Poonamallee"];

const customerSection: Section = {
  title: "Customer",
  description: "Search an existing customer or enter a new one — details carry to every later stage.",
  fields: [
    { name: "customerPhone", label: "Customer phone", type: "tel", placeholder: "10-digit mobile number", required: true },
    { name: "customerName", label: "Customer name", placeholder: "Full name", required: true },
  ],
};

const newCustomerSection: Section = {
  title: "New customer",
  description: "These details are saved as a new customer record automatically when the booking is created.",
  fields: [
    { name: "customerName", label: "Customer name", required: true, placeholder: "Full name" },
    { name: "customerPhone", label: "Phone number", type: "tel", required: true, placeholder: "10-digit mobile number" },
    { name: "customerEmail", label: "Email", type: "email", placeholder: "name@example.com" },
    { name: "customerCity", label: "City / area", placeholder: "Velachery, Chennai" },
    { name: "customerAddress", label: "Address", placeholder: "Door number, street and area", full: true },
  ],
};

const requirementVehicleSection: Section = {
  title: "Vehicle requirement",
  description: "Vehicle is not in stock — it will be added to inventory marked as a requirement.",
  fields: [
    { name: "model", label: "Model", required: true, placeholder: "Yamaha FZ-S" },
    { name: "variant", label: "Variant", placeholder: "FI V4" },
    { name: "colour", label: "Colour", placeholder: "Racing Blue" },
    { name: "expectedPrice", label: "Expected selling price", type: "number", placeholder: "132000" },
    { name: "expectedArrival", label: "Expected stock arrival", type: "date" },
    { name: "requirementNotes", label: "Requirement notes", type: "textarea", placeholder: "Customer preference, alternate colours...", full: true },
  ],
};

const moduleConfig: Record<FormModule, { singular: string; listTo: ListTo; idPrefix: string; sections: Section[] }> = {
  customer: {
    singular: "Customer", listTo: "/customers", idPrefix: "CUS",
    sections: [
      { title: "Personal information", fields: [
        { name: "name", label: "Full name", required: true, placeholder: "Enter customer name" },
        { name: "phone", label: "Phone number", type: "tel", required: true, placeholder: "10-digit mobile number" },
        { name: "altPhone", label: "Alternate phone", type: "tel", placeholder: "Optional" },
        { name: "email", label: "Email", type: "email", placeholder: "name@example.com" },
        { name: "dob", label: "Date of birth", type: "date" },
        { name: "occupation", label: "Occupation", placeholder: "Business / Salaried / Student" },
      ] },
      { title: "Address & identification", fields: [
        { name: "address", label: "Address", placeholder: "Door number, street and area", full: true },
        { name: "city", label: "City", placeholder: "Chennai" },
        { name: "state", label: "State", placeholder: "Tamil Nadu" },
        { name: "pincode", label: "Pincode", placeholder: "600042" },
        { name: "idType", label: "ID type", type: "select", options: ["Aadhaar", "PAN", "Driving Licence", "Voter ID"] },
        { name: "idNumber", label: "ID number", placeholder: "Enter document number" },
        { name: "notes", label: "Notes", type: "textarea", placeholder: "Optional remarks", full: true },
      ] },
    ],
  },
  enquiry: {
    singular: "Enquiry", listTo: "/enquiries", idPrefix: "ENQ",
    sections: [customerSection, { title: "Enquiry details", fields: [
      { name: "model", label: "Model of interest", required: true, placeholder: "TVS Jupiter" },
      { name: "variant", label: "Variant", placeholder: "ZX SmartXonnect" },
      { name: "colour", label: "Preferred colour", placeholder: "Starlight Blue" },
      { name: "source", label: "Enquiry source", type: "select", options: ["Walk-in", "Phone call", "Referral", "Website", "Social media"] },
      { name: "purchaseType", label: "Purchase type", type: "select", options: ["Full cash", "Finance"] },
      { name: "budget", label: "Budget", type: "number", placeholder: "110000" },
      { name: "followUp", label: "Next follow-up date", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Open", "Follow-up Due", "Converted", "Lost"] },
      { name: "remarks", label: "Remarks", type: "textarea", placeholder: "What the customer asked for", full: true },
    ] }],
  },
  proforma: {
    singular: "Proforma Invoice", listTo: "/proforma", idPrefix: "PI",
    sections: [customerSection, { title: "Vehicle & pricing", fields: [
      { name: "model", label: "Model", required: true, placeholder: "TVS Jupiter" },
      { name: "variant", label: "Variant", placeholder: "ZX SmartXonnect" },
      { name: "exShowroom", label: "Ex-showroom price", type: "number", placeholder: "95800" },
      { name: "insurance", label: "Insurance", type: "number", placeholder: "6840" },
      { name: "registration", label: "Registration charges", type: "number", placeholder: "4200" },
      { name: "accessories", label: "Accessories", type: "number", placeholder: "1610" },
      { name: "discount", label: "Discount", type: "number", placeholder: "0" },
      { name: "paymentType", label: "Payment type", type: "select", options: ["Full cash", "Finance"] },
      { name: "validity", label: "Valid until", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Draft", "Sent", "Accepted", "Expired"] },
    ] }],
  },
  booking: {
    singular: "Booking", listTo: "/bookings", idPrefix: "BK",
    sections: [customerSection, { title: "Vehicle", fields: [
      { name: "model", label: "Model", required: true, placeholder: "TVS Jupiter" },
      { name: "variant", label: "Variant", placeholder: "ZX SmartXonnect" },
      { name: "colour", label: "Colour", placeholder: "Starlight Blue" },
      { name: "chassis", label: "Chassis number", placeholder: "MD626AG48R1K42175" },
    ] }, { title: "Payment", fields: [
      { name: "onRoad", label: "On-road price", type: "number", placeholder: "108450" },
      { name: "advance", label: "Advance paid", type: "number", placeholder: "30450" },
      { name: "paymentMode", label: "Payment mode", type: "select", options: paymentModes },
      { name: "paymentType", label: "Purchase type", type: "select", options: ["Full cash", "Finance"] },
      { name: "financePartner", label: "Finance partner", type: "select", options: financePartners },
      { name: "deliveryDate", label: "Expected delivery", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Booked", "Finance Pending", "Insurance Pending", "Registration Pending", "Ready for Delivery", "Delivered"] },
      { name: "remarks", label: "Remarks", type: "textarea", full: true },
    ] }],
  },
  vehicle: {
    singular: "Vehicle", listTo: "/inventory", idPrefix: "VEH",
    sections: [{ title: "Vehicle details", fields: [
      { name: "model", label: "Model", required: true, placeholder: "TVS Jupiter" },
      { name: "variant", label: "Variant", placeholder: "ZX SmartXonnect" },
      { name: "colour", label: "Colour", placeholder: "Starlight Blue" },
      { name: "year", label: "Manufacturing year", placeholder: "2026" },
      { name: "chassis", label: "Chassis number", required: true, placeholder: "MD626AG48R1K42175" },
      { name: "engine", label: "Engine number", placeholder: "AG4KR184921" },
    ] }, { title: "Stock & pricing", fields: [
      { name: "supplier", label: "Supplier", placeholder: "TVS Motor Company" },
      { name: "receivedOn", label: "Stock received on", type: "date" },
      { name: "purchasePrice", label: "Purchase price", type: "number", placeholder: "95800" },
      { name: "sellingPrice", label: "Selling price", type: "number", placeholder: "108450" },
      { name: "status", label: "Status", type: "select", options: ["Available", "Reserved", "Booked", "In Transit", "Delivered"] },
    ] }],
  },
  finance: {
    singular: "Finance Application", listTo: "/finance/applications", idPrefix: "FIN",
    sections: [customerSection, { title: "Loan details", fields: [
      { name: "booking", label: "Linked booking", placeholder: "BK-2026-00125" },
      { name: "partner", label: "Finance partner", type: "select", options: financePartners, required: true },
      { name: "loanAmount", label: "Loan amount", type: "number", placeholder: "78000" },
      { name: "downPayment", label: "Down payment", type: "number", placeholder: "30450" },
      { name: "tenure", label: "Tenure (months)", type: "select", options: ["12", "18", "24", "36", "48"] },
      { name: "interest", label: "Interest rate (%)", type: "number", placeholder: "11.5" },
      { name: "emi", label: "Monthly EMI", type: "number", placeholder: "4120" },
      { name: "appliedOn", label: "Applied on", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Submitted", "Under Review", "Approved", "Rejected", "Disbursed"] },
      { name: "documents", label: "Documents pending", type: "textarea", placeholder: "Aadhaar, PAN, bank statement...", full: true },
    ] }],
  },
  refinance: {
    singular: "Refinance", listTo: "/finance/refinance", idPrefix: "REF",
    sections: [customerSection, { title: "Existing finance", fields: [
      { name: "currentPartner", label: "Current financier", type: "select", options: financePartners },
      { name: "outstanding", label: "Outstanding amount", type: "number", placeholder: "64000" },
      { name: "vehicleNumber", label: "Vehicle number", placeholder: "TN 09 BK 4821" },
      { name: "existingEmi", label: "Existing EMI", type: "number", placeholder: "3800" },
    ] }, { title: "New finance", fields: [
      { name: "newPartner", label: "New financier", type: "select", options: financePartners },
      { name: "newAmount", label: "Requested amount", type: "number", placeholder: "90000" },
      { name: "tenure", label: "Tenure (months)", type: "select", options: ["12", "18", "24", "36", "48"] },
      { name: "status", label: "Status", type: "select", options: ["Documents Pending", "Submitted", "Approved", "Rejected", "Disbursed"] },
    ] }],
  },
  insurance: {
    singular: "Insurance", listTo: "/insurance", idPrefix: "INS",
    sections: [customerSection, { title: "Policy details", fields: [
      { name: "booking", label: "Linked booking", placeholder: "BK-2026-00125" },
      { name: "provider", label: "Insurance provider", type: "select", options: insurers, required: true },
      { name: "policyType", label: "Policy type", type: "select", options: ["Comprehensive", "Third party", "Own damage"] },
      { name: "policyNumber", label: "Policy number", placeholder: "UII/2026/8891245" },
      { name: "premium", label: "Premium amount", type: "number", placeholder: "6840" },
      { name: "startDate", label: "Start date", type: "date" },
      { name: "endDate", label: "Expiry date", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Requested", "Quote Received", "Policy Issued", "Expired"] },
    ] }],
  },
  registration: {
    singular: "Registration", listTo: "/registration", idPrefix: "REG",
    sections: [customerSection, { title: "RTO details", fields: [
      { name: "booking", label: "Linked booking", placeholder: "BK-2026-00125" },
      { name: "rto", label: "RTO office", type: "select", options: rtoOffices, required: true },
      { name: "applicationNumber", label: "Application number", placeholder: "TN09/2026/89142" },
      { name: "appliedOn", label: "Applied on", type: "date" },
      { name: "fees", label: "Registration fees", type: "number", placeholder: "4200" },
      { name: "vehicleNumber", label: "Allotted number", placeholder: "TN 09 BM 4821" },
      { name: "status", label: "Status", type: "select", options: ["Documents Pending", "Submitted", "Processing", "Number Allotted", "Completed"] },
    ] }],
  },
  delivery: {
    singular: "Delivery", listTo: "/deliveries", idPrefix: "DEL",
    sections: [customerSection, { title: "Handover details", fields: [
      { name: "booking", label: "Linked booking", placeholder: "BK-2026-00123", required: true },
      { name: "model", label: "Vehicle", placeholder: "TVS Apache RTR 160" },
      { name: "date", label: "Delivery date", type: "date" },
      { name: "time", label: "Delivery time", placeholder: "11:30 AM" },
      { name: "deliveredBy", label: "Delivered by", placeholder: "Kannan" },
      { name: "status", label: "Status", type: "select", options: ["Scheduled", "Ready", "Blocked", "Delivered"] },
      { name: "accessories", label: "Accessories handed over", type: "textarea", full: true },
    ] }],
  },
  transaction: {
    singular: "Transaction", listTo: "/accounts", idPrefix: "TXN",
    sections: [{ title: "Transaction", fields: [
      { name: "type", label: "Entry type", type: "select", options: ["Income", "Expense"], required: true },
      { name: "category", label: "Category", type: "select", options: ["Vehicle sale", "Booking advance", "Finance commission", "Insurance commission", "Accessories", "Salary", "Rent", "Utilities", "Other"] },
      { name: "amount", label: "Amount", type: "number", placeholder: "18500", required: true },
      { name: "mode", label: "Payment mode", type: "select", options: paymentModes },
      { name: "date", label: "Date", type: "date" },
      { name: "reference", label: "Reference", placeholder: "BK-2026-00125" },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ] }],
  },
};

const recordKeyFor: Partial<Record<FormModule, string>> = {
  enquiry: "enquiries", proforma: "proforma", booking: "bookings", finance: "finance",
  refinance: "refinance", insurance: "insurance", registration: "registration", delivery: "deliveries",
};

function defaultsFor(module: FormModule, id?: string): Record<string, string> {
  if (!id) return {};
  if (module === "customer") {
    const found = customers.find((entry) => entry.id === id);
    if (!found) return {};
    return { name: found.name, phone: found.phone, email: found.email, address: found.address, city: found.location.split(", ").pop() ?? "Chennai", state: "Tamil Nadu" };
  }
  if (module === "vehicle") {
    const found = vehicles.find((entry) => entry.id === id);
    if (!found) return {};
    return { model: found.model, variant: found.variant, colour: found.colour, chassis: found.chassis, engine: found.engine, purchasePrice: String(found.purchasePrice), sellingPrice: String(found.sellingPrice), status: found.status };
  }
  const key = recordKeyFor[module];
  const row = key ? records[key]?.find((entry) => entry.id === id) : undefined;
  if (!row) return {};
  return { customerName: row.primary, customerPhone: /^\d+$/.test(row.secondary) ? row.secondary : "", model: row.secondary, status: row.status, remarks: row.detail, amount: row.amount ? String(row.amount) : "" };
}

function Field({ field, value, onChange }: { field: FieldDef; value: string; onChange: (next: string) => void }) {
  const label = <span className="text-sm font-semibold text-foreground">{field.label}{field.required && <span className="ml-1 text-destructive">*</span>}</span>;
  return <div className={field.full ? "grid gap-2 md:col-span-2" : "grid gap-2"}>
    {label}
    {field.type === "select" ? (
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder={`Select ${field.label.toLowerCase()}`}/></SelectTrigger>
        <SelectContent>{(field.options ?? []).map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
      </Select>
    ) : field.type === "textarea" ? (
      <Textarea value={value} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} rows={3}/>
    ) : (
      <Input type={field.type ?? "text"} value={value} placeholder={field.placeholder} required={field.required} onChange={(event) => onChange(event.target.value)}/>
    )}
  </div>;
}

function ModeToggle({ value, onChange, options }: { value: string; onChange: (next: string) => void; options: { key: string; label: string }[] }) {
  return <div className="inline-flex rounded-xl border border-border bg-card/70 p-1 backdrop-blur-sm">
    {options.map((option) => <Button key={option.key} type="button" size="sm" variant={value === option.key ? "default" : "ghost"} onClick={() => onChange(option.key)}>{option.label}</Button>)}
  </div>;
}

export function RecordFormPage({ module, mode = "new", id }: { module: FormModule; mode?: "new" | "edit"; id?: string }) {
  const config = moduleConfig[module];
  const navigate = useNavigate();
  const initial = useMemo(() => defaultsFor(module, id), [module, id]);
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [lookup, setLookup] = useState("");
  const [customerMode, setCustomerMode] = useState<"existing" | "new">("existing");
  const [stockMode, setStockMode] = useState<"stock" | "requirement">("stock");
  const [stockVehicleId, setStockVehicleId] = useState("");

  const isBookingNew = module === "booking" && mode === "new";
  const inStock = useMemo(() => vehicles.filter((vehicle) => ["Available", "Reserved", "In Transit"].includes(vehicle.status)), []);

  const matched = lookup.length >= 4 ? customers.find((entry) => entry.phone.includes(lookup) || entry.name.toLowerCase().includes(lookup.toLowerCase())) : undefined;
  const sections = useMemo(() => {
    if (!isBookingNew) return config.sections;
    const [, vehicleSection, paymentSection] = config.sections;
    return [
      customerMode === "new" ? newCustomerSection : customerSection,
      stockMode === "requirement" ? requirementVehicleSection : vehicleSection!,
      paymentSection!,
    ];
  }, [config.sections, customerMode, isBookingNew, stockMode]);
  const hasCustomerSection = sections.some((section) => section.title === "Customer");
  const set = (name: string, next: string) => setValues((current) => ({ ...current, [name]: next }));

  const pickStockVehicle = (vehicleId: string) => {
    setStockVehicleId(vehicleId);
    const vehicle = vehicles.find((entry) => entry.id === vehicleId);
    if (!vehicle) return;
    setValues((current) => ({ ...current, model: vehicle.model, variant: vehicle.variant, colour: vehicle.colour, chassis: vehicle.chassis, onRoad: String(vehicle.sellingPrice) }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isBookingNew && customerMode === "new" && values.customerName && values.customerPhone) {
      const created = addCustomer({ name: values.customerName, phone: values.customerPhone, email: values.customerEmail, address: values.customerAddress, location: values.customerCity });
      toast.success(`New customer ${created.id} created for ${created.name}`);
    }
    if (isBookingNew && stockMode === "requirement" && values.model) {
      const requirement = addVehicleRequirement({ model: values.model, variant: values.variant, colour: values.colour, sellingPrice: Number(values.expectedPrice || 0) });
      toast.success(`${requirement.model} added to inventory as a requirement`);
    }
    toast.success(mode === "edit" ? `${config.singular} ${id ?? ""} updated` : `${config.singular} created successfully`);
    navigate({ to: config.listTo });
  };


  return <div className="mx-auto max-w-5xl space-y-6">
    <PageHeader
      eyebrow={mode === "edit" ? id : undefined}
      title={mode === "edit" ? `Edit ${config.singular}` : `New ${config.singular}`}
      description={mode === "edit" ? "Update the saved details. Connected stages pick up the change automatically." : "Enter the information once — it flows to every connected stage."}
      actions={<Button variant="outline" asChild><Link to={config.listTo}><ArrowLeft/> Back</Link></Button>}
    />

    <form onSubmit={submit} className="space-y-5">
      {isBookingNew && <GlassCard className="ambient-highlight flex flex-wrap items-center justify-between gap-4 p-5">
        <div><p className="font-display font-bold">Who is this booking for?</p><p className="text-sm text-muted-foreground">Pick a saved customer, or enter a new one — we create the customer record automatically.</p></div>
        <ModeToggle value={customerMode} onChange={(next) => setCustomerMode(next as "existing" | "new")} options={[{ key: "existing", label: "Existing customer" }, { key: "new", label: "New customer" }]}/>
      </GlassCard>}

      {hasCustomerSection && mode === "new" && (!isBookingNew || customerMode === "existing") && <GlassCard className="ambient-highlight p-6">
        <h2 className="font-display text-lg font-bold">Find existing customer</h2>
        <p className="mt-1 text-sm text-muted-foreground">Search by phone or name so details never need retyping.</p>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary"/>
          <Input className="pl-9" value={lookup} onChange={(event) => setLookup(event.target.value)} placeholder="Enter phone number or name"/>
        </div>
        {matched && <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-success/20 bg-success-soft p-4">
          <span className="grid size-9 place-items-center rounded-full bg-success text-primary-foreground"><Check className="size-4"/></span>
          <div className="min-w-0 flex-1"><p className="font-semibold">{matched.name}</p><p className="text-sm text-muted-foreground">{matched.phone} · {matched.location}</p></div>
          <Button type="button" variant="outline" onClick={() => { setValues((current) => ({ ...current, customerName: matched.name, customerPhone: matched.phone })); toast.success(`${matched.name} selected`); }}>Use customer</Button>
        </div>}
      </GlassCard>}

      {sections.map((section) => <div key={section.title} className="space-y-5">
        {isBookingNew && (section.title === "Vehicle" || section.title === "Vehicle requirement") && <GlassCard className="ambient-highlight flex flex-wrap items-center justify-between gap-4 p-5">
          <div><p className="font-display font-bold">Vehicle availability</p><p className="text-sm text-muted-foreground">Choose from showroom stock, or raise a requirement when the bike is unavailable.</p></div>
          <ModeToggle value={stockMode} onChange={(next) => setStockMode(next as "stock" | "requirement")} options={[{ key: "stock", label: "From stock" }, { key: "requirement", label: "Not in stock" }]}/>
        </GlassCard>}
        <GlassCard className="p-6 lg:p-7">
          <h2 className="font-display text-lg font-bold">{section.title}</h2>
          {section.description && <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>}
          {isBookingNew && stockMode === "stock" && section.title === "Vehicle" && <div className="mt-5 grid gap-2">
            <span className="text-sm font-semibold text-foreground">Select available vehicle<span className="ml-1 text-destructive">*</span></span>
            <Select value={stockVehicleId || undefined} onValueChange={pickStockVehicle}>
              <SelectTrigger><SelectValue placeholder="Choose a vehicle from inventory"/></SelectTrigger>
              <SelectContent>{inStock.map((vehicle) => <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.model} · {vehicle.variant} · {vehicle.colour} ({vehicle.status})</SelectItem>)}</SelectContent>
            </Select>
          </div>}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {section.fields.map((field) => <Field key={field.name} field={field} value={values[field.name] ?? ""} onChange={(next) => set(field.name, next)}/>)}
          </div>
        </GlassCard>
      </div>)}

      <GlassCard className="p-6">
        <h2 className="font-display text-lg font-bold">Documents</h2>
        <Button type="button" variant="outline" onClick={() => toast.success("Document attached")} className="mt-4 h-24 w-full border-dashed border-primary/30 bg-primary-soft/70 text-primary hover:bg-primary-soft">
          <Upload className="mr-2 size-4"/> Upload supporting documents
        </Button>
      </GlassCard>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" asChild><Link to={config.listTo}>Cancel</Link></Button>
        <Button type="submit">{mode === "edit" ? "Save changes" : `Save ${config.singular}`}</Button>
      </div>
    </form>
  </div>;
}
