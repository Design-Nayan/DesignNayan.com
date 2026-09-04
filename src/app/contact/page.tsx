"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceCategory: "Branding & Creative",
    budget: "₹1 Lakh - ₹5 Lakhs",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.phone,
          serviceRequested: formData.serviceCategory,
          budgetRange: formData.budget,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit project inquiry.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-16 bg-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase">
          CONTACT DESIGN NAYAN
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-950 tracking-tight">
          Let&apos;s Start Your Project
        </h1>
        <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
          Reach out to discuss your architectural design, Nayan Constructions, branding, or property listing requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 bg-neutral-950 text-white p-8 sm:p-10 rounded-3xl space-y-8 shadow-xl">
          <div>
            <h2 className="text-2xl font-bold mb-2">Office Information</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              We operate across Assam, Northeast India, and provide digital solutions globally.
            </p>
          </div>

          <div className="space-y-6 pt-4 border-t border-neutral-800">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Call / WhatsApp
                </div>
                <a
                  href={siteConfig.contact.whatsapp}
                  className="text-base font-bold text-white hover:text-rose-400 transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Email
                </div>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-base font-bold text-white hover:text-rose-400 transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Office Location
                </div>
                <div className="text-base font-bold text-white">
                  {siteConfig.contact.address}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800">
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-lg">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-950">Thank You!</h3>
              <p className="text-neutral-600 text-sm max-w-md mx-auto">
                Your project inquiry has been sent to Design Nayan. Our team will contact you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    serviceCategory: "Design & Architecture",
                    budget: "₹1 Lakh - ₹5 Lakhs",
                    message: "",
                  });
                }}
                className="px-6 py-2.5 rounded-lg bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 focus:border-rose-600 focus:outline-none text-neutral-900 text-sm shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 focus:border-rose-600 focus:outline-none text-neutral-900 text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 focus:border-rose-600 focus:outline-none text-neutral-900 text-sm shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                    Domain / Service Needed
                  </label>
                  <select
                    value={formData.serviceCategory}
                    onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 focus:border-rose-600 focus:outline-none text-neutral-900 text-sm shadow-sm"
                  >
                    <option value="Branding & Creative">Branding & Creative (Logo, Graphics, Video)</option>
                    <option value="Digital & Marketing">Digital & Marketing (Web, UI/UX, Ads)</option>
                    <option value="Design & Architecture">Design & Architecture (3D, Floor Plan, Interior)</option>
                    <option value="Build & Construction">Build & Construction (Nayan Constructions & Materials)</option>
                    <option value="Stay & Property">Stay & Property Listings</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  Project Details / Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your plot size, building type, location, or creative requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 focus:border-rose-600 focus:outline-none text-neutral-900 text-sm shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending inquiry...</span>
                ) : (
                  <>
                    <span>SUBMIT PROJECT INQUIRY</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
