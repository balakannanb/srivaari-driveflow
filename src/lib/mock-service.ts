import type { BookingDetail, Customer, LedgerEntry, NotificationItem, ProformaDetail, RecordRow, SearchRecord, Vehicle } from "./domain";

export const seedCustomers: Customer[] = [
  { id: "CUS-00125", name: "Ravi Kumar", phone: "9876543210", email: "ravi.kumar@gmail.com", location: "Velachery, Chennai", address: "18, Taramani Link Road, Velachery, Chennai – 600042", stage: "Registration", lastActivity: "10 min ago", branchIds: ["BR01"] },
  { id: "CUS-00124", name: "Suresh Babu", phone: "9840123456", email: "suresh.babu@gmail.com", location: "Tambaram, Chennai", address: "44, GST Road, Tambaram, Chennai – 600045", stage: "Finance", lastActivity: "35 min ago", branchIds: ["BR03"] },
  { id: "CUS-00123", name: "Arun Prakash", phone: "9940578123", email: "arun.p@gmail.com", location: "Ambattur, Chennai", address: "7, MTH Road, Ambattur, Chennai – 600053", stage: "Booking", lastActivity: "Yesterday", branchIds: ["BR02", "BR01"] },
  { id: "CUS-00122", name: "Karthik Raj", phone: "9790812365", email: "karthik.raj@gmail.com", location: "Avadi, Chennai", address: "21, CTH Road, Avadi, Chennai – 600054", stage: "Delivered", lastActivity: "2 days ago", branchIds: ["BR02"] },
  { id: "CUS-00121", name: "Vignesh Kumar", phone: "9884012345", email: "vignesh.k@gmail.com", location: "Porur, Chennai", address: "5, Kundrathur Road, Porur, Chennai – 600116", stage: "Proforma", lastActivity: "3 days ago", branchIds: ["BR01"] },
];

export const seedVehicles: Vehicle[] = [
  { id: "VEH-2401", branchId: "BR01", model: "TVS Jupiter", variant: "ZX SmartXonnect", colour: "Starlight Blue", chassis: "MD626AG48R1K42175", engine: "AG4KR184921", purchasePrice: 95800, sellingPrice: 108450, status: "Available", dealerId: "DLR-01" },
  { id: "VEH-2402", branchId: "BR01", model: "Honda Activa", variant: "H-Smart", colour: "Pearl Siren Blue", chassis: "ME4JF913KRW128643", engine: "JF91E829143", purchasePrice: 99000, sellingPrice: 112800, status: "Reserved", dealerId: "DLR-02" },
  { id: "VEH-2403", branchId: "BR02", model: "TVS Apache RTR 160", variant: "4V Disc", colour: "Matte Black", chassis: "MD634BE61R2P18429", engine: "BE6PR429818", purchasePrice: 129000, sellingPrice: 146320, status: "Booked", dealerId: "DLR-01" },
  { id: "VEH-2404", branchId: "BR02", model: "Honda Shine 125", variant: "Disc", colour: "Rebel Red", chassis: "ME4JC853RKW118442", engine: "JC85E391144", purchasePrice: 87500, sellingPrice: 98450, status: "In Transit", dealerId: "DLR-02" },
  { id: "VEH-2405", branchId: "BR03", model: "Suzuki Access 125", variant: "Ride Connect", colour: "Pearl White", chassis: "MB8DP12AR8126483", engine: "AF21R912673", purchasePrice: 101500, sellingPrice: 114900, status: "Available", dealerId: "DLR-03" },
  { id: "VEH-2406", branchId: "BR03", model: "TVS Jupiter", variant: "ZX Drum", colour: "Titanium Grey", chassis: "MD626AG48R1K42990", engine: "AG4KR185550", purchasePrice: 92000, sellingPrice: 103900, status: "Available", dealerId: "DLR-01" },
];

