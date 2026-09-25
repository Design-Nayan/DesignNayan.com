import { Creator, CreatorCategory, DeliverableFormat, ReachTier } from "../creators.types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * MASTER CREATOR ROSTER
 *
 * This is the central database record for all vetted creators in the Design Nayan system.
 * Future Admin Panel Note:
 * Modifying, adding, or deleting an entry here automatically propagates across:
 * - Creator Discovery Section (Categorized rows & cards)
 * - Creators Dedicated Search Page (Filterable by category, format, reach, and budget)
 * - Top Creators Pyramid (Eligible for monthly spotlight)
 * - Smart Matchmaker (Matched according to category, tags, and formats)
 * - Creator Profile Modal (Full preview card with bio, case studies, packages, demographics)
 */
export const CREATORS_DATA: Creator[] = [
  {
    id: "kai-vance",
    name: "Kai Vance",
    handle: "@kaivance.raw",
    role: "Cinematic Fashion & Visual Storyteller",
    category: "High Fashion & Luxury",
    formats: ["4K Viral Reels & TikTok", "Commercial Production", "Editorial Photo Stills"],
    tier: "Macro (500K-1.5M)",
    location: "London • Milan",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    featuredImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
    verified: true,
    engagementRate: 6.4,
    followersCount: "890K",
    avgViews: "450K",
    startingRate: "$1,800",
    turnaroundDays: 3,
    bio: "Pioneering high-contrast luxury aesthetics and moody low-key lighting. Kai turns garments and accessories into cinematic film sequences that define luxury subcultures.",
    pastBrands: ["Balenciaga", "Gentle Monster", "Prada", "Diesel"],
    tags: ["High Fashion", "Cinematography", "Luxury", "Editorial"],
    demographics: {
      topLocations: [
        { name: "United States", percentage: 38 },
        { name: "United Kingdom", percentage: 26 },
        { name: "Germany", percentage: 14 },
      ],
      ageGroup: "78% 18–34",
      genderSplit: "52% M / 48% F",
    },
    caseStudies: [
      {
        brand: "Gentle Monster",
        campaign: "Solar Eclipse Eyewear Drop",
        metric: "2.8M Views • 6.4x Direct ROAS",
        thumbnail: `${basePath}/images/creators/portrait-1.jpg`,
      },
      {
        brand: "Diesel",
        campaign: "Red Label Denim Underground",
        metric: "1.9M Views • 84K Saves",
        thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      },
    ],
    packages: [
      {
        title: "Single 4K Cinematic Reel",
        deliverables: "1x 4K Master Reel (9:16), 2 Hook variations, 30-day organic rights",
        priceEstimate: "$1,800",
        turnaround: "3 Days",
      },
      {
        title: "Full Campaign Launch Pack",
        deliverables: "3x 4K Reels, 5 High-Res Stills, Raw B-Roll, Full Meta/TikTok Whitelisting",
        priceEstimate: "$4,500",
        turnaround: "7 Days",
      },
    ],
    featuredInHero: true,
  },
  {
    id: "maya-solis",
    name: "Maya Solis",
    handle: "@mayasolis.tech",
    role: "Minimalist Tech & Industrial Design Critic",
    category: "Tech & Gadgets",
    formats: ["4K Viral Reels & TikTok", "YouTube Long-Form", "Commercial Production"],
    tier: "Macro (500K-1.5M)",
    location: "Berlin • San Francisco",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    featuredImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    verified: true,
    engagementRate: 7.1,
    followersCount: "1.2M",
    avgViews: "680K",
    startingRate: "$2,400",
    turnaroundDays: 2,
    bio: "Obsessed with Scandinavian product minimalism, macro lens mechanics, and hardware ASMR. Maya crafts unboxings that feel like architectural documentaries.",
    pastBrands: ["Apple", "Nothing", "Bang & Olufsen", "Teenage Engineering"],
    tags: ["Minimalist Tech", "Macro ASMR", "Hardware", "Audio Design"],
    demographics: {
      topLocations: [
        { name: "United States", percentage: 44 },
        { name: "Germany", percentage: 22 },
        { name: "Canada", percentage: 12 },
      ],
      ageGroup: "82% 21–38",
      genderSplit: "65% M / 35% F",
    },
    caseStudies: [
      {
        brand: "Nothing Phone",
        campaign: "Glyph Interface Macro Unveil",
        metric: "4.1M Views • 92K Shares",
        thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      },
    ],
    packages: [
      {
        title: "Macro Hardware Feature Reel",
        deliverables: "1x 4K High-Retention Reel + 4 Macro Stills + Sound Design",
        priceEstimate: "$2,400",
        turnaround: "2 Days",
      },
      {
        title: "Product Ecosystem Showcase",
        deliverables: "2x 4K Short-Form Reels + 1 Dedicated YouTube Review Segment",
        priceEstimate: "$5,200",
        turnaround: "5 Days",
      },
    ],
    featuredInHero: true,
  },
  {
    id: "damon-cross",
    name: "Damon Cross",
    handle: "@damoncross",
    role: "CGI & Mixed-Reality Motion Director",
    category: "3D & CGI Motion",
    formats: ["3D / CGI Product VFX", "Commercial Production", "4K Viral Reels & TikTok"],
    tier: "Prime (100K-500K)",
    location: "Tokyo • New York",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    featuredImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85",
    verified: true,
    engagementRate: 8.9,
    followersCount: "380K",
    avgViews: "520K",
    startingRate: "$2,800",
    turnaroundDays: 4,
    bio: "Blending live-action footage with physics-defying 3D surrealism. Specializes in faux-out-of-home (FOOH) viral CGI stunts that dominate TikTok & Instagram algorithms.",
    pastBrands: ["Nike", "Porsche", "Red Bull", "Sony"],
    tags: ["CGI Stunts", "Mixed Reality", "VFX", "Surrealism"],
    demographics: {
      topLocations: [
        { name: "United States", percentage: 35 },
        { name: "Japan", percentage: 24 },
        { name: "UK", percentage: 18 },
      ],
      ageGroup: "80% 18–30",
      genderSplit: "60% M / 40% F",
    },
    caseStudies: [
      {
        brand: "Nike Air Max",
        campaign: "Floating Neon Tokyo Skyscraper",
        metric: "7.6M Views • 340K Shares",
        thumbnail: `${basePath}/images/creators/portrait-3.jpg`,
      },
    ],
    packages: [
      {
        title: "Viral 3D Mixed-Reality Stunt",
        deliverables: "1x Full CGI Live-Action Hybrid Reel, 3D Assets, Ad Whitelisting",
        priceEstimate: "$2,800",
        turnaround: "4 Days",
      },
      {
        title: "Full 3D Campaign Suite",
        deliverables: "2x 3D Video Ads + 4 Loopable Social Assets + 4K Render Files",
        priceEstimate: "$6,500",
        turnaround: "8 Days",
      },
    ],
    featuredInHero: true,
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    handle: "@elenarostova",
    role: "High-Fashion Editorial & Beauty Muse",
    category: "High Fashion & Luxury",
    formats: ["Editorial Photo Stills", "4K Viral Reels & TikTok", "Commercial Production"],
    tier: "Macro (500K-1.5M)",
    location: "Paris • New York",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    featuredImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80",
    verified: true,
    engagementRate: 5.7,
    followersCount: "940K",
    avgViews: "410K",
    startingRate: "$2,100",
    turnaroundDays: 2,
    bio: "Runway model turned high-end content creator. Known for moody shadow play, luxury skincare textures, and high-fashion editorial aesthetics that elevate DTC beauty brands.",
    pastBrands: ["YSL Beauty", "Byredo", "Jacquemus", "Dior"],
    tags: ["Luxury Beauty", "Editorial", "Skin Aesthetics", "High Fashion"],
    demographics: {
      topLocations: [
        { name: "France", percentage: 32 },
        { name: "United States", percentage: 30 },
        { name: "United Kingdom", percentage: 20 },
      ],
      ageGroup: "85% 18–35",
      genderSplit: "22% M / 78% F",
    },
    caseStudies: [
      {
        brand: "Byredo Parfums",
        campaign: "Velvet Amber Bottle Teaser",
        metric: "3.2M Views • 9.1x ROAS",
        thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
      },
    ],
    packages: [
      {
        title: "Aesthetic Beauty Showcase",
        deliverables: "1x 4K Reel + 5 High-Resolution Editorial Stills",
        priceEstimate: "$2,100",
        turnaround: "2 Days",
      },
    ],
  },
  {
    id: "zayn-malik-k",
    name: "Zayn K.",
    handle: "@zayn.cinematic",
    role: "Viral Commercial Director & UGC Master",
    category: "Viral UGC & Short-Form",
    formats: ["4K Viral Reels & TikTok", "Commercial Production"],
    tier: "Prime (100K-500K)",
    location: "Los Angeles • Austin",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    featuredImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80",
    verified: true,
    engagementRate: 9.2,
    followersCount: "420K",
    avgViews: "610K",
    startingRate: "$1,500",
    turnaroundDays: 2,
    bio: "Pioneering fast-paced visual storytelling, quick match-cuts, and psychological hook crafting. Specializes in turning complex SaaS and physical products into viral sensation reels.",
    pastBrands: ["WHOOP", "Oura", "Arc'teryx", "Gymshark"],
    tags: ["High Hook Rate", "Viral UGC", "Dynamic Editing", "Direct Response"],
    demographics: {
      topLocations: [
        { name: "United States", percentage: 55 },
        { name: "Canada", percentage: 18 },
        { name: "Australia", percentage: 12 },
      ],
      ageGroup: "88% 18–34",
      genderSplit: "58% M / 42% F",
    },
    caseStudies: [
      {
        brand: "WHOOP 4.0",
        campaign: "Sleep Strain Breakdown Hook",
        metric: "5.4M Views • 14.2K App Installs",
        thumbnail: `${basePath}/images/creators/bottom-3.jpg`,
      },
    ],
    packages: [
      {
        title: "High-Conversion UGC Reel Pack",
        deliverables: "2x 4K Short-Form Videos with 3 Different Hook Variants each",
        priceEstimate: "$1,500",
        turnaround: "2 Days",
      },
    ],
  },
  {
    id: "aravind-nair",
    name: "Aravind Nair",
    handle: "@aravind.arch",
    role: "Architectural & Brutalist Spatial Creator",
    category: "Architecture & Spaces",
    formats: ["Commercial Production", "Editorial Photo Stills", "YouTube Long-Form"],
    tier: "Rising (25K-100K)",
    location: "Mumbai • Dubai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    featuredImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
    verified: true,
    engagementRate: 8.4,
    followersCount: "86K",
    avgViews: "140K",
    startingRate: "$1,100",
    turnaroundDays: 3,
    bio: "Capturing the raw brutalism of concrete, monolithic facades, and luxury spatial interior designs. Tailored for interior studios, real estate, and architectural furniture brands.",
    pastBrands: ["Muuto", "Herman Miller", "Vibia", "Architectural Digest"],
    tags: ["Architecture", "Brutalism", "Interiors", "Cinematic Walkthrough"],
    demographics: {
      topLocations: [
        { name: "India", percentage: 42 },
        { name: "UAE", percentage: 28 },
        { name: "Singapore", percentage: 15 },
      ],
      ageGroup: "70% 25–45",
      genderSplit: "50% M / 50% F",
    },
    caseStudies: [
      {
        brand: "Herman Miller",
        campaign: "Eames Silhouette Modernist Film",
        metric: "890K Views • 14.5K Saves",
        thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      },
    ],
    packages: [
      {
        title: "Space Cinematic Tour",
        deliverables: "1x 4K Architectural Reel + 6 High-Res Interior Stills",
        priceEstimate: "$1,100",
        turnaround: "3 Days",
      },
    ],
  },
  {
    id: "sora-takahashi",
    name: "Sora Takahashi",
    handle: "@soravfx",
    role: "Hyper-Real 3D Product & CGI Specialist",
    category: "3D & CGI Motion",
    formats: ["3D / CGI Product VFX", "Commercial Production"],
    tier: "Macro (500K-1.5M)",
    location: "Tokyo • Seoul",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    featuredImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80",
    verified: true,
    engagementRate: 6.8,
    followersCount: "680K",
    avgViews: "490K",
    startingRate: "$2,600",
    turnaroundDays: 4,
    bio: "Master of fluid simulations, metallic reflections, and cybernetic product transformations. His clips regularly amass millions of organic impressions on TikTok & YouTube Shorts.",
    pastBrands: ["Samsung", "Razer", "Sony", "Logitech G"],
    tags: ["3D Animation", "Houdini", "Cyberpunk", "Audio Visual"],
    demographics: {
      topLocations: [
        { name: "United States", percentage: 36 },
        { name: "Japan", percentage: 30 },
        { name: "South Korea", percentage: 18 },
      ],
      ageGroup: "84% 18–32",
      genderSplit: "68% M / 32% F",
    },
    caseStudies: [
      {
        brand: "Razer Gaming",
        campaign: "Quantum Mouse Liquid Exploded View",
        metric: "6.2M Views • 240K Likes",
        thumbnail: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
      },
    ],
    packages: [
      {
        title: "Exploded View 3D Reel",
        deliverables: "1x 3D Render Reel (9:16 & 16:9), Custom Audio Design, 4K Prores",
        priceEstimate: "$2,600",
        turnaround: "4 Days",
      },
    ],
  },
  {
    id: "chloe-dubois",
    name: "Chloé Dubois",
    handle: "@chloedubois",
    role: "Quiet Luxury Lifestyle & Travel Aesthete",
    category: "Lifestyle & Travel",
    formats: ["4K Viral Reels & TikTok", "Editorial Photo Stills"],
    tier: "Macro (500K-1.5M)",
    location: "Geneva • Monaco",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    featuredImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80",
    verified: true,
    engagementRate: 6.1,
    followersCount: "820K",
    avgViews: "390K",
    startingRate: "$2,200",
    turnaroundDays: 3,
    bio: "Exquisite quiet-luxury lifestyle curation. Chloé captures high-end hospitality, fine fragrances, and luxury resort environments with warm cinematic 35mm film emulation.",
    pastBrands: ["Aman Resorts", "Rimowa", "Le Labo", "Cartier"],
    tags: ["Quiet Luxury", "Film Emulation", "Resorts", "Fragrance"],
    demographics: {
      topLocations: [
        { name: "Switzerland", percentage: 28 },
        { name: "United States", percentage: 32 },
        { name: "France", percentage: 24 },
      ],
      ageGroup: "75% 22–40",
      genderSplit: "35% M / 65% F",
    },
    caseStudies: [
      {
        brand: "Rimowa Luggage",
        campaign: "The European Midnight Express",
        metric: "2.4M Views • 45K Saves",
        thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      },
    ],
    packages: [
      {
        title: "Atmospheric Destination Reel",
        deliverables: "1x 4K 35mm-Emulated Reel + 5 Editorial Stills",
        priceEstimate: "$2,200",
        turnaround: "3 Days",
      },
    ],
  },
  {
    id: "marcus-thorne",
    name: "Marcus Thorne",
    handle: "@marcusthorne",
    role: "High-Performance Athlete & Tech Biometrics",
    category: "Fitness & Performance",
    formats: ["4K Viral Reels & TikTok", "Commercial Production"],
    tier: "Prime (100K-500K)",
    location: "Miami • London",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80",
    featuredImage: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=1000&q=80",
    verified: true,
    engagementRate: 8.1,
    followersCount: "480K",
    avgViews: "540K",
    startingRate: "$1,600",
    turnaroundDays: 2,
    bio: "Explosive movement, biometric tracking, and dark studio aesthetic. Marcus fuses extreme physical performance with high-energy audio and tech integration.",
    pastBrands: ["Gymshark", "Lululemon", "On Running", "Under Armour"],
    tags: ["Performance", "Athletic", "Dynamic Lighting", "Biometrics"],
    demographics: {
      topLocations: [
        { name: "United States", percentage: 50 },
        { name: "United Kingdom", percentage: 25 },
        { name: "Germany", percentage: 12 },
      ],
      ageGroup: "86% 18–34",
      genderSplit: "62% M / 38% F",
    },
    caseStudies: [
      {
        brand: "On Running",
        campaign: "Cloudmonster Night Sprint",
        metric: "3.9M Views • 11.4K Product Link Clicks",
        thumbnail: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80",
      },
    ],
    packages: [
      {
        title: "High-Octane Kinetic Reel",
        deliverables: "1x 4K Dynamic Motion Reel, Sound Design, 3 Hook Variations",
        priceEstimate: "$1,600",
        turnaround: "2 Days",
      },
    ],
  },
  {
    id: "talia-ren",
    name: "Talia Ren",
    handle: "@taliaren",
    role: "Cyberpunk Cyberwear & Streetwear Icon",
    category: "High Fashion & Luxury",
    formats: ["4K Viral Reels & TikTok", "Editorial Photo Stills"],
    tier: "Icon (1.5M+)",
    location: "Seoul • London",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
    featuredImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80",
    verified: true,
    engagementRate: 6.9,
    followersCount: "1.9M",
    avgViews: "1.1M",
    startingRate: "$3,500",
    turnaroundDays: 4,
    bio: "Pacesetter for futuristic street culture, tactile textures, and techwear. Talia commands massive global engagement across Asia, Europe, and North America.",
    pastBrands: ["Acronym", "NikeLab", "Off-White", "Oakley"],
    tags: ["Cyberwear", "Streetwear", "Futuristic", "High Engagement"],
    demographics: {
      topLocations: [
        { name: "South Korea", percentage: 34 },
        { name: "United States", percentage: 30 },
        { name: "Japan", percentage: 18 },
      ],
      ageGroup: "90% 16–30",
      genderSplit: "48% M / 52% F",
    },
    caseStudies: [
      {
        brand: "Oakley X Sub Zero",
        campaign: "Neon Cyberwear Runway Drop",
        metric: "8.4M Views • 620K Likes",
        thumbnail: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
      },
    ],
    packages: [
      {
        title: "Icon Hero Placement",
        deliverables: "1x 4K Hero Reel + 2 TikTok Teasers + Story Sequence + 60-Day Ad Rights",
        priceEstimate: "$3,500",
        turnaround: "4 Days",
      },
    ],
  },
  {
    id: "rohan-sen",
    name: "Rohan Sen",
    handle: "@rohansenvideo",
    role: "Direct-Response SaaS & App Storyteller",
    category: "Viral UGC & Short-Form",
    formats: ["4K Viral Reels & TikTok", "YouTube Long-Form"],
    tier: "Prime (100K-500K)",
    location: "Bengaluru • Singapore",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
    featuredImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=80",
    verified: true,
    engagementRate: 7.9,
    followersCount: "310K",
    avgViews: "380K",
    startingRate: "$1,300",
    turnaroundDays: 2,
    bio: "Engineers viral problem-to-solution short videos for fintech, AI tools, and consumer software. Holds top conversion records for venture-backed apps.",
    pastBrands: ["Notion", "Perplexity", "Ray-Ban Meta", "Figma"],
    tags: ["Direct Response", "SaaS Conversion", "Speed Hook", "App Demos"],
    demographics: {
      topLocations: [
        { name: "India", percentage: 40 },
        { name: "United States", percentage: 35 },
        { name: "Singapore", percentage: 15 },
      ],
      ageGroup: "82% 20–36",
      genderSplit: "64% M / 36% F",
    },
    caseStudies: [
      {
        brand: "Perplexity AI",
        campaign: "Zero-Click Search Comparison",
        metric: "4.8M Views • 28K App Installs",
        thumbnail: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
      },
    ],
    packages: [
      {
        title: "Growth UGC Pack",
        deliverables: "3x Variations of Product Problem/Solution Reels + Full Ad Permissions",
        priceEstimate: "$1,300",
        turnaround: "2 Days",
      },
    ],
  },
  {
    id: "eva-lindqvist",
    name: "Eva Lindqvist",
    handle: "@evalindqvist",
    role: "Minimalist Scandinavian Interior & Spatial Artist",
    category: "Architecture & Spaces",
    formats: ["Editorial Photo Stills", "Commercial Production"],
    tier: "Prime (100K-500K)",
    location: "Stockholm • Copenhagen",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    featuredImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
    verified: true,
    engagementRate: 6.7,
    followersCount: "440K",
    avgViews: "310K",
    startingRate: "$1,900",
    turnaroundDays: 3,
    bio: "Mastery of natural northern daylight, raw linen, oak textures, and spatial stillness. Collaborates with Scandinavian luxury homeware and lighting brands.",
    pastBrands: ["Fritz Hansen", "HAY", "Menu Space", "Bang & Olufsen"],
    tags: ["Nordic Design", "Interiors", "Stillness", "Natural Light"],
    demographics: {
      topLocations: [
        { name: "Sweden", percentage: 30 },
        { name: "United States", percentage: 30 },
        { name: "Germany", percentage: 20 },
      ],
      ageGroup: "78% 25–45",
      genderSplit: "38% M / 62% F",
    },
    caseStudies: [
      {
        brand: "Fritz Hansen",
        campaign: "Series 7 Chair Nordic Living",
        metric: "1.8M Views • 32K Saves",
        thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      },
    ],
    packages: [
      {
        title: "Spatial Interior Masterclass",
        deliverables: "1x 4K Architectural Walkthrough + 8 Gallery-Grade Stills",
        priceEstimate: "$1,900",
        turnaround: "3 Days",
      },
    ],
  },
];

