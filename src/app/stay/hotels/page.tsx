import React, { Suspense } from "react";
import { HotelsCatalogView } from "@/modules/stay";

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading properties...</div>}>
      <HotelsCatalogView />
    </Suspense>
  );
}
