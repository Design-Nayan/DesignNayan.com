export type StudioCategory = 
  | "ALL"
  | "DESIGN & ARCHITECTURE"
  | "BRANDING & CREATIVE"
  | "DIGITAL & MARKETING";

export interface StudioServiceDetail {
  id: string;
  title: string;
  category: "DESIGN & ARCHITECTURE" | "BRANDING & CREATIVE" | "DIGITAL & MARKETING";
  badge: string;
  description: string;
  iconName: string;
  deliverables: string[];
  specs: {
    label: string;
    value: string;
  }[];
  priceGuide: string;
  turnaround: string;
  popular?: boolean;
}
