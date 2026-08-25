/**
 * Fish & Cook Beach Day page copy. The source page for this trip is thin:
 * mostly a booking call to action, no unique itinerary or price copy. Kept
 * honest here rather than inventing a menu or a rate, the design carries the
 * weight instead. Private charter, no strangers on the boat, free San Juan
 * pick up on request.
 */
import type { PageContent, Cta, Img } from "./types";

export const fishCookBeachDay = {
  meta: {
    title: "Fish & Cook Beach Day",
    description:
      "Catch your fish, then cook it fresh on the beach with your group. A private Caribbean Fishing Academy charter experience in San Juan, Puerto Rico.",
    path: "/fish-cook-beach-day",
  },

  hero: {
    eyebrow: "Fish & Cook Beach Day",
    title: "Building Fishtorical memories",
    body:
      "Catch it, then cook it, on the beach, with your group. All trips are private charters, which means they are all for you and yours to enjoy only. No hassle, easy process, instant confirmation. Free courtesy pick up in San Juan upon request.",
    images: [
      { src: "/ingested/caribbeanfishingacademy/img-011.webp", alt: "Contender center console fishing boat docked near the historic fort ruins on San Juan Bay" },
      { src: "/ingested/caribbeanfishingacademy/guest-el-morro.webp", alt: "Guest celebrating aboard the charter boat with El Morro fort in the background" },
    ] as Img[],
    ctas: [
      { label: "Book Now", href: "/contact-us", variant: "primary", activityId: "" },
      { label: "See Fishing Tours", href: "/fishing-tours", variant: "secondary" },
    ] as Cta[],
  },

  highlights: {
    eyebrow: "How it works",
    title: "Two parts of the same day",
    items: [
      {
        title: "Private charter, your group only",
        body:
          "Every Fish & Cook Beach Day is booked as a private trip. Nobody outside your party joins the boat, so the pace and the catch are yours to decide.",
      },
      {
        title: "No hassle booking",
        body:
          "Easy process, instant confirmation once your dates are set. Free courtesy pick up in San Juan is available on request.",
      },
    ],
  },

  beachMoment: {
    image: {
      src: "https://images.pexels.com/photos/32134793/pexels-photo-32134793.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Fisherman carrying a fresh catch of fish along the shoreline of a tropical beach",
    } as Img,
    eyebrow: "The beach half",
    title: "Bring the catch ashore",
    description:
      "Bring your catch ashore and cook it fresh with your crew, a relaxed way to close out a day on the water.",
  },

  cta: {
    badge: "Limited spots",
    title: "Text or call us for further assistance",
    body: "787-405-4100",
    image: { src: "https://images.pexels.com/photos/8671750/pexels-photo-8671750.jpeg?auto=compress&cs=tinysrgb&w=1920", alt: "A game fish breaking the surface on the line at sunset" } as Img,
    ctas: [
      { label: "Book Now", href: "/contact-us", variant: "primary", activityId: "" },
      { label: "See Fishing Tours", href: "/fishing-tours", variant: "secondary" },
    ] as Cta[],
  },
} satisfies PageContent & Record<string, unknown>;

export default fishCookBeachDay;
