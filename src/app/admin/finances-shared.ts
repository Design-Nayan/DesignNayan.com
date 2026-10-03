// Shared Types, Constants & Helpers for Design Nayan Admin Finances Suite

export interface IncomeRecord {
  id: string;
  amount: number; // Received Amount (Actual collected income)
  totalAmount: number; // Total Project Deal / Contract Value
  pendingAmount: number; // Pending / Balance Due
  paymentStatus: "PAID" | "PARTIAL" | "PENDING";
  dueDate?: string; // Due date for pending balance
  category: string;
  clientName: string;
  clientPhone?: string;
  projectDetails: string;
  date: string; // YYYY-MM-DD
  paymentMethod: string;
  createdAt: string;
}

export interface IncomeAuditLog {
  id: string;
  action: "ADDED" | "EDITED" | "DELETED";
  description: string;
  timestamp: string;
  isoDate?: string;
}

export const DN_ADMIN_INCOME_KEY = "dn_admin_income";
export const DN_ADMIN_LOGS_KEY = "dn_admin_income_logs";
export const DN_ADMIN_AUTH_KEY = "dn_admin_auth";

export const INCOME_CATEGORIES = [
  "Web & Digital Development",
  "Design & Architecture",
  "Build & Construction",
  "Branding & Creative",
  "Creator Campaigns",
  "Stay & Property",
  "Other Services",
];

export type TimeFilterType = "this_month" | "3_months" | "6_months" | "this_year" | "all_time";
export type PaymentStatusFilter = "ALL" | "PAID" | "PENDING_ONLY";
export type ActionFilterType = "ALL" | "ADDED" | "EDITED" | "DELETED";

