"use client";

import React, { useState } from "react";
import { Shield, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { loginAdminAction } from "../admin/actions";

export default function KlaDorjaKhulPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("Please enter your master admin passcode.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await loginAdminAction(password.trim());
      if (res.success) {
        try {
          localStorage.removeItem("dn_admin_auth");
        } catch {}
        // Redirect into authenticated dashboard
        window.location.href = "/admin";
      } else {
        setErrorMsg(res.error || "Incorrect password. Please verify and try again.");
        setLoading(false);
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 flex flex-col items-center justify-center p-6 antialiased font-sans relative select-none">
      <div className="max-w-md w-full bg-white border border-stone-200/80 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-md">
            <KeyRound className="w-7 h-7 text-rose-500" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
              Design Nayan Portal
            </h1>
            <p className="text-neutral-500 text-xs">
              Enter master credentials to unlock administrative console
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2.5 font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block">
              Master Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                disabled={loading}
                autoFocus
                className="w-full px-4 py-3.5 pr-11 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3.5 px-6 rounded-2xl bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Unlocking...</span>
              </>
            ) : (
              <>
                <span>Open Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Exclusive Private Gateway</span>
        </div>
      </div>
    </div>
  );
}
