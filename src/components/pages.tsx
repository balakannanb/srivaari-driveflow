import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bike, Boxes, CalendarCheck, Check, ChevronRight, CircleDollarSign, ClipboardCheck, Clock3, Download, FileSpreadsheet, FileText, Handshake, IndianRupee, Landmark, Pencil, Plus, Printer, Search, Settings, ShieldCheck, TrendingUp, Upload, UserPlus, Users, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, lineAmount } from "@/lib/domain";
import { branchName } from "@/lib/masters";
import { useSession } from "@/lib/branch-context";
import { useStore } from "@/lib/store";
import { EditLink, GlassCard, JourneyStepper, KpiCard, ModernTable, PageHeader, StatusBadge } from "@/components/shared";
import { BookingView } from "@/components/booking-view";

function FilterPills({ options, active, onChange }: { options: string[]; active: string; onChange: (next: string) => void }) {
  return <div className="flex gap-2 overflow-x-auto pb-1">{options.map((item) => <Button key={item} variant={active === item ? "default" : "outline"} size="sm" onClick={() => onChange(item)}>{item}</Button>)}</div>;
}

export const pageFilters = {
  followups: ["All", "Open", "Follow-up Due", "Converted", "Lost"],
  proforma: ["All", "Draft", "Sent", "Accepted", "Expired"],
  bookings: ["All", "Booked", "Finance Pending", "Insurance Pending", "Registration Pending", "Ready for Delivery", "Delivered"],
  finance: ["All", "Submitted", "Under Review", "Approved", "Rejected", "Disbursed"],
  refinance: ["All", "Documents Pending", "Submitted", "Approved", "Rejected", "Disbursed"],
  insurance: ["All", "Requested", "Quote Received", "Policy Issued", "Expired"],
  registration: ["All", "Documents Pending", "Submitted", "Processing", "Number Allotted", "Completed"],
  deliveries: ["All", "Scheduled", "Ready", "Blocked", "Delivered"],
  customers: ["All", "Proforma", "Booking", "Finance", "Registration", "Delivered"],
  inventory: ["All", "Available", "Reserved", "Booked", "In Transit", "Requirement", "Delivered"],
} as const;

const AccountsChart = lazy(() => import("@/components/accounts-chart"));

/** Branch-scoped record access used by every module list. */
function useScopedRecords(key: string) {
  const session = useSession();
  const store = useStore();
  return useMemo(() => (store.records[key] ?? []).filter((row) => session.inScope(row.branchId)), [key, session, store.records]);
}

