import { Marquee } from "@/components/magic/marquee";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import { LogoMark, normalizeLogos, type LogoItem } from "@/components/sections/media/logos-01";

/** Editorial two column split: statement on the left, a vertical ticker of marks on the right. */
export function Logos03({
  logos,
  heading,
  body,
  eyebrow,
  className,
}: {
  logos: string[] | LogoItem[];
  heading?: string;
  body?: string;
  eyebrow?: string;
  className?: string;
}) {
  const items = normalizeLogos(logos);
  if (items.length === 0) return null;

  return (
    <section className={cn("border-y border-border bg-background py-20", className)}>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
          {heading ? (
            <h2 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading}
            </h2>
          ) : null}
          {body ? (
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">{body}</p>
          ) : null}
        </Reveal>

        <div
          className="relative h-[20rem] overflow-hidden rounded-2xl border border-border bg-card [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
          aria-label="Partners and certifications"
        >
          <Marquee
            vertical
            pauseOnHover
            className="h-full [--marquee-duration:26s] [--marquee-gap:1.25rem] motion-reduce:[&_*]:animate-none"
          >
            {items.map((logo) => (
              <span
                key={logo.name}
                className="flex h-14 items-center justify-center border-b border-border/70 px-6"
              >
                <LogoMark logo={logo} />
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
