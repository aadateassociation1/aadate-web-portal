// Mock data for client demonstration mode. All data is realistic Maharashtra
// market yard content. In production, replace with real API calls.

export type UserRole = "owner" | "user_admin" | "main_admin";
export type RegStatus = "pending" | "approved" | "rejected" | "info_required" | "blacklisted";
export type ComplaintStatus =
  | "submitted" | "under_review" | "assigned" | "in_progress"
  | "waiting_info" | "resolved" | "rejected" | "closed" | "reopened";

export interface Owner {
  id: string;
  name: string;
  nameMr: string;
  mobile: string;
  username: string;
  email: string;
  gala: string;
  section: string;
  category: string;
  business: string;
  address: string;
  regDate: string;
  status: RegStatus;
  photo?: string;
}

export interface Complaint {
  id: string;
  ownerId: string;
  ownerName: string;
  gala: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "emergency";
  description: string;
  date: string;
  status: ComplaintStatus;
  assignedTo?: string;
  attachments: number;
  comments: { author: string; role: string; text: string; date: string }[];
}

export interface MarketUpdate {
  id: string;
  title: string;
  titleMr: string;
  category: string;
  summary: string;
  date: string;
  publishedBy: string;
  views: number;
  featured?: boolean;
  emergency?: boolean;
}

export interface Notice {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  date: string;
  attachment: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  type: "image" | "video";
  count: number;
  section: string;
  uploadedBy: "Main Admin" | "User Admin";
  status: "published";
}

export interface MobileChangeRequest {
  id: string;
  ownerName: string;
  gala: string;
  oldMobile: string;
  newMobile: string;
  reason: string;
  date: string;
  status: "pending" | "approved" | "rejected" | "under_review";
}

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  gala?: string;
  photo?: string;
}

