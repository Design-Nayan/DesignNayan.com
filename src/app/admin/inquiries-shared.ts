export interface InquiryRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  location: string;
  status: "NEW" | "IN REVIEW" | "CONTACTED" | "CLOSED";
  date: string;
}

export const INQUIRIES_STORAGE_KEY = "dn_inquiries";

export const initialInquiries: InquiryRecord[] = [];

export function getStoredInquiries(): InquiryRecord[] {
  if (typeof window === "undefined") return initialInquiries;
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(initialInquiries));
      return initialInquiries;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return initialInquiries;
  } catch {
    return initialInquiries;
  }
}

export function saveStoredInquiries(inquiries: InquiryRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
    window.dispatchEvent(new CustomEvent("dn_inquiry_update", { detail: inquiries }));
  } catch {}
}

export function addInquiry(
  inquiry: Omit<InquiryRecord, "id" | "status" | "date"> & {
    id?: string;
    status?: InquiryRecord["status"];
    date?: string;
  }
): InquiryRecord {
  const current = getStoredInquiries();
  const newRecord: InquiryRecord = {
    id: inquiry.id || `inq_${Date.now()}`,
    status: inquiry.status || "NEW",
    date: inquiry.date || "Just now",
    name: inquiry.name,
    phone: inquiry.phone,
    email: inquiry.email,
    service: inquiry.service,
    budget: inquiry.budget,
    message: inquiry.message,
    location: inquiry.location,
  };
  const updated = [newRecord, ...current];
  saveStoredInquiries(updated);
  return newRecord;
}
