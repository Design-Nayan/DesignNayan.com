"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  Send,
  User,
  AtSign,
  Phone,
  Mail,
  MapPin,
  Tag,
  Users,
  IndianRupee,
  Link as LinkIcon,
  FileText,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { addInquiry } from "@/app/admin/inquiries-shared";
import { CREATOR_CATEGORIES, CREATOR_REACH_TIERS } from "../creators.types";

interface CreatorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatorRegistrationModal({
  isOpen,
  onClose,
}: CreatorRegistrationModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    platform: "Instagram",
    handle: "",
    email: "",
    phone: "",
    category: "Viral UGC & Short-Form",
    reachTier: "Prime (100K-500K)",
    location: "Guwahati, Assam",
    rate: "",
    portfolioLink: "",
    message: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Register inquiry into shared storage for Admin Dashboard
      addInquiry({
        name: `${formData.name.trim()} (${formData.platform}: ${formData.handle.trim()})`,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        service: `Creator Registration • ${formData.category}`,
        budget: `Reach: ${formData.reachTier}${
          formData.rate.trim() ? ` • Rate: ${formData.rate.trim()}` : ""
        }`,
        message: `Platform: ${formData.platform} | Handle: ${formData.handle.trim()} | Portfolio: ${
          formData.portfolioLink.trim() || "Not provided"
        } | About: ${formData.message.trim() || "Ready for campaigns"}`,
        location: formData.location.trim() || "Assam, India",
        status: "NEW",
        date: "Just now",
      });

      // 2. Also log to backend contact API route as fallback/persistent record
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${formData.name} (${formData.platform}: ${formData.handle})`,
            email: formData.email,
            company: `${formData.phone} | ${formData.platform}: ${formData.handle}`,
            serviceRequested: `Creator Registration • ${formData.category}`,
            budgetRange: formData.reachTier,
            message: `Platform: ${formData.platform} | Handle: ${formData.handle} | Rate: ${formData.rate} | Portfolio: ${formData.portfolioLink} | Notes: ${formData.message}`,
          }),
        });
      } catch {}

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting creator registration:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      platform: "Instagram",
      handle: "",
      email: "",
      phone: "",
      category: "Viral UGC & Short-Form",
      reachTier: "Prime (100K-500K)",
      location: "Guwahati, Assam",
      rate: "",
      portfolioLink: "",
      message: "",
    });
    onClose();
  };

  const waText = encodeURIComponent(
    `Hi Design Nayan! I just submitted an application to join as a Creator.\n` +
      `Name: ${formData.name}\n` +
      `Platform: ${formData.platform}\n` +
      `Handle: ${formData.handle}\n` +
      `Category: ${formData.category}\n` +
      `Reach: ${formData.reachTier}\n` +
      `Looking forward to connecting with your team!`
  );

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-2xl bg-white text-neutral-900 rounded-3xl shadow-2xl overflow-hidden my-auto h-[90vh] max-h-[92vh] flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-[#fafafa] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 font-bold">
              Design Nayan • Creator Application
            </span>
          </div>

          <button
            onClick={handleResetAndClose}
            aria-label="Close registration modal"
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
            /* Success Confirmation State */
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block">
                  REGISTRATION REGISTERED IN ADMIN PIPELINE
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-900">
                  Application Received!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-neutral-900">{formData.name}</strong>. Your creator profile has been forwarded to Design Nayan&apos;s Talent & Artist Management desk.
                </p>
              </div>

              {/* Offline Agency Guidance Card */}
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 text-left space-y-3.5 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  What Happens Next (Offline Agency Process):
                </div>
                <ul className="text-xs text-neutral-600 space-y-2.5 list-disc pl-5 leading-relaxed">
                  <li>
                    <strong className="text-neutral-900">Portfolio & Metric Review:</strong> Our Talent Directors review your engagement, content style, and organic reach.
                  </li>
                  <li>
                    <strong className="text-neutral-900">Direct Outreach:</strong> Because we are an offline-first agency in Assam, our team will message or call you on <strong className="text-neutral-900">{formData.phone}</strong> to discuss rates and campaign contracts.
                  </li>
                  <li>
                    <strong className="text-neutral-900">Live Creator Listing:</strong> Upon approval, your 4K card and showreel will be featured live on this website for brands to book.
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/918472934031?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat With Talent Director</span>
                </a>

                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div className="space-y-6">
              {/* Header inside modal */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-950">
                  Register as a Creator
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Name & Social Handle with App Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Full Name / Creator Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g. Aarav Baruah"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:border-red-600 focus:outline-none transition-all placeholder:text-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Social Platform & Handle *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.platform}
                        onChange={(e) =>
                          setFormData({ ...formData, platform: e.target.value })
                        }
                        className="w-28 sm:w-32 px-2.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs font-semibold focus:bg-white focus:border-red-600 focus:outline-none transition-all cursor-pointer shrink-0"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Facebook">Facebook</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="X (Twitter)">X (Twitter)</option>
                        <option value="Snapchat">Snapchat</option>
                        <option value="Moj">Moj</option>
                        <option value="Josh">Josh</option>
                        <option value="Other">Other</option>
                      </select>

                      <div className="relative flex-1 min-w-0">
                        <AtSign className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={formData.handle}
                          onChange={(e) =>
                            setFormData({ ...formData, handle: e.target.value })
                          }
                          placeholder="e.g. @aarav.visuals"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:border-red-600 focus:outline-none transition-all placeholder:text-neutral-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:border-red-600 focus:outline-none transition-all placeholder:text-neutral-400"
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-1">
                      Our offline agency connects with creators via WhatsApp/Call.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="aarav@creator.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:border-red-600 focus:outline-none transition-all placeholder:text-neutral-400"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Category & Reach */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Primary Content Category *
                    </label>
                    <div className="relative">
                      <Tag className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:border-red-600 focus:outline-none transition-all cursor-pointer"
                      >
                        {CREATOR_CATEGORIES.map((cat: string) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="Other Creative Field">
                          Other Creative Field
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Follower / Reach Tier *
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <select
                        value={formData.reachTier}
                        onChange={(e) =>
                          setFormData({ ...formData, reachTier: e.target.value })
                        }
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:border-red-600 focus:outline-none transition-all cursor-pointer"
                      >
                        {CREATOR_REACH_TIERS.map((tier: string) => (
                          <option key={tier} value={tier}>
                            {tier}
                          </option>
                        ))}
                        <option value="Emerging (< 25K)">
                          Emerging (&lt; 25K)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Location & Expected Commercial Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Base City / Region
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="e.g. Guwahati, Assam"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:border-red-600 focus:outline-none transition-all placeholder:text-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Commercial Rate (per Reel / Video)
                    </label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.rate}
                        onChange={(e) =>
                          setFormData({ ...formData, rate: e.target.value })
                        }
                        placeholder="e.g. ₹20,000 / Reel or Open"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:border-red-600 focus:outline-none transition-all placeholder:text-neutral-400"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Portfolio / Showreel Link */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                    Portfolio / Showreel / Profile URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="url"
                      value={formData.portfolioLink}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          portfolioLink: e.target.value,
                        })
                      }
                      placeholder="https://instagram.com/yourhandle or Google Drive link"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:border-red-600 focus:outline-none transition-all placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                {/* 6. Pitch & Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                    About Your Content & Brand Goals
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us about your signature visual style, brands you've collaborated with, and your equipment..."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:border-red-600 focus:outline-none transition-all placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span>Submitting profile...</span>
                    ) : (
                      <>
                        <span>SUBMIT CREATOR APPLICATION</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-neutral-400 text-center mt-2">
                    Your details will be reviewed directly by the Design Nayan talent acquisition desk.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
