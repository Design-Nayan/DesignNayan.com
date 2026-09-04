import { BuildServiceDetail, MaterialCategory } from "../types/build.types";

export const buildServicesData: BuildServiceDetail[] = [
  {
    id: "construction",
    title: "Construction",
    badge: "NAYAN CONSTRUCTIONS CIVIL",
    description: "End-to-end RCC structural execution, brick masonry, and nayan constructions project development compliant with Seismic Zone V safety codes.",
    iconName: "HardHat",
    popular: true,
    turnaround: "4 - 9 Months",
    priceGuide: "From ₹1,650 / sq.ft",
    deliverables: [
      "Soil bearing capacity testing & RCC column foundation",
      "Earthquake-resistant Fe 550D TMT framing & roof slab casting",
      "AAC lightweight blockwork & internal sand-cement plastering",
      "Concealed plumbing lines, electrical conduits & waterproofing",
    ],
    specs: [
      { label: "Compliance", value: "IS 456 / IS 1893 (Zone V)" },
      { label: "Warranty", value: "10-Year Structural Guarantee" },
      { label: "Engineer", value: "Dedicated On-Site Supervisor" },
    ],
  },
  {
    id: "material-supply",
    title: "Materials",
    badge: "DIRECT WHOLESALE SOURCING",
    description: "Direct mill & factory wholesale procurement of certified TMT steel rebars, Grade-53 cement, tiles, sanitaryware, and aggregates.",
    iconName: "Truck",
    popular: true,
    turnaround: "Same-Day Dispatch",
    priceGuide: "Factory Bulk Rates",
    deliverables: [
      "Mill-certified Tata Tiscon & Jindal Panther TMT rebars",
      "UltraTech & Dalmia Grade 53 high-early-strength cement",
      "Direct truck delivery to construction sites across Northeast",
      "Consolidated GST tax invoicing & bulk commercial credit",
    ],
    specs: [
      { label: "Sourcing", value: "Direct Mill / Manufacturer" },
      { label: "Logistics", value: "Truckload Delivery (Assam)" },
      { label: "Quality", value: "100% BIS Lab Certified" },
    ],
  },
  {
    id: "estimation",
    title: "Estimation",
    badge: "PRECISION BOQ & BUDGETING",
    description: "Itemized Bill of Quantities (BOQ), structural material rate calculations, and realistic construction cash-flow forecasts.",
    iconName: "Calculator",
    popular: false,
    turnaround: "2 - 4 Days",
    priceGuide: "From ₹4,500 / project",
    deliverables: [
      "Detailed material quantity takeoff (Steel, Cement, Sand, Stone)",
      "Itemized labor rate breakdown and contractor bidding sheet",
      "Phase-wise cash-flow and milestone funding schedule",
      "Value engineering analysis to cut construction waste by 12%",
    ],
    specs: [
      { label: "Accuracy", value: "98% BOQ Precision" },
      { label: "Format", value: "Excel Sheets & Detailed PDF" },
      { label: "Standard", value: "CPWD / APWD Schedule of Rates" },
    ],
  },
  {
    id: "project-management",
    title: "Project Management",
    badge: "ON-SITE QUALITY AUDITS",
    description: "Independent site supervision, concrete cube compressive testing, milestone billing verification, and safety protocol enforcement.",
    iconName: "Briefcase",
    popular: true,
    turnaround: "Ongoing Site Sprints",
    priceGuide: "From ₹15,000 / mo",
    deliverables: [
      "Daily site diary logs, labor attendance & photographic reports",
      "Slump cone & 7/28-day concrete cube compressive strength tests",
      "Contractor invoice verification against actual physical progress",
      "Municipal building bye-law compliance check at each stage",
    ],
    specs: [
      { label: "Audits", value: "Weekly Milestone Inspections" },
      { label: "Reports", value: "Digital Portal & WhatsApp PDF" },
      { label: "Safety", value: "OSHA & NBC Safety Protocols" },
    ],
  },
];

export const materialCategoriesData: MaterialCategory[] = [
  {
    category: "Structural Steel (TMT)",
    badge: "FE 550D EARTHQUAKE REBARS",
    brands: ["Tata Tiscon", "Jindal Panther", "Sail", "Kamdhenu"],
    desc: "Fe 500D & 550D high-ductility earthquake-resistant rebars with certified mill test reports.",
  },
  {
    category: "Cement & Aggregates",
    badge: "GRADE 53 & PPC",
    brands: ["UltraTech", "Dalmia Cement", "Star Cement", "Ambuja"],
    desc: "PPC, OPC 53 Grade high-early-strength cement and certified river sand & blue metal stone chips.",
  },
  {
    category: "Sanitaryware & Bath Fixtures",
    badge: "LUXURY FITTINGS",
    brands: ["Kohler", "Jaquar", "Grohe", "Hindware"],
    desc: "Wall-hung rimless smart toilets, thermostatic rain showers, and PVD gold brassware.",
  },
  {
    category: "Tiles & Granites",
    badge: "LARGE FORMAT SLABS",
    brands: ["Kajaria", "Somany", "Simpolo", "Italian Imported"],
    desc: "Large format 1200x2400mm vitrified slabs, anti-skid floor tiles, and mirror-polished granites.",
  },
];

export const buildWorkflowSteps = [
  {
    step: "01",
    title: "Site Survey & Soil Testing",
    desc: "We perform bore-hole soil analysis and establish structural load-bearing parameters for seismic safety.",
  },
  {
    step: "02",
    title: "Foundation & RCC Frame",
    desc: "Excavation, anti-termite treatment, isolated footings, column erection, and high-strength concrete casting.",
  },
  {
    step: "03",
    title: "Brickwork, MEP & Plaster",
    desc: "AAC block masonry, electrical and plumbing conduits, multi-layer waterproofing, and smooth sand plaster.",
  },
  {
    step: "04",
    title: "Finishing & Handover",
    desc: "Flooring, premium paint, doors, UPVC windows, electrical testing, and handing over the structural warranty.",
  },
];

