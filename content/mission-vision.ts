/**
 * Mission + Vision page copy. Source: caribbeanfishingacademy.com mission and
 * vision statements, lightly tightened for flow. Every point from the source
 * is preserved; nothing is invented.
 */
import type { PageContent, Cta, Img, Feature, SectionHeading } from "./types";

export const missionVision = {
  meta: {
    title: "Mission + Vision",
    description:
      "The mission and vision behind Caribbean Fishing Academy: teaching Puerto Rico's youth healthy life skills and a love of the ocean through fishing.",
    path: "/mission-vision",
  },

  hero: {
    eyebrow: "Mission + Vision",
    title: "Mission and vision",
    body:
      "Caribbean Fishing Academy is a nonprofit built on one belief: a rod in a kid's hand can change where their life goes. Here is the mission we run our trips to fund, and the vision we are working toward.",
    ctas: [
      { label: "Programs & Services", href: "/programs-services", variant: "primary" },
      { label: "Book a Charter", href: "/contact-us", variant: "secondary", activityId: "" },
    ] as Cta[],
    images: [
      { src: "/ingested/caribbeanfishingacademy/img-011.webp", alt: "Contender charter boat docked near the historic fort ruins on San Juan Bay" },
      { src: "/ingested/caribbeanfishingacademy/guest-el-morro.webp", alt: "Guest celebrating aboard the charter boat with El Morro fort in the background" },
    ] as Img[],
  },

  missionHeading: {
    eyebrow: "The mission",
    title: "Educational fishing, aimed at family and community",
    body:
      "To promote educational fishing and social programs aimed at improving kids' social skills and family integration, while getting them involved in fishing as an extracurricular activity.",
  } as SectionHeading,

  missionPoints: [
    {
      icon: "Heart",
      title: "A healthy lifestyle",
      body: "Teaching youth a healthy lifestyle and a constructive hobby they can keep for life.",
    },
    {
      icon: "ShieldCheck",
      title: "Away from drugs and violence",
      body: "Guiding youth away from drugs and violence with a positive, hands on alternative.",
    },
    {
      icon: "Leaf",
      title: "Protecting our waters",
      body: "Engaging youth in the fight to preserve the Caribbean's fragile natural resources.",
    },
    {
      icon: "Compass",
      title: "A path into the industry",
      body: "Introducing youth to the fishing and marine industries as a potential career path.",
    },
  ] as Feature[],

  vision: {
    eyebrow: "The vision",
    text:
      "Our programs seek to promote family values and reduce crime, bullying and other issues that affect our entire society. As a byproduct of these efforts, they contribute to healthier recreational fishing practices and nourish the commercial fishing industry.",
    author: "Caribbean Fishing Academy",
    role: "Vision statement",
    image: {
      src: "/ingested/caribbeanfishingacademy/founder-luis-burgos.webp",
      alt: "Captain Luis Burgos, founder of Caribbean Fishing Academy, on the dock",
    } as Img,
  },

  cta: {
    heading: {
      eyebrow: "Fishing with purpose",
      title: "See it in action",
      body:
        "Every charter and cruise we run funds the outreach behind this mission. Read about the programs it pays for, then come out on the water with us.",
    } as SectionHeading,
    primary: { label: "Programs & Services", href: "/programs-services", variant: "primary" } as Cta,
    secondary: { label: "Book a Charter", href: "/contact-us", variant: "secondary", activityId: "" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default missionVision;