export const OWNERS: Owner[] = [
  { id: "GO-001", name: "Ramesh Shinde", nameMr: "रमेश शिंदे", mobile: "9876543210", username: "ramesh.shinde", email: "ramesh@example.com", gala: "A-101", section: "Vegetable Section A", category: "Vegetables", business: "Shinde Vegetable Stores", address: "Gala A-101, Market Yard, Saswad", regDate: "2023-04-12", status: "approved" },
  { id: "GO-002", name: "Suresh Jadhav", nameMr: "सुरेश जाधव", mobile: "9876543211", username: "suresh.jadhav", email: "suresh@example.com", gala: "A-102", section: "Fruit Section A", category: "Fruits", business: "Jadhav Fresh Fruits", address: "Gala A-102, Market Yard, Saswad", regDate: "2023-05-02", status: "approved" },
  { id: "GO-003", name: "Mahesh Pawar", nameMr: "महेश पवार", mobile: "9876543212", username: "mahesh.pawar", email: "mahesh@example.com", gala: "B-201", section: "Onion & Potato Section", category: "Vegetables", business: "Pawar Kanda Batata Trader", address: "Gala B-201, Market Yard", regDate: "2022-11-18", status: "approved" },
  { id: "GO-004", name: "Sunil More", nameMr: "सुनील मोरे", mobile: "9876543213", username: "sunil.more", email: "sunil@example.com", gala: "B-202", section: "Grain Section", category: "Grains", business: "More Dhanya Bhandar", address: "Gala B-202, Market Yard", regDate: "2023-01-22", status: "approved" },
  { id: "GO-005", name: "Prakash Kale", nameMr: "प्रकाश काळे", mobile: "9876543214", username: "prakash.kale", email: "prakash@example.com", gala: "C-301", section: "Flower Section", category: "Flowers", business: "Kale Phool Ghar", address: "Gala C-301, Market Yard", regDate: "2023-06-11", status: "approved" },
  { id: "GO-006", name: "Ganesh Patil", nameMr: "गणेश पाटील", mobile: "9876543215", username: "ganesh.patil", email: "ganesh@example.com", gala: "C-302", section: "Wholesale Vegetable", category: "Vegetables", business: "Patil Wholesale Vegetables", address: "Gala C-302, Market Yard", regDate: "2022-08-30", status: "approved" },
  { id: "GO-007", name: "Rajendra Chavan", nameMr: "राजेंद्र चव्हाण", mobile: "9876543216", username: "rajendra.chavan", email: "rajendra@example.com", gala: "D-401", section: "Wholesale Fruit", category: "Fruits", business: "Chavan Fruit Traders", address: "Gala D-401, Market Yard", regDate: "2022-05-14", status: "approved" },
  { id: "GO-008", name: "Nitin Kumbhar", nameMr: "नितीन कुंभार", mobile: "9876543217", username: "nitin.kumbhar", email: "nitin@example.com", gala: "D-402", section: "Support Services", category: "Packaging material", business: "Kumbhar Packing Supplies", address: "Gala D-402, Market Yard", regDate: "2023-09-01", status: "approved" },
  { id: "GO-009", name: "Santosh Mane", nameMr: "संतोष माने", mobile: "9876543218", username: "santosh.mane", email: "santosh@example.com", gala: "E-501", section: "Agricultural Goods", category: "Agricultural goods", business: "Mane Krushi Kendra", address: "Gala E-501, Market Yard", regDate: "2023-02-19", status: "approved" },
  { id: "GO-010", name: "Vijay Shinde", nameMr: "विजय शिंदे", mobile: "9876543219", username: "vijay.shinde", email: "vijay@example.com", gala: "E-502", section: "Vegetable Section E", category: "Vegetables", business: "Shinde Traders", address: "Gala E-502, Market Yard", regDate: "2023-07-25", status: "approved" },
  // pending
  { id: "GO-011", name: "Anil Deshmukh", nameMr: "अनिल देशमुख", mobile: "9876500011", username: "anil.deshmukh", email: "anil@example.com", gala: "F-601", section: "Vegetable Section F", category: "Vegetables", business: "Deshmukh Vegetables", address: "Gala F-601", regDate: "2026-07-20", status: "pending" },
  { id: "GO-012", name: "Bharat Salunke", nameMr: "भरत साळुंके", mobile: "9876500012", username: "bharat.salunke", email: "bharat@example.com", gala: "F-602", section: "Flower Section", category: "Flowers", business: "Salunke Flowers", address: "Gala F-602", regDate: "2026-07-22", status: "pending" },
  { id: "GO-013", name: "Kiran Bhosale", nameMr: "किरण भोसले", mobile: "9876500013", username: "kiran.bhosale", email: "kiran@example.com", gala: "G-701", section: "Grain Section", category: "Grains", business: "Bhosale Grains", address: "Gala G-701", regDate: "2026-07-24", status: "pending" },
  { id: "GO-014", name: "Dattatray Gaikwad", nameMr: "दत्तात्रय गायकवाड", mobile: "9876500014", username: "d.gaikwad", email: "datta@example.com", gala: "G-702", section: "Fruit Section", category: "Fruits", business: "Gaikwad Fruit Mart", address: "Gala G-702", regDate: "2026-07-25", status: "pending" },
  { id: "GO-015", name: "Sachin Thorat", nameMr: "सचिन थोरात", mobile: "9876500015", username: "sachin.thorat", email: "sachin@example.com", gala: "H-801", section: "Wholesale", category: "Vegetables", business: "Thorat Wholesale", address: "Gala H-801", regDate: "2026-07-26", status: "pending" },
  // rejected
  { id: "GO-016", name: "Sanjay Kadam", nameMr: "संजय कदम", mobile: "9876500016", username: "sanjay.kadam", email: "sk@example.com", gala: "H-802", section: "Vegetable", category: "Vegetables", business: "Kadam Traders", address: "Gala H-802", regDate: "2026-06-01", status: "rejected" },
  { id: "GO-017", name: "Vikas Sawant", nameMr: "विकास सावंत", mobile: "9876500017", username: "vikas.sawant", email: "vs@example.com", gala: "I-901", section: "Fruit", category: "Fruits", business: "Sawant Fruits", address: "Gala I-901", regDate: "2026-05-15", status: "rejected" },
  // blacklisted
  { id: "GO-018", name: "Rahul Yadav", nameMr: "राहुल यादव", mobile: "9876500018", username: "rahul.yadav", email: "ry@example.com", gala: "I-902", section: "Vegetable", category: "Vegetables", business: "Yadav Traders", address: "Gala I-902", regDate: "2022-01-01", status: "blacklisted" },
  { id: "GO-019", name: "Manoj Ghadge", nameMr: "मनोज घाडगे", mobile: "9876500019", username: "manoj.ghadge", email: "mg@example.com", gala: "J-1001", section: "Grain", category: "Grains", business: "Ghadge Grains", address: "Gala J-1001", regDate: "2021-09-09", status: "blacklisted" },
  { id: "GO-020", name: "Pravin Nikam", nameMr: "प्रवीण निकम", mobile: "9876500020", username: "pravin.nikam", email: "pn@example.com", gala: "J-1002", section: "Fruit", category: "Fruits", business: "Nikam Fruit Center", address: "Gala J-1002", regDate: "2023-10-10", status: "approved" },
];

