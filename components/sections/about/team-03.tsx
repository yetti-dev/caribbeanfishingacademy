import { Reveal } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import type { Member } from "@/content/demo";
import type { Link, SectionHeading } from "@/content/types";

export type SocialMember = Member & { socials?: Link[] };

/** A tight row of circular portraits. The bio card pops above on hover and on focus. */
export function Team03({ heading, members }: { heading?: SectionHeading; members: SocialMember[] }) {
  return (
    <section className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {heading ? (
          <Reveal className="mx-auto max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 text-lg leading-relaxed text-foreground/70">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}

        <Reveal delay={0.08} className="mt-28 flex flex-wrap items-start justify-center gap-x-4 gap-y-14">
          {members.map((m) => (
            <div key={m.name} className="group relative w-36">
              <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-4 w-72 -translate-x-1/2 translate-y-2 rounded-2xl border border-border bg-card p-5 text-left opacity-0 shadow-lg transition duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <p className="text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
                {m.socials?.length ? (
                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                    {m.socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={`${s.label}, ${m.name}`}
                        className="grid size-9 cursor-pointer place-items-center rounded-lg border border-border text-muted-foreground transition duration-200 ease-out hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      >
                        <Icon name={s.icon} className="size-4" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mx-auto size-32 overflow-hidden rounded-full border-4 border-card bg-background shadow-sm transition-transform duration-300 ease-out group-hover:-translate-y-1 group-focus-within:-translate-y-1">
                <img
                  src={m.image.src}
                  alt={m.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover"
                />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-foreground">{m.name}</h3>
              <p className="mt-0.5 font-mono text-[11px] tracking-wide text-foreground/60">{m.role}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
