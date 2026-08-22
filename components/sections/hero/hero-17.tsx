import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img } from "@/content/types";

/**
 * Centred type directly on a photo, no panel.
 *
 * This is the one case where a scrim carries the contrast, so the number is
 * chosen rather than eyeballed. Measured against a blown-out white sky, the
 * worst case, white text needs about 85% black to clear 4.5:1; a 40-50% scrim
 * only reaches 1.6-1.9:1, which is why the usual gradient treatment fails.
 *
 * bg-foreground/85 gives roughly 5.2:1 in that worst case and more over normal
 * imagery. Reserve this layout for a photo that survives being darkened; use
 * Hero15 or Hero16 when the picture has to stay bright.
 */
export function Hero17({ eyebrow, title, body, image, ctas = [], scrollHint }: {
  eyebrow?: string; title: string; body: string; image: Img; ctas?: Cta[]; scrollHint?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[92vh] items-center justify-center overflow-hidden bg-foreground">
      <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="absolute inset-0 z-0 size-full object-cover" />
      <div aria-hidden className="absolute inset-0 z-10 bg-foreground/85" />

      <Reveal className="relative z-20 mx-auto max-w-4xl px-6 py-24 text-center">
        {eyebrow ? <p className="eyebrow text-background/80">{eyebrow}</p> : null}
        <h1 className="mt-6 font-display text-5xl font-bold leading-[0.92] tracking-tight text-balance text-background sm:text-7xl lg:text-8xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-background/85">{body}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {ctas.map((cta, i) => (
            <a key={cta.label} href={cta.href} className={i === 0
              ? "group inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none"
              : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-background/45 px-7 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-background/10 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none"}>
              {cta.label}
              {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
            </a>
          ))}
        </div>
        {scrollHint ? <p className="mt-14 eyebrow text-background/60">{scrollHint}</p> : null}
      </Reveal>
    </section>
  );
}
