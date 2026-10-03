import React from "react";
import { Metadata } from "next";
import { AboutView } from "@/modules/about/components/AboutView";

export const metadata: Metadata = {
  title: "About Us | Design Nayan",
  description: "Learn more about Design Nayan, our holistic Design, Build & Stay ecosystem in Guwahati, Assam.",
};

export default function AboutPage() {
  return <AboutView />;
}
