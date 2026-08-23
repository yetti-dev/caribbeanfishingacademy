import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { Img, SectionHeading } from "@/content/types";

/** Bento wall. One feature cell, then a deliberately uneven run of supporting cells. */
export function Gallery04({
  heading,
  images,
  className,
}: {
  heading?: SectionHeading;
  images: Img[];
  className?: string;
}) {
  if (images.length === 0) return null;

  const cells = images.slice(0, 9);
  /** Literal class strings, one per cell index, so nothing gets purged. */
  const spans = [
    "col-span-2 row-span-2",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
  ];

  return (
    <section className={cn("bg-muted py-20", className)}>
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            {heading?.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            {heading?.title ? (
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
                {heading.title}
              </h2>
            ) : null}
          </div>
          {heading?.body ? (
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">{heading.body}</p>
          ) : null}
        </Reveal>

        <div className="mt-10 grid auto-rows-[9rem] grid-cols-2 gap-2 sm:auto-rows-[11rem] lg:grid-cols-4">
          {cells.map((image, i) => (
            <figure
              key={image.src + i}
              className={cn(
                "overflow-hidden rounded-lg border border-border bg-card",
                spans[i % spans.length],
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                width={1200}
                height={1200}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition duration-300 ease-out hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
