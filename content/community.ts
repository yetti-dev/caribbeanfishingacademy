/**
 * Community page copy. Source: caribbeanfishingacademy.com/community.html, a
 * short thank-you page anchored by two real sponsor logo strips. Copy is
 * tightened for flow; every fact and every sponsor named on the source stays.
 */
import type { PageContent, Cta, Img, SectionHeading } from "./types";

export const community = {
  meta: {
    title: "Community",
    description:
      "The local businesses, marinas and organizations that sponsor and partner with Caribbean Fishing Academy's youth outreach program in San Juan, Puerto Rico.",
    path: "/community",
  },

  hero: {
    eyebrow: "Community",
    title: "Local communities and entities are coming together",
    body:
      "Local communities and entities are coming together, shoulder to shoulder, through fishing. Thank you to all our sponsors and the different organizations that have joined this community outreach effort, with the hope of improving everyone's quality of life.",
    images: [
      { src: "/ingested/caribbeanfishingacademy/founder-luis-burgos.webp", alt: "Captain Luis Burgos, founder of Caribbean Fishing Academy, on the dock" },
      { src: "/ingested/caribbeanfishingacademy/kids-tournament-flyer.webp", alt: "Flyer for the CFA kids fishing tournament at Puerto del Rey Marina" },
      { src: "/ingested/caribbeanfishingacademy/img-011.webp", alt: "Contender fishing boat docked near the historic fort ruins on San Juan Bay" },
      { src: "/ingested/caribbeanfishingacademy/guest-el-morro.webp", alt: "Guest celebrating a catch with El Morro fort in the background" },
    ] as Img[],
  },

  founder: {
    eyebrow: "Led by a captain, not a committee",
    title: "One captain, a boat and a growing list of partners",
    body:
      "Led by Captain Luis Burgos and the Caribbean Fishing Academy team, every charter booked helps fund this outreach. What started as one nonprofit academy now runs on the goodwill of marinas, insurers, boat builders and neighborhood businesses across San Juan, all pulling for the same kids.",
    image: {
      src: "/ingested/caribbeanfishingacademy/founder-luis-burgos.webp",
      alt: "Captain Luis Burgos, founder of Caribbean Fishing Academy, on the dock",
    } as Img,
    cta: { label: "Read Our Mission", href: "/mission-vision", variant: "primary" } as Cta,
  },

  sponsors: {
    eyebrow: "Thank you",
    title: "Sponsors and organizations behind the outreach",
    body:
      "From marinas to marine dealers to neighborhood restaurants, these are the partners who put their name behind the program.",
    rowOne: {
      src: "/ingested/caribbeanfishingacademy/img-027.webp",
      alt: "Sponsor logos including Panama Jack, West Marine, Actual Mortgage Bankers, Bluewaters Insurers, Bayer, Suzuki Marine, Puerto Del Rey, Allied Car and Truck Rental, La Regata, Yacht Center, Mojo and Cangrejeros",
    } as Img,
    rowTwo: {
      src: "/ingested/caribbeanfishingacademy/sponsors-strip.webp",
      alt: "Sponsor logos including Burgos and Brein Wealth Management, Bluewaters, Actual Mortgage Bankers, Domino's Pizza, Suzuki Marine, Antilles Power and Puerto Del Rey",
    } as Img,
  } as SectionHeading & { rowOne: Img; rowTwo: Img },

  cta: {
    heading: {
      eyebrow: "Join the effort",
      title: "Become part of the community",
      body:
        "Own a local business, marina or boat brand and want your name on the same list. Sponsor a tournament, donate gear, or just spread the word. Every partnership funds another kid's day on the water.",
    } as SectionHeading,
    primary: { label: "Contact Us", href: "/contact-us", variant: "primary" } as Cta,
    secondary: { label: "About Us", href: "/about-us", variant: "secondary" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default community;
