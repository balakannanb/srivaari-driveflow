import type { Customer, NotificationItem, RecordRow, SearchRecord, Vehicle } from "./domain";

export const customers: Customer[] = [
  { id: "CUS-00125", name: "Ravi Kumar", phone: "9876543210", email: "ravi.kumar@gmail.com", location: "Velachery, Chennai", address: "18, Taramani Link Road, Velachery, Chennai – 600042", stage: "Registration", lastActivity: "10 min ago" },
  { id: "CUS-00124", name: "Suresh Babu", phone: "9840123456", email: "suresh.babu@gmail.com", location: "Tambaram, Chennai", address: "44, GST Road, Tambaram, Chennai – 600045", stage: "Finance", lastActivity: "35 min ago" },
  { id: "CUS-00123", name: "Arun Prakash", phone: "9940578123", email: "arun.p@gmail.com", location: "Ambattur, Chennai", address: "7, MTH Road, Ambattur, Chennai – 600053", stage: "Booking", lastActivity: "Yesterday" },
  { id: "CUS-00122", name: "Karthik Raj", phone: "9790812365", email: "karthik.raj@gmail.com", location: "Avadi, Chennai", address: "21, CTH Road, Avadi, Chennai – 600054", stage: "Delivered", lastActivity: "2 days ago" },
  { id: "CUS-00121", name: "Vignesh Kumar", phone: "9884012345", email: "vignesh.k@gmail.com", location: "Porur, Chennai", address: "5, Kundrathur Road, Porur, Chennai – 600116", stage: "Enquiry", lastActivity: "3 days ago" },
];

export const vehicles: Vehicle[] = [
  { id: "VEH-2401", model: "TVS Jupiter", variant: "ZX SmartXonnect", colour: "Starlight Blue", chassis: "MD626AG48R1K42175", engine: "AG4KR184921", purchasePrice: 95800, sellingPrice: 108450, status: "Available" },
  { id: "VEH-2402", model: "Honda Activa", variant: "H-Smart", colour: "Pearl Siren Blue", chassis: "ME4JF913KRW128643", engine: "JF91E829143", purchasePrice: 99000, sellingPrice: 112800, status: "Reserved" },
  { id: "VEH-2403", model: "TVS Apache RTR 160", variant: "4V Disc", colour: "Matte Black", chassis: "MD634BE61R2P18429", engine: "BE6PR429818", purchasePrice: 129000, sellingPrice: 146320, status: "Booked" },
  { id: "VEH-2404", model: "Honda Shine 125", variant: "Disc", colour: "Rebel Red", chassis: "ME4JC853RKW118442", engine: "JC85E391144", purchasePrice: 87500, sellingPrice: 98450, status: "In Transit" },
  { id: "VEH-2405", model: "Suzuki Access 125", variant: "Ride Connect", colour: "Pearl White", chassis: "MB8DP12AR8126483", engine: "AF21R912673", purchasePrice: 101500, sellingPrice: 114900, status: "Available" },
];

