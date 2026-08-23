import type { CatalogEntry } from "@/components/sections/catalog-types";
import { About01 } from "@/components/sections/about/about-01";
import { About02 } from "@/components/sections/about/about-02";
import { About03 } from "@/components/sections/about/about-03";
import { About04 } from "@/components/sections/about/about-04";
import { About05 } from "@/components/sections/about/about-05";
import { Team01 } from "@/components/sections/about/team-01";
import { Team02 } from "@/components/sections/about/team-02";
import { Team03 } from "@/components/sections/about/team-03";
import { Team04 } from "@/components/sections/about/team-04";
import { Team05 } from "@/components/sections/about/team-05";
import { demoCta, demoFeatures, demoStats, demoTeam, img } from "@/content/demo";

const story = [
  "Blue Water Sail started with one wooden sloop, a secondhand compressor and a hand painted sign at the top of the dock. Ray Oduber had crewed other people's boats down this coast for eleven years and had a very short list of things he would do differently.",
  "The first of them was numbers. Twelve guests, never fourteen, so nobody waits for the ladder and everybody gets shade. The second was lunch, cooked aboard rather than handed over in a box at the marina gate.",
  "The third took longer. We stopped anchoring on the reef in 2016 and paid for two mooring buoys ourselves, which is why the coral at our first stop still looks the way it did when we found it.",
  "Six boats later the sign is still hand painted and Slip 14 is still where you meet us, fifteen minutes before departure, at Renaissance Marina in Oranjestad.",
];

const milestones = [
  { year: "2013", title: "One sloop, one slip", body: "Ray buys the Trade Wind at auction, refits her over a winter and runs the first paying trip in March." },
  { year: "2016", title: "Off the anchor, onto a buoy", body: "We fund two mooring buoys at the inside reef so no hook ever touches coral on our trips again." },
  { year: "2019", title: "The galley opens", body: "Sofia joins and lunch stops being a lunchbox. Grilled catch, fresh fruit, cooked on the back deck." },
  { year: "2022", title: "Coral Skiff joins the fleet", body: "A shallow draft tender for the inside reef, and the right boat for the early dolphin run." },
  { year: "2024", title: "Marlin II rebuilt", body: "Forty two feet, a swim ladder a four year old can climb, and the boat guests now ask for by name." },
];

const socials = [
  { label: "Email", href: "mailto:hello@bluewatersail.example", icon: "Mail" },
  { label: "WhatsApp", href: "https://wa.me/2975881420", icon: "MessageCircle" },
  { label: "Call the dock office", href: "tel:+2975881420", icon: "Phone" },
];

const teamWithSocials = demoTeam.map((m) => ({ ...m, socials }));
const teamWithEmail = demoTeam.map((m, i) => ({
  ...m,
  email: ["ray", "ilse", "marcus", "sofia"][i % 4] + "@bluewatersail.example",
}));