const complaintSeeds = [
  ["Water leakage near Gala A-101", "Water Supply", "high", "in_progress"],
  ["Streetlight not working in Section B", "Electricity", "medium", "assigned"],
  ["Waste not collected near fruit market", "Cleanliness", "high", "under_review"],
  ["Drainage blockage near Gala C-302", "Drainage", "high", "in_progress"],
  ["Unauthorized parking near main entrance", "Parking", "medium", "submitted"],
  ["Electricity issue in Gala D-402", "Electricity", "high", "resolved"],
  ["Damaged pathway in vegetable section", "Road or Pathway", "medium", "assigned"],
  ["Security concern during evening hours", "Security", "emergency", "in_progress"],
  ["Broken shutter of Gala E-501", "Shop or Gala Issue", "high", "waiting_info"],
  ["Overflowing garbage bin near flower section", "Waste Management", "high", "resolved"],
  ["Rude behaviour of parking staff", "Staff Behaviour", "medium", "under_review"],
  ["License renewal delayed", "License Issue", "low", "submitted"],
  ["Fire safety equipment missing", "Market Facility", "emergency", "assigned"],
  ["Water pressure very low", "Water Supply", "medium", "in_progress"],
  ["Unauthorized hawkers blocking pathway", "Unauthorized Activity", "medium", "resolved"],
  ["Broken drainage cover", "Drainage", "high", "closed"],
  ["Loading area congestion", "Market Facility", "medium", "assigned"],
  ["Frequent power cuts in Section D", "Electricity", "high", "in_progress"],
  ["Toilet block cleaning required", "Cleanliness", "medium", "resolved"],
  ["Payment receipt not issued", "Payment Issue", "low", "resolved"],
  ["Loose electric wires in Section A", "Electricity", "emergency", "in_progress"],
  ["Water tank cleaning overdue", "Water Supply", "medium", "submitted"],
  ["Rat infestation in grain section", "Cleanliness", "high", "assigned"],
  ["Damaged weighing scale", "Market Facility", "low", "resolved"],
  ["Vehicle parking dispute", "Parking", "medium", "closed"],
] as const;

export const COMPLAINTS: Complaint[] = complaintSeeds.map(([subject, category, priority, status], i) => {
  const owner = OWNERS[i % 10];
  return {
    id: `CMP-${String(2401 + i).padStart(4, "0")}`,
    ownerId: owner.id,
    ownerName: owner.name,
    gala: owner.gala,
    subject,
    category,
    priority: priority as Complaint["priority"],
    description: `${subject}. Please look into this at the earliest. It is affecting daily business operations in the market yard.`,
    date: `2026-07-${String(1 + (i % 27)).padStart(2, "0")}`,
    status: status as ComplaintStatus,
    assignedTo: i % 3 === 0 ? "Maintenance Department" : i % 3 === 1 ? "User Admin" : "Security Department",
    attachments: (i % 4) + 1,
    comments: [
      { author: "User Admin", role: "user_admin", text: "Complaint received. Forwarding to concerned department.", date: `2026-07-${String(1 + (i % 27)).padStart(2, "0")}` },
    ],
  };
});

