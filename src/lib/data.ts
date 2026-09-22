// Demo dataset for SRIVAARI AUTOMOBILES.
// Replace with live backend data when the showroom database is connected.

export const branches = [
  { id: "BR01", name: "Srivaari Main Showroom", city: "Madurai", manager: "R. Karthik" },
  { id: "BR02", name: "Srivaari Anna Nagar", city: "Madurai", manager: "S. Deepa" },
  { id: "BR03", name: "Srivaari Dindigul", city: "Dindigul", manager: "M. Vignesh" },
];

export const models = [
  { id: "M01", name: "Pulsar N160", variant: "Dual ABS", colors: ["Racing Red", "Pewter Grey"], exShowroom: 138500, insurance: 9400, rto: 11200 },
  { id: "M02", name: "Apache RTR 160 4V", variant: "Bluetooth", colors: ["Pearl White", "Matte Black"], exShowroom: 129900, insurance: 8900, rto: 10600 },
  { id: "M03", name: "Splendor Plus", variant: "Xtec", colors: ["Black Silver", "Blue"], exShowroom: 82400, insurance: 6200, rto: 6900 },
  { id: "M04", name: "Activa 6G", variant: "Smart", colors: ["Pearl Precious White", "Rebel Red"], exShowroom: 89600, insurance: 6600, rto: 7300 },
  { id: "M05", name: "Royal Enfield Hunter 350", variant: "Metro Rebel", colors: ["Rio White", "Dapper Ash"], exShowroom: 174200, insurance: 11800, rto: 14900 },
];

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  source: string;
  model: string;
  interest: "Cash" | "Finance";
  testRide: string;
  followUp: string;
  status: "New" | "Contacted" | "Test Ride" | "Converted" | "Lost";
  executive: string;
};

export const enquiries: Enquiry[] = [
  { id: "ENQ-2041", name: "Arun Kumar", phone: "98430 11245", source: "Walk-in", model: "Pulsar N160", interest: "Finance", testRide: "22 Sep, 11:00 AM", followUp: "23 Sep", status: "Test Ride", executive: "Priya" },
  { id: "ENQ-2040", name: "Meena Lakshmi", phone: "90032 77810", source: "Referral", model: "Activa 6G", interest: "Cash", testRide: "—", followUp: "22 Sep", status: "Contacted", executive: "Vignesh" },
  { id: "ENQ-2039", name: "S. Rajesh", phone: "94422 30918", source: "Instagram", model: "Hunter 350", interest: "Finance", testRide: "21 Sep, 4:30 PM", followUp: "24 Sep", status: "Converted", executive: "Priya" },
  { id: "ENQ-2038", name: "Fathima Begum", phone: "73739 41020", source: "Phone", model: "Splendor Plus", interest: "Finance", testRide: "—", followUp: "22 Sep", status: "New", executive: "Deepa" },
  { id: "ENQ-2037", name: "K. Mohan Raj", phone: "99406 55120", source: "Walk-in", model: "Apache RTR 160 4V", interest: "Cash", testRide: "20 Sep, 10:15 AM", followUp: "—", status: "Lost", executive: "Vignesh" },
];

export type Booking = {
  id: string;
  customer: string;
  model: string;
  color: string;
  mode: "Cash" | "Finance";
  onRoad: number;
  advance: number;
  balance: number;
  date: string;
  status: "Proforma" | "Confirmed" | "Allotted" | "Delivered";
};

export const bookings: Booking[] = [
  { id: "BK-1182", customer: "S. Rajesh", model: "Hunter 350", color: "Dapper Ash", mode: "Finance", onRoad: 200900, advance: 30000, balance: 170900, date: "21 Sep 2026", status: "Confirmed" },
  { id: "BK-1181", customer: "Anitha R.", model: "Activa 6G", color: "Rebel Red", mode: "Cash", onRoad: 103500, advance: 103500, balance: 0, date: "20 Sep 2026", status: "Delivered" },
  { id: "BK-1180", customer: "Bala Murugan", model: "Pulsar N160", color: "Racing Red", mode: "Finance", onRoad: 159100, advance: 20000, balance: 139100, date: "19 Sep 2026", status: "Allotted" },
  { id: "BK-1179", customer: "T. Suresh", model: "Splendor Plus", color: "Blue", mode: "Finance", onRoad: 95500, advance: 10000, balance: 85500, date: "18 Sep 2026", status: "Proforma" },
];

