import type { Branch, Dealer, Partner, ProviderRecord, Staff } from "./domain";

export const company = "SRIVAARI AUTOMOBILES";

export const branches: Branch[] = [
  { id: "BR01", name: "Velachery Main Showroom", code: "VLC", city: "Chennai", address: "18, Taramani Link Road, Velachery, Chennai – 600042", phone: "044-4567 1200", status: "Active" },
  { id: "BR02", name: "Ambattur Branch", code: "AMB", city: "Chennai", address: "7, MTH Road, Ambattur, Chennai – 600053", phone: "044-4567 1300", status: "Active" },
  { id: "BR03", name: "Tambaram Branch", code: "TMB", city: "Chennai", address: "44, GST Road, Tambaram, Chennai – 600045", phone: "044-4567 1400", status: "Active" },
];

export const seedDealers: Dealer[] = [
  { id: "DLR-01", name: "TVS Motor Company", contactPerson: "R. Mahesh", phone: "9840011223", email: "mahesh@tvsmotor.com", address: "Hosur, Tamil Nadu", gst: "33AABCT1234K1Z5", status: "Active", remarks: "Primary two-wheeler supplier" },
  { id: "DLR-02", name: "Honda Motorcycle Distributors", contactPerson: "S. Anitha", phone: "9884022334", email: "anitha@hmsi-dist.com", address: "Sriperumbudur, Tamil Nadu", gst: "33AAHCH9876P1Z2", status: "Active", remarks: "Activa & Shine stock" },
  { id: "DLR-03", name: "Suzuki South Distributors", contactPerson: "K. Prabhu", phone: "9790033445", email: "prabhu@suzukisouth.com", address: "Guindy, Chennai", gst: "33AACCS5544R1Z9", status: "Active", remarks: "Access 125 supply" },
];

export const seedStaff: Staff[] = [
  { id: "STF-01", name: "Priya Sundaram", phone: "9840100011", email: "priya@srivaari.com", address: "Velachery, Chennai", role: "Sales Executive", branchId: "BR01", joiningDate: "2024-04-12", status: "Active" },
  { id: "STF-02", name: "Senthil Kumar", phone: "9840100022", email: "senthil@srivaari.com", address: "Ambattur, Chennai", role: "Manager", branchId: "BR02", joiningDate: "2023-01-09", status: "Active" },
  { id: "STF-03", name: "Divya Ramesh", phone: "9840100033", email: "divya@srivaari.com", address: "Tambaram, Chennai", role: "Accounts", branchId: "BR03", joiningDate: "2024-11-02", status: "Active" },
  { id: "STF-04", name: "Mohan Raj", phone: "9840100044", email: "mohan@srivaari.com", address: "Porur, Chennai", role: "Registration Executive", branchId: "BR01", joiningDate: "2025-06-18", status: "Inactive" },
];

export const seedPartners: Partner[] = [
  { id: "PTR-01", name: "S. Kannan", phone: "9840200011", email: "kannan@srivaari.com", address: "Velachery, Chennai", since: "2019-03-01", investment: 4500000, share: "55%", status: "Active", remarks: "Managing partner" },
  { id: "PTR-02", name: "B. Lalitha", phone: "9840200022", email: "lalitha@srivaari.com", address: "Adyar, Chennai", since: "2019-03-01", investment: 3000000, share: "35%", status: "Active", remarks: "Finance & accounts oversight" },
  { id: "PTR-03", name: "V. Ganesan", phone: "9840200033", email: "ganesan@srivaari.com", address: "Tambaram, Chennai", since: "2022-08-15", investment: 900000, share: "10%", status: "Active", remarks: "Silent partner" },
];

export const seedInsuranceProviders: ProviderRecord[] = [
  { id: "INP-01", name: "United India Insurance", contactPerson: "M. Sridhar", phone: "9840300011", email: "sridhar@uiic.co.in", address: "Anna Salai, Chennai", details: "Comprehensive & third party two-wheeler policies", status: "Active", remarks: "Fastest policy issuance" },
  { id: "INP-02", name: "ICICI Lombard", contactPerson: "R. Kavitha", phone: "9840300022", email: "kavitha@icicilombard.com", address: "T Nagar, Chennai", details: "Zero-dep add-on available", status: "Active", remarks: "" },
  { id: "INP-03", name: "TATA AIG", contactPerson: "J. Prakash", phone: "9840300033", email: "prakash@tataaig.com", address: "Guindy, Chennai", details: "Long-term OD packages", status: "Active", remarks: "" },
];

export const seedFinanceProviders: ProviderRecord[] = [
  { id: "FNP-01", name: "TVS Credit", contactPerson: "A. Rajesh", phone: "9840400011", email: "rajesh@tvscredit.com", address: "Velachery, Chennai", details: "12–36 month schemes, 10.5% onwards", status: "Active", remarks: "Same-day approvals" },
  { id: "FNP-02", name: "Cholamandalam Finance", contactPerson: "P. Bhuvana", phone: "9840400022", email: "bhuvana@chola.com", address: "Parrys, Chennai", details: "Up to 90% funding", status: "Active", remarks: "" },
  { id: "FNP-03", name: "Bajaj Finance", contactPerson: "N. Suresh", phone: "9840400033", email: "suresh@bajajfinserv.in", address: "Ambattur, Chennai", details: "Zero down-payment offers", status: "Active", remarks: "" },
  { id: "FNP-04", name: "IDFC FIRST Bank", contactPerson: "T. Vinoth", phone: "9840400044", email: "vinoth@idfcfirst.com", address: "Tambaram, Chennai", details: "Salaried customer schemes", status: "Active", remarks: "" },
];

export const vehicleModels = [
  { model: "TVS Jupiter", variants: ["ZX SmartXonnect", "ZX Drum", "Classic"], colours: ["Starlight Blue", "Titanium Grey", "Pristine White"] },
  { model: "Honda Activa", variants: ["H-Smart", "STD", "DLX"], colours: ["Pearl Siren Blue", "Rebel Red", "Matte Axis Grey"] },
  { model: "TVS Apache RTR 160", variants: ["4V Disc", "2V Drum"], colours: ["Matte Black", "Racing Red", "Pearl White"] },
  { model: "Honda Shine 125", variants: ["Disc", "Drum"], colours: ["Rebel Red", "Black", "Geny Grey"] },
  { model: "Suzuki Access 125", variants: ["Ride Connect", "Standard"], colours: ["Pearl White", "Metallic Grey"] },
];

export const branchName = (id: string) => branches.find((branch) => branch.id === id)?.name ?? "—";
