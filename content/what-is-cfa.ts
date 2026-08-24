/**
 * "What is CFA?" page copy. Mirrors the source site's own Q&A structure:
 * the nonprofit's origin and mission, how the program works, what sets it
 * apart, where it is headed, and why a donation or a booking matters.
 */
import type { PageContent, Cta, FaqItem, Img } from "./types";

export const whatIsCfa = {
  meta: {
    title: "What is CFA?",
    description:
      "How Caribbean Fishing Academy uses fishing to teach Puerto Rico's youth life skills, why it exists, and how booking a charter supports the mission.",
    path: "/what-is-cfa",
  },

  hero: {
    eyebrow: "What is CFA?",
    title: "What is Caribbean Fishing Academy?",
    body: "The nonprofit behind every charter you book with us.",
    image: {
      src: "/brand/welcome-banner.png",
      alt: "Caribbean Fishing Academy welcome banner: the CFA oval crest with a San Juan fort turret, a sailfish and a tuna over the tagline It's Simply Fishtorical",
    } as Img,
    ctas: [
      { label: "Book Now", href: "/contact-us", variant: "primary" },
      { label: "Programs & Services", href: "/programs-services", variant: "secondary" },
    ] as Cta[],
  },

  faq: {
    heading: {
      eyebrow: "The nonprofit, explained",
      title: "Five questions we get about CFA",
      body: "The academy behind the boats: why it started, how it teaches, and where it is headed next.",
    },
    items: [
      {
        q: "What is Caribbean Fishing Academy?",
        a: "The Caribbean Fishing Academy (CFA) is a nonprofit organization formed in 2013 to empower at-risk youth, and youth in general, with positive life skills, alternatives to destructive or antisocial behavior, and a sense of responsibility for shaping the world around them. CFA uses fishing as a vehicle for delivering these lessons, weaving life, environmental and social skills into hands-on educational programs through youth tournaments, curriculum, workshops and field trips. We are the sister academy of the Florida Fishing Academy.",
      },
      {
        q: "How does CFA work?",
        a: "Our programs tap into kids' natural interest in fishing and other water activities to build new skills, a sense of accomplishment, self-esteem and a desire to protect our natural resources. Participating in fishing-based programs also makes them more open to other instruction, especially the academy's Botvin Lifeskills Training Program, which has been shown to reduce tobacco use by 87%, alcohol by 60%, marijuana by 75% and other drugs by 68%, while also reducing school delinquency, misbehavior and violence, according to the American Medical Association.",
      },
      {
        q: "What makes CFA different from similar organizations?",
        a: "CFA uses an asset available to everyone: the spectacular marine world of the Caribbean. Fishing and the water are part of the fabric of Puerto Rico and the Caribbean, and there is no more effective way to introduce our youth to a richer, more productive life. Our program engages children, tomorrow's anglers, boaters, marine biologists and environmental stewards, in fishing as a sport and livelihood, while involving them in preserving our fragile marine environment. Since our inception, CFA has used this technique to reach well over 5,000 kids throughout Puerto Rico.",
      },
      {
        q: "What are CFA's goals for the future?",
        a: "We have recently shared our program with the Bahamas (Nassau), and our goal is to increase access to our programs throughout the Caribbean: keep actively impacting communities across Puerto Rico, then expand to the US Virgin Islands, then the British Virgin Islands.",
      },
      {
        q: "How can you make a difference with CFA?",
        a: "Documented evidence shows that every $1 spent redirecting disadvantaged youth saves $25 in costs that would otherwise go to the criminal justice system. Your contribution engages, inspires, educates and positively redirects at-risk and disadvantaged youth in Puerto Rico, reducing local crime, unemployment, teen pregnancy, drug use and youth violence, and improving the safety of the neighborhoods and streets right here at home.",
      },
    ] as FaqItem[],
  },

  story: {
    text:
      "On September 26, 2013, a group of fishing guides, captains and volunteers gave the first Angling for a Healthy Future class to 14 kids in the outdoor hallway of a local public housing project, using overturned shopping carts as benches. Today we offer a safe place to teach fishing and life skills through our proven hands-on angling outreach program. So far we have impacted over 300,000 people and served more than ten organizations.",
    author: "Caribbean Fishing Academy",
    role: "Founded September 26, 2013",
  },

  cta: {
    heading: {
      eyebrow: "Book a charter, fund the mission",
      title: "Every trip you book helps a kid who needs it",
      body: "Half day, full day or sunset cruise: every booking with Caribbean Fishing Academy Charters helps fund the outreach program above. Book a trip, or see the programs that money supports.",
    },
    primary: { label: "Book Now", href: "/contact-us", variant: "primary" } as Cta,
    secondary: { label: "See Programs & Services", href: "/programs-services", variant: "secondary" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default whatIsCfa;