export type Loan = {
  id: string;
  customer: string;
  nbfc: string;
  type: "New" | "Refinance";
  amount: number;
  tenure: string;
  stage: "Login" | "Documents" | "Approved" | "DO Issued" | "Disbursed";
  docs: { label: string; done: boolean }[];
};

export const loans: Loan[] = [
  {
    id: "LN-563", customer: "S. Rajesh", nbfc: "Bajaj Finance", type: "New", amount: 165000, tenure: "36 months", stage: "Approved",
    docs: [ { label: "Aadhaar", done: true }, { label: "PAN", done: true }, { label: "Bank statement", done: true }, { label: "Income proof", done: false } ],
  },
  {
    id: "LN-562", customer: "Bala Murugan", nbfc: "TVS Credit", type: "New", amount: 130000, tenure: "30 months", stage: "DO Issued",
    docs: [ { label: "Aadhaar", done: true }, { label: "PAN", done: true }, { label: "Bank statement", done: true }, { label: "Income proof", done: true } ],
  },
  {
    id: "LN-561", customer: "T. Suresh", nbfc: "Hero FinCorp", type: "New", amount: 80000, tenure: "24 months", stage: "Documents",
    docs: [ { label: "Aadhaar", done: true }, { label: "PAN", done: false }, { label: "Bank statement", done: false }, { label: "Income proof", done: false } ],
  },
  {
    id: "RF-118", customer: "M. Ilango", nbfc: "Shriram Finance", type: "Refinance", amount: 62000, tenure: "18 months", stage: "Disbursed",
    docs: [ { label: "Original RC", done: true }, { label: "Valuation report", done: true }, { label: "Insurance copy", done: true }, { label: "NOC", done: true } ],
  },
  {
    id: "RF-117", customer: "P. Gowtham", nbfc: "Bajaj Finance", type: "Refinance", amount: 48000, tenure: "18 months", stage: "Login",
    docs: [ { label: "Original RC", done: true }, { label: "Valuation report", done: false }, { label: "Insurance copy", done: false }, { label: "NOC", done: false } ],
  },
];

export type Stock = {
  chassis: string;
  engine: string;
  model: string;
  color: string;
  location: "Showroom" | "Yard" | "Transit";
  ageDays: number;
  status: "Available" | "Allotted" | "Delivered";
  allottedTo?: string;
};

export const stock: Stock[] = [
  { chassis: "MD2A11CY3RWK4821", engine: "JLZWRK1182", model: "Pulsar N160", color: "Racing Red", location: "Showroom", ageDays: 12, status: "Allotted", allottedTo: "BK-1180" },
  { chassis: "MD634KE49R2A7710", engine: "KE4R7710", model: "Apache RTR 160 4V", color: "Matte Black", location: "Showroom", ageDays: 5, status: "Available" },
  { chassis: "MBLHAR074RHC2210", engine: "HAR4RHC2210", model: "Splendor Plus", color: "Blue", location: "Yard", ageDays: 34, status: "Available" },
  { chassis: "ME4JF500KRT01298", engine: "JF50ERT1298", model: "Activa 6G", color: "Rebel Red", location: "Showroom", ageDays: 2, status: "Delivered", allottedTo: "BK-1181" },
  { chassis: "ME3U3S5C1RT004512", engine: "U3S5C4512", model: "Hunter 350", color: "Dapper Ash", location: "Transit", ageDays: 1, status: "Available" },
  { chassis: "MD2A11CY9RWK4477", engine: "JLZWRK4477", model: "Pulsar N160", color: "Pewter Grey", location: "Yard", ageDays: 41, status: "Available" },
];

export type Compliance = {
  booking: string;
  customer: string;
  model: string;
  insurer: string;
  policyNo: string;
  policyStatus: "Pending" | "Issued";
  roadTax: number;
  taxPaid: boolean;
  rtoStage: "Documents" | "Submitted" | "Registered";
  regNo: string;
};

export const compliance: Compliance[] = [
  { booking: "BK-1181", customer: "Anitha R.", model: "Activa 6G", insurer: "ICICI Lombard", policyNo: "IL/2026/884120", policyStatus: "Issued", roadTax: 7300, taxPaid: true, rtoStage: "Registered", regNo: "TN 59 CH 4412" },
  { booking: "BK-1180", customer: "Bala Murugan", model: "Pulsar N160", insurer: "Bajaj Allianz", policyNo: "BA/2026/119045", policyStatus: "Issued", roadTax: 11200, taxPaid: true, rtoStage: "Submitted", regNo: "Awaiting" },
  { booking: "BK-1182", customer: "S. Rajesh", model: "Hunter 350", insurer: "ICICI Lombard", policyNo: "—", policyStatus: "Pending", roadTax: 14900, taxPaid: false, rtoStage: "Documents", regNo: "Awaiting" },
];

