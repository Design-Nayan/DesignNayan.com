import { Metadata } from "next";
import { CreatorsView } from "@/modules/creators";

export const metadata: Metadata = {
  title: "Creators Talent Network | Design Nayan",
  description:
    "Explore and hire top-tier creators for your brand campaigns. Vetted talent, 4K viral short-form, cinematic commercials, and 100% commercial IP clearance.",
};

export default function CreatorsPage() {
  return <CreatorsView />;
}