export function DashboardPage() {
  const session = useSession();
  const store = useStore();
  const scoped = (key: string) => (store.records[key] ?? []).filter((row) => session.inScope(row.branchId));
  const pipeline = [["Proforma", scoped("proforma").length, "/proforma"], ["Follow-up", scoped("followups").length, "/followups"], ["Booking", scoped("bookings").length, "/bookings"], ["Payment", scoped("bookings").length, "/bookings"], ["Finance", scoped("finance").length, "/finance"], ["Insurance", scoped("insurance").length, "/insurance"], ["Registration", scoped("registration").length, "/registration"], ["Delivery", scoped("deliveries").length, "/deliveries"]] as const;
  const availableVehicles = store.vehicles.filter((vehicle) => session.inScope(vehicle.branchId) && vehicle.status === "Available").length;
  const upcoming = store.bookings.filter((booking) => session.inScope(booking.branchId) && booking.requirements.expectedDelivery);

  return <div className="space-y-7">
    <PageHeader eyebrow={session.branchName} title="Good morning, Kannan" description={`Here's what's happening at SRIVAARI AUTOMOBILES — ${session.branchName.toLowerCase()}.`} actions={<Button asChild><Link to="/bookings/new"><Plus/> New Booking</Link></Button>}/>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <KpiCard label="Bookings" value={String(scoped("bookings").length)} trend="This week" icon={<ClipboardCheck/>}/>
      <KpiCard label="Pending Finance" value={String(scoped("finance").filter((row) => row.status !== "Disbursed").length)} trend="In progress" icon={<Landmark/>}/>
      <KpiCard label="Available Vehicles" value={String(availableVehicles)} trend="In stock" icon={<Bike/>}/>
      <KpiCard label="Insurance Pending" value={String(scoped("insurance").filter((row) => row.status !== "Policy Issued").length)} trend="Today" icon={<ShieldCheck/>}/>
      <KpiCard label="Registration Pending" value={String(scoped("registration").filter((row) => row.status !== "Completed").length)} trend="Processing" icon={<FileText/>}/>
      <KpiCard label="Deliveries" value={String(scoped("deliveries").length)} trend="On schedule" icon={<CalendarCheck/>}/>
    </section>

    <GlassCard className="p-5 lg:p-6">
      <div className="mb-6 flex items-center justify-between"><div><h2 className="font-display text-lg font-bold">Customer pipeline</h2><p className="text-sm text-muted-foreground">Proforma → Follow-up → Booking → Delivery</p></div><span className="text-xs font-semibold text-success">{session.branchName}</span></div>
      <div className="grid gap-2 sm:grid-cols-4 xl:grid-cols-8">{pipeline.map(([label, count, to], index) => <Link key={label} to={to} className="group relative rounded-xl border border-border/70 bg-background/60 p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"><span className="text-xs text-muted-foreground">0{index + 1}</span><strong className="mt-3 block text-2xl">{count}</strong><span className="text-xs font-semibold">{label}</span>{index < 7 && <ChevronRight className="absolute -right-2 top-1/2 z-10 hidden size-4 -translate-y-1/2 text-primary xl:block"/>}</Link>)}</div>
    </GlassCard>

    <div className="grid gap-5 xl:grid-cols-[1fr_1.15fr]">
      <GlassCard className="p-5">
        <h2 className="font-display text-lg font-bold">Expected deliveries</h2>
        <div className="mt-4 space-y-2">
          {upcoming.length === 0 && <p className="text-sm text-muted-foreground">No delivery dates scheduled yet.</p>}
          {upcoming.map((booking) => <Link key={booking.id} to="/bookings/$id" params={{ id: booking.id }} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-primary-soft">
            <span className="grid size-9 place-items-center rounded-lg bg-muted text-primary"><CalendarCheck className="size-4"/></span>
            <span className="min-w-0 flex-1"><strong className="block text-sm">{store.customers.find((entry) => entry.id === booking.customerId)?.name}</strong><small className="text-muted-foreground">{booking.id} · {branchName(booking.branchId)}</small></span>
            <StatusBadge status={booking.requirements.expectedDelivery} tone="info"/>
          </Link>)}
        </div>
      </GlassCard>
      <GlassCard className="p-5">
        <h2 className="font-display text-lg font-bold">Today's actions</h2>
        <div className="mt-4 space-y-2">{[["Finance applications awaiting action", "Urgent", "/finance"], ["Insurance policies pending", "Today", "/insurance"], ["Registrations pending", "In progress", "/registration"], ["Deliveries scheduled", "On track", "/deliveries"], ["Customer follow-ups due", "Due", "/followups"]].map(([label, badge, to], index) => <Link key={label} to={to} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-primary-soft"><span className="grid size-9 place-items-center rounded-lg bg-muted text-primary"><Clock3 className="size-4"/></span><span className="min-w-0 flex-1 text-sm font-medium">{label}</span><StatusBadge status={badge} tone={index === 0 ? "danger" : index === 3 ? "success" : "warning"}/></Link>)}</div>
      </GlassCard>
    </div>
  </div>;
}

export function CustomersPage() {
  const session = useSession();
  const store = useStore();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All");
  const filtered = useMemo(() => store.customers.filter((customer) =>
    (session.scopeId === null || customer.branchIds.includes(session.scopeId))
    && `${customer.name} ${customer.phone} ${customer.id}`.toLowerCase().includes(query.toLowerCase())
    && (stage === "All" || customer.stage === stage)), [query, session.scopeId, stage, store.customers]);

  return <div className="space-y-6">
    <PageHeader title="Customers" description="One customer master shared across branches — history stays connected." actions={<Button asChild><Link to="/customers/new"><UserPlus/> New Customer</Link></Button>}/>
    <FilterPills options={[...pageFilters.customers]} active={stage} onChange={setStage}/>
    <GlassCard className="overflow-hidden">
      <div className="border-b border-border p-4"><div className="relative max-w-md"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone, customer ID..."/></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[820px]"><thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground"><tr>{["Customer", "Customer ID", "Phone", "Branches", "Current Stage", "Last Activity"].map((head) => <th key={head} className="px-5 py-3.5">{head}</th>)}</tr></thead>
        <tbody>{filtered.map((customer) => <tr key={customer.id} className="border-t border-border/60 hover:bg-primary-soft/40">
          <td className="px-5 py-4"><Link to="/customers/$id" params={{ id: customer.id }} className="font-semibold text-primary">{customer.name}</Link></td>
          <td className="px-5 py-4 text-sm">{customer.id}</td>
          <td className="px-5 py-4 text-sm">{customer.phone}</td>
          <td className="px-5 py-4 text-sm text-muted-foreground">{customer.branchIds.map(branchName).join(", ")}</td>
          <td className="px-5 py-4"><StatusBadge status={customer.stage}/></td>
          <td className="px-5 py-4 text-sm text-muted-foreground">{customer.lastActivity}</td>
        </tr>)}</tbody></table></div>
    </GlassCard>
  </div>;
}

export function CustomerDetailPage({ id = "CUS-00125" }: { id?: string }) {
  const store = useStore();
  const customer = store.customers.find((entry) => entry.id === id) ?? store.customers[0];
  if (!customer) return null;
  const bookings = store.bookings.filter((entry) => entry.customerId === customer.id);
  return <div className="space-y-6">
    <PageHeader eyebrow={`${customer.id} · ${customer.phone}`} title={customer.name} description={`${customer.location} · ${customer.branchIds.map(branchName).join(", ")}`}
      actions={<><Button variant="outline" asChild><EditLink basePath="/customers" id={customer.id}><Pencil/> Edit</EditLink></Button><Button variant="outline" asChild><Link to="/proforma/new">New Proforma</Link></Button><Button asChild><Link to="/bookings/new">New Booking</Link></Button></>}/>
    <GlassCard className="p-6"><JourneyStepper active={5}/></GlassCard>
    <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
      <GlassCard className="p-6">
        <div className="flex items-center gap-4">
          {customer.photo ? <img src={customer.photo} alt={customer.name} className="size-16 rounded-2xl object-cover"/> : null}
          <h2 className="font-display text-lg font-bold">Customer information</h2>
        </div>
        <dl className="mt-5 space-y-4">{[["Phone", customer.phone], ["Email", customer.email || "—"], ["Address", customer.address || "—"], ["Branches", customer.branchIds.map(branchName).join(", ")], ["Stage", customer.stage]].map(([label, value]) => <div key={label}><dt className="text-xs font-semibold uppercase text-muted-foreground">{label}</dt><dd className="mt-1 text-sm font-medium">{value}</dd></div>)}</dl>
      </GlassCard>
      <GlassCard className="p-6">
        <Tabs defaultValue="bookings">
          <TabsList className="max-w-full justify-start overflow-x-auto"><TabsTrigger value="bookings">Bookings</TabsTrigger><TabsTrigger value="proforma">Proformas</TabsTrigger><TabsTrigger value="accounts">Accounts</TabsTrigger></TabsList>
          <TabsContent value="bookings" className="mt-5 space-y-3">
            {bookings.length === 0 && <p className="text-sm text-muted-foreground">No bookings yet.</p>}
            {bookings.map((booking) => <div key={booking.id} className="rounded-xl border border-border p-4"><div className="flex items-center justify-between"><div><Link to="/bookings/$id" params={{ id: booking.id }} className="font-semibold text-primary">{booking.id}</Link><p className="text-sm text-muted-foreground">{booking.vehicles.map((line) => `${line.model} ${line.variant}`).join(", ")}</p></div><StatusBadge status={branchName(booking.branchId)} tone="info"/></div></div>)}
          </TabsContent>
          <TabsContent value="proforma" className="mt-5 space-y-3">
            {store.proformas.filter((entry) => entry.customerId === customer.id).map((entry) => <div key={entry.id} className="rounded-xl border border-border p-4"><Link to="/proforma/$id" params={{ id: entry.id }} className="font-semibold text-primary">{entry.id}</Link><p className="text-sm text-muted-foreground">{entry.vehicles.length} vehicle(s) · {entry.offers.length} offer(s)</p></div>)}
          </TabsContent>
          <TabsContent value="accounts" className="mt-5 space-y-2 text-sm">
            {store.ledger.filter((entry) => bookings.some((booking) => booking.id === entry.bookingId)).map((entry) => <div key={entry.id} className="flex justify-between rounded-lg bg-muted/50 px-3 py-2"><span>{entry.category}</span><strong className={entry.kind === "income" ? "text-success" : "text-destructive"}>{formatCurrency(entry.amount)}</strong></div>)}
          </TabsContent>
        </Tabs>
      </GlassCard>
    </div>
  </div>;
}

const moduleConfig = {
  followups: ["Follow-ups", "Follow up with customers who already have a proforma invoice.", "New Follow-up", "/followups/new"],
  proforma: ["Proforma Invoices", "Quote one or many vehicles with offers, discounts and exchange vehicles.", "New Proforma", "/proforma/new"],
  bookings: ["Bookings", "Every booking carries its proforma forward — from advance to delivery.", "New Booking", "/bookings/new"],
  finance: ["Finance Applications", "Monitor NBFC applications, documents, approvals, and disbursals.", "New Application", "/finance/applications/new"],
  insurance: ["Insurance", "Track policy requests, issuance, and upcoming expiry dates.", "New Insurance", "/insurance/new"],
  registration: ["Registration", "Manage RTO applications through number allocation and completion.", "New Registration", "/registration/new"],
  refinance: ["Refinance", "Move existing vehicle loans to better partners.", "New Refinance", "/finance/refinance/new"],
  deliveries: ["Deliveries", "Complete every handover only after all prerequisites are ready.", "Schedule Delivery", "/deliveries/new"],
} as const;

export function ListPage({ type }: { type: keyof typeof moduleConfig }) {
  const [title, description, action, to] = moduleConfig[type];
  const session = useSession();
  const [status, setStatus] = useState("All");
  const scoped = useScopedRecords(type);
  const rows = useMemo(() => (status === "All" ? scoped : scoped.filter((row) => row.status === status)), [scoped, status]);
  return <div className="space-y-6">
    <PageHeader eyebrow={session.branchName} title={title} description={description} actions={<Button asChild><Link to={to}><Plus/> {action}</Link></Button>}/>
    {type === "finance" && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <KpiCard label="Applications" value={String(scoped.length)} trend="This month" icon={<FileText/>}/>
      <KpiCard label="Pending" value={String(scoped.filter((row) => row.status === "Under Review" || row.status === "Submitted").length)} trend="In review" icon={<Clock3/>}/>
      <KpiCard label="Approved" value={String(scoped.filter((row) => row.status === "Approved").length)} trend="Ready" icon={<Check/>}/>
      <KpiCard label="Rejected" value={String(scoped.filter((row) => row.status === "Rejected").length)} trend="—" icon={<ClipboardCheck/>}/>
      <KpiCard label="Disbursed" value={formatCurrency(scoped.filter((row) => row.status === "Disbursed").reduce((sum, row) => sum + (row.amount ?? 0), 0))} trend="This month" icon={<IndianRupee/>}/>
    </div>}
    <FilterPills options={[...pageFilters[type]]} active={status} onChange={setStatus}/>
    <ModernTable rows={rows} basePath={type === "finance" ? "/finance/applications" : type === "refinance" ? "/finance/refinance" : `/${type}`}/>
  </div>;
}

const basePathFor: Record<keyof typeof moduleConfig, string> = { followups: "/followups", proforma: "/proforma", bookings: "/bookings", finance: "/finance/applications", refinance: "/finance/refinance", insurance: "/insurance", registration: "/registration", deliveries: "/deliveries" };

export function DetailPage({ type, id }: { type: keyof typeof moduleConfig; id: string }) {
  const store = useStore();
  if (type === "bookings") return <BookingView id={id}/>;
  const rows = store.records[type] ?? [];
  const row = rows.find((entry) => entry.id === id) ?? rows[0];
  if (!row) return null;
  const proforma = type === "proforma" ? store.proformas.find((entry) => entry.id === row.id) : undefined;

  return <div className="space-y-6">
    <PageHeader eyebrow={`${row.id} · ${branchName(row.branchId)}`} title={row.primary} description={row.secondary}
      actions={<><Button variant="outline" asChild><EditLink basePath={basePathFor[type]} id={row.id}><Pencil/> Edit</EditLink></Button><Button variant="outline" onClick={() => window.print()}><Printer/> Print</Button><Button variant="outline" onClick={() => toast.success("Download started")}><Download/> Download</Button></>}/>

    {proforma ? <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="space-y-5">
        <GlassCard className="p-6">
          <h2 className="font-display text-lg font-bold">Vehicles</h2>
          <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-xs uppercase text-muted-foreground"><tr>{["Model", "Variant", "Colour", "Qty", "Unit price", "Discount", "Amount"].map((head) => <th key={head} className="py-2">{head}</th>)}</tr></thead>
            <tbody>{proforma.vehicles.map((line) => <tr key={line.id} className="border-t border-border/60"><td className="py-3 font-semibold">{line.model}</td><td>{line.variant}</td><td>{line.colour}</td><td>{line.quantity}</td><td>{formatCurrency(line.unitPrice)}</td><td>{formatCurrency(line.discount)}</td><td className="font-semibold">{formatCurrency(lineAmount(line))}</td></tr>)}</tbody></table></div>
        </GlassCard>
        <div className="grid gap-5 md:grid-cols-2">
          <GlassCard className="p-6"><h2 className="font-display font-bold">Offers</h2>{proforma.offers.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">None</p> : proforma.offers.map((offer) => <p key={offer.id} className="mt-3 text-sm"><strong>{offer.type}</strong> · {formatCurrency(offer.value)} {offer.remarks && <span className="text-muted-foreground">· {offer.remarks}</span>}</p>)}</GlassCard>
          <GlassCard className="p-6"><h2 className="font-display font-bold">Discounts</h2>{proforma.discounts.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">None</p> : proforma.discounts.map((discount) => <p key={discount.id} className="mt-3 text-sm"><strong>{discount.type}</strong> · − {formatCurrency(discount.amount)} <span className="text-muted-foreground">{discount.reason}</span></p>)}</GlassCard>
          <GlassCard className="p-6 md:col-span-2"><h2 className="font-display font-bold">Exchange vehicles</h2>{proforma.exchanges.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">None</p> : proforma.exchanges.map((exchange) => <p key={exchange.id} className="mt-3 text-sm"><strong>{exchange.manufacturer} {exchange.model}</strong> · {exchange.registrationNumber} · Expected {formatCurrency(exchange.expectedValue)}</p>)}</GlassCard>
        </div>
      </div>
      <aside className="space-y-4">
        <GlassCard className="border-primary/20 bg-primary p-6 text-primary-foreground">
          <p className="text-xs font-bold uppercase opacity-75">Quotation total</p>
          <h2 className="mt-2 text-3xl font-bold">{formatCurrency(row.amount ?? 0)}</h2>
          <div className="my-5 h-px bg-primary-foreground/20"/>
          <p className="text-xs font-bold uppercase opacity-75">Status</p><p className="mt-1 font-semibold">{row.status}</p>
          <Button variant="secondary" className="mt-5 w-full" asChild><Link to="/bookings/new">Convert to Booking</Link></Button>
        </GlassCard>
        <GlassCard className="p-5"><h3 className="font-bold">Next step</h3><p className="mt-2 text-sm text-muted-foreground">Log a follow-up with this customer, then convert the accepted quotation into a booking.</p><Button variant="outline" className="mt-4 w-full" asChild><Link to="/followups/new">Add follow-up</Link></Button></GlassCard>
      </aside>
    </div> : <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="grid gap-5 sm:grid-cols-2">{["Customer", "Vehicle", "Details", "Documents"].map((title, index) => <GlassCard key={title} className="p-5"><div className="flex items-center justify-between"><h2 className="font-display font-bold">{title}</h2><StatusBadge status={index < 2 ? "Completed" : "Processing"}/></div><p className="mt-4 text-sm leading-6 text-muted-foreground">{index === 0 ? row.primary : index === 1 ? row.secondary : index === 2 ? row.detail : "Documents attached to this record."}</p></GlassCard>)}</div>
      <aside className="space-y-4">
        <GlassCard className="border-primary/20 bg-primary p-6 text-primary-foreground"><p className="text-xs font-bold uppercase opacity-75">Current stage</p><h2 className="mt-2 text-2xl font-bold">{row.status}</h2><div className="my-5 h-px bg-primary-foreground/20"/><p className="text-xs font-bold uppercase opacity-75">Amount</p><p className="mt-2 font-semibold">{row.amount ? formatCurrency(row.amount) : "—"}</p><Button variant="secondary" className="mt-5 w-full" onClick={() => toast.success(`${row.id} updated`)}>Update status</Button></GlassCard>
        <GlassCard className="p-5"><h3 className="font-bold">Activity timeline</h3>{["Record created", "Documents verified", "Record updated", "Awaiting next action"].map((item, index) => <div key={item} className="mt-4 flex gap-3"><span className="mt-1 size-2 rounded-full bg-primary"/><div><p className="text-sm font-medium">{item}</p><p className="text-xs text-muted-foreground">{index + 1} day ago · Priya S</p></div></div>)}</GlassCard>
      </aside>
    </div>}
  </div>;
}

export function InventoryPage() {
  const session = useSession();
  const store = useStore();
  const [view, setView] = useState("table");
  const [stock, setStock] = useState("All");
  const list = useMemo(() => store.vehicles.filter((vehicle) => session.inScope(vehicle.branchId) && (stock === "All" || vehicle.status === stock)), [session, stock, store.vehicles]);
  const dealerName = (id?: string) => store.dealers.find((dealer) => dealer.id === id)?.name ?? "—";

  return <div className="space-y-6">
    <PageHeader eyebrow={session.branchName} title="Vehicle Inventory" description={`${list.length} vehicles in this branch scope, each linked to its dealer.`} actions={<><Button variant="outline"><Upload/> Import</Button><Button asChild><Link to="/inventory/new"><Plus/> Add Vehicle</Link></Button></>}/>
    <div className="flex justify-between gap-3">
      <FilterPills options={[...pageFilters.inventory]} active={stock} onChange={setStock}/>
      <div className="flex rounded-xl border border-border bg-card p-1"><Button size="sm" variant={view === "table" ? "default" : "ghost"} onClick={() => setView("table")}>Table</Button><Button size="sm" variant={view === "card" ? "default" : "ghost"} onClick={() => setView("card")}>Cards</Button></div>
    </div>
    {view === "card" ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map((vehicle) => <Link key={vehicle.id} to="/inventory/$id" params={{ id: vehicle.id }}><GlassCard className="p-5 transition hover:-translate-y-0.5 hover:shadow-float"><div className="flex justify-between"><Bike className="text-primary"/><StatusBadge status={vehicle.status}/></div><h2 className="mt-8 font-display text-xl font-bold">{vehicle.model}</h2><p className="text-sm text-muted-foreground">{vehicle.variant} · {vehicle.colour}</p><p className="mt-4 text-lg font-bold">{formatCurrency(vehicle.sellingPrice)}</p><p className="mt-1 text-xs text-muted-foreground">{vehicle.chassis} · {dealerName(vehicle.dealerId)}</p></GlassCard></Link>)}</div>
      : <GlassCard className="overflow-x-auto"><table className="w-full min-w-[900px]"><thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground"><tr>{["Vehicle", "Branch", "Dealer", "Chassis", "Colour", "Selling Price", "Status"].map((head) => <th key={head} className="px-5 py-3.5">{head}</th>)}</tr></thead>
        <tbody>{list.map((vehicle) => <tr key={vehicle.id} className="border-t border-border/60">
          <td className="px-5 py-4"><Link to="/inventory/$id" params={{ id: vehicle.id }} className="font-semibold text-primary">{vehicle.model}</Link><p className="text-xs text-muted-foreground">{vehicle.variant}</p></td>
          <td className="px-5 py-4 text-sm text-muted-foreground">{branchName(vehicle.branchId)}</td>
          <td className="px-5 py-4 text-sm">{dealerName(vehicle.dealerId)}</td>
          <td className="px-5 py-4 text-sm text-muted-foreground">{vehicle.chassis}</td>
          <td className="px-5 py-4 text-sm">{vehicle.colour}</td>
          <td className="px-5 py-4 font-semibold">{formatCurrency(vehicle.sellingPrice)}</td>
          <td className="px-5 py-4"><StatusBadge status={vehicle.status}/></td>
        </tr>)}</tbody></table></GlassCard>}
  </div>;
}

export function VehicleDetailPage({ id }: { id: string }) {
  const store = useStore();
  const vehicle = store.vehicles.find((entry) => entry.id === id) ?? store.vehicles[0];
  if (!vehicle) return null;
  const dealer = store.dealers.find((entry) => entry.id === vehicle.dealerId);
  return <div className="space-y-6">
    <PageHeader eyebrow={`${vehicle.id} · ${branchName(vehicle.branchId)}`} title={vehicle.model} description={`${vehicle.variant} · ${vehicle.colour}`} actions={<><StatusBadge status={vehicle.status}/><Button variant="outline" asChild><EditLink basePath="/inventory" id={vehicle.id}><Pencil/> Edit</EditLink></Button></>}/>
    <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
      <GlassCard className="p-6"><h2 className="font-display text-lg font-bold">Vehicle information</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2">{[["Chassis number", vehicle.chassis], ["Engine number", vehicle.engine], ["Branch", branchName(vehicle.branchId)], ["Dealer", dealer?.name ?? "—"], ["Purchase price", formatCurrency(vehicle.purchasePrice)], ["Selling price", formatCurrency(vehicle.sellingPrice)]].map(([label, value]) => <div key={label}><dt className="text-xs uppercase text-muted-foreground">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}</dl></GlassCard>
      <GlassCard className="p-6"><h2 className="font-display text-lg font-bold">Dealer & purchase</h2>{dealer ? <dl className="mt-5 space-y-4">{[["Dealer", dealer.name], ["Contact person", dealer.contactPerson], ["Phone", dealer.phone], ["GST", dealer.gst]].map(([label, value]) => <div key={label}><dt className="text-xs uppercase text-muted-foreground">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}</dl> : <p className="mt-4 text-sm text-muted-foreground">No dealer linked to this vehicle.</p>}</GlassCard>
    </div>
  </div>;
}

export function RefinancePage() { return <ListPage type="refinance"/>; }

export function DeliveriesPage() {
  const rows = useScopedRecords("deliveries");
  return <div className="space-y-6">
    <PageHeader title="Deliveries" description="Readiness updates automatically from connected stages." actions={<Button asChild><Link to="/deliveries/new"><Plus/> Schedule Delivery</Link></Button>}/>
    <div className="grid gap-5 lg:grid-cols-2">{rows.map((row, index) => <GlassCard key={row.id} className="p-6">
      <div className="flex items-start justify-between"><div><h2 className="font-display text-xl font-bold">{row.primary}</h2><p className="text-sm text-muted-foreground">{row.secondary}</p><p className="mt-1 text-xs text-primary">{row.detail} · {branchName(row.branchId)}</p></div><div className="flex items-center gap-2"><StatusBadge status={row.status}/><Button variant="ghost" size="icon" asChild><EditLink basePath="/deliveries" id={row.id}><Pencil className="size-4"/></EditLink></Button></div></div>
      <div className="my-5 grid grid-cols-2 gap-2">{["Payment", "Finance", "Insurance", "Registration"].map((item, i) => <div key={item} className="flex items-center gap-2 rounded-lg bg-muted/70 p-2 text-xs font-semibold"><span className={i === 3 && row.status === "Blocked" ? "text-warning" : "text-success"}>{i === 3 && row.status === "Blocked" ? "!" : "✓"}</span>{item}</div>)}</div>
      {row.status === "Blocked" ? <div className="rounded-xl bg-warning-soft p-3 text-sm font-semibold text-warning">Registration pending. Delivery cannot be completed.</div> : <Button className="w-full" asChild><Link to="/deliveries/$id" params={{ id: row.id }}>Complete Delivery {index === 0 ? "" : ""}</Link></Button>}
    </GlassCard>)}</div>
  </div>;
}

export function DeliveryDetailPage({ id = "DEL-2026-0081" }: { id?: string }) {
  const [checked, setChecked] = useState([true, true, true, true, false, false, false, false]);
  const complete = checked.every(Boolean);
  return <div className="mx-auto max-w-3xl space-y-6">
    <PageHeader eyebrow={id} title="Delivery Checklist" description="Complete every prerequisite before handover."/>
    <GlassCard className="p-6">
      <div className="space-y-3">{["Payment completed", "Finance completed", "Insurance completed", "Registration completed", "Vehicle inspection (PDI)", "Accessories fitted", "Documents handed over", "Customer acknowledgement"].map((item, index) => <label key={item} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 hover:bg-primary-soft"><Checkbox checked={checked[index] ?? false} onCheckedChange={(value) => setChecked((items) => items.map((current, i) => (i === index ? Boolean(value) : current)))}/><span className="font-medium">{item}</span>{checked[index] && <Check className="ml-auto size-4 text-success"/>}</label>)}</div>
      <Dialog><DialogTrigger asChild><Button className="mt-6 w-full" size="lg" disabled={!complete}>Complete Delivery</Button></DialogTrigger>
        <DialogContent><DialogHeader><DialogTitle>Complete this delivery?</DialogTitle><DialogDescription>This will mark the vehicle as delivered and close the customer journey.</DialogDescription></DialogHeader><DialogFooter><Button onClick={() => toast.success("Delivery completed")}>Confirm Delivery</Button></DialogFooter></DialogContent>
      </Dialog>
    </GlassCard>
  </div>;
}

export function AccountsPage({ monthly = false }: { monthly?: boolean }) {
  const session = useSession();
  const store = useStore();
  const entries = store.ledger.filter((entry) => session.inScope(entry.branchId));
  const income = entries.filter((entry) => entry.kind === "income").reduce((sum, entry) => sum + entry.amount, 0);
  const expense = entries.filter((entry) => entry.kind === "expense").reduce((sum, entry) => sum + entry.amount, 0);

  return <div className="space-y-6">
    <PageHeader eyebrow={session.branchName} title={monthly ? "Monthly Summary" : "Accounts"} description="Booking charges and petrol offers post here automatically — no duplicate entry." actions={<Button asChild><Link to="/accounts/new"><Plus/> New Transaction</Link></Button>}/>
    <div className="grid gap-4 md:grid-cols-3">
      <KpiCard label="Total Income" value={formatCurrency(income)} trend="Auto + manual" icon={<TrendingUp/>}/>
      <KpiCard label="Total Expenses" value={formatCurrency(expense)} trend="Within plan" icon={<WalletCards/>}/>
      <KpiCard label="Net" value={formatCurrency(income - expense)} trend="Healthy" icon={<CircleDollarSign/>}/>
    </div>
    <GlassCard className="p-6"><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-lg font-bold">Income vs Expense</h2><StatusBadge status="Auto-updated" tone="success"/></div><Suspense fallback={<div className="h-72 w-full animate-pulse rounded-xl bg-muted/50"/>}><AccountsChart/></Suspense></GlassCard>
    <GlassCard className="overflow-hidden">
      <div className="border-b border-border/70 p-4"><h2 className="font-display text-lg font-bold">Transactions</h2><p className="text-sm text-muted-foreground">Entries marked auto come straight from booking requirements.</p></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr>{["Date", "Type", "Category", "Branch", "Booking", "Amount"].map((head) => <th key={head} className="px-5 py-3.5">{head}</th>)}</tr></thead>
        <tbody>{entries.map((entry) => <tr key={entry.id} className="border-t border-border/55">
          <td className="px-5 py-4 text-sm text-muted-foreground">{entry.date}</td>
          <td className="px-5 py-4"><StatusBadge status={entry.kind === "income" ? "Income" : "Expense"} tone={entry.kind === "income" ? "success" : "danger"}/></td>
          <td className="px-5 py-4 text-sm font-semibold">{entry.category}{entry.auto ? <span className="ml-2 rounded-md bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">AUTO</span> : null}</td>
          <td className="px-5 py-4 text-sm text-muted-foreground">{branchName(entry.branchId)}</td>
          <td className="px-5 py-4 text-sm">{entry.bookingId ? <Link to="/bookings/$id" params={{ id: entry.bookingId }} className="font-semibold text-primary">{entry.bookingId}</Link> : "—"}</td>
          <td className={`px-5 py-4 text-right font-semibold ${entry.kind === "income" ? "text-success" : "text-destructive"}`}>{formatCurrency(entry.amount)}</td>
        </tr>)}</tbody></table></div>
    </GlassCard>
  </div>;
}

export function ReportsPage() {
  return <div className="space-y-6">
    <PageHeader title="Reports" description="Operational and financial intelligence for the selected branch scope." actions={<><Button variant="outline"><Printer/> Print</Button><Button variant="outline"><FileSpreadsheet/> Excel</Button><Button><Download/> PDF</Button></>}/>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{[["Sales", ["Daily sales", "Monthly sales", "Model-wise sales", "Cash vs finance"]], ["Finance", ["Applications", "Approved & rejected", "Disbursed", "NBFC-wise"]], ["Inventory", ["Available", "Booked", "Sold", "Dealer-wise stock"]], ["Operations", ["Pending insurance", "Pending registration", "Pending delivery", "Follow-ups"]]].map(([title, links]) => <GlassCard key={title as string} className="p-5"><h2 className="font-display text-lg font-bold">{title as string}</h2><div className="mt-4 space-y-1">{(links as string[]).map((link) => <button key={link} onClick={() => toast.success(`${link} report ready`)} className="flex w-full items-center justify-between rounded-lg p-2 text-left text-sm hover:bg-primary-soft hover:text-primary">{link}<ChevronRight className="size-4"/></button>)}</div></GlassCard>)}</div>
    <AccountsPage monthly/>
  </div>;
}

export function SettingsPage() {
  const session = useSession();
  const cards: [string, string, typeof Settings, string][] = [
    ["Showroom information", "Business name, GST, address and branding", Settings, "/settings"],
    ["Users", "Team access and account status", Users, "/settings/users"],
    ["Roles & permissions", "Control operational access by role", ShieldCheck, "/settings/roles"],
    ["Vehicle master", "Models, variants and colours", Bike, "/settings/master-data"],
  ];
  const ownerCards: [string, string, typeof Settings, string][] = [
    ["Dealers", "Vehicle purchase sources", Boxes, "/masters"],
    ["Staff", "Team records, branch and role", Users, "/masters"],
    ["Partners", "Investors and ownership", Handshake, "/masters"],
    ["Insurance & finance providers", "Master lists used across transactions", Landmark, "/masters"],
  ];
  return <div className="space-y-6">
    <PageHeader title="Settings" description="Configure your showroom, team, partners, and operating preferences."/>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[...cards, ...(session.isOwner ? ownerCards : [])].map(([title, detail, Icon, to]) => <GlassCard key={title} className="p-5">
      <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary"><Icon/></span>
      <h2 className="mt-5 font-display text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      <Button variant="ghost" className="mt-4 px-0 text-primary" asChild><Link to={to}>Manage <ChevronRight/></Link></Button>
    </GlassCard>)}</div>
  </div>;
}
