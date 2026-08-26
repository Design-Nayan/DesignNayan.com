"use client";

import React from "react";
import { 
  Building2, 
  Users, 
  Layers, 
  TrendingUp, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Plus
} from "lucide-react";
import { allServices, recentProjects, heroStats } from "@/modules/home/data/home.data";
import { siteConfig } from "@/config/site";

export default function AdminDashboardPage() {
  const recentInquiries = [
    {
      id: "inq_1",
      name: "Pranab Gogoi",
      phone: "+91 94350 12345",
      service: "3D Rendering & Floor Plan",
      location: "Guwahati, Assam",
      status: "NEW",
      time: "25 mins ago",
    },
    {
      id: "inq_2",
      name: "Bikash Barman",
      phone: "+91 98640 67890",
      service: "Turnkey Construction",
      location: "Silchar, Assam",
      status: "IN REVIEW",
      time: "2 hours ago",
    },
    {
      id: "inq_3",
      name: "Mitali Das",
      phone: "+91 97060 11223",
      service: "Interior Design & Furnishing",
      location: "Dibrugarh, Assam",
      status: "CONTACTED",
      time: "Yesterday",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 sm:p-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">{siteConfig.banglaName}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 font-semibold uppercase">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Realtime project inquiries, service catalog, and content management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md">
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Total Inquiries</span>
            <Users className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-white">128</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% this month
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Active Projects</span>
            <Building2 className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-white">14</div>
          <div className="text-[11px] text-neutral-400 mt-1">8 Construction &bull; 6 Design</div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Published Services</span>
            <Layers className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-white">{allServices.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Across 5 ecosystem sectors</div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Portfolio Items</span>
            <CheckCircle2 className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-white">{recentProjects.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Guwahati, Kolkata & Shillong</div>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Recent Client Inquiries</h2>
          <span className="text-xs text-neutral-400">Auto-synced from website forms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Phone / WhatsApp</th>
                <th className="py-3 px-4">Service Required</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {recentInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{inq.name}</td>
                  <td className="py-3.5 px-4 font-mono text-neutral-300">{inq.phone}</td>
                  <td className="py-3.5 px-4 text-rose-400 font-medium">{inq.service}</td>
                  <td className="py-3.5 px-4 text-neutral-400">{inq.location}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                      inq.status === "NEW" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                      inq.status === "IN REVIEW" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {inq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {inq.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
