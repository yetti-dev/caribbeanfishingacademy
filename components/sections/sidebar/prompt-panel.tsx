"use client";

/** The build prompt: ordered codes, imports and props for a build agent. */
import { useState } from "react";
import { ClipboardCheck, Copy } from "lucide-react";
import type { CatalogEntry } from "@/components/sections/catalog";
import type { Theme } from "@/components/sections/theme";

export function buildPrompt(picked: CatalogEntry[], theme: Theme) {
  const lines = [
    "Build the site using the sections I already picked. Do not invent new section layouts.",
    "",
    `Primary colour: ${theme.hex}. Set brand.config.ts theme.hue from it and run \`npm run brand\`, which solves a contrast safe lightness.`,
    `Fonts: headings ${theme.displayFont}, body ${theme.bodyFont}, accent ${theme.accentFont}.`,
    `Accent labels: ${theme.accentUpper ? "all capitals" : "sentence case"}, ${theme.accentSize} size.`,
    "",
    `Page order, top to bottom (${picked.length} sections):`,
    "",
  ];
  picked.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.code}  ${p.component}  (${p.category}: ${p.label})`);
    lines.push(`   import { ${p.component} } from "@/${p.file.replace(/\.tsx$/, "")}";`);
    lines.push(`   props: ${p.props}`);
  });
  lines.push(
    "",
    "Rules:",
    "- Write all copy into content/*.ts typed against content/types.ts. No copy in JSX.",
    "- Pass real images from public/ingested/<slug>/ once the clone has run.",
    "- Keep the section order above exactly.",
    "- Upgrade only the hero to next/image with priority; leave the rest as lazy img.",
    "- No em dashes or en dashes anywhere in the copy.",
  );
  return lines.join("\n");
}

export function PromptPanel({ picked, theme }: { picked: CatalogEntry[]; theme: Theme }) {
  const [copied, setCopied] = useState(false);
  const text = buildPrompt(picked, theme);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* the textarea below is the fallback */ }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto p-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
          {picked.length} section(s), {text.length} chars
        </span>
        <button type="button" onClick={copy} disabled={!picked.length}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
          {copied ? <ClipboardCheck aria-hidden className="size-3" /> : <Copy aria-hidden className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {picked.length ? (
        <textarea readOnly value={text} rows={22} aria-label="Build prompt"
          className="mt-2 w-full flex-1 resize-none rounded-lg border border-zinc-300 bg-zinc-50 p-2 font-mono text-[10px] leading-relaxed text-zinc-700 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none" />
      ) : (
        <p className="mt-6 text-center text-xs text-zinc-500">Pick some sections and the prompt appears here.</p>
      )}
    </div>
  );
}
