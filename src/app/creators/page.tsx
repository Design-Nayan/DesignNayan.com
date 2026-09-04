import React from "react";
import { Metadata } from "next";
import { CreatorsView } from "@/modules/creators";

export const metadata: Metadata = {
  title: "Find & Hire Content Creators | Design Nayan",
  description: "Discover verified content creators, compare transparent pricing, and hire the right talent for your next brand campaign across Beauty, Fashion, Tech, Food, Fitness, and Lifestyle.",
};

export default function CreatorsPage() {
  return <CreatorsView />;
}
