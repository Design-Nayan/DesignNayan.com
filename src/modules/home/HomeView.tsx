import React from "react";
import { HeroSection } from "./components/HeroSection";
import { ServicesGrid } from "./components/ServicesGrid";
import { EcosystemSection } from "./components/EcosystemSection";
import { RecentWorkCarousel } from "@/modules/projects";
import { ProcessFlow } from "./components/ProcessFlow";
import { TestimonialsSection } from "@/modules/testimonials";
import { BrandLogosMarquee } from "@/modules/brands";
import { ContactCTASplit } from "./components/ContactCTASplit";

export function HomeView() {
  return (
    <div className="flex flex-col bg-white text-neutral-900">
      <HeroSection />
      <ServicesGrid />
      <EcosystemSection />
      <RecentWorkCarousel />
      <ProcessFlow />
      <TestimonialsSection />
      <BrandLogosMarquee />
      <ContactCTASplit />
    </div>
  );
}
