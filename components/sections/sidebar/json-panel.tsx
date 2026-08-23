"use client";

/** Export the layout as compact JSON, or apply one a colleague sent. */
import { useState } from "react";
import { Download, Upload } from "lucide-react";
import { CATALOG } from "@/components/sections/catalog";
import { decodeLayout, encodeLayout, type Theme } from "@/components/sections/theme";
import { cn } from "@/lib/utils";

export function JsonPanel({
  theme, picked, onApply,
}: {
  theme: Theme;
  picked: string[];
  onApply: (theme: Theme, sections: string[]) => void;
}) {
  const [raw, setRaw] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const out = encodeLayout({ theme, sections: picked });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(out);
      setMsg({ kind: "ok", text: `Copied ${out.length} characters.` });
    } catch {
      setMsg({ kind: "err", text: "Clipboard blocked. Select the text and copy it by hand." });
    }
  };

  const apply = () => {
    const res = decodeLayout(raw, CATALOG.map((c) => c.code));
    if ("error" in res) { setMsg({ kind: "err", text: res.error }); return; }
    onApply(res.layout.theme, res.layout.sections);
    setMsg({
      kind: "ok",
      text: res.warnings.length
        ? `Applied ${res.layout.sections.length} section(s). ${res.warnings.join(" ")}`
        : `Applied ${res.layout.sections.length} section(s).`,
    });
  };

  const label = "block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500";

  return (
    <div className="flex h-full flex-col overflow-y-auto p-3">
      <div className="flex items-center justify-between">
        <label htmlFor="json-out" className={label}>Export ({out.length} chars)</label>
        <button type="button" onClick={copy}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
          <Download aria-hidden className="size-3" /> Copy
        </button>
      </div>
      <textarea id="json-out" readOnly value={out} rows={7}
        className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-2 font-mono text-[10px] leading-relaxed text-zinc-700 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none" />

      <div className="mt-4 flex items-center justify-between">
        <label htmlFor="json-in" className={label}>Import</label>
        <button type="button" onClick={apply} disabled={!raw.trim()}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
          <Upload aria-hidden className="size-3" /> Apply
        </button>
      </div>
      <textarea id="json-in" value={raw} onChange={(e) => setRaw(e.target.value)} rows={7}
        placeholder={'{"v":1,"c":"#0078c9","d":"fraunces","b":"dm-sans","a":"plex-mono","u":1,"z":"xs","s":["NAV-02","HERO-13"]}'}
        className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white p-2 font-mono text-[10px] leading-relaxed text-zinc-800 placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none" />

      {msg ? (
        <p className={cn("mt-2.5 text-[11px] leading-snug", msg.kind === "ok" ? "text-emerald-700" : "text-red-700")}>{msg.text}</p>
      ) : null}

      <p className="mt-4 border-t border-zinc-200 pt-3 text-[10px] leading-snug text-zinc-500">
        Single letter keys so it stays short enough to paste into a chat. Import validates rather than
        trusts: an unknown version is refused, a bad hex or font id falls back with a warning, and unknown
        section codes are skipped and counted.
      </p>
    </div>
  );
}
