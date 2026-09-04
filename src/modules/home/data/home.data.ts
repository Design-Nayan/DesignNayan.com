export interface NavItem {
  title: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: "DESIGN & ARCHITECTURE" | "BUILD & CONSTRUCTION" | "BRANDING & CREATIVE" | "DIGITAL & MARKETING";
  iconName: string;
  link: string;
  destinationHub: "STUDIO" | "BUILD" | "CREATORS";
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  location: string;
  categoryTag: string;
  image: string;
  href: string;
  year: string;
  area: string;
  client: string;
  overview: string;
  highlights: string[];
  gallery: string[];
}

export interface ProcessStep {
  step: string;
  stepNumber?: string;
  title: string;
  description: string;
  iconName: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
  avatar: string;
}

export interface EcosystemCard {
  tag: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
  image: string;
}

export const heroStats = [
  { value: "250+", label: "PROJECTS DELIVERED", iconName: "Home" },
  { value: "98%", label: "SATISFACTION RATE", iconName: "ThumbsUp" },
  { value: "15+", label: "TRUSTED PARTNERS", iconName: "Handshake" },
  { value: "5+ Yrs", label: "INDUSTRY EXPERIENCE", iconName: "Award" },
];

export const clientAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
];

export const serviceCategories = [
  "ALL",
  "DESIGN & ARCHITECTURE",
  "BUILD & CONSTRUCTION",
  "BRANDING & CREATIVE",
  "DIGITAL & MARKETING",
];

export const allServices: ServiceItem[] = [
  // 1st Row (Graphic Design & Branding Suite -> Studio)
  {
    id: "graphic-design",
    title: "Graphic Designing",
    description: "Creative visuals that communicate better.",
    category: "BRANDING & CREATIVE",
    iconName: "Palette",
    link: "/studio",
    destinationHub: "STUDIO",
  },
  {
    id: "branding",
    title: "Branding",
    description: "Build a strong, unique brand identity.",
    category: "BRANDING & CREATIVE",
    iconName: "Sparkles",
    link: "/studio",
    destinationHub: "STUDIO",
  },
  {
    id: "website-design",
    title: "Website Design",
    description: "Responsive, modern and high-performing sites.",
    category: "DIGITAL & MARKETING",
    iconName: "Laptop",
    link: "/studio",
    destinationHub: "STUDIO",
  },
  {
    id: "social-media",
    title: "Social Media",
    description: "Manage, grow and engage your audience.",
    category: "DIGITAL & MARKETING",
    iconName: "Share2",
    link: "/studio",
    destinationHub: "STUDIO",
  },
  {
    id: "ads-management",
    title: "Ads Management",
    description: "Targeted ads that drive real results.",
    category: "DIGITAL & MARKETING",
    iconName: "Target",
    link: "/studio",
    destinationHub: "STUDIO",
  },

  // 2nd Row (3D Rendering & Architectural Design -> Studio)
  {
    id: "3d-rendering",
    title: "3D Rendering",
    description: "Photorealistic exterior & interior renders.",
    category: "DESIGN & ARCHITECTURE",
    iconName: "Box",
    link: "/studio",
    destinationHub: "STUDIO",
  },
  {
    id: "floor-plan",
    title: "Floor Planning",
    description: "Accurate, functional and detailed layouts.",
    category: "DESIGN & ARCHITECTURE",
    iconName: "Grid",
    link: "/studio",
    destinationHub: "STUDIO",
  },
  {
    id: "interior-design",
    title: "Interior Designing",
    description: "Beautiful, practical and people-centric spaces.",
    category: "DESIGN & ARCHITECTURE",
    iconName: "Sofa",
    link: "/studio",
    destinationHub: "STUDIO",
  },
  {
    id: "exterior-design",
    title: "Exterior Designing",
    description: "Modern, unique and captivating exteriors.",
    category: "DESIGN & ARCHITECTURE",
    iconName: "Building2",
    link: "/studio",
    destinationHub: "STUDIO",
  },
  {
    id: "architecture",
    title: "Architecture",
    description: "Concept-to-construction architectural solutions.",
    category: "DESIGN & ARCHITECTURE",
    iconName: "Compass",
    link: "/studio",
    destinationHub: "STUDIO",
  },

  // 3rd Row (Media & Construction)
  {
    id: "video-editing",
    title: "Video Editing",
    description: "Engaging edits that tell your story.",
    category: "BRANDING & CREATIVE",
    iconName: "Film",
    link: "/studio",
    destinationHub: "STUDIO",
  },
  {
    id: "content-creation",
    title: "Content Creation",
    description: "Verified creator shoots, reels, photos & video campaigns.",
    category: "BRANDING & CREATIVE",
    iconName: "Camera",
    link: "/creators",
    destinationHub: "CREATORS",
  },
  {
    id: "campaigns",
    title: "Campaigns",
    description: "Strategic brand campaigns that drive action.",
    category: "BRANDING & CREATIVE",
    iconName: "Megaphone",
    link: "/studio",
    destinationHub: "STUDIO",
  },
  {
    id: "construction",
    title: "Construction",
    description: "Nayan Constructions civil execution & RCC work.",
    category: "BUILD & CONSTRUCTION",
    iconName: "HardHat",
    link: "/build",
    destinationHub: "BUILD",
  },
  {
    id: "material-supply",
    title: "Materials",
    description: "Quality materials from trusted partners.",
    category: "BUILD & CONSTRUCTION",
    iconName: "Truck",
    link: "/build",
    destinationHub: "BUILD",
  },

  // 4th Row (Technical, Growth & Influencers)
  {
    id: "estimation",
    title: "Estimation",
    description: "Itemized BOQ, structural cost & budget analysis.",
    category: "BUILD & CONSTRUCTION",
    iconName: "Calculator",
    link: "/build",
    destinationHub: "BUILD",
  },
  {
    id: "project-management",
    title: "Project Management",
    description: "Site engineering, quality audits & milestone delivery.",
    category: "BUILD & CONSTRUCTION",
    iconName: "Briefcase",
    link: "/build",
    destinationHub: "BUILD",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "Data-driven SEO, growth & lead generation.",
    category: "DIGITAL & MARKETING",
    iconName: "TrendingUp",
    link: "/studio",
    destinationHub: "STUDIO",
  },
  {
    id: "influencers",
    title: "Influencers",
    description: "Strategic creator collaborations & PR campaigns.",
    category: "DIGITAL & MARKETING",
    iconName: "Users",
    link: "/creators",
    destinationHub: "CREATORS",
  },
  {
    id: "ui-ux-design",
    title: "UI / UX Design",
    description: "User-friendly interfaces that convert.",
    category: "DIGITAL & MARKETING",
    iconName: "Layout",
    link: "/studio",
    destinationHub: "STUDIO",
  },
];

