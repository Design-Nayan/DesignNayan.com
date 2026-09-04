"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  BedDouble, 
  Bath, 
  CheckCircle2, 
  ShieldCheck, 
  Hotel, 
  PhoneCall, 
  MessageSquare, 
  SlidersHorizontal,
  Calendar,
  Sparkles
} from "lucide-react";
import { vacationHomesAndHotels, stayLocations, StayProperty } from "../data/stay.data";
import { cn } from "@/lib/utils";

export function HotelsCatalogView() {
  const searchParams = useSearchParams();
  const initialPropertyId = searchParams.get("property");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedProperty, setSelectedProperty] = useState<StayProperty | null>(
    initialPropertyId 
      ? vacationHomesAndHotels.find((p) => p.id === initialPropertyId) || null 
      : null
  );

  const categories = ["ALL", "Vacation Home", "Boutique Hotel", "Luxury Resort", "Architectural Homestay"];

  const filteredProperties = vacationHomesAndHotels.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === "All Locations" || property.city === selectedLocation;

    const matchesCategory =
      selectedCategory === "ALL" || property.category === selectedCategory;

    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-50/60 select-none pb-20 font-sans">
      
      {/* 1. Header Banner & Search Deck */}
      <section className="bg-neutral-950 text-white pt-10 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            href="/stay"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stay & Discover</span>
          </Link>

          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase block font-mono">
              HOTEL & VACATION HOME BOOKING
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Hotels & <span className="text-rose-500">Vacation Homes</span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm md:text-base leading-relaxed">
              Explore authentic luxury villas, colonial tea retreats, and boutique nature hotels across Northeast India.
            </p>
          </div>

          {/* Search Deck */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-neutral-100 text-neutral-900 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 flex items-center gap-2.5 px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by villa name, city, or destination..."
                className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-neutral-400 hover:text-neutral-700 font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Location Filter Dropdown */}
            <div className="md:col-span-3 flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-neutral-800 focus:outline-none cursor-pointer"
              >
                {stayLocations.map((loc) => (
                  <option key={loc} value={loc} className="text-neutral-900">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset / Count Action */}
            <div className="md:col-span-3 flex items-center justify-between px-1">
              <span className="text-xs font-bold text-neutral-600 font-mono">
                {filteredProperties.length} Properties
              </span>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLocation("All Locations");
                  setSelectedCategory("ALL");
                }}
                className="text-xs font-bold text-rose-600 hover:underline uppercase"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "shrink-0 px-3.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95",
                    isSelected
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                      : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                  )}
                >
                  {cat === "ALL" ? "All Properties" : cat}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. Properties Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProperties.map((stay) => (
            <div
              key={stay.id}
              onClick={() => setSelectedProperty(stay)}
              className="rounded-3xl bg-white border border-neutral-200/90 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group active:scale-[0.99] cursor-pointer"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-neutral-100">
                <img
                  src={stay.image}
                  alt={stay.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md text-[10px] font-bold tracking-wider text-white uppercase font-mono shadow-sm">
                    {stay.tag}
                  </span>
                </div>
                <div className="absolute bottom-3.5 right-3.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                  <span className="text-xs font-bold text-neutral-900 font-mono">{stay.rating}</span>
                  <span className="text-[10px] text-neutral-500 font-normal">({stay.reviewsCount})</span>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{stay.location}</span>
                  </div>
                  <h3 className="text-base sm:lg font-bold text-neutral-950 group-hover:text-rose-600 transition-colors">
                    {stay.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1.5 font-normal leading-relaxed line-clamp-2">
                    {stay.description}
                  </p>

                  <div className="flex items-center gap-3 pt-3 text-[11px] text-neutral-600 border-t border-neutral-100 mt-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{stay.guests} Guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{stay.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{stay.bathrooms} Baths</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {stay.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-medium text-neutral-700"
                      >
                        {amenity}
                      </span>
                    ))}
                    {stay.amenities.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-neutral-50 text-[10px] font-medium text-neutral-400">
                        +{stay.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div>
                    <span className="text-[10px] text-neutral-400 block leading-tight">Price per night</span>
                    <span className="text-base sm:text-lg font-extrabold text-neutral-950 font-mono">
                      ₹{stay.pricePerNight.toLocaleString()}
                      <span className="text-xs font-normal text-neutral-500"> /night</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(stay);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-neutral-950 group-hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Hotel Details Modal */}
      {selectedProperty && (
        <div 
          onClick={() => setSelectedProperty(null)}
          className="fixed inset-0 z-50 bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-3 pt-3 pb-24 sm:p-6 sm:pb-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[calc(100vh-140px)] sm:max-h-[88vh] flex flex-col shadow-2xl border border-neutral-200 text-neutral-900 relative my-auto overflow-hidden"
          >
            <div className="flex items-center p-3.5 sm:p-4 border-b border-neutral-100 bg-white">
              <button
                onClick={() => setSelectedProperty(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-950 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-rose-600" />
                <span>Back to Stays</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-neutral-950/80 backdrop-blur-md text-[9px] sm:text-xs font-bold tracking-wider text-white uppercase font-mono shadow-sm">
                    {selectedProperty.category}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 sm:p-4 rounded-xl text-white">
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-rose-400 font-semibold mb-0.5">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{selectedProperty.location}</span>
                  </div>
                  <h2 className="text-base sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                    {selectedProperty.title}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-neutral-50 p-2.5 sm:p-3.5 rounded-xl border border-neutral-200/80 text-center">
                <div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Starting Rate</div>
                  <div className="text-[11px] sm:text-xs font-bold text-neutral-950 font-mono mt-0.5">₹{selectedProperty.pricePerNight.toLocaleString()}/night</div>
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Capacity</div>
                  <div className="text-[11px] sm:text-xs font-bold text-neutral-950 mt-0.5">{selectedProperty.guests} Guests • {selectedProperty.bedrooms} Beds</div>
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Rating</div>
                  <div className="text-[11px] sm:text-xs font-bold text-neutral-950 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-rose-600 text-rose-600" />
                    <span>{selectedProperty.rating} ({selectedProperty.reviewsCount})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Stay & Experience Details
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed font-normal">
                  {selectedProperty.description}
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Included Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {selectedProperty.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 border-t border-neutral-200/80 bg-neutral-50 flex flex-row items-center gap-2 sm:gap-3 shrink-0">
              <a
                href={`https://wa.me/918472934031?text=${encodeURIComponent(
                  `Hi Design Nayan Stay! I am interested in booking *${selectedProperty.title}* in ${selectedProperty.city} (Starting ₹${selectedProperty.pricePerNight.toLocaleString()}/night). Please share availability.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>WhatsApp Us</span>
              </a>

              <Link
                href={`/contact?service=Hotel+Stay&property=${encodeURIComponent(selectedProperty.title)}`}
                onClick={() => setSelectedProperty(null)}
                className="flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl bg-neutral-950 hover:bg-rose-600 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center whitespace-nowrap"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
