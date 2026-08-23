import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Cta01 } from "@/components/sections/cta/cta-01";
import { Cta02 } from "@/components/sections/cta/cta-02";
import { Cta03 } from "@/components/sections/cta/cta-03";
import { Cta04 } from "@/components/sections/cta/cta-04";
import { Cta05 } from "@/components/sections/cta/cta-05";
import { Cta06 } from "@/components/sections/cta/cta-06";
import { Cta07 } from "@/components/sections/cta/cta-07";
import { Cta08 } from "@/components/sections/cta/cta-08";
import { Cta09 } from "@/components/sections/cta/cta-09";
import { Cta10 } from "@/components/sections/cta/cta-10";
import { demoContact, demoCta, demoCtaAlt, demoStats, img } from "@/content/demo";

export const CTA_ENTRIES: CatalogEntry[] = [
  {
    code: "CTA-01",
    category: "CTA",
    label: "Full bleed brand band, centered heading and a pair of buttons",
    file: "components/sections/cta/cta-01.tsx",
    component: "Cta01",
    props: "heading: SectionHeading, primary?: Cta, secondary?: Cta, footnote?: string",
    node: (
      <Cta01
        heading={{
          eyebrow: "Slip 14, Renaissance Marina",
          title: "The trade winds drop at four. That is when we sail.",
          body: "Sunset departures run seven days a week from Oranjestad, twelve guests maximum, lunch and snorkel gear included.",
        }}
        primary={demoCta}
        secondary={demoCtaAlt}
        footnote="Free rebooking if the captain calls it off for weather."
      />
    ),
  },
  {
    code: "CTA-02",
    category: "CTA",
    label: "Contained card floating on a neutral page, lit by a border beam",
    file: "components/sections/cta/cta-02.tsx",
    component: "Cta02",
    props: "heading: SectionHeading, primary?: Cta, secondary?: Cta, footnote?: string",
    node: (
      <Cta02
        heading={{
          eyebrow: "Private charter",
          title: "Take the whole boat for the afternoon",
          body: "Eight to twelve guests, your route, your playlist. The crew handles the cake, the cooler and the paperwork.",
        }}
        primary={demoCta}
        secondary={demoCtaAlt}
        footnote="Deposit refundable up to 48 hours out."
      />
    ),
  },
  {
    code: "CTA-03",
    category: "CTA",
    label: "Split panel, copy on a solid surface with the photograph in its own half",
    file: "components/sections/cta/cta-03.tsx",
    component: "Cta03",
    props: "heading: SectionHeading, primary?: Cta, secondary?: Cta, image?: Img, points?: string[], footnote?: string",
    node: (
      <Cta03
        heading={{
          eyebrow: "Half day reef trip",
          title: "Two reefs, one lunch, back by three",
          body: "We leave the marina at nine, moor at Mangel Halto, then run north to the second reef while the galley grills the catch.",
        }}
        points={[
          "Mooring buoys instead of anchors, every trip",
          "Reef safe sunscreen and masks in children's sizes",
          "Vegetarian and allergy plates sorted when you book",
        ]}
        primary={demoCta}
        secondary={demoCtaAlt}
        image={img(3, "Snorkellers sliding off the stern ladder above the reef at Mangel Halto")}
        footnote="Departs daily at 09:00 from Slip 14."
      />
    ),
  },
  {
    code: "CTA-04",
    category: "CTA",
    label: "Newsletter capture, one field and one reassurance line",
    file: "components/sections/cta/cta-04.tsx",
    component: "Cta04",
    props: "heading: SectionHeading, buttonLabel?: string, placeholder?: string, footnote?: string, successNote?: string",
    node: (
      <Cta04
        heading={{
          eyebrow: "Tide notes",
          title: "Know when the water is flat",
          body: "One short email each Thursday: the week's sailing conditions, open seats, and the odd turtle photo from the crew.",
        }}
        buttonLabel="Send me the notes"
        placeholder="you@example.com"
        footnote="One email a week. Unsubscribe in a click, no hard feelings."
        successNote="Thanks. Check your inbox to confirm and we will see you Thursday."
      />
    ),
  },
  {
    code: "CTA-05",
    category: "CTA",
    label: "Sticky bottom bar with price, availability and a booking button",
    file: "components/sections/cta/cta-05.tsx",
    component: "Cta05",
    props: "price: string, priceNote?: string, availability?: string, primary?: Cta",
    sticky: true,
    node: (
      <Cta05
        price="$89"
        priceNote="per guest"
        availability="Four seats left on Friday's sunset sail"
        primary={demoCta}
      />
    ),
  },
  {
    code: "CTA-06",
    category: "CTA",
    label: "Dark panel with a token built colour mesh and one oversized button",
    file: "components/sections/cta/cta-06.tsx",
    component: "Cta06",
    props: "heading: SectionHeading, primary?: Cta, footnote?: string",
    node: (
      <Cta06
        heading={{
          eyebrow: "Blue Water Sail",
          title: "Twelve guests. One boat. No queue for the ladder.",
          body: "Twelve years running small trips out of Oranjestad with captains who grew up on this water.",
        }}
        primary={demoCta}
        footnote="Coast guard certified, hull inspected every year."
      />
    ),
  },
  {
    code: "CTA-07",
    category: "CTA",
    label: "Stat backed, three numbers on hairlines with the ask carded beside them",
    file: "components/sections/cta/cta-07.tsx",
    component: "Cta07",
    props: "heading: SectionHeading, stats?: Stat[], primary?: Cta, secondary?: Cta, footnote?: string",
    node: (
      <Cta07
        heading={{
          eyebrow: "Since 2013",
          title: "Book the boat the island books",
          body: "Most of our Friday seats go to people who sailed with us last season. The rest fill by Wednesday.",
        }}
        stats={demoStats}
        primary={demoCta}
        secondary={demoCtaAlt}
        footnote="Average guest rating across 2,400 reviews."
      />
    ),
  },
  {
    code: "CTA-08",
    category: "CTA",
    label: "Two tappable contact tiles, a real tel link and a real WhatsApp link",
    file: "components/sections/cta/cta-08.tsx",
    component: "Cta08",
    props: "heading: SectionHeading, phone: string, whatsapp: string, callLabel?, messageLabel?, callNote?, messageNote?, footnote?",
    node: (
      <Cta08
        heading={{
          eyebrow: "Talk to the crew",
          title: "Questions about the swell, the kids, or the cooler?",
          body: "Someone at Slip 14 picks up between seven and seven. If the boat is out, WhatsApp reaches the office instead.",
        }}
        phone={demoContact.phone}
        whatsapp={demoContact.whatsapp}
        callLabel="Call the marina office"
        messageLabel="Message us on WhatsApp"
        callNote="Monday to Saturday, 07:00 to 19:00 island time."
        messageNote="Usually answered within the hour, photos welcome."
        footnote="Slip 14, Renaissance Marina, Oranjestad."
      />
    ),
  },
  {
    code: "CTA-09",
    category: "CTA",
    label: "Editorial hairline band, oversized headline with the button set inline",
    file: "components/sections/cta/cta-09.tsx",
    component: "Cta09",
    props: "heading: SectionHeading, tail?: string, primary?: Cta, footnote?: string",
    node: (
      <Cta09
        heading={{
          eyebrow: "Oranjestad",
          title: "The reef is twenty minutes out and the boat leaves at nine.",
          body: "Sunset cruise, snorkel and sail, or the whole boat to yourself. Twelve guests maximum on every departure.",
        }}
        tail="Seats go fast."
        primary={demoCta}
        footnote="Slip 14, Renaissance Marina. Daily departures 09:00 and 16:30."
      />
    ),
  },
  {
    code: "CTA-10",
    category: "CTA",
    label: "Offset composition, photo column crossing the edge of a colour block",
    file: "components/sections/cta/cta-10.tsx",
    component: "Cta10",
    props: "heading: SectionHeading, primary?: Cta, secondary?: Cta, image?: Img, footnote?: string",
    node: (
      <Cta10
        heading={{
          eyebrow: "Sunset cruise",
          title: "Cast off at half four, back under the lights",
          body: "Two and a half hours down the leeward coast with the galley open and the sails up the whole way.",
        }}
        primary={demoCta}
        secondary={demoCtaAlt}
        image={img(7, "Blue Water Sail's catamaran heeling into the light off the Oranjestad coast")}
        footnote="Prices are per guest and include lunch, drinks and snorkel gear. Children under six sail free with a paying adult."
      />
    ),
  },
];
