import {
  Anchor,
  Check,
  Clock,
  MapPin,
  MessageCircle,
  Share2,
  Shield,
  Star,
  Users,
  Utensils,
  WavesLadder as Waves,
} from "lucide-react";
import { BookingCard } from "@/components/templates/booking-card";
import { PageFooter, PageNav } from "@/components/templates/page-chrome";
import { PhotoMosaic } from "@/components/templates/photo-mosaic";
import { Reveal } from "@/components/magic/reveal";
import {
  demoContact,
  demoGallery,
  demoTestimonials,
  demoTours,
  img,
  type Tour,
} from "@/content/demo";
import type { Img, Testimonial } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * PAGE-TOUR-DETAIL
 *
 * Listing detail page in the Airbnb register: photo mosaic, a title line that
 * carries the rating and the location, then a two column body with a sticky
 * booking panel. Reviews, a keyless OpenStreetMap frame and the cancellation
 * terms sit below the fold. Server component apart from the two client
 * helpers it composes.
 */

export type ItineraryStop = { time: string; title: string; body: string };
export type IncludedItem = { icon: "Utensils" | "Waves" | "Users" | "Shield" | "Anchor" | "Clock"; label: string };

const includedIcons = {
  Utensils,
  Waves,
  Users,
  Shield,
  Anchor,
  Clock,
} as const;

const defaultIncluded: IncludedItem[] = [
  { icon: "Utensils", label: "Lunch cooked on the back deck, plus fruit and soft drinks" },
  { icon: "Waves", label: "Masks, fins and vests in every size, child sizes included" },
  { icon: "Users", label: "Two crew aboard, twelve guests maximum, never a queue for the ladder" },
  { icon: "Shield", label: "Coast guard certified vessel and a full first aid kit" },
  { icon: "Anchor", label: "Mooring buoys instead of anchors, so the reef stays where it is" },
  { icon: "Clock", label: "Fifteen minutes of dock time before we cast off, no rush" },
];

const defaultItinerary: ItineraryStop[] = [
  { time: "16:30", title: "Board at Slip 14", body: "Meet the crew, stow your bag under the bench, and take the shaded seats at the stern if you feel the swell." },
  { time: "17:00", title: "Sail out past the lighthouse", body: "Engine off once we clear the channel. Twenty minutes of nothing but the rigging and the water." },
  { time: "17:45", title: "Anchor in the lee", body: "Swim stop in flat water. The ladder goes down and the galley starts plating." },
  { time: "18:30", title: "Dinner on deck", body: "Grilled catch, rice, a salad from the market, and the wine comes out once everyone is dry." },
  { time: "19:30", title: "Golden hour run home", body: "We time the return so the sun goes down off the port bow, then drift the last stretch." },
];

const defaultPolicy = [
  { title: "Free cancellation", body: "Cancel up to 48 hours before departure and the full amount comes back to the card you paid with, usually within three working days." },
  { title: "Weather calls", body: "The captain decides by 07:00 and texts you. If the trip is off you rebook any open slot or take a full refund. We do not keep deposits for weather." },
  { title: "Late arrivals", body: "We hold the slip for fifteen minutes past departure. Beyond that the boat has to leave, and the booking counts as used." },
  { title: "Changing your group size", body: "Drop or add guests up to 24 hours ahead at no charge, as long as the total stays at twelve or under." },
];

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star aria-hidden className="size-4 fill-current text-primary" />
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
    </span>
  );
}

