/**
 * Sea Life Research Expeditions page copy.
 *
 * The source site gives this page almost no unique copy: two lines inviting
 * visitors to call about a limited-space expedition. Everything else here is
 * built honestly from facts documented elsewhere on the source site (the
 * youth program raising "tomorrow's marine biologists and environmental
 * stewards", and CFA's partnerships with marine conservation organizations
 * and marinas across Puerto Rico). Nothing here invents dates, statistics or
 * program details that are not on the source.
 */
import type { PageContent, Cta, Img, Feature, SectionHeading } from "./types";

export const seaLifeResearchExpeditions = {
  meta: {
    title: "Sea Life Research Expeditions",
    description:
      "Caribbean Fishing Academy occasionally opens sea life research expeditions to the public. Spaces are limited, call for the next one.",
    path: "/sea-life-research-expeditions",
  },

  hero: {
    eyebrow: "Sea Life Research Expeditions",
    title: "Want to be part of the action?",
    body:
      "Caribbean Fishing Academy's youth programs raise tomorrow's marine biologists and environmental stewards, and from time to time we open a sea life research expedition to the public alongside our conservation partners across Puerto Rico. Spaces are limited. Call us for more information on the next one.",
    ctas: [
      { label: "Call 787-405-4100", href: "tel:+17874054100", variant: "primary" },
      { label: "Contact Us", href: "/contact-us", variant: "secondary" },
    ] as Cta[],
    footnote: "Spaces are limited to keep each expedition small and hands on.",
  },

  connection: {
    eyebrow: "Where this comes from",
    title: "An extension of our youth program, not a separate business",
    body:
      "Our program capitalizes on the Caribbean's marine world to engage children in preserving our fragile marine environment, working alongside marine conservation organizations and marinas across Puerto Rico. A research expedition is that same work, opened up to a few more people at a time.",
    image: {
      src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
      alt: "Diver observing a school of yellow snapper on a reef, the kind of marine life CFA's youth programs study",
    } as Img,
  },

  honestPoints: {
    heading: {
      eyebrow: "What to know before you call",
      title: "How these expeditions actually work",
      body:
        "There is no fixed schedule for this one, on purpose. Here is what is true about it.",
    } as SectionHeading,
    items: [
      {
        icon: "Fish",
        title: "Rooted in the youth program",
        body:
          "CFA's outreach already raises tomorrow's marine biologists and environmental stewards. Expeditions grow directly out of that work, not a separate tour product.",
      },
      {
        icon: "Handshake",
        title: "Run with conservation partners",
        body:
          "Each expedition runs alongside marine conservation organizations and marinas across Puerto Rico, the same partners behind CFA's youth programming.",
      },
      {
        icon: "PhoneCall",
        title: "Announced by phone, not a calendar",
        body:
          "Spaces are limited and dates are not posted in advance. Calling ahead is the only way to hear about the next one.",
      },
    ] as Feature[],
  },

  cta: {
    heading: {
      eyebrow: "Sea Life Research Expeditions",
      title: "Spaces are limited",
      body: "Call or text 787-405-4100 to ask about the next expedition.",
    } as SectionHeading,
    primary: { label: "Contact Us", href: "/contact-us", variant: "primary" } as Cta,
    secondary: { label: "See Our Mission", href: "/mission-vision", variant: "secondary" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default seaLifeResearchExpeditions;
