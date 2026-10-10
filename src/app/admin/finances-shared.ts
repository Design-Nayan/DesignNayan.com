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

// Multi-Date, Comprehensive Transactions - Clean Production Baseline
export const initialIncomeRecords: IncomeRecord[] = [];

// Multi-Date, Comprehensive Audit Logs - Clean Production Baseline
export const initialAuditLogs: IncomeAuditLog[] = [];

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
