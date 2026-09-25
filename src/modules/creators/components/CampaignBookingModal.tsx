"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Sparkles,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Send,
  Calendar,
  DollarSign,
  Building,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import { Creator, CampaignInquiry } from "../creators.types";

interface CampaignBookingModalProps {
  isOpen: boolean;
  selectedCreators: Creator[];
  onClose: () => void;
  onRemoveCreator: (creatorId: string) => void;
  onClearAll: () => void;
}

export function CampaignBookingModal({
  isOpen,
  selectedCreators,
  onClose,
  onRemoveCreator,
  onClearAll,
}: CampaignBookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<CampaignInquiry>({
    selectedCreatorIds: selectedCreators.map((c) => c.id),
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
    objective: "Viral Brand Growth",
    budgetBracket: "$5,000 – $10,000",
    timeline: "Next 2 Weeks",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClearAll();
    onClose();
  };

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-3xl bg-white text-neutral-900 rounded-3xl shadow-2xl overflow-hidden my-auto h-[90vh] max-h-[92vh] flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-[#fafafa] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 font-bold">
              Design Nayan • Campaign Booking Desk
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close booking modal"
            className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="overflow-y-auto overscroll-contain p-6 sm:p-8 flex-1 min-h-0"
        >
          {submitted ? (
            /* Success State */
            <div className="py-10 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-900">
                  Campaign Brief Received!
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-neutral-900">{formData.clientName || "Partner"}</strong>. Our Talent Director and Creative Leads have received your creator shortlist for <strong className="text-neutral-900">{formData.companyName || "your brand"}</strong>.
                </p>
              </div>

              {/* Agency SLA Guarantee Box */}
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  What Happens in the Next 2 Hours:
                </div>
                <ul className="text-xs text-neutral-600 space-y-2 list-disc pl-5">
                  <li>Creator availability confirmed for your target timeline ({formData.timeline}).</li>
                  <li>Customized proposal deck with wholesale package rates sent to <span className="font-semibold text-neutral-900">{formData.email}</span>.</li>
                  <li>Dedicated Creative Director assigned for script review and quality assurance.</li>
                </ul>
              </div>

              <button
                onClick={handleResetAndClose}
                className="mt-4 px-8 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
              >
                Back to Creator Directory
              </button>
            </div>
          ) : (
            /* Booking Form State */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Selected Creators Summary */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold">
                    Selected Campaign Creators ({selectedCreators.length})
                  </h4>
                  {selectedCreators.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearAll}
                      className="text-[11px] text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                {selectedCreators.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                    {selectedCreators.map((creator) => (
                      <div
                        key={creator.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                            <Image
                              src={creator.avatar || creator.featuredImage}
                              alt={creator.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-neutral-900 block truncate">
                              {creator.name}
                            </span>
                            <span className="text-[11px] text-neutral-500 block truncate">
                              {creator.category.split(" ")[0]} • From {creator.startingRate}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveCreator(creator.id)}
                          aria-label={`Remove ${creator.name}`}
                          className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                    <span>No specific creators selected yet. We will curate a bespoke roster based on your brief!</span>
                  </div>
                )}
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold">
                  Campaign & Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Client Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Chen"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    />
                  </div>

                  {/* Company / Brand Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-neutral-400" />
                      Brand / Company *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Solis Audio / DTC Skincare"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="maya@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                {/* Campaign Strategy Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Primary Objective</label>
                    <select
                      value={formData.objective}
                      onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800 outline-none focus:border-red-500"
                    >
                      <option value="Viral Brand Growth">Viral Brand Growth</option>
                      <option value="Product Launch Campaign">Product Launch Campaign</option>
                      <option value="High-Converting UGC Ads">High-Converting UGC Ads</option>
                      <option value="Luxury Lookbook / Stills">Luxury Lookbook / Stills</option>
                      <option value="Long-Term Brand Ambassador">Long-Term Ambassador</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Campaign Timeline</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800 outline-none focus:border-red-500"
                    >
                      <option value="Immediate (48 Hours)">Immediate (48 Hours)</option>
                      <option value="Next 2 Weeks">Next 2 Weeks</option>
                      <option value="Next Month">Next Month</option>
                      <option value="Quarterly Campaign">Quarterly Campaign</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Target Budget Bracket</label>
                    <select
                      value={formData.budgetBracket}
                      onChange={(e) => setFormData({ ...formData, budgetBracket: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800 outline-none focus:border-red-500"
                    >
                      <option value="$2,000 – $5,000">$2,000 – $5,000</option>
                      <option value="$5,000 – $10,000">$5,000 – $10,000</option>
                      <option value="$10,000 – $25,000">$10,000 – $25,000</option>
                      <option value="$25,000+ Enterprise">$25,000+ Enterprise</option>
                    </select>
                  </div>
                </div>

                {/* Brief Notes */}
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-neutral-400" />
                    Campaign Notes & Specific Deliverables (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the product, key messaging hooks, or links to references..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              {/* Bottom Agency Guarantee & Action */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero upfront risk • Standard NDA & IP licensing guaranteed</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Campaign Brief</span>
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
