import { Marquee } from "@/components/magic/marquee";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { Img, SectionHeading } from "@/content/types";

/**
 * The moving wall. Three vertical columns run at different speeds in
 * alternating directions, masked top and bottom so photos arrive and leave
 * rather than starting and stopping. CSS keyframes only, paused on hover.
 */
export function Gallery01({
  heading,
  images,
  className,
}: {
  heading?: SectionHeading;
  images: Img[];
  className?: string;
}) {
  if (images.length === 0) return null;

  const per = Math.ceil(images.length / 3);
  const columns = [
    images.slice(0, per),
    images.slice(per, per * 2).length > 0 ? images.slice(per, per * 2) : images,
    images.slice(per * 2).length > 0 ? images.slice(per * 2) : images,
  ];
  const speeds = ["[--marquee-duration:34s]", "[--marquee-duration:48s]", "[--marquee-duration:40s]"];

  return (
    <section className={cn("overflow-hidden bg-background py-20", className)}>
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}
      </div>

      <div
        className="mt-12 flex h-[34rem] justify-center gap-4 px-6 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] sm:h-[42rem]"
        aria-label="Photographs from recent charters"
      >
        {columns.map((col, i) => (
          <Marquee
            key={i}
            vertical
            pauseOnHover
            reverse={i === 1}
            className={cn(
              "h-full w-1/3 max-w-[22rem] p-0 [--marquee-gap:1rem] motion-reduce:[&_*]:animate-none",
              speeds[i],
              i === 2 && "hidden sm:flex",
            )}
          >
            {col.map((image, j) => (
              <figure
                key={image.src + j}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover transition duration-300 ease-out hover:scale-[1.03]"
                />
              </figure>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
