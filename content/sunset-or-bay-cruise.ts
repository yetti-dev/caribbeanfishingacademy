/**
 * Sunset or Bay Cruise page copy. Mirrors the source page's chronology: hero
 * with the private-charter pitch, the experience explained, the two vessel
 * choices, what is included, the fine print, then a booking CTA. Facts,
 * prices and figures match the source; wording is sharpened for flow.
 */
import type { Boat } from "./demo";
import type { Cta, Img, PageContent, SectionHeading } from "./types";
import { ACTIVITIES } from "./activities";

export const sunsetOrBayCruise = {
  meta: {
    title: "Sunset or Bay Cruise",
    description:
      "Private sunset and bay cruises in Old San Juan aboard a sailboat or power boat, past El Morro Castle and La Fortaleza. From $595 for up to 6 guests.",
    path: "/sunset-or-bay-cruise",
  },

  hero: {
    eyebrow: "Sail or power boat",
    title: "Sunset or bay cruise",
    body:
      "Private for you and yours. Cruise the stunning waters of Old San Juan Bay full of Caribbean flare, past El Morro Castle, La Fortaleza, the Bacardi Factory and more.",
    images: [
      { src: "/ingested/caribbeanfishingacademy/guest-el-morro.webp", alt: "Guest celebrating aboard the charter boat with El Morro fort in the background" },
      { src: "/ingested/caribbeanfishingacademy/img-011.webp", alt: "Contender center console power boat cruising near the historic fort ruins on San Juan Bay at dusk" },
      { src: "https://live.staticflickr.com/7513/15807098322_b06d3982df_b.jpg", alt: "Sailboat cruising near a tropical shoreline at sunset" },
    ] as Img[],
    price: "$595",
    duration: "3 hour trips",
    ctas: [
      { label: "Book Now", href: "/contact-us", variant: "primary", activityId: ACTIVITIES.sunsetCruise.id },
      { label: "View Fishing Tours", href: "/fishing-tours", variant: "secondary" },
    ] as Cta[],
  },

  priceNote: "1 to 6 guests. Free appetizers and local drinks on every 3 hour trip.",

  experience: {
    heading: {
      eyebrow: "How it works",
      title: "Your bay, your boat, your pace",
      body:
        "Your choice of sailing or boating the historical landmarks of Old San Juan, headlined by El Morro Castle. Choose a day outing or a sunset outing with tapas and a drink included for a limited time. Our captain and crew share San Juan's history and Caribbean flare along the way, and up to 6 guests may come aboard.",
    } as SectionHeading,
    features: [
      {
        icon: "Landmark",
        title: "Old San Juan's landmarks",
        body: "El Morro Castle, La Fortaleza and the Bacardi Factory pass by from the water, a view the walled city does not give you on foot.",
      },
      {
        icon: "Sunset",
        title: "Day or sunset outing",
        body: "Pick a daytime cruise or the sunset outing with tapas and a drink included for a limited time.",
      },
      {
        icon: "Heart",
        title: "Special requests welcome",
        body: "Building a memory with your loved ones is the point. Tell us what you have in mind and we will work to make it happen.",
      },
      {
        icon: "Clock",
        title: "Departure times",
        body: "Your choice of departure time, to be confirmed with the captain ahead of your trip.",
      },
    ],
  },

  fleet: {
    heading: {
      eyebrow: "Two ways to cruise",
      title: "Choose your vessel",
      body: "Every private cruise goes out aboard one of two boats. Both carry up to 6 guests and a licensed captain.",
    } as SectionHeading,
    boats: [
      {
        name: "Game Day",
        type: "Center console power boat",
        length: "25 ft",
        guests: 6,
        year: "2014, refitted 2023",
        body:
          "A 2014 Contender 25T completely refitted in 2023 with new twin Suzuki 150 hp engines, all new electrical components and electronics, and a redesigned center console. The deep-v hull holds steady even in rough conditions, and the T-top keeps the cockpit shaded. Also the perfect vessel for a fish and cook beach day.",
        image: {
          src: "/ingested/caribbeanfishingacademy/img-011.webp",
          alt: "Game Day, the 2014 Contender 25 foot center console power boat, near the historic fort on San Juan Bay",
        } as Img,
        specs: [
          { label: "Engines", value: "Twin Suzuki 150hp" },
          { label: "Live well", value: "34 gallon" },
          { label: "Fish boxes", value: "3" },
          { label: "Guests", value: "Up to 6" },
        ],
      },
      {
        name: "Sail La Vie",
        type: "Monohull sailboat",
        length: "37.5 ft",
        guests: 6,
        year: "1994 Hunter Legend, refitted 2023",
        body:
          "A 1994 Hunter 37.5 foot Legend monohull, refitted in 2023 with a new main sail, jib sail, running rigging and decking material. Roomy deck space runs bow to stern, with a comfortable aft cockpit and a sugar scoop swim platform. Below deck: a kitchen, one bathroom and two cabins, including an aft queen stateroom and a roomy forward V-berth. Powered by a Yanmar diesel engine for a quiet approach to any anchorage.",
        image: {
          src: "https://live.staticflickr.com/7513/15807098322_b06d3982df_b.jpg",
          alt: "Cruising sailboat with guests aboard near a tropical shoreline at sunset, similar in spirit to Sail La Vie",
        } as Img,
        specs: [
          { label: "Engine", value: "Yanmar diesel" },
          { label: "Cabins", value: "2" },
          { label: "Bathroom", value: "1" },
          { label: "Guests", value: "Up to 6" },
        ],
      },
    ] as Boat[],
  },

  included: {
    heading: {
      eyebrow: "What comes with every trip",
      title: "Included on all tours",
      body: "A pro USCG certified licensed captain, fuel, water and a cooler with ice for your use.",
    } as SectionHeading,
    image: {
      src: "/ingested/caribbeanfishingacademy/guest-el-morro.webp",
      alt: "Guest giving a thumbs up aboard the charter boat with El Morro fort in the background",
    } as Img,
    points: [
      "Pro USCG certified licensed captain",
      "Fuel, water and a cooler with ice for your use",
      "Free appetizers and local drinks on 3 hour trips",
      "Your choice of sailboat or power boat",
    ],
    primary: { label: "Book Now", href: "/contact-us", variant: "primary", activityId: ACTIVITIES.sunsetCruise.id } as Cta,
    footnote: "Gratuities are not included.",
  },

  policy: {
    title: "Good to know",
    body:
      "This is a drug free operation for your safety and in compliance with local law. Reservations are first come, first served and subject to confirmation. Deposits are fully refundable if a cancellation is received 30 days prior to a trip, or if the captain cancels for safety or the vessel is not operational.",
  },

  cta: {
    eyebrow: "Ready when you are",
    title: "Reserve your sunset or bay cruise",
    body: "From $595 for up to 6 guests. Tell us your date and we will confirm your captain and vessel.",
    primary: { label: "Book Now", href: "/contact-us", variant: "primary", activityId: ACTIVITIES.sunsetCruise.id } as Cta,
    secondary: { label: "See Fishing Tours", href: "/fishing-tours", variant: "secondary" } as Cta,
    footnote: "USCG certified pro captains. Immediate confirmation.",
  },
} satisfies PageContent & Record<string, unknown>;

export default sunsetOrBayCruise;
