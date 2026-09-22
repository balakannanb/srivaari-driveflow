import { Link } from "@tanstack/react-router";
import { CalendarCheck, CircleDollarSign, FileText, Landmark, Pencil, Printer, ShieldCheck, Truck, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard, PageHeader, StatusBadge } from "@/components/shared";
import { formatCurrency, journeySteps, lineAmount } from "@/lib/domain";
import { branchName } from "@/lib/masters";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function Section({ title, icon, action, children }: { title: string; icon: ReactNode; action?: ReactNode; children: ReactNode }) {
  return <GlassCard className="p-5">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</span><h2 className="font-display font-bold">{title}</h2></div>
      {action}
    </div>
    <div className="mt-4 space-y-2 text-sm">{children}</div>
  </GlassCard>;
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" | "danger" }) {
  return <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">{label}</span><span className={cn("text-right font-semibold", tone === "success" && "text-success", tone === "danger" && "text-destructive")}>{value}</span></div>;
}

export function BookingView({ id }: { id: string }) {
  const store = useStore();
  const booking = store.bookings.find((entry) => entry.id === id) ?? store.bookings[0];
  if (!booking) return null;
  const customer = store.customers.find((entry) => entry.id === booking.customerId);
  const row = (store.records["bookings"] ?? []).find((entry) => entry.id === booking.id);
  const status = row?.status ?? "Booked";
  const first = booking.vehicles[0];
  const vehicleTotal = booking.vehicles.reduce((sum, line) => sum + lineAmount(line), 0);
  const discountTotal = booking.discounts.reduce((sum, entry) => sum + entry.amount, 0);
  const offersValue = booking.offers.reduce((sum, entry) => sum + entry.value, 0);
  const requirements = booking.requirements;
  const extras = (requirements.specialNumber ? requirements.specialNumberCharge : 0) + (requirements.affidavit ? requirements.affidavitCharge : 0) + (requirements.fittings ? requirements.fittingsAmount : 0);
  const payable = Math.max(vehicleTotal - discountTotal + extras, 0);
  const balance = Math.max(payable - booking.advance, 0);

  const entries = store.ledger.filter((entry) => entry.bookingId === booking.id);
  const income = entries.filter((entry) => entry.kind === "income");
  const expenses = entries.filter((entry) => entry.kind === "expense");

  const financeRow = (store.records["finance"] ?? []).find((entry) => entry.primary === customer?.name);
  const insuranceRow = (store.records["insurance"] ?? []).find((entry) => entry.primary === customer?.name);
  const registrationRow = (store.records["registration"] ?? []).find((entry) => entry.primary === customer?.name);
  const deliveryRow = (store.records["deliveries"] ?? []).find((entry) => entry.primary === customer?.name);

  const stageStatus: Record<string, { state: "done" | "current" | "todo"; note: string }> = {
    Proforma: { state: booking.proformaId ? "done" : "todo", note: booking.proformaId ?? "Not linked" },
    Followup: { state: "done", note: "Completed" },
    Booking: { state: "done", note: booking.id },
    Payment: { state: balance === 0 ? "done" : "current", note: balance === 0 ? "Fully paid" : `${formatCurrency(balance)} balance` },
    Finance: { state: financeRow?.status === "Disbursed" || financeRow?.status === "Approved" ? "done" : financeRow ? "current" : "todo", note: financeRow?.status ?? "Not required" },
    Insurance: { state: insuranceRow?.status === "Policy Issued" ? "done" : insuranceRow ? "current" : "todo", note: insuranceRow?.status ?? "Pending" },
    Registration: { state: registrationRow?.status === "Completed" ? "done" : registrationRow ? "current" : "todo", note: registrationRow?.status ?? "Pending" },
    Delivery: { state: deliveryRow?.status === "Delivered" ? "done" : deliveryRow ? "current" : "todo", note: deliveryRow?.status ?? "Not scheduled" },
  };

  return <div className="space-y-6">
    <PageHeader eyebrow={`${booking.id} · ${branchName(booking.branchId)}`} title={customer?.name ?? "Booking"} description={`${first ? `${first.model} ${first.variant} · ${first.colour}` : "Vehicle"} · ${customer?.phone ?? ""}`}
      actions={<><StatusBadge status={status}/><Button variant="outline" asChild><Link to="/bookings/$id/edit" params={{ id: booking.id }}><Pencil/> Edit</Link></Button><Button variant="outline" onClick={() => window.print()}><Printer/> Print</Button></>}/>

    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr_0.9fr]">
      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          {booking.customerPhoto
            ? <img src={booking.customerPhoto} alt={customer?.name ?? "Customer"} className="size-20 rounded-2xl object-cover"/>
            : <span className="grid size-20 place-items-center rounded-2xl bg-primary-soft text-primary"><UserRound className="size-8"/></span>}
          <div className="min-w-0">
            <p className="font-display text-lg font-bold">{customer?.name}</p>
            <p className="text-sm text-muted-foreground">{customer?.phone}</p>
            <p className="mt-1 text-xs text-muted-foreground">{customer?.location}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{customer?.address}</p>
        {customer && <Button variant="ghost" className="mt-3 px-0 text-primary" asChild><Link to="/customers/$id" params={{ id: customer.id }}>Open customer profile</Link></Button>}
      </GlassCard>

      <div className="brand-gradient rounded-xl border border-primary/20 p-6 text-primary-foreground shadow-soft">
        <p className="text-xs font-bold uppercase opacity-80">Expected delivery</p>
        <p className="mt-2 font-display text-3xl font-bold">{requirements.expectedDelivery || "Not set"}</p>
        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div><p className="opacity-80">Total payable</p><p className="text-lg font-bold">{formatCurrency(payable)}</p></div>
          <div><p className="opacity-80">Balance</p><p className="text-lg font-bold">{formatCurrency(balance)}</p></div>
          <div><p className="opacity-80">Advance</p><p className="text-lg font-bold">{formatCurrency(booking.advance)}</p></div>
          <div><p className="opacity-80">Stage</p><p className="text-lg font-bold">{status}</p></div>
        </div>
      </div>

      <Section title="Booking summary" icon={<CircleDollarSign className="size-4"/>}>
        <Row label="Vehicle amount" value={formatCurrency(vehicleTotal)}/>
        <Row label="Discount" value={`− ${formatCurrency(discountTotal)}`} tone="danger"/>
        <Row label="Requirement charges" value={formatCurrency(extras)}/>
        <Row label="Offers value" value={formatCurrency(offersValue)} tone="success"/>
        <Row label="Booking advance" value={formatCurrency(booking.advance)}/>
        <div className="border-t border-border pt-2"><Row label="Balance" value={formatCurrency(balance)}/></div>
      </Section>
    </div>

    <GlassCard className="p-6">
      <h2 className="font-display text-lg font-bold">Workflow timeline</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {journeySteps.map((step) => {
          const entry = stageStatus[step]!;
          return <div key={step} className={cn("rounded-2xl border p-4", entry.state === "done" && "border-success/25 bg-success-soft", entry.state === "current" && "border-primary/30 bg-primary-soft", entry.state === "todo" && "border-border bg-background/60")}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{step}</span>
              <span className={cn("grid size-6 place-items-center rounded-full text-xs font-bold", entry.state === "done" && "bg-success text-primary-foreground", entry.state === "current" && "bg-primary text-primary-foreground", entry.state === "todo" && "bg-muted text-muted-foreground")}>{entry.state === "done" ? "✓" : entry.state === "current" ? "●" : "○"}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{entry.note}</p>
          </div>;
        })}
      </div>
    </GlassCard>

    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <Section title="Customer requirements" icon={<FileText className="size-4"/>}>
        <Row label="Special number" value={requirements.specialNumber ? `${requirements.specialNumberValue || "Yes"} · ${formatCurrency(requirements.specialNumberCharge)}` : "No"}/>
        <Row label="Affidavit registration" value={requirements.affidavit ? `Yes · ${formatCurrency(requirements.affidavitCharge)}` : "No"}/>
        <Row label="Fittings" value={requirements.fittings ? `${requirements.fittingsDetails || "Yes"} · ${formatCurrency(requirements.fittingsAmount)}` : "No"}/>
        <Row label="Petrol offer" value={requirements.petrolOffer ? formatCurrency(requirements.petrolOffer) : "—"}/>
      </Section>

      <Section title="Vehicles & offers" icon={<Truck className="size-4"/>}>
        {booking.vehicles.map((line) => <Row key={line.id} label={`${line.model} ${line.variant} × ${line.quantity}`} value={formatCurrency(lineAmount(line))}/>)}
        {booking.offers.length === 0 ? <p className="text-muted-foreground">No offers</p> : booking.offers.map((offer) => <Row key={offer.id} label={`Offer · ${offer.type}`} value={offer.value ? formatCurrency(offer.value) : offer.remarks || "Included"}/>)}
      </Section>

      <Section title="Exchange vehicle" icon={<Truck className="size-4"/>}>
        {booking.exchanges.length === 0 ? <p className="text-muted-foreground">No exchange vehicle on this booking.</p> : booking.exchanges.map((exchange) => <div key={exchange.id} className="rounded-xl border border-border/70 p-3">
          <p className="font-semibold">{exchange.manufacturer} {exchange.model}</p>
          <p className="text-xs text-muted-foreground">{exchange.registrationNumber} · {exchange.year}</p>
          <p className="mt-1 text-sm">Exchange value: <strong>{formatCurrency(exchange.expectedValue)}</strong></p>
        </div>)}
      </Section>

      <Section title="Nominee" icon={<UserRound className="size-4"/>}>
        {booking.nominee.name ? <>
          <Row label="Name" value={booking.nominee.name}/>
          <Row label="Age" value={booking.nominee.age || "—"}/>
          <Row label="Phone" value={booking.nominee.phone || "—"}/>
          <Row label="Relation" value={booking.nominee.relation || "—"}/>
        </> : <p className="text-muted-foreground">No nominee recorded.</p>}
      </Section>

      <Section title="Finance" icon={<Landmark className="size-4"/>} action={financeRow ? <StatusBadge status={financeRow.status}/> : null}>
        <Row label="Provider" value={store.financeProviders.find((entry) => entry.id === booking.financeProviderId)?.name ?? "Cash purchase"}/>
        <Row label="Loan amount" value={financeRow?.amount ? formatCurrency(financeRow.amount) : "—"}/>
        {financeRow && <Button variant="ghost" className="px-0 text-primary" asChild><Link to="/finance/applications/$id" params={{ id: financeRow.id }}>Open application</Link></Button>}
      </Section>

      <Section title="Insurance" icon={<ShieldCheck className="size-4"/>} action={insuranceRow ? <StatusBadge status={insuranceRow.status}/> : null}>
        <Row label="Provider" value={store.insuranceProviders.find((entry) => entry.id === booking.insuranceProviderId)?.name ?? "Not selected"}/>
        <Row label="Premium" value={insuranceRow?.amount ? formatCurrency(insuranceRow.amount) : "—"}/>
        {insuranceRow ? <Button variant="ghost" className="px-0 text-primary" asChild><Link to="/insurance/$id" params={{ id: insuranceRow.id }}>Open policy</Link></Button>
          : <Button variant="outline" size="sm" asChild><Link to="/insurance/new">Process insurance</Link></Button>}
      </Section>

      <Section title="Registration" icon={<FileText className="size-4"/>} action={registrationRow ? <StatusBadge status={registrationRow.status}/> : null}>
        <Row label="RTO" value={registrationRow?.secondary ?? "Pending"}/>
        <Row label="Number" value={registrationRow?.detail ?? "Awaiting allotment"}/>
        {registrationRow ? <Button variant="ghost" className="px-0 text-primary" asChild><Link to="/registration/$id" params={{ id: registrationRow.id }}>Open registration</Link></Button>
          : <Button variant="outline" size="sm" asChild><Link to="/registration/new">Start registration</Link></Button>}
      </Section>

      <Section title="Delivery" icon={<CalendarCheck className="size-4"/>} action={deliveryRow ? <StatusBadge status={deliveryRow.status}/> : null}>
        <Row label="Expected date" value={requirements.expectedDelivery || "Not set"}/>
        <Row label="Current status" value={deliveryRow?.status ?? "Not scheduled"}/>
        {deliveryRow ? <Button variant="ghost" className="px-0 text-primary" asChild><Link to="/deliveries/$id" params={{ id: deliveryRow.id }}>Open delivery</Link></Button>
          : <Button variant="outline" size="sm" asChild><Link to="/deliveries/new">Schedule delivery</Link></Button>}
      </Section>

      <Section title="Booking accounts" icon={<CircleDollarSign className="size-4"/>} action={<Button variant="ghost" size="sm" asChild><Link to="/accounts">Open accounts</Link></Button>}>
        <p className="text-xs font-bold uppercase text-muted-foreground">Income</p>
        {income.length === 0 ? <p className="text-muted-foreground">No income recorded.</p> : income.map((entry) => <Row key={entry.id} label={`${entry.category}${entry.auto ? " (auto)" : ""}`} value={formatCurrency(entry.amount)} tone="success"/>)}
        <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">Expenses</p>
        {expenses.length === 0 ? <p className="text-muted-foreground">No expenses recorded.</p> : expenses.map((entry) => <Row key={entry.id} label={`${entry.category}${entry.auto ? " (auto)" : ""}`} value={formatCurrency(entry.amount)} tone="danger"/>)}
      </Section>

      <Section title="Documents" icon={<FileText className="size-4"/>}>
        {["Proforma invoice", "Booking receipt", "Customer ID proof", "Finance documents", "Insurance policy", "Registration papers"].map((doc) => <Row key={doc} label={doc} value={doc === "Proforma invoice" && booking.proformaId ? booking.proformaId : "Attached"}/>)}
      </Section>
    </div>
  </div>;
}
