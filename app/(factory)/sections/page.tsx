import type { Metadata } from "next";
import { SectionsShowcase } from "@/components/sections-showcase";

export const metadata: Metadata = {
  title: "Section library",
  description: "Authored page sections, rendered with real photography.",
};

export default function SectionsPage() {
  return <SectionsShowcase />;
}
