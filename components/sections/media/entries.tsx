import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Logos01 } from "@/components/sections/media/logos-01";
import { Logos02 } from "@/components/sections/media/logos-02";
import { Logos03 } from "@/components/sections/media/logos-03";
import { Logos04 } from "@/components/sections/media/logos-04";
import { demoLogos } from "@/content/demo";

export const MEDIA_ENTRIES: CatalogEntry[] = [
  {
    code: "LOGO-01",
    category: "Logos",
    label: "Single infinite strip, faded at both edges, pauses on hover",
    file: "components/sections/media/logos-01.tsx",
    component: "Logos01",
    props: "logos: string[] | { name: string; src?: string }[], heading?: string",
    node: <Logos01 logos={demoLogos} heading="Who signs off on Blue Water Sail" />,
  },
  {
    code: "LOGO-02",
    category: "Logos",
    label: "Two pill rows travelling in opposite directions on a muted band",
    file: "components/sections/media/logos-02.tsx",
    component: "Logos02",
    props: "logos: string[] | { name: string; src?: string }[], heading?: string",
    node: <Logos02 logos={demoLogos} heading="Inspected, licensed, reef safe" />,
  },
  {
    code: "LOGO-03",
    category: "Logos",
    label: "Statement column beside a vertical ticker of marks",
    file: "components/sections/media/logos-03.tsx",
    component: "Logos03",
    props: "logos: string[] | { name: string; src?: string }[], heading?: string, body?: string, eyebrow?: string",
    node: (
      <Logos03
        logos={demoLogos}
        eyebrow="Slip 14, Renaissance Marina"
        heading="Every boat we run is checked by someone who is not us"
        body="Coast Guard inspection, marina berth audit and a reef operator review, renewed each season before the first charter leaves Oranjestad."
      />
    ),
  },
  {
    code: "LOGO-04",
    category: "Logos",
    label: "Hairline grid on desktop, ticker below md, with a trust line",
    file: "components/sections/media/logos-04.tsx",
    component: "Logos04",
    props: "logos: string[] | { name: string; src?: string }[], heading?: string, trustLine?: string",
    node: (
      <Logos04
        logos={demoLogos}
        heading="Certifications we hold, and keep current"
        trustLine="All six renewed within the last twelve months. Paperwork is on the wall at Slip 14 if you want to read it."
      />
    ),
  },
];
