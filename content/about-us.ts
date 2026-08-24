/**
 * About Us page copy. Mirrors the source site's about-us chronology: founders,
 * what CFA is, a closing quote from Capt. Burgos, and a programs teaser, then
 * a booking CTA. Facts, names and figures match the source; wording is
 * sharpened for flow.
 */
import type { PageContent, Cta, Img } from "./types";

export const aboutUs = {
  meta: {
    title: "About Us",
    description:
      "Meet Captain Luis Burgos and Captain Rich Brochue, the founders of Caribbean Fishing Academy, a nonprofit fishing charter and youth outreach program in San Juan, Puerto Rico.",
    path: "/about-us",
  },

  hero: {
    eyebrow: "About Us",
    title: "Two captains, one mission on the water",
    body:
      "Caribbean Fishing Academy Charters funds a nonprofit youth program through a professional fishing charter and bay tour business. Every trip you book pays for a kid's first day on the water.",
    images: [
      { src: "/ingested/caribbeanfishingacademy/founder-luis-burgos.webp", alt: "Captain Luis Burgos, founder and executive director of Caribbean Fishing Academy, wearing a Suzuki cap on the water" } as Img,
      { src: "/ingested/caribbeanfishingacademy/founder-rich-brochue.webp", alt: "Captain Rich Brochue, co-founder and mentor of Caribbean Fishing Academy" } as Img,
    ],
    highlights: [
      "Founded as a nonprofit in 2013",
      "IGFA representative for Puerto Rico",
      "Over 5,000 kids reached through outreach",
    ],
    ctas: [
      { label: "See Programs & Services", href: "/programs-services", variant: "primary" },
      { label: "Read what is CFA", href: "/what-is-cfa", variant: "secondary" },
    ] as Cta[],
  },

  founders: {
    heading: {
      eyebrow: "Who runs this",
      title: "Our Founders",
      body:
        "The captains behind the boats, and behind the academy that the boats support.",
    },
    members: [
      {
        name: "Captain Luis Burgos",
        role: "Executive Director / Founder",
        bio:
          "Captain Luis Burgos is a professional fishing and sailing charter captain and a community leader. He is the International Game Fish Association's (IGFA) representative for Puerto Rico and the founder and executive director of the Caribbean Fishing Academy, Inc. This nonprofit, based in Puerto Rico and affiliated with the Florida Fishing Academy, promotes responsible and ethical fishing practices and social skills development among children. Captain Burgos focuses on reinforcing social skills among youth and fostering family integration through fishing as an extracurricular activity. He collaborates with marine conservation organizations and marinas across the island, and specializes in organizing and directing fishing tournaments and seminars, including IGFA's Passport to Fishing program. He also operates Caribbean Fishing Academy Charters and Water Tours, one of the top fishing charter and water tour operations on the island, which supports his work.",
        image: { src: "/ingested/caribbeanfishingacademy/founder-luis-burgos.webp", alt: "Captain Luis Burgos on the water wearing a Suzuki cap" } as Img,
      },
      {
        name: "Captain Rich Brochue",
        role: "Co-Founder / Mentor",
        bio:
          "A former police officer with the city of Delray Beach, Captain Rich has more than 25 years as a small business owner, largely in real estate. A longtime deep-sea fisherman, he holds multiple fishing licenses and permits, has certifications in CPR and water safety, and is a USCG certified master captain. Team REEL Estate and the Florida Fishing Academy were born from his passion for fishing and boating, and his desire to teach children, including his own two daughters, how to do it safely and ethically.",
        image: { src: "/ingested/caribbeanfishingacademy/founder-rich-brochue.webp", alt: "Captain Rich Brochue, co-founder and mentor of Caribbean Fishing Academy" } as Img,
      },
    ],
  },

  whatIsCfa: {
    heading: {
      eyebrow: "The nonprofit behind the boats",
      title: "What is Caribbean Fishing Academy?",
      body:
        "CFA is a nonprofit formed in 2013 to give at-risk youth and kids in general positive life skills, alternatives to destructive behavior, and a sense of responsibility for the world around them. It uses fishing to weave life, environmental and social lessons into hands-on programs through tournaments, curriculum, workshops and field trips.",
    },
    points: [
      "Sister academy of the Florida Fishing Academy",
      "Funded mainly by Caribbean Fishing Academy Charters, our professional charter and tour operation",
      "Backed by local businesses and individuals who believe in the mission",
    ],
    image: { src: "/ingested/caribbeanfishingacademy/img-011.webp", alt: "Contender charter boat near the historic fort on San Juan Bay" } as Img,
    cta: { label: "Read what is CFA", href: "/what-is-cfa", variant: "primary" } as Cta,
    footnote: "We thank you all!",
  },

  quote: {
    text:
      "Since our inception, the CFA has used this technique to hook well over 5,000 kids throughout Puerto Rico. We are grateful to God and the dedication of our team and volunteers, for the support of people like you, to our sister academy the Florida Fishing Academy, to our world class fishing charter service and tour operation, and to all our sponsors. You have made it all possible. Muchas gracias.",
    author: "Captain Luis Burgos",
    role: "Founder, Caribbean Fishing Academy",
    image: { src: "/ingested/caribbeanfishingacademy/founder-luis-burgos.webp", alt: "Captain Luis Burgos on the water wearing a Suzuki cap" } as Img,
  },

  programsTeaser: {
    eyebrow: "Broad local support",
    title: "Programs and services",
    body:
      "Caribbean Fishing Academy enjoys broad local support. Learn more about current and planned programs.",
    cta: { label: "See Programs & Services", href: "/programs-services", variant: "primary" } as Cta,
    badges: [
      { src: "/ingested/caribbeanfishingacademy/badge-pr-tourism.png", alt: "Endorsed by the Puerto Rico Tourism Company" } as Img,
      { src: "/ingested/caribbeanfishingacademy/badge-tripadvisor.webp", alt: "Top rated on TripAdvisor" } as Img,
    ],
  },

  cta: {
    eyebrow: "Fishing with purpose",
    title: "Book a charter, support the mission",
    body: "Every trip you book helps fund our youth angling outreach program.",
    primary: { label: "Contact Us", href: "/contact-us", variant: "primary" } as Cta,
    secondary: { label: "See Programs & Services", href: "/programs-services", variant: "secondary" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default aboutUs;