export type Delivery = {
  booking: string;
  customer: string;
  model: string;
  slot: string;
  pdi: { label: string; done: boolean }[];
  accessories: string[];
  gatePass: boolean;
  status: "Scheduled" | "Ready" | "Handed Over";
};

export const deliveries: Delivery[] = [
  {
    booking: "BK-1181", customer: "Anitha R.", model: "Activa 6G", slot: "20 Sep, 5:00 PM", gatePass: true, status: "Handed Over",
    accessories: ["Floor mat", "Mobile holder", "Seat cover"],
    pdi: [ { label: "Battery & electricals", done: true }, { label: "Tyre pressure", done: true }, { label: "Fuel & oil level", done: true }, { label: "Paint & scratch check", done: true } ],
  },
  {
    booking: "BK-1180", customer: "Bala Murugan", model: "Pulsar N160", slot: "23 Sep, 11:30 AM", gatePass: false, status: "Ready",
    accessories: ["Crash guard", "Tank pad"],
    pdi: [ { label: "Battery & electricals", done: true }, { label: "Tyre pressure", done: true }, { label: "Fuel & oil level", done: true }, { label: "Paint & scratch check", done: false } ],
  },
  {
    booking: "BK-1182", customer: "S. Rajesh", model: "Hunter 350", slot: "26 Sep, 10:00 AM", gatePass: false, status: "Scheduled",
    accessories: ["Touring mirror", "Engine guard", "Luggage rack"],
    pdi: [ { label: "Battery & electricals", done: false }, { label: "Tyre pressure", done: false }, { label: "Fuel & oil level", done: false }, { label: "Paint & scratch check", done: false } ],
  },
];

export type Voucher = {
  id: string;
  date: string;
  party: string;
  narration: string;
  mode: "Cash" | "Bank" | "UPI";
  debit: number;
  credit: number;
};

export const daybook: Voucher[] = [
  { id: "RV-9012", date: "22 Sep", party: "S. Rajesh", narration: "Booking advance — BK-1182", mode: "UPI", debit: 30000, credit: 0 },
  { id: "RV-9011", date: "22 Sep", party: "Bajaj Finance", narration: "Disbursement — RF-118", mode: "Bank", debit: 62000, credit: 0 },
  { id: "PV-4410", date: "22 Sep", party: "RTO Madurai", narration: "Road tax — BK-1180", mode: "Bank", debit: 0, credit: 11200 },
  { id: "RV-9010", date: "21 Sep", party: "Anitha R.", narration: "Full payment — BK-1181", mode: "Cash", debit: 103500, credit: 0 },
  { id: "PV-4409", date: "21 Sep", party: "ICICI Lombard", narration: "Insurance premium", mode: "Bank", debit: 0, credit: 6600 },
];

export const ledgers = [
  { customer: "S. Rajesh", booking: "BK-1182", billed: 200900, received: 30000, financed: 165000, balance: 5900 },
  { customer: "Bala Murugan", booking: "BK-1180", billed: 159100, received: 20000, financed: 130000, balance: 9100 },
  { customer: "T. Suresh", booking: "BK-1179", billed: 95500, received: 10000, financed: 80000, balance: 5500 },
  { customer: "Anitha R.", booking: "BK-1181", billed: 103500, received: 103500, financed: 0, balance: 0 },
];

export const monthlySales = [
  { month: "Apr", cash: 24, finance: 41 },
  { month: "May", cash: 28, finance: 46 },
  { month: "Jun", cash: 21, finance: 52 },
  { month: "Jul", cash: 30, finance: 49 },
  { month: "Aug", cash: 27, finance: 58 },
  { month: "Sep", cash: 33, finance: 61 },
];

export const users = [
  { name: "R. Karthik", role: "Showroom Manager", branch: "Main Showroom", status: "Active" },
  { name: "Priya S.", role: "Sales Executive", branch: "Main Showroom", status: "Active" },
  { name: "Vignesh M.", role: "Sales Executive", branch: "Dindigul", status: "Active" },
  { name: "Deepa S.", role: "Finance Coordinator", branch: "Anna Nagar", status: "Active" },
  { name: "Ganesh K.", role: "Accountant", branch: "Main Showroom", status: "Inactive" },
];

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
