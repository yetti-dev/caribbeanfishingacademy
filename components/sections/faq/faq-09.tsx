import { Reveal } from "@/components/magic/reveal";
import type { Cta, FaqItem, Img, SectionHeading } from "@/content/types";

/**
 * Read as a conversation at the dock: the guest asks on the right, the crew
 * answers on the left under a small avatar. No toggling, everything visible.
 */
export function Faq09({ heading, items, avatar, crewName = "The crew", cta }: {
  heading?: SectionHeading; items: FaqItem[]; avatar?: Img; crewName?: string; cta?: Cta;
}) {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-3xl px-6">
        {heading ? (
          <Reveal>
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div className="mt-12 flex flex-col gap-8">
          {items.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 4) * 0.05} className="flex flex-col gap-3">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-5 py-3.5 text-primary-foreground shadow-sm">
                  <h3 className="text-base font-semibold leading-snug">{item.q}</h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {avatar ? (
                  <img
                    src={avatar.src}
                    alt={avatar.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-9 shrink-0 rounded-full border border-border object-cover"
                  />
                ) : null}
                <div className="max-w-[85%]">
                  <p className="mb-1 font-mono text-xs tracking-wide text-muted-foreground">{crewName}</p>
                  <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-5 py-3.5 shadow-sm">
                    <p className="text-sm leading-relaxed text-foreground">{item.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {cta ? (
          <div className="mt-12 flex justify-center">
            <a href={cta.href} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
              {cta.label}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
