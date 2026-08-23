import type { CatalogEntry } from "@/components/sections/catalog-types";
import { AirbnbListingPage } from "@/components/templates/airbnb-listing-page";
import { BlogIndexPage } from "@/components/templates/blog-index-page";
import { BlogPostPage } from "@/components/templates/blog-post-page";
import { CataloguePage } from "@/components/templates/catalogue-page";
import { GalleryPage } from "@/components/templates/gallery-page";
import { TourDetailPage } from "@/components/templates/tour-detail-page";
import { demoGallery, demoTours } from "@/content/demo";

export const TEMPLATE_ENTRIES: CatalogEntry[] = [
  { code: "PAGE-TOUR-DETAIL", category: "Page templates", label: "Listing detail: photo mosaic, sticky booking rail, itinerary, reviews and a map", fullPage: true,
    file: "components/templates/tour-detail-page.tsx", component: "TourDetailPage", props: "tour: Tour, images: Img[], included: IncludedItem[], itinerary: ItineraryStop[], reviews: Testimonial[], policy: {title,body}[], hostName/hostRole/hostBio/hostImage, location, mapQuery, brand",
    node: <TourDetailPage tour={demoTours[0]} images={demoGallery.slice(0, 14)} /> },

  { code: "PAGE-CATALOGUE", category: "Page templates", label: "Filterable catalogue: sticky chip bar, live count, card grid, load more, real empty state", fullPage: true,
    file: "components/templates/catalogue-page.tsx", component: "CataloguePage", props: "tours: Tour[], facets: Facet[], eyebrow, heading, intro, brand",
    node: <CataloguePage heading="Six ways off the dock at Slip 14" eyebrow="Every trip we run" /> },

  { code: "PAGE-LISTING-GRID", category: "Page templates", label: "Airbnb style index: category icon rail, dense four up photo cards, save hearts, map split", fullPage: true,
    file: "components/templates/airbnb-listing-page.tsx", component: "AirbnbListingPage", props: "listings: Listing[], rail: RailItem[], heading, mapQuery, brand",
    node: <AirbnbListingPage heading="Boat trips out of Renaissance Marina" /> },

  { code: "PAGE-GALLERY", category: "Page templates", label: "Album page: editorial heading, filtering category tabs, masonry lightbox, colour band CTA", fullPage: true,
    file: "components/templates/gallery-page.tsx", component: "GalleryPage", props: "images: Img[], categories: GalleryCategory[], eyebrow, heading, intro, ctaTitle, ctaBody, ctaLabel, ctaHref, brand",
    node: <GalleryPage heading="Twelve seasons of water, shot from the deck" /> },

  { code: "PAGE-BLOG-INDEX", category: "Page templates", label: "Magazine index: lead story, category rail, hairline grid, pagination, newsletter strip", fullPage: true,
    file: "components/templates/blog-index-page.tsx", component: "BlogIndexPage", props: "posts: Post[], heading: SectionHeading, brand",
    node: <BlogIndexPage /> },

  { code: "PAGE-BLOG-POST", category: "Page templates", label: "Long read: reading progress, measured column, pull quotes, author card, related posts", fullPage: true,
    file: "components/templates/blog-post-page.tsx", component: "BlogPostPage", props: "post: Post, body: PostBlock[], related: Post[], brand",
    node: <BlogPostPage /> },
];
