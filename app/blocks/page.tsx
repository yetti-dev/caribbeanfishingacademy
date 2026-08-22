import type { Metadata } from "next";
import { BlocksShowcase } from "@/components/blocks-showcase";

export const metadata: Metadata = {
  title: "Block library",
  description: "Every installed block, rendered so you can judge it before using it.",
};

export default function BlocksPage() {
  return <BlocksShowcase />;
}
