import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bike, FileText, Gift, Plus, Repeat2, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GlassCard, PageHeader, StatusBadge } from "@/components/shared";
import { AreaField, NumberField, SelectField, SummaryRow, TextField, YesNo } from "@/components/form-kit";
import { CustomerCamera } from "@/components/customer-camera";
import { formatCurrency, lineAmount, type BookingDetail, type ExchangeVehicle, type OfferType, type ProformaOffer } from "@/lib/domain";
import { vehicleModels } from "@/lib/masters";
import { useSession } from "@/lib/branch-context";
import { nextId, useStore } from "@/lib/store";

const offerTypes: OfferType[] = ["Fittings", "Helmet", "Seat Cover", "Bike Cover", "Petrol", "Other"];

const emptyExchange = (): ExchangeVehicle => ({ id: nextId("BX"), vehicleType: "Motorcycle", manufacturer: "", model: "", variant: "", registrationNumber: "", year: "", approxValue: 0, expectedValue: 0, remarks: "" });

export function BookingForm({ mode = "new", id }: { mode?: "new" | "edit"; id?: string }) {
  const navigate = useNavigate();
  const session = useSession();
  const store = useStore();
  const existing = id ? store.bookings.find((entry) => entry.id === id) : undefined;

  const scopedProformas = useMemo(() => store.proformas.filter((entry) => session.inScope(entry.branchId)), [session, store.proformas]);
  const [proformaId, setProformaId] = useState(existing?.proformaId ?? "");
  const proforma = store.proformas.find((entry) => entry.id === proformaId);

  const [customerId, setCustomerId] = useState(existing?.customerId ?? "");
  const [photo, setPhoto] = useState(existing?.customerPhoto ?? "");
  const [lines, setLines] = useState(existing?.vehicles ?? []);
  const [offers, setOffers] = useState<ProformaOffer[]>(existing?.offers ?? []);
  const [discounts, setDiscounts] = useState(existing?.discounts ?? []);
  const [exchanges, setExchanges] = useState<ExchangeVehicle[]>(existing?.exchanges ?? []);
  const [nominee, setNominee] = useState(existing?.nominee ?? { name: "", age: "", phone: "", relation: "" });
  const [requirements, setRequirements] = useState(existing?.requirements ?? {
    specialNumber: false, specialNumberValue: "", specialNumberCharge: 0,
    affidavit: false, affidavitRemarks: "", affidavitCharge: 0,
    fittings: false, fittingsDetails: "", fittingsAmount: 0,
    petrolOffer: 0, petrolRemarks: "", expectedDelivery: "",
  });
  const [advance, setAdvance] = useState(existing?.advance ?? 0);
  const [financeProviderId, setFinanceProviderId] = useState(existing?.financeProviderId ?? "");
  const [insuranceProviderId, setInsuranceProviderId] = useState(existing?.insuranceProviderId ?? "");
  const [status, setStatus] = useState("Booked");
  const [carried, setCarried] = useState(Boolean(existing?.proformaId));

  const customer = store.customers.find((entry) => entry.id === customerId);
  const scopedCustomers = store.customers.filter((entry) => session.scopeId === null || entry.branchIds.includes(session.scopeId));

  const carryForward = (selectedId: string) => {
    setProformaId(selectedId);
    const source = store.proformas.find((entry) => entry.id === selectedId);
    if (!source) return;
    setCustomerId(source.customerId);
    setLines(source.vehicles);
    setOffers(source.offers);
    setDiscounts(source.discounts);
    setExchanges(source.exchanges);
    const petrol = source.offers.find((offer) => offer.type === "Petrol");
    const fittings = source.offers.find((offer) => offer.type === "Fittings");
    setRequirements((current) => ({
      ...current,
      petrolOffer: petrol?.value ?? current.petrolOffer,
      petrolRemarks: petrol?.remarks ?? current.petrolRemarks,
      fittings: Boolean(fittings) || current.fittings,
      fittingsDetails: fittings?.remarks ?? current.fittingsDetails,
      fittingsAmount: fittings?.value ?? current.fittingsAmount,
    }));
    setCarried(true);
    toast.success(`Details carried forward from ${selectedId}`);
  };

  const vehicleTotal = lines.reduce((sum, line) => sum + lineAmount(line), 0);
  const discountTotal = discounts.reduce((sum, entry) => sum + entry.amount, 0);
  const extras = (requirements.specialNumber ? requirements.specialNumberCharge : 0) + (requirements.affidavit ? requirements.affidavitCharge : 0) + (requirements.fittings ? requirements.fittingsAmount : 0);
  const payable = Math.max(vehicleTotal - discountTotal + extras + (proforma?.otherCharges ?? 0), 0);
  const balance = Math.max(payable - advance, 0);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!customer) { toast.error("Select the customer for this booking"); return; }
    if (lines.length === 0) { toast.error("Add at least one vehicle"); return; }
    const branchId = session.scopeId ?? customer.branchIds[0] ?? "BR01";
    const bookingId = existing?.id ?? `BK-2026-${String(126 + store.bookings.length).padStart(5, "0")}`;
    const detail: BookingDetail = {
      id: bookingId, branchId, customerId: customer.id, vehicles: lines, offers, discounts, exchanges,
      nominee, requirements, advance,
      ...(proformaId ? { proformaId } : {}),
      ...(photo ? { customerPhoto: photo } : {}),
      ...(financeProviderId ? { financeProviderId } : {}),
      ...(insuranceProviderId ? { insuranceProviderId } : {}),
    };
    const first = lines[0]!;
    store.saveBooking(detail, {
      id: bookingId, branchId, primary: customer.name,
      secondary: `${first.model} ${first.variant} · ${first.colour}`.trim(),
      detail: requirements.expectedDelivery ? `Expected delivery ${requirements.expectedDelivery}` : "Booking created",
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status, amount: payable,
    });
    toast.success(`${bookingId} saved — linked accounts entries updated automatically`);
    navigate({ to: "/bookings/$id", params: { id: bookingId } });
  };

  return <div className="mx-auto max-w-6xl space-y-6">
    <PageHeader
      {...(mode === "edit" && id ? { eyebrow: id } : {})}
      title={mode === "edit" ? "Edit Booking" : "New Booking"}
      description="Start from a proforma — vehicles, offers, discounts and exchange details carry forward and stay editable."
      actions={<Button variant="outline" asChild><Link to="/bookings"><ArrowLeft/> Back</Link></Button>}
    />

    <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[1.55fr_0.75fr]">
      <div className="space-y-5">
        <GlassCard className="ambient-highlight p-6">
          <div className="flex items-center gap-2"><FileText className="size-5 text-primary"/><h2 className="font-display text-lg font-bold">Start from a proforma</h2></div>
          <p className="mt-1 text-sm text-muted-foreground">Flow: Proforma → Follow-up → Booking. Pick the quotation this booking came from.</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <SelectField label="Proforma invoice" value={proformaId} onChange={carryForward} placeholder="Select proforma" options={scopedProformas.map((entry) => ({ value: entry.id, label: `${entry.id} · ${store.customers.find((c) => c.id === entry.customerId)?.name ?? ""}` }))}/>
            <SelectField label="Customer" value={customerId} onChange={setCustomerId} placeholder="Select customer" options={scopedCustomers.map((entry) => ({ value: entry.id, label: `${entry.name} · ${entry.phone}` }))}/>
          </div>
          {carried && <div className="mt-4 flex items-center gap-2 rounded-xl border border-success/20 bg-success-soft p-3 text-sm font-semibold text-success">
            <StatusBadge status="Carried forward" tone="success"/> Information carried forward from {proformaId} — edit anything below.
          </div>}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2"><UserRound className="size-5 text-primary"/><h2 className="font-display text-lg font-bold">Customer photo</h2></div>
          <p className="mt-1 text-sm text-muted-foreground">Capture a live photo with the device camera, or upload one if the camera is unavailable.</p>
          <div className="mt-5 max-w-sm"><CustomerCamera photo={photo} onChange={setPhoto}/></div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><Bike className="size-5 text-primary"/><h2 className="font-display text-lg font-bold">Vehicles</h2></div>
            <Button type="button" variant="outline" size="sm" onClick={() => setLines((current) => [...current, { id: nextId("BV"), model: "", variant: "", colour: "", quantity: 1, unitPrice: 0, discount: 0 }])}><Plus/> Add Vehicle</Button>
          </div>
          <div className="mt-5 space-y-4">
            {lines.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Select a proforma above, or add a vehicle manually.</p>}
            {lines.map((line, index) => <div key={line.id} className="rounded-2xl border border-border/70 bg-background/50 p-4">
              <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-primary">Vehicle {index + 1}</span>
                <Button type="button" variant="ghost" size="icon" aria-label="Remove vehicle" onClick={() => setLines((current) => current.filter((entry) => entry.id !== line.id))}><Trash2 className="size-4 text-destructive"/></Button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <SelectField label="Model" value={line.model} onChange={(value) => setLines((current) => current.map((entry) => (entry.id === line.id ? { ...entry, model: value } : entry)))} options={vehicleModels.map((entry) => ({ value: entry.model, label: entry.model }))}/>
                <TextField label="Variant" value={line.variant} onChange={(value) => setLines((current) => current.map((entry) => (entry.id === line.id ? { ...entry, variant: value } : entry)))}/>
                <TextField label="Colour" value={line.colour} onChange={(value) => setLines((current) => current.map((entry) => (entry.id === line.id ? { ...entry, colour: value } : entry)))}/>
                <NumberField label="Quantity" value={line.quantity} onChange={(value) => setLines((current) => current.map((entry) => (entry.id === line.id ? { ...entry, quantity: Math.max(value, 1) } : entry)))}/>
                <NumberField label="Unit price" value={line.unitPrice} onChange={(value) => setLines((current) => current.map((entry) => (entry.id === line.id ? { ...entry, unitPrice: value } : entry)))}/>
                <NumberField label="Line discount" value={line.discount} onChange={(value) => setLines((current) => current.map((entry) => (entry.id === line.id ? { ...entry, discount: value } : entry)))}/>
              </div>
            </div>)}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><Gift className="size-5 text-primary"/><h2 className="font-display text-lg font-bold">Offers</h2></div>
            <Button type="button" variant="outline" size="sm" onClick={() => setOffers((current) => [...current, { id: nextId("BO"), type: "Helmet", value: 0, remarks: "" }])}><Plus/> Add Offer</Button>
          </div>
          <div className="mt-5 space-y-4">
            {offers.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No offers on this booking.</p>}
            {offers.map((offer) => <div key={offer.id} className="grid gap-4 rounded-2xl border border-border/70 bg-background/50 p-4 md:grid-cols-[1fr_1fr_1.4fr_auto]">
              <SelectField label="Offer" value={offer.type} onChange={(value) => setOffers((current) => current.map((entry) => (entry.id === offer.id ? { ...entry, type: value as OfferType } : entry)))} options={offerTypes.map((value) => ({ value, label: value }))}/>
              <NumberField label="Value (₹)" value={offer.value} onChange={(value) => setOffers((current) => current.map((entry) => (entry.id === offer.id ? { ...entry, value } : entry)))}/>
              <TextField label="Remarks" value={offer.remarks} onChange={(value) => setOffers((current) => current.map((entry) => (entry.id === offer.id ? { ...entry, remarks: value } : entry)))}/>
              <div className="flex items-end"><Button type="button" variant="ghost" size="icon" aria-label="Remove offer" onClick={() => setOffers((current) => current.filter((entry) => entry.id !== offer.id))}><Trash2 className="size-4 text-destructive"/></Button></div>
            </div>)}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="font-display text-lg font-bold">Nominee details</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <TextField label="Nominee name" value={nominee.name} onChange={(value) => setNominee({ ...nominee, name: value })}/>
            <TextField label="Age" value={nominee.age} onChange={(value) => setNominee({ ...nominee, age: value })}/>
            <TextField label="Phone number" value={nominee.phone} onChange={(value) => setNominee({ ...nominee, phone: value })}/>
            <SelectField label="Relation" value={nominee.relation} onChange={(value) => setNominee({ ...nominee, relation: value })} options={["Spouse", "Father", "Mother", "Son", "Daughter", "Brother", "Sister", "Other"].map((value) => ({ value, label: value }))}/>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="font-display text-lg font-bold">Customer requirements</h2>
          <p className="mt-1 text-sm text-muted-foreground">Charges here flow straight into Accounts — no re-entry needed.</p>
          <div className="mt-5 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <YesNo label="Special registration number required?" value={requirements.specialNumber} onChange={(value) => setRequirements({ ...requirements, specialNumber: value })}/>
              {requirements.specialNumber && <>
                <TextField label="Requested number" value={requirements.specialNumberValue} placeholder="TN 09 BM 0007" onChange={(value) => setRequirements({ ...requirements, specialNumberValue: value })}/>
                <NumberField label="Charge (₹) → Booking Income" value={requirements.specialNumberCharge} onChange={(value) => setRequirements({ ...requirements, specialNumberCharge: value })}/>
              </>}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <YesNo label="Registration done by affidavit?" value={requirements.affidavit} onChange={(value) => setRequirements({ ...requirements, affidavit: value })}/>
              {requirements.affidavit && <>
                <TextField label="Affidavit remarks" value={requirements.affidavitRemarks} onChange={(value) => setRequirements({ ...requirements, affidavitRemarks: value })}/>
                <NumberField label="Charge (₹) → Booking Income" value={requirements.affidavitCharge} onChange={(value) => setRequirements({ ...requirements, affidavitCharge: value })}/>
              </>}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <YesNo label="Vehicle fittings required?" value={requirements.fittings} onChange={(value) => setRequirements({ ...requirements, fittings: value })}/>
              {requirements.fittings && <>
                <TextField label="Fittings details" value={requirements.fittingsDetails} onChange={(value) => setRequirements({ ...requirements, fittingsDetails: value })}/>
                <NumberField label="Amount (₹) → Booking Income" value={requirements.fittingsAmount} onChange={(value) => setRequirements({ ...requirements, fittingsAmount: value })}/>
              </>}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <NumberField label="Petrol offer (₹) → Booking Expense" value={requirements.petrolOffer} onChange={(value) => setRequirements({ ...requirements, petrolOffer: value })}/>
              <TextField label="Petrol remarks" value={requirements.petrolRemarks} onChange={(value) => setRequirements({ ...requirements, petrolRemarks: value })}/>
              <TextField label="Expected delivery date" type="date" value={requirements.expectedDelivery} onChange={(value) => setRequirements({ ...requirements, expectedDelivery: value })}/>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><Repeat2 className="size-5 text-primary"/><h2 className="font-display text-lg font-bold">Exchange vehicles</h2></div>
            <Button type="button" variant="outline" size="sm" onClick={() => setExchanges((current) => [...current, emptyExchange()])}><Plus/> Add Exchange Vehicle</Button>
          </div>
          <div className="mt-5 space-y-4">
            {exchanges.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No exchange vehicle on this booking.</p>}
            {exchanges.map((exchange, index) => <div key={exchange.id} className="rounded-2xl border border-border/70 bg-background/50 p-4">
              <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-primary">Exchange {index + 1}</span>
                <Button type="button" variant="ghost" size="icon" aria-label="Remove exchange vehicle" onClick={() => setExchanges((current) => current.filter((entry) => entry.id !== exchange.id))}><Trash2 className="size-4 text-destructive"/></Button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {([["Vehicle type", "vehicleType"], ["Manufacturer", "manufacturer"], ["Model", "model"], ["Variant", "variant"], ["Registration number", "registrationNumber"], ["Manufacturing year", "year"]] as const).map(([label, key]) =>
                  <TextField key={key} label={label} value={exchange[key]} onChange={(value) => setExchanges((current) => current.map((entry) => (entry.id === exchange.id ? { ...entry, [key]: value } : entry)))}/>)}
                <NumberField label="Approximate value" value={exchange.approxValue} onChange={(value) => setExchanges((current) => current.map((entry) => (entry.id === exchange.id ? { ...entry, approxValue: value } : entry)))}/>
                <NumberField label="Expected exchange value" value={exchange.expectedValue} onChange={(value) => setExchanges((current) => current.map((entry) => (entry.id === exchange.id ? { ...entry, expectedValue: value } : entry)))}/>
                <AreaField label="Remarks" className="md:col-span-3" value={exchange.remarks} onChange={(value) => setExchanges((current) => current.map((entry) => (entry.id === exchange.id ? { ...entry, remarks: value } : entry)))}/>
              </div>
            </div>)}
          </div>
        </GlassCard>
      </div>

      <aside className="space-y-5">
        <GlassCard className="sticky top-24 p-6">
          <h2 className="font-display text-lg font-bold">Booking summary</h2>
          <div className="mt-4">
            <SummaryRow label="Vehicle amount" value={formatCurrency(vehicleTotal)}/>
            <SummaryRow label="Discounts" value={`− ${formatCurrency(discountTotal)}`} tone="danger"/>
            <SummaryRow label="Requirement charges" value={formatCurrency(extras)}/>
            <SummaryRow label="Total payable" value={formatCurrency(payable)} strong/>
            <SummaryRow label="Advance" value={formatCurrency(advance)} tone="success"/>
            <SummaryRow label="Balance" value={formatCurrency(balance)} strong/>
          </div>
          <div className="mt-5 grid gap-4">
            <NumberField label="Booking advance (₹)" value={advance} onChange={setAdvance}/>
            <SelectField label="Finance provider" value={financeProviderId} onChange={setFinanceProviderId} options={store.financeProviders.map((entry) => ({ value: entry.id, label: entry.name }))}/>
            <SelectField label="Insurance provider" value={insuranceProviderId} onChange={setInsuranceProviderId} options={store.insuranceProviders.map((entry) => ({ value: entry.id, label: entry.name }))}/>
            <SelectField label="Booking status" value={status} onChange={setStatus} options={["Booked", "Finance Pending", "Insurance Pending", "Registration Pending", "Ready for Delivery", "Delivered"].map((value) => ({ value, label: value }))}/>
          </div>
          <div className="mt-6 grid gap-2">
            <Button type="submit">Save Booking</Button>
            <Button type="button" variant="outline" asChild><Link to="/bookings">Cancel</Link></Button>
          </div>
        </GlassCard>
      </aside>
    </form>
  </div>;
}
