/**
 * Programs & Services page copy. Mirrors the source page's four offerings
 * (tournaments and workshops, birthday parties, water tours, summer camps)
 * plus the custom-events note and a closing CTA to book or read about the
 * Sea Life Research Expeditions.
 */
import type { PageContent, Cta, Img, SectionHeading } from "./types";

export const programsServices = {
  meta: {
    title: "Programs & Services",
    description:
      "Fishing tournaments, workshops, birthday parties, water tours and summer camps from Caribbean Fishing Academy, a nonprofit teaching Puerto Rico's youth through fishing.",
    path: "/programs-services",
  },

  hero: {
    eyebrow: "Programs & Services",
    title: "Fishing with a purpose",
    body:
      "The Caribbean Fishing Academy has spent years delivering a celebrated fishing education and life skills program, custom designed by our sister academy, the Florida Fishing Academy. At its heart, the Angling For a Healthy Future curriculum is an environmental awareness initiative that teaches children, tomorrow's boaters, anglers and environmental stewards, to enjoy the Caribbean's fragile marine resources in a way that preserves the ecosystem for generations to come. The program also arms these kids with the tools to resist the temptations of the streets and gain a richer appreciation for our local waters.",
    ctas: [
      { label: "Contact Us", href: "/contact-us", variant: "primary" },
      { label: "See Fishing Tours", href: "/fishing-tours", variant: "secondary" },
    ] as Cta[],
    images: [
      { src: "/ingested/caribbeanfishingacademy/guest-el-morro.webp", alt: "Guest celebrating aboard the charter boat with El Morro fort in the background" },
      { src: "/ingested/caribbeanfishingacademy/img-011.webp", alt: "Contender charter boat docked near the historic fort ruins on San Juan Bay" },
    ] as Img[],
  },

  heading: {
    eyebrow: "What we run",
    title: "Four ways CFA gets kids and families on the water",
  } as SectionHeading,

  rows: [
    {
      title: "Fishing Tournaments & Workshops",
      icon: "Trophy",
      body:
        "Youth tournaments and hands-on workshops that put the Angling for a Healthy Future curriculum into practice on the water.",
      image: {
        src: "https://images.pexels.com/photos/31206315/pexels-photo-31206315.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Boy on a dock raising a freshly caught fish during a youth fishing tournament",
      } as Img,
    },
    {
      title: "Birthday Parties",
      icon: "PartyPopper",
      body:
        "Celebrate on the water: a birthday charter built around fishing, boating and time with family.",
      image: {
        src: "https://images.pexels.com/photos/5046354/pexels-photo-5046354.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Group celebrating a birthday with balloons and a toast aboard a boat on the water",
      } as Img,
    },
    {
      title: "Water Tours",
      icon: "Compass",
      body:
        "CFA offers the general public a chance to build Fishtorical memories. Our tournament grade fishing charter service is a fun way to collaborate and support our cause. Check out our fishing packages designed for quality time on our productive fishing grounds.",
      image: {
        src: "https://images.pexels.com/photos/10418946/pexels-photo-10418946.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Father and son fishing together from a small boat on calm water",
      } as Img,
    },
    {
      title: "Summer Camps",
      icon: "Sun",
      body:
        "CFA will soon offer a signature inshore fishing summer camp. Campers attending the week-long fishing camp learn valuable lessons from our proven Angling for a Healthy Future program, plus other typical summer camp activities. Call us for more information.",
      image: {
        src: "https://images.pexels.com/photos/31206319/pexels-photo-31206319.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Boy in fishing gear and a wide-brim hat smiling on a dock, ready for a day of camp fishing",
      } as Img,
    },
  ] as { title: string; icon: string; body: string; image: Img }[],

  customEvents: {
    eyebrow: "Custom events",
    title: "Bring your own group",
    body:
      "Would you like CFA to organize your next activity? We can do that for you, or collaborate on your next event, customized for your community's needs, from kids fishing tournaments to fishing workshops, or a combination of both. Our experience and resources are at your service.",
  } as SectionHeading,

  cta: {
    badge: "Let's talk",
    title: "Bring CFA to your next event",
    body:
      "Call or text 787-405-4100 to book a tournament, a workshop, a birthday charter or a water tour, or to ask about the upcoming summer camp. We will help you plan a day on the water your group will remember.",
    image: { src: "/ingested/caribbeanfishingacademy/founder-luis-burgos.webp", alt: "Captain Luis Burgos, founder of Caribbean Fishing Academy, on the dock" } as Img,
    ctas: [
      { label: "Contact Us", href: "/contact-us", variant: "primary" },
      { label: "See Sea Life Research Expeditions", href: "/sea-life-research-expeditions", variant: "secondary" },
    ] as Cta[],
  },
} satisfies PageContent & Record<string, unknown>;

export default programsServices;
