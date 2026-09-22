import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { BookingDetail, Customer, Dealer, LedgerEntry, Partner, ProformaDetail, ProviderRecord, RecordRow, Staff, Vehicle } from "@/lib/domain";
import { seedDealers, seedFinanceProviders, seedInsuranceProviders, seedPartners, seedStaff } from "@/lib/masters";
import { seedBookings, seedCustomers, seedLedger, seedProformas, seedRecords, seedVehicles } from "@/lib/mock-service";

export type ModuleKey = "proforma" | "followups" | "bookings" | "finance" | "refinance" | "insurance" | "registration" | "deliveries";

let counter = 500;
export const nextId = (prefix: string) => `${prefix}-${++counter}`;

export const today = () => new Date().toISOString().slice(0, 10);

type Store = {
  customers: Customer[];
  vehicles: Vehicle[];
  records: Record<string, RecordRow[]>;
  proformas: ProformaDetail[];
  bookings: BookingDetail[];
  ledger: LedgerEntry[];
  dealers: Dealer[];
  staff: Staff[];
  partners: Partner[];
  insuranceProviders: ProviderRecord[];
  financeProviders: ProviderRecord[];
  addCustomer: (input: { name: string; phone: string; email?: string; address?: string; location?: string; branchId: string; photo?: string }) => Customer;
  addVehicle: (vehicle: Vehicle) => void;
  addRecord: (key: string, row: RecordRow) => void;
  saveProforma: (detail: ProformaDetail, row: RecordRow) => void;
  saveBooking: (detail: BookingDetail, row: RecordRow) => void;
  addLedgerEntry: (entry: LedgerEntry) => void;
  saveMaster: (key: "dealers" | "staff" | "partners" | "insuranceProviders" | "financeProviders", record: Dealer | Staff | Partner | ProviderRecord) => void;
};

const StoreContext = createContext<Store | null>(null);

const pad = (value: number) => String(value).padStart(5, "0");

/** Booking-driven automatic accounts entries. Recomputed whenever a booking is saved. */
function autoEntriesFor(booking: BookingDetail): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  const requirements = booking.requirements;
  const date = today();
  if (requirements.specialNumber && requirements.specialNumberCharge > 0)
    entries.push({ id: `${booking.id}-AUTO-SPN`, branchId: booking.branchId, kind: "income", category: "Special Registration Number charge", amount: requirements.specialNumberCharge, date, bookingId: booking.id, notes: requirements.specialNumberValue, auto: true });
  if (requirements.affidavit && requirements.affidavitCharge > 0)
    entries.push({ id: `${booking.id}-AUTO-AFF`, branchId: booking.branchId, kind: "income", category: "Affidavit", amount: requirements.affidavitCharge, date, bookingId: booking.id, notes: requirements.affidavitRemarks, auto: true });
  if (requirements.fittings && requirements.fittingsAmount > 0)
    entries.push({ id: `${booking.id}-AUTO-FIT`, branchId: booking.branchId, kind: "income", category: "Fittings Payment", amount: requirements.fittingsAmount, date, bookingId: booking.id, notes: requirements.fittingsDetails, auto: true });
  if (requirements.petrolOffer > 0)
    entries.push({ id: `${booking.id}-AUTO-PET`, branchId: booking.branchId, kind: "expense", category: "Petrol Offer", amount: requirements.petrolOffer, date, bookingId: booking.id, notes: requirements.petrolRemarks, auto: true });
  return entries;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(seedVehicles);
  const [records, setRecords] = useState<Record<string, RecordRow[]>>(seedRecords);
  const [proformas, setProformas] = useState<ProformaDetail[]>(seedProformas);
  const [bookings, setBookings] = useState<BookingDetail[]>(seedBookings);
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => [...seedLedger, ...seedBookings.flatMap(autoEntriesFor)]);
  const [dealers, setDealers] = useState<Dealer[]>(seedDealers);
  const [staff, setStaff] = useState<Staff[]>(seedStaff);
  const [partners, setPartners] = useState<Partner[]>(seedPartners);
  const [insuranceProviders, setInsuranceProviders] = useState<ProviderRecord[]>(seedInsuranceProviders);
  const [financeProviders, setFinanceProviders] = useState<ProviderRecord[]>(seedFinanceProviders);

  const addCustomer = useCallback<Store["addCustomer"]>((input) => {
    const existing = customers.find((entry) => entry.phone === input.phone);
    if (existing) {
      if (!existing.branchIds.includes(input.branchId)) {
        const merged: Customer = { ...existing, branchIds: [...existing.branchIds, input.branchId] };
        setCustomers((current) => current.map((entry) => (entry.id === existing.id ? merged : entry)));
        return merged;
      }
      return existing;
    }
    const customer: Customer = {
      id: `CUS-${pad(customers.length + 126)}`,
      name: input.name,
      phone: input.phone,
      email: input.email ?? "",
      location: input.location ?? "Chennai",
      address: input.address ?? "",
      stage: "Proforma",
      lastActivity: "Just now",
      branchIds: [input.branchId],
      ...(input.photo ? { photo: input.photo } : {}),
    };
    setCustomers((current) => [customer, ...current]);
    return customer;
  }, [customers]);

  const addVehicle = useCallback<Store["addVehicle"]>((vehicle) => setVehicles((current) => [vehicle, ...current]), []);

  const addRecord = useCallback<Store["addRecord"]>((key, row) => {
    setRecords((current) => ({ ...current, [key]: [row, ...(current[key] ?? [])] }));
  }, []);

  const saveProforma = useCallback<Store["saveProforma"]>((detail, row) => {
    setProformas((current) => [detail, ...current.filter((entry) => entry.id !== detail.id)]);
    setRecords((current) => ({ ...current, proforma: [row, ...(current["proforma"] ?? []).filter((entry) => entry.id !== row.id)] }));
  }, []);

  const saveBooking = useCallback<Store["saveBooking"]>((detail, row) => {
    setBookings((current) => [detail, ...current.filter((entry) => entry.id !== detail.id)]);
    setRecords((current) => ({ ...current, bookings: [row, ...(current["bookings"] ?? []).filter((entry) => entry.id !== row.id)] }));
    setLedger((current) => [...autoEntriesFor(detail), ...current.filter((entry) => !(entry.auto && entry.bookingId === detail.id))]);
  }, []);

  const addLedgerEntry = useCallback<Store["addLedgerEntry"]>((entry) => setLedger((current) => [entry, ...current]), []);

  const saveMaster = useCallback<Store["saveMaster"]>((key, record) => {
    const update = <T extends { id: string }>(current: T[]) => (current.some((entry) => entry.id === record.id) ? current.map((entry) => (entry.id === record.id ? (record as T) : entry)) : [record as T, ...current]);
    if (key === "dealers") setDealers(update);
    if (key === "staff") setStaff(update);
    if (key === "partners") setPartners(update);
    if (key === "insuranceProviders") setInsuranceProviders(update);
    if (key === "financeProviders") setFinanceProviders(update);
  }, []);

  const value = useMemo<Store>(() => ({
    customers, vehicles, records, proformas, bookings, ledger, dealers, staff, partners, insuranceProviders, financeProviders,
    addCustomer, addVehicle, addRecord, saveProforma, saveBooking, addLedgerEntry, saveMaster,
  }), [addCustomer, addLedgerEntry, addRecord, addVehicle, bookings, customers, dealers, financeProviders, insuranceProviders, ledger, partners, proformas, records, saveBooking, saveMaster, saveProforma, staff, vehicles]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