// Multi-Date, Comprehensive Dummy Transactions
export const initialIncomeRecords: IncomeRecord[] = [
  // --- OCTOBER 2026 (THIS MONTH) ---
  {
    id: "inc_1",
    amount: 320000,
    totalAmount: 500000,
    pendingAmount: 180000,
    paymentStatus: "PARTIAL",
    dueDate: "2026-10-28",
    category: "Build & Construction",
    clientName: "Barpeta Commercial Complex",
    clientPhone: "+91 94350 22334",
    projectDetails: "RCC foundation civil structure milestone 1 cleared. Milestone 2 slab casting pending.",
    date: "2026-10-03",
    paymentMethod: "Bank NEFT",
    createdAt: "2026-10-03T10:15:00Z",
  },
  {
    id: "inc_2",
    amount: 100000,
    totalAmount: 150000,
    pendingAmount: 50000,
    paymentStatus: "PARTIAL",
    dueDate: "2026-10-25",
    category: "Web & Digital Development",
    clientName: "Northeast Ventures",
    clientPhone: "+91 98640 12345",
    projectDetails: "Full stack corporate web application, 1st milestone received, 2nd milestone pending on launch.",
    date: "2026-10-02",
    paymentMethod: "Bank Transfer",
    createdAt: "2026-10-02T14:30:00Z",
  },
  {
    id: "inc_3",
    amount: 250000,
    totalAmount: 250000,
    pendingAmount: 0,
    paymentStatus: "PAID",
    dueDate: "",
    category: "Design & Architecture",
    clientName: "Dr. B. Sarma",
    clientPhone: "+91 94350 98765",
    projectDetails: "Modern residential villa 3D elevation and structural blueprints. Paid in full.",
    date: "2026-10-01",
    paymentMethod: "Bank NEFT",
    createdAt: "2026-10-01T11:15:00Z",
  },

  // --- SEPTEMBER 2026 (PAST 3 MONTHS, PAST 6 MONTHS, THIS YEAR) ---
  {
    id: "inc_4",
    amount: 80000,
    totalAmount: 150000,
    pendingAmount: 70000,
    paymentStatus: "PARTIAL",
    dueDate: "2026-10-15",
    category: "Branding & Creative",
    clientName: "Silk & Loom Handlooms",
    clientPhone: "+91 97060 44556",
    projectDetails: "Brand identity & packaging overhaul. Advance received, final delivery balance pending.",
    date: "2026-09-25",
    paymentMethod: "UPI / IMPS",
    createdAt: "2026-09-25T16:45:00Z",
  },
  {
    id: "inc_5",
    amount: 175000,
    totalAmount: 175000,
    pendingAmount: 0,
    paymentStatus: "PAID",
    dueDate: "",
    category: "Creator Campaigns",
    clientName: "Assam Tea Estates",
    clientPhone: "+91 98540 77889",
    projectDetails: "Autumn harvest influencer brand campaign across 4 creator roster channels. Paid in full.",
    date: "2026-09-12",
    paymentMethod: "Bank Transfer",
    createdAt: "2026-09-12T12:00:00Z",
  },

  // --- AUGUST 2026 (PAST 3 MONTHS, PAST 6 MONTHS, THIS YEAR) ---
  {
    id: "inc_6",
    amount: 450000,
    totalAmount: 600000,
    pendingAmount: 150000,
    paymentStatus: "PARTIAL",
    dueDate: "2026-09-30",
    category: "Build & Construction",
    clientName: "Brahmaputra Luxury Resorts",
    clientPhone: "+91 94351 88990",
    projectDetails: "Cottage civil framing and panoramic deck erection. Retainer received.",
    date: "2026-08-20",
    paymentMethod: "Bank NEFT",
    createdAt: "2026-08-20T10:30:00Z",
  },
  {
    id: "inc_7",
    amount: 95000,
    totalAmount: 95000,
    pendingAmount: 0,
    paymentStatus: "PAID",
    dueDate: "",
    category: "Stay & Property",
    clientName: "Kaziranga Eco-Lodge",
    clientPhone: "+91 97061 55667",
    projectDetails: "Quarterly hospitality management & guest portal listing integration. Paid in full.",
    date: "2026-08-05",
    paymentMethod: "UPI / IMPS",
    createdAt: "2026-08-05T09:20:00Z",
  },

  // --- JULY & JUNE 2026 (PAST 6 MONTHS, THIS YEAR) ---
  {
    id: "inc_8",
    amount: 120000,
    totalAmount: 150000,
    pendingAmount: 30000,
    paymentStatus: "PARTIAL",
    dueDate: "2026-08-15",
    category: "Web & Digital Development",
    clientName: "Greenfield Organics",
    clientPhone: "+91 98642 33445",
    projectDetails: "E-commerce platform and inventory system for organic agricultural tea products.",
    date: "2026-07-18",
    paymentMethod: "Bank Transfer",
    createdAt: "2026-07-18T14:15:00Z",
  },
  {
    id: "inc_9",
    amount: 300000,
    totalAmount: 300000,
    pendingAmount: 0,
    paymentStatus: "PAID",
    dueDate: "",
    category: "Design & Architecture",
    clientName: "Aura Living Spaces",
    clientPhone: "+91 94355 66778",
    projectDetails: "Architectural master plan and structural blueprints for 6 premium duplex units.",
    date: "2026-06-10",
    paymentMethod: "Bank NEFT",
    createdAt: "2026-06-10T11:45:00Z",
  },

  // --- MARCH & APRIL 2026 (THIS YEAR, ALL TIME) ---
  {
    id: "inc_10",
    amount: 210000,
    totalAmount: 300000,
    pendingAmount: 90000,
    paymentStatus: "PARTIAL",
    dueDate: "2026-05-30",
    category: "Branding & Creative",
    clientName: "Rhino Brew Craft Beer",
    clientPhone: "+91 98544 11223",
    projectDetails: "Craft brewery identity, packaging cans, and launch film production.",
    date: "2026-04-14",
    paymentMethod: "UPI / IMPS",
    createdAt: "2026-04-14T15:30:00Z",
  },
  {
    id: "inc_11",
    amount: 500000,
    totalAmount: 500000,
    pendingAmount: 0,
    paymentStatus: "PAID",
    dueDate: "",
    category: "Build & Construction",
    clientName: "City Centre Mall Guwahati",
    clientPhone: "+91 94350 00112",
    projectDetails: "Commercial retail interior renovation and structural fabrication. Paid in full.",
    date: "2026-03-02",
    paymentMethod: "Bank NEFT",
    createdAt: "2026-03-02T10:00:00Z",
  },

  // --- NOVEMBER 2025 (ALL TIME ONLY) ---
  {
    id: "inc_12",
    amount: 180000,
    totalAmount: 180000,
    pendingAmount: 0,
    paymentStatus: "PAID",
    dueDate: "",
    category: "Design & Architecture",
    clientName: "Heritage Tea Bungalows",
    clientPhone: "+91 97063 99887",
    projectDetails: "Heritage conservation restoration drawings and structural timber roof revival.",
    date: "2025-11-15",
    paymentMethod: "Bank NEFT",
    createdAt: "2025-11-15T16:20:00Z",
  },
];

