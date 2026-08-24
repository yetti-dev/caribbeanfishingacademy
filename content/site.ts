/**
 * Shared chrome copy: navbar, footer, global CTA.
 *
 * The live menu at caribbeanfishingacademy.com is a flat 10 item list. Every
 * one of those pages is still a real, fully built route here (plus Community
 * and Fish & Cook Beach Day), just grouped into a minimal top-level nav with
 * two dropdowns so the bar itself stays short. Nothing was removed or renamed.
 */
import type { NavItem, Cta, Link } from "./types";

export const site = {
  nav: [
    { label: "Home", href: "/" },
    { label: "Fishing Tours", href: "/fishing-tours" },
    { label: "Sunset Cruise", href: "/sunset-or-bay-cruise" },
    {
      label: "Explore",
      href: "/programs-services",
      children: [
        { label: "Programs & Services", href: "/programs-services" },
        { label: "Sea Life Research Expeditions", href: "/sea-life-research-expeditions" },
        { label: "Fish & Cook Beach Day", href: "/fish-cook-beach-day" },
        { label: "Proximo Evento", href: "/proximo-evento" },
      ],
    },
    {
      label: "About",
      href: "/about-us",
      children: [
        { label: "About Us", href: "/about-us" },
        { label: "Mission + Vision", href: "/mission-vision" },
        { label: "What is CFA?", href: "/what-is-cfa" },
        { label: "Community", href: "/community" },
      ],
    },
    { label: "Contact Us", href: "/contact-us" },
  ] as NavItem[],

  navCta: { label: "Book Now", href: "/contact-us", variant: "primary" } as Cta,

  footer: {
    blurb:
      "A USCG certified fishing charter and bay tour operation in San Juan, Puerto Rico. Every trip helps fund our angling outreach program for local kids.",
    groups: [
      {
        title: "Trips",
        links: [
          { label: "Fishing Tours", href: "/fishing-tours" },
          { label: "Sunset or Bay Cruise", href: "/sunset-or-bay-cruise" },
          { label: "Fish & Cook Beach Day", href: "/fish-cook-beach-day" },
          { label: "Proximo Evento", href: "/proximo-evento" },
        ] as Link[],
      },
      {
        title: "About CFA",
        links: [
          { label: "About Us", href: "/about-us" },
          { label: "Mission + Vision", href: "/mission-vision" },
          { label: "What is CFA?", href: "/what-is-cfa" },
          { label: "Programs & Services", href: "/programs-services" },
          { label: "Sea Life Research Expeditions", href: "/sea-life-research-expeditions" },
          { label: "Community", href: "/community" },
          { label: "Contact Us", href: "/contact-us" },
        ] as Link[],
      },
    ],
    legal: "Caribbean Fishing Academy, Inc. / CFA, Corp.",
  },
} as const;

export default site;
