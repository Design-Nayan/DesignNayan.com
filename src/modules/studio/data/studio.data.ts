import { StudioService } from "../types/studio.types";

export const studioCategories = [
  "ALL",
  "ARCHITECTURE",
  "INTERIOR",
  "3D CGI & RENDERING",
  "DIGITAL & BRANDING",
];

export const studioServicesData: StudioService[] = [
  {
    name: "Architectural Planning",
    category: "ARCHITECTURE",
    desc: "Vastu-compliant residential & commercial blueprints with GMC approval support.",
    price: "From ₹25 / sq.ft",
    iconName: "Compass",
  },
  {
    name: "Structural Engineering",
    category: "ARCHITECTURE",
    desc: "RCC structural analysis, load calculations, and soil foundation design.",
    price: "From ₹15 / sq.ft",
    iconName: "HardHat",
  },
  {
    name: "Luxury Interior Design",
    category: "INTERIOR",
    desc: "Turnkey residential & commercial interior design with material palettes.",
    price: "From ₹1,200 / sq.ft",
    iconName: "Palette",
  },
  {
    name: "Modular Kitchen & Wardrobe",
    category: "INTERIOR",
    desc: "Ergonomic modular kitchen planning with Hafele/Hettich fittings & 3D renders.",
    price: "Custom Quote",
    iconName: "Layers",
  },
  {
    name: "3D Photorealistic Rendering",
    category: "3D CGI & RENDERING",
    desc: "Cinematic 4K exterior & interior CGI rendering for developers and buyers.",
    price: "From ₹3,500 / view",
    iconName: "Sparkles",
  },
  {
    name: "3D Architectural Animation",
    category: "3D CGI & RENDERING",
    desc: "60 FPS walkthrough animations and drone view CGI simulations.",
    price: "From ₹15,000 / reel",
    iconName: "Eye",
  },
  {
    name: "Brand Identity & Logo",
    category: "DIGITAL & BRANDING",
    desc: "Custom logo systems, typography, color theory, and complete brand guidelines.",
    price: "From ₹12,000",
    iconName: "PenTool",
  },
  {
    name: "Website & UI/UX Design",
    category: "DIGITAL & BRANDING",
    desc: "High-conversion web apps, landing pages, and interactive digital interfaces.",
    price: "From ₹25,000",
    iconName: "Globe",
  },
  {
    name: "Social Media & Marketing",
    category: "DIGITAL & BRANDING",
    desc: "Full social media handling, reel creation, meta ads, and local branding campaigns.",
    price: "From ₹15,000 / mo",
    iconName: "Megaphone",
  },
];
