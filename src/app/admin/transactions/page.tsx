"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Phone,
  MessageSquare,
  Lock,
  History,
  Filter,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  IncomeRecord,
  IncomeAuditLog,
  TimeFilterType,
  PaymentStatusFilter,
  INCOME_CATEGORIES,
  DN_ADMIN_INCOME_KEY,
  DN_ADMIN_LOGS_KEY,
  DN_ADMIN_AUTH_KEY,
  initialIncomeRecords,
  initialAuditLogs,
  formatINR,
  parseDateYMD,
  getFormattedDateTime,
  getTimeRangeBounds,
  dynamicMatch,
  buildTransactionSearchString,
} from "../finances-shared";

export default function AllTransactionsPage() {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState("");

  // Data states
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<IncomeAuditLog[]>([]);

  // Filter states
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("this_month");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals & Details
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeRecord | null>(null);
  const [viewingDetail, setViewingDetail] = useState<IncomeRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check auth & load data from localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem(DN_ADMIN_AUTH_KEY);
    if (authStatus === "authenticated" || authStatus === "true") {
      setIsAuthenticated(true);
    }

    // Live Database Sync: Finance Records and Immutable Audit Logs from PostgreSQL
    fetch("/api/finances", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          if (Array.isArray(data.records)) {
            setIncomeRecords(data.records);
            try {
              localStorage.setItem(DN_ADMIN_INCOME_KEY, JSON.stringify(data.records));
            } catch {}
          }
          if (Array.isArray(data.logs)) {
            setAuditLogs(data.logs);
            try {
              localStorage.setItem(DN_ADMIN_LOGS_KEY, JSON.stringify(data.logs));
            } catch {}
          }
        }
      })
      .catch((err) => console.error("Error loading finances from DB:", err));

    try {
      const storedIncome = localStorage.getItem(DN_ADMIN_INCOME_KEY);
      if (storedIncome) {
        const parsed = JSON.parse(storedIncome);
        if (Array.isArray(parsed)) {
          // Filter out legacy dummy records so finance stays clean
          const cleanRecords = parsed.filter(
            (r: any) =>
              r &&
              typeof r.id === "string" &&
              r.clientName !== "Barpeta Commercial Complex" &&
              r.clientName !== "Dr. B. Sarma"
          );
          setIncomeRecords(cleanRecords);
          localStorage.setItem(DN_ADMIN_INCOME_KEY, JSON.stringify(cleanRecords));
        } else {
          setIncomeRecords([]);
          localStorage.setItem(DN_ADMIN_INCOME_KEY, JSON.stringify([]));
        }
      } else {
        setIncomeRecords([]);
        localStorage.setItem(DN_ADMIN_INCOME_KEY, JSON.stringify([]));
      }

      const storedLogs = localStorage.getItem(DN_ADMIN_LOGS_KEY);
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        if (Array.isArray(parsedLogs)) {
          // Filter out legacy dummy logs so history stays clean
          const cleanLogs = parsedLogs.filter(
            (l: any) =>
              l &&
              typeof l.id === "string" &&
              !l.description?.includes("Barpeta Commercial Complex")
          );
          setAuditLogs(cleanLogs);
          localStorage.setItem(DN_ADMIN_LOGS_KEY, JSON.stringify(cleanLogs));
        } else {
          setAuditLogs([]);
          localStorage.setItem(DN_ADMIN_LOGS_KEY, JSON.stringify([]));
        }
      } else {
        setAuditLogs([]);
        localStorage.setItem(DN_ADMIN_LOGS_KEY, JSON.stringify([]));
      }
    } catch {
      setIncomeRecords([]);
      setAuditLogs([]);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const savedEmail = (typeof window !== "undefined" ? localStorage.getItem("dn_admin_email") : null) || "admin@designnayan.com";
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: savedEmail, password: passcode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Incorrect passcode.");
        return;
      }
      setIsAuthenticated(true);
      localStorage.setItem(DN_ADMIN_AUTH_KEY, "true");
      setAuthError("");
    } catch {
      setAuthError("Failed to authenticate with server.");
    }
  };

  // Synchronized Filter Logic (Dynamic search with category and time filter support)
  const {
    filteredTransactions,
    totalReceived,
    totalPending,
    totalContractValue,
    activeTimeLabel,
  } = useMemo(() => {
    const { rangeStart, rangeEnd, timeLabel } = getTimeRangeBounds(timeFilter);
    const hasSearchQuery = searchQuery.trim().length > 0;

    // Filter by Time Range & Category (with dynamic search expansion)
    const inScope = incomeRecords.filter((item) => {
      // 1. Category check
      const inCat = categoryFilter === "ALL" || item.category === categoryFilter;
      if (!inCat) return false;

      // 2. If actively searching, check dynamic match across all transactions
      // so searching client name, notes, amounts, or phone finds the record immediately
      if (hasSearchQuery) {
        const targetContent = buildTransactionSearchString(item);
        if (dynamicMatch(searchQuery, targetContent)) {
          return true;
        }
      }

      // 3. Standard time range boundary
      if (timeFilter === "all_time") return true;
      const itemDate = parseDateYMD(item.date);
      return itemDate >= rangeStart && itemDate <= rangeEnd;
    });

    // Filter by Payment Status & Dynamic Search
    const matches = inScope.filter((item) => {
      let inPayment = true;
      if (paymentFilter === "PAID") {
        inPayment = item.paymentStatus === "PAID" || (item.pendingAmount || 0) === 0;
      } else if (paymentFilter === "PENDING_ONLY") {
        inPayment = (item.pendingAmount || 0) > 0 || item.paymentStatus === "PARTIAL" || item.paymentStatus === "PENDING";
      }

      // Dynamic search matching (fuzzy, partial words, currency aliases, typos)
      const targetContent = buildTransactionSearchString(item);
      const inSearch = dynamicMatch(searchQuery, targetContent);

      return inPayment && inSearch;
    });

    return {
      filteredTransactions: matches,
      totalReceived: matches.reduce((sum, item) => sum + item.amount, 0),
      totalPending: matches.reduce((sum, item) => sum + (item.pendingAmount || 0), 0),
      totalContractValue: matches.reduce((sum, item) => sum + (item.totalAmount || item.amount), 0),
      activeTimeLabel: hasSearchQuery ? "Search Results" : timeLabel,
    };
  }, [incomeRecords, timeFilter, categoryFilter, paymentFilter, searchQuery]);

  // Handle Save / Edit Transaction
  const handleSaveIncome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const receivedAmount = parseFloat(formData.get("amount") as string) || 0;
    const totalContractValue = parseFloat(formData.get("totalAmount") as string) || receivedAmount;
    const pendingAmount = Math.max(0, totalContractValue - receivedAmount);

    let paymentStatus: "PAID" | "PARTIAL" | "PENDING" = "PAID";
    if (pendingAmount === 0) {
      paymentStatus = "PAID";
    } else if (receivedAmount > 0) {
      paymentStatus = "PARTIAL";
    } else {
      paymentStatus = "PENDING";
    }

    const category = formData.get("category") as string;
    const clientName = formData.get("clientName") as string;
    const clientPhone = (formData.get("clientPhone") as string) || "";
    const projectDetails = (formData.get("projectDetails") as string) || "";
    const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0];
    const dueDate = (formData.get("dueDate") as string) || "";
    const paymentMethod = formData.get("paymentMethod") as string;

    const timestamp = getFormattedDateTime();
    const isoDate = new Date().toISOString();

    if (editingIncome) {
      const updated = incomeRecords.map((r) =>
        r.id === editingIncome.id
          ? {
              ...r,
              amount: receivedAmount,
              totalAmount: totalContractValue,
              pendingAmount,
              paymentStatus,
              dueDate,
              category,
              clientName,
              clientPhone,
              projectDetails,
              date,
              paymentMethod,
            }
          : r
      );
      setIncomeRecords(updated);
      localStorage.setItem(DN_ADMIN_INCOME_KEY, JSON.stringify(updated));

      const newLog: IncomeAuditLog = {
        id: `log_${Date.now()}`,
        action: "EDITED",
        description: `Updated ${clientName} (${category}): ${formatINR(receivedAmount)} collected, ${formatINR(pendingAmount)} pending`,
        timestamp,
        isoDate,
      };
      const updatedLogs = [newLog, ...auditLogs];
      setAuditLogs(updatedLogs);
      localStorage.setItem(DN_ADMIN_LOGS_KEY, JSON.stringify(updatedLogs));

      const updatedRecord = {
        ...editingIncome,
        amount: receivedAmount,
        totalAmount: totalContractValue,
        pendingAmount,
        paymentStatus,
        dueDate,
        category,
        clientName,
        clientPhone,
        projectDetails,
        date,
        paymentMethod,
      };
      fetch("/api/finances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ record: updatedRecord, log: newLog }),
      }).catch((err) => console.error("Error updating transaction in DB:", err));

      showToast(`Updated transaction for ${clientName}`);
    } else {
      const newRec: IncomeRecord = {
        id: `inc_${Date.now()}`,
        amount: receivedAmount,
        totalAmount: totalContractValue,
        pendingAmount,
        paymentStatus,
        dueDate,
        category,
        clientName,
        clientPhone,
        projectDetails,
        date,
        paymentMethod,
        createdAt: isoDate,
      };
      const updated = [newRec, ...incomeRecords];
      setIncomeRecords(updated);
      localStorage.setItem(DN_ADMIN_INCOME_KEY, JSON.stringify(updated));

      const newLog: IncomeAuditLog = {
        id: `log_${Date.now()}`,
        action: "ADDED",
        description: `Added ${formatINR(receivedAmount)} (${pendingAmount > 0 ? `${formatINR(pendingAmount)} Pending` : "Fully Paid"}) for ${category} (Client: ${clientName})`,
        timestamp,
        isoDate,
      };
      const updatedLogs = [newLog, ...auditLogs];
      setAuditLogs(updatedLogs);
      localStorage.setItem(DN_ADMIN_LOGS_KEY, JSON.stringify(updatedLogs));

      fetch("/api/finances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ record: newRec, log: newLog }),
      }).catch((err) => console.error("Error creating transaction in DB:", err));

      showToast(`Logged transaction for ${clientName}`);
    }

    setIncomeModalOpen(false);
    setEditingIncome(null);
  };

  // Handle Delete
  const handleDeleteIncome = (record: IncomeRecord) => {
    if (confirm(`Delete transaction of ${formatINR(record.amount)} from ${record.clientName}?`)) {
      const updated = incomeRecords.filter((r) => r.id !== record.id);
      setIncomeRecords(updated);
      localStorage.setItem(DN_ADMIN_INCOME_KEY, JSON.stringify(updated));

      const timestamp = getFormattedDateTime();
      const isoDate = new Date().toISOString();
      const newLog: IncomeAuditLog = {
        id: `log_${Date.now()}`,
        action: "DELETED",
        description: `Deleted record: ${formatINR(record.amount)} for ${record.clientName} (${record.category})`,
        timestamp,
        isoDate,
      };
      const updatedLogs = [newLog, ...auditLogs];
      setAuditLogs(updatedLogs);
      localStorage.setItem(DN_ADMIN_LOGS_KEY, JSON.stringify(updatedLogs));

      fetch("/api/finances", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: record.id, log: newLog }),
      }).catch((err) => console.error("Error deleting transaction in DB:", err));

      if (viewingDetail?.id === record.id) {
        setViewingDetail(null);
      }
      showToast(`Deleted transaction for ${record.clientName}`);
    }
  };

  // Lock screen if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">Protected Ledger</h1>
            <p className="text-stone-500 text-xs">Enter your owner passcode to view all transactions</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full pl-4 pr-11 py-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && <p className="text-rose-600 text-xs mt-1.5">{authError}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
            >
              Unlock Ledger
            </button>
          </form>
          <div className="text-center">
            <Link href="/admin" className="text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium">
              &larr; Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-stone-200 selection:text-stone-900 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg animate-in slide-in-from-bottom duration-200 flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar - Apple Style Glass Header */}
      <header className="sticky top-0 z-30 bg-[#faf9f6]/80 backdrop-blur-xl border-b border-stone-200/60 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs border border-stone-200/60 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <div className="h-3.5 w-px bg-stone-300/80 hidden sm:block" />
            <Link href="/" target="_blank" className="inline-flex items-center select-none" title="Visit Design Nayan Website">
              <img
                src="/images/logo.png"
                alt="Design Nayan"
                className="h-6 w-auto object-contain"
              />
            </Link>
            <div className="h-3.5 w-px bg-stone-300/80 hidden sm:block" />
            <div>
              <h1 className="text-base font-bold text-stone-900 tracking-tight">
                All Transactions
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/history"
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1.5 border border-stone-200/60 shadow-2xs transition-all"
            >
              <History className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">All Audits</span>
            </Link>

            <button
              onClick={() => {
                setEditingIncome(null);
                setIncomeModalOpen(true);
              }}
              className="px-4 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Transaction</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Minimalist Metrics Grid - Pure Typography, No Lines, Full Horizontal Width */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-1">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Received Income</span>
            </div>
            <div className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              {formatINR(totalReceived)}
            </div>
            <div className="text-[11px] text-stone-400 font-normal">{activeTimeLabel} &bull; Collected cash</div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-rose-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Pending Balance</span>
            </div>
            <div className="text-3xl sm:text-4xl font-semibold text-rose-600 tracking-tight">
              {formatINR(totalPending)}
            </div>
            <div className="text-[11px] text-rose-600/80 font-medium">Awaiting client collection</div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
              Total Deal Value
            </div>
            <div className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              {formatINR(totalContractValue)}
            </div>
            <div className="text-[11px] text-stone-400 font-normal">Gross contract worth</div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
              Deals Logged
            </div>
            <div className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              {filteredTransactions.length}
            </div>
            <div className="text-[11px] text-stone-400 font-normal">Matching records in scope</div>
          </div>
        </div>

        {/* Clean Controls Toolbar (Search with Category Dropdown, Timeframe, Payment Status) */}
        <div className="space-y-3">
          {/* Spotlight Search Field with Integrated Category Filter */}
          <div className="relative flex items-center bg-white rounded-2xl border border-stone-200/70 shadow-2xs focus-within:ring-2 focus-within:ring-stone-900/10 focus-within:border-stone-300 transition-all">
            <Search className="w-4 h-4 text-stone-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions, clients, notes, or amounts..."
              className="w-full pl-3 pr-2 py-3 bg-transparent text-stone-900 text-sm focus:outline-none placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mr-2 text-stone-400 hover:text-stone-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                Clear
              </button>
            )}

            {/* Category Filter Dropdown attached right on the Search Bar */}
            <div className="h-6 w-px bg-stone-200 shrink-0" />
            <div className="relative shrink-0 pr-3 pl-2.5 flex items-center">
              <Filter className="w-3.5 h-3.5 text-stone-400 mr-1.5 pointer-events-none shrink-0" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-stone-700 text-xs font-semibold py-2 pr-6 rounded-lg hover:text-stone-900 focus:outline-none cursor-pointer appearance-none transition-colors"
                title="Filter by Category"
              >
                <option value="ALL">All Categories</option>
                {INCOME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Timeframe & Payment Status Segmented Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Timeframe Segmented Control */}
            <div className="flex items-center gap-1 bg-stone-200/50 p-1 rounded-full overflow-x-auto no-scrollbar w-fit">
              {[
                { id: "this_month", label: "This Month" },
                { id: "3_months", label: "3 Months" },
                { id: "6_months", label: "6 Months" },
                { id: "this_year", label: "This Year" },
                { id: "all_time", label: "All Time" },
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeFilter(tf.id as TimeFilterType)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                    timeFilter === tf.id
                      ? "bg-white text-stone-900 shadow-xs font-semibold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Payment Status Segmented Control */}
            <div className="flex items-center gap-1 bg-stone-200/50 p-1 rounded-full w-fit">
              <button
                onClick={() => setPaymentFilter("ALL")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  paymentFilter === "ALL"
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => setPaymentFilter("PENDING_ONLY")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  paymentFilter === "PENDING_ONLY"
                    ? "bg-white text-rose-600 shadow-xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setPaymentFilter("PAID")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  paymentFilter === "PAID"
                    ? "bg-white text-emerald-800 shadow-xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Paid in Full
              </button>
            </div>
          </div>
        </div>

        {/* Clean, Continuous Stream Ledger (Apple Minimalist Style) */}
        <div className="bg-white rounded-3xl border border-stone-200/60 shadow-2xs overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">No transactions found</h3>
              <p className="text-stone-400 text-xs max-w-sm mx-auto">
                Try clearing your search or switching timeframe filters.
              </p>
              <button
                onClick={() => {
                  setTimeFilter("all_time");
                  setCategoryFilter("ALL");
                  setPaymentFilter("ALL");
                  setSearchQuery("");
                }}
                className="text-xs text-stone-600 hover:text-stone-900 font-semibold underline underline-offset-4 cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredTransactions.map((rec) => {
                const isPending = (rec.pendingAmount || 0) > 0;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setViewingDetail(rec)}
                    className="p-4 sm:px-6 sm:py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/60 transition-colors cursor-pointer group"
                  >
                    {/* Left: Indicator Dot & Client/Project Details */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Status Indicator Dot (Green for Paid, Red for Pending) */}
                      <div className="relative shrink-0">
                        <span
                          className={`w-2.5 h-2.5 rounded-full block ${
                            !isPending
                              ? "bg-emerald-500 ring-4 ring-emerald-50"
                              : "bg-rose-500 ring-4 ring-rose-50 animate-pulse"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 space-y-0.5 flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight group-hover:text-black">
                          {rec.clientName}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-stone-400 font-normal">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                            {rec.category}
                          </span>
                          <span>&bull;</span>
                          <span>{rec.date}</span>
                          <span>&bull;</span>
                          <span>{rec.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amounts & Clear Easy-to-Click Action Buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                      <div className="text-left sm:text-right">
                        <div className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                          {formatINR(rec.amount)}
                        </div>
                        <div className={`text-[11px] font-medium ${isPending ? "text-rose-600" : "text-stone-400 font-normal"}`}>
                          {isPending ? `Pending: ${formatINR(rec.pendingAmount || 0)}` : "Paid in full"}
                        </div>
                      </div>

                      {/* Clear, Convenient Action Buttons */}
                      <div
                        className="flex items-center gap-2 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setEditingIncome(rec);
                            setIncomeModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs border border-stone-200/60 cursor-pointer active:scale-95"
                          title="Edit transaction"
                        >
                          <Pencil className="w-3.5 h-3.5 text-stone-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteIncome(rec)}
                          className="px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs border border-rose-200/60 cursor-pointer active:scale-95"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* MINI POPUP MODAL: TRANSACTION DETAILS (Matches Dashboard) */}
      {/* ========================================================= */}
      {viewingDetail && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setViewingDetail(null)}
        >
          <div
            className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-6 shadow-2xl my-8 text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {viewingDetail.category}
                </span>
                <span className="text-xs text-stone-400">{viewingDetail.date}</span>
              </div>
              <button
                onClick={() => setViewingDetail(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client Info Header */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-stone-900">{viewingDetail.clientName}</h2>
              <div className="text-xs text-stone-500 flex flex-wrap items-center gap-x-4">
                <span>
                  Payment Mode: <strong className="text-stone-800">{viewingDetail.paymentMethod}</strong>
                </span>
                {viewingDetail.clientPhone && <span>Phone: {viewingDetail.clientPhone}</span>}
              </div>
            </div>

            {/* Financial Health Mini Card */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Received Amount
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-700">
                    {formatINR(viewingDetail.amount)}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                    Actual Income in Bank
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Pending Balance
                  </span>
                  <span
                    className={`text-2xl font-extrabold ${
                      (viewingDetail.pendingAmount || 0) > 0 ? "text-rose-600" : "text-stone-400"
                    }`}
                  >
                    {formatINR(viewingDetail.pendingAmount || 0)}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium block mt-0.5">
                    {(viewingDetail.pendingAmount || 0) > 0 ? "Awaiting Collection" : "Fully Cleared"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-semibold text-stone-700">
                <span>Total Project Contract Value</span>
                <span className="text-stone-900 font-bold">
                  {formatINR(viewingDetail.totalAmount || viewingDetail.amount)}
                </span>
              </div>

              {viewingDetail.dueDate && (viewingDetail.pendingAmount || 0) > 0 && (
                <div className="pt-2 border-t border-stone-200/60 text-xs text-rose-700 flex items-center justify-between font-medium">
                  <span>Balance Due Date:</span>
                  <span className="font-bold">{viewingDetail.dueDate}</span>
                </div>
              )}
            </div>

            {/* Project Scope Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Project Scope & Notes</h3>
              <p className="text-xs text-stone-600 leading-relaxed bg-white p-3.5 rounded-xl border border-stone-200/80">
                {viewingDetail.projectDetails || "No additional project notes logged."}
              </p>
            </div>

            {/* Action Buttons inside Mini Page */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-2">
                {viewingDetail.clientPhone && (
                  <a
                    href={`https://wa.me/${viewingDetail.clientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hi ${viewingDetail.clientName}! Regarding your project with Design Nayan (${
                        viewingDetail.category
                      }): We have recorded payment of ${formatINR(viewingDetail.amount)}.${
                        (viewingDetail.pendingAmount || 0) > 0
                          ? ` The pending balance is ${formatINR(viewingDetail.pendingAmount || 0)}.`
                          : " Thank you for the complete payment!"
                      }`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Client</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const rec = viewingDetail;
                    setViewingDetail(null);
                    setEditingIncome(rec);
                    setIncomeModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteIncome(viewingDetail)}
                  className="px-3.5 py-2 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOG / EDIT TRANSACTION MODAL */}
      {incomeModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/30 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIncomeModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-xl border border-stone-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {editingIncome ? "Edit Transaction" : "Log New Transaction"}
                </h3>
                <p className="text-stone-400 text-xs">
                  {editingIncome ? "Update payment & scope details" : "Add private agency revenue record"}
                </p>
              </div>
              <button
                onClick={() => setIncomeModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIncome} className="space-y-4">
              {/* Amounts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Received Amount (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={editingIncome?.amount || ""}
                    placeholder="e.g. 100000"
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400"
                  />
                  <span className="text-[10px] text-stone-400">Actual collected cash</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Total Deal Value (₹)
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    defaultValue={editingIncome?.totalAmount || editingIncome?.amount || ""}
                    placeholder="e.g. 150000"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400"
                  />
                  <span className="text-[10px] text-stone-400">Total contract value</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                <select
                  name="category"
                  defaultValue={editingIncome?.category || INCOME_CATEGORIES[0]}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400"
                >
                  {INCOME_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Client Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    defaultValue={editingIncome?.clientName || ""}
                    placeholder="e.g. Northeast Ventures"
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Client Phone (Optional)</label>
                  <input
                    type="text"
                    name="clientPhone"
                    defaultValue={editingIncome?.clientPhone || ""}
                    placeholder="+91 98640 12345"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400"
                  />
                </div>
              </div>

              {/* Date & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Date Received</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingIncome?.date || new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date (Optional)</label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={editingIncome?.dueDate || ""}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Method</label>
                <select
                  name="paymentMethod"
                  defaultValue={editingIncome?.paymentMethod || "Bank Transfer"}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI / IMPS">UPI / IMPS</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Project Scope */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Project Details & Notes</label>
                <textarea
                  name="projectDetails"
                  rows={2}
                  defaultValue={editingIncome?.projectDetails || ""}
                  placeholder="e.g. Website development advance milestone received, final launch balance pending."
                  className="w-full px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIncomeModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {editingIncome ? "Update Transaction" : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