/**
 * Senior Staff Helper Data Access Layer
 * These helpers make it trivial to swap static memory data with an API / Database / CMS in the future.
 */

export function getAllCreators(): Creator[] {
  return CREATORS_DATA;
}

export function getCreatorById(id: string): Creator | undefined {
  return CREATORS_DATA.find((c) => c.id === id);
}

export function getCreatorsByCategory(category: CreatorCategory): Creator[] {
  if (category === "All") return CREATORS_DATA;
  return CREATORS_DATA.filter((c) => c.category === category);
}

export function getHeroFeaturedCreators(): Creator[] {
  return CREATORS_DATA.filter((c) => c.featuredInHero);
}

export const AGENCY_CAPABILITIES = [
  {
    id: "branding-strategy",
    title: "Branding Strategy",
    subtitle: "High-Retention UGC & Viral Short-Form",
    tag: "SCALE FAST",
    description:
      "Engineered hooks, high retention pacing, and consumer psychology. We deploy creators who turn viewers into repeat buyers across TikTok, Reels, and YouTube Shorts.",
    image: `${basePath}/images/creators/bento-1.jpg`,
    stats: "3.4x Average ROAS",
    highlight: false,
  },
  {
    id: "visual-identity",
    title: "Visual Identity",
    subtitle: "Cinematic Commercials & Launch Films",
    tag: "FLAGSHIP HERO",
    description:
      "Arri & RED camera cinematography, bespoke color grading, and commercial storytelling. We give your hero launches the prestige of a global fashion house.",
    image: `${basePath}/images/creators/bento-2.jpg`,
    stats: "4K DCI • Sound Design",
    highlight: true,
  },
  {
    id: "creative-direction",
    title: "Creative Direction",
    subtitle: "Editorial Lookbooks & Luxury Stills",
    tag: "TIMELESS",
    description:
      "Billboard-ready photography, art-directed sets, and curated model casting. Crafted to establish high-fashion pedigree and brand equity.",
    image: `${basePath}/images/creators/bento-3.jpg`,
    stats: "High-Res Raw Stills",
    highlight: false,
  },
  {
    id: "art-direction",
    title: "Art Direction & 3D",
    subtitle: "CGI Stunts & Mixed Reality VFX",
    tag: "VIRAL SENSATION",
    description:
      "Physics-defying 3D product animations and simulated real-world spectacles that halt thumbs on social feeds and earn organic press coverage.",
    image: `${basePath}/images/creators/bento-4.jpg`,
    stats: "FOOH & 3D Simulations",
    highlight: false,
  },
];

export const AGENCY_METRICS = [
  { label: "Vetted Creator Selection Rate", value: "Top 1%" },
  { label: "Combined Roster Social Reach", value: "480M+" },
  { label: "Average Campaign ROAS Uplift", value: "88%" },
  { label: "Commercial IP & Rights Clearance", value: "100%" },
];
