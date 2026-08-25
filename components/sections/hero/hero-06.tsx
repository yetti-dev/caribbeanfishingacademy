import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { Marquee } from "@/components/magic/marquee";
import type { Cta, Img } from "@/content/types";

/** Centred copy with a horizontally scrolling photo band beneath. */
export function Hero06({ eyebrow, title, body, images, ctas = [] }: {
  eyebrow?: string; title: string; body: string; images: Img[]; ctas?: Cta[];
}) {
  return (
    <section className="overflow-hidden border-b border-border bg-background">
      <div className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
        <Reveal>
          {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance text-foreground sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ctas.map((cta, i) => (
              <a key={cta.label} href={cta.href} data-yetti-activity={cta.activityId} className={i === 0
                ? "group inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-gradient px-7 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"}>
                {cta.label}
                {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
      <Marquee pauseOnHover className="[--duration:38s] pb-16">
        {images.map((im) => (
          <img key={im.src} src={im.src} alt={im.alt} loading="lazy" decoding="async" className="mx-2 aspect-4/3 h-56 rounded-xl border border-border object-cover" />
        ))}
      </Marquee>
    </section>
  );
}
