import React from "react";
import { Metadata } from "next";
import { ServicesGrid } from "@/modules/home/components/ServicesGrid";
import { ContactCTASplit } from "@/modules/home/components/ContactCTASplit";

export const metadata: Metadata = {
  title: "All Services | Design Nayan",
  description: "Comprehensive 15 architectural, construction, design, and digital services by Design Nayan.",
};

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <ServicesGrid />
      <ContactCTASplit />
    </div>
  );
}
