"use client";

import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CREATORS_DATA } from "./data";
import { Creator } from "./creators.types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import { CreatorsHero } from "./components/CreatorsHero";
import { StatementEditorial } from "./components/StatementEditorial";
import { CapabilitiesBento } from "./components/CapabilitiesBento";
import { SmartMatchmaker } from "./components/SmartMatchmaker";
import { CreatorDiscovery } from "./components/CreatorDiscovery";
import { SecondStatement } from "./components/SecondStatement";
import { AgencyGuarantees } from "./components/AgencyGuarantees";
import { CreatorProfileModal } from "./components/CreatorProfileModal";
import Lenis from "lenis";
import { CampaignRosterBar } from "./components/CampaignRosterBar";
import { CampaignBookingModal } from "./components/CampaignBookingModal";

export function CreatorsView() {
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [quickViewCreator, setQuickViewCreator] = useState<Creator | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const lenisRef = React.useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis for butter-smooth, luxury flowy momentum scroll
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Integrate with GSAP ticker for 60-120fps synchronized frame updates
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    // Give DOM images and layouts a brief moment to settle, then refresh ScrollTrigger
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause Lenis scrolling when modals are open to prevent background scrolling
  useEffect(() => {
    if (isBookingOpen || quickViewCreator !== null) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [isBookingOpen, quickViewCreator]);

  // Selected creators objects
  const selectedCreators = CREATORS_DATA.filter((c) =>
    selectedCreatorIds.includes(c.id)
  );

  const handleToggleSelect = (creator: Creator) => {
    setSelectedCreatorIds((prev) =>
      prev.includes(creator.id)
        ? prev.filter((id) => id !== creator.id)
        : [...prev, creator.id]
    );
  };

  const handleAddRoster = (matched: Creator[]) => {
    const newIds = matched.map((c) => c.id);
    setSelectedCreatorIds((prev) => Array.from(new Set([...prev, ...newIds])));
  };

  const handleRemoveCreator = (creatorId: string) => {
    setSelectedCreatorIds((prev) => prev.filter((id) => id !== creatorId));
  };

  const handleClearAll = () => {
    setSelectedCreatorIds([]);
  };

  const scrollToDirectory = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo("#creator-directory", { duration: 1.2 });
    } else {
      const el = document.getElementById("creator-directory");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-neutral-900 selection:bg-red-600 selection:text-white">
      {/* 1. Hero Section (Moody Obsidian & Crimson Inspired by Reference) */}
      <CreatorsHero
        onExploreClick={scrollToDirectory}
        onBookClick={() => setIsBookingOpen(true)}
      />

      {/* 2. Editorial Statement + 3-Portrait Row (Inspired by Reference Section 2) */}
      <StatementEditorial
        creators={CREATORS_DATA}
        onSelectCreator={(creator) => setQuickViewCreator(creator)}
      />

      {/* 3. Capabilities Bento Showcase: Narrow Dark Strip */}
      <CapabilitiesBento
        onSelectCategory={() => scrollToDirectory()}
      />

      {/* 4. Complete Creator Discovery Facility (Search, Filters, Sort, Creator Cards) */}
      <CreatorDiscovery
        creators={CREATORS_DATA}
        selectedCreatorIds={selectedCreatorIds}
        onToggleSelect={handleToggleSelect}
        onQuickView={(creator) => setQuickViewCreator(creator)}
        onOpenCampaign={() => setIsBookingOpen(true)}
      />

      {/* 5. Interactive Client Matchmaker: In-page Section */}
      <SmartMatchmaker
        creators={CREATORS_DATA}
        selectedCreatorIds={selectedCreatorIds}
        onToggleSelect={handleToggleSelect}
        onSelectCreator={(creator) => setQuickViewCreator(creator)}
        onAddRoster={handleAddRoster}
      />

      {/* 6. Second Statement + Infinite Moving Video Carousel */}
      <SecondStatement
        creators={CREATORS_DATA}
        onSelectCreator={(creator) => setQuickViewCreator(creator)}
        onExploreRoster={scrollToDirectory}
        onBookRoster={() => setIsBookingOpen(true)}
      />

      {/* 7. Agency Guarantees & Escrow Confidence */}
      <AgencyGuarantees onOpenBooking={() => setIsBookingOpen(true)} />

      {/* 8. Floating Campaign Shortlist Dock (Appears when 1+ creators selected) */}
      <CampaignRosterBar
        selectedCreators={selectedCreators}
        onOpenBooking={() => setIsBookingOpen(true)}
        onClearAll={handleClearAll}
      />

      {/* 9. Creator Quick View & Showreel Modal */}
      <CreatorProfileModal
        creator={quickViewCreator}
        isSelected={
          quickViewCreator
            ? selectedCreatorIds.includes(quickViewCreator.id)
            : false
        }
        onClose={() => setQuickViewCreator(null)}
        onToggleSelect={handleToggleSelect}
        onBookDirect={(creator) => {
          if (!selectedCreatorIds.includes(creator.id)) {
            setSelectedCreatorIds((prev) => [...prev, creator.id]);
          }
          setIsBookingOpen(true);
        }}
      />

      {/* 10. Agency Campaign Booking Modal */}
      <CampaignBookingModal
        isOpen={isBookingOpen}
        selectedCreators={selectedCreators}
        onClose={() => setIsBookingOpen(false)}
        onRemoveCreator={handleRemoveCreator}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
