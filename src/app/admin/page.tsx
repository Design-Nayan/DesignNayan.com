"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Users,
  Home as HomeIcon,
  Mail,
  Phone,
  MessageSquare,
  Plus,
  Trash2,
  Pencil,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  UploadCloud,
  ImageIcon,
  Shield,
  Lock,
  LogOut,
  ChevronRight,
  Download,
  Layers,
  Settings,
  MapPin,
  Wallet,
  History,
  Clock,
  TrendingUp,
  AlertTriangle,
  Check,
  Filter,
  Palette,
  HardHat,
  Sparkles,
  Box,
  Truck,
  Package,
  Play,
  Video,
  Film,
  Camera,
  Hotel,
  BedDouble,
  Bath,
  Star,
  Info,
  PhoneCall,
  Sun,
  Moon,
  Key,
  ShieldCheck,
  QrCode,
  Copy,
  RefreshCw,
  Bell,
  Volume2,
  VolumeX,
  Smartphone,
  Sliders,
} from "lucide-react";

import { projectsData as initialProjects } from "@/modules/projects/data/projects.data";
import { ProjectItem } from "@/modules/projects/types/projects.types";
import { CREATORS_DATA as initialCreators } from "@/modules/creators/data/creators.data";
import { 
  Creator, 
  CreatorCategory, 
  DeliverableFormat, 
  ReachTier, 
  CreatorDemographics, 
  CreatorCaseStudy, 
  CreatorRatePackage 
} from "@/modules/creators/creators.types";
import {
  rentalPropertiesNearYou as initialRentals,
  vacationHomesAndHotels as initialHotels,
} from "@/modules/stay/data/stay.data";
import { RentalProperty, StayProperty } from "@/modules/stay/types/stay.types";
import { studioServicesData as initialStudioServices } from "@/modules/studio/data/studio.data";
import { StudioServiceDetail } from "@/modules/studio/types/studio.types";
import {
  buildServicesData as initialBuildServices,
  materialCategoriesData as initialMaterials,
} from "@/modules/build/data/build.data";
import { BuildServiceDetail, MaterialCategory } from "@/modules/build/types/build.types";
import { initialAboutData } from "@/modules/about/data/about.data";
import { AboutPageData } from "@/modules/about/types/about.types";
import { initialContactData } from "@/modules/contact/data/contact.data";
import { ContactDetailsData } from "@/modules/contact/types/contact.types";
import { siteConfig } from "@/config/site";
import {
  initialIncomeRecords,
  initialAuditLogs,
  dynamicMatch,
  buildTransactionSearchString,
} from "./finances-shared";

// Initial Inquiries Data
const initialInquiries = [
  {
    id: "inq_1",
    name: "Pranab Gogoi",
    phone: "+91 94350 12345",
    email: "pranab.gogoi@assamtea.com",
    service: "Architecture & Design",
    budget: "₹5L - ₹10L",
    message: "4-bedroom contemporary villa in Beltola, Guwahati. Need 3D elevation and layout.",
    location: "Guwahati, Assam",
    status: "NEW" as const,
    date: "Today, 11:30 AM",
  },
  {
    id: "inq_2",
    name: "Bikash Barman",
    phone: "+91 98640 67890",
    email: "bikash.barman@gmail.com",
    service: "Nayan Constructions",
    budget: "₹25 Lakhs+",
    message: "Turnkey RCC civil construction and certified material sourcing for commercial showroom.",
    location: "Silchar, Assam",
    status: "IN REVIEW" as const,
    date: "Yesterday",
  },
  {
    id: "inq_3",
    name: "Mitali Das",
    phone: "+91 97060 11223",
    email: "mitali.das@lifestyle.in",
    service: "Branding & Creative",
    budget: "₹1L - ₹5L",
    message: "Rebranding for boutique handloom label. Logo, packaging, and video production.",
    location: "Dibrugarh, Assam",
    status: "CONTACTED" as const,
    date: "2 days ago",
  },
  {
    id: "inq_4",
    name: "Rohit Agrawal",
    phone: "+91 98300 45678",
    email: "rohit.agrawal@ventures.com",
    service: "Property Rental",
    budget: "₹35,000 / mo",
    message: "Long-term rental lease of luxury 3BHK flat on GS Road for corporate guest house.",
    location: "Guwahati, Assam",
    status: "CLOSED" as const,
    date: "3 days ago",
  },
];

// Income Data Types with Pending Payment tracking
export interface IncomeRecord {
  id: string;
  amount: number; // Received Amount (Actual collected income)
  totalAmount: number; // Total Project Deal / Contract Value
  pendingAmount: number; // Pending / Balance Due
  paymentStatus: "PAID" | "PARTIAL" | "PENDING";
  dueDate?: string; // Due date for pending balance
  category: string;
  clientName: string;
  clientPhone?: string;
  projectDetails: string;
  date: string; // YYYY-MM-DD
  paymentMethod: string;
  createdAt: string;
}

export interface IncomeAuditLog {
  id: string;
  action: "ADDED" | "EDITED" | "DELETED";
  description: string;
  timestamp: string;
  isoDate?: string;
}

export const INCOME_CATEGORIES = [
  "Web & Digital Development",
  "Design & Architecture",
  "Build & Construction",
  "Branding & Creative",
  "Creator Campaigns",
  "Stay & Property",
  "Other Services",
];

type TabType = "overview" | "portfolio" | "income" | "studio" | "build" | "creators" | "stays" | "about" | "contact" | "inquiries" | "settings";
type TimeFilterType = "this_month" | "3_months" | "6_months" | "this_year" | "all_time";
export const STUDIO_CATEGORY_CONFIGS = {
  "DESIGN & ARCHITECTURE": {
    defaultPrice: "From ₹45 / sq.ft",
    placeholder: "e.g. From ₹45 / sq.ft or From ₹3,500 / view",
    formatHint: "sq.ft / view / facade",
    pricePresets: [
      "From ₹45 / sq.ft",
      "From ₹20 / sq.ft",
      "From ₹1,200 / sq.ft",
      "From ₹3,500 / view",
      "From ₹15,000 / facade",
      "Custom Scope",
    ],
    defaultIcon: "Box",
    icons: [
      { name: "Box", label: "Box (3D Renders / BIM)" },
      { name: "Grid", label: "Grid (Floor Planning & 2D Layouts)" },
      { name: "Sofa", label: "Sofa (Interior Designing)" },
      { name: "Building2", label: "Building2 (Architecture & Elevations)" },
      { name: "Compass", label: "Compass (Master Planning & Vastu)" },
      { name: "Layout", label: "Layout (Zoning & Space Planning)" },
    ],
  },
  "BRANDING & CREATIVE": {
    defaultPrice: "From ₹12,000 / identity",
    placeholder: "e.g. From ₹12,000 / identity or From ₹3,000 / reel",
    formatHint: "identity / creative / reel / shoot",
    pricePresets: [
      "From ₹12,000 / identity",
      "From ₹2,500 / creative",
      "From ₹3,000 / reel",
      "From ₹15,000 / shoot",
      "Custom Scope",
    ],
    defaultIcon: "Sparkles",
    icons: [
      { name: "Sparkles", label: "Sparkles (Branding & Identity System)" },
      { name: "Palette", label: "Palette (Graphic Design & Print)" },
      { name: "Film", label: "Film (Video Editing & Reels)" },
      { name: "Camera", label: "Camera (Content Creation & Shoots)" },
      { name: "Megaphone", label: "Megaphone (Campaigns & Launches)" },
      { name: "Users", label: "Users (Audience & Community Content)" },
    ],
  },
  "DIGITAL & MARKETING": {
    defaultPrice: "From ₹25,000 / site",
    placeholder: "e.g. From ₹25,000 / site or From ₹15,000 / mo",
    formatHint: "site / monthly retainer / campaign",
    pricePresets: [
      "From ₹25,000 / site",
      "From ₹15,000 / mo",
      "From ₹35,000 / campaign",
      "Monthly Retainer",
      "Custom Scope",
    ],
    defaultIcon: "Laptop",
    icons: [
      { name: "Laptop", label: "Laptop (Websites & Web Apps)" },
      { name: "Share2", label: "Share2 (Social Media Management)" },
      { name: "Target", label: "Target (Performance Marketing & Ads)" },
      { name: "TrendingUp", label: "TrendingUp (SEO & Traffic Growth)" },
      { name: "Users", label: "Users (Lead Funnels & Community)" },
      { name: "Megaphone", label: "Megaphone (Digital Announcements)" },
    ],
  },
} as const;

export const BUILD_ICON_OPTIONS = [
  { name: "HardHat", label: "HardHat (Civil Construction & Site Execution)" },
  { name: "Truck", label: "Truck (Raw Materials & Logistics)" },
  { name: "Calculator", label: "Calculator (BOQ & Cost Estimation)" },
  { name: "Briefcase", label: "Briefcase (Turnkey EPC Contracting)" },
  { name: "ShieldCheck", label: "ShieldCheck (Structural Safety & QC Audit)" },
  { name: "Layers", label: "Layers (RCC Framing & Multi-Tier Works)" },
  { name: "Compass", label: "Compass (Structural Survey & Site Layouts)" },
] as const;

export const CREATOR_CATEGORIES: CreatorCategory[] = [
  "High Fashion & Luxury",
  "Tech & Gadgets",
  "Viral UGC & Short-Form",
  "3D & CGI Motion",
  "Architecture & Spaces",
  "Lifestyle & Travel",
  "Fitness & Performance",
];

export const CREATOR_REACH_TIERS: ReachTier[] = [
  "Rising (25K-100K)",
  "Prime (100K-500K)",
  "Macro (500K-1.5M)",
  "Icon (1.5M+)",
];

export const CREATOR_DELIVERABLES: DeliverableFormat[] = [
  "4K Viral Reels & TikTok",
  "YouTube Long-Form",
  "Commercial Production",
  "Editorial Photo Stills",
  "3D / CGI Product VFX",
];

export const isVideoMedia = (url?: string): boolean => {
  if (!url) return false;
  return url.startsWith("data:video/") || /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(url);
};

type PaymentStatusFilter = "ALL" | "PAID" | "PENDING_ONLY";

