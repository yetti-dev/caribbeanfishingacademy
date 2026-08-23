"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Img, SectionHeading } from "@/content/types";

/**
 * Split gallery. A large image sticks on the left while a thumbnail list scrolls
 * past on the right, and picking a thumb crossfades the big frame.
 */
export function Gallery06({
  heading,
  images,
  className,
}: {
  heading?: SectionHeading;
  images: Img[];
  className?: string;
}) {
  const [active, setActive] = React.useState(0);
  if (images.length === 0) return null;

  const current = images[Math.min(active, images.length - 1)];

  return (
    <section className={cn("bg-background py-20", className)}>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
            {images.map((image, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={image.src + i}
                src={image.src}
                alt={image.alt}
                width={1600}
                height={1200}
                loading="lazy"
                decoding="async"
                aria-hidden={i !== active}
                className={cn(
                  "absolute inset-0 size-full object-cover transition-opacity duration-300 ease-out motion-reduce:transition-none",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{current.alt}</p>
        </div>

        <div>
          {heading?.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          {heading?.title ? (
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
              {heading.title}
            </h2>
          ) : null}
          {heading?.body ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{heading.body}</p>
          ) : null}

          <ul className="mt-8 divide-y divide-border border-y border-border">
            {images.map((image, i) => (
              <li key={image.src + i}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  className={cn(
                    "group flex w-full cursor-pointer items-center gap-4 py-3 pr-2 text-left transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    i === active ? "pl-3" : "pl-0 hover:pl-3",
                  )}
                >
                  <span className="overflow-hidden rounded-md border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      alt=""
                      aria-hidden
                      width={160}
                      height={120}
                      loading="lazy"
                      decoding="async"
                      className={cn(
                        "size-16 object-cover transition duration-300 ease-out group-hover:scale-105",
                        i === active ? "opacity-100" : "opacity-70",
                      )}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "mt-1 block text-sm leading-snug",
                        i === active ? "font-semibold text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {image.alt}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
