import { Suspense } from "react";
import { Metadata } from "next";
import { CreatorsSearchView } from "@/modules/creators/CreatorsSearchView";

export const metadata: Metadata = {
  title: "Search Creators Network | Design Nayan",
  description:
    "Search and discover vetted creators for your brand campaign. Filter by niche, category, format, and reach across luxury fashion, viral UGC, 3D motion, and CGI.",
};

export default function CreatorsSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfcfb]" />}>
      <CreatorsSearchView />
    </Suspense>
  );
}
