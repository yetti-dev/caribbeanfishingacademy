import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Testimonial01 } from "@/components/sections/testimonials/testimonial-01";
import { Testimonial02 } from "@/components/sections/testimonials/testimonial-02";
import { Testimonial03 } from "@/components/sections/testimonials/testimonial-03";
import { Testimonial04 } from "@/components/sections/testimonials/testimonial-04";
import { Testimonial05 } from "@/components/sections/testimonials/testimonial-05";
import { Testimonial06 } from "@/components/sections/testimonials/testimonial-06";
import { Testimonial07 } from "@/components/sections/testimonials/testimonial-07";
import { Testimonial08 } from "@/components/sections/testimonials/testimonial-08";
import { Testimonial09 } from "@/components/sections/testimonials/testimonial-09";
import { Testimonial10 } from "@/components/sections/testimonials/testimonial-10";
import { demoLogos, demoTestimonials, img } from "@/content/demo";
import type { Testimonial } from "@/content/types";

/** demoTestimonials with a verified photo attached, for the blocks that show faces. */
const withFaces: Testimonial[] = demoTestimonials.map((t, i) => ({
  ...t,
  avatar: img(i + 30, `${t.name}, back from a trip with Blue Water Sail`),
}));

export const TESTIMONIAL_ENTRIES: CatalogEntry[] = [
  {
    code: "TEST-01",
    category: "Testimonials",
    label: "One oversized pull quote, centred, giant display type and a tiny attribution",
    file: "components/sections/testimonials/testimonial-01.tsx",
    component: "Testimonial01",
    props: "eyebrow?: string, testimonial: Testimonial",
    node: <Testimonial01 eyebrow="What guests say" testimonial={withFaces[0]} />,
  },
  {
    code: "TEST-02",
    category: "Testimonials",
    label: "Masonry wall on CSS columns, so card heights stagger instead of locking to rows",
    file: "components/sections/testimonials/testimonial-02.tsx",
    component: "Testimonial02",
    props: "heading: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial02
        heading={{
          eyebrow: "Reviews",
          title: "Six seasons of guests, in their own words",
          body: "Every review below came from a guest who sailed out of Slip 14 at Renaissance Marina.",
        }}
        testimonials={withFaces}
      />
    ),
  },
  {
    code: "TEST-03",
    category: "Testimonials",
    label: "Two vertical marquee columns running opposite ways beside a fixed heading",
    file: "components/sections/testimonials/testimonial-03.tsx",
    component: "Testimonial03",
    props: "heading: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial03
        heading={{
          eyebrow: "Guest log",
          title: "The reviews keep rolling in",
          body: "Twelve guests a trip means the crew learns your name. That is what people write about afterwards.",
        }}
        testimonials={withFaces}
      />
    ),
  },
  {
    code: "TEST-04",
    category: "Testimonials",
    label: "Split slider, photo one side and quote the other, arrow keys and prev/next controls",
    file: "components/sections/testimonials/testimonial-04.tsx",
    component: "Testimonial04",
    props: "heading?: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial04
        heading={{ eyebrow: "Aboard", title: "One trip, one story at a time" }}
        testimonials={withFaces.slice(0, 4)}
      />
    ),
  },
  {
    code: "TEST-05",
    category: "Testimonials",
    label: "Ratings forward, a sticky average score panel beside a compact starred review list",
    file: "components/sections/testimonials/testimonial-05.tsx",
    component: "Testimonial05",
    props: "heading: SectionHeading, score: number, reviewCount: string, source?: string, testimonials: Testimonial[]",
    node: (
      <Testimonial05
        heading={{
          eyebrow: "Rated by guests",
          title: "4.9 across two thousand trips",
          body: "Ratings come from guests who actually sailed. We do not filter the low ones out.",
        }}
        score={4.9}
        reviewCount="2,041"
        source="TripAdvisor"
        testimonials={withFaces.slice(0, 4)}
      />
    ),
  },
  {
    code: "TEST-06",
    category: "Testimonials",
    label: "Inverted brand band, three quotes on hairline rules, no cards at all",
    file: "components/sections/testimonials/testimonial-06.tsx",
    component: "Testimonial06",
    props: "heading: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial06
        heading={{
          eyebrow: "On the water",
          title: "Why people book us twice",
          body: "Three notes from the guest book at Slip 14, picked because they say the same thing three ways.",
        }}
        testimonials={demoTestimonials}
      />
    ),
  },
  {
    code: "TEST-07",
    category: "Testimonials",
    label: "Trust marks ticking past in a marquee above one featured quote",
    file: "components/sections/testimonials/testimonial-07.tsx",
    component: "Testimonial07",
    props: "eyebrow?: string, logos: string[], testimonial: Testimonial",
    node: <Testimonial07 eyebrow="Certified and listed by" logos={demoLogos} testimonial={withFaces[1]} />,
  },
  {
    code: "TEST-08",
    category: "Testimonials",
    label: "A deck of quote cards, click the top one and it flies off to reveal the next",
    file: "components/sections/testimonials/testimonial-08.tsx",
    component: "Testimonial08",
    props: "heading: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial08
        heading={{
          eyebrow: "Guest book",
          title: "Deal one review at a time",
          body: "Tap a card to see the next note guests left after a sunset run out of Oranjestad.",
        }}
        testimonials={withFaces}
      />
    ),
  },
  {
    code: "TEST-09",
    category: "Testimonials",
    label: "Editorial numbered list, oversized numerals in the margin and alternating alignment",
    file: "components/sections/testimonials/testimonial-09.tsx",
    component: "Testimonial09",
    props: "heading: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial09
        heading={{ eyebrow: "Selected notes", title: "Five reviews worth reading in full" }}
        testimonials={withFaces.slice(0, 5)}
      />
    ),
  },
  {
    code: "TEST-10",
    category: "Testimonials",
    label: "Bento, one tall featured quote with a photo and four small quote cells packed around it",
    file: "components/sections/testimonials/testimonial-10.tsx",
    component: "Testimonial10",
    props: "heading: SectionHeading, featured: Testimonial, testimonials: Testimonial[]",
    node: (
      <Testimonial10
        heading={{
          eyebrow: "Reviews",
          title: "The whole guest book on one screen",
          body: "Sunset cruises, reef trips and private charters. Same crew, same twelve seats.",
        }}
        featured={{
          quote: "Third year running. The boat is spotless and the snorkel gear actually fits children properly.",
          name: "Hannah Wiggins",
          role: "Toronto",
          avatar: img(6, "Guests swimming off the stern on a reef stop"),
        }}
        testimonials={demoTestimonials.slice(0, 4)}
      />
    ),
  },
];
