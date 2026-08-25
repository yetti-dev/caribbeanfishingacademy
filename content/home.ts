/**
 * Home page copy. Mirrors the source site's home chronology: hero, fishing
 * package teaser, sunset cruise teaser, CFA moments gallery, sponsors,
 * fishing-with-purpose mission teaser, and the upcoming-event teaser.
 */
import type { PageContent, Cta, Img } from "./types";

export const home = {
  meta: {
    title: "Caribbean Fishing Academy Charters",
    description:
      "The top fishing charter and bay tour operation in San Juan, Puerto Rico. Inshore, offshore and reef fishing, sunset and bay cruises. Fishing with purpose since 2013.",
    path: "/",
  },

  hero: {
    eyebrow: "No hassle, immediate confirmation",
    title: "Fishing charters and bay cruises in San Juan",
    body:
      "The best professional fishing captains and boat sightseeing in one place. Fish for tarpon, snapper, mahi mahi, wahoo, tuna and blue marlin, or cruise Old San Juan Bay at sunset aboard a tournament grade sport fishing boat.",
    ctas: [
      { label: "View Fishing Tours", href: "/fishing-tours", variant: "primary" },
      { label: "Book Now", href: "/contact-us", variant: "secondary", activityId: "" },
    ] as Cta[],
    images: [
      { src: "/ingested/caribbeanfishingacademy/img-011.webp", alt: "Contender center console fishing boat docked near the historic fort ruins on San Juan Bay" },
      { src: "/ingested/caribbeanfishingacademy/guest-el-morro.webp", alt: "Guest celebrating aboard the charter boat with El Morro fort in the background" },
      { src: "https://images.pexels.com/photos/10418946/pexels-photo-10418946.jpeg?auto=compress&cs=tinysrgb&w=1920", alt: "Father and son fishing together from a small boat" },
    ] as Img[],
    stats: [
      { icon: "Sailboat", value: "2013", label: "Founded as a nonprofit academy" },
      { icon: "Users", value: "5,000+", label: "Kids reached through outreach" },
      { icon: "ShieldCheck", value: "USCG", label: "Certified pro captains" },
      { icon: "Tag", value: "$585", label: "Half day inshore, from" },
    ],
  },

  toursTeaser: {
    eyebrow: "Go fishing",
    title: "Inshore, offshore or reef fishing",
    body:
      "Your choice of inshore, offshore and/or reef fishing. Included: tackle, bait, fuel, snacks, ice, water and a USCG certified pro captain. The best pro service possible of San Juan, PR.",
    price: "$585",
    priceNote: "1 to 6 guests, half day inshore",
    image: { src: "/ingested/caribbeanfishingacademy/guest-el-morro.webp", alt: "Guest giving a thumbs up aboard the charter boat with El Morro fort in the background" } as Img,
    cta: { label: "See Fishing Tours", href: "/fishing-tours", variant: "primary" } as Cta,
    highlights: [
      { icon: "Fish", label: "Tarpon, snapper, mahi mahi, wahoo, tuna and blue marlin" },
      { icon: "ShieldCheck", label: "USCG certified pro captain" },
      { icon: "Utensils", label: "Tackle, bait, snacks and ice included" },
      { icon: "Clock", label: "Half day, 3/4 day or full day trips" },
    ],
  },

  sunsetTeaser: {
    eyebrow: "Sail or power boat",
    title: "Sunset or bay cruise (sailing or boating)",
    body:
      "Free appetizers and drinks special. Your choice of sailing or power boating the stunning waters of Old San Juan. Included: appetizers, local drink, ice, water and a pro captain. The best pro service possible of San Juan, PR.",
    price: "$595",
    priceNote: "1 to 6 guests, free tapas on 3 hour trips",
    image: { src: "/ingested/caribbeanfishingacademy/img-011.webp", alt: "Fishing boat cruising Old San Juan Bay past the historic fort" } as Img,
    cta: { label: "See Sunset & Bay Cruise", href: "/sunset-or-bay-cruise", variant: "primary" } as Cta,
    highlights: [
      { icon: "Landmark", label: "El Morro, La Fortaleza and the Bacardi Factory" },
      { icon: "Sunset", label: "Day or sunset outing" },
      { icon: "Wine", label: "Free appetizers and local drinks" },
      { icon: "Users", label: "Up to 6 guests aboard" },
    ],
  },

  momentsGallery: {
    eyebrow: "Real guests, real fun",
    title: "This is what a day with us actually looks like",
    body: "Every one of these is a real guest or a real moment from a Caribbean Fishing Academy charter.",
    images: [
      { src: "/ingested/caribbeanfishingacademy/guest-el-morro.webp", alt: "Guest celebrating a catch with El Morro fort behind her" },
      { src: "https://images.pexels.com/photos/5046354/pexels-photo-5046354.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Group celebrating a birthday charter on the water" },
      { src: "/ingested/caribbeanfishingacademy/img-011.webp", alt: "Contender fishing boat docked on San Juan Bay at dusk" },
      { src: "https://images.pexels.com/photos/31206315/pexels-photo-31206315.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "A young angler holding a fish on the dock" },
      { src: "https://images.pexels.com/photos/32134793/pexels-photo-32134793.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Carrying the day's catch along the shoreline" },
      { src: "/ingested/caribbeanfishingacademy/founder-luis-burgos.webp", alt: "Captain Luis Burgos, founder of Caribbean Fishing Academy" },
      { src: "/ingested/caribbeanfishingacademy/founder-rich-brochue.webp", alt: "Captain Rich Brochue, co-founder and mentor of Caribbean Fishing Academy" },
      { src: "https://images.pexels.com/photos/14236883/pexels-photo-14236883.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Father and son fishing together in shallow turquoise water" },
      { src: "https://images.pexels.com/photos/16477585/pexels-photo-16477585.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Two anglers aboard a charter boat trolling in deep blue water" },
      { src: "https://images.pexels.com/photos/8671750/pexels-photo-8671750.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "A game fish breaking the surface on the line at sunset" },
    ] as Img[],
  },

  sponsors: {
    title: "We are proud supporters and collaborators of",
    strip: { src: "/ingested/caribbeanfishingacademy/sponsors-strip.webp", alt: "Logos of Caribbean Fishing Academy sponsors: Suzuki Marine, Puerto Del Rey, Actual Mortgage Bankers, Bluewaters Insurers, Domino's Pizza, Antilles Power and more" } as Img,
    badges: [
      { src: "/ingested/caribbeanfishingacademy/badge-pr-tourism.png", alt: "Endorsed by the Puerto Rico Tourism Company" } as Img,
      { src: "/ingested/caribbeanfishingacademy/badge-tripadvisor.webp", alt: "Top rated on TripAdvisor" } as Img,
    ],
  },

  purpose: {
    eyebrow: "Fishing with purpose",
    title: "Every trip helps a kid who needs it",
    body:
      "By booking us, you help us continue our angling outreach program designed for local kids. Caribbean Fishing Academy is a nonprofit organization, proud partner of Beyond Our Shores, teaching youth positive life skills through fishing.",
    ctas: [
      { label: "Read Our Mission", href: "/mission-vision", variant: "primary" },
      { label: "Keep Informed on Facebook", href: "https://www.facebook.com/CFA-Caribbean-Fishing-Academy-708696695823502/", variant: "secondary", external: true },
    ] as Cta[],
  },

  proximoTeaser: {
    eyebrow: "Proximo evento",
    title: "Torneo de Pesca Infantil",
    body:
      "Te invita Safe Harbor Puerto del Rey en colaboracion con CFA. Un torneo de pesca de muelle para los ninos en los muelles de la Marina Puerto del Rey, disenado para fomentar la union familiar.",
    facts: [
      { icon: "CalendarDays", label: "19 de octubre" },
      { icon: "Clock", label: "8am a 12pm" },
      { icon: "Users", label: "Edades 2 a 14" },
    ],
    image: { src: "/ingested/caribbeanfishingacademy/kids-tournament-flyer.webp", alt: "Flyer for the Torneo de Pesca Infantil kids fishing tournament, October 19, 8am to 12pm" } as Img,
    cta: { label: "Inscripciones", href: "/proximo-evento", variant: "primary" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default home;
