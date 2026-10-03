export interface AboutStatItem {
  value: string;
  label: string;
}

export interface AboutProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface AboutPageData {
  tagline: string;
  headline: string;
  description: string;
  stats: AboutStatItem[];
  philosophyTitle: string;
  philosophyParagraph1: string;
  philosophyParagraph2: string;
  philosophyHighlights: string[];
  mediaType: "image" | "video";
  mediaUrl: string;
  processTagline: string;
  processTitle: string;
  processSteps: AboutProcessStep[];
}
