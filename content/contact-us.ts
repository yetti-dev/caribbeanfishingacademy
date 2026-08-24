/**
 * Contact Us page copy. Mirrors the source site's single contact page: a
 * direct line to the fishing guide, the marina location with driving notes,
 * and a closing push toward booking.
 */
import type { PageContent, Cta, Img } from "./types";

export const contactUs = {
  meta: {
    title: "Contact Us",
    description:
      "Contact Caribbean Fishing Academy Charters in San Juan, Puerto Rico. Call or text 787-405-4100, or email caribbeanfishingacademy@gmail.com to book your charter.",
    path: "/contact-us",
  },

  hero: {
    eyebrow: "Contact Us",
    title: "Get in touch",
    body:
      "Or get in contact with our fishing guide now. Call or text 787-405-4100.",
    image: {
      src: "/ingested/caribbeanfishingacademy/guest-el-morro.webp",
      alt: "Guest giving a thumbs up aboard the charter boat with El Morro fort in the background",
    } as Img,
    ctas: [
      { label: "Call 787-405-4100", href: "tel:+17874054100", variant: "primary" },
      { label: "Email Us", href: "mailto:caribbeanfishingacademy@gmail.com", variant: "secondary" },
    ] as Cta[],
  },

  form: {
    eyebrow: "Send a message",
    title: "Tell us what you have in mind",
    body:
      "Trip dates, group size, a question about the boat: write it below and the dock will get back to you.",
    submitLabel: "Send Message",
    note:
      "Thank you for contacting us. If needed, you will hear back within 48 to 72 hours.",
  },

  location: {
    eyebrow: "Find the dock",
    title: "Caribbean Fishing Academy & Fishing Charters",
    body:
      "Caribbean Fishing Academy Charters, Centro Pesquero, Parque Central, San Juan, PR 00907. Easy access, no hassle, a very well known location. We are very close to Condado, San Juan, Isla Verde and the international airport. The boat is right on San Juan Bay's waters at the Central Park of San Juan, or Parque Central de San Juan, a place known to any cab driver or local as Villa Pesquera, the fishing village of Parque Central. It's right next to Que PezCao restaurant. We can help you get here, or pick you up. Call for any assistance.",
  },

  cta: {
    eyebrow: "Ready when you are",
    title: "The captain is standing by",
    body: "Immediate confirmation, no hassle booking, USCG certified pro captains on every trip.",
    primary: { label: "View Fishing Tours", href: "/fishing-tours", variant: "primary" } as Cta,
    secondary: { label: "Call 787-405-4100", href: "tel:+17874054100", variant: "secondary" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default contactUs;
