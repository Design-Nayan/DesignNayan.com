"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Hotel, 
  Home, 
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  BedDouble,
  Bath,
  Maximize2,
  Users,
  MessageSquare,
  ArrowLeft
} from "lucide-react";
import { 
  vacationHomesAndHotels, 
  rentalPropertiesNearYou, 
  stayLocations, 
  StayProperty, 
  RentalProperty 
} from "../data/stay.data";
import { cn } from "@/lib/utils";

export function StayView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  // Selected modals for active card preview
  const [selectedRental, setSelectedRental] = useState<RentalProperty | null>(null);
  const [selectedStay, setSelectedStay] = useState<StayProperty | null>(null);

  const rentalsScrollRef = useRef<HTMLDivElement>(null);
  const staysScrollRef = useRef<HTMLDivElement>(null);

  // Filter Rentals
  const filteredRentals = rentalPropertiesNearYou.filter((rental) => {
    const matchesSearch =
      rental.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.propertyType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === "All Locations" || rental.city === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  // Filter Vacation Stays
  const filteredStays = vacationHomesAndHotels.filter((stay) => {
    const matchesSearch =
      stay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === "All Locations" || stay.city === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  const topRentals = filteredRentals.slice(0, 5);
  const topStays = filteredStays.slice(0, 5);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = clientWidth * 0.75;
      ref.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white select-none pb-20 font-sans">
      
      {/* 1. Page Header & Hero Search */}
      <section className="bg-neutral-950 text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase block font-mono">
              DESIGN NAYAN STAY & DISCOVER
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Rental Houses & <span className="text-rose-500">Hotel Stays</span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-base lg:text-lg leading-relaxed font-normal">
              One platform for verified local rental houses and curated boutique hotels & vacation stays across Northeast India.
            </p>
          </div>

          {/* Search Bar & Location Filter */}
          <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-4 shadow-2xl border border-neutral-100/90 text-neutral-900">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rental houses, boutique hotels, or locations..."
                className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none py-1.5"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-neutral-400 hover:text-neutral-700 font-bold px-1.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Location Filter Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pt-3 sm:pt-3.5 pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 shrink-0 mr-1 hidden sm:inline-block">
                Location:
              </span>
              {stayLocations.map((loc) => {
                const isSelected = selectedLocation === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={cn(
                      "shrink-0 px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95",
                      isSelected
                        ? "bg-rose-600 text-white shadow-sm"
                        : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200"
                    )}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 2. Top Section: Rented Houses Near You */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase block mb-1.5 font-mono">
              LOCALITY RENTALS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              Rented Houses <span className="text-rose-600">Near You</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-normal">
              Showing {topRentals.length} verified rental houses in your locality
            </p>
          </div>

          <div className="hidden 2xl:flex items-center gap-1.5">
            <button
              onClick={() => scrollContainer(rentalsScrollRef, "left")}
              className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors active:scale-95 shadow-sm cursor-pointer"
              aria-label="Previous rental"
            >
              <ChevronLeft className="w-4 h-4 text-rose-600" />
            </button>
            <button
              onClick={() => scrollContainer(rentalsScrollRef, "right")}
              className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors active:scale-95 shadow-sm cursor-pointer"
              aria-label="Next rental"
            >
              <ChevronRight className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        </div>

        <div
          ref={rentalsScrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x-mandatory touch-pan-x -mx-4 px-4 sm:-mx-6 sm:px-6 pb-4 scroll-pl-4 sm:scroll-pl-6"
        >
          {topRentals.map((rental) => (
            <div
              key={rental.id}
              onClick={() => setSelectedRental(rental)}
              className="shrink-0 w-[270px] sm:w-[330px] snap-start rounded-2xl bg-white border border-neutral-200/90 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group active:scale-[0.99] cursor-pointer"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-neutral-100">
                <img
                  src={rental.image}
                  alt={rental.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-[9px] font-bold tracking-wider text-white uppercase font-mono shadow-sm">
                    {rental.propertyType}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-bold font-mono">
                  {rental.furnishing}
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500 mb-1">
                    <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                    <span className="truncate">{rental.locality}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-950 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {rental.title}
                  </h3>
                  
                  <div className="flex items-center gap-2.5 text-[11px] text-neutral-600 pt-2">
                    <div className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{rental.bedrooms} Bed</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{rental.bathrooms} Bath</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{rental.carpetAreaSqFt} sq.ft</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <div>
                    <span className="text-[10px] text-neutral-400 block leading-tight">Monthly Rent</span>
                    <span className="text-sm sm:text-base font-extrabold text-neutral-950 font-mono">
                      ₹{rental.monthlyRent.toLocaleString()}
                      <span className="text-[10px] font-normal text-neutral-500"> /mo</span>
                    </span>
                  </div>

                  <span className="px-3.5 py-2 rounded-xl bg-neutral-950 group-hover:bg-rose-600 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95">
                    View House
                  </span>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/stay/rentals"
            className="shrink-0 w-[200px] sm:w-[260px] snap-start rounded-2xl bg-neutral-950 text-white p-6 flex flex-col items-center justify-center text-center group hover:bg-neutral-900 transition-all duration-300 shadow-xl active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-rose-600 group-hover:border-rose-500 transition-all">
              <Building2 className="w-5 h-5 text-rose-400 group-hover:text-white transition-colors" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-rose-500 uppercase font-mono mb-1">
              LOCALITY SEARCH
            </span>
            <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
              Explore All Rental Houses
            </h4>
            <p className="text-[11px] text-neutral-400 mb-4 font-normal leading-relaxed">
              Find 1, 2, 3 BHK flats, builder floors & villas near you
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500 group-hover:text-rose-400">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* 3. Below Section: Vacation Homes & Boutique Hotels */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 sm:space-y-8 border-t border-neutral-100">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase block mb-1.5 font-mono">
              CURATED HOTEL & VACATION STAYS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              Vacation Homes & <span className="text-rose-600">Boutique Hotels</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-normal">
              Showing {topStays.length} experiential villas and boutique stays
            </p>
          </div>

          <div className="hidden 2xl:flex items-center gap-1.5">
            <button
              onClick={() => scrollContainer(staysScrollRef, "left")}
              className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors active:scale-95 shadow-sm cursor-pointer"
              aria-label="Previous stay"
            >
              <ChevronLeft className="w-4 h-4 text-rose-600" />
            </button>
            <button
              onClick={() => scrollContainer(staysScrollRef, "right")}
              className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors active:scale-95 shadow-sm cursor-pointer"
              aria-label="Next stay"
            >
              <ChevronRight className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        </div>

        <div
          ref={staysScrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x-mandatory touch-pan-x -mx-4 px-4 sm:-mx-6 sm:px-6 pb-4 scroll-pl-4 sm:scroll-pl-6"
        >
          {topStays.map((stay) => (
            <div
              key={stay.id}
              onClick={() => setSelectedStay(stay)}
              className="shrink-0 w-[270px] sm:w-[330px] snap-start rounded-2xl bg-white border border-neutral-200/90 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group active:scale-[0.99] cursor-pointer"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-neutral-100">
                <img
                  src={stay.image}
                  alt={stay.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-md text-[9px] font-bold tracking-wider text-white uppercase font-mono shadow-sm">
                    {stay.tag}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-rose-600 text-rose-600" />
                  <span className="text-[11px] font-bold text-neutral-900 font-mono">{stay.rating}</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500 mb-1">
                    <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                    <span className="truncate">{stay.location}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-950 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {stay.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 font-normal leading-relaxed">
                    {stay.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <div>
                    <span className="text-[10px] text-neutral-400 block leading-tight">Starting from</span>
                    <span className="text-sm sm:text-base font-extrabold text-neutral-950 font-mono">
                      ₹{stay.pricePerNight.toLocaleString()}
                      <span className="text-[10px] font-normal text-neutral-500"> /night</span>
                    </span>
                  </div>

                  <span className="px-3.5 py-2 rounded-xl bg-neutral-950 group-hover:bg-rose-600 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95">
                    View Details
                  </span>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/stay/hotels"
            className="shrink-0 w-[200px] sm:w-[260px] snap-start rounded-2xl bg-neutral-950 text-white p-6 flex flex-col items-center justify-center text-center group hover:bg-neutral-900 transition-all duration-300 shadow-xl active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-rose-600 group-hover:border-rose-500 transition-all">
              <Hotel className="w-5 h-5 text-rose-400 group-hover:text-white transition-colors" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-rose-500 uppercase font-mono mb-1">
              DISCOVER MORE
            </span>
            <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
              Explore All Stays & Hotels
            </h4>
            <p className="text-[11px] text-neutral-400 mb-4 font-normal leading-relaxed">
              Browse full catalog with instant booking & amenities
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500 group-hover:text-rose-400">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* 4. Host with Us */}
      <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase font-mono block">
              PROPERTY MANAGEMENT & LISTING
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
              Own a Rental Flat, Luxury Villa, or Boutique Hotel?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl">
              Partner with Design Nayan Stay to manage, redesign, and list your residential or hospitality property for high-yield bookings.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap"
          >
            <span>LIST YOUR PROPERTY</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. Rented House Detail Modal Card */}
      {selectedRental && (
        <div 
          onClick={() => setSelectedRental(null)}
          className="fixed inset-0 z-50 bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-3 pt-3 pb-24 sm:p-6 sm:pb-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[calc(100vh-140px)] sm:max-h-[88vh] flex flex-col shadow-2xl border border-neutral-200 text-neutral-900 relative my-auto overflow-hidden"
          >
            <div className="flex items-center p-3.5 sm:p-4 border-b border-neutral-100 bg-white">
              <button
                onClick={() => setSelectedRental(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-950 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-rose-600" />
                <span>Back to Stay & Discover</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden">
                <img
                  src={selectedRental.image}
                  alt={selectedRental.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-rose-600 text-[9px] sm:text-xs font-bold tracking-wider text-white uppercase font-mono shadow-sm">
                    {selectedRental.propertyType}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 sm:p-4 rounded-xl text-white">
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-rose-400 font-semibold mb-0.5">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{selectedRental.locality}</span>
                  </div>
                  <h2 className="text-base sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                    {selectedRental.title}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-neutral-50 p-2.5 sm:p-3.5 rounded-xl border border-neutral-200/80 text-center">
                <div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Size / Area</div>
                  <div className="text-[11px] sm:text-xs font-bold text-neutral-950 font-mono mt-0.5">{selectedRental.carpetAreaSqFt} sq.ft</div>
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Rooms</div>
                  <div className="text-[11px] sm:text-xs font-bold text-neutral-950 mt-0.5">{selectedRental.bedrooms} Bed • {selectedRental.bathrooms} Bath</div>
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Furnishing</div>
                  <div className="text-[11px] sm:text-xs font-bold text-neutral-950 mt-0.5 truncate">{selectedRental.furnishing}</div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  House Details
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed font-normal">
                  {selectedRental.description}
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Included Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {selectedRental.amenities.map((amenity, idx) => (
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
                href={`https://wa.me/918638053380?text=${encodeURIComponent(
                  `Hi Design Nayan Stay! I am interested in visiting *${selectedRental.title}* in ${selectedRental.locality} (Rent: ₹${selectedRental.monthlyRent.toLocaleString()}/mo). Please share available visiting slots.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>WhatsApp Us</span>
              </a>

              <Link
                href={`/contact?service=Property+Rental&property=${encodeURIComponent(selectedRental.title)}`}
                onClick={() => setSelectedRental(null)}
                className="flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl bg-neutral-950 hover:bg-rose-600 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center whitespace-nowrap"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 6. Hotel & Vacation Stay Detail Modal Card */}
      {selectedStay && (
        <div 
          onClick={() => setSelectedStay(null)}
          className="fixed inset-0 z-50 bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-3 pt-3 pb-24 sm:p-6 sm:pb-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[calc(100vh-140px)] sm:max-h-[88vh] flex flex-col shadow-2xl border border-neutral-200 text-neutral-900 relative my-auto overflow-hidden"
          >
            <div className="flex items-center p-3.5 sm:p-4 border-b border-neutral-100 bg-white">
              <button
                onClick={() => setSelectedStay(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-950 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-rose-600" />
                <span>Back to Stay & Discover</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden">
                <img
                  src={selectedStay.image}
                  alt={selectedStay.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-neutral-950/80 backdrop-blur-md text-[9px] sm:text-xs font-bold tracking-wider text-white uppercase font-mono shadow-sm">
                    {selectedStay.category}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 sm:p-4 rounded-xl text-white">
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-rose-400 font-semibold mb-0.5">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{selectedStay.location}</span>
                  </div>
                  <h2 className="text-base sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                    {selectedStay.title}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-neutral-50 p-2.5 sm:p-3.5 rounded-xl border border-neutral-200/80 text-center">
                <div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Starting Rate</div>
                  <div className="text-[11px] sm:text-xs font-bold text-neutral-950 font-mono mt-0.5">₹{selectedStay.pricePerNight.toLocaleString()}/night</div>
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Capacity</div>
                  <div className="text-[11px] sm:text-xs font-bold text-neutral-950 mt-0.5">{selectedStay.guests} Guests • {selectedStay.bedrooms} Beds</div>
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Rating</div>
                  <div className="text-[11px] sm:text-xs font-bold text-neutral-950 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-rose-600 text-rose-600" />
                    <span>{selectedStay.rating} ({selectedStay.reviewsCount})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Stay & Experience Details
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed font-normal">
                  {selectedStay.description}
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Included Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {selectedStay.amenities.map((amenity, idx) => (
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
                href={`https://wa.me/918638053380?text=${encodeURIComponent(
                  `Hi Design Nayan Stay! I am interested in booking *${selectedStay.title}* in ${selectedStay.city} (Starting ₹${selectedStay.pricePerNight.toLocaleString()}/night). Please share availability.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>WhatsApp Us</span>
              </a>

              <Link
                href={`/contact?service=Hotel+Stay&property=${encodeURIComponent(selectedStay.title)}`}
                onClick={() => setSelectedStay(null)}
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
