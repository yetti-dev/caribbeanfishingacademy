/**
 * Demo content for the section library showcase.
 *
 * Every image URL here was verified to return 200. Guessed Unsplash photo ids
 * are almost always dead (30 of 30 invented ones 404'd), so the pool below is
 * fixed and checked rather than generated.
 *
 * Real builds do NOT use this file. `/build` writes content/home.ts and friends
 * from the scrape and points them at public/ingested/<slug>/. This exists so
 * /sections can render every block with real photography.
 */
import type { Cta, FaqItem, Feature, Img, NavItem, PriceTier, Stat, Testimonial } from "./types";

const px = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const un = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** 45 verified URLs. Index into this rather than inventing new ones. */
export const PHOTOS: string[] = [
  px(1001682), px(2168974), px(3601425), px(1430677), px(356844),
  px(1076885), px(462024), px(753626), px(1174732), px(2549018),
  px(1252500), px(3155666), px(1268855), px(386009), px(1554646),
  px(2007401), px(219998), px(1533720), px(2166927), px(1287460),
  px(338515), px(3601097), px(1058959), px(1229042), px(240526),
  px(1450082), px(3155667), px(1591373), px(189349), px(2265876),
  un("1506744038136-46273834b3fb"), un("1519681393784-d120267933ba"),
  un("1441974231531-c6227db76b6e"), un("1470071459604-3b5ec3a7fe05"),
  un("1500375592092-40eb2168fd21"), un("1439066615861-d1af74d74000"),
  un("1518791841217-8f162f1e1131"), un("1493663284031-b7e3aefcae8e"),
  un("1517849845537-4d257902454a"), un("1526336024174-e58f5cdd8e13"),
  un("1554068865-24cecd4e34b8"), un("1560807707-8cc77767d783"),
  un("1552053831-71594a27632d"), un("1587300003388-59208cc962cb"),
  un("1583511655857-d19b40a7a54e"),
];

/** Deterministic pick so the same section always shows the same photo. */
export const photo = (i: number) => PHOTOS[i % PHOTOS.length];

export const img = (i: number, alt: string): Img => ({ src: photo(i), alt });

