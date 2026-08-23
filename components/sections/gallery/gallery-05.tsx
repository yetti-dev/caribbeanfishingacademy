"use client";

import * as React from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Img, SectionHeading } from "@/content/types";

export type TaggedImage = Img & { category: string };

/** Chip filtered grid. Counts the visible set and says so when a filter empties it. */
export function Gallery05({
  heading,
  images,
  allLabel = "Everything",
  emptyLabel = "Nothing shot in this category yet. Try another filter.",
  className,
}: {
  heading?: SectionHeading;
  images: TaggedImage[];
  allLabel?: string;
  emptyLabel?: string;
  className?: string;
}) {
  const categories = React.useMemo(
    () => Array.from(new Set(images.map((i) => i.category))),
    [images],
  );
  const [active, setActive] = React.useState<string | null>(null);

  const visible = active ? images.filter((i) => i.category === active) : images;
  const chips: { key: string; label: string; value: string | null }[] = [
    { key: "__all", label: allLabel, value: null },
    ...categories.map((c) => ({ key: c, label: c, value: c })),
  ];

  if (images.length === 0) return null;

  return (
    <section className={cn("bg-background py-20", className)}>
      <div className="mx-auto max-w-7xl px-6">
        {heading?.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
        {heading?.title ? (
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
        ) : null}
        {heading?.body ? (
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {chips.map((chip) => {
            const on = chip.value === active;
            return (
              <button
                key={chip.key}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(chip.value)}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:bg-accent",
                )}
              >
                {chip.label}
              </button>
            );
          })}
          <span className="ml-auto font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {visible.length} of {images.length}
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
            <ImageOff aria-hidden className="size-6 text-muted-foreground" />
            <p className="max-w-sm text-sm text-muted-foreground">{emptyLabel}</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((image, i) => (
              <figure
                key={image.src + i}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover transition duration-300 ease-out hover:scale-105"
                />
                <figcaption className="px-3 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {image.category}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
