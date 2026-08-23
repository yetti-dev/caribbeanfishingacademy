import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Footer01 } from "@/components/sections/footer/footer-01";
import { Footer02 } from "@/components/sections/footer/footer-02";
import { Footer03 } from "@/components/sections/footer/footer-03";
import { Footer04 } from "@/components/sections/footer/footer-04";
import { Footer05 } from "@/components/sections/footer/footer-05";
import { Footer06 } from "@/components/sections/footer/footer-06";
import { Footer07 } from "@/components/sections/footer/footer-07";
import { Footer08 } from "@/components/sections/footer/footer-08";
import { Footer09 } from "@/components/sections/footer/footer-09";
import { Footer10 } from "@/components/sections/footer/footer-10";
import { demoContact, demoTours, img } from "@/content/demo";
import type { Link } from "@/content/types";

const BRAND = "Blue Water Sail";
const TAGLINE = "Twelve guests, one boat, and captains who grew up on this water.";

const mainLinks: Link[] = [
  { label: "Tours", href: "#tours" },
  { label: "Fleet", href: "#fleet" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const legalLinks: Link[] = [
  { label: "Booking terms", href: "#terms" },
  { label: "Privacy", href: "#privacy" },
  { label: "Cancellation policy", href: "#cancellations" },
];

const tripLinks: Link[] = [
  { label: "Sunset cruise with dinner", href: "#sunset" },
  { label: "Snorkel and sail half day", href: "#snorkel" },
  { label: "Full day coast run", href: "#coast" },
  { label: "Morning dolphin run", href: "#dolphins" },
  { label: "Private charter", href: "#private" },
];

const boatLinks: Link[] = [
  { label: "Mira, 38ft catamaran", href: "#mira" },
  { label: "Serena, 42ft sloop", href: "#serena" },
  { label: "Kite, 26ft day boat", href: "#kite" },
  { label: "Safety and certification", href: "#safety" },
];

const planLinks: Link[] = [
  { label: "What to bring", href: "#packing" },
  { label: "Meeting point at Slip 14", href: "#meeting" },
  { label: "Food and dietary needs", href: "#galley" },
  { label: "Weather promise", href: "#weather" },
  { label: "Gift vouchers", href: "#vouchers" },
];

const aboutLinks: Link[] = [
  { label: "Our crew", href: "#crew" },
  { label: "Reef work we fund", href: "#reef" },
  { label: "Guest reviews", href: "#reviews" },
  { label: "Careers on deck", href: "#jobs" },
];

const groups = [
  { title: "Trips", links: tripLinks },
  { title: "Fleet", links: boatLinks },
  { title: "Plan", links: planLinks },
  { title: "About", links: aboutLinks },
];

const sitemapGroups = [
  ...groups,
  { title: "Contact", links: [
    { label: "Slip 14, Renaissance Marina", href: "#directions" },
    { label: "+297 588 1420", href: "tel:+2975881420" },
    { label: "hello@bluewatersail.example", href: "mailto:hello@bluewatersail.example" },
    { label: "WhatsApp the dock", href: "#whatsapp" },
  ] as Link[] },
  { title: "Legal", links: legalLinks },
];

export const FOOTER_ENTRIES: CatalogEntry[] = [
  {
    code: "FOOT-01",
    category: "Footer",
    label: "Minimal single row on one hairline: wordmark, centred links, copyright",
    file: "components/sections/footer/footer-01.tsx",
    component: "Footer01",
    props: "brandName: string, logo?: Img, links?: Link[], socials?: Link[], copyright?: string",
    node: (
      <Footer01
        brandName={BRAND}
        links={mainLinks}
        socials={demoContact.socials}
        copyright="2026 Blue Water Sail, Oranjestad"
      />
    ),
  },
  {
    code: "FOOT-02",
    category: "Footer",
    label: "Editorial: link columns above a giant wordmark bleeding off the bottom edge",
    file: "components/sections/footer/footer-02.tsx",
    component: "Footer02",
    props: "brandName: string, tagline?: string, columns?: {title, links}[], socials?: Link[], legal?: Link[], copyright?: string",
    node: (
      <Footer02
        brandName={BRAND}
        tagline={TAGLINE}
        columns={groups.slice(0, 3)}
        socials={demoContact.socials}
        legal={legalLinks}
        copyright="2026 Blue Water Sail"
      />
    ),
  },
  {
    code: "FOOT-03",
    category: "Footer",
    label: "Inverted dark panel with a newsletter sign up left and four link columns right",
    file: "components/sections/footer/footer-03.tsx",
    component: "Footer03",
    props: "brandName: string, newsletterTitle?: string, newsletterBody?: string, buttonLabel?: string, columns?: {title, links}[], socials?: Link[], copyright?: string",
    node: (
      <Footer03
        brandName={BRAND}
        newsletterTitle="Trip openings, first"
        newsletterBody="One short note a month: cancellations we can fill, new routes, and when the water is at its clearest."
        buttonLabel="Keep me posted"
        columns={groups}
        socials={demoContact.socials}
        copyright="2026 Blue Water Sail, Slip 14, Renaissance Marina"
      />
    ),
  },
  {
    code: "FOOT-04",
    category: "Footer",
    label: "Full width map strip across the top, dock details and hours underneath",
    file: "components/sections/footer/footer-04.tsx",
    component: "Footer04",
    props: "brandName: string, contact?: {address, phone, email, mapQuery, hours}, links?: Link[], socials?: Link[], copyright?: string",
    node: (
      <Footer04
        brandName={BRAND}
        contact={demoContact}
        links={mainLinks}
        socials={demoContact.socials}
        copyright="2026 Blue Water Sail"
      />
    ),
  },
  {
    code: "FOOT-05",
    category: "Footer",
    label: "Sitemap: six hairline columns, small type, mono headers",
    file: "components/sections/footer/footer-05.tsx",
    component: "Footer05",
    props: "brandName: string, tagline?: string, columns?: {title, links}[], socials?: Link[], legal?: Link[], copyright?: string",
    node: (
      <Footer05
        brandName={BRAND}
        tagline={TAGLINE}
        columns={sitemapGroups}
        socials={demoContact.socials}
        legal={legalLinks}
        copyright="2026 Blue Water Sail"
      />
    ),
  },
  {
    code: "FOOT-06",
    category: "Footer",
    label: "Brand colour booking panel sitting on top of a compact link bar",
    file: "components/sections/footer/footer-06.tsx",
    component: "Footer06",
    props: "brandName: string, ctaTitle: string, ctaBody?: string, cta?: Cta, ctaSecondary?: Cta, links?: Link[], socials?: Link[], copyright?: string",
    node: (
      <Footer06
        brandName={BRAND}
        ctaTitle="Book a trip while the water is still glass"
        ctaBody="Sunset seats go about ten days out in high season. Tell us the date and we will hold it for 24 hours."
        cta={{ label: "Check availability", href: "#book" }}
        ctaSecondary={{ label: "Call Slip 14", href: "tel:+2975881420" }}
        links={mainLinks}
        socials={demoContact.socials}
        copyright="2026 Blue Water Sail"
      />
    ),
  },
  {
    code: "FOOT-07",
    category: "Footer",
    label: "Contact forward: address, phone, an hours table and a small photo card",
    file: "components/sections/footer/footer-07.tsx",
    component: "Footer07",
    props: "brandName: string, tagline?: string, contact?: {address, phone, email, hours}, image?: Img, links?: Link[], socials?: Link[], copyright?: string",
    node: (
      <Footer07
        brandName={BRAND}
        tagline="Fifteen minutes before departure at Slip 14. Parking is free and the bus stop is two minutes away."
        contact={demoContact}
        image={{ ...img(11, "Captain Ray at the helm on a morning run"), caption: "Capt. Ray Oduber, twelve years on this stretch of coast." }}
        links={mainLinks}
        socials={demoContact.socials}
        copyright="2026 Blue Water Sail"
      />
    ),
  },
  {
    code: "FOOT-08",
    category: "Footer",
    label: "Two tone split: navigation on a card half, contact on a saturated brand half",
    file: "components/sections/footer/footer-08.tsx",
    component: "Footer08",
    props: "brandName: string, tagline?: string, columns?: {title, links}[], contact?: {address, phone, email, whatsapp}, socials?: Link[], copyright?: string",
    node: (
      <Footer08
        brandName={BRAND}
        tagline={TAGLINE}
        columns={groups.slice(0, 2)}
        contact={demoContact}
        socials={demoContact.socials}
        copyright="2026 Blue Water Sail"
      />
    ),
  },
  {
    code: "FOOT-09",
    category: "Footer",
    label: "Reveal footer: the page panel slides over a footer pinned behind it",
    file: "components/sections/footer/footer-09.tsx",
    component: "Footer09",
    props: "brandName: string, preface?: {title, body}, cta?: Cta, columns?: {title, links}[], socials?: Link[], copyright?: string",
    node: (
      <Footer09
        brandName={BRAND}
        preface={{
          title: "Still deciding which trip?",
          body: "Tell us who is coming and how long you have. We will say which boat suits and which morning has the calmest water.",
        }}
        cta={{ label: "Ask the crew", href: "#contact" }}
        columns={groups.slice(0, 3)}
        socials={demoContact.socials}
        copyright="2026 Blue Water Sail"
      />
    ),
  },
  {
    code: "FOOT-10",
    category: "Footer",
    label: "Ticker of the trips running above a compact one line bar",
    file: "components/sections/footer/footer-10.tsx",
    component: "Footer10",
    props: "brandName: string, ticker?: string[], links?: Link[], socials?: Link[], copyright?: string",
    node: (
      <Footer10
        brandName={BRAND}
        ticker={demoTours.map((t) => t.title)}
        links={mainLinks}
        socials={demoContact.socials}
        copyright="2026 Blue Water Sail"
      />
    ),
  },
];