// Multi-Date, Comprehensive Dummy Audit Logs
export const initialAuditLogs: IncomeAuditLog[] = [
  // October 2026
  {
    id: "log_1",
    action: "ADDED",
    description: "Added ₹3,20,000 (₹1,80,000 Pending) for Build & Construction (Client: Barpeta Commercial Complex)",
    timestamp: "Oct 3, 2026, 10:15 AM",
    isoDate: "2026-10-03T10:15:00Z",
  },
  {
    id: "log_2",
    action: "EDITED",
    description: "Updated Dr. B. Sarma (Design & Architecture): ₹2,50,000 collected, cleared remaining milestone balance",
    timestamp: "Oct 2, 2026, 07:15 PM",
    isoDate: "2026-10-02T19:15:00Z",
  },
  {
    id: "log_3",
    action: "ADDED",
    description: "Added ₹1,00,000 (₹50,000 Pending) for Web & Digital Development (Client: Northeast Ventures)",
    timestamp: "Oct 2, 2026, 02:30 PM",
    isoDate: "2026-10-02T14:30:00Z",
  },
  {
    id: "log_4",
    action: "ADDED",
    description: "Added ₹2,50,000 (Fully Paid) for Design & Architecture (Client: Dr. B. Sarma)",
    timestamp: "Oct 1, 2026, 11:15 AM",
    isoDate: "2026-10-01T11:15:00Z",
  },

  // September 2026
  {
    id: "log_5",
    action: "DELETED",
    description: "Deleted duplicate test entry of ₹25,000 for Other Services (Client: Test Lead)",
    timestamp: "Sep 28, 2026, 03:20 PM",
    isoDate: "2026-09-28T15:20:00Z",
  },
  {
    id: "log_6",
    action: "ADDED",
    description: "Added ₹80,000 (₹70,000 Pending) for Branding & Creative (Client: Silk & Loom Handlooms)",
    timestamp: "Sep 25, 2026, 04:45 PM",
    isoDate: "2026-09-25T16:45:00Z",
  },
  {
    id: "log_7",
    action: "ADDED",
    description: "Added ₹1,75,000 (Fully Paid) for Creator Campaigns (Client: Assam Tea Estates)",
    timestamp: "Sep 12, 2026, 12:00 PM",
    isoDate: "2026-09-12T12:00:00Z",
  },

  // August 2026
  {
    id: "log_8",
    action: "EDITED",
    description: "Updated Brahmaputra Luxury Resorts (Build & Construction): Milestone payment of ₹4,50,000 verified",
    timestamp: "Aug 24, 2026, 06:00 PM",
    isoDate: "2026-08-24T18:00:00Z",
  },
  {
    id: "log_9",
    action: "ADDED",
    description: "Added ₹4,50,000 (₹1,50,000 Pending) for Build & Construction (Client: Brahmaputra Luxury Resorts)",
    timestamp: "Aug 20, 2026, 10:30 AM",
    isoDate: "2026-08-20T10:30:00Z",
  },
  {
    id: "log_10",
    action: "ADDED",
    description: "Added ₹95,000 (Fully Paid) for Stay & Property (Client: Kaziranga Eco-Lodge)",
    timestamp: "Aug 5, 2026, 09:20 AM",
    isoDate: "2026-08-05T09:20:00Z",
  },

  // July & June 2026
  {
    id: "log_11",
    action: "ADDED",
    description: "Added ₹1,20,000 (₹30,000 Pending) for Web & Digital Development (Client: Greenfield Organics)",
    timestamp: "Jul 18, 2026, 02:15 PM",
    isoDate: "2026-07-18T14:15:00Z",
  },
  {
    id: "log_12",
    action: "DELETED",
    description: "Deleted unverified entry of ₹50,000 for Stay & Property (Client: Void Booking)",
    timestamp: "Jul 5, 2026, 04:40 PM",
    isoDate: "2026-07-05T16:40:00Z",
  },
  {
    id: "log_13",
    action: "ADDED",
    description: "Added ₹3,00,000 (Fully Paid) for Design & Architecture (Client: Aura Living Spaces)",
    timestamp: "Jun 10, 2026, 11:45 AM",
    isoDate: "2026-06-10T11:45:00Z",
  },

  // April & March 2026
  {
    id: "log_14",
    action: "ADDED",
    description: "Added ₹2,10,000 (₹90,000 Pending) for Branding & Creative (Client: Rhino Brew Craft Beer)",
    timestamp: "Apr 14, 2026, 03:30 PM",
    isoDate: "2026-04-14T15:30:00Z",
  },
  {
    id: "log_15",
    action: "ADDED",
    description: "Added ₹5,00,000 (Fully Paid) for Build & Construction (Client: City Centre Mall Guwahati)",
    timestamp: "Mar 2, 2026, 10:00 AM",
    isoDate: "2026-03-02T10:00:00Z",
  },

  // November 2025
  {
    id: "log_16",
    action: "ADDED",
    description: "Added ₹1,80,000 (Fully Paid) for Design & Architecture (Client: Heritage Tea Bungalows)",
    timestamp: "Nov 15, 2025, 04:20 PM",
    isoDate: "2025-11-15T16:20:00Z",
  },
];

