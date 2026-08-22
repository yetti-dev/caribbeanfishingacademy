/**
 * The section catalogue: metadata plus a rendered demo for each entry.
 *
 * `code` is the stable handle. It is what appears in the copied prompt, so a
 * build agent can resolve a selection straight to an import without guessing.
 * Keep codes stable once published.
 */
import { Nav01 } from "@/components/sections/nav/nav-01";
import { Nav02 } from "@/components/sections/nav/nav-02";
import { Nav03 } from "@/components/sections/nav/nav-03";
import { Nav04 } from "@/components/sections/nav/nav-04";
import { Nav05 } from "@/components/sections/nav/nav-05";
import { Hero01 } from "@/components/sections/hero/hero-01";
import { Hero02 } from "@/components/sections/hero/hero-02";
import { Hero03 } from "@/components/sections/hero/hero-03";
import { Hero04 } from "@/components/sections/hero/hero-04";
import { Hero05 } from "@/components/sections/hero/hero-05";
import { Hero06 } from "@/components/sections/hero/hero-06";
import { Hero07 } from "@/components/sections/hero/hero-07";
import { Hero08 } from "@/components/sections/hero/hero-08";
import { Hero09 } from "@/components/sections/hero/hero-09";
import { Hero10 } from "@/components/sections/hero/hero-10";
import { Hero11 } from "@/components/sections/hero/hero-11";
import { Hero12 } from "@/components/sections/hero/hero-12";
import { Hero13 } from "@/components/sections/hero/hero-13";
import { Hero14 } from "@/components/sections/hero/hero-14";
import { Hero15 } from "@/components/sections/hero/hero-15";
import { Hero16 } from "@/components/sections/hero/hero-16";
import { Hero17 } from "@/components/sections/hero/hero-17";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Feature02 } from "@/components/sections/features/feature-02";
import { Feature03 } from "@/components/sections/features/feature-03";
import { Feature04 } from "@/components/sections/features/feature-04";
import { Feature05 } from "@/components/sections/features/feature-05";
import { demoCta, demoCtaAlt, demoFeatures, demoNav, demoStats, img } from "@/content/demo";

export type CatalogEntry = {
  /** Stable handle used in the copied prompt. */
  code: string;
  category: string;
  label: string;
  /** Import path a build agent should use. */
  file: string;
  /** Exported component name. */
  component: string;
  /** One line on the props it expects, for the prompt. */
  props: string;
  /** Sticky chrome should not be re-stuck inside a preview column. */
  sticky?: boolean;
  /**
   * Floats over the section beneath it and consumes no layout height, so the
   * next section needs its own top clearance.
   */
  overlay?: boolean;
  /**
   * Opens with a full-bleed photo rather than padded text. An overlay nav can
   * sit straight on top of it, and adding clearance would insert a blank gap
   * for the bar to float over instead.
   */
  leadsWithMedia?: boolean;
  node: React.ReactNode;
};

const withImages = demoFeatures.map((f, i) => ({ ...f, image: img(20 + i, f.title) }));