export const MARKET_UPDATES: MarketUpdate[] = [
  { id: "MU-001", title: "Today's vegetable arrival report", titleMr: "आजचा भाजीपाला आवक अहवाल", category: "Market arrivals", summary: "Total 420 quintals of mixed vegetables arrived this morning.", date: "2026-07-28", publishedBy: "User Admin", views: 342, featured: true },
  { id: "MU-002", title: "Onion wholesale price update", titleMr: "कांदा घाऊक दर अद्यतन", category: "Vegetable prices", summary: "Onion trading between ₹22-28/kg wholesale.", date: "2026-07-28", publishedBy: "User Admin", views: 512 },
  { id: "MU-003", title: "Tomato wholesale rate update", titleMr: "टोमॅटो घाऊक दर", category: "Vegetable prices", summary: "Tomato ₹35-42/kg wholesale, arrivals steady.", date: "2026-07-28", publishedBy: "User Admin", views: 428 },
  { id: "MU-004", title: "Market closure notice — Sunday", titleMr: "बाजार बंद सूचना — रविवार", category: "Market holiday", summary: "Market will remain fully closed on Sunday, August 3.", date: "2026-07-27", publishedBy: "Main Admin", views: 890, featured: true, emergency: true },
  { id: "MU-005", title: "Water supply maintenance", titleMr: "पाणीपुरवठा देखभाल", category: "Water or electricity update", summary: "Water supply will be interrupted 10 AM – 2 PM on July 30.", date: "2026-07-27", publishedBy: "Main Admin", views: 621 },
  { id: "MU-006", title: "New parking arrangement", titleMr: "नवीन पार्किंग व्यवस्था", category: "Traffic or parking update", summary: "Revised parking zones effective August 1.", date: "2026-07-26", publishedBy: "Main Admin", views: 402 },
  { id: "MU-007", title: "Cleanliness drive announcement", titleMr: "स्वच्छता मोहीम घोषणा", category: "General market news", summary: "Cleanliness drive on August 5, all gala owners invited.", date: "2026-07-25", publishedBy: "User Admin", views: 288 },
  { id: "MU-008", title: "Monthly committee meeting", titleMr: "मासिक समिती बैठक", category: "General market news", summary: "Monthly meeting scheduled August 8, 10 AM at association hall.", date: "2026-07-25", publishedBy: "Main Admin", views: 356 },
  { id: "MU-009", title: "Rain alert for traders", titleMr: "व्यापाऱ्यांसाठी पाऊस इशारा", category: "Weather alert", summary: "Heavy rain expected next 3 days — cover perishable stock.", date: "2026-07-24", publishedBy: "User Admin", views: 723, emergency: true },
  { id: "MU-010", title: "Revised loading/unloading timing", titleMr: "सुधारित माल चढ-उतार वेळ", category: "Traffic or parking update", summary: "Loading now 4 AM – 8 AM, unloading 8 PM – 11 PM.", date: "2026-07-23", publishedBy: "Main Admin", views: 512 },
  { id: "MU-011", title: "Grain prices weekly summary", titleMr: "धान्य दर साप्ताहिक सारांश", category: "Grain prices", summary: "Wheat ₹2,600/qtl, jowar ₹2,850/qtl, bajra ₹2,400/qtl.", date: "2026-07-22", publishedBy: "User Admin", views: 234 },
  { id: "MU-012", title: "Flower market Ganeshotsav rates", titleMr: "गणेशोत्सव फुल बाजार दर", category: "General market news", summary: "Marigold ₹80-120/kg, jasmine ₹250/kg, rose ₹180/kg.", date: "2026-07-21", publishedBy: "User Admin", views: 445 },
  { id: "MU-013", title: "Fire safety inspection scheduled", titleMr: "अग्निसुरक्षा तपासणी", category: "General market news", summary: "Fire department inspection August 2. Keep documents ready.", date: "2026-07-20", publishedBy: "Main Admin", views: 312 },
  { id: "MU-014", title: "License renewal reminder", titleMr: "परवाना नूतनीकरण स्मरणपत्र", category: "General market news", summary: "Trade licenses expiring in August — renew before July 31.", date: "2026-07-19", publishedBy: "Main Admin", views: 678 },
  { id: "MU-015", title: "Electricity maintenance in Section C", titleMr: "सेक्शन C वीज देखभाल", category: "Water or electricity update", summary: "Power outage 11 AM – 1 PM on July 31 in Section C.", date: "2026-07-19", publishedBy: "User Admin", views: 289 },
];

