import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";

/**
 * Factory root layout.
 *
 * A SECOND root layout, which is why both groups are route groups and
 * app/layout.tsx no longer exists. The isolation is the point:
 *
 *  - the factory never inherits the client's brand shell, so the FAQ and
 *    WhatsApp widgets cannot appear over the tooling;
 *  - the client's layout never loads dashboard chrome or Supabase code;
 *  - the whole group is deleted on export, and a missing nested layout would
 *    have left the client site with a broken tree.
 *
 * Crossing between the two groups costs a full document load. That is fine for
 * an internal tool and is the price of the isolation.
 */
export const metadata: Metadata = {
  title: { default: "Factory", template: "%s · Factory" },
  description: "Internal tooling for the website factory.",
  robots: { index: false, follow: false },
};

export default function FactoryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="min-h-full bg-zinc-100 text-zinc-900 antialiased">{children}</body>
    </html>
  );
}
