/**
 * Home page copy. `/build` rewrites this file for the real brand, in the section
 * order the source site uses (.scrape/<slug>/brand.json -> sectionOrder).
 *
 * Add or drop keys freely, this is a starting shape, not a contract. Keep every
 * string free of em dashes and en dashes.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, Stat, Testimonial, FaqItem } from "./types";

export const home = {
  meta: {
    title: "",
    description: "",
    path: "/",
  },

  hero: {
    eyebrow: "",
    /** One h1. Concrete outcome, not "Welcome to our platform". */
    title: "",
    body: "",
    ctas: [] as Cta[],
    /** The one `priority` image on this page. */
    image: null as Img | null,
  },

  /** Add the sections this brand actually needs, in the source site's order. */
  sections: {
    features: null as (SectionHeading & { items: Feature[] }) | null,
    stats: null as (SectionHeading & { items: Stat[] }) | null,
    gallery: null as (SectionHeading & { images: Img[] }) | null,
    testimonials: null as (SectionHeading & { items: Testimonial[] }) | null,
    faq: null as (SectionHeading & { items: FaqItem[] }) | null,
  },

  cta: {
    title: "",
    body: "",
    ctas: [] as Cta[],
  },
} satisfies PageContent & Record<string, unknown>;

export default home;
