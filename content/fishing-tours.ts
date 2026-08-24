/**
 * Fishing Tours page copy. The site's core commercial page: the six charter
 * fares (reef, inshore, offshore, at half day, three quarter day and full
 * day), the vessel, what is included, and the booking CTA. Prices and species
 * are exact from the source site; only phrasing is sharpened.
 */
import type { PageContent, Cta, Img, PriceTier } from "./types";

export const fishingTours = {
  meta: {
    title: "Fishing Tours",
    description:
      "Inshore, offshore and reef fishing charters in San Juan, Puerto Rico from $585. Private trips for up to 6 guests aboard a tournament grade Contender.",
    path: "/fishing-tours",
  },

  hero: {
    eyebrow: "Go fishing",
    title: "Inshore, offshore and reef fishing charters",
    body:
      "Private charters out of San Juan Bay for tarpon, snapper, mahi mahi, wahoo, tuna and blue marlin, run by USCG certified pro captains. Pick your grounds, pick your hours, and we handle the rest.",
    image: {
      src: "/ingested/caribbeanfishingacademy/img-011.webp",
      alt: "Contender center console fishing boat docked near the historic fort ruins on San Juan Bay",
    } as Img,
    price: "$585",
    period: "half day",
    duration: "4 hours",
    ctas: [
      { label: "Book Now", href: "/contact-us", variant: "primary" },
      { label: "See All Fares", href: "#fares", variant: "secondary" },
    ] as Cta[],
  },

  pricing: {
    eyebrow: "Fares",
    title: "Six ways to go fishing",
    body:
      "Every fare below is a private charter for your group only, no strangers added to fill the boat. Add a second ground to any trip for just $100 more.",
    tiers: [
      {
        name: "Reef Fishing",
        price: "From $610",
        body: "Choose 1 ticket only. The 1st guest pays the rate, then it's $25 per additional person.",
        features: [
          "Mutton snappers, yellow snappers, AJs, grouper, king mackerel, sharks and more",
          "Combine with inshore or offshore fishing for just $100 more",
        ],
        cta: { label: "Book This Trip", href: "/contact-us", variant: "primary" },
      },
      {
        name: "1/2 Day Inshore",
        price: "From $585",
        period: "4 hours",
        body: "1 to 6 guests. The 1st guest pays $585, each additional guest just $25.",
        features: [
          "Tarpon, snook, jack crevalle, king mackerel, snapper and/or juvenile sharks",
          "Combine with reef fishing for just $100 more",
        ],
        cta: { label: "Book This Trip", href: "/contact-us", variant: "primary" },
        featured: true,
      },
      {
        name: "1/2 Day Offshore",
        price: "From $699",
        period: "4 hours",
        body: "1 to 5 guests.",
        features: [
          "Combine with inshore or reef fishing for just $100 more",
        ],
        cta: { label: "Book This Trip", href: "/contact-us", variant: "primary" },
      },
      {
        name: "3/4 Day Inshore",
        price: "From $685",
        period: "6 hours",
        body: "The 1st guest pays $685, each additional guest just $25.",
        features: [
          "Tarpon, snook, jack crevalle, king mackerel, snapper and/or juvenile sharks",
          "Combine with reef fishing for just $100 more",
        ],
        cta: { label: "Book This Trip", href: "/contact-us", variant: "primary" },
      },
      {
        name: "3/4 Day Offshore",
        price: "From $899",
        period: "6 hours",
        body: "A flat rate for up to 5 guests.",
        features: [
          "Mahi-mahi, tuna, wahoo, billfish like blue marlin, white marlin and/or sailfish, depending on season",
          "Combine with inshore or reef fishing for just $100 more",
        ],
        cta: { label: "Book This Trip", href: "/contact-us", variant: "primary" },
      },
      {
        name: "Full Day Offshore",
        price: "From $1,100",
        period: "8 hours",
        body: "The full run at the deep water species.",
        features: [
          "Mahi-mahi, tuna, wahoo, billfish like blue marlin, white marlin and/or sailfish, depending on season",
          "Combine with reef or inshore fishing for just $100 more",
        ],
        cta: { label: "Book This Trip", href: "/contact-us", variant: "primary" },
      },
    ] as PriceTier[],
  },

  vessel: {
    eyebrow: "The boat",
    title: "A Contender 25T, built for the fight",
    body:
      "This Contender 25' is a legendary center console with a specially designed deep-v hull, built for stability and performance even in rough conditions. Plenty of shade, a spacious cockpit, and excellent for both inshore and offshore fishing, for groups up to 6 guests inshore and up to 5 offshore. Outfitted with tournament grade tackle and full electronics to maximize your chances at a trophy fish.",
    specs: [
      "2023 Suzuki twin 150hp engines",
      "T-top for shade",
      "Full 2022 refit: rewiring, electronics and a redesigned center console",
      "Tournament grade tackle and full electronics",
    ],
    image: {
      src: "/ingested/caribbeanfishingacademy/img-011.webp",
      alt: "The Contender 25 Game Day center console docked near the fort on San Juan Bay",
    } as Img,
    reservation: {
      title: "Information and reservation",
      included: {
        label: "Included on all fishing trips",
        body:
          "A pro USCG certified captain, fuel, quality tackle, bait (subject to availability), lures, bottled water, ice and a fishing license. Light snacks and an ice cooler are offered on all trips, and you're welcome to bring your own beverages and snacks.",
      },
      notIncluded: {
        label: "Not included",
        body: "Gratuities, greatly appreciated.",
      },
      image: {
        src: "/ingested/caribbeanfishingacademy/guest-el-morro.webp",
        alt: "Guest giving a thumbs up aboard the charter boat with El Morro fort in the background",
      } as Img,
    },
  },

  goodToKnow: {
    eyebrow: "Good to know",
    title: "Before you cast off",
    body:
      "Bring sunscreen, sunglasses, a hat and rain gear if needed. All trips are private charters for you and your group only. Deposits are refundable if canceled 30 days before the trip. All bookings help fund our youth angling outreach program.",
    cta: { label: "Why we do this", href: "/mission-vision", variant: "secondary" } as Cta,
  },

  cta: {
    title: "No hassle, easy process, instant confirmation",
    body: "Text or call 787-405-4100.",
    ctas: [
      { label: "Book Now", href: "/contact-us", variant: "primary" },
      { label: "See Sunset & Bay Cruise", href: "/sunset-or-bay-cruise", variant: "secondary" },
    ] as Cta[],
  },
} satisfies PageContent & Record<string, unknown>;

export default fishingTours;
