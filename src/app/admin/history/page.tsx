"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Clock,
  Lock,
  History,
  CreditCard,
  Check,
} from "lucide-react";
import {
  IncomeAuditLog,
  TimeFilterType,
  ActionFilterType,
  DN_ADMIN_LOGS_KEY,
  DN_ADMIN_AUTH_KEY,
  initialAuditLogs,
  getTimeRangeBounds,
  dynamicMatch,
  buildAuditLogSearchString,
} from "../finances-shared";

export default function AllHistoryPage() {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Data state (Permanent, Append-Only Ledger)
  const [auditLogs, setAuditLogs] = useState<IncomeAuditLog[]>([]);

  // Filter states
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("this_month");
  const [actionFilter, setActionFilter] = useState<ActionFilterType>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
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

    try {
      const storedLogs = localStorage.getItem(DN_ADMIN_LOGS_KEY);
      if (storedLogs) {
        const parsed = JSON.parse(storedLogs);
        // Automatically load expanded multi-date dataset if previous storage was smaller
        if (Array.isArray(parsed) && parsed.length >= initialAuditLogs.length) {
          setAuditLogs(parsed);
        } else {
          setAuditLogs(initialAuditLogs);
          localStorage.setItem(DN_ADMIN_LOGS_KEY, JSON.stringify(initialAuditLogs));
        }
      } else {
        setAuditLogs(initialAuditLogs);
        localStorage.setItem(DN_ADMIN_LOGS_KEY, JSON.stringify(initialAuditLogs));
      }
    } catch {
      setAuditLogs(initialAuditLogs);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPasscode = typeof window !== "undefined" ? localStorage.getItem("dn_admin_passcode") : null;
    if (["nayan2026", "admin123", "admin", savedPasscode].filter(Boolean).includes(passcode)) {
      setIsAuthenticated(true);
      localStorage.setItem(DN_ADMIN_AUTH_KEY, "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect passcode.");
    }
  };

  // Safe parse of log dates
  const parseLogDate = (log: IncomeAuditLog): Date => {
    if (log.isoDate) {
      return new Date(log.isoDate);
    }
    const parsed = new Date(log.timestamp);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
    return new Date();
  };

  // Filtered Audit Logs
  const {
    filteredLogs,
    countAdded,
    countEdited,
    countDeleted,
    activeTimeLabel,
  } = useMemo(() => {
    const { rangeStart, rangeEnd, timeLabel } = getTimeRangeBounds(timeFilter);

    // 1. Time filter
    const inTime = auditLogs.filter((log) => {
      if (timeFilter === "all_time") return true;
      const logDate = parseLogDate(log);
      return logDate >= rangeStart && logDate <= rangeEnd;
    });

    // 2. Action filter
    const inAction = inTime.filter((log) => {
      if (actionFilter === "ALL") return true;
      return log.action === actionFilter;
    });

    // 3. Dynamic search query filter (fuzzy, partial keywords, typo-tolerant)
    const matches = inAction.filter((log) => {
      const targetContent = buildAuditLogSearchString(log);
      return dynamicMatch(searchQuery, targetContent);
    });

    return {
      filteredLogs: matches,
      countAdded: inTime.filter((l) => l.action === "ADDED").length,
      countEdited: inTime.filter((l) => l.action === "EDITED").length,
      countDeleted: inTime.filter((l) => l.action === "DELETED").length,
      activeTimeLabel: timeLabel,
    };
  }, [auditLogs, timeFilter, actionFilter, searchQuery]);

  // Lock screen if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">Protected Audit Log</h1>
            <p className="text-stone-500 text-xs">Enter your owner passcode to view history</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode (e.g. nayan2026)"
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
                autoFocus
              />
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

      {/* Top Navigation Bar - Apple Style Glass Header (Clean, No Immutable text) */}
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
            <div>
              <h1 className="text-base font-bold text-stone-900 tracking-tight">
                All Audits
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/transactions"
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1.5 border border-stone-200/60 shadow-2xs transition-all"
            >
              <CreditCard className="w-3.5 h-3.5 text-stone-500" />
              <span>All Transactions</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Minimalist Metrics Grid - Pure Typography, No Lines */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-1">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Total Logged</div>
            <div className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">{filteredLogs.length}</div>
            <div className="text-[11px] text-stone-400 font-normal">{activeTimeLabel} &bull; Matching events</div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Added Entries</span>
            </div>
            <div className="text-3xl sm:text-4xl font-semibold text-emerald-950 tracking-tight">{countAdded}</div>
            <div className="text-[11px] text-stone-400 font-normal">New transactions logged</div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Edited Entries</span>
            </div>
            <div className="text-3xl sm:text-4xl font-semibold text-amber-950 tracking-tight">{countEdited}</div>
            <div className="text-[11px] text-stone-400 font-normal">Modifications saved</div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-rose-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Deleted Entries</span>
            </div>
            <div className="text-3xl sm:text-4xl font-semibold text-rose-950 tracking-tight">{countDeleted}</div>
            <div className="text-[11px] text-stone-400 font-normal">Records removed</div>
          </div>
        </div>

        {/* Clean Spotlight Search & Segmented Filter Bar */}
        <div className="space-y-3">
          {/* Search Input (Apple Spotlight Style) */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit records..."
              className="w-full pl-11 pr-16 py-3 rounded-2xl bg-white border border-stone-200/70 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300 transition-all placeholder:text-stone-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-3.5 text-stone-400 hover:text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Smooth Controls Toolbar (Timeframe & Action Filter) */}
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
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Action Filter Pills */}
            <div className="flex items-center gap-1 bg-stone-200/50 p-1 rounded-full w-fit">
              <button
                onClick={() => setActionFilter("ALL")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  actionFilter === "ALL"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActionFilter("ADDED")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  actionFilter === "ADDED"
                    ? "bg-white text-emerald-800 shadow-xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Added
              </button>
              <button
                onClick={() => setActionFilter("EDITED")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  actionFilter === "EDITED"
                    ? "bg-white text-amber-800 shadow-xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Edited
              </button>
              <button
                onClick={() => setActionFilter("DELETED")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  actionFilter === "DELETED"
                    ? "bg-white text-rose-800 shadow-xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Deleted
              </button>
            </div>
          </div>
        </div>

        {/* Clean, Continuous Activity Ledger Stream */}
        <div className="bg-white rounded-3xl border border-stone-200/60 shadow-2xs overflow-hidden">
          {filteredLogs.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">No activity recorded</h3>
              <p className="text-stone-400 text-xs max-w-sm mx-auto">
                No events match this timeframe or action filter.
              </p>
              <button
                onClick={() => {
                  setTimeFilter("all_time");
                  setActionFilter("ALL");
                  setSearchQuery("");
                }}
                className="text-xs text-stone-600 hover:text-stone-900 font-semibold underline underline-offset-4 cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredLogs.map((log) => {
                const isAdded = log.action === "ADDED";
                const isEdited = log.action === "EDITED";

                return (
                  <div
                    key={log.id}
                    className="p-4 sm:px-6 sm:py-4.5 flex items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Status Indicator Dot */}
                      <div className="relative shrink-0">
                        <span
                          className={`w-2.5 h-2.5 rounded-full block ${
                            isAdded
                              ? "bg-emerald-500 ring-4 ring-emerald-50"
                              : isEdited
                              ? "bg-amber-500 ring-4 ring-amber-50"
                              : "bg-rose-500 ring-4 ring-rose-50"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-semibold uppercase tracking-wider ${
                              isAdded
                                ? "text-emerald-700"
                                : isEdited
                                ? "text-amber-700"
                                : "text-rose-700"
                            }`}
                          >
                            {log.action}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-stone-800 truncate sm:whitespace-normal">
                          {log.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-400 font-normal shrink-0 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-300" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