export const seedRecords: Record<string, RecordRow[]> = {
  proforma: [
    { id: "PI-2026-00125", branchId: "BR01", primary: "Ravi Kumar", secondary: "TVS Jupiter ZX", detail: "Finance · Cholamandalam", date: "12 Sep 2026", status: "Accepted", amount: 108450 },
    { id: "PI-2026-00124", branchId: "BR02", primary: "Arun Prakash", secondary: "TVS Apache RTR 160", detail: "Full cash", date: "11 Sep 2026", status: "Draft", amount: 146320 },
    { id: "PI-2026-00123", branchId: "BR03", primary: "Suresh Babu", secondary: "Honda Activa H-Smart", detail: "Finance · TVS Credit", date: "11 Sep 2026", status: "Sent", amount: 112800 },
  ],
  followups: [
    { id: "FU-2026-0142", branchId: "BR01", primary: "Vignesh Kumar", secondary: "PI-2026-00125", detail: "Quotation shared · call back today", date: "12 Sep 2026", status: "Follow-up Due" },
    { id: "FU-2026-0141", branchId: "BR02", primary: "Arun Prakash", secondary: "PI-2026-00124", detail: "Comparing finance options", date: "12 Sep 2026", status: "Open" },
    { id: "FU-2026-0140", branchId: "BR03", primary: "Suresh Babu", secondary: "PI-2026-00123", detail: "Converted to booking", date: "11 Sep 2026", status: "Converted" },
  ],
  bookings: [
    { id: "BK-2026-00125", branchId: "BR01", primary: "Ravi Kumar", secondary: "TVS Jupiter ZX · Starlight Blue", detail: "Finance · Registration stage", date: "12 Sep 2026", status: "Registration Pending", amount: 108450 },
    { id: "BK-2026-00124", branchId: "BR03", primary: "Suresh Babu", secondary: "Honda Activa H-Smart", detail: "Finance · Insurance stage", date: "12 Sep 2026", status: "Insurance Pending", amount: 112800 },
    { id: "BK-2026-00123", branchId: "BR02", primary: "Arun Prakash", secondary: "TVS Apache RTR 160", detail: "Cash · ready today", date: "11 Sep 2026", status: "Ready for Delivery", amount: 146320 },
  ],
  finance: [
    { id: "FIN-2026-0088", branchId: "BR03", primary: "Suresh Babu", secondary: "Cholamandalam Finance", detail: "Honda Activa · 24 months", date: "12 Sep 2026", status: "Under Review", amount: 82000 },
    { id: "FIN-2026-0087", branchId: "BR01", primary: "Ravi Kumar", secondary: "TVS Credit", detail: "TVS Jupiter · 18 months", date: "11 Sep 2026", status: "Approved", amount: 78000 },
    { id: "FIN-2026-0086", branchId: "BR02", primary: "Karthik Raj", secondary: "IDFC FIRST Bank", detail: "Honda Shine · 24 months", date: "10 Sep 2026", status: "Disbursed", amount: 70000 },
  ],
  refinance: [
    { id: "REF-2026-0017", branchId: "BR01", primary: "Dinesh Kumar", secondary: "Bajaj Finance → Shriram Finance", detail: "Outstanding ₹64,000", date: "12 Sep 2026", status: "Documents Pending", amount: 90000 },
    { id: "REF-2026-0016", branchId: "BR02", primary: "Saravanan M", secondary: "TVS Credit → Chola", detail: "Outstanding ₹42,500", date: "09 Sep 2026", status: "Approved", amount: 72000 },
  ],
  insurance: [
    { id: "INS-2026-0312", branchId: "BR01", primary: "Ravi Kumar", secondary: "United India Insurance", detail: "TVS Jupiter · policy issued", date: "12 Sep 2026", status: "Policy Issued", amount: 6840 },
    { id: "INS-2026-0311", branchId: "BR03", primary: "Suresh Babu", secondary: "ICICI Lombard", detail: "Honda Activa · quote requested", date: "12 Sep 2026", status: "Requested", amount: 7210 },
  ],
  registration: [
    { id: "REG-2026-0198", branchId: "BR01", primary: "Ravi Kumar", secondary: "TN-09 RTO", detail: "Application TN09/2026/89142", date: "12 Sep 2026", status: "Processing" },
    { id: "REG-2026-0197", branchId: "BR02", primary: "Arun Prakash", secondary: "TN-13 RTO", detail: "TN 13 BM 4821", date: "11 Sep 2026", status: "Completed" },
  ],
  deliveries: [
    { id: "DEL-2026-0081", branchId: "BR02", primary: "Arun Prakash", secondary: "TVS Apache RTR 160", detail: "BK-2026-00123 · 11:30 AM", date: "Today", status: "Ready" },
    { id: "DEL-2026-0082", branchId: "BR01", primary: "Ravi Kumar", secondary: "TVS Jupiter ZX", detail: "BK-2026-00125 · registration pending", date: "Today", status: "Blocked" },
  ],
};

