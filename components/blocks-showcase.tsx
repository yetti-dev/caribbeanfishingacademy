"use client";

/**
 * The block library, rendered.
 *
 * These are COMPONENTS from six third-party registries, not finished page
 * sections, so a good number need props (children, slides, items) and will throw
 * when mounted bare. Each one therefore renders inside an error boundary: what
 * works is shown, what throws degrades to a labelled card. The page stays
 * truthful about what is actually usable rather than pretending everything
 * renders.
 */

import { Component, useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, LayoutGrid, Search, X } from "lucide-react";
import { BLOCKS, CATEGORIES, REGISTRIES, type BlockEntry } from "@/components/blocks/registry.generated";
import { cn } from "@/lib/utils";

/* ── error boundary ───────────────────────────────────────────────────────── */

class BlockBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  // Swallowed on purpose: a component that needs props is expected here, and
  // logging 100 of them would bury anything real.
  componentDidCatch() {}
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ── one block ────────────────────────────────────────────────────────────── */

function BlockCard({ block }: { block: BlockEntry }) {
  const { Component: Block } = block;
  return (
    <section
      id={block.id}
      className="scroll-mt-24 overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-300 ease-out hover:shadow-lg"
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border bg-muted/40 px-4 py-2.5">
        <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">{block.name}</h3>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
          {block.registry}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{block.category}</span>
      </header>

      {block.description ? (
        <p className="border-b border-border px-4 py-2 text-xs leading-relaxed text-muted-foreground">{block.description}</p>
      ) : null}

      <div className="relative isolate min-h-[140px] overflow-hidden p-6">
        <BlockBoundary
          fallback={
            <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-border bg-muted/30 p-4">
              <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Needs props to render. Import it directly and pass its data:
                <code className="ml-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">{block.slug}</code>
              </p>
            </div>
          }
        >
          <Block />
        </BlockBoundary>
      </div>
    </section>
  );
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export function BlocksShowcase() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [registry, setRegistry] = useState<string | null>(null);
  // 384 mounted components make filtering janky without this.
  const deferred = useDeferredValue(query);

  const shown = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    return BLOCKS.filter(
      (b) =>
        (!category || b.category === category) &&
        (!registry || b.registry === registry) &&
        (!q || b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q) || b.category.includes(q)),
    );
  }, [deferred, category, registry]);

  const chip = (active: boolean) =>
    cn(
      "cursor-pointer rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 ease-out",
      "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
    );

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <LayoutGrid aria-hidden className="size-5 text-primary" />
              <h1 className="font-display text-lg font-bold tracking-tight text-foreground">Block library</h1>
              <span className="font-mono text-xs text-muted-foreground">
                {shown.length} of {BLOCKS.length}
              </span>
            </div>

            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search blocks"
                aria-label="Search blocks"
                className="h-9 w-64 rounded-lg border border-border bg-card pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <X aria-hidden className="size-3.5" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setRegistry(null)} className={chip(registry === null)}>
              all sources
            </button>
            {REGISTRIES.map((r) => (
              <button key={r} type="button" onClick={() => setRegistry(r)} className={chip(registry === r)}>
                {r}
              </button>
            ))}
          </div>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setCategory(null)} className={chip(category === null)}>
              all categories
            </button>
            {CATEGORIES.map((cat) => (
              <button key={cat} type="button" onClick={() => setCategory(cat)} className={chip(category === cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {shown.length === 0 ? (
          <p className="py-24 text-center text-sm text-muted-foreground">Nothing matches that filter.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {shown.map((b) => (
              <BlockCard key={b.id} block={b} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
