import { Marquee } from "@/components/magic/marquee";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";

export type LogoItem = { name: string; src?: string };

/** Accepts a plain list of names or full logo objects, so a real build can swap in images. */
export function normalizeLogos(logos: string[] | LogoItem[]): LogoItem[] {
  return (logos as (string | LogoItem)[]).map((l) =>
    typeof l === "string" ? { name: l } : l,
  );
}

/** One logo cell. Falls back to a tracked wordmark when there is no image. */
export function LogoMark({ logo, className }: { logo: LogoItem; className?: string }) {
  if (logo.src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={logo.src}
        alt={`${logo.name} logo`}
        loading="lazy"
        decoding="async"
        className={cn(
          "h-8 w-auto max-w-[10rem] object-contain opacity-60 transition duration-300 ease-out hover:opacity-100",
          className,
        )}
      />
    );
  }
  return (
    <span
      className={cn(
        "whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em] text-foreground/55 transition duration-300 ease-out hover:text-foreground",
        className,
      )}
    >
      {logo.name}
    </span>
  );
}

/** Single infinite strip, faded at both edges, paused on hover. */
export function Logos01({
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

  return (
    <section className={cn("border-y border-border bg-background py-14", className)}>
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal>
            <p className="eyebrow text-center text-muted-foreground">{heading}</p>
          </Reveal>
        ) : null}
      </div>
      <div
        className="relative mt-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        aria-label="Partners and certifications"
      >
        <Marquee
          pauseOnHover
          className="[--marquee-duration:38s] [--marquee-gap:4rem] motion-reduce:[&_*]:animate-none"
        >
          {items.map((logo) => (
            <span key={logo.name} className="flex items-center">
              <LogoMark logo={logo} />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