export const seedProformas: ProformaDetail[] = [
  {
    id: "PI-2026-00125", branchId: "BR01", customerId: "CUS-00125",
    vehicles: [{ id: "PV1", model: "TVS Jupiter", variant: "ZX SmartXonnect", colour: "Starlight Blue", quantity: 1, unitPrice: 108450, discount: 2000 }],
    offers: [{ id: "PO1", type: "Helmet", value: 1200, remarks: "ISI helmet" }, { id: "PO2", type: "Petrol", value: 500, remarks: "Full tank at delivery" }],
    discounts: [{ id: "PD1", type: "Festive discount", amount: 2000, reason: "Onam offer" }],
    exchanges: [{ id: "PX1", vehicleType: "Scooter", manufacturer: "Honda", model: "Activa", variant: "5G", registrationNumber: "TN 09 AB 1234", year: "2019", approxValue: 38000, expectedValue: 35000, remarks: "Single owner, good condition" }],
    otherCharges: 1610,
  },
  {
    id: "PI-2026-00124", branchId: "BR02", customerId: "CUS-00123",
    vehicles: [{ id: "PV2", model: "TVS Apache RTR 160", variant: "4V Disc", colour: "Matte Black", quantity: 1, unitPrice: 146320, discount: 0 }],
    offers: [{ id: "PO3", type: "Fittings", value: 2500, remarks: "Crash guard & floor mat" }],
    discounts: [], exchanges: [], otherCharges: 0,
  },
  {
    id: "PI-2026-00123", branchId: "BR03", customerId: "CUS-00124",
    vehicles: [{ id: "PV3", model: "Honda Activa", variant: "H-Smart", colour: "Pearl Siren Blue", quantity: 1, unitPrice: 112800, discount: 1500 }],
    offers: [{ id: "PO4", type: "Seat Cover", value: 800, remarks: "" }],
    discounts: [{ id: "PD2", type: "Corporate discount", amount: 1500, reason: "Employee of partner company" }],
    exchanges: [], otherCharges: 0,
  },
];

const emptyRequirements = {
  specialNumber: false, specialNumberValue: "", specialNumberCharge: 0,
  affidavit: false, affidavitRemarks: "", affidavitCharge: 0,
  fittings: false, fittingsDetails: "", fittingsAmount: 0,
  petrolOffer: 0, petrolRemarks: "", expectedDelivery: "",
};