export const demoNav: NavItem[] = [
  { label: "Tours", href: "#tours", children: [
    { label: "Sunset cruise", href: "#sunset" },
    { label: "Snorkel and sail", href: "#snorkel" },
    { label: "Private charter", href: "#private" },
    { label: "Half day reef trip", href: "#reef" },
  ] },
  { label: "Fleet", href: "#fleet" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export const demoCta: Cta = { label: "Check availability", href: "#book", variant: "primary" };
export const demoCtaAlt: Cta = { label: "See the fleet", href: "#fleet", variant: "secondary" };

export const demoStats: Stat[] = [
  { value: "12", label: "Years on the water", to: 12 },
  { value: "4.9", label: "Average guest rating" },
  { value: "38k", label: "Guests aboard since 2013" },
  { value: "6", label: "Boats in the fleet", to: 6 },
];

export const demoFeatures: Feature[] = [
  { icon: "Anchor", title: "Small groups only", body: "Twelve guests maximum on every trip, so nobody queues for the ladder or the shade." },
  { icon: "Compass", title: "Captains who grew up here", body: "Every skipper is local, licensed, and knows which reef is calm when the trade winds pick up." },
  { icon: "UtensilsCrossed", title: "Lunch cooked aboard", body: "Grilled catch, fresh fruit, cold drinks. Vegetarian and allergy plates sorted when you book." },
  { icon: "ShieldCheck", title: "Coast guard certified", body: "Annual hull inspection, life jackets in every size, and a first aid kit the crew is trained on." },
  { icon: "Waves", title: "Reef safe from the start", body: "Mooring buoys instead of anchors, reef safe sunscreen supplied, and no single use plastic aboard." },
  { icon: "CloudSun", title: "Weather promise", body: "If the captain calls it off you rebook free or take a full refund. No arguing about deposits." },
];

export const demoTestimonials: Testimonial[] = [
  { quote: "We booked the sunset trip on our first night and rebooked it for our last. The crew remembered our kids' names.", name: "Marije de Vries", role: "Rotterdam" },
  { quote: "Captain Ray spotted turtles twice and moved the boat so everyone got a look. That is not luck, that is knowing the water.", name: "Andre Sanchez", role: "Austin, Texas" },
  { quote: "I get seasick and was dreading it. They put me at the stern, gave me ginger, and I was fine the whole afternoon.", name: "Priya Raman", role: "London" },
  { quote: "Booked a private charter for eight. They handled the cake, the playlist and my mother in law.", name: "Tom Beckers", role: "Antwerp" },
  { quote: "Third year running. The boat is spotless and the snorkel gear actually fits children properly.", name: "Hannah Wiggins", role: "Toronto" },
  { quote: "Cancelled for weather and refunded the same day with no fuss. Rebooked and it was perfect.", name: "Luis Ferreira", role: "Lisbon" },
];

export const demoFaqs: FaqItem[] = [
  { q: "What happens if the weather turns?", a: "The captain makes the call by 7am and texts you. You rebook for any open slot or take a full refund, your choice." },
  { q: "Do I need to know how to swim?", a: "No. Flotation vests are aboard in every size and the crew stays in the water with anyone who wants company." },
  { q: "Can you take children?", a: "Yes, from age four. Child size snorkel gear and vests are aboard, and the reef stops are in calm shallow water." },
  { q: "Is food included?", a: "Lunch, fruit and soft drinks are included on all half and full day trips. Beer and wine are served after the last swim stop." },
  { q: "Where do we meet?", a: "Slip 14 at the marina, fifteen minutes before departure. Parking is free and we are two minutes from the bus stop." },
  { q: "What should I bring?", a: "A towel, a hat and reef safe sunscreen. We supply masks, fins, water and shade." },
  { q: "How far ahead should I book?", a: "In high season, about ten days for the sunset trip. Private charters need a week so we can plan the catering." },
  { q: "Can you handle dietary needs?", a: "Yes. Tell us when you book and the galley sorts vegetarian, vegan, gluten free and most allergies." },
];

export const demoTiers: PriceTier[] = [
  { name: "Half day reef", price: "$68", period: "per guest", body: "Three hours, two snorkel stops, lunch aboard.", features: ["Three hours on the water", "Two reef stops", "Lunch and soft drinks", "All snorkel gear"], cta: { label: "Book half day", href: "#book" } },
  { name: "Full day sail", price: "$124", period: "per guest", body: "Six hours down the coast with a beach stop.", features: ["Six hours on the water", "Three snorkel stops", "Beach landing and lunch", "Beer and wine after swimming", "Towels supplied"], cta: { label: "Book full day", href: "#book" }, featured: true },
  { name: "Private charter", price: "$960", period: "per boat", body: "The whole boat, up to twelve guests, your route.", features: ["Up to twelve guests", "Choose your own route", "Catering to order", "Bring your own playlist", "Flexible departure time"], cta: { label: "Enquire", href: "#contact" } },
];

export type Tour = {
  title: string;
  duration: string;
  price: string;
  from: string;
  body: string;
  image: Img;
  tags: string[];
  rating: number;
  reviews: number;
};

export const demoTours: Tour[] = [
  { title: "Sunset cruise with dinner", duration: "3 hours", price: "$88", from: "Slip 14", body: "Leave at golden hour, anchor off the lighthouse, eat while the sky goes orange.", image: img(0, "Sailboat under an orange evening sky"), tags: ["Evening", "Dinner", "Small group"], rating: 4.9, reviews: 412 },
  { title: "Snorkel and sail half day", duration: "3.5 hours", price: "$68", from: "Slip 14", body: "Two reef stops in calm water, gear supplied, lunch cooked on the back deck.", image: img(1, "Snorkeller above a shallow coral reef"), tags: ["Reef", "Lunch", "Family"], rating: 4.8, reviews: 806 },
  { title: "Full day coast run", duration: "6 hours", price: "$124", from: "Slip 14", body: "Down the coast to the sand bar, three swim stops and a beach landing.", image: img(2, "Wide open water seen from a boat deck"), tags: ["Full day", "Beach stop"], rating: 4.9, reviews: 233 },
  { title: "Private charter", duration: "Flexible", price: "$960", from: "Your schedule", body: "The whole boat and crew for the day. You pick the route and the playlist.", image: img(3, "Empty boat deck ready for guests"), tags: ["Private", "Custom"], rating: 5.0, reviews: 97 },
  { title: "Morning dolphin run", duration: "2 hours", price: "$52", from: "Slip 14", body: "Early departure while the water is glass and the pods are still feeding.", image: img(4, "Calm sea at first light"), tags: ["Morning", "Wildlife"], rating: 4.7, reviews: 318 },
  { title: "Island hop and lunch", duration: "5 hours", price: "$105", from: "Slip 14", body: "Three anchorages, a short walk ashore, and grilled catch for lunch.", image: img(5, "Small island seen across turquoise water"), tags: ["Islands", "Lunch"], rating: 4.8, reviews: 154 },
];

export type Post = {
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
  author: string;
  image: Img;
};

export const demoPosts: Post[] = [
  { title: "The best months to sail this coast", excerpt: "Trade winds, water clarity and crowd levels, month by month, from twelve seasons of logbooks.", date: "12 June 2026", readingTime: "6 min", category: "Planning", author: "Capt. Ray Oduber", image: img(6, "Sailboat heeling in steady wind") },
  { title: "What to pack for a day on the water", excerpt: "A short list that fits in one dry bag, and the three things guests always forget.", date: "28 May 2026", readingTime: "4 min", category: "Guides", author: "Ilse Croes", image: img(7, "Dry bag and towel on a boat bench") },
  { title: "Reef safe sunscreen, and why we insist", excerpt: "Two common chemicals bleach coral at concentrations you would never notice. Here is the swap.", date: "9 May 2026", readingTime: "5 min", category: "Conservation", author: "Dr. Nadia Klein", image: img(8, "Close view of healthy coral") },
  { title: "How we pick a snorkel stop", excerpt: "Wind direction, tide state and swell period decide the day, not the brochure.", date: "21 April 2026", readingTime: "7 min", category: "Behind the scenes", author: "Capt. Ray Oduber", image: img(9, "Crew reading the water from the bow") },
  { title: "Meet the fleet: Marlin II", excerpt: "A 42 foot catamaran, rebuilt in 2024, and the boat guests ask for by name.", date: "2 April 2026", readingTime: "3 min", category: "Fleet", author: "Ilse Croes", image: img(10, "Catamaran moored in clear water") },
];

export type Member = { name: string; role: string; bio: string; image: Img };

export const demoTeam: Member[] = [
  { name: "Capt. Ray Oduber", role: "Master mariner, founder", bio: "Grew up on this coast and has held a commercial licence for twenty two years.", image: img(11, "Captain at the helm") },
  { name: "Ilse Croes", role: "Operations", bio: "Runs the bookings, the galley orders and the crew roster.", image: img(12, "Crew member coiling a line") },
  { name: "Marcus Vrolijk", role: "Skipper and dive guide", bio: "PADI divemaster, and the one who spots the turtles first.", image: img(13, "Diver preparing gear on deck") },
  { name: "Sofia Martinez", role: "Galley", bio: "Cooks the grilled catch that guests write about in reviews.", image: img(14, "Fresh food prepared on a boat") },
];

export const demoLogos = ["Marina Watch", "Coast Guard Certified", "Reef Alliance", "TripAdvisor", "Blue Flag", "PADI"];

/* ---------------------------------------------------------------------------
 * Additions for the expanded block library. Same rule as above: index into
 * PHOTOS, never invent a photo id.
 * ------------------------------------------------------------------------- */

/** A pull quote, attributed. Used by the quote sections. */
export type Quote = { text: string; author: string; role?: string; image?: Img };

export const demoQuotes: Quote[] = [
  { text: "The sea does not reward those who are too anxious, too greedy, or too impatient.", author: "Anne Morrow Lindbergh", role: "Gift from the Sea" },
  { text: "We stopped counting trips after the hundredth. The water still looks different every morning.", author: "Capt. Ray Oduber", role: "Founder", image: img(11, "Captain at the helm") },
  { text: "A small boat with a good crew beats a big boat with a schedule.", author: "Marcus Vrolijk", role: "Skipper and dive guide", image: img(13, "Diver preparing gear on deck") },
];

/** Contact details for the contact sections and maps. */
export const demoContact = {
  address: "Slip 14, Renaissance Marina, Oranjestad",
  phone: "+297 588 1420",
  whatsapp: "+297 588 1420",
  email: "hello@bluewatersail.example",
  hours: [
    { day: "Monday to Friday", time: "07:00 to 19:00" },
    { day: "Saturday", time: "07:00 to 20:00" },
    { day: "Sunday", time: "08:00 to 17:00" },
  ],
  mapQuery: "Renaissance Marina, Oranjestad, Aruba",
  socials: [
    { label: "Instagram", href: "https://instagram.com", icon: "Instagram" },
    { label: "Facebook", href: "https://facebook.com", icon: "Facebook" },
    { label: "YouTube", href: "https://youtube.com", icon: "Youtube" },
  ],
};

/** A bulk image set for the galleries. Plain lazy img, never next/image. */
export const demoGallery: Img[] = Array.from({ length: 24 }, (_, i) =>
  img(i, [
    "Sailboat under an orange evening sky", "Snorkeller above a shallow coral reef",
    "Wide open water seen from a boat deck", "Empty boat deck ready for guests",
    "Calm sea at first light", "Small island seen across turquoise water",
    "Sailboat heeling in steady wind", "Dry bag and towel on a boat bench",
    "Close view of healthy coral", "Crew reading the water from the bow",
    "Catamaran moored in clear water", "Captain at the helm",
  ][i % 12]),
);

/** A boat in the fleet, for the fleet and vessel sections. */
export type Boat = {
  name: string;
  type: string;
  length: string;
  guests: number;
  year: string;
  body: string;
  image: Img;
  specs: { label: string; value: string }[];
};

export const demoBoats: Boat[] = [
  { name: "Marlin II", type: "Catamaran", length: "42 ft", guests: 12, year: "Rebuilt 2024",
    body: "The boat guests ask for by name. Wide shaded deck, a swim ladder a child can climb, and a galley that actually cooks.",
    image: img(10, "Catamaran moored in clear water"),
    specs: [{ label: "Length", value: "42 ft" }, { label: "Beam", value: "22 ft" }, { label: "Guests", value: "12" }, { label: "Crew", value: "2" }] },
  { name: "Trade Wind", type: "Monohull sloop", length: "38 ft", guests: 8, year: "2019",
    body: "Built to sail rather than motor. Heels over, holds a line, and gets quiet the moment the engine goes off.",
    image: img(6, "Sailboat heeling in steady wind"),
    specs: [{ label: "Length", value: "38 ft" }, { label: "Draft", value: "6 ft" }, { label: "Guests", value: "8" }, { label: "Crew", value: "2" }] },
  { name: "Coral Skiff", type: "Day tender", length: "24 ft", guests: 6, year: "2022",
    body: "Shallow draft for the inside reef, where the big hulls cannot follow. Best boat we own for a morning dolphin run.",
    image: img(4, "Calm sea at first light"),
    specs: [{ label: "Length", value: "24 ft" }, { label: "Draft", value: "2 ft" }, { label: "Guests", value: "6" }, { label: "Crew", value: "1" }] },
  { name: "Lighthouse", type: "Motor yacht", length: "50 ft", guests: 16, year: "2021",
    body: "For groups and flat calm evenings. Air conditioned saloon below, and the only boat with a proper bar.",
    image: img(3, "Empty boat deck ready for guests"),
    specs: [{ label: "Length", value: "50 ft" }, { label: "Cabins", value: "3" }, { label: "Guests", value: "16" }, { label: "Crew", value: "3" }] },
];

/** Catalogue filter facets for the listing page templates. */
export const demoFacets = [
  { label: "Trip length", options: ["Under 2 hours", "Half day", "Full day", "Multi day"] },
  { label: "Departs", options: ["Morning", "Midday", "Sunset"] },
  { label: "Good for", options: ["Families", "Couples", "Divers", "Groups"] },
  { label: "Price", options: ["Under $60", "$60 to $100", "$100 to $200", "$200 plus"] },
];

/** Body copy for the single blog post template, as ordered blocks. */
export type PostBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string; author?: string }
  | { kind: "img"; image: Img }
  | { kind: "list"; items: string[] };

export const demoPostBody: PostBlock[] = [
  { kind: "p", text: "Twelve seasons of logbooks say the same thing every year: the coast has three moods, and the calendar tells you which one you are booking into." },
  { kind: "h2", text: "January to March, the windy quarter" },
  { kind: "p", text: "The trades run hard and steady. Sailors love it, snorkellers less so, because the leeward reefs stir up by mid morning. Book the early departure and you get glass water for the first two hours." },
  { kind: "img", image: img(6, "Sailboat heeling in steady wind") },
  { kind: "list", items: ["Wind 18 to 25 knots most afternoons", "Water clarity best before 10:00", "Fewest cancellations of any season"] },
  { kind: "quote", text: "If you want to actually sail rather than motor with a sail up, come in February.", author: "Capt. Ray Oduber" },
  { kind: "h2", text: "April to August, the clear quarter" },
  { kind: "p", text: "The wind eases and the water goes to fifteen metres of visibility. This is when the underwater photos people put on their walls get taken." },
  { kind: "img", image: img(8, "Close view of healthy coral") },
  { kind: "h2", text: "September to December, the quiet quarter" },
  { kind: "p", text: "Fewer boats, lower prices, and the only months where a private charter costs about what a shared trip does in March. Watch the forecast, take the rebooking promise seriously, and you will have the reef to yourself." },
];