export const ecosystemCards: EcosystemCard[] = [
  {
    tag: "STUDIO",
    title: "Design & Digital",
    description: "Architecture, design, branding, digital solutions & marketing.",
    linkText: "EXPLORE STUDIO",
    href: "/studio",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
  },
  {
    tag: "BUILD",
    title: "Build & Source",
    description: "Construction, materials, suppliers and project support.",
    linkText: "EXPLORE BUILD",
    href: "/build",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
  },
  {
    tag: "STAY",
    title: "Stay & Discover",
    description: "Hotels, homestays, rentals and property listings.",
    linkText: "EXPLORE STAY",
    href: "/stay",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
  },
];

export const recentProjects: ProjectItem[] = [
  {
    id: "p1",
    slug: "modern-residence",
    title: "Modern Residence",
    location: "Guwahati, Assam",
    categoryTag: "ARCHITECTURE",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
    href: "/portfolio/modern-residence",
    year: "2024",
    area: "3,850 sq.ft",
    client: "Dr. B. Sarma & Family",
    overview:
      "A contemporary multi-generational villa combining minimalist geometric lines with tropical Assamese climate adaptations. Features floor-to-ceiling glass fenestrations, double-height living spaces, and natural sandstone cantilevered balconies.",
    highlights: [
      "Custom double-height atrium with skylight cross-ventilation",
      "Earthquake-resistant RCC structural engineering",
      "Italian marble flooring & acoustic wooden ceiling louvers",
      "Nayan Constructions civil execution & landscape garden integration",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "p2",
    slug: "luxury-living-room",
    title: "Luxury Living Room",
    location: "Kolkata, West Bengal",
    categoryTag: "INTERIOR",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80",
    href: "/portfolio/luxury-living-room",
    year: "2024",
    area: "1,600 sq.ft",
    client: "Heritage Duplex Penthouse",
    overview:
      "A bespoke contemporary interior overhaul prioritizing warm ambient cove lighting, velvet accents, and brass metallic inlays. The design fosters an open-concept flow between the drawing lounge, entertainment zone, and private wine bar.",
    highlights: [
      "Architectural cove lighting with 3-scene smart automation",
      "Bespoke Italian fluted paneling and imported velvet upholstery",
      "Modular concealed entertainment center with acoustic backing",
      "Integrated bar counter with backlit onyx stone",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "p3",
    slug: "office-interior",
    title: "Office Interior",
    location: "Guwahati, Assam",
    categoryTag: "COMMERCIAL",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
    href: "/portfolio/office-interior",
    year: "2023",
    area: "4,500 sq.ft",
    client: "Tech Innovations HQ",
    overview:
      "An agile, collaborative corporate headquarters created for a high-growth technology consultancy. Includes ergonomic open workstations, glass executive boardrooms, soundproof private pods, and vibrant recreational breakout zones.",
    highlights: [
      "Acoustic baffled ceiling baffles for noise dampening",
      "Modular 60-seat hot-desking layout with cable spine management",
      "Executive boardrooms with motorized presentation automation",
      "Custom indoor biophilic planter partitions",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "p4",
    slug: "cafe-branding",
    title: "Cafe Branding",
    location: "Brand Identity Design",
    categoryTag: "BRANDING",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80",
    href: "/portfolio/cafe-branding",
    year: "2024",
    area: "Full Brand Suite",
    client: "Roast & Brew Artisan Coffee",
    overview:
      "Complete visual identity system for an artisanal specialty cafe. Deliverables included logo system, custom typography guidelines, menu board typography, eco-friendly kraft packaging, uniform merchandise, and social media brand templates.",
    highlights: [
      "Custom hand-drawn coffee botanical monogram logo",
      "Zero-waste compostable packaging design system",
      "Storefront exterior brass signage & vinyl window graphics",
      "Comprehensive 32-page brand guideline handbook",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "p5",
    slug: "exterior-rendering",
    title: "Exterior Rendering",
    location: "3D Exterior Visualization",
    categoryTag: "RENDERING",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
    href: "/portfolio/exterior-rendering",
    year: "2024",
    area: "8,200 sq.ft Resort",
    client: "Serene Valley Eco Resorts",
    overview:
      "Ultra-photorealistic 3D architectural CGI visualization and cinematic lighting simulation for a proposed hillside boutique resort. Captured in dusk, dawn, and golden hour lighting conditions with micro-detailed vegetation physics.",
    highlights: [
      "Sub-millimeter accurate BIM model translation",
      "Physically based material texturing (PBR 4K textures)",
      "Atmospheric volumetric fog and seasonal lighting simulations",
      "4K ultra-high-definition architectural marketing renders",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
    ],
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    stepNumber: "01",
    title: "Share Your Requirements",
    description: "Tell us what you need, your ideas and goals.",
    iconName: "FileText",
  },
  {
    step: "02",
    stepNumber: "02",
    title: "We Plan & Suggest",
    description: "We analyse and create the perfect plan.",
    iconName: "BrainCircuit",
  },
  {
    step: "03",
    stepNumber: "03",
    title: "You Choose Your Plan",
    description: "Select the services and budget that suits you.",
    iconName: "CheckSquare",
  },
  {
    step: "04",
    stepNumber: "04",
    title: "We Execute & Deliver",
    description: "Our team works and delivers quality.",
    iconName: "Hammer",
  },
  {
    step: "05",
    stepNumber: "05",
    title: "You Grow, We Support",
    description: "We remain with you for growth and support.",
    iconName: "TrendingUp",
  },
];

export const testimonials: TestimonialItem[] = [
  {
    id: "t1",
    quote: "Design Nayan transformed our ideas into a beautiful reality. Professional team and amazing support!",
    name: "Ritumoni Saikia",
    role: "Homeowner",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "t2",
    quote: "Their branding and social media strategy helped our business grow 3x. Highly recommended!",
    name: "Anirban Dey",
    role: "Business Owner",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "t3",
    quote: "From design-to-construction materials, everything was so seamless. One-stop solution!",
    name: "Pallavi Sharma",
    role: "Entrepreneur",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  },
];

export const partnerBrands = [
  { name: "Asian Paints", logoText: "asianpaints", style: "font-sans font-extrabold text-neutral-800 text-lg tracking-tight" },
  { name: "Duraguard Cement", logoText: "DURAGUARD CEMENT", style: "font-mono font-black text-neutral-800 text-sm tracking-wider border-2 border-neutral-800 px-2 py-0.5" },
  { name: "Greenply", logoText: "Greenply", style: "font-serif italic font-bold text-neutral-800 text-xl" },
  { name: "Häfele", logoText: "HÄFELE", style: "font-sans font-black text-neutral-800 text-lg tracking-widest" },
  { name: "JSW Steel", logoText: "JSW Steel", style: "font-sans font-black text-neutral-800 text-lg italic" },
  { name: "CERA", logoText: "CERA", style: "font-sans font-bold text-neutral-800 text-lg tracking-[0.2em] border border-neutral-700 px-2 py-0.5" },
  { name: "UltraTech Cement", logoText: "UltraTech CEMENT", style: "font-sans font-black text-neutral-800 text-xs uppercase" },
];