export const formatINR = (num: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const getFormattedDateTime = () => {
  const d = new Date();
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const parseDateYMD = (dStr: string) => {
  if (!dStr) return new Date();
  const parts = dStr.split("-");
  if (parts.length === 3) {
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12, 0, 0);
  }
  return new Date(dStr);
};

export const getTimeRangeBounds = (timeFilter: TimeFilterType) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const startOfCurrentMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0);
  const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

  let rangeStart = startOfCurrentMonth;
  let rangeEnd = endOfCurrentMonth;
  let timeLabel = "This Month";

  if (timeFilter === "3_months") {
    rangeStart = new Date(currentYear, currentMonth - 2, 1, 0, 0, 0);
    rangeEnd = endOfCurrentMonth;
    timeLabel = "Past 3 Months";
  } else if (timeFilter === "6_months") {
    rangeStart = new Date(currentYear, currentMonth - 5, 1, 0, 0, 0);
    rangeEnd = endOfCurrentMonth;
    timeLabel = "Past 6 Months";
  } else if (timeFilter === "this_year") {
    rangeStart = new Date(currentYear, 0, 1, 0, 0, 0);
    rangeEnd = new Date(currentYear, 11, 31, 23, 59, 59);
    timeLabel = "This Year";
  } else if (timeFilter === "all_time") {
    rangeStart = new Date(2000, 0, 1);
    rangeEnd = new Date(2099, 11, 31);
    timeLabel = "All Time";
  }

  return { rangeStart, rangeEnd, timeLabel };
};

/**
 * Fast Levenshtein distance calculation
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j];
      if (a[i - 1] === b[j - 1]) {
        row[j] = prev;
      } else {
        row[j] = Math.min(prev + 1, row[j] + 1, row[j - 1] + 1);
      }
      prev = temp;
    }
  }
  return row[b.length];
}

/**
 * Checks if a token dynamically matches a candidate word:
 * - Substring and prefix match
 * - Adaptive Levenshtein typo tolerance (1-2 edits)
 */
export function fuzzyTokenMatch(token: string, candidate: string): boolean {
  if (!token || !candidate) return false;
  if (candidate.includes(token) || token.includes(candidate)) return true;
  if (candidate.startsWith(token) || token.startsWith(candidate)) return true;

  const minLen = Math.min(token.length, candidate.length);
  if (minLen >= 5) {
    return levenshteinDistance(token, candidate) <= 2;
  }
  if (minLen >= 3) {
    return levenshteinDistance(token, candidate) <= 1;
  }
  return false;
}

/**
 * Normalize text into clean tokens
 */
export function tokenizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Dynamic search check: returns true if query matches the searchable target content.
 * Gracefully handles typos, partial keywords, currency abbreviations (100k, 2.5L),
 * categories, payment statuses, and client details. Only returns false when nothing matches at all.
 */
