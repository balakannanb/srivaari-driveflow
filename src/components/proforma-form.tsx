import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bike, Gift, Plus, Repeat2, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GlassCard, PageHeader } from "@/components/shared";
import { AreaField, NumberField, SelectField, SummaryRow, TextField } from "@/components/form-kit";
import { formatCurrency, lineAmount, type ExchangeVehicle, type OfferType, type ProformaDetail, type ProformaDiscount, type ProformaOffer, type ProformaVehicleLine } from "@/lib/domain";
import { vehicleModels } from "@/lib/masters";
import { useSession } from "@/lib/branch-context";
import { nextId, useStore } from "@/lib/store";

const offerTypes: OfferType[] = ["Fittings", "Helmet", "Seat Cover", "Bike Cover", "Petrol", "Other"];

const emptyLine = (): ProformaVehicleLine => ({ id: nextId("PV"), model: "", variant: "", colour: "", quantity: 1, unitPrice: 0, discount: 0 });
const emptyExchange = (): ExchangeVehicle => ({ id: nextId("PX"), vehicleType: "Motorcycle", manufacturer: "", model: "", variant: "", registrationNumber: "", year: "", approxValue: 0, expectedValue: 0, remarks: "" });

export function ProformaForm({ mode = "new", id }: { mode?: "new" | "edit"; id?: string }) {
  const navigate = useNavigate();
  const session = useSession();
  const store = useStore();
  const existing = id ? store.proformas.find((entry) => entry.id === id) : undefined;

  const [customerId, setCustomerId] = useState(existing?.customerId ?? "");
  const [status, setStatus] = useState("Draft");
  const [lines, setLines] = useState<ProformaVehicleLine[]>(existing ? existing.vehicles : [emptyLine()]);
  const [offers, setOffers] = useState<ProformaOffer[]>(existing ? existing.offers : []);
  const [discounts, setDiscounts] = useState<ProformaDiscount[]>(existing ? existing.discounts : []);
  const [exchanges, setExchanges] = useState<ExchangeVehicle[]>(existing ? existing.exchanges : []);
  const [otherCharges, setOtherCharges] = useState(existing?.otherCharges ?? 0);

  const scopedCustomers = useMemo(() => store.customers.filter((customer) => session.scopeId === null || customer.branchIds.includes(session.scopeId)), [session.scopeId, store.customers]);

  const subtotal = lines.reduce((sum, line) => sum + lineAmount(line), 0);
  const discountTotal = discounts.reduce((sum, entry) => sum + entry.amount, 0);
  const offersValue = offers.reduce((sum, entry) => sum + entry.value, 0);
  const exchangeValue = exchanges.reduce((sum, entry) => sum + entry.expectedValue, 0);
  const grandTotal = Math.max(subtotal - discountTotal + otherCharges, 0);

  const patchLine = (lineId: string, patch: Partial<ProformaVehicleLine>) => setLines((current) => current.map((line) => (line.id === lineId ? { ...line, ...patch } : line)));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const customer = store.customers.find((entry) => entry.id === customerId);
    if (!customer) { toast.error("Select a customer for this proforma"); return; }
    if (!lines.some((line) => line.model)) { toast.error("Add at least one vehicle"); return; }
    const branchId = session.scopeId ?? customer.branchIds[0] ?? "BR01";
    const proformaId = existing?.id ?? `PI-2026-${String(126 + store.proformas.length).padStart(5, "0")}`;
    const detail: ProformaDetail = { id: proformaId, branchId, customerId: customer.id, vehicles: lines, offers, discounts, exchanges, otherCharges };
    const first = lines[0]!;
    store.saveProforma(detail, {
      id: proformaId, branchId, primary: customer.name,
      secondary: `${first.model} ${first.variant}`.trim() + (lines.length > 1 ? ` +${lines.length - 1} more` : ""),
      detail: `${offers.length} offers · ${exchanges.length} exchange`, date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: status || "Draft", amount: grandTotal,
    });
    toast.success(`${proformaId} saved — follow-ups and bookings can now reuse it`);
    navigate({ to: "/proforma" });
  };

  return <div className="mx-auto max-w-6xl space-y-6">
    <PageHeader
      {...(mode === "edit" && id ? { eyebrow: id } : {})}
      title={mode === "edit" ? "Edit Proforma Invoice" : "New Proforma Invoice"}
      description="Quote one or many vehicles, record offers, discounts and exchange vehicles — everything carries forward to the booking."
      actions={<Button variant="outline" asChild><Link to="/proforma"><ArrowLeft/> Back</Link></Button>}
    />

    <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[1.55fr_0.75fr]">
      <div className="space-y-5">
        <GlassCard className="p-6">
          <h2 className="font-display text-lg font-bold">Customer</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pick a saved customer — details flow into the booking automatically.</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <SelectField label="Customer" value={customerId} onChange={setCustomerId} placeholder="Search saved customers" options={scopedCustomers.map((customer) => ({ value: customer.id, label: `${customer.name} · ${customer.phone}` }))}/>
            <SelectField label="Status" value={status} onChange={setStatus} options={["Draft", "Sent", "Accepted", "Expired"].map((value) => ({ value, label: value }))}/>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Branch: <strong className="text-foreground">{session.branchName}</strong></p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><Bike className="size-5 text-primary"/><h2 className="font-display text-lg font-bold">Vehicles</h2></div>
            <Button type="button" variant="outline" size="sm" onClick={() => setLines((current) => [...current, emptyLine()])}><Plus/> Add Vehicle</Button>
          </div>
          <div className="mt-5 space-y-4">
            {lines.map((line, index) => <div key={line.id} className="rounded-2xl border border-border/70 bg-background/50 p-4">
              <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-primary">Vehicle {index + 1}</span>
                {lines.length > 1 && <Button type="button" variant="ghost" size="icon" aria-label="Remove vehicle" onClick={() => setLines((current) => current.filter((entry) => entry.id !== line.id))}><Trash2 className="size-4 text-destructive"/></Button>}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <SelectField label="Model" value={line.model} onChange={(value) => patchLine(line.id, { model: value, variant: "", colour: "" })} options={vehicleModels.map((entry) => ({ value: entry.model, label: entry.model }))}/>
                <SelectField label="Variant" value={line.variant} onChange={(value) => patchLine(line.id, { variant: value })} options={(vehicleModels.find((entry) => entry.model === line.model)?.variants ?? []).map((value) => ({ value, label: value }))}/>
                <SelectField label="Colour" value={line.colour} onChange={(value) => patchLine(line.id, { colour: value })} options={(vehicleModels.find((entry) => entry.model === line.model)?.colours ?? []).map((value) => ({ value, label: value }))}/>
                <NumberField label="Quantity" value={line.quantity} onChange={(value) => patchLine(line.id, { quantity: Math.max(value, 1) })}/>
                <NumberField label="Unit price" value={line.unitPrice} onChange={(value) => patchLine(line.id, { unitPrice: value })}/>
                <NumberField label="Line discount" value={line.discount} onChange={(value) => patchLine(line.id, { discount: value })}/>
              </div>
              <p className="mt-4 text-right text-sm">Amount <strong className="ml-2 text-base">{formatCurrency(lineAmount(line))}</strong></p>
            </div>)}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><Gift className="size-5 text-primary"/><h2 className="font-display text-lg font-bold">Offers</h2></div>
            <Button type="button" variant="outline" size="sm" onClick={() => setOffers((current) => [...current, { id: nextId("PO"), type: "Fittings", value: 0, remarks: "" }])}><Plus/> Add Offer</Button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Items or services given to the customer — these do not reduce the payable amount.</p>
          <div className="mt-5 space-y-4">
            {offers.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No offers added yet.</p>}
            {offers.map((offer) => <div key={offer.id} className="grid gap-4 rounded-2xl border border-border/70 bg-background/50 p-4 md:grid-cols-[1fr_1fr_1.4fr_auto]">
              <SelectField label="Offer" value={offer.type} onChange={(value) => setOffers((current) => current.map((entry) => (entry.id === offer.id ? { ...entry, type: value as OfferType } : entry)))} options={offerTypes.map((value) => ({ value, label: value }))}/>
              <NumberField label={offer.type === "Petrol" ? "Petrol value (₹)" : "Value (₹)"} value={offer.value} onChange={(value) => setOffers((current) => current.map((entry) => (entry.id === offer.id ? { ...entry, value } : entry)))}/>
              <TextField label="Details / remarks" value={offer.remarks} placeholder="Free full tank, ISI helmet..." onChange={(value) => setOffers((current) => current.map((entry) => (entry.id === offer.id ? { ...entry, remarks: value } : entry)))}/>
              <div className="flex items-end"><Button type="button" variant="ghost" size="icon" aria-label="Remove offer" onClick={() => setOffers((current) => current.filter((entry) => entry.id !== offer.id))}><Trash2 className="size-4 text-destructive"/></Button></div>
            </div>)}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><Tag className="size-5 text-primary"/><h2 className="font-display text-lg font-bold">Discounts</h2></div>
            <Button type="button" variant="outline" size="sm" onClick={() => setDiscounts((current) => [...current, { id: nextId("PD"), type: "Festive discount", amount: 0, reason: "" }])}><Plus/> Add Discount</Button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Money off — discounts reduce what the customer pays.</p>
          <div className="mt-5 space-y-4">
            {discounts.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No discounts added yet.</p>}
            {discounts.map((discount) => <div key={discount.id} className="grid gap-4 rounded-2xl border border-border/70 bg-background/50 p-4 md:grid-cols-[1fr_1fr_1.4fr_auto]">
              <SelectField label="Discount type" value={discount.type} onChange={(value) => setDiscounts((current) => current.map((entry) => (entry.id === discount.id ? { ...entry, type: value } : entry)))} options={["Festive discount", "Corporate discount", "Loyalty discount", "Exchange bonus", "Manager approval"].map((value) => ({ value, label: value }))}/>
              <NumberField label="Amount (₹)" value={discount.amount} onChange={(value) => setDiscounts((current) => current.map((entry) => (entry.id === discount.id ? { ...entry, amount: value } : entry)))}/>
              <TextField label="Reason / remarks" value={discount.reason} onChange={(value) => setDiscounts((current) => current.map((entry) => (entry.id === discount.id ? { ...entry, reason: value } : entry)))}/>
              <div className="flex items-end"><Button type="button" variant="ghost" size="icon" aria-label="Remove discount" onClick={() => setDiscounts((current) => current.filter((entry) => entry.id !== discount.id))}><Trash2 className="size-4 text-destructive"/></Button></div>
            </div>)}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><Repeat2 className="size-5 text-primary"/><h2 className="font-display text-lg font-bold">Exchange vehicles</h2></div>
            <Button type="button" variant="outline" size="sm" onClick={() => setExchanges((current) => [...current, emptyExchange()])}><Plus/> Add Exchange Vehicle</Button>
          </div>
          <div className="mt-5 space-y-4">
            {exchanges.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No exchange vehicle. You can also add one later at booking.</p>}
            {exchanges.map((exchange, index) => <div key={exchange.id} className="rounded-2xl border border-border/70 bg-background/50 p-4">
              <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-primary">Exchange {index + 1}</span>
                <Button type="button" variant="ghost" size="icon" aria-label="Remove exchange vehicle" onClick={() => setExchanges((current) => current.filter((entry) => entry.id !== exchange.id))}><Trash2 className="size-4 text-destructive"/></Button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {([
                  ["Vehicle type", "vehicleType"], ["Manufacturer", "manufacturer"], ["Model", "model"],
                  ["Variant", "variant"], ["Registration number", "registrationNumber"], ["Manufacturing year", "year"],
                ] as const).map(([label, key]) => <TextField key={key} label={label} value={exchange[key]} onChange={(value) => setExchanges((current) => current.map((entry) => (entry.id === exchange.id ? { ...entry, [key]: value } : entry)))}/>)}
                <NumberField label="Approximate value" value={exchange.approxValue} onChange={(value) => setExchanges((current) => current.map((entry) => (entry.id === exchange.id ? { ...entry, approxValue: value } : entry)))}/>
                <NumberField label="Expected exchange value" value={exchange.expectedValue} onChange={(value) => setExchanges((current) => current.map((entry) => (entry.id === exchange.id ? { ...entry, expectedValue: value } : entry)))}/>
                <AreaField label="Remarks" value={exchange.remarks} className="md:col-span-3" onChange={(value) => setExchanges((current) => current.map((entry) => (entry.id === exchange.id ? { ...entry, remarks: value } : entry)))}/>
              </div>
            </div>)}
          </div>
        </GlassCard>
      </div>

      <aside className="space-y-5">
        <GlassCard className="sticky top-24 p-6">
          <h2 className="font-display text-lg font-bold">Quotation summary</h2>
          <div className="mt-4">
            <SummaryRow label="Vehicle subtotal" value={formatCurrency(subtotal)}/>
            <SummaryRow label="Discounts" value={`− ${formatCurrency(discountTotal)}`} tone="danger"/>
            <SummaryRow label="Other charges" value={formatCurrency(otherCharges)}/>
            <SummaryRow label="Offers value (free)" value={formatCurrency(offersValue)} tone="success"/>
            <SummaryRow label="Exchange value" value={formatCurrency(exchangeValue)}/>
            <SummaryRow label="Grand total" value={formatCurrency(grandTotal)} strong/>
          </div>
          <div className="mt-5"><NumberField label="Other charges (₹)" value={otherCharges} onChange={setOtherCharges}/></div>
          <div className="mt-6 grid gap-2">
            <Button type="submit">Save Proforma</Button>
            <Button type="button" variant="outline" asChild><Link to="/proforma">Cancel</Link></Button>
          </div>
        </GlassCard>
      </aside>
    </form>
  </div>;
}