export const seedBookings: BookingDetail[] = [
  {
    id: "BK-2026-00125", branchId: "BR01", proformaId: "PI-2026-00125", customerId: "CUS-00125",
    vehicles: seedProformas[0]!.vehicles, offers: seedProformas[0]!.offers, discounts: seedProformas[0]!.discounts, exchanges: seedProformas[0]!.exchanges,
    nominee: { name: "Lakshmi Ravi", age: "34", phone: "9876501234", relation: "Spouse" },
    requirements: { ...emptyRequirements, specialNumber: true, specialNumberValue: "TN 09 BM 0007", specialNumberCharge: 500, fittings: true, fittingsDetails: "Crash guard, mobile holder", fittingsAmount: 3000, petrolOffer: 500, petrolRemarks: "Full tank at delivery", expectedDelivery: "2026-09-20" },
    advance: 25000, financeProviderId: "FNP-01", insuranceProviderId: "INP-01",
  },
  {
    id: "BK-2026-00124", branchId: "BR03", proformaId: "PI-2026-00123", customerId: "CUS-00124",
    vehicles: seedProformas[2]!.vehicles, offers: seedProformas[2]!.offers, discounts: seedProformas[2]!.discounts, exchanges: [],
    nominee: { name: "", age: "", phone: "", relation: "" },
    requirements: { ...emptyRequirements, affidavit: true, affidavitRemarks: "Address proof by affidavit", affidavitCharge: 500, expectedDelivery: "2026-09-22" },
    advance: 30000, financeProviderId: "FNP-02", insuranceProviderId: "INP-02",
  },
  {
    id: "BK-2026-00123", branchId: "BR02", proformaId: "PI-2026-00124", customerId: "CUS-00123",
    vehicles: seedProformas[1]!.vehicles, offers: seedProformas[1]!.offers, discounts: [], exchanges: [],
    nominee: { name: "Prakash R", age: "58", phone: "9940511111", relation: "Father" },
    requirements: { ...emptyRequirements, fittings: true, fittingsDetails: "Saree guard", fittingsAmount: 1500, expectedDelivery: "2026-09-15" },
    advance: 50000, insuranceProviderId: "INP-03",
  },
];

export const seedLedger: LedgerEntry[] = [
  { id: "TXN-1001", branchId: "BR01", kind: "income", category: "Vehicle Payment by Customer", amount: 25000, date: "2026-09-12", bookingId: "BK-2026-00125", mode: "UPI", notes: "Booking advance" },
  { id: "TXN-1002", branchId: "BR01", kind: "income", category: "Vehicle Payment by Finance", amount: 78000, date: "2026-09-12", bookingId: "BK-2026-00125", mode: "Bank Transfer", notes: "TVS Credit disbursal" },
  { id: "TXN-1003", branchId: "BR02", kind: "expense", category: "Booking Commission", amount: 1500, date: "2026-09-11", bookingId: "BK-2026-00123", mode: "Cash", notes: "Referral commission" },
  { id: "TXN-1004", branchId: "BR03", kind: "income", category: "Miscellaneous Payment", amount: 900, date: "2026-09-11", mode: "Cash", notes: "Accessory sale" },
];

export const searchRecords: SearchRecord[] = [
  { type: "CUSTOMER", id: "CUS-00125", title: "Ravi Kumar", subtitle: "9876543210 · Velachery", href: "/customers/CUS-00125" },
  { type: "BOOKING", id: "BK-2026-00125", title: "BK-2026-00125", subtitle: "Ravi Kumar · TVS Jupiter ZX", href: "/bookings/BK-2026-00125" },
  { type: "VEHICLE", id: "VEH-2401", title: "TVS Jupiter ZX", subtitle: "Chassis: MD626AG48R1K42175", href: "/inventory/VEH-2401" },
  { type: "FINANCE", id: "FIN-2026-0087", title: "TVS Credit", subtitle: "Approved · ₹78,000", href: "/finance/applications/FIN-2026-0087" },
  { type: "INSURANCE", id: "INS-2026-0312", title: "United India Insurance", subtitle: "Policy issued", href: "/insurance/INS-2026-0312" },
  { type: "REGISTRATION", id: "REG-2026-0198", title: "TN-09 RTO", subtitle: "Application processing", href: "/registration/REG-2026-0198" },
];

export const notifications: NotificationItem[] = [
  { id: "n1", title: "Finance application requires action", detail: "Suresh Babu · 8 min ago", tone: "danger", href: "/finance/applications/FIN-2026-0088" },
  { id: "n2", title: "Registration pending for Ravi Kumar", detail: "BK-2026-00125 · 24 min ago", tone: "warning", href: "/registration/REG-2026-0198" },
  { id: "n3", title: "Insurance policy issued", detail: "Ravi Kumar · 42 min ago", tone: "success", href: "/insurance/INS-2026-0312" },
  { id: "n4", title: "7 customer follow-ups due today", detail: "View follow-ups", tone: "warning", href: "/followups" },
];
