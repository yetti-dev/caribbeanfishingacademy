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
import { Feature01 } from "@/components/sections/features/feature-01";
import { Feature02 } from "@/components/sections/features/feature-02";
import { Feature03 } from "@/components/sections/features/feature-03";
import { Feature04 } from "@/components/sections/features/feature-04";
import { Feature05 } from "@/components/sections/features/feature-05";
import { demoCta, demoCtaAlt, demoFeatures, demoNav, demoStats, img } from "@/content/demo";

/** One labelled frame per section, so the page reads like a catalogue. */
function Frame({ id, label, kind, children }: { id: string; label: string; kind: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16">
      <div className="sticky top-0 z-40 flex items-center gap-3 border-y border-border bg-foreground px-6 py-2 text-background">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">{kind}</span>
        <span className="font-display text-sm font-semibold">{label}</span>
      </div>
      {children}
    </section>
  );
}

const withImages = demoFeatures.map((f, i) => ({ ...f, image: img(20 + i, f.title) }));

export function SectionsShowcase() {
  return (
    <main className="bg-background">
      <div className="border-b border-border bg-card px-6 py-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Section library</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground">Authored page sections</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Every section is content-prop driven and rendered here with real photography. Copy lives in
          content files, never in the component.
        </p>
      </div>

      <Frame id="nav-01" kind="navbar" label="Pill, floating, shrinks on scroll">
        <Nav01 brand="Marlin Charters" items={demoNav} cta={demoCta} />
      </Frame>
      <Frame id="nav-02" kind="navbar" label="Split with utility bar and phone">
        <Nav02 brand="Marlin Charters" items={demoNav} cta={demoCta} phone="+297 592 1140" />
      </Frame>
      <Frame id="nav-03" kind="navbar" label="Editorial, centred wordmark">
        <Nav03 brand="Marlin" items={demoNav} cta={demoCta} />
      </Frame>
      <Frame id="nav-04" kind="navbar" label="Mega menu with tour panel">
        <Nav04 brand="Marlin Charters" items={demoNav} cta={demoCta} />
      </Frame>
      <Frame id="nav-05" kind="navbar" label="Dark bar, high contrast">
        <Nav05 brand="Marlin Charters" items={demoNav} cta={demoCta} />
      </Frame>

      <Frame id="hero-01" kind="hero" label="Split with stat strip">
        <Hero01 eyebrow="Small group sailing" title="Twelve guests, one reef, no queue for the ladder"
          body="Half and full day trips from Slip 14. Local captains, lunch cooked aboard, gear that actually fits."
          image={img(0, "Sailboat moored in clear water")} ctas={[demoCta, demoCtaAlt]} stats={demoStats} rating="4.9" />
      </Frame>
      <Frame id="hero-02" kind="hero" label="Photo above, copy on a solid card">
        <Hero02 eyebrow="Since 2013" title="The reef is twenty minutes out. We know the calm side."
          body="Twelve seasons of logbooks decide where we anchor, not a brochure."
          image={img(31, "Open sea from a boat bow")} ctas={[demoCta, demoCtaAlt]} />
      </Frame>
      <Frame id="hero-03" kind="hero" label="Colour block, type only">
        <Hero03 eyebrow="Daily departures" title="Book the boat, not a seat on it."
          body="Private charters for up to twelve, your route and your playlist. The crew handles the rest."
          ctas={[demoCta, demoCtaAlt]} footnote="Free rebooking if the captain calls it off for weather." />
      </Frame>
      <Frame id="hero-04" kind="hero" label="Editorial with photo strip">
        <Hero04 eyebrow="Marlin Charters" title="Sail the leeward coast the way the crew would on a day off"
          body="Three snorkel stops, a beach landing, and lunch off the back deck."
          images={[img(1, "Catamaran at anchor"), img(2, "Snorkeller over coral"), img(3, "Beach seen from the water")]}
          ctas={[demoCta]} meta={["Slip 14", "12 guests max", "Est. 2013"]} />
      </Frame>
      <Frame id="hero-05" kind="hero" label="Mosaic bento photos">
        <Hero05 eyebrow="Half day from $68" title="Two reef stops before lunch"
          body="Out at nine, back by one. Gear supplied, shade on deck, and a galley that feeds everyone."
          images={[img(4, "Boat deck at sea"), img(5, "Turquoise shallows"), img(6, "Crew trimming a sail"), img(7, "Reef fish underwater")]}
          ctas={[demoCta, demoCtaAlt]} location="Slip 14, Oranjestad Marina" />
      </Frame>
      <Frame id="hero-06" kind="hero" label="Centred copy, scrolling photo band">
        <Hero06 eyebrow="This season" title="Every trip ends with the sun on the water"
          body="Sunset cruise, snorkel and sail, or the full day coast run."
          images={[img(8, "Sunset over the sea"), img(9, "Sail against the sky"), img(10, "Guests swimming"), img(11, "Boat wake at dusk"), img(12, "Anchored at golden hour"), img(13, "Coastline from the water")]}
          ctas={[demoCta]} />
      </Frame>
      <Frame id="hero-07" kind="hero" label="Dark with inline booking form">
        <Hero07 eyebrow="Live availability" title="Pick a date. We will tell you what is open."
          body="No card needed to hold a spot, and the captain confirms the weather by 7am."
          image={img(14, "Boat ready at the dock")}
          tours={["Sunset cruise with dinner", "Snorkel and sail half day", "Full day coast run", "Private charter"]} />
      </Frame>
      <Frame id="hero-08" kind="hero" label="Asymmetric with price card">
        <Hero08 eyebrow="Most booked" title="Sunset cruise with dinner aboard"
          body="Leave at golden hour, anchor off the lighthouse, eat while the sky goes orange."
          image={img(15, "Sailboat silhouetted at sunset")} price="$88" period="per guest" duration="3 hours, evening" rating="4.9" ctas={[demoCta, demoCtaAlt]} />
      </Frame>
      <Frame id="hero-09" kind="hero" label="Overlapping photo frames">
        <Hero09 eyebrow="Private charter" title="The whole boat, and a crew who plan around you"
          body="Twelve guests, catering to order, and a route you choose on the morning."
          images={[img(16, "Catamaran under sail"), img(17, "Table set on deck")]} ctas={[demoCta, demoCtaAlt]}
          highlights={["Up to twelve guests", "Catering and bar to order", "Departure time is yours", "Skipper and mate included"]} />
      </Frame>
      <Frame id="hero-10" kind="hero" label="Video dialog">
        <Hero10 eyebrow="Watch first" title="Ninety seconds aboard the Marlin II"
          body="Shot on an ordinary Tuesday in March, no drone operator and no actors."
          image={img(18, "Catamaran deck under way")} videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
          ctas={[demoCta, demoCtaAlt]} caption="Filmed on the full day coast run" />
      </Frame>

      <Frame id="feature-01" kind="features" label="Three-up icon grid">
        <Feature01 heading={{ eyebrow: "Why us", title: "What twelve seasons taught us", body: "Small boats, local crews, and no upselling on the water." }} features={demoFeatures} />
      </Frame>
      <Frame id="feature-02" kind="features" label="Bento with featured photo cell">
        <Feature02 heading={{ eyebrow: "Aboard", title: "What is included, and what is not" }} features={withImages} />
      </Frame>
      <Frame id="feature-03" kind="features" label="Alternating image and text rows">
        <Feature03 heading={{ eyebrow: "How a day runs", title: "From the dock to the last swim stop" }}
          rows={[
            { title: "Board at Slip 14", body: "Arrive fifteen minutes early. Parking is free and the crew stows your bag in the dry locker.", image: img(19, "Guests boarding at the dock"), bullets: ["Free marina parking", "Dry storage aboard", "Safety briefing before we leave"] },
            { title: "First reef stop", body: "Twenty minutes out to the leeward reef, where the water stays calm when the trades pick up.", image: img(20, "Snorkellers in calm water"), bullets: ["Masks and fins in every size", "Crew in the water with you", "Mooring buoy, never an anchor"] },
            { title: "Lunch on the back deck", body: "Grilled catch, fruit, and cold drinks while the boat swings on the mooring.", image: img(21, "Food served on a boat deck"), bullets: ["Vegetarian and vegan plates", "Allergies handled at booking", "Beer and wine after the last swim"] },
          ]} />
      </Frame>
      <Frame id="feature-04" kind="features" label="Numbered list on a dark panel">
        <Feature04 heading={{ eyebrow: "Included", title: "Everything in the price", body: "No fuel surcharge, no gear rental, no tipping expected." }} features={demoFeatures} />
      </Frame>
      <Frame id="feature-05" kind="features" label="Tabbed with swapping photo">
        <Feature05 heading={{ eyebrow: "Choose a trip", title: "Four ways to spend a day on the water" }} features={withImages} />
      </Frame>
    </main>
  );
}