export const records: Record<string, RecordRow[]> = {
  enquiries: [
    { id: "ENQ-2026-0142", primary: "Vignesh Kumar", secondary: "9884012345", detail: "Yamaha FZ · follow-up today", date: "12 Sep 2026", status: "Follow-up Due" },
    { id: "ENQ-2026-0141", primary: "Meena Lakshmi", secondary: "9962014587", detail: "TVS Jupiter · Priya S", date: "12 Sep 2026", status: "Open" },
    { id: "ENQ-2026-0140", primary: "Pradeep Anand", secondary: "9841198702", detail: "Honda Activa · Senthil", date: "11 Sep 2026", status: "Converted" },
  ],
  proforma: [
    { id: "PI-2026-00125", primary: "Ravi Kumar", secondary: "TVS Jupiter ZX", detail: "Finance · Cholamandalam", date: "12 Sep 2026", status: "Accepted", amount: 108450 },
    { id: "PI-2026-00124", primary: "Arun Prakash", secondary: "TVS Apache RTR 160", detail: "Full cash", date: "11 Sep 2026", status: "Draft", amount: 146320 },
  ],
  bookings: [
    { id: "BK-2026-00125", primary: "Ravi Kumar", secondary: "TVS Jupiter ZX · Black", detail: "Finance · Registration stage", date: "12 Sep 2026", status: "Registration Pending", amount: 108450 },
    { id: "BK-2026-00124", primary: "Suresh Babu", secondary: "Honda Activa H-Smart", detail: "Finance · Insurance stage", date: "12 Sep 2026", status: "Insurance Pending", amount: 112800 },
    { id: "BK-2026-00123", primary: "Arun Prakash", secondary: "TVS Apache RTR 160", detail: "Cash · ready today", date: "11 Sep 2026", status: "Ready for Delivery", amount: 146320 },
  ],
  finance: [
    { id: "FIN-2026-0088", primary: "Suresh Babu", secondary: "Cholamandalam Finance", detail: "Honda Activa · 24 months", date: "12 Sep 2026", status: "Under Review", amount: 82000 },
    { id: "FIN-2026-0087", primary: "Ravi Kumar", secondary: "TVS Credit", detail: "TVS Jupiter · 18 months", date: "11 Sep 2026", status: "Approved", amount: 78000 },
    { id: "FIN-2026-0086", primary: "Karthik Raj", secondary: "IDFC FIRST Bank", detail: "Honda Shine · 24 months", date: "10 Sep 2026", status: "Disbursed", amount: 70000 },
  ],
  refinance: [
    { id: "REF-2026-0017", primary: "Dinesh Kumar", secondary: "Bajaj Finance → Shriram Finance", detail: "Outstanding ₹64,000", date: "12 Sep 2026", status: "Documents Pending", amount: 90000 },
    { id: "REF-2026-0016", primary: "Saravanan M", secondary: "TVS Credit → Chola", detail: "Outstanding ₹42,500", date: "09 Sep 2026", status: "Approved", amount: 72000 },
  ],
  insurance: [
    { id: "INS-2026-0312", primary: "Ravi Kumar", secondary: "United India Insurance", detail: "TVS Jupiter · policy pending", date: "12 Sep 2026", status: "Policy Issued", amount: 6840 },
    { id: "INS-2026-0311", primary: "Suresh Babu", secondary: "ICICI Lombard", detail: "Honda Activa · quote requested", date: "12 Sep 2026", status: "Requested", amount: 7210 },
  ],
  registration: [
    { id: "REG-2026-0198", primary: "Ravi Kumar", secondary: "TN-09 RTO", detail: "Application TN09/2026/89142", date: "12 Sep 2026", status: "Processing" },
    { id: "REG-2026-0197", primary: "Arun Prakash", secondary: "TN-13 RTO", detail: "TN 13 BM 4821", date: "11 Sep 2026", status: "Completed" },
  ],
  deliveries: [
    { id: "DEL-2026-0081", primary: "Arun Prakash", secondary: "TVS Apache RTR 160", detail: "BK-2026-00123 · 11:30 AM", date: "Today", status: "Ready" },
    { id: "DEL-2026-0082", primary: "Ravi Kumar", secondary: "TVS Jupiter ZX", detail: "BK-2026-00125 · registration pending", date: "Today", status: "Blocked" },
  ],
};

const pad = (value: number) => String(value).padStart(5, "0");

export function addCustomer(input: { name: string; phone: string; email?: string; address?: string; location?: string }): Customer {
  const existing = customers.find((entry) => entry.phone === input.phone);
  if (existing) return existing;
  const customer: Customer = {
    id: `CUS-${pad(customers.length + 126)}`,
    name: input.name,
    phone: input.phone,
    email: input.email || "",
    location: input.location || "Chennai",
    address: input.address || "",
    stage: "Booking",
    lastActivity: "Just now",
  };
  customers.unshift(customer);
  return customer;
}

export function addVehicleRequirement(input: { model: string; variant?: string; colour?: string; sellingPrice?: number }): Vehicle {
  const vehicle: Vehicle = {
    id: `VEH-${2405 + vehicles.length}`,
    model: input.model,
    variant: input.variant || "—",
    colour: input.colour || "—",
    chassis: "Awaiting stock",
    engine: "Awaiting stock",
    purchasePrice: 0,
    sellingPrice: input.sellingPrice || 0,
    status: "Requirement",
  };
  vehicles.unshift(vehicle);
  return vehicle;
}

export const searchRecords: SearchRecord[] = [
  { type: "CUSTOMER", id: "CUS-00125", title: "Ravi Kumar", subtitle: "9876543210 · Chennai", href: "/customers/CUS-00125" },
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
  { id: "n4", title: "7 customer follow-ups due today", detail: "View enquiries", tone: "warning", href: "/enquiries" },
];