export function dynamicMatch(query: string, targetContent: string): boolean {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return true;

  const targetLower = targetContent.toLowerCase();

  // 1. Direct phrase or sub-phrase match
  if (targetLower.includes(cleanQuery)) return true;

  // 2. Expand currency abbreviations (100k -> 100000, 2.5l -> 250000, 50k -> 50000)
  const normalizedQuery = cleanQuery
    .replace(/(\d+(?:\.\d+)?)\s*k\b/gi, (_, n) => `${Math.round(parseFloat(n) * 1000)}`)
    .replace(/(\d+(?:\.\d+)?)\s*l(?:akh)?\b/gi, (_, n) => `${Math.round(parseFloat(n) * 100000)}`);

  if (targetLower.includes(normalizedQuery)) return true;

  // 3. Tokenize and perform adaptive fuzzy matching
  const queryTokens = tokenizeText(normalizedQuery);
  const targetTokens = tokenizeText(targetContent);

  if (queryTokens.length === 0) return true;

  // Check if every query token has a matching target token
  const allTokensMatch = queryTokens.every((qToken) => {
    return targetTokens.some((tToken) => fuzzyTokenMatch(qToken, tToken));
  });

  if (allTokensMatch) return true;

  // For multi-word queries, accept if at least 70% of tokens match
  if (queryTokens.length > 1) {
    const matchedCount = queryTokens.filter((qToken) =>
      targetTokens.some((tToken) => fuzzyTokenMatch(qToken, tToken))
    ).length;
    if (matchedCount / queryTokens.length >= 0.7) {
      return true;
    }
  }

  return false;
}

/**
 * Comprehensive searchable text builder for transactions
 */
export function buildTransactionSearchString(item: IncomeRecord): string {
  const lakhsAmount = (item.amount / 100000).toFixed(2).replace(/\.00$/, "");
  const lakhsTotal = ((item.totalAmount || item.amount) / 100000).toFixed(2).replace(/\.00$/, "");
  const lakhsPending = ((item.pendingAmount || 0) / 100000).toFixed(2).replace(/\.00$/, "");

  const kAmount = Math.round(item.amount / 1000);
  const kPending = Math.round((item.pendingAmount || 0) / 1000);

  const statusWords = [];
  if ((item.pendingAmount || 0) > 0) {
    statusWords.push("pending due balance unpaid partial partially paid red overdue remaining");
  } else {
    statusWords.push("paid cleared full paid in full completed green zero settled");
  }

  // Month names for textual date searches (e.g., "october", "sep", "august")
  let monthNames = "";
  try {
    const d = new Date(item.date);
    if (!isNaN(d.getTime())) {
      monthNames = `${d.toLocaleString("en-US", { month: "long" })} ${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`;
    }
  } catch {
    monthNames = "";
  }

  const rawPhone = item.clientPhone ? item.clientPhone.replace(/[^0-9]/g, "") : "";

  return `
    ${item.clientName}
    ${item.category}
    ${item.projectDetails || ""}
    ${item.paymentMethod || ""}
    ${item.date}
    ${monthNames}
    ${item.dueDate || ""}
    ${item.clientPhone || ""}
    ${rawPhone}
    ${item.amount}
    ${item.totalAmount || item.amount}
    ${item.pendingAmount || 0}
    ${formatINR(item.amount)}
    ${formatINR(item.pendingAmount || 0)}
    ${lakhsAmount}L ${lakhsAmount} lakh ${kAmount}k
    ${lakhsTotal}L ${lakhsTotal} lakh
    ${lakhsPending}L ${lakhsPending} lakh ${kPending}k
    ${statusWords.join(" ")}
  `.toLowerCase();
}

/**
 * Comprehensive searchable text builder for audit logs
 */
export function buildAuditLogSearchString(log: IncomeAuditLog): string {
  const actionSynonyms: Record<string, string> = {
    ADDED: "add added create created new record insert",
    EDITED: "edit edited update updated modify modified change changed",
    DELETED: "delete deleted remove removed clear erased",
  };

  return `
    ${log.action}
    ${actionSynonyms[log.action] || ""}
    ${log.description}
    ${log.timestamp}
    ${log.isoDate || ""}
  `.toLowerCase();
}