export function TourDetailPage({
  tour = demoTours[0],
  images = demoGallery.slice(0, 14),
  included = defaultIncluded,
  itinerary = defaultItinerary,
  reviews = demoTestimonials,
  policy = defaultPolicy,
  hostName = "Capt. Ray Oduber",
  hostRole = "Master mariner, sailing this coast since 2004",
  hostBio = "Ray holds a commercial licence, grew up two streets from the marina, and reads the water before he reads the forecast. He runs the sunset trip himself four nights a week.",
  hostImage = img(11, "Captain Ray Oduber at the helm"),
  location = demoContact.address,
  mapQuery = demoContact.mapQuery,
  brand = "Blue Water Sail",
}: {
  tour?: Tour;
  images?: Img[];
  included?: IncludedItem[];
  itinerary?: ItineraryStop[];
  reviews?: Testimonial[];
  policy?: { title: string; body: string }[];
  hostName?: string;
  hostRole?: string;
  hostBio?: string;
  hostImage?: Img;
  location?: string;
  mapQuery?: string;
  brand?: string;
}) {
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=-70.045%2C12.505%2C-70.005%2C12.535&layer=mapnik&marker=12.5203%2C-70.0270`;

  return (
    <div id="top" className="relative bg-background">
      <PageNav brand={brand} variant="plain" />

      <main>
        {/* Photo header */}
        <section aria-label="Photos of this trip" className="mx-auto max-w-7xl px-6 pt-6">
          <PhotoMosaic images={images} />
        </section>

        {/* Title line */}
        <section className="mx-auto max-w-7xl px-6 pt-8">
          <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                {tour.title}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <Stars rating={tour.rating} />
                <a
                  href="#reviews"
                  className="cursor-pointer underline underline-offset-4 transition-colors duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {tour.reviews} reviews
                </a>
                <span aria-hidden>&middot;</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin aria-hidden className="size-4" />
                  {location}
                </span>
                <span aria-hidden>&middot;</span>
                <span className="inline-flex items-center gap-1">
                  <Clock aria-hidden className="size-4" />
                  {tour.duration}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground underline-offset-4 transition duration-200 ease-out hover:bg-muted hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Share2 aria-hidden className="size-4" />
                Share
              </button>
              <a
                href="#book"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground underline-offset-4 transition duration-200 ease-out hover:bg-muted hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <MessageCircle aria-hidden className="size-4" />
                Ask the crew
              </a>
            </div>
          </div>
        </section>

        {/* Two column body */}
        <div className="mx-auto grid max-w-7xl gap-x-16 gap-y-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            {/* Summary strip */}
            <section aria-label="Trip at a glance" className="border-b border-border pb-8">
              <dl className="grid gap-6 sm:grid-cols-3">
                {[
                  { k: "Departs from", v: tour.from },
                  { k: "On the water", v: tour.duration },
                  { k: "Group size", v: "Twelve guests maximum" },
                ].map((d) => (
                  <div key={d.k}>
                    <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                      {d.k}
                    </dt>
                    <dd className="mt-1 text-base font-medium text-foreground">{d.v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Description */}
            <Reveal as="section" className="border-b border-border py-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                About this trip
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>{tour.body}</p>
                <p>
                  We keep the boat to twelve so nobody waits for the swim ladder and the
                  galley can plate everyone at once. The route changes with the wind: on a
                  quiet evening we run further down the coast, and when the trades come up we
                  tuck into the lee and stay longer in the water.
                </p>
                <p>
                  Bring a towel, a hat and reef safe sunscreen. Everything else, from masks
                  to the wine, is already aboard.
                </p>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {tour.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* What is included */}
            <Reveal as="section" className="border-b border-border py-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                What is included
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {included.map((it) => {
                  const Cmp = includedIcons[it.icon] ?? Check;
                  return (
                    <li key={it.label} className="flex gap-3">
                      <Cmp aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                      <span className="text-sm leading-relaxed text-muted-foreground">
                        {it.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            {/* Itinerary */}
            <Reveal as="section" className="border-b border-border py-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                How the evening runs
              </h2>
              <ol className="mt-6 space-y-0">
                {itinerary.map((s, i) => (
                  <li key={s.title} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card font-mono text-[11px] text-foreground">
                        {i + 1}
                      </span>
                      {i < itinerary.length - 1 ? (
                        <span aria-hidden className="w-px flex-1 bg-border" />
                      ) : null}
                    </div>
                    <div className={cn("min-w-0", i < itinerary.length - 1 && "pb-7")}>
                      <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                        {s.time}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-foreground">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            {/* Host card */}
            <Reveal as="section" className="py-8">
              <h2 className="sr-only">Your skipper</h2>
              <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-start">
                <div className="size-20 shrink-0 overflow-hidden rounded-full bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hostImage.src}
                    alt={hostImage.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold tracking-tight text-foreground">
                    Sailed by {hostName}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{hostRole}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{hostBio}</p>
                  <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <Star aria-hidden className="size-3.5 fill-current text-primary" />
                      4.9 across {reviews.length * 200} trips
                    </span>
                    <span>Replies within an hour</span>
                    <span>Speaks English, Dutch, Papiamento</span>
                  </p>
                  <a
                    href={`mailto:${demoContact.email}`}
                    className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <MessageCircle aria-hidden className="size-4" />
                    Message the skipper
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sticky booking rail */}
          <aside id="book" aria-label="Book this trip" className="lg:pt-8">
            <div className="sticky top-24">
              <BookingCard
                price={tour.price}
                unit="per guest"
                rating={tour.rating}
                reviews={tour.reviews}
              />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {tour.reviews} guests sailed this route in the last twelve months.
              </p>
            </div>
          </aside>
        </div>

        {/* Reviews */}
        <section id="reviews" aria-label="Guest reviews" className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                <Star aria-hidden className="mr-2 inline size-5 fill-current text-primary align-[-2px]" />
                {tour.rating.toFixed(1)} from {tour.reviews} guests
              </h2>
              <p className="text-sm text-muted-foreground">
                Every review below came from someone who actually sailed.
              </p>
            </div>
            <ul className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {reviews.map((r) => (
                <li key={r.name} className="border-t border-border pt-6">
                  <p className="flex items-center gap-1" aria-label="Five out of five">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <Star key={n} aria-hidden className="size-3.5 fill-current text-primary" />
                    ))}
                  </p>
                  <blockquote className="mt-3 text-base leading-relaxed text-foreground">
                    {r.quote}
                  </blockquote>
                  <p className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{r.name}</span>
                    {r.role ? `, ${r.role}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Map */}
        <section aria-label="Where you meet the boat" className="border-t border-border bg-muted/40">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Where you meet the boat
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {location}. Walk past the chandlery and turn left at the fuel dock. Parking is
                free after 16:00 and the bus stop is two minutes away.
              </p>
              <dl className="mt-6 space-y-3 text-sm">
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    Search for
                  </dt>
                  <dd className="mt-1 text-foreground">{mapQuery}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    Call the dock
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${demoContact.phone.replace(/\s/g, "")}`}
                      className="cursor-pointer text-foreground underline underline-offset-4 transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {demoContact.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <iframe
                title={`Map showing ${mapQuery}`}
                src={mapSrc}
                loading="lazy"
                className="h-[360px] w-full border-0"
              />
            </div>
          </div>
        </section>

        {/* Cancellation policy */}
        <section aria-label="Cancellation policy" className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Cancellation policy
            </h2>
            <dl className="mt-8 divide-y divide-border border-y border-border">
              {policy.map((p) => (
                <div key={p.title} className="grid gap-2 py-5 md:grid-cols-[260px_minmax(0,1fr)] md:gap-8">
                  <dt className="text-base font-semibold text-foreground">{p.title}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">{p.body}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Shield aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
              Nothing is charged at the moment you reserve. The card is only taken once the
              captain confirms the weather window, and you can walk away free until then.
            </p>
          </div>
        </section>
      </main>

      <PageFooter brand={brand} />
    </div>
  );
}