export const NOTICES: Notice[] = [
  { id: "N-1", number: "VPP/2026/45", title: "Annual General Meeting notice", category: "Meeting Notice", description: "AGM scheduled August 15 at association hall. All members must attend.", date: "2026-07-26", attachment: "AGM-notice.pdf" },
  { id: "N-2", number: "VPP/2026/44", title: "Market closure on public holiday", category: "Market Holiday Notice", description: "Market will remain closed August 15 on account of Independence Day.", date: "2026-07-25", attachment: "holiday-notice.pdf" },
  { id: "N-3", number: "VPP/2026/43", title: "Monthly maintenance fee due", category: "Payment Notice", description: "Maintenance fee for July 2026 due by 31st. Pay at office counter.", date: "2026-07-22", attachment: "fee-notice.pdf" },
  { id: "N-4", number: "VPP/2026/42", title: "Revised parking guidelines", category: "Parking Notice", description: "New parking layout effective August 1.", date: "2026-07-20", attachment: "parking-guidelines.pdf" },
  { id: "N-5", number: "VPP/2026/41", title: "Water supply maintenance", category: "Water Supply Notice", description: "Scheduled maintenance July 30, 10 AM – 2 PM.", date: "2026-07-19", attachment: "water-notice.pdf" },
  { id: "N-6", number: "VPP/2026/40", title: "Electricity meter reading schedule", category: "Electricity Notice", description: "Meter reading on July 31.", date: "2026-07-18", attachment: "meter-reading.pdf" },
  { id: "N-7", number: "VPP/2026/39", title: "COVID prevention guidelines", category: "Health and Safety Notice", description: "Follow health advisory in crowded market areas.", date: "2026-07-15", attachment: "health-advisory.pdf" },
  { id: "N-8", number: "VPP/2026/38", title: "Government market circular", category: "Government Circular", description: "APMC circular regarding trader compliance.", date: "2026-07-14", attachment: "govt-circular.pdf" },
  { id: "N-9", number: "VPP/2026/37", title: "Revised market rules", category: "Rules and Regulations", description: "Updated code of conduct for all gala owners.", date: "2026-07-12", attachment: "market-rules.pdf" },
  { id: "N-10", number: "VPP/2026/36", title: "Cleanliness drive participation", category: "General Notice", description: "Volunteer participation invited for cleanliness drive.", date: "2026-07-10", attachment: "clean-drive.pdf" },
  { id: "N-11", number: "VPP/2026/35", title: "Fire safety compliance", category: "Health and Safety Notice", description: "Fire extinguisher check mandatory before August 5.", date: "2026-07-08", attachment: "fire-safety.pdf" },
  { id: "N-12", number: "VPP/2026/34", title: "Committee sub-election notice", category: "Meeting Notice", description: "Sub-election for 2 vacant committee positions.", date: "2026-07-05", attachment: "election-notice.pdf" },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "GAL-001", title: "Vegetable market at dawn", date: "2026-07-20", count: 24, type: "image", section: "Market Yard", uploadedBy: "Main Admin", status: "published" },
  { id: "GAL-002", title: "Monthly committee meeting", date: "2026-07-15", count: 18, type: "image", section: "Association Hall", uploadedBy: "User Admin", status: "published" },
  { id: "GAL-003", title: "Cleanliness drive", date: "2026-07-05", count: 32, type: "image", section: "All Sections", uploadedBy: "User Admin", status: "published" },
  { id: "GAL-004", title: "Ganesh festival celebration", date: "2026-06-28", count: 45, type: "image", section: "Market Yard", uploadedBy: "Main Admin", status: "published" },
  { id: "GAL-005", title: "New cold storage inauguration", date: "2026-06-15", count: 12, type: "video", section: "Section C", uploadedBy: "Main Admin", status: "published" },
  { id: "GAL-006", title: "Farmer awareness camp", date: "2026-06-01", count: 20, type: "image", section: "Training Hall", uploadedBy: "User Admin", status: "published" },
  { id: "GAL-007", title: "Independence Day celebration", date: "2025-08-15", count: 28, type: "image", section: "Main Gate", uploadedBy: "Main Admin", status: "published" },
  { id: "GAL-008", title: "Solar panel commissioning", date: "2025-07-10", count: 15, type: "video", section: "Market Roof", uploadedBy: "User Admin", status: "published" },
  { id: "GAL-009", title: "Diwali sweet distribution", date: "2024-11-01", count: 22, type: "image", section: "Association Office", uploadedBy: "Main Admin", status: "published" },
];