export const ABOUT_ENTRIES: CatalogEntry[] = [
  {
    code: "ABOUT-01",
    category: "About",
    label: "Measured story column with a drop cap and one wide photo breaking the measure",
    file: "components/sections/about/about-01.tsx",
    component: "About01",
    props: "heading: SectionHeading, body?: string[], image?: Img, caption?: string",
    node: (
      <About01
        heading={{
          eyebrow: "Since 2013",
          title: "One boat, a short list of things we would do differently",
          body: "Twelve seasons on the same stretch of water, run by people who grew up looking at it.",
        }}
        body={story}
        image={img(2, "Wide open water seen from the deck of the Trade Wind")}
        caption="The Trade Wind on the run down to the sand bar, five miles south of Oranjestad."
      />
    ),
  },
  {
    code: "ABOUT-02",
    category: "About",
    label: "Split copy panel with a hairline separated 2x2 stat block",
    file: "components/sections/about/about-02.tsx",
    component: "About02",
    props: "heading: SectionHeading, body?: string[], stats?: Stat[], footnote?: string",
    node: (
      <About02
        heading={{
          eyebrow: "The operation",
          title: "Small enough to remember your name, old enough to read the weather",
          body: "Six boats, nine crew, one dock. Everything we run departs from Slip 14 and comes back to it.",
        }}
        body={[
          "Every skipper on the roster holds a commercial licence and has worked this coast for at least five seasons. That is why the captain, not the calendar, decides whether a trip sails.",
          "If the call goes against you we rebook free or refund the same day. No arguing about deposits.",
        ]}
        stats={demoStats}
        footnote="Figures current to June 2026, taken from the trip log."
      />
    ),
  },
  {
    code: "ABOUT-03",
    category: "About",
    label: "Milestone rail with years in the margin, alternating sides on desktop",
    file: "components/sections/about/about-03.tsx",
    component: "About03",
    props: "heading: SectionHeading, milestones?: {year, title, body}[]",
    node: (
      <About03
        heading={{
          eyebrow: "How we got here",
          title: "Twelve seasons, five decisions that mattered",
          body: "Nothing about the fleet was planned. Each boat answered a problem the last one could not.",
        }}
        milestones={milestones}
      />
    ),
  },
  {
    code: "ABOUT-04",
    category: "About",
    label: "Asymmetric three photo collage with slight rotations beside the copy",
    file: "components/sections/about/about-04.tsx",
    component: "About04",
    props: "heading: SectionHeading, body?: string[], images?: Img[], cta?: Cta",
    node: (
      <About04
        heading={{
          eyebrow: "Aboard",
          title: "What a morning at Slip 14 actually looks like",
          body: "Ice at six, fuel at half six, guests at half seven. The reef is glass until about ten.",
        }}
        body={[
          "The crew loads before anybody arrives so the first thing you do is sit down. Masks and fins are sized on the dock, not fought over at the swim stop.",
          "Sofia cooks on the back deck while we are underway, which is why lunch lands the moment the second reef stop finishes.",
        ]}
        images={[
          img(9, "Crew reading the water from the bow at first light"),
          img(14, "Grilled catch and fresh fruit plated on the back deck"),
          img(1, "Snorkeller drifting above the inside reef"),
        ]}
        cta={demoCta}
      />
    ),
  },
  {
    code: "ABOUT-05",
    category: "About",
    label: "Numbered value cards on an inverted dark panel under a long lead",
    file: "components/sections/about/about-05.tsx",
    component: "About05",
    props: "heading: SectionHeading, lead?: string, values?: Feature[]",
    node: (
      <About05
        heading={{
          eyebrow: "What we hold to",
          title: "Six rules the crew will not trade away",
          body: "They cost us bookings in high season. We have never found a good reason to drop one.",
        }}
        lead="Most day boats on this coast run on volume: fill the deck, get back, turn it around. We priced the opposite from the first season and built the fleet around it. Fewer guests, longer stops, a captain who can say no to the forecast without asking an office."
        values={demoFeatures}
      />
    ),
  },
  {
    code: "TEAM-01",
    category: "Team",
    label: "Square portrait grid, bio unfolds on hover and on keyboard focus",
    file: "components/sections/about/team-01.tsx",
    component: "Team01",
    props: "heading?: SectionHeading, members: Member[]",
    node: (
      <Team01
        heading={{
          eyebrow: "The crew",
          title: "Nine people, one dock, no agency staff",
          body: "Everybody on this list has worked a full season aboard. Hover or tab a portrait for the long version.",
        }}
        members={demoTeam}
      />
    ),
  },
  {
    code: "TEAM-02",
    category: "Team",
    label: "Editorial rows with a display sized name, alternating sides, hairline between",
    file: "components/sections/about/team-02.tsx",
    component: "Team02",
    props: "heading?: SectionHeading, members: Member[]",
    node: (
      <Team02
        heading={{
          eyebrow: "Who you sail with",
          title: "The four you will actually meet at Slip 14",
          body: "One of them will be at the top of the dock with your name on a clipboard.",
        }}
        members={demoTeam}
      />
    ),
  },
  {
    code: "TEAM-03",
    category: "Team",
    label: "Tight row of circular portraits, bio card pops above with a socials row",
    file: "components/sections/about/team-03.tsx",
    component: "Team03",
    props: "heading?: SectionHeading, members: (Member & { socials?: Link[] })[]",
    node: (
      <Team03
        heading={{
          eyebrow: "Say hello",
          title: "The people behind the bookings",
          body: "Message any of them directly. Ilse answers fastest, usually before the kettle boils.",
        }}
        members={teamWithSocials}
      />
    ),
  },
  {
    code: "TEAM-04",
    category: "Team",
    label: "Overlapping rotated cards on a colour band, straightening on hover or focus",
    file: "components/sections/about/team-04.tsx",
    component: "Team04",
    props: "heading?: SectionHeading, members: Member[]",
    node: (
      <Team04
        heading={{
          eyebrow: "On the roster",
          title: "Licensed, local, and on the water most days of the week",
          body: "Between them they have logged more than nine thousand trips out of Renaissance Marina.",
        }}
        members={demoTeam}
      />
    ),
  },
  {
    code: "TEAM-05",
    category: "Team",
    label: "Compact directory table with mono column headers and a mail link per row",
    file: "components/sections/about/team-05.tsx",
    component: "Team05",
    props: "heading?: SectionHeading, members: (Member & { email?: string })[], columns?: {person, role, about, contact}",
    node: (
      <Team05
        heading={{
          eyebrow: "Directory",
          title: "Who to write to, and about what",
          body: "Charters and dietary requests go to Ilse. Anything about the water goes to Ray.",
        }}
        members={teamWithEmail}
        columns={{ person: "Crew", role: "Aboard as", about: "Known for", contact: "Write to" }}
      />
    ),
  },
];
