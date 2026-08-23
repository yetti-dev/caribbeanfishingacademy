import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Gallery01 } from "@/components/sections/gallery/gallery-01";
import { Gallery02 } from "@/components/sections/gallery/gallery-02";
import { Gallery03 } from "@/components/sections/gallery/gallery-03";
import { Gallery04 } from "@/components/sections/gallery/gallery-04";
import { Gallery05, type TaggedImage } from "@/components/sections/gallery/gallery-05";
import { Gallery06 } from "@/components/sections/gallery/gallery-06";
import { demoGallery } from "@/content/demo";

const GALLERY_CATEGORIES = ["Reef", "Sunset", "On deck", "The fleet"];

const taggedGallery: TaggedImage[] = demoGallery.map((image, i) => ({
  ...image,
  category: GALLERY_CATEGORIES[i % GALLERY_CATEGORIES.length],
}));

export const GALLERY_ENTRIES: CatalogEntry[] = [
  {
    code: "GAL-01",
    category: "Gallery",
    label: "Moving wall: three vertical columns at different speeds, masked top and bottom",
    file: "components/sections/gallery/gallery-01.tsx",
    component: "Gallery01",
    props: "heading?: SectionHeading, images: Img[]",
    node: (
      <Gallery01
        heading={{
          eyebrow: "Aboard",
          title: "Twelve seasons of guests, water and light",
          body: "Every frame here was shot on a real charter out of Slip 14. No stock, no staging, no models.",
        }}
        images={demoGallery}
      />
    ),
  },
  {
    code: "GAL-02",
    category: "Gallery",
    label: "Masonry columns with a keyboard accessible lightbox",
    file: "components/sections/gallery/gallery-02.tsx",
    component: "Gallery02",
    props: "heading?: SectionHeading, images: Img[], note?: string",
    node: (
      <Gallery02
        heading={{
          eyebrow: "The log",
          title: "Open any frame full screen",
          body: "Click a photograph to enlarge it, then move through the set with the arrow keys.",
        }}
        images={demoGallery}
        note="Shot by the crew on charter days. Guests are welcome to ask for a copy of anything they appear in."
      />
    ),
  },
  {
    code: "GAL-03",
    category: "Gallery",
    label: "Horizontal scroll snap filmstrip with arrow buttons and arrow keys",
    file: "components/sections/gallery/gallery-03.tsx",
    component: "Gallery03",
    props: "heading?: SectionHeading, images: Img[]",
    node: (
      <Gallery03
        heading={{
          eyebrow: "One afternoon",
          title: "A sunset run, start to finish",
          body: "Cast off at Renaissance Marina, anchor at the reef, back alongside by dark.",
        }}
        images={demoGallery.slice(0, 12)}
      />
    ),
  },
  {
    code: "GAL-04",
    category: "Gallery",
    label: "Bento wall of uneven cells with one large feature frame",
    file: "components/sections/gallery/gallery-04.tsx",
    component: "Gallery04",
    props: "heading?: SectionHeading, images: Img[]",
    node: (
      <Gallery04
        heading={{
          eyebrow: "Oranjestad",
          title: "What a half day off Aruba actually looks like",
          body: "Nine frames, no filter, picked from the last three months of charters.",
        }}
        images={demoGallery.slice(2, 11)}
      />
    ),
  },
  {
    code: "GAL-05",
    category: "Gallery",
    label: "Chip filtered grid with a live count and an empty state",
    file: "components/sections/gallery/gallery-05.tsx",
    component: "Gallery05",
    props: "heading?: SectionHeading, images: (Img & { category: string })[], allLabel?: string, emptyLabel?: string",
    node: (
      <Gallery05
        heading={{
          eyebrow: "Browse",
          title: "Filter the log by what you came for",
          body: "Reef trips, sunset runs, deck life and the boats themselves.",
        }}
        images={taggedGallery}
        allLabel="Everything"
        emptyLabel="Nothing filed under this yet. Try Reef or Sunset."
      />
    ),
  },
  {
    code: "GAL-06",
    category: "Gallery",
    label: "Sticky feature image beside a scrolling thumbnail list, crossfade on click",
    file: "components/sections/gallery/gallery-06.tsx",
    component: "Gallery06",
    props: "heading?: SectionHeading, images: Img[]",
    node: (
      <Gallery06
        heading={{
          eyebrow: "Frame by frame",
          title: "Pick a photograph and it opens on the left",
          body: "Captions come straight from the crew log, so they say what was happening rather than what looks good.",
        }}
        images={demoGallery.slice(0, 8)}
      />
    ),
  },
];