export const NEWS = [
  { id: "NEWS-1", title: "New cold storage facility inaugurated", date: "2026-07-25", summary: "500 MT capacity cold storage for perishables now operational at Section C." },
  { id: "NEWS-2", title: "Digital portal launched for gala owners", date: "2026-07-15", summary: "Association launches secure digital portal for all 850+ members." },
  { id: "NEWS-3", title: "Solar panels installed on market roof", date: "2026-07-01", summary: "50 kW rooftop solar reduces electricity cost by 30%." },
  { id: "NEWS-4", title: "Farmer awareness camp organised", date: "2026-06-20", summary: "Awareness camp on modern trading practices held for 200+ farmers." },
  { id: "NEWS-5", title: "New drinking water RO plant", date: "2026-06-10", summary: "RO drinking water plant installed for traders and visitors." },
  { id: "NEWS-6", title: "CCTV coverage expanded", date: "2026-05-28", summary: "24 new CCTV cameras added across all market sections." },
  { id: "NEWS-7", title: "Association wins state cooperative award", date: "2026-05-15", summary: "Recognised as best-run market yard association in Pune district." },
  { id: "NEWS-8", title: "New waste segregation system", date: "2026-05-01", summary: "Wet-dry segregation implemented in all sections." },
];

export const MOBILE_REQUESTS: MobileChangeRequest[] = Array.from({ length: 10 }).map((_, i) => {
  const owner = OWNERS[i % 10];
  const statuses: MobileChangeRequest["status"][] = ["pending", "pending", "approved", "under_review", "rejected", "pending", "approved", "pending", "under_review", "pending"];
  return {
    id: `MCR-${String(i + 101).padStart(3, "0")}`,
    ownerName: owner.name,
    gala: owner.gala,
    oldMobile: owner.mobile,
    newMobile: `98${Math.floor(10000000 + Math.random() * 89999999)}`,
    reason: ["Lost SIM card", "Changed service provider", "Old number no longer active", "Phone theft"][i % 4],
    date: `2026-07-${String(15 + i).padStart(2, "0")}`,
    status: statuses[i],
  };
});

export const CURRENT_CHAIRMAN = {
  name: "Shri. Sourabh Kunjir",
  nameMr: "सौरभ कुंजीर",
  designation: "Chairman",
  term: "2024 – 2027",
  message: "Our mission is to empower every gala owner with digital tools and transparent administration. Together we will build a modern, farmer-friendly market yard.",
  messageMr: "प्रत्येक गाळा मालकाला डिजिटल साधने आणि पारदर्शक प्रशासन देणे हे आमचे ध्येय आहे.",
};

export const LOBBY_CHAIRMAN = {
  name: "Shri. Ashok Deshmukh",
  designation: "Lobby Chairman",
  intro: "Coordinates day-to-day trading operations and grievance handling on the market floor.",
};

