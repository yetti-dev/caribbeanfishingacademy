import { BadgeCheck } from "lucide-react";
import { Marquee } from "@/components/magic/marquee";
import { cn } from "@/lib/utils";
import { LogoMark, normalizeLogos, type LogoItem } from "@/components/sections/media/logos-01";

/** Bordered hairline grid on desktop that collapses into a ticker on small screens. */
export function Logos04({
  logos,
  heading,
  trustLine,
  className,
}: {
  logos: string[] | LogoItem[];
  heading?: string;
  trustLine?: string;
  className?: string;
}) {
  const items = normalizeLogos(logos);
  if (items.length === 0) return null;

  return (
    <section className={cn("bg-background py-16", className)}>
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <h2 className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
            {heading}
          </h2>
        ) : null}

        {/* Desktop: a hairline grid, no motion at all. */}
        <ul
          className="mt-8 hidden grid-cols-3 overflow-hidden rounded-2xl border border-border md:grid lg:grid-cols-6"
          aria-label="Partners and certifications"
        >
          {items.map((logo) => (
            <li
              key={logo.name}
              className="flex min-h-[6rem] items-center justify-center border-b border-r border-border p-5 last:border-r-0"
            >
              <LogoMark logo={logo} />
            </li>
          ))}
        </ul>

        {/* Mobile: the same marks as a ticker, because six cells stacked is a dead column. */}
        <div
          className="mt-8 rounded-2xl border border-border py-3 md:hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          aria-label="Partners and certifications"
        >
          <Marquee
            pauseOnHover
            className="[--marquee-duration:28s] [--marquee-gap:2.5rem] motion-reduce:[&_*]:animate-none"
          >
            {items.map((logo) => (
              <span key={logo.name} className="flex items-center">
                <LogoMark logo={logo} />
              </span>
            ))}
          </Marquee>
        </div>

        {trustLine ? (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <BadgeCheck aria-hidden className="size-4 shrink-0 text-primary" />
            {trustLine}
          </p>
        ) : null}
      </div>
    </section>
  );
}
