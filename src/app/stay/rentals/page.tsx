import React, { Suspense } from "react";
import { RentalsCatalogView } from "@/modules/stay";

export default function RentalsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading rentals...</div>}>
      <RentalsCatalogView />
    </Suspense>
  );
}