export const CATALOG: CatalogEntry[] = [
  { code: "NAV-01", category: "Navbar", label: "Floating pill over the hero", sticky: true, overlay: true,
    file: "components/sections/nav/nav-01.tsx", component: "Nav01", props: "brand, items: NavItem[], cta?, overlay=true",
    node: <Nav01 brand="Marlin Charters" items={demoNav} cta={demoCta} /> },
  { code: "NAV-02", category: "Navbar", label: "Split with utility bar and phone", sticky: true,
    file: "components/sections/nav/nav-02.tsx", component: "Nav02", props: "brand, items, cta?, phone?",
    node: <Nav02 brand="Marlin Charters" items={demoNav} cta={demoCta} phone="+297 592 1140" /> },
  { code: "NAV-03", category: "Navbar", label: "Editorial, centred wordmark", sticky: true,
    file: "components/sections/nav/nav-03.tsx", component: "Nav03", props: "brand, items, cta?",
    node: <Nav03 brand="Marlin" items={demoNav} cta={demoCta} /> },
  { code: "NAV-04", category: "Navbar", label: "Mega menu with tour panel", sticky: true,
    file: "components/sections/nav/nav-04.tsx", component: "Nav04", props: "brand, items (with children), cta?, rating?",
    node: <Nav04 brand="Marlin Charters" items={demoNav} cta={demoCta} /> },
  { code: "NAV-05", category: "Navbar", label: "Dark bar, high contrast", sticky: true,
    file: "components/sections/nav/nav-05.tsx", component: "Nav05", props: "brand, items, cta?",
    node: <Nav05 brand="Marlin Charters" items={demoNav} cta={demoCta} /> },

  { code: "HERO-01", category: "Hero", label: "Split with stat strip",
    file: "components/sections/hero/hero-01.tsx", component: "Hero01", props: "eyebrow?, title, body, image, ctas[], stats[], rating?",
    node: <Hero01 eyebrow="Small group sailing" title="Twelve guests, one reef, no queue for the ladder"
      body="Half and full day trips from Slip 14. Local captains, lunch cooked aboard, gear that actually fits."
      image={img(0, "Sailboat moored in clear water")} ctas={[demoCta, demoCtaAlt]} stats={demoStats} rating="4.9" /> },
  { code: "HERO-02", category: "Hero", label: "Photo above, copy on a solid card", leadsWithMedia: true,
    file: "components/sections/hero/hero-02.tsx", component: "Hero02", props: "eyebrow?, title, body, image, ctas[]",
    node: <Hero02 eyebrow="Since 2013" title="The reef is twenty minutes out. We know the calm side."
      body="Twelve seasons of logbooks decide where we anchor, not a brochure."
      image={img(31, "Open sea from a boat bow")} ctas={[demoCta, demoCtaAlt]} /> },
  { code: "HERO-03", category: "Hero", label: "Colour block, type only",
    file: "components/sections/hero/hero-03.tsx", component: "Hero03", props: "eyebrow?, title, body, ctas[], footnote?",
    node: <Hero03 eyebrow="Daily departures" title="Book the boat, not a seat on it."
      body="Private charters for up to twelve, your route and your playlist. The crew handles the rest."
      ctas={[demoCta, demoCtaAlt]} footnote="Free rebooking if the captain calls it off for weather." /> },
  { code: "HERO-04", category: "Hero", label: "Editorial with photo strip",
    file: "components/sections/hero/hero-04.tsx", component: "Hero04", props: "eyebrow?, title, body, images[], ctas[], meta[]",
    node: <Hero04 eyebrow="Marlin Charters" title="Sail the leeward coast the way the crew would on a day off"
      body="Three snorkel stops, a beach landing, and lunch off the back deck."
      images={[img(1, "Catamaran at anchor"), img(2, "Snorkeller over coral"), img(3, "Beach seen from the water")]}
      ctas={[demoCta]} meta={["Slip 14", "12 guests max", "Est. 2013"]} /> },
  { code: "HERO-05", category: "Hero", label: "Mosaic bento photos",
    file: "components/sections/hero/hero-05.tsx", component: "Hero05", props: "eyebrow?, title, body, images[4], ctas[], location?",
    node: <Hero05 eyebrow="Half day from $68" title="Two reef stops before lunch"
      body="Out at nine, back by one. Gear supplied, shade on deck, and a galley that feeds everyone."
      images={[img(4, "Boat deck at sea"), img(5, "Turquoise shallows"), img(6, "Crew trimming a sail"), img(7, "Reef fish underwater")]}
      ctas={[demoCta, demoCtaAlt]} location="Slip 14, Oranjestad Marina" /> },
  { code: "HERO-06", category: "Hero", label: "Centred copy, scrolling photo band",
    file: "components/sections/hero/hero-06.tsx", component: "Hero06", props: "eyebrow?, title, body, images[], ctas[]",
    node: <Hero06 eyebrow="This season" title="Every trip ends with the sun on the water"
      body="Sunset cruise, snorkel and sail, or the full day coast run."
      images={[img(8, "Sunset over the sea"), img(9, "Sail against the sky"), img(10, "Guests swimming"), img(11, "Boat wake at dusk"), img(12, "Anchored at golden hour"), img(13, "Coastline from the water")]}
      ctas={[demoCta]} /> },
  { code: "HERO-07", category: "Hero", label: "Dark with inline booking form",
    file: "components/sections/hero/hero-07.tsx", component: "Hero07", props: "eyebrow?, title, body, image, tours[], action?, ctaLabel?",
    node: <Hero07 eyebrow="Live availability" title="Pick a date. We will tell you what is open."
      body="No card needed to hold a spot, and the captain confirms the weather by 7am."
      image={img(14, "Boat ready at the dock")}
      tours={["Sunset cruise with dinner", "Snorkel and sail half day", "Full day coast run", "Private charter"]} /> },
  { code: "HERO-08", category: "Hero", label: "Asymmetric with price card",
    file: "components/sections/hero/hero-08.tsx", component: "Hero08", props: "eyebrow?, title, body, image, price, period?, duration?, rating?, ctas[]",
    node: <Hero08 eyebrow="Most booked" title="Sunset cruise with dinner aboard"
      body="Leave at golden hour, anchor off the lighthouse, eat while the sky goes orange."
      image={img(15, "Sailboat silhouetted at sunset")} price="$88" period="per guest" duration="3 hours, evening" rating="4.9" ctas={[demoCta, demoCtaAlt]} /> },
  { code: "HERO-09", category: "Hero", label: "Overlapping photo frames",
    file: "components/sections/hero/hero-09.tsx", component: "Hero09", props: "eyebrow?, title, body, images[2], ctas[], highlights[]",
    node: <Hero09 eyebrow="Private charter" title="The whole boat, and a crew who plan around you"
      body="Twelve guests, catering to order, and a route you choose on the morning."
      images={[img(16, "Catamaran under sail"), img(17, "Table set on deck")]} ctas={[demoCta, demoCtaAlt]}
      highlights={["Up to twelve guests", "Catering and bar to order", "Departure time is yours", "Skipper and mate included"]} /> },
  { code: "HERO-10", category: "Hero", label: "Video dialog",
    file: "components/sections/hero/hero-10.tsx", component: "Hero10", props: "eyebrow?, title, body, image, videoUrl, ctas[], caption?",
    node: <Hero10 eyebrow="Watch first" title="Ninety seconds aboard the Marlin II"
      body="Shot on an ordinary Tuesday in March, no drone operator and no actors."
      image={img(18, "Catamaran deck under way")} videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
      ctas={[demoCta, demoCtaAlt]} caption="Filmed on the full day coast run" /> },

  { code: "HERO-11", category: "Hero", label: "Video background, copy on a solid card", leadsWithMedia: true,
    file: "components/sections/hero/hero-11.tsx", component: "Hero11", props: "eyebrow?, title, body, videoSrc, poster, ctas[], footnote?",
    node: <Hero11 eyebrow="Aboard the Marlin II" title="Twenty minutes from the dock to open water"
      body="Muted autoplay, real footage, no stock drone reel. Pause it any time."
      videoSrc="https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4"
      poster={img(0, "Sailboat under way in open water")} ctas={[demoCta, demoCtaAlt]}
      footnote="Filmed on the full day coast run, March 2026." /> },
  { code: "HERO-12", category: "Hero", label: "Rotating photo background with Ken Burns", leadsWithMedia: true,
    file: "components/sections/hero/hero-12.tsx", component: "Hero12", props: "eyebrow?, title, body, images[], ctas[], interval?, badge?",
    node: <Hero12 badge="Most booked" eyebrow="Four trips daily" title="The coast changes every hour. So does the trip."
      body="Sunrise dolphin runs, midday reef stops, and the sunset cruise everyone rebooks."
      images={[img(1, "Catamaran at anchor in turquoise water"), img(8, "Sunset over the sea"), img(5, "Turquoise shallows over sand"), img(16, "Catamaran under full sail")]}
      ctas={[demoCta, demoCtaAlt]} /> },
  { code: "HERO-13", category: "Hero", label: "Copy left, photo bleeds full height right",
    file: "components/sections/hero/hero-13.tsx", component: "Hero13", props: "eyebrow?, title, body, image, ctas[], bullets[]",
    node: <Hero13 eyebrow="Half day from $68" title="Two reef stops, lunch aboard, back by one"
      body="Out at nine from Slip 14. Twelve guests, two crew, and water calm enough for a four year old."
      image={img(19, "Guests boarding at the dock")} ctas={[demoCta, demoCtaAlt]}
      bullets={["Masks and fins in every size", "Lunch cooked on the back deck", "Free rebooking if weather cancels", "Reef safe sunscreen supplied"]} /> },
  { code: "HERO-14", category: "Hero", label: "Photo bleeds full height left, copy right",
    file: "components/sections/hero/hero-14.tsx", component: "Hero14", props: "eyebrow?, title, body, image, ctas[], stats[], rating?",
    node: <Hero14 eyebrow="Twelve seasons" title="The crew grew up on this coast"
      body="Every skipper is local and licensed, and knows which reef stays calm when the trades pick up."
      image={img(11, "Crew member at the helm")} ctas={[demoCta, demoCtaAlt]} stats={demoStats} rating="4.9" /> },
  { code: "HERO-15", category: "Hero", label: "Photo background, colour block copy", leadsWithMedia: true,
    file: "components/sections/hero/hero-15.tsx", component: "Hero15", props: "eyebrow?, title, body, image, ctas[], note?",
    node: <Hero15 eyebrow="Private charter" title="Book the boat, not a seat on it"
      body="Up to twelve guests, catering to order, and a route you pick on the morning."
      image={img(16, "Catamaran under sail in open water")} ctas={[demoCta, demoCtaAlt]}
      note="Deposit refundable up to 72 hours before departure." /> },
  { code: "HERO-16", category: "Hero", label: "Full photo with solid booking strip", leadsWithMedia: true,
    file: "components/sections/hero/hero-16.tsx", component: "Hero16", props: "eyebrow?, title, image, ctas[], facts[]",
    node: <Hero16 eyebrow="Sunset cruise" title="Anchor off the lighthouse as the sky goes orange"
      image={img(15, "Sailboat silhouetted against a sunset")} ctas={[demoCta, demoCtaAlt]}
      facts={[{ icon: "clock", label: "Duration", value: "3 hours, departs 17:30" }, { icon: "users", label: "Group size", value: "12 guests maximum" }, { icon: "pin", label: "Departs", value: "Slip 14, Oranjestad Marina" }]} /> },
  { code: "HERO-17", category: "Hero", label: "Centred type on a measured scrim", leadsWithMedia: true,
    file: "components/sections/hero/hero-17.tsx", component: "Hero17", props: "eyebrow?, title, body, image, ctas[], scrollHint?",
    node: <Hero17 eyebrow="Marlin Charters, est. 2013" title="Sail the leeward coast"
      body="Small groups, local captains, and twelve seasons of knowing where the water stays calm."
      image={img(33, "Open ocean horizon at dusk")} ctas={[demoCta, demoCtaAlt]} scrollHint="Scroll for the trips" /> },

  { code: "FEAT-01", category: "Features", label: "Three-up icon grid",
    file: "components/sections/features/feature-01.tsx", component: "Feature01", props: "heading: SectionHeading, features: Feature[]",
    node: <Feature01 heading={{ eyebrow: "Why us", title: "What twelve seasons taught us", body: "Small boats, local crews, and no upselling on the water." }} features={demoFeatures} /> },
  { code: "FEAT-02", category: "Features", label: "Bento with featured photo cell",
    file: "components/sections/features/feature-02.tsx", component: "Feature02", props: "heading, features[] (first needs image)",
    node: <Feature02 heading={{ eyebrow: "Aboard", title: "What is included, and what is not" }} features={withImages} /> },
  { code: "FEAT-03", category: "Features", label: "Alternating image and text rows",
    file: "components/sections/features/feature-03.tsx", component: "Feature03", props: "heading?, rows: {title, body, image, bullets[]}[]",
    node: <Feature03 heading={{ eyebrow: "How a day runs", title: "From the dock to the last swim stop" }}
      rows={[
        { title: "Board at Slip 14", body: "Arrive fifteen minutes early. Parking is free and the crew stows your bag in the dry locker.", image: img(19, "Guests boarding at the dock"), bullets: ["Free marina parking", "Dry storage aboard", "Safety briefing before we leave"] },
        { title: "First reef stop", body: "Twenty minutes out to the leeward reef, where the water stays calm when the trades pick up.", image: img(20, "Snorkellers in calm water"), bullets: ["Masks and fins in every size", "Crew in the water with you", "Mooring buoy, never an anchor"] },
        { title: "Lunch on the back deck", body: "Grilled catch, fruit, and cold drinks while the boat swings on the mooring.", image: img(21, "Food served on a boat deck"), bullets: ["Vegetarian and vegan plates", "Allergies handled at booking", "Beer and wine after the last swim"] },
      ]} /> },
  { code: "FEAT-04", category: "Features", label: "Numbered list on a dark panel",
    file: "components/sections/features/feature-04.tsx", component: "Feature04", props: "heading, features[]",
    node: <Feature04 heading={{ eyebrow: "Included", title: "Everything in the price", body: "No fuel surcharge, no gear rental, no tipping expected." }} features={demoFeatures} /> },
  { code: "FEAT-05", category: "Features", label: "Tabbed with swapping photo",
    file: "components/sections/features/feature-05.tsx", component: "Feature05", props: "heading, features[] (images optional)",
    node: <Feature05 heading={{ eyebrow: "Choose a trip", title: "Four ways to spend a day on the water" }} features={withImages} /> },
];

export const CATEGORIES = [...new Set(CATALOG.map((c) => c.category))];
export const byCode = (code: string) => CATALOG.find((c) => c.code === code);
