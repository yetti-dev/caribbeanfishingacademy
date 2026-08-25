/**
 * Shared content primitives. Copy lives in content/*.ts, never inside components.
 *
 * One file per page: content/home.ts, content/about.ts, content/contact.ts ...
 * Shared chrome (nav, footer) lives in content/site.ts.
 * Components import the typed object and render it. That keeps copy edits in one
 * place and out of JSX.
 *
 * Rule that applies to every string in these files: no em dashes or en dashes.
 * Use a period, comma, colon, or parentheses.
 */

/** A link. `href` is an internal route or an absolute URL. */
export type Link = {
  label: string;
  href: string;
  /** Optional lucide-react icon name, resolved by the component. */
  icon?: string;
  external?: boolean;
};

/** A nav entry, optionally with a dropdown / mega-menu group. */
export type NavItem = Link & {
  children?: Link[];
};

/** A call to action. `variant` maps to the button styles. */
export type Cta = Link & {
  variant?: "primary" | "secondary" | "ghost";
  /**
   * Set on a real "book now" CTA to open the Yetti booking modal instead of
   * following `href`: a real activity ID for a page about one specific trip,
   * or "" for a general booking CTA. Leave unset on CTAs that just navigate
   * (page links, mailto/tel, external social), those keep using `href`.
   */
  activityId?: string;
};

/** An image with real alt text in the brand voice. */
export type Img = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
};

/** Small tracked label above a heading. Not a heading itself. */
export type Eyebrow = string;

/** The standard heading block a section opens with. */
export type SectionHeading = {
  eyebrow?: Eyebrow;
  title: string;
  body?: string;
};

export type Feature = {
  /** lucide-react icon name, e.g. "ShieldCheck". */
  icon?: string;
  title: string;
  body: string;
  href?: string;
  image?: Img;
};

export type Stat = {
  value: string;
  label: string;
  /** Optional numeric target so a count-up animation can use it. */
  to?: number;
  suffix?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  avatar?: Img;
};

export type PriceTier = {
  name: string;
  price: string;
  period?: string;
  body?: string;
  features: string[];
  cta?: Cta;
  featured?: boolean;
  image?: Img;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type Step = {
  n: number;
  title: string;
  body: string;
};

/** Per-page metadata. Feeds the Next.js `metadata` export. */
export type PageMeta = {
  title: string;
  description: string;
  /** Route path, e.g. "/about". Home is "/". */
  path: string;
};

/** Every page content file exports this shape at minimum. */
export type PageContent = {
  meta: PageMeta;
};
