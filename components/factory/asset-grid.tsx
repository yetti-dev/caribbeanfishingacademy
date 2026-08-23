"use client";

import { useState, useTransition } from "react";
import { Download, ImageOff, LoaderCircle, RotateCw } from "lucide-react";
import { retryAsset } from "@/app/(factory)/dashboard/actions";
import { cn } from "@/lib/utils";

export type AssetRow = {
  id: string; source_url: string; storage_path: string | null; kind: string;
  status: string; width: number | null; height: number | null; bytes: number | null;
  skip_reason: string | null; alt: string | null; signedUrl?: string | null;
};

/**
 * Stored assets show a real thumbnail; skipped ones show why and offer a retry.
 *
 * The bucket is private, so previews come from short-lived signed URLs generated
 * on the server. Making the bucket public to simplify this would put every
 * client's scraped imagery on a guessable path.
 */
export function AssetGrid({ assets }: { assets: AssetRow[] }) {
  const [tab, setTab] = useState<"stored" | "skipped">("stored");
  const stored = assets.filter((a) => a.status === "stored");
  const other = assets.filter((a) => a.status !== "stored");
  const shown = tab === "stored" ? stored : other;

  return (
    <div>
      <div className="flex gap-1 border-b border-zinc-200 px-4 py-2">
        {([["stored", `Stored (${stored.length})`], ["skipped", `Skipped and failed (${other.length})`]] as const).map(([k, label]) => (
          <button key={k} type="button" onClick={() => setTab(k)} aria-pressed={tab === k}
            className={cn(
              "cursor-pointer rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none",
              tab === k ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-100",
            )}>
            {label}
          </button>
        ))}
      </div>

      {!shown.length ? (
        <p className="p-8 text-center text-xs text-zinc-500">Nothing here.</p>
      ) : (
        <ul className="grid gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((a) => <AssetCard key={a.id} a={a} />)}
        </ul>
      )}
    </div>
  );
}

function AssetCard({ a }: { a: AssetRow }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <li className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="grid aspect-4/3 place-items-center bg-zinc-100">
        {a.signedUrl ? (
          // Plain img: these are diagnostics in a private tool, not site content,
          // so next/image optimisation would add cost for no benefit.
          <img src={a.signedUrl} alt={a.alt ?? ""} loading="lazy" decoding="async" className="size-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-zinc-400">
            <ImageOff aria-hidden className="size-5" />
            <span className="font-mono text-[9px] uppercase tracking-[0.1em]">{a.status}</span>
          </span>
        )}
      </div>
      <div className="space-y-1 p-2">
        <p className="truncate font-mono text-[10px] text-zinc-600" title={a.source_url}>
          {a.source_url.replace(/^https?:\/\//, "").slice(0, 46)}
        </p>
        <p className="font-mono text-[9px] text-zinc-500">
          {a.width && a.height ? `${a.width}x${a.height}` : "size unknown"}
          {a.bytes ? ` · ${Math.round(a.bytes / 1024)}KB` : ""} · {a.kind}
        </p>
        {a.skip_reason ? <p className="text-[10px] leading-snug text-amber-700">{a.skip_reason}</p> : null}

        {a.status !== "stored" ? (
          <span className="flex gap-1 pt-1">
            <button type="button" disabled={pending}
              onClick={() => start(async () => { const r = await retryAsset(a.id, false); setMsg(r.ok ? r.message : r.error); })}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded border border-zinc-300 px-1.5 py-1 text-[10px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
              {pending ? <LoaderCircle aria-hidden className="size-3 animate-spin" /> : <RotateCw aria-hidden className="size-3" />}
              Retry
            </button>
            <button type="button" disabled={pending}
              title="Store it even though it failed the size filter"
              onClick={() => start(async () => { const r = await retryAsset(a.id, true); setMsg(r.ok ? r.message : r.error); })}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded bg-zinc-800 px-1.5 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
              <Download aria-hidden className="size-3" /> Force
            </button>
          </span>
        ) : (
          <a href={a.signedUrl ?? a.source_url} target="_blank" rel="noreferrer"
            className="block cursor-pointer truncate pt-1 font-mono text-[10px] text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
            {a.storage_path}
          </a>
        )}
        {msg ? <p className="pt-1 text-[10px] text-emerald-700">{msg}</p> : null}
      </div>
    </li>
  );
}
