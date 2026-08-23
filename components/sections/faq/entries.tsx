import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Faq01 } from "@/components/sections/faq/faq-01";
import { Faq02 } from "@/components/sections/faq/faq-02";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { Faq04 } from "@/components/sections/faq/faq-04";
import { Faq05 } from "@/components/sections/faq/faq-05";
import { Faq06 } from "@/components/sections/faq/faq-06";
import { Faq07 } from "@/components/sections/faq/faq-07";
import { Faq08 } from "@/components/sections/faq/faq-08";
import { Faq09 } from "@/components/sections/faq/faq-09";
import { Faq10 } from "@/components/sections/faq/faq-10";
import { demoFaqs, img } from "@/content/demo";

const contactCta = { label: "Message the crew", href: "#contact" };
const bookCta = { label: "Check availability", href: "#book" };

export const FAQ_ENTRIES: CatalogEntry[] = [
  {
    code: "FAQ-01", category: "FAQ",
    label: "Single column hairline accordion, one panel open at a time, zero JavaScript",
    file: "components/sections/faq/faq-01.tsx", component: "Faq01",
    props: "heading?: SectionHeading, items: FaqItem[], cta?: Cta, groupName?: string",
    node: (
      <Faq01
        heading={{ eyebrow: "Before you board", title: "The questions we get at Slip 14", body: "Twelve years of sailing out of Renaissance Marina, and these eight come up every week." }}
        items={demoFaqs}
        cta={bookCta}
      />
    ),
  },
  {
    code: "FAQ-02", category: "FAQ",
    label: "Two independent accordion columns in soft cards, plus and minus instead of a chevron",
    file: "components/sections/faq/faq-02.tsx", component: "Faq02",
    props: "heading?: SectionHeading, items: FaqItem[], cta?: Cta",
    node: (
      <Faq02
        heading={{ eyebrow: "Good to know", title: "Everything guests ask before the lines come off", body: "Open as many as you like. Nothing here closes when you open the next one." }}
        items={demoFaqs}
        cta={contactCta}
      />
    ),
  },
  {
    code: "FAQ-03", category: "FAQ",
    label: "Sticky heading left, numbered list right, every answer permanently open",
    file: "components/sections/faq/faq-03.tsx", component: "Faq03",
    props: "heading?: SectionHeading, items: FaqItem[], cta?: Cta",
    node: (
      <Faq03
        heading={{ eyebrow: "Trip notes", title: "Read it once, sail without surprises", body: "No panels to click. Everything a first time guest at Blue Water Sail needs is on this page." }}
        items={demoFaqs}
        cta={contactCta}
      />
    ),
  },
  {
    code: "FAQ-04", category: "FAQ",
    label: "Category tabs filter the list, full tablist keyboard support",
    file: "components/sections/faq/faq-04.tsx", component: "Faq04",
    props: "heading?: SectionHeading, items?: FaqItem[], groups?: FaqGroup[], cta?: Cta",
    node: (
      <Faq04
        heading={{ eyebrow: "By topic", title: "Pick the part of the trip you are wondering about" }}
        groups={[
          { label: "Booking", items: [demoFaqs[0], demoFaqs[6], demoFaqs[4]] },
          { label: "On the water", items: [demoFaqs[1], demoFaqs[2], demoFaqs[5]] },
          { label: "Food and drink", items: [demoFaqs[3], demoFaqs[7]] },
        ]}
        cta={bookCta}
      />
    ),
  },
  {
    code: "FAQ-05", category: "FAQ",
    label: "Live search over the questions with a result count and a real empty state",
    file: "components/sections/faq/faq-05.tsx", component: "Faq05",
    props: "heading?: SectionHeading, items: FaqItem[], cta?: Cta, placeholder?: string",
    node: (
      <Faq05
        heading={{ eyebrow: "Help desk", title: "Search the answers", body: "Type a word. Weather, children, lunch, parking. The list narrows as you go." }}
        items={demoFaqs}
        cta={contactCta}
        placeholder="Try weather, snorkel gear, or parking"
      />
    ),
  },
  {
    code: "FAQ-06", category: "FAQ",
    label: "Bento card grid of questions, varied cell widths, no toggling, colour CTA bar under it",
    file: "components/sections/faq/faq-06.tsx", component: "Faq06",
    props: "heading?: SectionHeading, items: FaqItem[], cta?: Cta",
    node: (
      <Faq06
        heading={{ eyebrow: "The board", title: "Pinned above the galley hatch", body: "The same eight notes the crew reads out at the briefing, written down so nobody has to ask twice." }}
        items={demoFaqs}
        cta={contactCta}
      />
    ),
  },
  {
    code: "FAQ-07", category: "FAQ",
    label: "Inverted dark panel accordion with oversized numerals, native details, no JavaScript",
    file: "components/sections/faq/faq-07.tsx", component: "Faq07",
    props: "heading?: SectionHeading, items: FaqItem[], cta?: Cta",
    node: (
      <Faq07
        heading={{ eyebrow: "Straight answers", title: "Eight things worth knowing before Tuesday", body: "Short answers from the skippers who run the boats, not from a call centre." }}
        items={demoFaqs}
        cta={bookCta}
      />
    ),
  },
  {
    code: "FAQ-08", category: "FAQ",
    label: "Photo column beside a button driven accordion, image keeps its own area",
    file: "components/sections/faq/faq-08.tsx", component: "Faq08",
    props: "heading?: SectionHeading, items: FaqItem[], image: Img, cta?: Cta, caption?: string",
    node: (
      <Faq08
        heading={{ eyebrow: "Ask the skipper", title: "What guests want settled before they pay" }}
        items={demoFaqs.slice(0, 6)}
        image={img(4, "Crew rigging the mainsail at the marina before the morning departure")}
        caption="Morning rig check at Slip 14, about an hour before the first guests arrive."
        cta={contactCta}
      />
    ),
  },
  {
    code: "FAQ-09", category: "FAQ",
    label: "Conversation layout, guest questions as bubbles, crew replies with an avatar",
    file: "components/sections/faq/faq-09.tsx", component: "Faq09",
    props: "heading?: SectionHeading, items: FaqItem[], avatar?: Img, crewName?: string, cta?: Cta",
    node: (
      <Faq09
        heading={{ eyebrow: "Dock talk", title: "How these conversations usually go", body: "Word for word, the exchange we have on the pontoon most mornings." }}
        items={demoFaqs.slice(0, 5)}
        avatar={img(11, "Capt. Ray Oduber at the helm of the Oranjestad boat")}
        crewName="Capt. Ray, Blue Water Sail"
        cta={contactCta}
      />
    ),
  },
  {
    code: "FAQ-10", category: "FAQ",
    label: "Compact two column definition list with a still have questions card as the final cell",
    file: "components/sections/faq/faq-10.tsx", component: "Faq10",
    props: "heading?: SectionHeading, items: FaqItem[], cta?: Cta, ctaTitle?: string, ctaBody?: string",
    node: (
      <Faq10
        heading={{ eyebrow: "Quick reference", title: "Short answers, no clicking" }}
        items={demoFaqs}
        ctaTitle="Still have questions?"
        ctaBody="Call the slip on +297 588 1420 or send a note. Someone at Renaissance Marina replies within the hour."
        cta={contactCta}
      />
    ),
  },
];