export const PAST_CHAIRMEN = [
  { name: "Shri. Vitthalrao Jagtap", period: "2021 – 2024", contribution: "Modernised market infrastructure." },
  { name: "Shri. Dattatray Kale", period: "2018 – 2021", contribution: "Established cold storage facilities." },
  { name: "Shri. Namdev Patil", period: "2015 – 2018", contribution: "Expanded market to 850+ galas." },
  { name: "Shri. Ramchandra Shinde", period: "2012 – 2015", contribution: "Introduced weekly farmer training." },
  { name: "Shri. Bhausaheb More", period: "2009 – 2012", contribution: "Founded the modern association bylaws." },
];

export const COMMITTEE: CommitteeMember[] = [
  { id: "C-1", name: "Shri. Sourabh Kunjir", designation: "Chairman" },
  { id: "C-2", name: "Shri. Ashok Deshmukh", designation: "Lobby Chairman" },
  { id: "C-3", name: "Shri. Vijay Salunke", designation: "Vice President", gala: "B-105" },
  { id: "C-4", name: "Shri. Rajaram Patil", designation: "Secretary", gala: "C-210" },
  { id: "C-5", name: "Shri. Shivaji Bhosale", designation: "Treasurer", gala: "A-115" },
  { id: "C-6", name: "Smt. Sunita Jadhav", designation: "Committee Member", gala: "D-305" },
  { id: "C-7", name: "Shri. Manohar Chavan", designation: "Committee Member", gala: "E-402" },
  { id: "C-8", name: "Shri. Suryakant Ghadge", designation: "User Admin" },
];

export const NOTIFICATIONS = [
  { id: "NT-1", title: "New notice: AGM scheduled", date: "2026-07-26", read: false, type: "notice" },
  { id: "NT-2", title: "Your complaint CMP-2401 is now In Progress", date: "2026-07-26", read: false, type: "complaint" },
  { id: "NT-3", title: "Market closure on Sunday — Aug 3", date: "2026-07-27", read: false, type: "update" },
  { id: "NT-4", title: "Water supply maintenance July 30", date: "2026-07-27", read: true, type: "update" },
  { id: "NT-5", title: "Monthly meeting reminder", date: "2026-07-25", read: true, type: "notice" },
];

// Demo login credentials
export const DEMO_CREDS = {
  main_admin: { username: "mainadmin", mobile: "9000000001", password: "Admin@123", name: "Main Administrator" },
  user_admin: { username: "useradmin", mobile: "9000000002", password: "Admin@123", name: "User Administrator" },
  owner: { username: "ramesh.shinde", mobile: "9876543210", password: "Gala@123", name: "Ramesh Shinde" },
};

export const DASHBOARD_STATS = {
  totalOwners: 852,
  approved: 820,
  pending: 18,
  rejected: 9,
  blacklisted: 5,
  activeComplaints: 42,
  resolvedComplaints: 318,
  emergencyComplaints: 3,
  pendingMobileRequests: 6,
  totalNotices: 124,
  totalDownloads: 4820,
  monthlyLogins: 6240,
};

export const CHART_REGISTRATIONS = [
  { month: "Feb", count: 24 }, { month: "Mar", count: 31 }, { month: "Apr", count: 28 },
  { month: "May", count: 42 }, { month: "Jun", count: 38 }, { month: "Jul", count: 51 },
];

export const CHART_COMPLAINTS_CATEGORY = [
  { category: "Water", count: 24 }, { category: "Electricity", count: 32 },
  { category: "Cleanliness", count: 41 }, { category: "Parking", count: 18 },
  { category: "Security", count: 12 }, { category: "Facility", count: 27 },
];

export const CHART_DOWNLOADS = [
  { month: "Feb", downloads: 320 }, { month: "Mar", downloads: 410 },
  { month: "Apr", downloads: 380 }, { month: "May", downloads: 560 },
  { month: "Jun", downloads: 640 }, { month: "Jul", downloads: 780 },
];
