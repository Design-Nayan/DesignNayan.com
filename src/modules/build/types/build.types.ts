export interface BuildServiceDetail {
  id: string;
  title: string;
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

export interface MaterialCategory {
  category: string;
  brands: string[];
  desc: string;
  badge: string;
}

