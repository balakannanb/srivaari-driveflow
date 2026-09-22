export type Tone = "info" | "success" | "warning" | "danger" | "neutral";

export type Role = "Owner" | "Manager" | "Sales Executive" | "Accounts";

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  status: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  stage: string;
  lastActivity: string;
  photo?: string;
  branchIds: string[];
}

export interface Vehicle {
  id: string;
  branchId: string;
  model: string;
  variant: string;
  colour: string;
  chassis: string;
  engine: string;
  purchasePrice: number;
  sellingPrice: number;
  status: string;
  dealerId?: string;
}

export interface RecordRow {
  id: string;
  branchId: string;
  primary: string;
  secondary: string;
  detail: string;
  date: string;
  status: string;
  amount?: number;
}

export interface SearchRecord {
  type: "CUSTOMER" | "BOOKING" | "VEHICLE" | "FINANCE" | "INSURANCE" | "REGISTRATION";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  tone: Tone;
  href: string;
}

/* ---------- Masters ---------- */

export interface Dealer {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gst: string;
  status: string;
  remarks: string;
}

export interface Staff {
  id: string;
  name: string;
  photo?: string;
  phone: string;
  email: string;
  address: string;
  role: string;
  branchId: string;
  joiningDate: string;
  status: string;
}

export interface Partner {
  id: string;
  name: string;
  photo?: string;
  phone: string;
  email: string;
  address: string;
  since: string;
  investment: number;
  share: string;
  status: string;
  remarks: string;
}

export interface ProviderRecord {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  details: string;
  status: string;
  remarks: string;
}

/* ---------- Proforma ---------- */

export interface ProformaVehicleLine {
  id: string;
  model: string;
  variant: string;
  colour: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export type OfferType = "Fittings" | "Helmet" | "Seat Cover" | "Bike Cover" | "Petrol" | "Other";

export interface ProformaOffer {
  id: string;
  type: OfferType;
  value: number;
  remarks: string;
}

export interface ProformaDiscount {
  id: string;
  type: string;
  amount: number;
  reason: string;
}

export interface ExchangeVehicle {
  id: string;
  vehicleType: string;
  manufacturer: string;
  model: string;
  variant: string;
  registrationNumber: string;
  year: string;
  approxValue: number;
  expectedValue: number;
  remarks: string;
}

export interface ProformaDetail {
  id: string;
  branchId: string;
  customerId: string;
  vehicles: ProformaVehicleLine[];
  offers: ProformaOffer[];
  discounts: ProformaDiscount[];
  exchanges: ExchangeVehicle[];
  otherCharges: number;
}

/* ---------- Booking ---------- */

export interface Nominee {
  name: string;
  age: string;
  phone: string;
  relation: string;
}

export interface BookingRequirements {
  specialNumber: boolean;
  specialNumberValue: string;
  specialNumberCharge: number;
  affidavit: boolean;
  affidavitRemarks: string;
  affidavitCharge: number;
  fittings: boolean;
  fittingsDetails: string;
  fittingsAmount: number;
  petrolOffer: number;
  petrolRemarks: string;
  expectedDelivery: string;
}

export interface BookingDetail {
  id: string;
  branchId: string;
  proformaId?: string;
  customerId: string;
  customerPhoto?: string;
  vehicles: ProformaVehicleLine[];
  offers: ProformaOffer[];
  discounts: ProformaDiscount[];
  exchanges: ExchangeVehicle[];
  nominee: Nominee;
  requirements: BookingRequirements;
  advance: number;
  financeProviderId?: string;
  insuranceProviderId?: string;
}

/* ---------- Accounts ---------- */

export interface LedgerEntry {
  id: string;
  branchId: string;
  kind: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  bookingId?: string;
  mode?: string;
  notes?: string;
  auto?: boolean;
}

export const incomeCategories = [
  "Vehicle Payment by Customer",
  "Vehicle Payment by Finance",
  "Fittings Payment",
  "Special Registration Number charge",
  "Affidavit",
  "Miscellaneous Payment",
];

export const expenseCategories = ["Booking Commission", "Petrol Offer"];

export const staffRoles = [
  "Manager",
  "Sales Executive",
  "Accounts",
  "Finance Executive",
  "Insurance Executive",
  "Registration Executive",
  "Delivery Staff",
  "Other",
];

export const journeySteps = ["Proforma", "Followup", "Booking", "Payment", "Finance", "Insurance", "Registration", "Delivery"];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export const lineAmount = (line: ProformaVehicleLine) => line.quantity * line.unitPrice - line.discount;

export const toneForStatus = (status: string): Tone => {
  const value = status.toLowerCase();
  if (["approved", "completed", "delivered", "available", "issued", "active", "ready"].some((word) => value.includes(word))) return "success";
  if (["rejected", "lost", "blocked", "overdue", "inactive"].some((word) => value.includes(word))) return "danger";
  if (["pending", "review", "processing", "submitted", "reserved", "transit", "requirement", "awaiting stock"].some((word) => value.includes(word))) return "warning";
  if (["finance", "booked", "open", "enquiry", "draft", "followup", "follow-up"].some((word) => value.includes(word))) return "info";
  return "neutral";
};
