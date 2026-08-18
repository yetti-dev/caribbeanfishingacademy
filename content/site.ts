/**
 * Shared chrome copy: navbar, footer, global CTA. Page-specific copy goes in
 * content/<page>.ts. `/build` fills this from the scrape (.scrape/<slug>/brand.json
 * navItems + footerItems).
 */
import type { NavItem, Cta, Link } from "./types";

export const site = {
  /** Navbar links. Add `children` for a dropdown or mega-menu group. */
  nav: [] as NavItem[],

  /** The single button in the navbar. */
  navCta: null as Cta | null,

  /** Footer link groups. */
  footer: {
    /** Short line under the logo. */
    blurb: "",
    groups: [] as { title: string; links: Link[] }[],
    legal: "" as string,
  },
} as const;

export default site;
