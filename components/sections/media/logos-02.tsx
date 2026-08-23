import { Marquee } from "@/components/magic/marquee";
import { cn } from "@/lib/utils";
import { LogoMark, normalizeLogos, type LogoItem } from "@/components/sections/media/logos-01";

/** Two tight rows travelling in opposite directions on a muted band. */
export function Logos02({
  logos,
  heading,
  className,
}: {
  logos: string[] | LogoItem[];
  heading?: string;
  className?: string;
}) {
  const items = normalizeLogos(logos);
  if (items.length === 0) return null;

  const half = Math.ceil(items.length / 2);
  const top = items.slice(0, half);
  const bottom = items.length > 1 ? items.slice(half) : items;
  const rows = bottom.length > 0 ? [top, bottom] : [top];

  return (
    <section className={cn("bg-muted py-12", className)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:gap-10">
        {heading ? (
          <p className="shrink-0 font-display text-sm font-semibold leading-snug tracking-tight text-foreground md:max-w-[11rem]">
            {heading}
          </p>
        ) : null}
        <div
          className="min-w-0 flex-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          aria-label="Partners and certifications"
        >
          {rows.map((row, i) => (
            <Marquee
              key={i}
              pauseOnHover
              reverse={i % 2 === 1}
              className={cn(
                "py-1 [--marquee-duration:30s] [--marquee-gap:2.5rem] motion-reduce:[&_*]:animate-none",
                i === 1 && "[--marquee-duration:36s]",
              )}
            >
              {row.map((logo) => (
                <span
                  key={logo.name}
                  className="flex items-center rounded-full border border-border bg-card px-5 py-2"
                >
                  <LogoMark logo={logo} className="text-xs" />
                </span>
              ))}
            </Marquee>
          ))}
        </div>
      </div>
    </section>
  );
}