export type UnifiedStayItem =
  | { kind: "rental"; item: RentalProperty }
  | { kind: "hotel"; item: StayProperty };

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showLoginPasscode, setShowLoginPasscode] = useState(false);
  const [authError, setAuthError] = useState("");

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stays Tab Sub-Filter & Management States
  const [stayFilter, setStayFilter] = useState<"ALL" | "RENTALS" | "HOTELS">("ALL");
  const [staySearchQuery, setStaySearchQuery] = useState("");
  const [stayModalOpen, setStayModalOpen] = useState(false);
  const [stayModalType, setStayModalType] = useState<"rental" | "hotel">("rental");
  const [editingStayProperty, setEditingStayProperty] = useState<UnifiedStayItem | null>(null);
  const [viewingStayProperty, setViewingStayProperty] = useState<UnifiedStayItem | null>(null);
  const [stayPhoto, setStayPhoto] = useState<string>("");
  const [stayFurnishing, setStayFurnishing] = useState<string>("Fully Furnished");
  const [stayCategory, setStayCategory] = useState<string>("Vacation Home");

  // Core Data States
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [creators, setCreators] = useState<Creator[]>(initialCreators);
  const [creatorModalOpen, setCreatorModalOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [viewingCreator, setViewingCreator] = useState<Creator | null>(null);
  const [creatorSearchQuery, setCreatorSearchQuery] = useState("");
  const [creatorCategoryFilter, setCreatorCategoryFilter] = useState("ALL");
  const [creatorAvatar, setCreatorAvatar] = useState<string>("");
  const [creatorMediaType, setCreatorMediaType] = useState<"image" | "video">("image");
  const [creatorShowcaseMedia, setCreatorShowcaseMedia] = useState<string>("");
  const [rentals, setRentals] = useState<RentalProperty[]>(initialRentals);
  const [hotels, setHotels] = useState<StayProperty[]>(initialHotels);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [settings, setSettings] = useState<{
    name: string;
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
  }>({
    name: siteConfig.name,
    phone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: siteConfig.contact.address,
    whatsapp: siteConfig.contact.whatsapp,
  });

  // Settings & Security States
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [adminEmail, setAdminEmail] = useState<string>("admin@designnayan.com");
  const [adminPasscode, setAdminPasscode] = useState<string>("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string>("");
  const [twoFactorQrCode, setTwoFactorQrCode] = useState<string>("");
  const [twoFactorVerifyInput, setTwoFactorVerifyInput] = useState<string>("");
  const [isSettingUp2FA, setIsSettingUp2FA] = useState<boolean>(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([
    "8921-4301",
    "6712-9934",
    "4105-8821",
    "9012-3345",
    "7718-4920",
    "5512-8803",
  ]);

  // Login 2FA Flow
  const [twoFactorLoginStep, setTwoFactorLoginStep] = useState(false);
  const [loginOtpCode, setLoginOtpCode] = useState("");
  const [useBackupCodeLogin, setUseBackupCodeLogin] = useState(false);

  // Settings Credentials Forms
  const [emailInput, setEmailInput] = useState("admin@designnayan.com");
  const [currentPasscodeInput, setCurrentPasscodeInput] = useState("");
  const [newPasscodeInput, setNewPasscodeInput] = useState("");
  const [confirmPasscodeInput, setConfirmPasscodeInput] = useState("");
  const [showCurrentPasscode, setShowCurrentPasscode] = useState(false);
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [passcodeError, setPasscodeError] = useState("");
  const [passcodeSuccess, setPasscodeSuccess] = useState("");

  // System & Notification Preferences
  const [sessionTimeout, setSessionTimeout] = useState<string>("2h");
  const [soundAlertEnabled, setSoundAlertEnabled] = useState<boolean>(true);
  const [pushNotificationEnabled, setPushNotificationEnabled] = useState<boolean>(false);

  // Restore & Reset States
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoreJsonFile, setRestoreJsonFile] = useState<File | null>(null);
  const [restorePreviewCount, setRestorePreviewCount] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  // About Page State
  const [aboutData, setAboutData] = useState<AboutPageData>(initialAboutData);

  // Contact Details State
  const [contactData, setContactData] = useState<ContactDetailsData>(initialContactData);

  // Studio & Design Services States
  const [studioServices, setStudioServices] = useState<StudioServiceDetail[]>(initialStudioServices);
  const [studioModalOpen, setStudioModalOpen] = useState(false);
  const [editingStudioService, setEditingStudioService] = useState<StudioServiceDetail | null>(null);
  const [viewingStudioService, setViewingStudioService] = useState<StudioServiceDetail | null>(null);
  const [studioSearchQuery, setStudioSearchQuery] = useState("");
  const [studioCategoryFilter, setStudioCategoryFilter] = useState("ALL");
  const [studioModalCategory, setStudioModalCategory] = useState<"DESIGN & ARCHITECTURE" | "BRANDING & CREATIVE" | "DIGITAL & MARKETING">("DESIGN & ARCHITECTURE");
  const [studioPriceGuide, setStudioPriceGuide] = useState<string>("");
  const [studioIconName, setStudioIconName] = useState<string>("Box");

  // Synchronize Studio modal fields when opening or editing
  useEffect(() => {
    if (studioModalOpen) {
      if (editingStudioService) {
        setStudioModalCategory(editingStudioService.category);
        setStudioPriceGuide(editingStudioService.priceGuide || "");
        setStudioIconName(editingStudioService.iconName || "Box");
      } else {
        const cat = "DESIGN & ARCHITECTURE";
        setStudioModalCategory(cat);
        setStudioPriceGuide(STUDIO_CATEGORY_CONFIGS[cat].defaultPrice);
        setStudioIconName(STUDIO_CATEGORY_CONFIGS[cat].defaultIcon);
      }
    }
  }, [studioModalOpen, editingStudioService]);

  // Build & Civil Services States
  const [buildServices, setBuildServices] = useState<BuildServiceDetail[]>(initialBuildServices);
  const [buildModalOpen, setBuildModalOpen] = useState(false);
  const [editingBuildService, setEditingBuildService] = useState<BuildServiceDetail | null>(null);
  const [viewingBuildService, setViewingBuildService] = useState<BuildServiceDetail | null>(null);
  const [buildSearchQuery, setBuildSearchQuery] = useState("");
  const [buildIconName, setBuildIconName] = useState<string>("HardHat");

  // Synchronize Build modal fields when opening or editing
  useEffect(() => {
    if (buildModalOpen) {
      if (editingBuildService) {
        setBuildIconName(editingBuildService.iconName || "HardHat");
      } else {
        setBuildIconName("HardHat");
      }
    }
  }, [buildModalOpen, editingBuildService]);

  // Synchronize Creator modal fields when opening or editing
  useEffect(() => {
    if (creatorModalOpen) {
      if (editingCreator) {
        setCreatorAvatar(editingCreator.avatar || "");
        if (editingCreator.videoPreviewUrl) {
          setCreatorMediaType("video");
          setCreatorShowcaseMedia(editingCreator.videoPreviewUrl);
        } else {
          setCreatorMediaType(isVideoMedia(editingCreator.featuredImage) ? "video" : "image");
          setCreatorShowcaseMedia(editingCreator.featuredImage || "");
        }
      } else {
        setCreatorAvatar("");
        setCreatorMediaType("image");
        setCreatorShowcaseMedia("");
      }
    }
  }, [creatorModalOpen, editingCreator]);

  // Synchronize Stay modal fields when opening or editing
  useEffect(() => {
    if (stayModalOpen) {
      if (editingStayProperty) {
        setStayModalType(editingStayProperty.kind);
        setStayPhoto(editingStayProperty.item.image || "");
        if (editingStayProperty.kind === "rental") {
          setStayFurnishing(editingStayProperty.item.furnishing || "Fully Furnished");
        } else {
          setStayCategory(editingStayProperty.item.category || "Vacation Home");
        }
      } else {
        setStayPhoto("");
        setStayFurnishing("Fully Furnished");
        setStayCategory("Vacation Home");
      }
    }
  }, [stayModalOpen, editingStayProperty]);

  // Wholesale Materials States
  const [materials, setMaterials] = useState<MaterialCategory[]>(initialMaterials);
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialCategory | null>(null);
  const [viewingMaterial, setViewingMaterial] = useState<MaterialCategory | null>(null);

  // Income Management States
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>(initialIncomeRecords);
  const [incomeAuditLogs, setIncomeAuditLogs] = useState<IncomeAuditLog[]>(initialAuditLogs);
  const [incomeTimeFilter, setIncomeTimeFilter] = useState<TimeFilterType>("this_month");
  const [incomeCategoryFilter, setIncomeCategoryFilter] = useState<string>("ALL");
  const [incomePaymentFilter, setIncomePaymentFilter] = useState<PaymentStatusFilter>("ALL");
  const [incomeSearchQuery, setIncomeSearchQuery] = useState("");

  // Modals & Mini Popups
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeRecord | null>(null);
  const [viewingIncomeDetail, setViewingIncomeDetail] = useState<IncomeRecord | null>(null);

  // Portfolio Modal States
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [viewingProjectDetail, setViewingProjectDetail] = useState<ProjectItem | null>(null);
  const [projectCoverPhoto, setProjectCoverPhoto] = useState<string>("");
  const [projectGalleryPhotos, setProjectGalleryPhotos] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("ALL");

  // Sync photo states whenever modal opens or active project changes
  useEffect(() => {
    if (projectModalOpen) {
      setProjectCoverPhoto(editingProject?.image || "");
      setProjectGalleryPhotos(editingProject?.gallery || (editingProject?.image ? [editingProject.image] : []));
    } else {
      setProjectCoverPhoto("");
      setProjectGalleryPhotos([]);
    }
  }, [projectModalOpen, editingProject]);

  // Check stored auth session & persistent data
  useEffect(() => {
    const session = localStorage.getItem("dn_admin_auth");
    if (session === "true") {
      setIsAuthenticated(true);
    }

    const savedIncome = localStorage.getItem("dn_admin_income");
    if (savedIncome) {
      try {
        const parsed = JSON.parse(savedIncome);
        if (Array.isArray(parsed)) {
          // Filter out legacy dummy records so finance stays clean
          const cleanRecords = parsed.filter(
            (r: any) =>
              r &&
              typeof r.id === "string" &&
              !r.id.startsWith("inc_") &&
              r.clientName !== "Barpeta Commercial Complex" &&
              r.clientName !== "Dr. B. Sarma"
          );
          setIncomeRecords(cleanRecords);
          localStorage.setItem("dn_admin_income", JSON.stringify(cleanRecords));
        } else {
          setIncomeRecords([]);
          localStorage.setItem("dn_admin_income", JSON.stringify([]));
        }
      } catch {
        setIncomeRecords([]);
        localStorage.setItem("dn_admin_income", JSON.stringify([]));
      }
    } else {
      setIncomeRecords([]);
      localStorage.setItem("dn_admin_income", JSON.stringify([]));
    }

    const savedLogs = localStorage.getItem("dn_admin_income_logs");
    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        if (Array.isArray(parsedLogs)) {
          // Filter out legacy dummy logs so history stays clean
          const cleanLogs = parsedLogs.filter(
            (l: any) =>
              l &&
              typeof l.id === "string" &&
              !l.id.startsWith("log_") &&
              !l.description?.includes("Barpeta Commercial Complex")
          );
          setIncomeAuditLogs(cleanLogs);
          localStorage.setItem("dn_admin_income_logs", JSON.stringify(cleanLogs));
        } else {
          setIncomeAuditLogs([]);
          localStorage.setItem("dn_admin_income_logs", JSON.stringify([]));
        }
      } catch {
        setIncomeAuditLogs([]);
        localStorage.setItem("dn_admin_income_logs", JSON.stringify([]));
      }
    } else {
      setIncomeAuditLogs([]);
      localStorage.setItem("dn_admin_income_logs", JSON.stringify([]));
    }

    const savedStudio = localStorage.getItem("dn_studio_services");
    if (savedStudio) {
      try {
        const parsed = JSON.parse(savedStudio);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudioServices(parsed);
        }
      } catch {}
    }

    const savedBuild = localStorage.getItem("dn_build_services");
    if (savedBuild) {
      try {
        const parsed = JSON.parse(savedBuild);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBuildServices(parsed);
        }
      } catch {}
    }

    const savedMaterials = localStorage.getItem("dn_build_materials");
    if (savedMaterials) {
      try {
        const parsed = JSON.parse(savedMaterials);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMaterials(parsed);
        }
      } catch {}
    }
    const savedProjects = localStorage.getItem("dn_projects");
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
        }
      } catch {}
    }

    const savedCreators = localStorage.getItem("dn_creators");
    if (savedCreators) {
      try {
        const parsed = JSON.parse(savedCreators);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCreators(parsed);
        }
      } catch {}
    }

    const savedRentals = localStorage.getItem("dn_stay_rentals");
    if (savedRentals) {
      try {
        const parsed = JSON.parse(savedRentals);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRentals(parsed);
        }
      } catch {}
    }

    const savedHotels = localStorage.getItem("dn_stay_hotels");
    if (savedHotels) {
      try {
        const parsed = JSON.parse(savedHotels);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHotels(parsed);
        }
      } catch {}
    }

    const savedAbout = localStorage.getItem("dn_about_data");
    if (savedAbout) {
      try {
        const parsed = JSON.parse(savedAbout);
        if (parsed && typeof parsed === "object") {
          setAboutData(parsed);
        }
      } catch {}
    }

    const savedContact = localStorage.getItem("dn_contact_details");
    if (savedContact) {
      try {
        const parsed = JSON.parse(savedContact);
        if (parsed && typeof parsed === "object") {
          setContactData(parsed);
        }
      } catch {}
    }

    // Load Settings & Security Configurations
    const savedTheme = localStorage.getItem("dn_admin_theme") as "light" | "dark" | null;
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeMode(savedTheme);
      if (typeof document !== "undefined") {
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }

    const savedEmail = localStorage.getItem("dn_admin_email");
    if (savedEmail) {
      setAdminEmail(savedEmail);
      setEmailInput(savedEmail);
    }

    const savedPasscode = localStorage.getItem("dn_admin_passcode");
    if (savedPasscode) {
      setAdminPasscode(savedPasscode);
    }

    const saved2FA = localStorage.getItem("dn_admin_2fa_enabled");
    if (saved2FA !== null) {
      setTwoFactorEnabled(saved2FA === "true");
    }

    const saved2FASecret = localStorage.getItem("dn_admin_2fa_secret");
    if (saved2FASecret) {
      setTwoFactorSecret(saved2FASecret);
    }

    const savedCodes = localStorage.getItem("dn_admin_backup_codes");
    if (savedCodes) {
      try {
        const parsed = JSON.parse(savedCodes);
        if (Array.isArray(parsed) && parsed.length > 0) setBackupCodes(parsed);
      } catch {}
    }

    const savedTimeout = localStorage.getItem("dn_admin_session_timeout");
    if (savedTimeout) {
      setSessionTimeout(savedTimeout);
    }

    const savedSound = localStorage.getItem("dn_admin_sound_alert");
    if (savedSound !== null) {
      setSoundAlertEnabled(savedSound === "true");
    }

    const savedPush = localStorage.getItem("dn_admin_push_alerts");
    if (savedPush !== null) {
      setPushNotificationEnabled(savedPush === "true");
    }

    // Live Database Sync: Inquiries from PostgreSQL
    fetch("/api/inquiries/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.inquiries) && data.inquiries.length > 0) {
          const dbInquiries = data.inquiries.map((dbInq: any) => ({
            id: dbInq.id,
            name: dbInq.name,
            phone: dbInq.phone || "Not provided",
            email: dbInq.email,
            service: dbInq.service || "General Inquiry",
            budget: dbInq.budget || "Not specified",
            message: dbInq.message || "",
            location: dbInq.location || "India",
            status: dbInq.status || "NEW",
            date: new Date(dbInq.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setInquiries(dbInquiries);
        }
      })
      .catch((err) => console.error("Error loading inquiries from DB:", err));

    // Live Database Sync: Finance Records and Immutable Audit Logs from PostgreSQL
    fetch("/api/finances/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          if (Array.isArray(data.records)) {
            setIncomeRecords(data.records);
            try {
              localStorage.setItem("dn_admin_income", JSON.stringify(data.records));
            } catch {}
          }
          if (Array.isArray(data.logs)) {
            setIncomeAuditLogs(data.logs);
            try {
              localStorage.setItem("dn_admin_income_logs", JSON.stringify(data.logs));
            } catch {}
          }
        }
      })
      .catch((err) => console.error("Error loading finances from DB:", err));

    // Live Database Sync: About Data from PostgreSQL
    fetch("/api/about/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data) {
          setAboutData(data.data);
          try {
            localStorage.setItem("dn_about_data", JSON.stringify(data.data));
          } catch {}
        }
      })
      .catch((err) => console.error("Error loading about data from DB:", err));
  }, []);

  // Native Web Audio API Luxury Chime (Zero audio files or external CDNs needed)
  const playInquiryChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Tone 1 (E5 - 659.25Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Tone 2 (B5 - 987.77Hz - Harmonic lift)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.22, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.6);
    } catch {}
  };

  // Web Notification API Handler for Desktop Push Alerts
  const handleTogglePushNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      showToast("Desktop push alerts are not supported in this browser");
      return;
    }

    if (!pushNotificationEnabled) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setPushNotificationEnabled(true);
          try {
            localStorage.setItem("dn_admin_push_alerts", "true");
          } catch {}
          new Notification("Design Nayan Admin", {
            body: "Desktop push alerts activated! You will receive instant notifications for new client inquiries.",
            icon: "/images/logo.png",
          });
          showToast("Desktop push alerts enabled");
        } else {
          showToast("Notification permission was denied in browser");
        }
      } catch {
        showToast("Error requesting notification permissions");
      }
    } else {
      setPushNotificationEnabled(false);
      try {
        localStorage.setItem("dn_admin_push_alerts", "false");
      } catch {}
      showToast("Desktop push alerts disabled");
    }
  };

    // Auto-Logout Inactivity Idle Timer
  useEffect(() => {
    if (!isAuthenticated || sessionTimeout === "never") return;

    let timeoutMinutes = 120; // default 2 hours
    if (sessionTimeout === "15m") timeoutMinutes = 15;
    else if (sessionTimeout === "30m") timeoutMinutes = 30;
    else if (sessionTimeout === "2h") timeoutMinutes = 120;
    else if (sessionTimeout === "12h") timeoutMinutes = 720;

    const timeoutMs = timeoutMinutes * 60 * 1000;
    let lastActivity = Date.now();

    const resetTimer = () => {
      lastActivity = Date.now();
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));

    const interval = setInterval(() => {
      if (Date.now() - lastActivity >= timeoutMs) {
        handleLogout();
        showToast("Session locked due to inactivity");
      }
    }, 10000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      clearInterval(interval);
    };
  }, [isAuthenticated, sessionTimeout]);

    // Save About page changes to LocalStorage
  const updateAboutDataWithStorage = (data: AboutPageData) => {
    setAboutData(data);
    try {
      localStorage.setItem("dn_about_data", JSON.stringify(data));
    } catch {}
    fetch("/api/about/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch((err) => console.error("Error saving about data to DB:", err));
  };

  // Save Contact details changes to LocalStorage
  const updateContactDataWithStorage = (data: ContactDetailsData) => {
    setContactData(data);
    try {
      localStorage.setItem("dn_contact_details", JSON.stringify(data));
    } catch {}
  };

  // Save Projects changes to LocalStorage
  const updateProjectsWithStorage = (newList: ProjectItem[]) => {
    setProjects(newList);
    try {
      localStorage.setItem("dn_projects", JSON.stringify(newList));
    } catch {}
  };

  // Save Stays & Rentals changes to LocalStorage
  const updateRentalsWithStorage = (newList: RentalProperty[]) => {
    setRentals(newList);
    try {
      localStorage.setItem("dn_stay_rentals", JSON.stringify(newList));
    } catch {}
  };

  const updateHotelsWithStorage = (newList: StayProperty[]) => {
    setHotels(newList);
    try {
      localStorage.setItem("dn_stay_hotels", JSON.stringify(newList));
    } catch {}
  };

  // Save Creators changes to LocalStorage
  const updateCreatorsWithStorage = (newList: Creator[]) => {
    setCreators(newList);
    try {
      localStorage.setItem("dn_creators", JSON.stringify(newList));
    } catch {}
  };

  // Save Income & Logs changes to LocalStorage
  const updateIncomeWithStorage = (records: IncomeRecord[], logs: IncomeAuditLog[]) => {
    setIncomeRecords(records);
    setIncomeAuditLogs(logs);
    localStorage.setItem("dn_admin_income", JSON.stringify(records));
    localStorage.setItem("dn_admin_income_logs", JSON.stringify(logs));
  };

  const updateStudioServicesWithStorage = (services: StudioServiceDetail[]) => {
    setStudioServices(services);
    localStorage.setItem("dn_studio_services", JSON.stringify(services));
  };

  const updateBuildServicesWithStorage = (services: BuildServiceDetail[]) => {
    setBuildServices(services);
    localStorage.setItem("dn_build_services", JSON.stringify(services));
  };

  const updateMaterialsWithStorage = (mats: MaterialCategory[]) => {
    setMaterials(mats);
    localStorage.setItem("dn_build_materials", JSON.stringify(mats));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: passcode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Incorrect credentials. Please verify and try again.");
        return;
      }
      setAuthError("");
      if (twoFactorEnabled) {
        setTwoFactorLoginStep(true);
      } else {
        setIsAuthenticated(true);
        localStorage.setItem("dn_admin_auth", "true");
        showToast("Signed in successfully");
      }
    } catch {
      setAuthError("Failed to authenticate. Please check server connection.");
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = loginOtpCode.trim();
    if (!cleanCode) {
      setAuthError("Please enter your 6-digit authenticator code or emergency backup code.");
      return;
    }

    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: cleanCode,
          secret: twoFactorSecret,
          backupCodes: backupCodes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("dn_admin_auth", "true");
        setTwoFactorLoginStep(false);
        setLoginOtpCode("");
        setAuthError("");
        showToast("Two-Factor Authentication verified. Welcome back!");
      } else {
        setAuthError(data.error || "Invalid verification code. Please check your authenticator app.");
      }
    } catch (err) {
      setAuthError("Verification service error. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setTwoFactorLoginStep(false);
    setPasscode("");
    setLoginOtpCode("");
    localStorage.removeItem("dn_admin_auth");
  };

  const handleToggleTheme = (mode: "light" | "dark") => {
    setThemeMode(mode);
    try {
      localStorage.setItem("dn_admin_theme", mode);
    } catch {}
    if (typeof document !== "undefined") {
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    showToast(`Switched to ${mode === "dark" ? "Midnight Dark" : "Clean Light"} mode`);
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      showToast("Please provide a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/auth/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_EMAIL",
          currentEmail: adminEmail,
          newEmail: emailInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminEmail(emailInput.trim());
        try {
          localStorage.setItem("dn_admin_email", emailInput.trim());
        } catch {}
        showToast("Admin email updated in database successfully!");
      } else {
        showToast(data.error || "Failed to update email");
      }
    } catch {
      showToast("Failed to update email. Please check server.");
    }
  };

  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError("");
    setPasscodeSuccess("");

    if (newPasscodeInput.length < 6) {
      setPasscodeError("New passcode must contain at least 6 characters.");
      return;
    }

    if (newPasscodeInput !== confirmPasscodeInput) {
      setPasscodeError("New passcodes do not match.");
      return;
    }

    try {
      const res = await fetch("/api/auth/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PASSWORD",
          currentEmail: adminEmail,
          currentPassword: currentPasscodeInput,
          newPassword: newPasscodeInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminPasscode(newPasscodeInput);
        try {
          localStorage.setItem("dn_admin_passcode", newPasscodeInput);
        } catch {}
        setCurrentPasscodeInput("");
        setNewPasscodeInput("");
        setConfirmPasscodeInput("");
        setPasscodeSuccess("Password updated and hashed in database successfully!");
        setTimeout(() => setPasscodeSuccess(""), 4000);
        showToast("Admin password updated successfully");
      } else {
        setPasscodeError(data.error || "Failed to update passcode");
      }
    } catch {
      setPasscodeError("Server communication failed. Please try again.");
    }
  };

  const handleToggle2FA = async (enable: boolean) => {
    if (!enable) {
      setTwoFactorEnabled(false);
      setIsSettingUp2FA(false);
      try {
        localStorage.setItem("dn_admin_2fa_enabled", "false");
      } catch {}
      showToast("Two-Factor Authentication has been disabled");
      return;
    }

    setIsSettingUp2FA(true);
    try {
      const res = await fetch("/api/auth/2fa/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setTwoFactorSecret(data.secret);
        setTwoFactorQrCode(data.qrCodeDataUrl);
        try {
          localStorage.setItem("dn_admin_2fa_secret", data.secret);
          localStorage.setItem("dn_admin_2fa_qr", data.qrCodeDataUrl);
        } catch {}
      } else {
        showToast("Could not generate 2FA QR code: " + (data.error || "Unknown error"));
      }
    } catch {
      showToast("Error communicating with 2FA service");
    }
  };

  const handleConfirm2FAActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorVerifyInput.trim()) {
      showToast("Please enter the 6-digit code from your authenticator app");
      return;
    }

    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: twoFactorVerifyInput.trim(),
          secret: twoFactorSecret,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTwoFactorEnabled(true);
        setIsSettingUp2FA(false);
        setTwoFactorVerifyInput("");
        try {
          localStorage.setItem("dn_admin_2fa_enabled", "true");
        } catch {}
        showToast("Two-Factor Authentication is now ACTIVE!");
      } else {
        showToast(data.error || "Invalid 6-digit code. Please try again.");
      }
    } catch {
      showToast("Error verifying code with server");
    }
  };

  const handleRegenerateBackupCodes = () => {
    const newCodes = Array.from({ length: 6 }, () => {
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      return `${p1}-${p2}`;
    });
    setBackupCodes(newCodes);
    try {
      localStorage.setItem("dn_admin_backup_codes", JSON.stringify(newCodes));
    } catch {}
    showToast("Emergency backup codes regenerated");
  };

  const handleDownloadBackupCodes = () => {
    const text = `DESIGN NAYAN - ADMIN 2FA EMERGENCY RECOVERY CODES\nGenerated: ${new Date().toLocaleString()}\nAdmin Account: ${adminEmail}\n\nKEEP THESE RECOVERY CODES SAFE AND OFFLINE:\n\n${backupCodes.map((c, idx) => `[${idx + 1}]  ${c}`).join("\n")}\n\nEach code can be used once as an emergency backup to sign in if you lose access to your authenticator app.\nGenerated by Design Nayan Enterprise Admin Engine.`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DesignNayan_2FA_Recovery_Codes_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Emergency recovery codes downloaded");
  };

  const handleFullBackupDownload = () => {
    const backup = {
      projects,
      creators,
      rentals,
      hotels,
      inquiries,
      incomeRecords,
      incomeAuditLogs,
      studioServices,
      buildServices,
      materials,
      aboutData,
      contactData,
      settings,
      systemPreferences: {
        themeMode,
        adminEmail,
        twoFactorEnabled,
        sessionTimeout,
        soundAlertEnabled,
        pushNotificationEnabled,
      },
      exportedAt: new Date().toISOString(),
      version: "2.5.0",
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DesignNayan_FullBackup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Full database backup downloaded (.json)");
  };

  const handleRestoreFileSelect = (file: File) => {
    setRestoreJsonFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        const count =
          (parsed.projects?.length || 0) +
          (parsed.creators?.length || 0) +
          (parsed.rentals?.length || 0) +
          (parsed.hotels?.length || 0) +
          (parsed.studioServices?.length || 0) +
          (parsed.buildServices?.length || 0);
        setRestorePreviewCount(count);
        setRestoreModalOpen(true);
      } catch {
        showToast("Invalid JSON backup file structure");
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = () => {
    if (!restoreJsonFile) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.projects) { setProjects(data.projects); localStorage.setItem("dn_projects", JSON.stringify(data.projects)); }
        if (data.creators) { setCreators(data.creators); localStorage.setItem("dn_creators", JSON.stringify(data.creators)); }
        if (data.rentals) { setRentals(data.rentals); localStorage.setItem("dn_stay_rentals", JSON.stringify(data.rentals)); }
        if (data.hotels) { setHotels(data.hotels); localStorage.setItem("dn_stay_hotels", JSON.stringify(data.hotels)); }
        if (data.incomeRecords) { setIncomeRecords(data.incomeRecords); localStorage.setItem("dn_admin_income", JSON.stringify(data.incomeRecords)); }
        if (data.incomeAuditLogs) { setIncomeAuditLogs(data.incomeAuditLogs); localStorage.setItem("dn_admin_income_logs", JSON.stringify(data.incomeAuditLogs)); }
        if (data.studioServices) { setStudioServices(data.studioServices); localStorage.setItem("dn_studio_services", JSON.stringify(data.studioServices)); }
        if (data.buildServices) { setBuildServices(data.buildServices); localStorage.setItem("dn_build_services", JSON.stringify(data.buildServices)); }
        if (data.aboutData) { setAboutData(data.aboutData); localStorage.setItem("dn_about_data", JSON.stringify(data.aboutData)); }
        if (data.contactData) { setContactData(data.contactData); localStorage.setItem("dn_contact_details", JSON.stringify(data.contactData)); }
        if (data.settings) { setSettings(data.settings); }
        setRestoreModalOpen(false);
        setRestoreJsonFile(null);
        showToast("Database restored successfully from backup file!");
      } catch {
        showToast("Error processing restore file");
      }
    };
    reader.readAsText(restoreJsonFile);
  };

  // Format Helper for Currency
  const formatINR = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Helper for Timestamp Formatter
  const getFormattedDateTime = () => {
    const d = new Date();
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Safe Date String Parsing to eliminate timezone offset discrepancies
  const parseDateYMD = (dStr: string) => {
    if (!dStr) return new Date();
    const parts = dStr.split("-");
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12, 0, 0);
    }
    return new Date(dStr);
  };

  // =========================================================================
  // DYNAMIC REVENUE & PENDING CALCULATIONS (Synchronized with filters)
  // =========================================================================
  const {
    filteredIncome,
    periodReceivedTotal,
    periodPendingTotal,
    periodContractTotal,
    categoryBreakdown,
    activeTimeframeLabel,
    thisMonthOverviewTotal,
    totalPendingOverview,
  } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Current Month Strict Boundaries
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    // Compute month received and total pending for the Overview tab
    let monthOverviewSum = 0;
    let pendingOverviewSum = 0;
    incomeRecords.forEach((item) => {
      const itemDate = parseDateYMD(item.date);
      if (itemDate >= startOfCurrentMonth && itemDate <= endOfCurrentMonth) {
        monthOverviewSum += item.amount;
      }
      pendingOverviewSum += (item.pendingAmount || 0);
    });

    // Determine the active date range from incomeTimeFilter
    let rangeStart = startOfCurrentMonth;
    let rangeEnd = endOfCurrentMonth;
    let timeLabel = "This Month";

    if (incomeTimeFilter === "3_months") {
      rangeStart = new Date(currentYear, currentMonth - 2, 1, 0, 0, 0);
      rangeEnd = endOfCurrentMonth;
      timeLabel = "Past 3 Months";
    } else if (incomeTimeFilter === "6_months") {
      rangeStart = new Date(currentYear, currentMonth - 5, 1, 0, 0, 0);
      rangeEnd = endOfCurrentMonth;
      timeLabel = "Past 6 Months";
    } else if (incomeTimeFilter === "this_year") {
      rangeStart = new Date(currentYear, 0, 1, 0, 0, 0);
      rangeEnd = new Date(currentYear, 11, 31, 23, 59, 59);
      timeLabel = "This Year";
    } else if (incomeTimeFilter === "all_time") {
      rangeStart = new Date(2000, 0, 1);
      rangeEnd = new Date(2099, 11, 31);
      timeLabel = "All Time";
    }

    // Records matching Time Range AND Category (Drives the 3 KPI Boxes)
    const recordsInScope = incomeRecords.filter((item) => {
      const itemDate = parseDateYMD(item.date);
      const inTime = itemDate >= rangeStart && itemDate <= rangeEnd;
      const inCat = incomeCategoryFilter === "ALL" || item.category === incomeCategoryFilter;
      return inTime && inCat;
    });

    const periodRecSum = recordsInScope.reduce((sum, item) => sum + item.amount, 0);
    const periodPendSum = recordsInScope.reduce((sum, item) => sum + (item.pendingAmount || 0), 0);
    const periodContractSum = recordsInScope.reduce((sum, item) => sum + (item.totalAmount || item.amount), 0);

    // Dynamic Search & Payment Status Filter (Drives the Transaction List Rows)
    const matchedRecords = recordsInScope.filter((item) => {
      let inPayment = true;
      if (incomePaymentFilter === "PAID") {
        inPayment = item.paymentStatus === "PAID" || (item.pendingAmount || 0) === 0;
      } else if (incomePaymentFilter === "PENDING_ONLY") {
        inPayment = (item.pendingAmount || 0) > 0 || item.paymentStatus === "PARTIAL" || item.paymentStatus === "PENDING";
      }

      // Dynamic search matching (fuzzy, partial keywords, currency aliases, typos)
      const targetContent = buildTransactionSearchString(item);
      const inSearch = dynamicMatch(incomeSearchQuery, targetContent);

      return inPayment && inSearch;
    });

    // Category breakdown within chosen timeframe
    const recordsInTimeframe = incomeRecords.filter((item) => {
      const itemDate = parseDateYMD(item.date);
      return itemDate >= rangeStart && itemDate <= rangeEnd;
    });

    const catMap: Record<string, number> = {};
    recordsInTimeframe.forEach((item) => {
      catMap[item.category] = (catMap[item.category] || 0) + item.amount;
    });

    const timeframeTotal = recordsInTimeframe.reduce((s, i) => s + i.amount, 0);
    const breakdown = Object.entries(catMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: timeframeTotal > 0 ? Math.round((amount / timeframeTotal) * 100) : 0,
    }));

    return {
      filteredIncome: matchedRecords,
      periodReceivedTotal: periodRecSum,
      periodPendingTotal: periodPendSum,
      periodContractTotal: periodContractSum,
      categoryBreakdown: breakdown.sort((a, b) => b.amount - a.amount),
      activeTimeframeLabel: timeLabel,
      thisMonthOverviewTotal: monthOverviewSum,
      totalPendingOverview: pendingOverviewSum,
    };
  }, [incomeRecords, incomeTimeFilter, incomeCategoryFilter, incomePaymentFilter, incomeSearchQuery]);

  // Handle Save / Add / Edit Income with Pending Calculation
  const handleSaveIncome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const receivedAmount = parseFloat(formData.get("amount") as string) || 0;
    const totalContractValue = parseFloat(formData.get("totalAmount") as string) || receivedAmount;
    const pendingAmount = Math.max(0, totalContractValue - receivedAmount);
    
    let paymentStatus: "PAID" | "PARTIAL" | "PENDING" = "PAID";
    if (pendingAmount === 0) {
      paymentStatus = "PAID";
    } else if (receivedAmount > 0) {
      paymentStatus = "PARTIAL";
    } else {
      paymentStatus = "PENDING";
    }

    const category = formData.get("category") as string;
    const clientName = formData.get("clientName") as string;
    const clientPhone = (formData.get("clientPhone") as string) || "";
    const projectDetails = (formData.get("projectDetails") as string) || "";
    const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0];
    const dueDate = (formData.get("dueDate") as string) || "";
    const paymentMethod = (formData.get("paymentMethod") as string) || "Bank Transfer";
    const timestamp = getFormattedDateTime();

    if (editingIncome) {
      // EDIT ACTION
      const updatedRecord: IncomeRecord = {
        ...editingIncome,
        amount: receivedAmount,
        totalAmount: totalContractValue,
        pendingAmount,
        paymentStatus,
        dueDate,
        category,
        clientName,
        clientPhone,
        projectDetails,
        date,
        paymentMethod,
      };

      const updatedList = incomeRecords.map((r) => (r.id === editingIncome.id ? updatedRecord : r));
      const newLog: IncomeAuditLog = {
        id: `log_${Date.now()}`,
        action: "EDITED",
        description: `Edited entry: ${category} for ${clientName} — Received ${formatINR(receivedAmount)} (Pending: ${formatINR(pendingAmount)})`,
        timestamp,
        isoDate: new Date().toISOString(),
      };

      updateIncomeWithStorage(updatedList, [newLog, ...incomeAuditLogs]);
      fetch("/api/finances/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record: updatedRecord, log: newLog }),
      }).catch((err) => console.error("Error saving finance record to DB:", err));
      showToast("Transaction updated");

      if (viewingIncomeDetail?.id === editingIncome.id) {
        setViewingIncomeDetail(updatedRecord);
      }
    } else {
      // ADD ACTION
      const newRecord: IncomeRecord = {
        id: `inc_${Date.now()}`,
        amount: receivedAmount,
        totalAmount: totalContractValue,
        pendingAmount,
        paymentStatus,
        dueDate,
        category,
        clientName,
        clientPhone,
        projectDetails,
        date,
        paymentMethod,
        createdAt: new Date().toISOString(),
      };

      const newLog: IncomeAuditLog = {
        id: `log_${Date.now()}`,
        action: "ADDED",
        description: `Added ${formatINR(receivedAmount)} for ${category} (Client: ${clientName})${
          pendingAmount > 0 ? ` with ${formatINR(pendingAmount)} pending` : " (Paid in full)"
        }`,
        timestamp,
        isoDate: new Date().toISOString(),
      };

      updateIncomeWithStorage([newRecord, ...incomeRecords], [newLog, ...incomeAuditLogs]);
      fetch("/api/finances/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record: newRecord, log: newLog }),
      }).catch((err) => console.error("Error creating finance record in DB:", err));
      showToast("New transaction recorded");
    }

    setIncomeModalOpen(false);
    setEditingIncome(null);
  };

  // Handle Delete Income
  const handleDeleteIncome = (record: IncomeRecord) => {
    if (confirm(`Delete transaction of ${formatINR(record.amount)} for ${record.clientName}?`)) {
      const timestamp = getFormattedDateTime();
      const updatedList = incomeRecords.filter((r) => r.id !== record.id);
      const newLog: IncomeAuditLog = {
        id: `log_${Date.now()}`,
        action: "DELETED",
        description: `Deleted entry: ${formatINR(record.amount)} for ${record.category} (Client: ${record.clientName})`,
        timestamp,
        isoDate: new Date().toISOString(),
      };

      updateIncomeWithStorage(updatedList, [newLog, ...incomeAuditLogs]);
      fetch("/api/finances/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: record.id, log: newLog }),
      }).catch((err) => console.error("Error deleting finance record in DB:", err));
      showToast("Transaction deleted");
      if (viewingIncomeDetail?.id === record.id) {
        setViewingIncomeDetail(null);
      }
    }
  };

  // Inquiry Status Handler
  const handleUpdateInquiryStatus = (id: string, newStatus: "NEW" | "IN REVIEW" | "CONTACTED" | "CLOSED") => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
    showToast(`Status updated to ${newStatus}`);
  };

  // Delete Inquiries
  const handleDeleteInquiry = (id: string) => {
    if (confirm("Delete this inquiry record?")) {
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      showToast("Inquiry deleted");
    }
  };

  // Delete Portfolio Project
  const handleDeleteProject = (id: string) => {
    if (confirm("Delete this portfolio project?")) {
      const updated = projects.filter((p) => p.id !== id);
      updateProjectsWithStorage(updated);
      showToast("Portfolio project deleted");
      if (viewingProjectDetail?.id === id) {
        setViewingProjectDetail(null);
      }
    }
  };

  // Photo Upload Handlers for Portfolio Project
  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) {
        setProjectCoverPhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverPhotoDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) {
        setProjectCoverPhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        if (dataUrl) {
          setProjectGalleryPhotos((prev) => [...prev, dataUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGalleryPhotosDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        if (dataUrl) {
          setProjectGalleryPhotos((prev) => [...prev, dataUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryPhoto = (indexToRemove: number) => {
    setProjectGalleryPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Save or Create Portfolio Project
  const handleSaveProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const fallbackImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80";
    const coverImage = projectCoverPhoto || editingProject?.image || fallbackImage;
    const finalGallery = projectGalleryPhotos.length > 0 
      ? projectGalleryPhotos 
      : (editingProject?.gallery && editingProject.gallery.length > 0 ? editingProject.gallery : [coverImage]);

    const projectData: ProjectItem = {
      id: editingProject ? editingProject.id : `p_${Date.now()}`,
      slug: (formData.get("slug") as string) || (formData.get("title") as string).toLowerCase().replace(/\s+/g, "-"),
      title: formData.get("title") as string,
      location: formData.get("location") as string,
      categoryTag: (formData.get("categoryTag") as string).toUpperCase(),
      image: coverImage,
      href: `/portfolio/${(formData.get("slug") as string) || (formData.get("title") as string).toLowerCase().replace(/\s+/g, "-")}`,
      year: formData.get("year") as string,
      area: formData.get("area") as string,
      client: formData.get("client") as string,
      overview: (formData.get("overview") as string) || "",
      highlights: ((formData.get("highlights") as string) || "")
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean),
      gallery: finalGallery,
    };

    if (editingProject) {
      const updated = projects.map((p) => (p.id === editingProject.id ? projectData : p));
      updateProjectsWithStorage(updated);
      showToast("Portfolio project updated");
      if (viewingProjectDetail?.id === editingProject.id) {
        setViewingProjectDetail(projectData);
      }
    } else {
      const updated = [projectData, ...projects];
      updateProjectsWithStorage(updated);
      showToast("Portfolio project added");
    }

    setProjectModalOpen(false);
    setEditingProject(null);
    setProjectCoverPhoto("");
    setProjectGalleryPhotos([]);
  };

  // Filtered Portfolio Projects (Dynamic multi-attribute search)
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);

    return projects.filter((p) => {
      const tag = p.categoryTag.toUpperCase();
      const matchesCat = (() => {
        if (projectCategoryFilter === "ALL") return true;
        if (tag === projectCategoryFilter) return true;
        if (projectCategoryFilter === "DESIGN & ARCHITECTURE") {
          return tag.includes("ARCH") || tag.includes("INTERIOR") || tag.includes("FLOOR") || tag.includes("RENDER");
        }
        if (projectCategoryFilter === "BRANDING & CREATIVITY") {
          return tag.includes("BRAND") || tag.includes("CREATIV");
        }
        if (projectCategoryFilter === "DIGITAL & MARKETING") {
          return tag.includes("DIGITAL") || tag.includes("MARKET") || tag.includes("DEV");
        }
        if (projectCategoryFilter === "BUILD & CONSTRUCTIONS") {
          return tag.includes("BUILD") || tag.includes("CONST") || tag.includes("COMMERCIAL");
        }
        if (projectCategoryFilter === "CREATORS") {
          return tag.includes("CREATOR");
        }
        return false;
      })();
      if (!matchesCat) return false;

      if (words.length === 0) return true;

      const searchableText = `${p.title} ${p.location} ${p.categoryTag} ${p.client || ""} ${p.area || ""} ${p.year || ""} ${p.overview || ""} ${(p.highlights || []).join(" ")}`.toLowerCase();

      return words.every((word) => searchableText.includes(word));
    });
  }, [projects, searchQuery, projectCategoryFilter]);

  // Studio Services Handlers & Filter
  const handleDeleteStudioService = (id: string) => {
    if (confirm("Delete this studio service card?")) {
      const next = studioServices.filter((s) => s.id !== id);
      updateStudioServicesWithStorage(next);
      showToast("Studio service deleted");
    }
  };

  const handleSaveStudioService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const deliverablesRaw = (formData.get("deliverables") as string) || "";
    const deliverables = deliverablesRaw.split("\n").map((d) => d.trim()).filter(Boolean);

    const specLabels = formData.getAll("specLabel") as string[];
    const specValues = formData.getAll("specValue") as string[];
    const specs = specLabels
      .map((lbl, idx) => ({
        label: lbl.trim(),
        value: (specValues[idx] || "").trim(),
      }))
      .filter((s) => s.label && s.value);

    const serviceData: StudioServiceDetail = {
      id: editingStudioService ? editingStudioService.id : `studio_${Date.now()}`,
      title: formData.get("title") as string,
      category: formData.get("category") as "DESIGN & ARCHITECTURE" | "BRANDING & CREATIVE" | "DIGITAL & MARKETING",
      badge: (formData.get("badge") as string) || "STUDIO SPECIAL",
      description: formData.get("description") as string,
      iconName: (formData.get("iconName") as string) || editingStudioService?.iconName || "Box",
      turnaround: formData.get("turnaround") as string,
      priceGuide: formData.get("priceGuide") as string,
      popular: formData.get("popular") === "on",
      deliverables:
        deliverables.length > 0
          ? deliverables
          : editingStudioService?.deliverables || ["Standard deliverable set"],
      specs:
        specs.length > 0
          ? specs
          : editingStudioService?.specs || [
              { label: "Turnaround", value: (formData.get("turnaround") as string) || "3 - 5 Days" },
            ],
    };

    if (editingStudioService) {
      const next = studioServices.map((s) => (s.id === editingStudioService.id ? serviceData : s));
      updateStudioServicesWithStorage(next);
      showToast("Studio service updated");
    } else {
      const next = [serviceData, ...studioServices];
      updateStudioServicesWithStorage(next);
      showToast("Studio service added");
    }

    setStudioModalOpen(false);
    setEditingStudioService(null);
  };

  const filteredStudioServices = useMemo(() => {
    return studioServices.filter((s) => {
      const q = studioSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.badge.toLowerCase().includes(q) ||
        s.priceGuide.toLowerCase().includes(q) ||
        s.deliverables.some((d) => d.toLowerCase().includes(q));
      const matchesCat =
        studioCategoryFilter === "ALL" || s.category === studioCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [studioServices, studioSearchQuery, studioCategoryFilter]);

  // Build Services Handlers & Filter
  const handleDeleteBuildService = (id: string) => {
    if (confirm("Delete this build service card?")) {
      const next = buildServices.filter((s) => s.id !== id);
      updateBuildServicesWithStorage(next);
      showToast("Build service deleted");
    }
  };

  const handleSaveBuildService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const deliverablesRaw = (formData.get("deliverables") as string) || "";
    const deliverables = deliverablesRaw.split("\n").map((d) => d.trim()).filter(Boolean);

    const specLabels = formData.getAll("specLabel") as string[];
    const specValues = formData.getAll("specValue") as string[];
    const specs = specLabels
      .map((lbl, idx) => ({
        label: lbl.trim(),
        value: (specValues[idx] || "").trim(),
      }))
      .filter((s) => s.label && s.value);

    const serviceData: BuildServiceDetail = {
      id: editingBuildService ? editingBuildService.id : `build_${Date.now()}`,
      title: formData.get("title") as string,
      badge: (formData.get("badge") as string) || "CIVIL EXECUTION",
      description: formData.get("description") as string,
      iconName: (formData.get("iconName") as string) || editingBuildService?.iconName || "HardHat",
      turnaround: formData.get("turnaround") as string,
      priceGuide: formData.get("priceGuide") as string,
      popular: formData.get("popular") === "on",
      deliverables:
        deliverables.length > 0
          ? deliverables
          : editingBuildService?.deliverables || ["Certified structural execution"],
      specs:
        specs.length > 0
          ? specs
          : editingBuildService?.specs || [],
    };

    if (editingBuildService) {
      const next = buildServices.map((s) => (s.id === editingBuildService.id ? serviceData : s));
      updateBuildServicesWithStorage(next);
      showToast("Build service updated");
    } else {
      const next = [serviceData, ...buildServices];
      updateBuildServicesWithStorage(next);
      showToast("Build service added");
    }

    setBuildModalOpen(false);
    setEditingBuildService(null);
  };

  const filteredBuildServices = useMemo(() => {
    return buildServices.filter((s) => {
      const q = buildSearchQuery.toLowerCase().trim();
      return (
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.badge.toLowerCase().includes(q) ||
        s.priceGuide.toLowerCase().includes(q) ||
        s.deliverables.some((d) => d.toLowerCase().includes(q))
      );
    });
  }, [buildServices, buildSearchQuery]);

  // Wholesale Materials Handlers
  const handleDeleteMaterial = (categoryName: string) => {
    if (confirm(`Delete wholesale material category "${categoryName}"?`)) {
      const next = materials.filter((m) => m.category !== categoryName);
      updateMaterialsWithStorage(next);
      showToast("Wholesale category deleted");
      if (viewingMaterial?.category === categoryName) {
        setViewingMaterial(null);
      }
    }
  };

  const handleSaveMaterial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const brandsRaw = (formData.get("brands") as string) || "";
    const brands = brandsRaw
      .split(/[,\n]/)
      .map((b) => b.trim())
      .filter(Boolean);

    const categoryData: MaterialCategory = {
      category: (formData.get("category") as string).trim(),
      badge: (formData.get("badge") as string).trim() || "WHOLESALE SOURCING",
      desc: (formData.get("desc") as string).trim(),
      brands: brands.length > 0 ? brands : ["Authorized Mill Partner"],
    };

    if (editingMaterial) {
      const next = materials.map((m) =>
        m.category === editingMaterial.category ? categoryData : m
      );
      updateMaterialsWithStorage(next);
      showToast("Wholesale category updated");
    } else {
      const next = [categoryData, ...materials];
      updateMaterialsWithStorage(next);
      showToast("Wholesale category added");
    }

    setMaterialModalOpen(false);
    setEditingMaterial(null);
  };

  // Creators Handlers & Multi-Field Filter
  const handleDeleteCreator = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from creators roster?`)) return;
    const next = creators.filter((c) => c.id !== id);
    updateCreatorsWithStorage(next);
    showToast(`${name} removed from roster`);
    if (viewingCreator?.id === id) setViewingCreator(null);
  };

  const handleCreatorAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) setCreatorAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleCreatorMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("video/")) {
      setCreatorMediaType("video");
    } else if (file.type.startsWith("image/")) {
      setCreatorMediaType("image");
    }
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) setCreatorShowcaseMedia(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleCreatorMediaDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type.startsWith("video/")) {
      setCreatorMediaType("video");
    } else if (file.type.startsWith("image/")) {
      setCreatorMediaType("image");
    }
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) setCreatorShowcaseMedia(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCreator = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const fallbackAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
    const avatarInput = (formData.get("avatarUrl") as string)?.trim();
    const avatar = creatorAvatar || avatarInput || editingCreator?.avatar || fallbackAvatar;

    const showcaseInput = (formData.get("showcaseMediaUrl") as string)?.trim();
    const rawMedia = creatorShowcaseMedia || showcaseInput || editingCreator?.videoPreviewUrl || editingCreator?.featuredImage || avatar;
    const isVideo = creatorMediaType === "video" || isVideoMedia(rawMedia);

    const featuredImage = isVideo ? (editingCreator?.featuredImage || avatar) : rawMedia;
    const videoPreviewUrl = isVideo ? rawMedia : undefined;

    // Parse formats
    const formats = formData.getAll("formats") as DeliverableFormat[];
    const validFormats = formats.length > 0 ? formats : (editingCreator?.formats || ["4K Viral Reels & TikTok"]);

    // Parse past brands
    const pastBrandsRaw = (formData.get("pastBrands") as string) || "";
    const pastBrands = pastBrandsRaw
      .split(/[,|\n]/)
      .map((b) => b.trim())
      .filter(Boolean);

    // Parse tags
    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw
      .split(/[,|\n]/)
      .map((t) => t.trim())
      .filter(Boolean);

    // Parse packages
    const pkg1Title = ((formData.get("pkg1Title") as string) || "").trim();
    const pkg1Deliverables = ((formData.get("pkg1Deliverables") as string) || "").trim();
    const pkg1Price = ((formData.get("pkg1Price") as string) || "").trim();
    const pkg1Turnaround = ((formData.get("pkg1Turnaround") as string) || "").trim();

    const pkg2Title = ((formData.get("pkg2Title") as string) || "").trim();
    const pkg2Deliverables = ((formData.get("pkg2Deliverables") as string) || "").trim();
    const pkg2Price = ((formData.get("pkg2Price") as string) || "").trim();
    const pkg2Turnaround = ((formData.get("pkg2Turnaround") as string) || "").trim();

    const packages: CreatorRatePackage[] = [];
    if (pkg1Title || pkg1Price) {
      packages.push({
        title: pkg1Title || "Standard Dedicated 4K Reel",
        deliverables: pkg1Deliverables || "1x High-Retention 4K Reel + 2x Stories",
        priceEstimate: pkg1Price || (formData.get("startingRate") as string) || "₹15,000",
        turnaround: pkg1Turnaround || "3 Days",
      });
    }
    if (pkg2Title || pkg2Price) {
      packages.push({
        title: pkg2Title || "Full Campaign Suite",
        deliverables: pkg2Deliverables || "3x Reels + Whitelist Ad Rights (30d)",
        priceEstimate: pkg2Price || "₹40,000",
        turnaround: pkg2Turnaround || "7 Days",
      });
    }

    // Demographics
    const demographics: CreatorDemographics = {
      ageGroup: ((formData.get("ageGroup") as string) || "").trim() || editingCreator?.demographics?.ageGroup || "75% 18–34",
      genderSplit: ((formData.get("genderSplit") as string) || "").trim() || editingCreator?.demographics?.genderSplit || "50% M / 50% F",
      topLocations: editingCreator?.demographics?.topLocations || [
        { name: "India", percentage: 55 },
        { name: "United States", percentage: 25 },
        { name: "United Kingdom", percentage: 20 },
      ],
    };

    // Case Studies
    const csBrand = ((formData.get("csBrand") as string) || "").trim();
    const csCampaign = ((formData.get("csCampaign") as string) || "").trim();
    const csMetric = ((formData.get("csMetric") as string) || "").trim();
    const caseStudies: CreatorCaseStudy[] = editingCreator?.caseStudies ? [...editingCreator.caseStudies] : [];
    if (csBrand && csMetric) {
      caseStudies.unshift({
        brand: csBrand,
        campaign: csCampaign || "Featured Campaign",
        metric: csMetric,
        thumbnail: avatar,
      });
    }

    const creatorData: Creator = {
      id: editingCreator ? editingCreator.id : `creator_${Date.now()}`,
      name: (formData.get("name") as string).trim(),
      handle: ((formData.get("handle") as string) || "").trim().startsWith("@")
        ? ((formData.get("handle") as string) || "").trim()
        : `@${((formData.get("handle") as string) || "creator").trim()}`,
      role: ((formData.get("role") as string) || "Visual Creator").trim(),
      category: formData.get("category") as CreatorCategory,
      formats: validFormats,
      tier: (formData.get("tier") as ReachTier) || "Rising (25K-100K)",
      location: ((formData.get("location") as string) || "Guwahati, Assam").trim(),
      avatar,
      featuredImage,
      secondaryImage: editingCreator?.secondaryImage || avatar,
      videoPreviewUrl,
      verified: formData.get("verified") === "on",
      engagementRate: parseFloat((formData.get("engagementRate") as string) || "5.0") || 5.0,
      followersCount: ((formData.get("followersCount") as string) || "50K").trim(),
      avgViews: ((formData.get("avgViews") as string) || "25K").trim(),
      startingRate: ((formData.get("startingRate") as string) || "₹15,000").trim(),
      turnaroundDays: parseInt((formData.get("turnaroundDays") as string) || "3", 10) || 3,
      bio: ((formData.get("bio") as string) || "").trim(),
      pastBrands: pastBrands.length > 0 ? pastBrands : editingCreator?.pastBrands || ["Independent Creator"],
      tags: tags.length > 0 ? tags : editingCreator?.tags || ["Reels", "Visuals"],
      demographics,
      caseStudies: caseStudies.length > 0 ? caseStudies : (editingCreator?.caseStudies || [
        {
          brand: "Featured Launch",
          campaign: "Creator Spotlight Campaign",
          metric: "1.2M Views • High ROAS",
          thumbnail: avatar,
        },
      ]),
      packages: packages.length > 0 ? packages : editingCreator?.packages || [
        {
          title: "Standard Dedicated 4K Reel",
          deliverables: "1x High-Retention 4K Reel + 2x Stories",
          priceEstimate: (formData.get("startingRate") as string) || "₹15,000",
          turnaround: "3 Days",
        },
      ],
      featuredInHero: formData.get("featuredInHero") === "on",
    };

    if (editingCreator) {
      const next = creators.map((c) => (c.id === editingCreator.id ? creatorData : c));
      updateCreatorsWithStorage(next);
      showToast("Creator profile updated");
    } else {
      const next = [creatorData, ...creators];
      updateCreatorsWithStorage(next);
      showToast("Creator added to roster");
    }

    setCreatorModalOpen(false);
    setEditingCreator(null);
    setCreatorAvatar("");
    setCreatorShowcaseMedia("");
  };

  const filteredCreators = useMemo(() => {
    const q = creatorSearchQuery.trim().toLowerCase();
    return creators.filter((c) => {
      const matchCat = creatorCategoryFilter === "ALL" || c.category === creatorCategoryFilter;
      const matchQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [creators, creatorSearchQuery, creatorCategoryFilter]);

  // Photo Upload Handlers for Stays & Rentals
  const handleStayPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setStayPhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStayPhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setStayPhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Unified Stay Items Memo
  const unifiedStayProperties: UnifiedStayItem[] = useMemo(() => {
    const list: UnifiedStayItem[] = [
      ...rentals.map((r) => ({ kind: "rental" as const, item: r })),
      ...hotels.map((h) => ({ kind: "hotel" as const, item: h })),
    ];

    const q = staySearchQuery.trim().toLowerCase();
    return list.filter((entry) => {
      if (stayFilter === "RENTALS" && entry.kind !== "rental") return false;
      if (stayFilter === "HOTELS" && entry.kind !== "hotel") return false;

      if (!q) return true;

      if (entry.kind === "rental") {
        const r = entry.item;
        return (
          r.title.toLowerCase().includes(q) ||
          r.locality.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.propertyType.toLowerCase().includes(q) ||
          r.furnishing.toLowerCase().includes(q) ||
          r.amenities.some((a) => a.toLowerCase().includes(q))
        );
      } else {
        const h = entry.item;
        return (
          h.title.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.category.toLowerCase().includes(q) ||
          h.tag.toLowerCase().includes(q) ||
          h.amenities.some((a) => a.toLowerCase().includes(q))
        );
      }
    });
  }, [rentals, hotels, stayFilter, staySearchQuery]);

  // Save / Update Stay Property Handler
  const handleSaveStayProperty = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = ((formData.get("title") as string) || "").trim();
    if (!title) {
      showToast("Please enter a property title");
      return;
    }

    const city = ((formData.get("city") as string) || "Guwahati").trim();
    const bedrooms = parseInt((formData.get("bedrooms") as string) || "2", 10) || 2;
    const bathrooms = parseInt((formData.get("bathrooms") as string) || "2", 10) || 2;
    const description = ((formData.get("description") as string) || "").trim();
    const amenitiesRaw = (formData.get("amenities") as string) || "";
    const amenities = amenitiesRaw
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const imageUrl = (formData.get("imageUrl") as string)?.trim();
    const image =
      stayPhoto ||
      imageUrl ||
      (editingStayProperty ? editingStayProperty.item.image : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80");

    if (stayModalType === "rental") {
      const locality = ((formData.get("locality") as string) || `${city}, Assam`).trim();
      const propertyType = ((formData.get("propertyType") as string) || `${bedrooms} BHK Apartment`).trim();
      const monthlyRent = parseInt((formData.get("monthlyRent") as string) || "20000", 10) || 20000;
      const securityDeposit = parseInt((formData.get("securityDeposit") as string) || `${monthlyRent * 2}`, 10) || monthlyRent * 2;
      const carpetAreaSqFt = parseInt((formData.get("carpetAreaSqFt") as string) || "1200", 10) || 1200;
      const furnishing = (formData.get("furnishing") as string) || stayFurnishing || "Fully Furnished";

      const rentalData: RentalProperty = {
        id:
          editingStayProperty && editingStayProperty.kind === "rental"
            ? editingStayProperty.item.id
            : `rent-${Date.now()}`,
        slug:
          editingStayProperty && editingStayProperty.kind === "rental"
            ? editingStayProperty.item.slug
            : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `rental-${Date.now()}`,
        title,
        locality,
        city,
        propertyType,
        monthlyRent,
        securityDeposit,
        carpetAreaSqFt,
        bedrooms,
        bathrooms,
        furnishing,
        image,
        amenities: amenities.length > 0 ? amenities : ["Covered Car Parking", "24/7 Power Backup", "Gated Security", "24-Hour Water"],
        description: description || `Premium ${propertyType} with modern fixtures and high accessibility in ${locality}.`,
      };

      if (editingStayProperty) {
        if (editingStayProperty.kind === "rental") {
          const next = rentals.map((r) => (r.id === editingStayProperty.item.id ? rentalData : r));
          updateRentalsWithStorage(next);
        } else {
          // Converted from hotel to rental
          const nextHotels = hotels.filter((h) => h.id !== editingStayProperty.item.id);
          updateHotelsWithStorage(nextHotels);
          const nextRentals = [rentalData, ...rentals];
          updateRentalsWithStorage(nextRentals);
        }
        showToast("Rental property updated");
      } else {
        const next = [rentalData, ...rentals];
        updateRentalsWithStorage(next);
        showToast("Rental property added");
      }
    } else {
      const location = ((formData.get("location") as string) || `${city}, Assam`).trim();
      const category = (formData.get("category") as string) || stayCategory || "Vacation Home";
      const tag = ((formData.get("tag") as string) || "FEATURED STAY").trim();
      const pricePerNight = parseInt((formData.get("pricePerNight") as string) || "5000", 10) || 5000;
      const rating = parseFloat((formData.get("rating") as string) || "4.9") || 4.9;
      const reviewsCount = parseInt((formData.get("reviewsCount") as string) || "24", 10) || 24;
      const guests = parseInt((formData.get("guests") as string) || "4", 10) || 4;

      const hotelData: StayProperty = {
        id:
          editingStayProperty && editingStayProperty.kind === "hotel"
            ? editingStayProperty.item.id
            : `stay-${Date.now()}`,
        slug:
          editingStayProperty && editingStayProperty.kind === "hotel"
            ? editingStayProperty.item.slug
            : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `stay-${Date.now()}`,
        title,
        location,
        city,
        category,
        pricePerNight,
        rating,
        reviewsCount,
        image,
        tag,
        guests,
        bedrooms,
        bathrooms,
        amenities: amenities.length > 0 ? amenities : ["Panoramic Hill Views", "High-speed WiFi", "Artisan Coffee Bar", "Assamese Breakfast Included"],
        description: description || `Architect-designed boutique ${category.toLowerCase()} situated in ${location}.`,
      };

      if (editingStayProperty) {
        if (editingStayProperty.kind === "hotel") {
          const next = hotels.map((h) => (h.id === editingStayProperty.item.id ? hotelData : h));
          updateHotelsWithStorage(next);
        } else {
          // Converted from rental to hotel
          const nextRentals = rentals.filter((r) => r.id !== editingStayProperty.item.id);
          updateRentalsWithStorage(nextRentals);
          const nextHotels = [hotelData, ...hotels];
          updateHotelsWithStorage(nextHotels);
        }
        showToast("Hotel / Villa listing updated");
      } else {
        const next = [hotelData, ...hotels];
        updateHotelsWithStorage(next);
        showToast("Hotel / Villa listing added");
      }
    }

    setStayModalOpen(false);
    setEditingStayProperty(null);
    setStayPhoto("");
  };

  // Delete Stay Property Handler
  const handleDeleteStayProperty = (entry: UnifiedStayItem) => {
    if (!window.confirm(`Are you sure you want to delete "${entry.item.title}"?`)) return;
    if (entry.kind === "rental") {
      const next = rentals.filter((r) => r.id !== entry.item.id);
      updateRentalsWithStorage(next);
      showToast("Rental listing deleted");
    } else {
      const next = hotels.filter((h) => h.id !== entry.item.id);
      updateHotelsWithStorage(next);
      showToast("Hotel / Villa listing deleted");
    }
    if (viewingStayProperty && viewingStayProperty.item.id === entry.item.id) {
      setViewingStayProperty(null);
    }
  };

  // Media Upload Handlers for About Page (Photos & Videos)
  const handleAboutMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const url = event.target.result as string;
        setAboutData((prev) => ({
          ...prev,
          mediaUrl: url,
          mediaType: isVideo ? "video" : "image",
        }));
        showToast(isVideo ? "Video loaded into preview" : "Photo loaded into preview");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAboutMediaDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const url = event.target.result as string;
        setAboutData((prev) => ({
          ...prev,
          mediaUrl: url,
          mediaType: isVideo ? "video" : "image",
        }));
        showToast(isVideo ? "Video loaded into preview" : "Photo loaded into preview");
      }
    };
    reader.readAsDataURL(file);
  };

  // Export Data as JSON
  const handleExportData = () => {
    const backup = {
      projects,
      creators,
      rentals,
      hotels,
      inquiries,
      incomeRecords,
      incomeAuditLogs,
      studioServices,
      buildServices,
      materials,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `design-nayan-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    showToast("Database exported");
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    const isDark = themeMode === "dark";
    return (
      <div className={`min-h-screen ${isDark ? "dn-admin-dark bg-stone-950 text-stone-100" : "bg-[#faf9f6] text-stone-900"} flex flex-col items-center justify-center p-6 antialiased font-sans relative`}>
        {/* Scoped Dark Theme CSS for Login Screen */}
        {isDark && (
          <style>{`
            .dn-admin-dark {
              background-color: #0c0a09 !important;
              color: #fafaf9 !important;
            }
            .dn-admin-dark .bg-white {
              background-color: #1c1917 !important;
              color: #fafaf9 !important;
            }
            .dn-admin-dark .bg-\\[\\#faf9f6\\] {
              background-color: #0c0a09 !important;
            }
            .dn-admin-dark .bg-stone-50,
            .dn-admin-dark .bg-stone-50\\/80,
            .dn-admin-dark .bg-stone-100 {
              background-color: #262220 !important;
              color: #f5f5f4 !important;
            }
            .dn-admin-dark .border-stone-200,
            .dn-admin-dark .border-stone-200\\/60,
            .dn-admin-dark .border-stone-200\\/80 {
              border-color: #292524 !important;
            }
            .dn-admin-dark .text-stone-900,
            .dn-admin-dark .text-stone-800 {
              color: #fafaf9 !important;
            }
            .dn-admin-dark .text-stone-700 {
              color: #e7e5e4 !important;
            }
            .dn-admin-dark .text-stone-500 {
              color: #a8a29e !important;
            }
            .dn-admin-dark input {
              background-color: #262220 !important;
              color: #fafaf9 !important;
              border-color: #44403c !important;
            }
            .dn-admin-dark input::placeholder {
              color: #78716c !important;
            }
          `}</style>
        )}
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[200] bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        {/* Quick Theme Switcher on Login Screen */}
        <div className="absolute top-5 right-5">
          <button
            onClick={() => handleToggleTheme(isDark ? "light" : "dark")}
            className={`p-2.5 rounded-full ${
              isDark ? "bg-stone-900 text-amber-400 border border-stone-800 hover:bg-stone-800" : "bg-white text-stone-700 border border-stone-200/60 hover:bg-stone-100 shadow-2xs"
            } transition-all cursor-pointer`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className={`max-w-md w-full ${isDark ? "bg-stone-900 border-stone-800 text-stone-100" : "bg-white border-stone-200/60 text-stone-900"} border rounded-3xl p-8 sm:p-9 shadow-xl space-y-6 animate-in fade-in zoom-in-95`}>
          {!twoFactorLoginStep ? (
            /* STEP 1: Passcode Entry */
            <>
              <div className="text-center space-y-2">
                <div className={`w-12 h-12 rounded-2xl ${isDark ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-800"} flex items-center justify-center mx-auto shadow-xs`}>
                  <Shield className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-semibold tracking-tight">Design Nayan Admin</h1>
                <p className={`${isDark ? "text-stone-400" : "text-stone-500"} text-xs font-normal`}>
                  Enter your admin passcode to unlock the dashboard
                </p>
                {adminEmail && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-500/10 text-[11px] text-stone-400 font-medium">
                    <span>Account:</span>
                    <strong className={isDark ? "text-stone-200" : "text-stone-700"}>{adminEmail}</strong>
                  </div>
                )}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {authError && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`block text-xs font-medium ${isDark ? "text-stone-300" : "text-stone-700"}`}>
                      Admin Passcode
                    </label>
                    {twoFactorEnabled && (
                      <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> 2FA Active
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPasscode ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter your admin passcode"
                      required
                      autoFocus
                      className={`w-full pl-10 pr-11 py-2.5 rounded-2xl ${
                        isDark
                          ? "bg-stone-800/80 border-stone-700 text-white placeholder:text-stone-500 focus:bg-stone-800 focus:border-stone-500"
                          : "bg-stone-50/80 border-stone-200/80 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-400"
                      } border text-sm focus:outline-none transition-all`}
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPasscode(!showLoginPasscode)}
                      aria-label={showLoginPasscode ? "Hide passcode" : "Show passcode"}
                      className={`absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer`}
                    >
                      {showLoginPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-full ${
                    isDark ? "bg-white text-stone-900 hover:bg-stone-200" : "bg-stone-900 text-white hover:bg-stone-800"
                  } font-medium text-xs tracking-wide transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer`}
                >
                  <span>{twoFactorEnabled ? "Verify with 2FA" : "Sign In"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-2 text-center">
                <Link
                  href="/"
                  className={`text-xs ${isDark ? "text-stone-400 hover:text-stone-200" : "text-stone-500 hover:text-stone-900"} transition-colors font-medium`}
                >
                  &larr; Back to website
                </Link>
              </div>
            </>
          ) : (
            /* STEP 2: 2FA Verification */
            <>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-xs border border-emerald-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-semibold tracking-tight">Two-Factor Authentication</h1>
                <p className={`${isDark ? "text-stone-400" : "text-stone-500"} text-xs font-normal`}>
                  {useBackupCodeLogin
                    ? "Enter one of your emergency recovery backup codes"
                    : "Enter the 6-digit verification code from your authenticator app"}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-500/10 text-[11px] text-stone-400 font-medium">
                  <span>Signed in as:</span>
                  <strong className={isDark ? "text-stone-200" : "text-stone-700"}>{adminEmail}</strong>
                </div>
              </div>

              <form onSubmit={handleVerify2FA} className="space-y-4">
                {authError && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div>
                  <label className={`block text-xs font-medium ${isDark ? "text-stone-300" : "text-stone-700"} mb-1.5`}>
                    {useBackupCodeLogin ? "Emergency Recovery Code" : "6-Digit Security Code"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginOtpCode}
                      onChange={(e) => setLoginOtpCode(e.target.value)}
                      placeholder={useBackupCodeLogin ? "e.g. 8921-4301" : "e.g. 482910"}
                      required
                      autoFocus
                      maxLength={useBackupCodeLogin ? 12 : 6}
                      className={`w-full px-4 py-3 rounded-2xl text-center font-mono tracking-widest text-lg ${
                        isDark
                          ? "bg-stone-800/80 border-stone-700 text-white placeholder:text-stone-500 focus:bg-stone-800 focus:border-stone-500"
                          : "bg-stone-50/80 border-stone-200/80 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-400"
                      } border focus:outline-none transition-all`}
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1.5 text-center">
                    {useBackupCodeLogin
                      ? "Use any valid 8-digit recovery code saved during 2FA setup"
                      : "Open Google Authenticator, Microsoft Authenticator or Apple Passwords"}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-wide transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Unlock Dashboard</span>
                </button>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setUseBackupCodeLogin(!useBackupCodeLogin);
                      setLoginOtpCode("");
                      setAuthError("");
                    }}
                    className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 underline font-medium cursor-pointer"
                  >
                    {useBackupCodeLogin ? "Use 6-Digit App Code" : "Use Backup Code instead"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorLoginStep(false);
                      setAuthError("");
                    }}
                    className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 font-medium cursor-pointer"
                  >
                    &larr; Back to Passcode
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // -------------------------------------------------------------
  const isDark = themeMode === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "dn-admin-dark bg-stone-950 text-stone-100" : "bg-[#faf9f6] text-stone-900"} flex flex-col lg:flex-row antialiased font-sans transition-colors duration-200 relative`}>
      {/* Dark Theme Global Scoped Overrides */}
      {isDark && (
        <style>{`
          .dn-admin-dark {
            background-color: #0c0a09 !important;
            color: #fafaf9 !important;
          }
          .dn-admin-dark aside {
            background-color: #171513 !important;
            border-color: #292524 !important;
          }
          .dn-admin-dark main {
            background-color: #0c0a09 !important;
            color: #fafaf9 !important;
          }
          .dn-admin-dark .bg-white {
            background-color: #1c1917 !important;
            color: #fafaf9 !important;
          }
          .dn-admin-dark .bg-\\[\\#faf9f6\\] {
            background-color: #0c0a09 !important;
          }
          .dn-admin-dark .bg-stone-50,
          .dn-admin-dark .bg-stone-50\\/80,
          .dn-admin-dark .bg-stone-50\\/70,
          .dn-admin-dark .bg-stone-100,
          .dn-admin-dark .bg-stone-100\\/70 {
            background-color: #262220 !important;
            color: #f5f5f4 !important;
          }
          .dn-admin-dark .border-stone-200,
          .dn-admin-dark .border-stone-200\\/60,
          .dn-admin-dark .border-stone-200\\/70,
          .dn-admin-dark .border-stone-200\\/80,
          .dn-admin-dark .border-stone-100 {
            border-color: #292524 !important;
          }
          .dn-admin-dark .text-stone-900,
          .dn-admin-dark .text-stone-800 {
            color: #fafaf9 !important;
          }
          .dn-admin-dark .text-stone-700 {
            color: #e7e5e4 !important;
          }
          .dn-admin-dark .text-stone-600,
          .dn-admin-dark .text-stone-500 {
            color: #a8a29e !important;
          }
          .dn-admin-dark .text-stone-400 {
            color: #78716c !important;
          }
          .dn-admin-dark input,
          .dn-admin-dark select,
          .dn-admin-dark textarea {
            background-color: #262220 !important;
            color: #fafaf9 !important;
            border-color: #44403c !important;
          }
          .dn-admin-dark input::placeholder,
          .dn-admin-dark textarea::placeholder {
            color: #78716c !important;
          }
          .dn-admin-dark .shadow-2xs,
          .dn-admin-dark .shadow-xs,
          .dn-admin-dark .shadow-sm {
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4) !important;
          }
        `}</style>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[200] bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* SIDEBAR                                                   */}
      {/* ========================================================= */}
      <aside className={`w-full lg:w-64 ${isDark ? "bg-stone-900 border-stone-800 text-stone-100" : "bg-white border-stone-200/60 text-stone-900"} border-b lg:border-b-0 lg:border-r flex flex-col justify-between shrink-0 p-5 lg:min-h-screen`}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <Link href="/" target="_blank" className="inline-flex items-center select-none" title="Visit Design Nayan Website">
                <img
                  src={isDark ? "/images/logo-white.png" : "/images/logo.png"}
                  alt="Design Nayan"
                  className="h-7 sm:h-8 w-auto object-contain transition-transform hover:scale-[1.02]"
                />
              </Link>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isDark ? "bg-stone-800 text-stone-300 border-stone-700" : "bg-stone-100 text-stone-600 border-stone-200/60"} border uppercase`}>
                Admin
              </span>
            </div>
            <Link
              href="/"
              target="_blank"
              title="Open website"
              className={`p-1.5 rounded-xl ${isDark ? "text-stone-400 hover:text-stone-200 hover:bg-stone-800" : "text-stone-400 hover:text-stone-700 hover:bg-stone-50"} transition-colors`}
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: Layers, count: null },
              { id: "income", label: "Finances & Revenue", icon: Wallet, count: null },
              {
                id: "inquiries",
                label: "Inquiries",
                icon: Mail,
                count: inquiries.filter((i) => i.status === "NEW").length,
                isBadge: true,
              },
              { id: "studio", label: "Studio Services", icon: Palette, count: studioServices.length },
              { id: "build", label: "Build & Civil", icon: HardHat, count: buildServices.length },
              { id: "creators", label: "Creators", icon: Users, count: creators.length },
              { id: "stays", label: "Stay & Rentals", icon: HomeIcon, count: rentals.length + hotels.length },
              { id: "portfolio", label: "Portfolio", icon: Building2, count: projects.length },
              { id: "about", label: "About Page", icon: Info, count: null },
              { id: "contact", label: "Contact Info", icon: PhoneCall, count: null },
              { id: "settings", label: "Settings", icon: Settings, count: null },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? isDark
                        ? "bg-white text-stone-900 shadow-xs"
                        : "bg-stone-900 text-white shadow-xs"
                      : isDark
                      ? "text-stone-300 hover:text-white hover:bg-stone-800/80"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isDark ? "text-stone-900" : "text-white") : "text-stone-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.isBadge
                          ? "bg-rose-500 text-white"
                          : isActive
                          ? isDark
                            ? "bg-stone-900/10 text-stone-900"
                            : "bg-white/20 text-white"
                          : isDark
                          ? "bg-stone-800 text-stone-300"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Minimal Footer */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
          <span className="font-medium tracking-tight">Design Nayan Admin</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 font-semibold">v2.5</span>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT                                              */}
      {/* ========================================================= */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-6xl">
        
        {/* ------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW                                         */}
        {/* ------------------------------------------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">Overview</h1>
                {inquiries.filter((i) => i.status === "NEW").length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("inquiries")}
                    className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 text-[11px] font-semibold flex items-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>{inquiries.filter((i) => i.status === "NEW").length} New Inquiries</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingIncome(null);
                    setIncomeModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Income</span>
                </button>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>

            {/* PURE TYPOGRAPHY METRICS - ROW 1: TWO COLUMNS (No Boxy Cards, No Subtexts, Direct On Screen) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-14 pb-2 pt-1">
              {/* Metric 1: This Month Income */}
              <div
                onClick={() => setActiveTab("income")}
                className="cursor-pointer group space-y-1"
              >
                <span className="text-xs font-medium text-stone-400 tracking-wide uppercase block">
                  This Month Income
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-900 block group-hover:text-stone-600 transition-colors">
                  {formatINR(thisMonthOverviewTotal)}
                </span>
              </div>

              {/* Metric 2: Pending Income */}
              <div
                onClick={() => setActiveTab("income")}
                className="cursor-pointer group space-y-1"
              >
                <span className="text-xs font-medium text-stone-400 tracking-wide uppercase block">
                  Pending Income
                </span>
                <span className={`text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight block transition-colors ${
                  totalPendingOverview > 0
                    ? "text-rose-600 group-hover:text-rose-700"
                    : "text-stone-900 group-hover:text-stone-600"
                }`}>
                  {formatINR(totalPendingOverview)}
                </span>
              </div>
            </div>

            {/* PURE TYPOGRAPHY METRICS - ROW 2: FIVE COLUMNS (No Boxy Cards, Direct On Screen) */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 pb-3 pt-2">
              {/* 1. Portfolio */}
              <div
                onClick={() => setActiveTab("portfolio")}
                className="cursor-pointer group space-y-0.5"
              >
                <span className="text-xs font-medium text-stone-400 tracking-wide uppercase block mb-1">
                  Portfolio
                </span>
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 block group-hover:text-stone-600 transition-colors">
                  {projects.length}
                </span>
                <span className="text-xs text-stone-500 font-normal pt-1 block">
                  Architectural works
                </span>
              </div>

              {/* 2. Stay */}
              <div
                onClick={() => setActiveTab("stays")}
                className="cursor-pointer group space-y-0.5"
              >
                <span className="text-xs font-medium text-stone-400 tracking-wide uppercase block mb-1">
                  Stay
                </span>
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 block group-hover:text-stone-600 transition-colors">
                  {rentals.length + hotels.length}
                </span>
                <span className="text-xs text-stone-500 font-normal pt-1 block">
                  Rentals & Hotels
                </span>
              </div>

              {/* 3. Studio */}
              <div
                onClick={() => setActiveTab("studio")}
                className="cursor-pointer group space-y-0.5"
              >
                <span className="text-xs font-medium text-stone-400 tracking-wide uppercase block mb-1">
                  Studio
                </span>
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 block group-hover:text-stone-600 transition-colors">
                  {studioServices.length}
                </span>
                <span className="text-xs text-stone-500 font-normal pt-1 block">
                  Design & Interior
                </span>
              </div>

              {/* 4. Build */}
              <div
                onClick={() => setActiveTab("build")}
                className="cursor-pointer group space-y-0.5"
              >
                <span className="text-xs font-medium text-stone-400 tracking-wide uppercase block mb-1">
                  Build
                </span>
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 block group-hover:text-stone-600 transition-colors">
                  {buildServices.length}
                </span>
                <span className="text-xs text-stone-500 font-normal pt-1 block">
                  Civil & Materials
                </span>
              </div>

              {/* 5. Creators */}
              <div
                onClick={() => setActiveTab("creators")}
                className="cursor-pointer group space-y-0.5"
              >
                <span className="text-xs font-medium text-stone-400 tracking-wide uppercase block mb-1">
                  Creators
                </span>
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 block group-hover:text-stone-600 transition-colors">
                  {creators.length}
                </span>
                <span className="text-xs text-stone-500 font-normal pt-1 block">
                  Agency roster
                </span>
              </div>
            </div>

            {/* Quick Glance: Recent Leads (Individual Cards, No Group Back Card) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-stone-900 tracking-tight">Latest Client Inquiries</h2>
                <button
                  onClick={() => setActiveTab("inquiries")}
                  className="text-xs text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View all ({inquiries.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {inquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/60 shadow-2xs hover:border-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm sm:text-base font-semibold text-stone-900">{inq.name}</span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            inq.status === "NEW"
                              ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                              : inq.status === "IN REVIEW"
                              ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                          }`}
                        >
                          {inq.status}
                        </span>
                        <span className="text-xs text-stone-400 font-normal">{inq.date}</span>
                      </div>
                      <div className="text-xs text-stone-500 font-normal">
                        <span className="text-stone-700 font-medium">{inq.service}</span> &bull; <span>{inq.budget}</span> &bull; {inq.location}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hi ${inq.name}! Thank you for contacting Design Nayan regarding ${inq.service}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 2: PORTFOLIO                                        */}
        {/* ------------------------------------------------------- */}
        {activeTab === "portfolio" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">Portfolio</h1>
              </div>

              <button
                onClick={() => {
                  setEditingProject(null);
                  setProjectModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            </div>

            {/* Search Bar & Category Tabs */}
            <div className="space-y-3.5">
              {/* Full-Fledged Search Bar */}
              <div className="relative flex items-center bg-white rounded-2xl border border-stone-200/80 shadow-2xs focus-within:ring-2 focus-within:ring-stone-900/10 focus-within:border-stone-400 transition-all">
                <Search className="w-4 h-4 text-stone-400 ml-4 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search portfolio by project title, location, client, or service keywords..."
                  className="w-full pl-3 pr-3 py-3 bg-transparent text-stone-900 text-sm focus:outline-none placeholder:text-stone-400 font-normal"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mr-3 text-stone-400 hover:text-stone-700 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Below Search Bar: Category Tabs */}
              <div className="flex items-center gap-1.5 bg-stone-200/50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar w-full">
                {[
                  "ALL",
                  "DESIGN & ARCHITECTURE",
                  "BRANDING & CREATIVITY",
                  "DIGITAL & MARKETING",
                  "BUILD & CONSTRUCTIONS",
                  "CREATORS",
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProjectCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      projectCategoryFilter === cat
                        ? "bg-white text-stone-900 shadow-xs font-semibold"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Portfolio Cards or Empty State */}
            {filteredProjects.length === 0 ? (
              <div className="bg-white border border-stone-200/60 rounded-3xl p-10 sm:p-14 text-center space-y-3 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-stone-900 text-base">No matching projects found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {searchQuery ? (
                    <>No portfolio projects match &ldquo;{searchQuery}&rdquo;{projectCategoryFilter !== "ALL" ? ` in ${projectCategoryFilter}` : ""}.</>
                  ) : (
                    <>No projects available in the {projectCategoryFilter} category yet.</>
                  )}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setProjectCategoryFilter("ALL");
                    }}
                    className="px-4 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setViewingProjectDetail(p)}
                    className="bg-white border border-stone-200/60 rounded-3xl overflow-hidden shadow-2xs hover:border-stone-300 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-stone-900/70 backdrop-blur-md text-white text-[10px] font-medium uppercase tracking-wider">
                        {p.categoryTag}
                      </div>
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-stone-900 text-sm sm:text-base group-hover:text-stone-700 transition-colors">
                          {p.title}
                        </h3>
                        <div className="text-xs text-stone-500 font-normal flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{p.location}</span>
                        </div>
                        <div className="text-xs text-stone-400 font-normal mt-0.5">
                          {p.year} &bull; {p.area}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingProjectDetail(p);
                          }}
                          className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProject(p);
                              setProjectModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(p.id);
                            }}
                            className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 3: FINANCES & REVENUE (Synchronized Filters & KPIs) */}
        {/* ------------------------------------------------------- */}
        {activeTab === "income" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Bar with Single "Log New Transaction" Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">Finances & Revenue</h1>
              </div>

              {/* ONLY 1 LOG BUTTON HERE */}
              <button
                onClick={() => {
                  setEditingIncome(null);
                  setIncomeModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Transaction</span>
              </button>
            </div>

            {/* Global Range & Category Control Center */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              {/* Timeframe Range Pills - with comfortable right padding so 'All Time' is never cut off */}
              <div className="inline-flex items-center gap-1 bg-stone-200/50 p-1.5 pr-2.5 rounded-full overflow-x-auto no-scrollbar max-w-full shrink-0">
                {[
                  { id: "this_month", label: "This Month" },
                  { id: "3_months", label: "3 Months" },
                  { id: "6_months", label: "6 Months" },
                  { id: "this_year", label: "This Year" },
                  { id: "all_time", label: "All Time" },
                ].map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setIncomeTimeFilter(tf.id as TimeFilterType)}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                      incomeTimeFilter === tf.id
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* Category Filter Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-stone-400 shrink-0">Category:</span>
                <select
                  value={incomeCategoryFilter}
                  onChange={(e) => setIncomeCategoryFilter(e.target.value)}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200/60 text-xs font-medium text-stone-800 focus:outline-none cursor-pointer shadow-2xs"
                >
                  <option value="ALL">All Categories</option>
                  {INCOME_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PURE TYPOGRAPHY METRICS - 3 COLUMNS (Static & Perfectly Aligned on Center Horizontal Line) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 pb-2 pt-1">
              {/* Metric 1: Received Income */}
              <div className="flex flex-col justify-between">
                <span className="text-xs font-medium text-stone-400 tracking-wide uppercase block h-5 truncate mb-1">
                  Received Income ({activeTimeframeLabel})
                </span>
                <div className="h-10 sm:h-12 flex items-center">
                  <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 block truncate">
                    {formatINR(periodReceivedTotal)}
                  </span>
                </div>
                <span className="text-xs text-stone-500 font-normal pt-1 block h-5 truncate">
                  {incomeCategoryFilter === "ALL" ? "All services" : incomeCategoryFilter} &bull; Cleared in bank
                </span>
              </div>

              {/* Metric 2: Pending Balance */}
              <div className="flex flex-col justify-between">
                <span className="text-xs font-medium text-stone-400 tracking-wide uppercase block h-5 truncate mb-1">
                  Pending Balance ({activeTimeframeLabel})
                </span>
                <div className="h-10 sm:h-12 flex items-center">
                  <span className={`text-3xl sm:text-4xl font-semibold tracking-tight block truncate ${periodPendingTotal > 0 ? "text-rose-600" : "text-stone-400"}`}>
                    {formatINR(periodPendingTotal)}
                  </span>
                </div>
                <div className="text-xs text-stone-500 font-normal pt-1 flex items-center gap-1 h-5 truncate">
                  {periodPendingTotal > 0 ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                      <span className="text-rose-600 font-medium truncate">Awaiting client collection</span>
                    </>
                  ) : (
                    <span className="truncate">Zero pending balance</span>
                  )}
                </div>
              </div>

              {/* Metric 3: Total Contract Deal Value */}
              <div className="flex flex-col justify-between">
                <span className="text-xs font-medium text-stone-400 tracking-wide uppercase block h-5 truncate mb-1">
                  Total Deal Value ({activeTimeframeLabel})
                </span>
                <div className="h-10 sm:h-12 flex items-center">
                  <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 block truncate">
                    {formatINR(periodContractTotal)}
                  </span>
                </div>
                <span
                  className="text-xs text-stone-500 font-normal pt-1 block h-5 truncate"
                  title={`Received (${formatINR(periodReceivedTotal)}) + Pending (${formatINR(periodPendingTotal)})`}
                >
                  Received ({formatINR(periodReceivedTotal)}) + Pending ({formatINR(periodPendingTotal)})
                </span>
              </div>
            </div>

            {/* Category Breakdown (Shown when "All Categories" is active) */}
            {incomeCategoryFilter === "ALL" && categoryBreakdown.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-stone-900 tracking-tight">
                  Category Share ({activeTimeframeLabel})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryBreakdown.map((cat) => (
                    <div
                      key={cat.category}
                      onClick={() => setIncomeCategoryFilter(cat.category)}
                      className="p-4 rounded-3xl bg-white border border-stone-200/60 shadow-2xs space-y-2 hover:border-stone-300 transition-all cursor-pointer"
                      title="Click to filter by this category"
                    >
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-stone-700 truncate pr-2">{cat.category}</span>
                        <span className="text-stone-900 font-semibold">{cat.percentage}%</span>
                      </div>
                      <div className="text-base font-semibold text-stone-900">{formatINR(cat.amount)}</div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-stone-900 h-full rounded-full transition-all"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRANSACTIONS SECTION */}
            <div className="space-y-4 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-stone-900 tracking-tight">
                  Transactions ({filteredIncome.length})
                </h2>

                {/* Payment Status Segmented Tabs */}
                <div className="inline-flex items-center gap-1 bg-stone-200/50 p-1 rounded-full self-start sm:self-auto">
                  <button
                    onClick={() => setIncomePaymentFilter("ALL")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      incomePaymentFilter === "ALL" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setIncomePaymentFilter("PENDING_ONLY")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      incomePaymentFilter === "PENDING_ONLY" ? "bg-white text-rose-600 shadow-xs font-semibold" : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Pending Only
                  </button>
                  <button
                    onClick={() => setIncomePaymentFilter("PAID")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      incomePaymentFilter === "PAID" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Paid Only
                  </button>
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={incomeSearchQuery}
                  onChange={(e) => setIncomeSearchQuery(e.target.value)}
                  placeholder="Search transactions by client, amount, or notes..."
                  className="w-full pl-10 pr-14 py-2.5 rounded-2xl bg-white border border-stone-200/60 text-stone-900 text-xs focus:border-stone-400 focus:outline-none transition-all placeholder:text-stone-400 shadow-2xs"
                />
                {incomeSearchQuery && (
                  <button
                    onClick={() => setIncomeSearchQuery("")}
                    className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-700 text-xs cursor-pointer font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Header directly above the Transactions list (matching the History list placement) */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-stone-400 font-normal">Click any row to open the complete details</span>
                <Link
                  href="/admin/transactions"
                  className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Transactions List Stream */}
              <div className="bg-white border border-stone-200/60 rounded-3xl overflow-hidden divide-y divide-stone-100 shadow-2xs">
                {filteredIncome.length === 0 ? (
                  <div className="p-10 text-center space-y-2">
                    <p className="text-stone-500 text-xs font-normal">No transactions match your current selection.</p>
                    <button
                      onClick={() => {
                        setIncomeTimeFilter("all_time");
                        setIncomeCategoryFilter("ALL");
                        setIncomePaymentFilter("ALL");
                        setIncomeSearchQuery("");
                      }}
                      className="text-xs font-medium text-stone-900 hover:underline cursor-pointer"
                    >
                      Reset all filters
                    </button>
                  </div>
                ) : (
                  filteredIncome.map((rec) => {
                    const isPending = (rec.pendingAmount || 0) > 0;
                    return (
                      <div
                        key={rec.id}
                        onClick={() => setViewingIncomeDetail(rec)}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors cursor-pointer group"
                      >
                        <div className="space-y-1 flex-1">
                          <h3 className="text-sm sm:text-base font-semibold text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">
                            {rec.clientName}
                          </h3>

                          <div className="text-xs text-stone-500 flex flex-wrap items-center gap-1.5 font-normal">
                            <span className="text-stone-700 font-medium tracking-wide">
                              {rec.category}
                            </span>
                            <span>&bull;</span>
                            <span>{rec.date}</span>
                            <span>&bull;</span>
                            <span>{rec.paymentMethod}</span>
                          </div>

                          {rec.projectDetails && (
                            <p className="text-xs text-stone-400 line-clamp-1 font-normal pt-0.5">{rec.projectDetails}</p>
                          )}
                        </div>

                        {/* Amount & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                          <div className="text-left sm:text-right">
                            <div className="text-base sm:text-lg font-semibold tracking-tight text-stone-900">
                              {formatINR(rec.amount)}
                            </div>
                            {isPending ? (
                              <div className="text-xs font-medium text-rose-600">
                                {formatINR(rec.pendingAmount)} pending
                              </div>
                            ) : (
                              <div className="text-xs font-normal text-stone-400">
                                Fully cleared
                              </div>
                            )}
                          </div>

                          <div
                            className="flex items-center gap-1.5 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setEditingIncome(rec);
                                setIncomeModalOpen(true);
                              }}
                              className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteIncome(rec)}
                              className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete transaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Audit History & Activity Log */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-stone-500" />
                  <h2 className="text-base font-semibold text-stone-900 tracking-tight">Audit History & Activity Log</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 hidden sm:inline font-normal">Permanent owner ledger</span>
                  <Link
                    href="/admin/history"
                    className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="bg-white border border-stone-200/60 rounded-3xl p-4 sm:p-5 shadow-2xs divide-y divide-stone-100 max-h-80 overflow-y-auto">
                {incomeAuditLogs.length === 0 ? (
                  <div className="p-4 text-center text-xs text-stone-400 font-normal">No activity logged yet.</div>
                ) : (
                  incomeAuditLogs.map((log) => (
                    <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            log.action === "ADDED"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                              : log.action === "EDITED"
                              ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                              : "bg-rose-50 text-rose-800 border border-rose-200/60"
                          }`}
                        >
                          {log.action}
                        </span>
                        <span className="text-stone-700 font-normal">{log.description}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1 shrink-0 font-normal">
                        <Clock className="w-3 h-3" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB: STUDIO SERVICES                                    */}
        {/* ------------------------------------------------------- */}
        {activeTab === "studio" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">Studio Services</h1>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingStudioService(null);
                    setStudioModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>

            {/* Pure Typography Metric Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-1 pb-4">
              <div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                  {studioServices.length}
                </div>
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                  Total Services
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                  {studioServices.filter((s) => s.category === "DESIGN & ARCHITECTURE").length}
                </div>
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                  Design & Arch
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                  {studioServices.filter((s) => s.category === "BRANDING & CREATIVE").length}
                </div>
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                  Branding & Creative
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                  {studioServices.filter((s) => s.category === "DIGITAL & MARKETING").length}
                </div>
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                  Digital & Media
                </div>
              </div>
            </div>

            {/* Filter and Dynamic Search Bar */}
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Dynamic Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search services, deliverables, keywords..."
                    value={studioSearchQuery}
                    onChange={(e) => setStudioSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2 rounded-2xl bg-white border border-stone-200/80 text-stone-900 text-xs placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors shadow-2xs"
                  />
                  {studioSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setStudioSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {(
                    [
                      { id: "ALL", label: "All" },
                      { id: "DESIGN & ARCHITECTURE", label: "Design & Arch" },
                      { id: "BRANDING & CREATIVE", label: "Branding" },
                      { id: "DIGITAL & MARKETING", label: "Digital" },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setStudioCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        studioCategoryFilter === cat.id
                          ? "bg-stone-900 text-white shadow-xs"
                          : "bg-white border border-stone-200/80 text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredStudioServices.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white border border-stone-200/60 rounded-3xl">
                  <Palette className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-stone-900">No services found</h3>
                  <p className="text-xs text-stone-500 mt-1">Try searching for something else or add a new service.</p>
                  {(studioSearchQuery || studioCategoryFilter !== "ALL") && (
                    <button
                      type="button"
                      onClick={() => {
                        setStudioSearchQuery("");
                        setStudioCategoryFilter("ALL");
                      }}
                      className="mt-3 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                filteredStudioServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setViewingStudioService(service)}
                    className="bg-white border border-stone-200/60 rounded-3xl p-5 sm:p-6 shadow-2xs hover:border-stone-400 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                          {service.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {service.popular && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                              Popular
                            </span>
                          )}
                          {service.badge && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                              {service.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-base font-semibold text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-stone-500 font-normal mt-1.5 leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Metadata & Actions */}
                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-stone-400 font-normal">Pricing / Turnaround</div>
                        <div className="text-xs font-semibold text-stone-900">
                          {service.priceGuide}{" "}
                          <span className="text-[11px] font-normal text-stone-500">· {service.turnaround}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStudioService(service);
                            setStudioModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStudioService(service.id)}
                          className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB: BUILD & CIVIL SERVICES                             */}
        {/* ------------------------------------------------------- */}
        {activeTab === "build" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">Build & Civil</h1>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBuildService(null);
                    setBuildModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>

            {/* Pure Typography Metric Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-1 pb-4">
              <div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                  {buildServices.length}
                </div>
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                  Total Civil Services
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                  {buildServices.filter((s) => s.popular).length}
                </div>
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                  Popular Packages
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                  {buildServices.reduce((acc, s) => acc + (s.deliverables?.length || 0), 0)}
                </div>
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                  Total Deliverables
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                  {buildServices.reduce((acc, s) => acc + (s.specs?.length || 0), 0)}
                </div>
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mt-1">
                  Guaranteed Specs
                </div>
              </div>
            </div>

            {/* Dynamic Search Bar */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search civil services, materials, specs..."
                value={buildSearchQuery}
                onChange={(e) => setBuildSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-2xl bg-white border border-stone-200/80 text-stone-900 text-xs placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors shadow-2xs"
              />
              {buildSearchQuery && (
                <button
                  type="button"
                  onClick={() => setBuildSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredBuildServices.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white border border-stone-200/60 rounded-3xl">
                  <HardHat className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-stone-900">No civil services found</h3>
                  <p className="text-xs text-stone-500 mt-1">Try searching for something else or add a new package.</p>
                  {buildSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setBuildSearchQuery("")}
                      className="mt-3 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                filteredBuildServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setViewingBuildService(service)}
                    className="bg-white border border-stone-200/60 rounded-3xl p-5 sm:p-6 shadow-2xs hover:border-stone-400 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                          Turnkey Civil
                        </span>
                        <div className="flex items-center gap-1.5">
                          {service.popular && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                              Popular
                            </span>
                          )}
                          {service.badge && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                              {service.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-base font-semibold text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-stone-500 font-normal mt-1.5 leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Metadata & Actions */}
                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-stone-400 font-normal">Pricing / Timeline</div>
                        <div className="text-xs font-semibold text-stone-900">
                          {service.priceGuide}{" "}
                          <span className="text-[11px] font-normal text-stone-500">· {service.turnaround}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBuildService(service);
                            setBuildModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBuildService(service.id)}
                          className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ------------------------------------------------------- */}
            {/* WHOLESALE MATERIALS SECTION                             */}
            {/* ------------------------------------------------------- */}
            <div className="pt-8 border-t border-stone-200/60 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-stone-900 tracking-tight">Wholesale Building Materials</h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingMaterial(null);
                    setMaterialModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Material Category</span>
                </button>
              </div>

              {/* Wholesale Materials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {materials.map((mat, index) => (
                  <div
                    key={index}
                    onClick={() => setViewingMaterial(mat)}
                    className="bg-white border border-stone-200/60 rounded-3xl p-5 shadow-2xs hover:border-stone-400 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 uppercase">
                          {mat.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">
                          {mat.category}
                        </h3>
                        <p className="text-xs text-stone-500 font-normal mt-1 leading-relaxed line-clamp-2">
                          {mat.desc}
                        </p>
                      </div>

                      <div className="pt-1">
                        <div className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-1">
                          Partner Brands
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {mat.brands.slice(0, 3).map((brand) => (
                            <span
                              key={brand}
                              className="text-[10.5px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium"
                            >
                              {brand}
                            </span>
                          ))}
                          {mat.brands.length > 3 && (
                            <span className="text-[10px] text-stone-400 px-1.5 py-0.5">
                              +{mat.brands.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMaterial(mat);
                          setMaterialModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMaterial(mat.category)}
                        className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 4: CREATORS                                         */}
        {/* ------------------------------------------------------- */}
        {activeTab === "creators" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header: Simple Heading & Add Creator Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">Creators</h1>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCreator(null);
                    setCreatorAvatar("");
                    setCreatorShowcaseMedia("");
                    setCreatorMediaType("image");
                    setCreatorModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Creator</span>
                </button>
              </div>
            </div>

            {/* Search Bar & Category Filter Chips */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={creatorSearchQuery}
                  onChange={(e) => setCreatorSearchQuery(e.target.value)}
                  placeholder="Search creators by name, handle, role, location..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 shadow-2xs"
                />
                {creatorSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCreatorSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {["ALL", ...CREATOR_CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCreatorCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      creatorCategoryFilter === cat
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Creators */}
            {filteredCreators.length === 0 ? (
              <div className="p-12 text-center bg-stone-50 rounded-3xl border border-stone-200/60 space-y-2">
                <p className="text-stone-700 font-medium text-sm">No creators found</p>
                <p className="text-stone-400 text-xs">Try adjusting your search query or category filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCreators.map((c) => {
                  const hasVideo = Boolean(c.videoPreviewUrl || isVideoMedia(c.featuredImage));
                  return (
                    <div
                      key={c.id}
                      onClick={() => setViewingCreator(c)}
                      className="p-5 rounded-3xl bg-white border border-stone-200/60 shadow-2xs space-y-4 hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="space-y-3.5">
                        {/* Top: Avatar, Name, Handle, Verified & Media Badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-full relative overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                              <img
                                src={c.avatar}
                                alt={c.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-stone-900 text-sm truncate group-hover:text-stone-700 transition-colors">
                                  {c.name}
                                </span>
                                {c.verified && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-900 text-white font-mono font-medium shrink-0">
                                    PRO
                                  </span>
                                )}
                              </div>
                              <div className="text-stone-400 text-xs font-mono truncate">{c.handle}</div>
                            </div>
                          </div>

                          {/* Media Type Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 flex items-center gap-1 ${
                              hasVideo
                                ? "bg-red-50 text-red-700 border border-red-200/60"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {hasVideo ? (
                              <>
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Reel / Video</span>
                              </>
                            ) : (
                              <>
                                <Camera className="w-2.5 h-2.5" />
                                <span>Photo</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Role & Category */}
                        <div>
                          <p className="text-xs text-stone-700 font-medium line-clamp-1">{c.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-stone-500 truncate">{c.category}</span>
                            <span className="text-stone-300">·</span>
                            <span className="text-[11px] text-stone-400 font-mono truncate">{c.tier}</span>
                          </div>
                        </div>

                        {/* Metrics Bar */}
                        <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-stone-50/70 rounded-2xl border border-stone-100 text-center">
                          <div>
                            <div className="text-[10px] text-stone-400 uppercase font-medium">Reach</div>
                            <div className="text-xs font-bold text-stone-900 mt-0.5">{c.followersCount}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-stone-400 uppercase font-medium">Avg Views</div>
                            <div className="text-xs font-bold text-stone-900 mt-0.5">{c.avgViews}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-stone-400 uppercase font-medium">Engagement</div>
                            <div className="text-xs font-bold text-red-600 mt-0.5">{c.engagementRate}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Footer: Starting Price, SLA & Actions */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-stone-400 text-[10px] block uppercase font-medium">Starting</span>
                          <span className="text-xs font-semibold text-stone-900">
                            {c.startingRate}{" "}
                            <span className="text-[10px] font-normal text-stone-500">· {c.turnaroundDays}d SLA</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCreator(c);
                              setCreatorModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCreator(c.id, c.name)}
                            className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Creator"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 5: STAYS & RENTALS                                  */}
        {/* ------------------------------------------------------- */}
        {activeTab === "stays" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header: Simple heading with no subtext, Add Property Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">Stay & Properties</h1>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingStayProperty(null);
                  setStayModalType("rental");
                  setStayPhoto("");
                  setStayModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Property</span>
              </button>
            </div>

            {/* Search Bar & Unified Filter Selector */}
            <div className="space-y-3">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={staySearchQuery}
                  onChange={(e) => setStaySearchQuery(e.target.value)}
                  placeholder="Search properties by title, locality, city, type or amenities..."
                  className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-all shadow-2xs"
                />
                {staySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setStaySearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Selector Pills: All Properties, Rentals, Hotels & Villas */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "ALL", label: `All Properties (${rentals.length + hotels.length})` },
                  { id: "RENTALS", label: `Rentals (${rentals.length})` },
                  { id: "HOTELS", label: `Hotels & Villas (${hotels.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStayFilter(tab.id as "ALL" | "RENTALS" | "HOTELS")}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      stayFilter === tab.id
                        ? "bg-stone-900 text-white shadow-2xs"
                        : "bg-white text-stone-600 border border-stone-200/70 hover:bg-stone-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Properties Grid */}
            {unifiedStayProperties.length === 0 ? (
              <div className="bg-white border border-stone-200/60 rounded-3xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <HomeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-stone-800">No properties found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {staySearchQuery
                    ? `No listings match "${staySearchQuery}". Try clearing search keywords.`
                    : "No properties registered in this category yet."}
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  {staySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setStaySearchQuery("")}
                      className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStayProperty(null);
                      setStayModalType(stayFilter === "HOTELS" ? "hotel" : "rental");
                      setStayPhoto("");
                      setStayModalOpen(true);
                    }}
                    className="px-4 py-1.5 rounded-full bg-stone-900 text-white text-xs font-medium cursor-pointer"
                  >
                    Add First Property
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {unifiedStayProperties.map((entry) => {
                  const isRental = entry.kind === "rental";
                  const rental = isRental ? (entry.item as RentalProperty) : null;
                  const hotel = !isRental ? (entry.item as StayProperty) : null;

                  return (
                    <div
                      key={entry.item.id}
                      onClick={() => setViewingStayProperty(entry)}
                      className="bg-white border border-stone-200/60 rounded-3xl overflow-hidden shadow-2xs hover:border-stone-300 hover:shadow-xs transition-all group flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        {/* Cover Image & Pill Overlays */}
                        <div className="h-44 sm:h-48 relative overflow-hidden bg-stone-100">
                          <Image
                            src={entry.item.image}
                            alt={entry.item.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-60" />

                          {/* Kind / Category Badge */}
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-900 font-semibold text-[11px] shadow-xs flex items-center gap-1.5">
                            {isRental ? (
                              <>
                                <HomeIcon className="w-3 h-3 text-stone-600" />
                                <span>Rental &bull; {rental?.propertyType}</span>
                              </>
                            ) : (
                              <>
                                <Hotel className="w-3 h-3 text-rose-600" />
                                <span>{hotel?.category}</span>
                              </>
                            )}
                          </div>

                          {/* Price Tag */}
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white font-medium text-xs shadow-xs">
                            {isRental
                              ? `₹${rental?.monthlyRent.toLocaleString()} / mo`
                              : `₹${hotel?.pricePerNight.toLocaleString()} / night`}
                          </div>

                          {/* Tag (if Hotel has one) */}
                          {!isRental && hotel?.tag && (
                            <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white font-bold text-[10px] tracking-wider uppercase shadow-xs">
                              {hotel.tag}
                            </div>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-2.5">
                          <div>
                            <h3 className="font-semibold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-stone-700 transition-colors">
                              {entry.item.title}
                            </h3>
                            <div className="text-xs text-stone-500 font-normal flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span className="truncate">
                                {isRental
                                  ? rental?.locality
                                  : `${hotel?.location}, ${hotel?.city}`}
                              </span>
                            </div>
                          </div>

                          {/* Key Specs Bar */}
                          <div className="bg-stone-50/80 rounded-2xl p-2.5 border border-stone-100 flex items-center justify-between text-xs text-stone-600">
                            {isRental ? (
                              <>
                                <div className="flex items-center gap-1 font-medium text-stone-800">
                                  <BedDouble className="w-3.5 h-3.5 text-stone-400" />
                                  <span>{rental?.bedrooms} BHK</span>
                                </div>
                                <span className="text-stone-300">&bull;</span>
                                <span>{rental?.carpetAreaSqFt} sq.ft</span>
                                <span className="text-stone-300">&bull;</span>
                                <span className="truncate text-stone-500 font-normal">{rental?.furnishing}</span>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-1 font-semibold text-stone-900">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span>{hotel?.rating} ({hotel?.reviewsCount})</span>
                                </div>
                                <span className="text-stone-300">&bull;</span>
                                <div className="flex items-center gap-1 text-stone-600">
                                  <Users className="w-3.5 h-3.5 text-stone-400" />
                                  <span>{hotel?.guests} Guests</span>
                                </div>
                                <span className="text-stone-300">&bull;</span>
                                <span>{hotel?.bedrooms} Beds</span>
                              </>
                            )}
                          </div>

                          {/* Description Snippet */}
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                            {entry.item.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div
                        className="px-4 py-3 border-t border-stone-100 flex items-center justify-between bg-stone-50/40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setViewingStayProperty(entry)}
                          className="text-xs text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-400" />
                          <span>Preview</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStayProperty(entry);
                              setStayModalType(entry.kind);
                              setStayPhoto(entry.item.image || "");
                              setStayModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStayProperty(entry)}
                            className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 6: INQUIRIES & LEADS CRM                            */}
        {/* ------------------------------------------------------- */}
        {activeTab === "inquiries" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">Client Inquiries</h1>
              </div>

              <button
                onClick={handleExportData}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200/60 shadow-2xs space-y-3.5 hover:border-stone-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm sm:text-base font-semibold text-stone-900">{inq.name}</span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            inq.status === "NEW"
                              ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                              : inq.status === "IN REVIEW"
                              ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                          }`}
                        >
                          {inq.status}
                        </span>
                        <span className="text-xs text-stone-400 font-normal">{inq.date}</span>
                      </div>
                      <div className="text-xs text-stone-500 font-normal flex flex-wrap gap-x-4">
                        <span>📞 {inq.phone}</span>
                        <span>✉️ {inq.email}</span>
                        <span>📍 {inq.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          handleUpdateInquiryStatus(
                            inq.id,
                            e.target.value as "NEW" | "IN REVIEW" | "CONTACTED" | "CLOSED"
                          )
                        }
                        className="px-3.5 py-1.5 rounded-full bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800 focus:outline-none cursor-pointer"
                      >
                        <option value="NEW">Status: NEW</option>
                        <option value="IN REVIEW">Status: IN REVIEW</option>
                        <option value="CONTACTED">Status: CONTACTED</option>
                        <option value="CLOSED">Status: CLOSED</option>
                      </select>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50/70 text-xs space-y-1">
                    <div className="flex items-center justify-between text-stone-700 font-medium">
                      <span>Service: <strong className="text-stone-900 font-semibold">{inq.service}</strong></span>
                      <span>Budget: <strong className="text-stone-900 font-semibold">{inq.budget}</strong></span>
                    </div>
                    <p className="text-stone-600 pt-1 leading-relaxed font-normal">{inq.message}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hi ${inq.name}! Thank you for contacting Design Nayan regarding ${inq.service}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${inq.phone}`}
                      className="py-1.5 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-stone-500" />
                      <span>Call Client</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB: ABOUT US CONFIGURATION                             */}
        {/* ------------------------------------------------------- */}
        {activeTab === "about" && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">About Us Page</h1>
              </div>

              <Link
                href="/about"
                target="_blank"
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                <span>View Live Page</span>
              </Link>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateAboutDataWithStorage(aboutData);
                showToast("About page updated successfully");
              }}
              className="space-y-6"
            >
              {/* 1. Header & Intro */}
              <div className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-semibold text-stone-900">Header & Intro Section</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Eyebrow / Tagline</label>
                    <input
                      type="text"
                      value={aboutData.tagline}
                      onChange={(e) => setAboutData({ ...aboutData, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Main Headline</label>
                    <input
                      type="text"
                      value={aboutData.headline}
                      onChange={(e) => setAboutData({ ...aboutData, headline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-stone-700">Intro Narrative / Description</label>
                  <textarea
                    rows={3}
                    value={aboutData.description}
                    onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
                  />
                </div>
              </div>

              {/* 2. Media Showcase (Photo & Video Compatible) */}
              <div className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-rose-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-stone-900">Featured Media Container</h3>
                      <p className="text-[11px] text-stone-500">Supports both photos and high-resolution video presentations</p>
                    </div>
                  </div>

                  {/* Switcher */}
                  <div className="inline-flex items-center gap-1 bg-stone-100 p-1 rounded-2xl self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setAboutData({ ...aboutData, mediaType: "image" })}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        aboutData.mediaType === "image" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      📷 Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setAboutData({ ...aboutData, mediaType: "video" })}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        aboutData.mediaType === "video" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      🎥 Video
                    </button>
                  </div>
                </div>

                {aboutData.mediaUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 aspect-[16/9] max-h-60 group">
                    {aboutData.mediaType === "video" || isVideoMedia(aboutData.mediaUrl) ? (
                      <video
                        src={aboutData.mediaUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={aboutData.mediaUrl}
                        alt="About media preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setAboutData({ ...aboutData, mediaUrl: "" })}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 transition-colors cursor-pointer"
                      title="Remove Media"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleAboutMediaDrop}
                    className="border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-2xl p-6 text-center bg-stone-50/50 hover:bg-stone-50 transition-all cursor-pointer relative"
                  >
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleAboutMediaUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-stone-800">
                      Drop local {aboutData.mediaType === "video" ? "video" : "photo"} here, or click to upload
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      Supports JPG, PNG, WebP, MP4, WebM, MOV from your device
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-stone-700">Or Direct Media URL</label>
                  <input
                    type="url"
                    value={aboutData.mediaUrl}
                    onChange={(e) => setAboutData({ ...aboutData, mediaUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or https://.../video.mp4"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>
              </div>

              {/* 3. Stats Bar */}
              <div className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-semibold text-stone-900">Key Statistics Bar</h3>
                  <p className="text-[11px] text-stone-500">Edit the 4 primary stats displayed below the hero header</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {aboutData.stats.map((s, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-2">
                      <div>
                        <label className="text-[10px] text-stone-400 uppercase font-medium">Metric Value</label>
                        <input
                          type="text"
                          value={s.value}
                          onChange={(e) => {
                            const next = [...aboutData.stats];
                            next[idx] = { ...next[idx], value: e.target.value };
                            setAboutData({ ...aboutData, stats: next });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-rose-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-400 uppercase font-medium">Metric Label</label>
                        <input
                          type="text"
                          value={s.label}
                          onChange={(e) => {
                            const next = [...aboutData.stats];
                            next[idx] = { ...next[idx], label: e.target.value };
                            setAboutData({ ...aboutData, stats: next });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 text-[11px] text-stone-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Philosophy & Why Us */}
              <div className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-semibold text-stone-900">Philosophy & Why Choose Us</h3>
                  <p className="text-[11px] text-stone-500">Value proposition text displayed alongside the media container</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-stone-700">Section Title</label>
                  <input
                    type="text"
                    value={aboutData.philosophyTitle}
                    onChange={(e) => setAboutData({ ...aboutData, philosophyTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Paragraph 1</label>
                    <textarea
                      rows={3}
                      value={aboutData.philosophyParagraph1}
                      onChange={(e) => setAboutData({ ...aboutData, philosophyParagraph1: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Paragraph 2</label>
                    <textarea
                      rows={3}
                      value={aboutData.philosophyParagraph2}
                      onChange={(e) => setAboutData({ ...aboutData, philosophyParagraph2: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Highlights List */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-stone-700">Key Highlights / Checkpoints</label>
                    <button
                      type="button"
                      onClick={() =>
                        setAboutData({
                          ...aboutData,
                          philosophyHighlights: [...aboutData.philosophyHighlights, "New Service Guarantee"],
                        })
                      }
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                    >
                      + Add Point
                    </button>
                  </div>

                  <div className="space-y-2">
                    {aboutData.philosophyHighlights.map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                        <input
                          type="text"
                          value={hl}
                          onChange={(e) => {
                            const next = [...aboutData.philosophyHighlights];
                            next[idx] = e.target.value;
                            setAboutData({ ...aboutData, philosophyHighlights: next });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none"
                        />
                        {aboutData.philosophyHighlights.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = aboutData.philosophyHighlights.filter((_, i) => i !== idx);
                              setAboutData({ ...aboutData, philosophyHighlights: next });
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Execution Process Steps */}
              <div className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-semibold text-stone-900">Execution Process Steps</h3>
                  <p className="text-[11px] text-stone-500">Configure each phase in the 5-step workflow</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Process Tagline</label>
                    <input
                      type="text"
                      value={aboutData.processTagline}
                      onChange={(e) => setAboutData({ ...aboutData, processTagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Process Title</label>
                    <input
                      type="text"
                      value={aboutData.processTitle}
                      onChange={(e) => setAboutData({ ...aboutData, processTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {aboutData.processSteps.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={step.step}
                          onChange={(e) => {
                            const next = [...aboutData.processSteps];
                            next[idx] = { ...next[idx], step: e.target.value };
                            setAboutData({ ...aboutData, processSteps: next });
                          }}
                          className="w-16 px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-rose-600 font-mono text-center focus:outline-none"
                        />
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const next = [...aboutData.processSteps];
                            next[idx] = { ...next[idx], title: e.target.value };
                            setAboutData({ ...aboutData, processSteps: next });
                          }}
                          placeholder="Step Title"
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={step.description}
                        onChange={(e) => {
                          const next = [...aboutData.processSteps];
                          next[idx] = { ...next[idx], description: e.target.value };
                          setAboutData({ ...aboutData, processSteps: next });
                        }}
                        placeholder="Description of this phase"
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-600 focus:outline-none resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Bar */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                >
                  Save About Page Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB: CONTACT DETAILS CONFIGURATION                      */}
        {/* ------------------------------------------------------- */}
        {activeTab === "contact" && (
          <div className="space-y-6 animate-in fade-in max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">Contact Information</h1>
              </div>

              <Link
                href="/contact"
                target="_blank"
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                <span>View Live Contact Page</span>
              </Link>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateContactDataWithStorage(contactData);
                showToast("Contact details updated successfully");
              }}
              className="space-y-6"
            >
              {/* 1. Hotlines & Direct Channels */}
              <div className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <Phone className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-semibold text-stone-900">Hotlines & Direct Communication</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Phone Hotline Number</label>
                    <input
                      type="text"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      placeholder="+91 84729 34031"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Phone Display Format</label>
                    <input
                      type="text"
                      value={contactData.phoneDisplay}
                      onChange={(e) => setContactData({ ...contactData, phoneDisplay: e.target.value })}
                      placeholder="+91 84729 34031"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Official Email</label>
                    <input
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      placeholder="hello@designnayan.com"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">WhatsApp Link / Number</label>
                    <input
                      type="text"
                      value={contactData.whatsapp}
                      onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                      placeholder="https://wa.me/918472934031"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Office & Operations */}
              <div className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-semibold text-stone-900">Head Office & Regional Reach</h3>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Physical Office Location</label>
                    <input
                      type="text"
                      value={contactData.address}
                      onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                      placeholder="Guwahati, Assam, India"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Operating Coverage Narrative</label>
                    <textarea
                      rows={2}
                      value={contactData.regionSubtext}
                      onChange={(e) => setContactData({ ...contactData, regionSubtext: e.target.value })}
                      placeholder="We operate across Assam, Northeast India, and provide digital solutions globally."
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Business Working Hours</label>
                    <input
                      type="text"
                      value={contactData.workingHours}
                      onChange={(e) => setContactData({ ...contactData, workingHours: e.target.value })}
                      placeholder="Monday – Saturday: 9:00 AM – 7:00 PM IST"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Social Media Handles */}
              <div className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-semibold text-stone-900">Social Media Links</h3>
                  <p className="text-[11px] text-stone-500">Official agency channels linked across the web platform</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Instagram</label>
                    <input
                      type="url"
                      value={contactData.instagram}
                      onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                      placeholder="https://instagram.com/designnayan"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Facebook</label>
                    <input
                      type="url"
                      value={contactData.facebook}
                      onChange={(e) => setContactData({ ...contactData, facebook: e.target.value })}
                      placeholder="https://facebook.com/designnayan"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">LinkedIn</label>
                    <input
                      type="url"
                      value={contactData.linkedin}
                      onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/company/designnayan"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                >
                  Save Contact Details
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 7: SETTINGS & SECURITY                              */}
        {/* ------------------------------------------------------- */}
        {activeTab === "settings" && (
          <div className="space-y-8 animate-in fade-in max-w-3xl pb-16">
            {/* Header: Clean, confident, no pills, no subtext */}
            <div className={`pb-4 border-b ${isDark ? "border-stone-800" : "border-stone-200/80"}`}>
              <h1 className={`text-2xl sm:text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-stone-900"}`}>
                Settings & Security
              </h1>
            </div>

            {/* 1. APPEARANCE */}
            <div className={`pt-2 pb-6 border-b ${isDark ? "border-stone-800" : "border-stone-200/80"} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
              <h2 className={`text-sm font-semibold tracking-tight ${isDark ? "text-stone-100" : "text-stone-900"}`}>
                Appearance
              </h2>

              <div className={`inline-flex items-center p-1 rounded-xl border ${
                isDark ? "bg-stone-900 border-stone-800" : "bg-stone-100/80 border-stone-200/70"
              }`}>
                <button
                  type="button"
                  onClick={() => handleToggleTheme("light")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    !isDark
                      ? "bg-white text-stone-900 shadow-2xs font-semibold"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleTheme("dark")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    isDark
                      ? "bg-stone-800 text-stone-100 shadow-2xs font-semibold"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dark</span>
                </button>
              </div>
            </div>

            {/* 2. TWO-FACTOR AUTHENTICATION */}
            <div className={`pt-2 pb-6 border-b ${isDark ? "border-stone-800" : "border-stone-200/80"} space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className={`text-sm font-semibold tracking-tight ${isDark ? "text-stone-100" : "text-stone-900"}`}>
                    Two-Factor Authentication
                  </h2>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                    twoFactorEnabled
                      ? isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : isDark ? "bg-stone-800 text-stone-400 border border-stone-700" : "bg-stone-100 text-stone-600 border border-stone-200"
                  }`}>
                    {twoFactorEnabled ? "Active" : isSettingUp2FA ? "Setup In Progress" : "Disabled"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isSettingUp2FA && !twoFactorEnabled && (
                    <button
                      type="button"
                      onClick={() => setIsSettingUp2FA(false)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                        isDark ? "text-stone-400 hover:text-white" : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      Cancel Setup
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggle2FA(!twoFactorEnabled)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer self-start sm:self-auto ${
                      twoFactorEnabled
                        ? isDark
                          ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                          : "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                        : isDark
                          ? "bg-white text-stone-900 hover:bg-stone-200"
                          : "bg-stone-900 text-white hover:bg-stone-800"
                    }`}
                  >
                    {twoFactorEnabled ? "Disable 2FA" : isSettingUp2FA ? "Regenerate QR" : "Enable 2FA"}
                  </button>
                </div>
              </div>

              {/* Setup Mode: Scan QR Code & Enter 6-digit confirmation */}
              {isSettingUp2FA && !twoFactorEnabled && (
                <div className={`p-5 rounded-2xl border ${
                  isDark ? "bg-stone-900/60 border-stone-800" : "bg-stone-50/70 border-stone-200"
                } space-y-5 mt-4`}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className={`text-xs font-semibold ${isDark ? "text-stone-200" : "text-stone-800"}`}>
                      Step 1: Scan QR Code with Google Authenticator, Microsoft Authenticator or Apple Keychain
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Left: Real QR Code */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {twoFactorQrCode ? (
                        <div className="w-36 h-36 rounded-2xl bg-white p-2 border border-stone-200 shadow-sm flex items-center justify-center shrink-0">
                          <img
                            src={twoFactorQrCode}
                            alt="Scan 2FA QR Code"
                            className="w-full h-full object-contain rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="w-36 h-36 rounded-2xl bg-stone-200 animate-pulse flex items-center justify-center text-xs text-stone-500">
                          Generating QR...
                        </div>
                      )}

                      <div className="space-y-2 text-center sm:text-left">
                        <label className={`text-xs font-medium block ${isDark ? "text-stone-300" : "text-stone-700"}`}>
                          Manual Entry Secret Key:
                        </label>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <code className={`px-2 py-1 rounded-lg font-mono text-xs font-semibold ${
                            isDark ? "bg-stone-800 text-stone-200" : "bg-stone-200/70 text-stone-800"
                          }`}>
                            {twoFactorSecret || "Generating..."}
                          </code>
                          {twoFactorSecret && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(twoFactorSecret);
                                setCopiedKey(true);
                                showToast("Secret key copied");
                                setTimeout(() => setCopiedKey(false), 2000);
                              }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isDark ? "hover:bg-stone-800 text-stone-400 hover:text-white" : "hover:bg-stone-200 text-stone-500 hover:text-stone-900"
                              }`}
                              title="Copy Secret Key"
                            >
                              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400">
                          Works with Google Authenticator, Microsoft Authenticator, 1Password & Apple Passwords.
                        </p>
                      </div>
                    </div>

                    {/* Right: Confirmation input */}
                    <form onSubmit={handleConfirm2FAActivation} className="space-y-3">
                      <label className={`text-xs font-medium block ${isDark ? "text-stone-300" : "text-stone-700"}`}>
                        Step 2: Enter the 6-digit code shown in your phone app
                      </label>
                      <input
                        type="text"
                        value={twoFactorVerifyInput}
                        onChange={(e) => setTwoFactorVerifyInput(e.target.value)}
                        placeholder="e.g. 582910"
                        maxLength={6}
                        required
                        className={`w-full px-4 py-2.5 rounded-xl font-mono text-center tracking-widest text-base ${
                          isDark
                            ? "bg-stone-800/80 border-stone-700 text-white placeholder:text-stone-500"
                            : "bg-white border-stone-300 text-stone-900 placeholder:text-stone-400"
                        } border focus:outline-none`}
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Activate 2FA</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Active State View: Already enabled */}
              {twoFactorEnabled && (
                <div className={`p-5 rounded-2xl border ${
                  isDark ? "bg-stone-900/60 border-stone-800" : "bg-stone-50/70 border-stone-200"
                } space-y-5 mt-4`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Pairing Info */}
                    <div className="flex items-center gap-4">
                      {twoFactorQrCode ? (
                        <div className="w-20 h-20 rounded-xl bg-white p-1.5 border border-stone-200 shadow-sm flex items-center justify-center shrink-0">
                          <img
                            src={twoFactorQrCode}
                            alt="2FA QR Code"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                          <ShieldCheck className="w-8 h-8" />
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <label className={`text-xs font-medium block ${isDark ? "text-stone-300" : "text-stone-700"}`}>
                          Active Secret Key
                        </label>
                        <div className="flex items-center gap-2">
                          <code className={`px-2 py-1 rounded-lg font-mono text-xs font-semibold ${
                            isDark ? "bg-stone-800 text-stone-200" : "bg-stone-200/70 text-stone-800"
                          }`}>
                            {twoFactorSecret || "Configured"}
                          </code>
                          {twoFactorSecret && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(twoFactorSecret);
                                setCopiedKey(true);
                                showToast("Secret key copied");
                                setTimeout(() => setCopiedKey(false), 2000);
                              }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isDark ? "hover:bg-stone-800 text-stone-400 hover:text-white" : "hover:bg-stone-200 text-stone-500 hover:text-stone-900"
                              }`}
                              title="Copy Secret Key"
                            >
                              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> Authenticator protection is armed
                        </p>
                      </div>
                    </div>

                    {/* Right: Emergency Backup Codes */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className={`text-xs font-medium ${isDark ? "text-stone-300" : "text-stone-700"}`}>
                          Recovery Codes
                        </label>
                        <button
                          type="button"
                          onClick={handleRegenerateBackupCodes}
                          className={`text-[11px] font-medium flex items-center gap-1 cursor-pointer ${
                            isDark ? "text-stone-400 hover:text-white" : "text-stone-500 hover:text-stone-900"
                          }`}
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Regenerate</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        {backupCodes.map((code, idx) => (
                          <div
                            key={idx}
                            className={`py-1 px-2 rounded-lg text-center font-mono text-[11px] font-medium border ${
                              isDark ? "bg-stone-900 border-stone-800 text-stone-300" : "bg-white border-stone-200 text-stone-800"
                            }`}
                          >
                            {code}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(backupCodes.join("\n"));
                            setCopiedCodes(true);
                            showToast("Backup codes copied");
                            setTimeout(() => setCopiedCodes(false), 2000);
                          }}
                          className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                            isDark ? "bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-700" : "bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200"
                          }`}
                        >
                          {copiedCodes ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCodes ? "Copied" : "Copy Codes"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadBackupCodes}
                          className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                            isDark ? "bg-white text-stone-900 hover:bg-stone-200" : "bg-stone-900 text-white hover:bg-stone-800"
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download .txt</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. ADMIN CREDENTIALS */}
            <div className={`pt-2 pb-6 border-b ${isDark ? "border-stone-800" : "border-stone-200/80"} space-y-6`}>
              <h2 className={`text-sm font-semibold tracking-tight ${isDark ? "text-stone-100" : "text-stone-900"}`}>
                Admin Credentials
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Email Form */}
                <form onSubmit={handleUpdateEmail} className="space-y-3">
                  <label className={`block text-xs font-medium ${isDark ? "text-stone-300" : "text-stone-700"}`}>
                    Admin Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      placeholder="admin@designnayan.com"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs transition-all border ${
                        isDark
                          ? "bg-stone-900 border-stone-800 text-white placeholder:text-stone-500 focus:border-stone-600 focus:outline-none"
                          : "bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                      }`}
                    />
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  </div>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isDark ? "bg-white text-stone-900 hover:bg-stone-200" : "bg-stone-900 text-white hover:bg-stone-800"
                    }`}
                  >
                    Save Email
                  </button>
                </form>

                {/* Passcode Form */}
                <form onSubmit={handleUpdatePasscode} className="space-y-3">
                  <label className={`block text-xs font-medium ${isDark ? "text-stone-300" : "text-stone-700"}`}>
                    Admin Passcode
                  </label>

                  {passcodeError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{passcodeError}</span>
                    </div>
                  )}

                  {passcodeSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{passcodeSuccess}</span>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type={showCurrentPasscode ? "text" : "password"}
                      value={currentPasscodeInput}
                      onChange={(e) => setCurrentPasscodeInput(e.target.value)}
                      required
                      placeholder="Current passcode"
                      className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-xs transition-all border ${
                        isDark
                          ? "bg-stone-900 border-stone-800 text-white placeholder:text-stone-500 focus:border-stone-600 focus:outline-none"
                          : "bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                      }`}
                    />
                    <Key className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPasscode(!showCurrentPasscode)}
                      className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type={showNewPasscode ? "text" : "password"}
                      value={newPasscodeInput}
                      onChange={(e) => setNewPasscodeInput(e.target.value)}
                      required
                      minLength={6}
                      placeholder="New passcode"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs transition-all border ${
                        isDark
                          ? "bg-stone-900 border-stone-800 text-white placeholder:text-stone-500 focus:border-stone-600 focus:outline-none"
                          : "bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                      }`}
                    />
                    <input
                      type={showNewPasscode ? "text" : "password"}
                      value={confirmPasscodeInput}
                      onChange={(e) => setConfirmPasscodeInput(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Confirm passcode"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs transition-all border ${
                        isDark
                          ? "bg-stone-900 border-stone-800 text-white placeholder:text-stone-500 focus:border-stone-600 focus:outline-none"
                          : "bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isDark ? "bg-white text-stone-900 hover:bg-stone-200" : "bg-stone-900 text-white hover:bg-stone-800"
                    }`}
                  >
                    Update Passcode
                  </button>
                </form>
              </div>
            </div>

            {/* 4. SYSTEM PREFERENCES */}
            <div className={`pt-2 pb-6 border-b ${isDark ? "border-stone-800" : "border-stone-200/80"} space-y-4`}>
              <h2 className={`text-sm font-semibold tracking-tight ${isDark ? "text-stone-100" : "text-stone-900"}`}>
                System Preferences
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-medium ${isDark ? "text-stone-300" : "text-stone-700"}`}>
                    Auto-Logout Timeout
                  </label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSessionTimeout(val);
                      try {
                        localStorage.setItem("dn_admin_session_timeout", val);
                      } catch {}
                      showToast(`Inactivity timeout set to: ${val}`);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs border cursor-pointer ${
                      isDark ? "bg-stone-900 border-stone-800 text-stone-200 focus:outline-none" : "bg-white border-stone-200 text-stone-900 focus:outline-none"
                    }`}
                  >
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes</option>
                    <option value="2h">2 Hours</option>
                    <option value="12h">12 Hours</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-medium ${isDark ? "text-stone-300" : "text-stone-700"}`}>
                    Inquiry Sound Alert
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !soundAlertEnabled;
                      setSoundAlertEnabled(next);
                      try {
                        localStorage.setItem("dn_admin_sound_alert", next ? "true" : "false");
                      } catch {}
                      if (next) {
                        playInquiryChime();
                      }
                      showToast(next ? "Sound alerts enabled (preview chime played)" : "Sound alerts muted");
                    }}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                      soundAlertEnabled
                        ? isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : isDark ? "bg-stone-900 border-stone-800 text-stone-400" : "bg-white border-stone-200 text-stone-600"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {soundAlertEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span>{soundAlertEnabled ? "Sound ON" : "Sound Muted"}</span>
                    </span>
                    <span className="text-[10px] font-semibold">{soundAlertEnabled ? "Active" : "Off"}</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-medium ${isDark ? "text-stone-300" : "text-stone-700"}`}>
                    Desktop Push Alerts
                  </label>
                  <button
                    type="button"
                    onClick={handleTogglePushNotifications}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                      pushNotificationEnabled
                        ? isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : isDark ? "bg-stone-900 border-stone-800 text-stone-400" : "bg-white border-stone-200 text-stone-600"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5" />
                      <span>{pushNotificationEnabled ? "Push ON" : "Push OFF"}</span>
                    </span>
                    <span className="text-[10px] font-semibold">{pushNotificationEnabled ? "Active" : "Off"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 5. DATABASE BACKUP & RESTORE */}
            <div className={`pt-2 pb-6 border-b ${isDark ? "border-stone-800" : "border-stone-200/80"} space-y-4`}>
              <h2 className={`text-sm font-semibold tracking-tight ${isDark ? "text-stone-100" : "text-stone-900"}`}>
                Database Backup & Restore
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleFullBackupDownload}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                    isDark ? "bg-white text-stone-900 hover:bg-stone-200" : "bg-stone-900 text-white hover:bg-stone-800"
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup (.json)</span>
                </button>

                <label className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${
                  isDark ? "bg-stone-900 border-stone-800 text-stone-200 hover:bg-stone-800" : "bg-white border-stone-200 text-stone-800 hover:bg-stone-50"
                }`}>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload & Restore (.json)</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleRestoreFileSelect(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>

            {/* 6. SESSION & SIGN OUT */}
            <div className="pt-2 pb-6 space-y-4">
              <h2 className={`text-sm font-semibold tracking-tight ${isDark ? "text-stone-100" : "text-stone-900"}`}>
                Session & Account
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs">
                  <span className={`inline-flex items-center gap-1.5 ${isDark ? "text-stone-400" : "text-stone-600"}`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Logged in as <strong>{adminEmail}</strong></span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto ${
                    isDark
                      ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30"
                      : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200"
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MINI POPUP MODAL: TRANSACTION DETAILS                     */}
      {/* ========================================================= */}
      {viewingIncomeDetail && (
        <div 
          className="fixed inset-0 z-[160] bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setViewingIncomeDetail(null)}
        >
          <div 
            className="bg-white border border-stone-200/80 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-6 shadow-2xl my-8 text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {viewingIncomeDetail.category}
                </span>
                <span className="text-xs text-stone-400 font-normal">{viewingIncomeDetail.date}</span>
              </div>
              <button
                onClick={() => setViewingIncomeDetail(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client Info Header */}
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-stone-900">{viewingIncomeDetail.clientName}</h2>
              <div className="text-xs text-stone-500 font-normal flex flex-wrap items-center gap-x-4">
                <span>Payment Mode: <strong className="text-stone-800 font-medium">{viewingIncomeDetail.paymentMethod}</strong></span>
                {viewingIncomeDetail.clientPhone && <span>Phone: {viewingIncomeDetail.clientPhone}</span>}
              </div>
            </div>

            {/* Financial Health Mini Card */}
            <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/60 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider block">
                    Received Amount
                  </span>
                  <span className="text-2xl font-semibold text-stone-900 tracking-tight">
                    {formatINR(viewingIncomeDetail.amount)}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
                    Actual Income in Bank
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider block">
                    Pending Balance
                  </span>
                  <span className={`text-2xl font-semibold tracking-tight ${(viewingIncomeDetail.pendingAmount || 0) > 0 ? "text-rose-600" : "text-stone-400"}`}>
                    {formatINR(viewingIncomeDetail.pendingAmount || 0)}
                  </span>
                  <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                    {(viewingIncomeDetail.pendingAmount || 0) > 0 ? "Awaiting Collection" : "Fully Cleared"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-normal text-stone-700">
                <span>Total Project Contract Value</span>
                <span className="text-stone-900 font-semibold">{formatINR(viewingIncomeDetail.totalAmount || viewingIncomeDetail.amount)}</span>
              </div>

              {viewingIncomeDetail.dueDate && (viewingIncomeDetail.pendingAmount || 0) > 0 && (
                <div className="pt-2 border-t border-stone-200/60 text-xs text-rose-700 flex items-center justify-between font-medium">
                  <span>Balance Due Date:</span>
                  <span className="font-semibold">{viewingIncomeDetail.dueDate}</span>
                </div>
              )}
            </div>

            {/* Project Scope Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider">Project Scope & Notes</h3>
              <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/50 p-3.5 rounded-2xl border border-stone-200/60 font-normal">
                {viewingIncomeDetail.projectDetails || "No additional project notes logged."}
              </p>
            </div>

            {/* Action Buttons inside Mini Page */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-2">
                {viewingIncomeDetail.clientPhone && (
                  <a
                    href={`https://wa.me/${viewingIncomeDetail.clientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hi ${viewingIncomeDetail.clientName}! Regarding your project with Design Nayan (${viewingIncomeDetail.category}): We have recorded payment of ${formatINR(viewingIncomeDetail.amount)}.${
                        (viewingIncomeDetail.pendingAmount || 0) > 0
                          ? ` The pending balance is ${formatINR(viewingIncomeDetail.pendingAmount)}.`
                          : " Thank you for the complete payment!"
                      }`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Client</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingIncome(viewingIncomeDetail);
                    setIncomeModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteIncome(viewingIncomeDetail)}
                  className="px-4 py-2 rounded-full hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: LOG / EDIT INCOME (With Pending Calculation)       */}
      {/* ========================================================= */}
      {incomeModalOpen && (
        <div className="fixed inset-0 z-[170] bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200/80 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-stone-900">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h2 className="text-base font-semibold text-stone-900 tracking-tight">
                  {editingIncome ? "Edit Transaction" : "Log New Transaction"}
                </h2>
                <p className="text-xs text-stone-400 font-normal">Stored privately in owner database</p>
              </div>
              <button
                onClick={() => {
                  setIncomeModalOpen(false);
                  setEditingIncome(null);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIncome} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Received Amount */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Received Amount (in ₹) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="0"
                    step="any"
                    defaultValue={editingIncome?.amount ?? ""}
                    placeholder="e.g. 100000"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-semibold"
                  />
                  <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
                    Counts toward total collected income
                  </span>
                </div>

                {/* Total Contract / Deal Value */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Total Contract Value (₹) *
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    required
                    min="0"
                    step="any"
                    defaultValue={editingIncome?.totalAmount ?? editingIncome?.amount ?? ""}
                    placeholder="e.g. 150000"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-semibold"
                  />
                  <span className="text-[10px] text-stone-400 font-normal block mt-0.5">
                    Difference calculates pending balance
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    defaultValue={editingIncome?.category || INCOME_CATEGORIES[0]}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-medium cursor-pointer"
                  >
                    {INCOME_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    required
                    defaultValue={editingIncome?.clientName || ""}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Client Phone (Optional)
                  </label>
                  <input
                    type="text"
                    name="clientPhone"
                    defaultValue={editingIncome?.clientPhone || ""}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={editingIncome?.date || new Date().toISOString().split("T")[0]}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    name="paymentMethod"
                    defaultValue={editingIncome?.paymentMethod || "Bank Transfer"}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="Bank Transfer">Bank Transfer (NEFT / RTGS)</option>
                    <option value="UPI / QR">UPI (GPay, PhonePe, Paytm)</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Balance Due Date (If Pending)
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={editingIncome?.dueDate || ""}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Project Scope / Deliverables
                </label>
                <textarea
                  name="projectDetails"
                  rows={2}
                  defaultValue={editingIncome?.projectDetails || ""}
                  placeholder="e.g. Milestone 1 received, final elevation delivery pending..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIncomeModalOpen(false);
                    setEditingIncome(null);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                >
                  {editingIncome ? "Save Changes" : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PORTFOLIO PROJECT                       */}
      {/* ========================================================= */}
      {projectModalOpen && (
        <div 
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => {
            setProjectModalOpen(false);
            setEditingProject(null);
          }}
        >
          <div 
            className="relative bg-white rounded-3xl border border-stone-200/80 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col my-auto text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 p-5 sm:p-6 pb-3.5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-stone-900 tracking-tight">
                {editingProject ? "Edit Portfolio Project" : "Add Portfolio Project"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setProjectModalOpen(false);
                  setEditingProject(null);
                }}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingProject?.title || ""}
                      placeholder="e.g. Modern Villa, Brand Identity System"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Service Category *
                    </label>
                    <select
                      name="categoryTag"
                      defaultValue={
                        editingProject?.categoryTag === "BRANDING & CREATIVITY" || editingProject?.categoryTag === "BRANDING"
                          ? "BRANDING & CREATIVITY"
                          : editingProject?.categoryTag === "DIGITAL & MARKETING" || editingProject?.categoryTag === "DEVELOPMENT"
                          ? "DIGITAL & MARKETING"
                          : editingProject?.categoryTag === "BUILD & CONSTRUCTIONS" || editingProject?.categoryTag === "CONSTRUCTION" || editingProject?.categoryTag === "COMMERCIAL"
                          ? "BUILD & CONSTRUCTIONS"
                          : editingProject?.categoryTag === "CREATORS"
                          ? "CREATORS"
                          : "DESIGN & ARCHITECTURE"
                      }
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-medium cursor-pointer"
                    >
                      <option value="DESIGN & ARCHITECTURE">DESIGN & ARCHITECTURE</option>
                      <option value="BRANDING & CREATIVITY">BRANDING & CREATIVITY</option>
                      <option value="DIGITAL & MARKETING">DIGITAL & MARKETING</option>
                      <option value="BUILD & CONSTRUCTIONS">BUILD & CONSTRUCTIONS</option>
                      <option value="CREATORS">CREATORS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Location / Domain *
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      defaultValue={editingProject?.location || ""}
                      placeholder="e.g. Guwahati, Assam or Pan-India / Remote"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Year Completed
                    </label>
                    <input
                      type="text"
                      name="year"
                      defaultValue={editingProject?.year || "2024"}
                      placeholder="e.g. 2024"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Scale / Area / Deliverable
                    </label>
                    <input
                      type="text"
                      name="area"
                      defaultValue={editingProject?.area || "3,500 sq.ft"}
                      placeholder="e.g. 3,500 sq.ft or Complete Identity"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Client / Organization Name
                    </label>
                    <input
                      type="text"
                      name="client"
                      defaultValue={editingProject?.client || ""}
                      placeholder="e.g. Private Client, Tech Startup, Commercial Developer"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                      <span>Cover Photo *</span>
                      <span className="text-[11px] font-normal text-stone-400">Featured hero showcase</span>
                    </label>

                    {projectCoverPhoto ? (
                      <div className="relative rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-50 group shadow-2xs">
                        <div className="relative h-48 w-full bg-stone-100">
                          <img
                            src={projectCoverPhoto}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <label className="px-3.5 py-1.5 rounded-full bg-white text-stone-900 text-xs font-semibold shadow-md hover:bg-stone-100 cursor-pointer transition-all flex items-center gap-1.5">
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Replace Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverPhotoUpload}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => setProjectCoverPhoto("")}
                              className="px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-semibold shadow-md hover:bg-rose-700 cursor-pointer transition-all flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                        <div className="p-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Photo selected from device</span>
                          </span>
                          <label className="text-stone-600 hover:text-stone-900 font-medium cursor-pointer underline">
                            Change photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleCoverPhotoUpload}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleCoverPhotoDrop}
                        className="border-2 border-dashed border-stone-300 hover:border-stone-400 bg-stone-50/60 hover:bg-stone-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverPhotoUpload}
                        />
                        <div className="w-11 h-11 rounded-full bg-white shadow-2xs border border-stone-200/80 flex items-center justify-center text-stone-500 group-hover:scale-105 transition-transform mb-2">
                          <UploadCloud className="w-5 h-5 text-stone-700" />
                        </div>
                        <div className="text-xs font-semibold text-stone-900">
                          Click to upload cover photo or drag & drop
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          Upload JPG, PNG, or WEBP from your local storage
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Project Overview / Narrative
                  </label>
                  <textarea
                    name="overview"
                    rows={3}
                    defaultValue={editingProject?.overview || ""}
                    placeholder="Comprehensive description of the client's brief, design ethos, engineering solutions, and deliverables..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Key Highlights & Features (One per line)
                  </label>
                  <textarea
                    name="highlights"
                    rows={3}
                    defaultValue={editingProject?.highlights?.join("\n") || ""}
                    placeholder="Structural reinforced concrete framing&#10;Italian marble floor tiling&#10;Integrated smart lighting automation"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-stone-700">
                      Project Gallery Photos
                    </label>
                    <span className="text-[11px] text-stone-400 font-medium">
                      {projectGalleryPhotos.length} {projectGalleryPhotos.length === 1 ? "photo" : "photos"} selected
                    </span>
                  </div>

                  {projectGalleryPhotos.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mb-3">
                      {projectGalleryPhotos.map((img, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-200/80 bg-stone-100 group shadow-2xs">
                          <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryPhoto(idx)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-stone-900/80 text-white hover:bg-rose-600 transition-colors cursor-pointer shadow-xs"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1.5 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-stone-900/70 text-white backdrop-blur-xs">
                            #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleGalleryPhotosDrop}
                    className="border-2 border-dashed border-stone-300 hover:border-stone-400 bg-stone-50/60 hover:bg-stone-50 rounded-2xl p-4.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryPhotosUpload}
                    />
                    <div className="w-9 h-9 rounded-full bg-white shadow-2xs border border-stone-200/80 flex items-center justify-center text-stone-500 group-hover:scale-105 transition-transform mb-1.5">
                      <ImageIcon className="w-4 h-4 text-stone-700" />
                    </div>
                    <div className="text-xs font-semibold text-stone-900">
                      {projectGalleryPhotos.length > 0 ? "Add More Gallery Photos" : "Upload Gallery Photos from device"}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      Select multiple images from your local drive or drag & drop
                    </div>
                  </label>
                </div>
              </div>

              <div className="shrink-0 p-4 sm:p-6 pt-3.5 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => {
                    setProjectModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                >
                  {editingProject ? "Save Changes" : "Publish Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: IN-ADMIN PORTFOLIO DETAIL PREVIEW                  */}
      {/* ========================================================= */}
      {viewingProjectDetail && (
        <div
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setViewingProjectDetail(null)}
        >
          <div
            className="relative bg-white rounded-3xl border border-stone-200/80 shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col my-auto text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pinned Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-3.5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-900 text-white uppercase tracking-wider">
                  {viewingProjectDetail.categoryTag}
                </span>
                <span className="text-xs text-stone-500 font-normal flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{viewingProjectDetail.location}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingProjectDetail(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Cover Image */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-2xs">
                <img
                  src={viewingProjectDetail.image}
                  alt={viewingProjectDetail.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Slug Info */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  {viewingProjectDetail.title}
                </h2>
                <div className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                  <span>URL Path:</span>
                  <code className="text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-mono">
                    /portfolio/{viewingProjectDetail.slug}
                  </code>
                </div>
              </div>

              {/* Specs Pill Grid */}
              <div className="grid grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 text-center">
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider">Area / Scale</div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-900 mt-1 font-mono">{viewingProjectDetail.area || "—"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider">Year Completed</div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-900 mt-1 font-mono">{viewingProjectDetail.year || "—"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider">Client Type</div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-900 mt-1 truncate">{viewingProjectDetail.client || "—"}</div>
                </div>
              </div>

              {/* Overview / Narrative */}
              {viewingProjectDetail.overview && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                    About This Project
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50/50 p-4 rounded-2xl border border-stone-200/60 font-normal">
                    {viewingProjectDetail.overview}
                  </p>
                </div>
              )}

              {/* Key Highlights */}
              {viewingProjectDetail.highlights && viewingProjectDetail.highlights.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Key Highlights & Scope
                  </h3>
                  <div className="space-y-2.5 bg-stone-50/50 p-4 rounded-2xl border border-stone-200/60">
                    {viewingProjectDetail.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 font-normal">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Grid */}
              {viewingProjectDetail.gallery && viewingProjectDetail.gallery.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Project Gallery ({viewingProjectDetail.gallery.length} Images)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {viewingProjectDetail.gallery.map((img, idx) => (
                      <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden border border-stone-200/80 bg-stone-100 shadow-2xs">
                        <img
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pinned Footer */}
            <div className="shrink-0 p-4 sm:p-6 pt-3.5 border-t border-stone-100 flex items-center justify-between bg-stone-50/50 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setViewingProjectDetail(null)}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const p = viewingProjectDetail;
                    setViewingProjectDetail(null);
                    setEditingProject(p);
                    setProjectModalOpen(true);
                  }}
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                >
                  Edit Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STUDIO SERVICE MODAL (ADD / EDIT)                         */}
      {/* ========================================================= */}
      {studioModalOpen && (
        <div 
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => {
            setStudioModalOpen(false);
            setEditingStudioService(null);
          }}
        >
          <div 
            className="relative bg-white rounded-3xl border border-stone-200/80 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col my-auto text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 p-5 sm:p-6 pb-3.5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-stone-900 tracking-tight">
                {editingStudioService ? "Edit Studio Service" : "Add Studio Service"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setStudioModalOpen(false);
                  setEditingStudioService(null);
                }}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudioService} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingStudioService?.title || ""}
                      placeholder="e.g. Architectural Planning & 3D BIM"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Category Pillar *
                    </label>
                    <select
                      name="category"
                      value={studioModalCategory}
                      onChange={(e) => {
                        const newCat = e.target.value as "DESIGN & ARCHITECTURE" | "BRANDING & CREATIVE" | "DIGITAL & MARKETING";
                        setStudioModalCategory(newCat);
                        if (!editingStudioService) {
                          setStudioPriceGuide(STUDIO_CATEGORY_CONFIGS[newCat].defaultPrice);
                          setStudioIconName(STUDIO_CATEGORY_CONFIGS[newCat].defaultIcon);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-medium cursor-pointer"
                    >
                      <option value="DESIGN & ARCHITECTURE">DESIGN & ARCHITECTURE</option>
                      <option value="BRANDING & CREATIVE">BRANDING & CREATIVE</option>
                      <option value="DIGITAL & MARKETING">DIGITAL & MARKETING</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Badge / Tagline
                    </label>
                    <input
                      type="text"
                      name="badge"
                      defaultValue={editingStudioService?.badge || "STUDIO SPECIAL"}
                      placeholder="e.g. ARCHITECTURE & PLANNING"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-stone-700">
                        Price Guide *
                      </label>
                      <span className="text-[11px] text-stone-400 font-normal">
                        Format: {STUDIO_CATEGORY_CONFIGS[studioModalCategory].formatHint}
                      </span>
                    </div>
                    <input
                      type="text"
                      name="priceGuide"
                      required
                      value={studioPriceGuide}
                      onChange={(e) => setStudioPriceGuide(e.target.value)}
                      placeholder={STUDIO_CATEGORY_CONFIGS[studioModalCategory].placeholder}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-medium"
                    />
                    {/* Quick clickable format pills for easy owner customization */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                      <span className="text-[10px] text-stone-400 shrink-0 uppercase tracking-wider font-semibold">
                        Quick Formats:
                      </span>
                      {STUDIO_CATEGORY_CONFIGS[studioModalCategory].pricePresets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setStudioPriceGuide(preset)}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] shrink-0 border transition-all cursor-pointer ${
                            studioPriceGuide === preset
                              ? "bg-stone-900 text-white border-stone-900 font-semibold shadow-2xs"
                              : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200/80"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Turnaround / Timeline *
                    </label>
                    <input
                      type="text"
                      name="turnaround"
                      required
                      defaultValue={editingStudioService?.turnaround || "2 - 3 Weeks"}
                      placeholder="e.g. 2 - 3 Weeks"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Suggested Icon *
                    </label>
                    <select
                      name="iconName"
                      value={studioIconName}
                      onChange={(e) => setStudioIconName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-medium cursor-pointer"
                    >
                      {STUDIO_CATEGORY_CONFIGS[studioModalCategory].icons.map((ic) => (
                        <option key={ic.name} value={ic.name}>
                          {ic.label}
                        </option>
                      ))}
                      {!STUDIO_CATEGORY_CONFIGS[studioModalCategory].icons.some((i) => i.name === studioIconName) && (
                        <option value={studioIconName}>
                          {studioIconName} (Current)
                        </option>
                      )}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="popular"
                        defaultChecked={editingStudioService?.popular || false}
                        className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-0"
                      />
                      <span>Highlight as Popular</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    required
                    defaultValue={editingStudioService?.description || ""}
                    placeholder="Comprehensive description of the service and studio capability..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Deliverables (One per line)
                  </label>
                  <textarea
                    name="deliverables"
                    rows={3}
                    defaultValue={editingStudioService?.deliverables?.join("\n") || ""}
                    placeholder="Conceptual Master Plans & Zoning&#10;Photorealistic 3D Visuals & Fly-through&#10;Municipal Approval Drawings"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-stone-700">
                      Specifications (Key & Value pairs)
                    </label>
                    <span className="text-[11px] text-stone-400 font-normal">
                      Leave empty if not required
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="specLabel"
                      defaultValue={editingStudioService?.specs?.[0]?.label || ""}
                      placeholder="e.g. Scope / Software / Tech Stack"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      name="specValue"
                      defaultValue={editingStudioService?.specs?.[0]?.value || ""}
                      placeholder="e.g. 4K UHD / AutoCAD / Next.js & React"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="specLabel"
                      defaultValue={editingStudioService?.specs?.[1]?.label || ""}
                      placeholder="e.g. Formats / Compliance / Deliverables"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      name="specValue"
                      defaultValue={editingStudioService?.specs?.[1]?.value || ""}
                      placeholder="e.g. PDF, CAD (DWG) / GMC / Master Brand Kit"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="specLabel"
                      defaultValue={editingStudioService?.specs?.[2]?.label || ""}
                      placeholder="e.g. Turnaround / Cadence / Speed"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      name="specValue"
                      defaultValue={editingStudioService?.specs?.[2]?.value || ""}
                      placeholder="e.g. 48 - 72 Hours / 3-4 Posts per Week"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="shrink-0 p-4 sm:p-6 pt-3 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => {
                    setStudioModalOpen(false);
                    setEditingStudioService(null);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                >
                  {editingStudioService ? "Save Service" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BUILD & CIVIL SERVICE MODAL (ADD / EDIT)                 */}
      {/* ========================================================= */}
      {buildModalOpen && (
        <div 
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => {
            setBuildModalOpen(false);
            setEditingBuildService(null);
          }}
        >
          <div 
            className="relative bg-white rounded-3xl border border-stone-200/80 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col my-auto text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 p-5 sm:p-6 pb-3.5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-stone-900 tracking-tight">
                {editingBuildService ? "Edit Build Package" : "Add Build Package"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setBuildModalOpen(false);
                  setEditingBuildService(null);
                }}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBuildService} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Service / Package Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingBuildService?.title || ""}
                      placeholder="e.g. Turnkey RCC Construction"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Badge / Tagline
                    </label>
                    <input
                      type="text"
                      name="badge"
                      defaultValue={editingBuildService?.badge || "CIVIL EXECUTION"}
                      placeholder="e.g. FOUNDATION TO FINISH"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Price Guide *
                    </label>
                    <input
                      type="text"
                      name="priceGuide"
                      required
                      defaultValue={editingBuildService?.priceGuide || "₹1,850 - ₹2,400 / sq.ft"}
                      placeholder="e.g. ₹1,850 / sq.ft"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Timeline / Turnaround *
                    </label>
                    <input
                      type="text"
                      name="turnaround"
                      required
                      defaultValue={editingBuildService?.turnaround || "6 - 12 Months"}
                      placeholder="e.g. 6 - 12 Months"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Suggested Icon *
                    </label>
                    <select
                      name="iconName"
                      value={buildIconName}
                      onChange={(e) => setBuildIconName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-medium cursor-pointer"
                    >
                      {BUILD_ICON_OPTIONS.map((ic) => (
                        <option key={ic.name} value={ic.name}>
                          {ic.label}
                        </option>
                      ))}
                      {!BUILD_ICON_OPTIONS.some((i) => i.name === buildIconName) && (
                        <option value={buildIconName}>
                          {buildIconName} (Current)
                        </option>
                      )}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="popular"
                        defaultChecked={editingBuildService?.popular || false}
                        className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-0"
                      />
                      <span>Highlight as Popular</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    required
                    defaultValue={editingBuildService?.description || ""}
                    placeholder="Detailed scope and engineering specifications..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Scope Deliverables (One per line)
                  </label>
                  <textarea
                    name="deliverables"
                    rows={3}
                    defaultValue={editingBuildService?.deliverables?.join("\n") || ""}
                    placeholder="Earthwork excavation & PCC raft foundation&#10;Fe550D TMT Reinforcement & M25 Ready-Mix Concrete&#10;Brick masonry & double-coat exterior plaster"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-stone-700">
                      Specifications (Key & Value pairs)
                    </label>
                    <span className="text-[10px] text-stone-400">Optional · Technical Standards</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="specLabel"
                      defaultValue={editingBuildService?.specs?.[0]?.label || ""}
                      placeholder="Label: e.g. Compliance, Grade"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none placeholder:text-stone-400"
                    />
                    <input
                      type="text"
                      name="specValue"
                      defaultValue={editingBuildService?.specs?.[0]?.value || ""}
                      placeholder="Value: e.g. IS 456 / Zone V Seismic"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none placeholder:text-stone-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="specLabel"
                      defaultValue={editingBuildService?.specs?.[1]?.label || ""}
                      placeholder="Label: e.g. Materials, Cement Brand"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none placeholder:text-stone-400"
                    />
                    <input
                      type="text"
                      name="specValue"
                      defaultValue={editingBuildService?.specs?.[1]?.value || ""}
                      placeholder="Value: e.g. Tata Tiscon / Ultratech M25"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none placeholder:text-stone-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="specLabel"
                      defaultValue={editingBuildService?.specs?.[2]?.label || ""}
                      placeholder="Label: e.g. Supervision, Warranty"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none placeholder:text-stone-400"
                    />
                    <input
                      type="text"
                      name="specValue"
                      defaultValue={editingBuildService?.specs?.[2]?.value || ""}
                      placeholder="Value: e.g. Site Engineer On-Duty"
                      className="px-3 py-2 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </div>

              <div className="shrink-0 p-4 sm:p-6 pt-3 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => {
                    setBuildModalOpen(false);
                    setEditingBuildService(null);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                >
                  {editingBuildService ? "Save Package" : "Add Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* WHOLESALE MATERIAL MODAL (ADD / EDIT)                     */}
      {/* ========================================================= */}
      {materialModalOpen && (
        <div 
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => {
            setMaterialModalOpen(false);
            setEditingMaterial(null);
          }}
        >
          <div 
            className="relative bg-white rounded-3xl border border-stone-200/80 shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col my-auto text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 p-5 sm:p-6 pb-3.5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-stone-900 tracking-tight">
                {editingMaterial ? "Edit Material Category" : "Add Material Category"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setMaterialModalOpen(false);
                  setEditingMaterial(null);
                }}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    defaultValue={editingMaterial?.category || ""}
                    placeholder="e.g. Structural Steel (TMT)"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Badge / Grade Tag
                  </label>
                  <input
                    type="text"
                    name="badge"
                    defaultValue={editingMaterial?.badge || "FE 550D EARTHQUAKE REBARS"}
                    placeholder="e.g. FE 550D EARTHQUAKE REBARS"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Partner Brands (Comma or line separated) *
                  </label>
                  <input
                    type="text"
                    name="brands"
                    required
                    defaultValue={editingMaterial?.brands?.join(", ") || ""}
                    placeholder="e.g. Tata Tiscon, Jindal Panther, Sail, Kamdhenu"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Material Specification & Scope *
                  </label>
                  <textarea
                    name="desc"
                    rows={3}
                    required
                    defaultValue={editingMaterial?.desc || ""}
                    placeholder="e.g. Fe 500D & 550D high-ductility earthquake-resistant rebars with certified mill test reports."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="shrink-0 p-4 sm:p-6 pt-3 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => {
                    setMaterialModalOpen(false);
                    setEditingMaterial(null);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                >
                  {editingMaterial ? "Save Material" : "Add Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STUDIO SERVICE DETAIL PREVIEW MODAL                       */}
      {/* ========================================================= */}
      {viewingStudioService && (
        <div 
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setViewingStudioService(null)}
        >
          <div 
            className="relative bg-white rounded-3xl border border-stone-200/80 shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col my-auto text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-3 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 uppercase">
                  {viewingStudioService.category}
                </span>
                {viewingStudioService.popular && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                    Popular
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setViewingStudioService(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-stone-900 tracking-tight">
                  {viewingStudioService.title}
                </h2>
                {viewingStudioService.badge && (
                  <div className="text-xs font-medium text-stone-500 mt-0.5">
                    {viewingStudioService.badge}
                  </div>
                )}
              </div>

              {/* Price & Turnaround Box */}
              <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/60 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-stone-400 font-normal uppercase tracking-wider block">Price Guide</span>
                  <span className="text-xl font-semibold text-stone-900 tracking-tight">{viewingStudioService.priceGuide}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 font-normal uppercase tracking-wider block">Turnaround</span>
                  <span className="text-sm font-semibold text-stone-700">{viewingStudioService.turnaround}</span>
                </div>
              </div>

              {/* Scope Description */}
              <div>
                <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1.5">Overview & Scope</h3>
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/50 p-3.5 rounded-2xl border border-stone-200/60 font-normal">
                  {viewingStudioService.description}
                </p>
              </div>

              {/* Full Deliverables */}
              {viewingStudioService.deliverables && viewingStudioService.deliverables.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">Key Deliverables</h3>
                  <div className="space-y-1.5 bg-stone-50/40 p-3.5 rounded-2xl border border-stone-200/60">
                    {viewingStudioService.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {viewingStudioService.specs && viewingStudioService.specs.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">Specifications</h3>
                  <div className="grid grid-cols-2 gap-2 bg-stone-50/40 p-3.5 rounded-2xl border border-stone-200/60">
                    {viewingStudioService.specs.map((s, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="text-[10px] text-stone-400 uppercase">{s.label}</div>
                        <div className="text-stone-800 font-medium">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 p-4 sm:p-6 pt-3 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setViewingStudioService(null)}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = viewingStudioService;
                  setViewingStudioService(null);
                  setEditingStudioService(s);
                  setStudioModalOpen(true);
                }}
                className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
              >
                Edit Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BUILD SERVICE DETAIL PREVIEW MODAL                        */}
      {/* ========================================================= */}
      {viewingBuildService && (
        <div 
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setViewingBuildService(null)}
        >
          <div 
            className="relative bg-white rounded-3xl border border-stone-200/80 shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col my-auto text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-3 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 uppercase">
                  Turnkey Civil Package
                </span>
                {viewingBuildService.popular && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                    Popular
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setViewingBuildService(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-stone-900 tracking-tight">
                  {viewingBuildService.title}
                </h2>
                {viewingBuildService.badge && (
                  <div className="text-xs font-medium text-stone-500 mt-0.5">
                    {viewingBuildService.badge}
                  </div>
                )}
              </div>

              {/* Price & Timeline Box */}
              <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/60 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-stone-400 font-normal uppercase tracking-wider block">Price Guide</span>
                  <span className="text-xl font-semibold text-stone-900 tracking-tight">{viewingBuildService.priceGuide}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 font-normal uppercase tracking-wider block">Timeline</span>
                  <span className="text-sm font-semibold text-stone-700">{viewingBuildService.turnaround}</span>
                </div>
              </div>

              {/* Scope Description */}
              <div>
                <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1.5">Engineering Scope & Specifications</h3>
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/50 p-3.5 rounded-2xl border border-stone-200/60 font-normal">
                  {viewingBuildService.description}
                </p>
              </div>

              {/* Full Scope Deliverables */}
              {viewingBuildService.deliverables && viewingBuildService.deliverables.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">Scope Deliverables</h3>
                  <div className="space-y-1.5 bg-stone-50/40 p-3.5 rounded-2xl border border-stone-200/60">
                    {viewingBuildService.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {viewingBuildService.specs && viewingBuildService.specs.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">Engineering Compliance</h3>
                  <div className="grid grid-cols-2 gap-2 bg-stone-50/40 p-3.5 rounded-2xl border border-stone-200/60">
                    {viewingBuildService.specs.map((s, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="text-[10px] text-stone-400 uppercase">{s.label}</div>
                        <div className="text-stone-800 font-medium">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 p-4 sm:p-6 pt-3 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setViewingBuildService(null)}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = viewingBuildService;
                  setViewingBuildService(null);
                  setEditingBuildService(s);
                  setBuildModalOpen(true);
                }}
                className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
              >
                Edit Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* WHOLESALE MATERIAL DETAIL PREVIEW MODAL                   */}
      {/* ========================================================= */}
      {viewingMaterial && (
        <div 
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setViewingMaterial(null)}
        >
          <div 
            className="relative bg-white rounded-3xl border border-stone-200/80 shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col my-auto text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 uppercase">
                {viewingMaterial.badge}
              </span>
              <button
                type="button"
                onClick={() => setViewingMaterial(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-stone-900 tracking-tight">
                  {viewingMaterial.category}
                </h2>
                <div className="text-xs text-stone-500 mt-1">
                  Direct factory wholesale material sourcing across North East
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1.5">Material Overview</h3>
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/50 p-3.5 rounded-2xl border border-stone-200/60 font-normal">
                  {viewingMaterial.desc}
                </p>
              </div>

              <div>
                <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">Partner Mills & Authorized Brands</h3>
                <div className="flex flex-wrap gap-2 bg-stone-50/40 p-3.5 rounded-2xl border border-stone-200/60">
                  {viewingMaterial.brands.map((brand, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-stone-900 text-white shadow-2xs"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 p-4 sm:p-6 pt-3 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setViewingMaterial(null)}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const m = viewingMaterial;
                  setViewingMaterial(null);
                  setEditingMaterial(m);
                  setMaterialModalOpen(true);
                }}
                className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
              >
                Edit Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CREATOR PROFILE DETAIL PREVIEW MODAL                      */}
      {/* ========================================================= */}
      {viewingCreator && (
        <div 
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setViewingCreator(null)}
        >
          <div 
            className="relative bg-white rounded-3xl border border-stone-200/80 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col my-auto text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-3 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {viewingCreator.category}
                </span>
                {viewingCreator.verified && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-900 text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Roster
                  </span>
                )}
                <span className="text-[10px] font-mono text-stone-400">
                  {viewingCreator.tier}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingCreator(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Profile Card Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 shadow-2xs">
                  <img
                    src={viewingCreator.avatar}
                    alt={viewingCreator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                    {viewingCreator.name}
                  </h2>
                  <div className="text-xs font-mono text-stone-500 font-medium">
                    {viewingCreator.handle}
                  </div>
                  <div className="text-xs text-red-600 font-medium mt-0.5">
                    {viewingCreator.role}
                  </div>
                </div>
              </div>

              {/* Showcase Media: Video or Photo */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
                    Featured Showcase {Boolean(viewingCreator.videoPreviewUrl || isVideoMedia(viewingCreator.featuredImage)) ? "(Video Reel)" : "(Photo Still)"}
                  </h3>
                  <span className="text-[10px] text-stone-400">
                    {viewingCreator.location}
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-200 aspect-video sm:aspect-16/9 flex items-center justify-center">
                  {Boolean(viewingCreator.videoPreviewUrl || isVideoMedia(viewingCreator.featuredImage)) ? (
                    <video
                      src={viewingCreator.videoPreviewUrl || viewingCreator.featuredImage}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={viewingCreator.featuredImage || viewingCreator.avatar}
                      alt={viewingCreator.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* 4 KPIs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="text-[10px] uppercase font-medium text-stone-400">Reach</div>
                  <div className="text-base font-bold text-stone-900 mt-0.5">{viewingCreator.followersCount}</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="text-[10px] uppercase font-medium text-stone-400">Avg Views</div>
                  <div className="text-base font-bold text-stone-900 mt-0.5">{viewingCreator.avgViews}</div>
                </div>
                <div className="p-3 rounded-2xl bg-red-50/60 border border-red-100">
                  <div className="text-[10px] uppercase font-medium text-red-700">Engagement</div>
                  <div className="text-base font-bold text-red-600 mt-0.5">{viewingCreator.engagementRate}%</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="text-[10px] uppercase font-medium text-stone-400">Turnaround</div>
                  <div className="text-base font-bold text-stone-900 mt-0.5">{viewingCreator.turnaroundDays} Days</div>
                </div>
              </div>

              {/* Bio */}
              {viewingCreator.bio && (
                <div>
                  <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1.5">Creative Bio</h3>
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/50 p-3.5 rounded-2xl border border-stone-200/60">
                    {viewingCreator.bio}
                  </p>
                </div>
              )}

              {/* Deliverables & Formats */}
              {viewingCreator.formats && viewingCreator.formats.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">Deliverable Formats</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingCreator.formats.map((fmt, i) => (
                      <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Brands & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {viewingCreator.pastBrands && viewingCreator.pastBrands.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1.5">Brand Collaborations</h3>
                    <div className="flex flex-wrap gap-1">
                      {viewingCreator.pastBrands.map((b, i) => (
                        <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {viewingCreator.tags && viewingCreator.tags.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1.5">Specialties</h3>
                    <div className="flex flex-wrap gap-1">
                      {viewingCreator.tags.map((t, i) => (
                        <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Packages */}
              {viewingCreator.packages && viewingCreator.packages.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">Rate Packages</h3>
                  <div className="space-y-2">
                    {viewingCreator.packages.map((pkg, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-stone-50/60 border border-stone-200/60 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-semibold text-stone-900">{pkg.title}</div>
                          <div className="text-stone-500 text-[11px] mt-0.5">{pkg.deliverables}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-stone-900">{pkg.priceEstimate}</div>
                          <div className="text-[10px] text-stone-400">{pkg.turnaround}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 p-4 sm:p-6 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 bg-stone-50/50 rounded-b-3xl">
              <button
                type="button"
                onClick={() => handleDeleteCreator(viewingCreator.id, viewingCreator.name)}
                className="px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingCreator(null)}
                  className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const c = viewingCreator;
                    setViewingCreator(null);
                    setEditingCreator(c);
                    setCreatorModalOpen(true);
                  }}
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CREATOR ADD / EDIT MODAL (PHOTO & VIDEO SUPPORTED)         */}
      {/* ========================================================= */}
      {creatorModalOpen && (
        <div 
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => {
            setCreatorModalOpen(false);
            setEditingCreator(null);
            setCreatorAvatar("");
            setCreatorShowcaseMedia("");
          }}
        >
          <div 
            className="relative bg-white rounded-3xl border border-stone-200/80 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col my-auto text-stone-900 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-3.5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-stone-900 tracking-tight">
                {editingCreator ? "Edit Creator Profile" : "Add New Creator"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setCreatorModalOpen(false);
                  setEditingCreator(null);
                  setCreatorAvatar("");
                  setCreatorShowcaseMedia("");
                }}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveCreator} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                
                {/* 1. Basic Identity */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">1. Creator Identity</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        defaultValue={editingCreator?.name || ""}
                        placeholder="e.g. Kai Vance"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Handle / Social Tag *
                      </label>
                      <input
                        type="text"
                        name="handle"
                        required
                        defaultValue={editingCreator?.handle || ""}
                        placeholder="e.g. @kaivance.raw"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Specialty Role / Headline *
                      </label>
                      <input
                        type="text"
                        name="role"
                        required
                        defaultValue={editingCreator?.role || ""}
                        placeholder="e.g. Cinematic Fashion & Visual Storyteller"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Category *
                      </label>
                      <select
                        name="category"
                        defaultValue={editingCreator?.category || "High Fashion & Luxury"}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-medium cursor-pointer"
                      >
                        {CREATOR_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Reach Tier *
                      </label>
                      <select
                        name="tier"
                        defaultValue={editingCreator?.tier || "Prime (100K-500K)"}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none font-medium cursor-pointer"
                      >
                        {CREATOR_REACH_TIERS.map((tier) => (
                          <option key={tier} value={tier}>
                            {tier}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Base Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        defaultValue={editingCreator?.location || ""}
                        placeholder="e.g. Guwahati • London"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-3">
                      <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="verified"
                          defaultChecked={editingCreator ? editingCreator.verified : true}
                          className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-0"
                        />
                        <span>Verified Vetted Creator</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="featuredInHero"
                          defaultChecked={editingCreator?.featuredInHero || false}
                          className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-0"
                        />
                        <span>Highlight in Hero</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Media Suite: Photo & Video Supported */}
                <div className="space-y-3.5 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">2. Media & Showreel (Photo & Video Supported)</h3>
                  </div>

                  {/* Profile Avatar */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      Profile Avatar / Headshot
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100 shrink-0 border border-stone-200 flex items-center justify-center">
                        {creatorAvatar ? (
                          <img src={creatorAvatar} alt="Avatar preview" className="w-full h-full object-cover" />
                        ) : editingCreator?.avatar ? (
                          <img src={editingCreator.avatar} alt="Avatar preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-stone-300" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <label className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload Avatar Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCreatorAvatarUpload}
                              className="hidden"
                            />
                          </label>
                          {creatorAvatar && (
                            <button
                              type="button"
                              onClick={() => setCreatorAvatar("")}
                              className="text-[11px] text-rose-600 hover:underline"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <input
                          type="url"
                          name="avatarUrl"
                          defaultValue={editingCreator?.avatar || ""}
                          placeholder="Or paste avatar image URL (https://...)"
                          className="w-full px-3 py-1.5 rounded-xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Featured Showcase Media: Photo or Video Toggle */}
                  <div className="p-4 rounded-2xl bg-stone-50/60 border border-stone-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-stone-800">
                        Featured Showcase Media (Image or Video)
                      </label>

                      {/* Mode Segmented Controls */}
                      <div className="inline-flex items-center p-0.5 bg-stone-200/60 rounded-full text-[11px]">
                        <button
                          type="button"
                          onClick={() => setCreatorMediaType("image")}
                          className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                            creatorMediaType === "image"
                              ? "bg-white text-stone-900 shadow-xs"
                              : "text-stone-600 hover:text-stone-900"
                          }`}
                        >
                          Photo / Stills
                        </button>
                        <button
                          type="button"
                          onClick={() => setCreatorMediaType("video")}
                          className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1 ${
                            creatorMediaType === "video"
                              ? "bg-red-600 text-white shadow-xs"
                              : "text-stone-600 hover:text-stone-900"
                          }`}
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>Video / Reel</span>
                        </button>
                      </div>
                    </div>

                    {/* Preview Area */}
                    {creatorShowcaseMedia ? (
                      <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-black group">
                        <div className="relative h-44 w-full flex items-center justify-center">
                          {creatorMediaType === "video" || isVideoMedia(creatorShowcaseMedia) ? (
                            <video
                              src={creatorShowcaseMedia}
                              controls
                              autoPlay
                              muted
                              loop
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={creatorShowcaseMedia}
                              alt="Showcase preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute top-2 right-2 flex items-center gap-1.5">
                            <label className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-stone-900 text-xs font-semibold shadow-md hover:bg-white cursor-pointer transition-all flex items-center gap-1">
                              <UploadCloud className="w-3 h-3" />
                              <span>Replace</span>
                              <input
                                type="file"
                                accept={creatorMediaType === "video" ? "video/*" : "image/*"}
                                onChange={handleCreatorMediaUpload}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => setCreatorShowcaseMedia("")}
                              className="p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 cursor-pointer transition-all"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {creatorMediaType === "video" || isVideoMedia(creatorShowcaseMedia) ? "Video Reel Ready" : "Photo Stills Ready"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Upload Dropzone */
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleCreatorMediaDrop}
                        className="p-5 border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-2xl text-center space-y-2 bg-white transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
                          {creatorMediaType === "video" ? (
                            <Play className="w-5 h-5 ml-0.5 fill-current text-red-600" />
                          ) : (
                            <UploadCloud className="w-5 h-5 text-stone-600" />
                          )}
                        </div>
                        <div className="text-xs text-stone-700 font-medium">
                          Upload local {creatorMediaType === "video" ? "4K Video Reel (.mp4, .webm, .mov)" : "High-Res Photo (.jpg, .png, .webp)"}
                        </div>
                        <p className="text-[11px] text-stone-400">
                          Drag and drop or select file directly from your computer
                        </p>
                        <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium cursor-pointer transition-colors shadow-xs">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Browse {creatorMediaType === "video" ? "Video Reel" : "Photo"}</span>
                          <input
                            type="file"
                            accept={creatorMediaType === "video" ? "video/*" : "image/*"}
                            onChange={handleCreatorMediaUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    <div>
                      <input
                        type="text"
                        name="showcaseMediaUrl"
                        defaultValue={editingCreator?.videoPreviewUrl || editingCreator?.featuredImage || ""}
                        placeholder="Or enter direct URL (e.g. https://... or /videos/reel.mp4)"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Performance & Commercials */}
                <div className="space-y-3.5 pt-4 border-t border-stone-100">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">3. Metrics & Commercials</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Followers / Reach *
                      </label>
                      <input
                        type="text"
                        name="followersCount"
                        required
                        defaultValue={editingCreator?.followersCount || "450K"}
                        placeholder="e.g. 890K"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Average Views *
                      </label>
                      <input
                        type="text"
                        name="avgViews"
                        required
                        defaultValue={editingCreator?.avgViews || "180K"}
                        placeholder="e.g. 450K"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Engagement Rate (%) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="engagementRate"
                        required
                        defaultValue={editingCreator?.engagementRate || 5.8}
                        placeholder="e.g. 6.4"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Starting Commercial Rate *
                      </label>
                      <input
                        type="text"
                        name="startingRate"
                        required
                        defaultValue={editingCreator?.startingRate || "₹25,000"}
                        placeholder="e.g. ₹25,000 or $1,800"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Turnaround SLA (Days) *
                      </label>
                      <input
                        type="number"
                        name="turnaroundDays"
                        required
                        defaultValue={editingCreator?.turnaroundDays || 3}
                        placeholder="e.g. 3"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Deliverable Formats */}
                <div className="space-y-2 pt-4 border-t border-stone-100">
                  <label className="block text-xs font-medium text-stone-700">
                    Deliverable Formats
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CREATOR_DELIVERABLES.map((fmt) => (
                      <label key={fmt} className="flex items-center gap-2 p-2 rounded-xl bg-stone-50/80 border border-stone-200/70 text-xs text-stone-700 cursor-pointer hover:bg-stone-100">
                        <input
                          type="checkbox"
                          name="formats"
                          value={fmt}
                          defaultChecked={editingCreator?.formats?.includes(fmt) ?? true}
                          className="w-4 h-4 rounded text-stone-900 border-stone-300"
                        />
                        <span>{fmt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 5. Creative Bio */}
                <div className="pt-4 border-t border-stone-100">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Creative Bio & Aesthetic Manifesto
                  </label>
                  <textarea
                    name="bio"
                    rows={3}
                    defaultValue={editingCreator?.bio || ""}
                    placeholder="Describe the creator's signature visual style, storytelling focus, and commercial aesthetics..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none leading-relaxed"
                  />
                </div>

                {/* 6. Past Brands & Specialties */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-stone-100">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Past Brand Collaborations (Comma separated)
                    </label>
                    <input
                      type="text"
                      name="pastBrands"
                      defaultValue={editingCreator?.pastBrands?.join(", ") || ""}
                      placeholder="e.g. Prada, Balenciaga, Gentle Monster, Sony"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Specialty Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={editingCreator?.tags?.join(", ") || ""}
                      placeholder="e.g. Luxury, Cinematography, Reels, Direction"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-stone-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 7. Commercial Packages (Optional) */}
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-stone-700">
                      Rate Packages
                    </label>
                    <span className="text-[10px] text-stone-400">Optional · Client Packages</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-2">
                    <div className="text-[11px] font-semibold text-stone-600">Package 1</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="pkg1Title"
                        defaultValue={editingCreator?.packages?.[0]?.title || ""}
                        placeholder="Title: e.g. Dedicated 4K Reel"
                        className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none"
                      />
                      <input
                        type="text"
                        name="pkg1Deliverables"
                        defaultValue={editingCreator?.packages?.[0]?.deliverables || ""}
                        placeholder="Deliverables: e.g. 1x 4K Reel + 2x Stories"
                        className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none"
                      />
                      <input
                        type="text"
                        name="pkg1Price"
                        defaultValue={editingCreator?.packages?.[0]?.priceEstimate || ""}
                        placeholder="Price: e.g. ₹25,000"
                        className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none"
                      />
                      <input
                        type="text"
                        name="pkg1Turnaround"
                        defaultValue={editingCreator?.packages?.[0]?.turnaround || ""}
                        placeholder="Turnaround: e.g. 3 Days"
                        className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 8. Demographics & Featured Case Study (Optional) */}
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-stone-700">
                      Audience & Case Study
                    </label>
                    <span className="text-[10px] text-stone-400">Optional · Data Insights</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="ageGroup"
                      defaultValue={editingCreator?.demographics?.ageGroup || ""}
                      placeholder="Age Split: e.g. 78% 18–34"
                      className="px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      name="genderSplit"
                      defaultValue={editingCreator?.demographics?.genderSplit || ""}
                      placeholder="Gender: e.g. 52% M / 48% F"
                      className="px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      name="csBrand"
                      defaultValue={editingCreator?.caseStudies?.[0]?.brand || ""}
                      placeholder="Brand: e.g. Balenciaga"
                      className="px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      name="csCampaign"
                      defaultValue={editingCreator?.caseStudies?.[0]?.campaign || ""}
                      placeholder="Campaign Title"
                      className="px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      name="csMetric"
                      defaultValue={editingCreator?.caseStudies?.[0]?.metric || ""}
                      placeholder="Metric: e.g. 2.8M Views • 6.4x ROAS"
                      className="px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Form Footer */}
              <div className="shrink-0 p-4 sm:p-6 pt-3 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => {
                    setCreatorModalOpen(false);
                    setEditingCreator(null);
                    setCreatorAvatar("");
                    setCreatorShowcaseMedia("");
                  }}
                  className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                >
                  {editingCreator ? "Update Creator" : "Add Creator to Roster"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL: STAY & PROPERTY DETAIL PREVIEW                  */}
      {/* ======================================================= */}
      {viewingStayProperty && (
        <div
          onClick={() => setViewingStayProperty(null)}
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200/80 overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="shrink-0 p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono">
                  {viewingStayProperty.kind === "rental" ? "Rental Property Preview" : "Hotel & Villa Preview"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingStayProperty(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Cover Image & Badges */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-900">
                <img
                  src={viewingStayProperty.item.image}
                  alt={viewingStayProperty.item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-[11px] font-bold tracking-wider text-white uppercase font-mono shadow-sm">
                    {viewingStayProperty.kind === "rental"
                      ? (viewingStayProperty.item as RentalProperty).propertyType
                      : (viewingStayProperty.item as StayProperty).category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-gradient-to-t from-stone-950/85 via-stone-950/50 to-transparent p-3 sm:p-4 rounded-xl text-white">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] text-white font-medium mb-1">
                    <MapPin className="w-3 h-3 text-white shrink-0" />
                    <span>
                      {viewingStayProperty.kind === "rental"
                        ? (viewingStayProperty.item as RentalProperty).locality
                        : (viewingStayProperty.item as StayProperty).location}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                    {viewingStayProperty.item.title}
                  </h2>
                </div>
              </div>

              {/* Specs Metric Grid */}
              {viewingStayProperty.kind === "rental" ? (
                (() => {
                  const r = viewingStayProperty.item as RentalProperty;
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/80 text-center">
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase font-mono">Monthly Rent</div>
                        <div className="text-sm font-bold text-stone-900 mt-0.5 font-mono">₹{r.monthlyRent.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase font-mono">Deposit</div>
                        <div className="text-sm font-bold text-stone-900 mt-0.5 font-mono">₹{r.securityDeposit.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase font-mono">Carpet Area</div>
                        <div className="text-sm font-bold text-stone-900 mt-0.5">{r.carpetAreaSqFt} sq.ft</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase font-mono">Bedrooms</div>
                        <div className="text-sm font-bold text-stone-900 mt-0.5">{r.bedrooms} BHK &bull; {r.bathrooms} Bath</div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                (() => {
                  const h = viewingStayProperty.item as StayProperty;
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/80 text-center">
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase font-mono">Nightly Tariff</div>
                        <div className="text-sm font-bold text-stone-900 mt-0.5 font-mono">₹{h.pricePerNight.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase font-mono">Rating</div>
                        <div className="text-sm font-bold text-stone-900 mt-0.5 flex items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{h.rating} ({h.reviewsCount})</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase font-mono">Guest Capacity</div>
                        <div className="text-sm font-bold text-stone-900 mt-0.5">{h.guests} Guests</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase font-mono">Bed & Bath</div>
                        <div className="text-sm font-bold text-stone-900 mt-0.5">{h.bedrooms} Bed &bull; {h.bathrooms} Bath</div>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 font-mono">
                  Description & Overview
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {viewingStayProperty.item.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 font-mono">
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {viewingStayProperty.item.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 bg-stone-50 p-2 rounded-xl border border-stone-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 p-4 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
              <button
                type="button"
                onClick={() => setViewingStayProperty(null)}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingStayProperty;
                  setViewingStayProperty(null);
                  setEditingStayProperty(toEdit);
                  setStayModalType(toEdit.kind);
                  setStayPhoto(toEdit.item.image || "");
                  setStayModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit Property</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL: ADD / EDIT STAY OR RENTAL PROPERTY               */}
      {/* ======================================================= */}
      {stayModalOpen && (
        <div
          onClick={() => {
            setStayModalOpen(false);
            setEditingStayProperty(null);
            setStayPhoto("");
          }}
          className="fixed inset-0 z-[250] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200/80 overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="shrink-0 p-4 sm:p-5 border-b border-stone-100 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-stone-900">
                    {editingStayProperty ? "Edit Property Listing" : "Add New Property"}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Switch property type below to configure rental or vacation stay fields
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStayModalOpen(false);
                    setEditingStayProperty(null);
                    setStayPhoto("");
                  }}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Top Segmented Selector: Rentals vs Hotels & Villas */}
              <div className="grid grid-cols-2 gap-1.5 bg-stone-200/60 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setStayModalType("rental")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    stayModalType === "rental"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <HomeIcon className="w-3.5 h-3.5 text-stone-700" />
                  <span>🏡 Rental Property (Monthly)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStayModalType("hotel")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    stayModalType === "hotel"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Hotel className="w-3.5 h-3.5 text-rose-600" />
                  <span>🏨 Hotel / Luxury Villa (Nightly)</span>
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveStayProperty} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* 1. Property Photo Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-stone-700">
                    Property Photo (Upload or URL) *
                  </label>

                  {stayPhoto ? (
                    <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 aspect-[16/9] max-h-48">
                      <img src={stayPhoto} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setStayPhoto("")}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleStayPhotoDrop}
                      className="border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-2xl p-4 text-center bg-stone-50/50 hover:bg-stone-50 transition-all cursor-pointer relative"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStayPhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <UploadCloud className="w-7 h-7 text-stone-400 mx-auto mb-1" />
                      <p className="text-xs font-medium text-stone-700">Drop local photo here or click to browse</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">Supports PNG, JPG, WebP from your device</p>
                    </div>
                  )}

                  <input
                    type="url"
                    name="imageUrl"
                    defaultValue={editingStayProperty?.item.image || ""}
                    placeholder="Or enter direct image URL (https://...)"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                {/* 2. Common: Title & City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Property Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingStayProperty?.item.title || ""}
                      placeholder={stayModalType === "rental" ? "e.g. Luxury 3 BHK High-Rise Flat" : "e.g. Kaziranga Eco Luxury Villa"}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">City / District *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      defaultValue={editingStayProperty?.item.city || "Guwahati"}
                      placeholder="e.g. Guwahati, Shillong"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                </div>

                {/* 3. DYNAMIC FIELDS ACCORDING TO TYPE */}
                {stayModalType === "rental" ? (
                  /* RENTAL FIELDS */
                  <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                        <HomeIcon className="w-3.5 h-3.5 text-stone-600" />
                        <span>Rental Specific Details</span>
                      </span>
                      <span className="text-[10px] text-stone-400">Monthly Lease Scheme</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-stone-700">Locality / Landmark *</label>
                        <input
                          type="text"
                          name="locality"
                          required
                          defaultValue={
                            editingStayProperty && editingStayProperty.kind === "rental"
                              ? (editingStayProperty.item as RentalProperty).locality
                              : ""
                          }
                          placeholder="e.g. GS Road, Guwahati"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-stone-700">Property Type *</label>
                        <input
                          type="text"
                          name="propertyType"
                          required
                          defaultValue={
                            editingStayProperty && editingStayProperty.kind === "rental"
                              ? (editingStayProperty.item as RentalProperty).propertyType
                              : "3 BHK Apartment"
                          }
                          placeholder="e.g. 3 BHK Apartment, 2 BHK Builder Floor"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-stone-700">Monthly Rent (₹) *</label>
                        <input
                          type="number"
                          name="monthlyRent"
                          required
                          defaultValue={
                            editingStayProperty && editingStayProperty.kind === "rental"
                              ? (editingStayProperty.item as RentalProperty).monthlyRent
                              : 25000
                          }
                          placeholder="₹ / month"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-stone-700">Security Deposit (₹)</label>
                        <input
                          type="number"
                          name="securityDeposit"
                          defaultValue={
                            editingStayProperty && editingStayProperty.kind === "rental"
                              ? (editingStayProperty.item as RentalProperty).securityDeposit
                              : 50000
                          }
                          placeholder="Deposit ₹"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-stone-700">Carpet Area (sq.ft)</label>
                        <input
                          type="number"
                          name="carpetAreaSqFt"
                          defaultValue={
                            editingStayProperty && editingStayProperty.kind === "rental"
                              ? (editingStayProperty.item as RentalProperty).carpetAreaSqFt
                              : 1400
                          }
                          placeholder="e.g. 1400"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-stone-700">Furnishing Status</label>
                      <select
                        name="furnishing"
                        value={stayFurnishing}
                        onChange={(e) => setStayFurnishing(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                      >
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  /* HOTEL / VILLA FIELDS */
                  <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                        <Hotel className="w-3.5 h-3.5 text-rose-600" />
                        <span>Hotel & Vacation Stay Details</span>
                      </span>
                      <span className="text-[10px] text-stone-400">Nightly Guest Tariff</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-stone-700">Full Location / Address *</label>
                        <input
                          type="text"
                          name="location"
                          required
                          defaultValue={
                            editingStayProperty && editingStayProperty.kind === "hotel"
                              ? (editingStayProperty.item as StayProperty).location
                              : ""
                          }
                          placeholder="e.g. Kaziranga Border, Upper Shillong"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-stone-700">Category *</label>
                        <select
                          name="category"
                          value={stayCategory}
                          onChange={(e) => setStayCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        >
                          <option value="Vacation Home">Vacation Home</option>
                          <option value="Boutique Hotel">Boutique Hotel</option>
                          <option value="Architectural Homestay">Architectural Homestay</option>
                          <option value="Luxury Villa">Luxury Villa</option>
                          <option value="Eco Resort">Eco Resort</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-stone-700">Tariff (₹ / night) *</label>
                        <input
                          type="number"
                          name="pricePerNight"
                          required
                          defaultValue={
                            editingStayProperty && editingStayProperty.kind === "hotel"
                              ? (editingStayProperty.item as StayProperty).pricePerNight
                              : 6500
                          }
                          placeholder="₹ / night"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-stone-700">Guests Capacity</label>
                        <input
                          type="number"
                          name="guests"
                          defaultValue={
                            editingStayProperty && editingStayProperty.kind === "hotel"
                              ? (editingStayProperty.item as StayProperty).guests
                              : 6
                          }
                          placeholder="e.g. 6"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-stone-700">Rating (★)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="rating"
                          defaultValue={
                            editingStayProperty && editingStayProperty.kind === "hotel"
                              ? (editingStayProperty.item as StayProperty).rating
                              : 4.9
                          }
                          placeholder="e.g. 4.9"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-stone-700">Reviews Count</label>
                        <input
                          type="number"
                          name="reviewsCount"
                          defaultValue={
                            editingStayProperty && editingStayProperty.kind === "hotel"
                              ? (editingStayProperty.item as StayProperty).reviewsCount
                              : 36
                          }
                          placeholder="e.g. 36"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-stone-700">Tag / Badge</label>
                      <input
                        type="text"
                        name="tag"
                        defaultValue={
                          editingStayProperty && editingStayProperty.kind === "hotel"
                            ? (editingStayProperty.item as StayProperty).tag
                            : "FEATURED STAY"
                        }
                        placeholder="e.g. FEATURED STAY, POPULAR, RIVER VIEW, HILL VIEW"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Bedrooms Count *</label>
                    <input
                      type="number"
                      name="bedrooms"
                      required
                      defaultValue={editingStayProperty?.item.bedrooms || 2}
                      placeholder="e.g. 2"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Bathrooms Count *</label>
                    <input
                      type="number"
                      name="bathrooms"
                      required
                      defaultValue={editingStayProperty?.item.bathrooms || 2}
                      placeholder="e.g. 2"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                </div>

                {/* 5. Amenities */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-stone-700">
                    Amenities & Features (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    defaultValue={editingStayProperty?.item.amenities.join(", ") || ""}
                    placeholder="e.g. 24/7 Power Backup, Covered Car Parking, High-speed WiFi"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                  {/* Quick Amenities Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-stone-400 mr-1 self-center">Quick suggestions:</span>
                    {(stayModalType === "rental"
                      ? ["Covered Car Parking", "24/7 Power Backup", "Gated Security", "Modular Kitchen", "High-speed Elevator", "WiFi Ready", "Balcony View"]
                      : ["Scenic Hill Views", "Infinity Pool", "Private Chef", "High-speed WiFi", "Bonfire & BBQ", "Breakfast Included", "Heated Jacuzzi"]
                    ).map((sugg) => (
                      <button
                        key={sugg}
                        type="button"
                        onClick={(e) => {
                          const form = (e.target as HTMLElement).closest("form");
                          const input = form?.querySelector<HTMLInputElement>("input[name='amenities']");
                          if (input) {
                            const cur = input.value.trim();
                            if (!cur.includes(sugg)) {
                              input.value = cur ? `${cur}, ${sugg}` : sugg;
                            }
                          }
                        }}
                        className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[10px] text-stone-600 transition-colors cursor-pointer"
                      >
                        + {sugg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Description */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-stone-700">Full Description *</label>
                  <textarea
                    name="description"
                    rows={3}
                    required
                    defaultValue={editingStayProperty?.item.description || ""}
                    placeholder="Describe property highlights, architectural quality, furnishings, surroundings..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
                  />
                </div>
              </div>

              {/* Form Footer */}
              <div className="shrink-0 p-4 sm:p-5 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => {
                    setStayModalOpen(false);
                    setEditingStayProperty(null);
                    setStayPhoto("");
                  }}
                  className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs cursor-pointer"
                >
                  {editingStayProperty ? "Update Property" : "Save Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: RESTORE DATABASE BACKUP CONFIRMATION              */}
      {/* ========================================================= */}
      {restoreModalOpen && (
        <div className="fixed inset-0 z-[200] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className={`border rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 ${
            isDark ? "bg-stone-900 border-stone-800 text-stone-100" : "bg-white border-stone-200/80 text-stone-900"
          }`}>
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight">Restore Database Backup?</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-normal">Overwrites existing local data</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                You are about to restore system data from:
              </p>
              <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/80 font-mono text-[11px] truncate">
                📄 {restoreJsonFile?.name}
              </div>
              {restorePreviewCount !== null && (
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Verified: Contains {restorePreviewCount} catalog items, projects, and services.
                </p>
              )}
              <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                Restoring will update all projects, creators, stay listings, services, and finances to match this backup file.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setRestoreModalOpen(false);
                  setRestoreJsonFile(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer ${
                  isDark ? "bg-stone-800 hover:bg-stone-700 text-stone-300" : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRestore}
                className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm & Restore</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
