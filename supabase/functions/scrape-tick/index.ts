/**
 * scrape-tick: crawl ONE page per claimed job, then return.
 *
 * A 12 page crawl takes ~40s, too long for a single invocation, and a timeout
 * mid-crawl would lose every page already fetched. So each tick takes a few
 * pages, extracts them, enqueues whatever internal links it discovers, and
 * stops. The crawl becomes a breadth-first walk spread across ticks, bounded by
 * sites.max_pages.
 *
 * Assets are stored as ORIGINALS. There is no image library on this runtime, so
 * resizing happens later in the local pipeline where sharp exists. Dimensions are
 * read from the file header, which is enough to tell a hero from an icon.
 *
 * Safety, all of it load bearing:
 *  - every fetch is SSRF checked and re-checked after each redirect
 *  - assets are identified by magic bytes, not extension or content-type
 *  - SVGs are sanitised before upload, because Storage content is later served
 *    from the client's own domain
 *  - executables and archives are dropped outright
 *  - page copy is scanned for prompt injection, since build agents read it
 */
import { adminDb, logEvent } from "../_shared/db.ts";
import { extract } from "../_shared/extract.ts";
import {
  DANGEROUS, STORABLE, safeFetch, sanitizeSvg, scanInjection, sniff, svgIsClean,
} from "../_shared/safety.ts";

const WORKER = `scrape-${crypto.randomUUID().slice(0, 8)}`;
const UA = "Mozilla/5.0 (compatible; WebsiteFactory/1.0; +https://getyetti.com/bot)";
const BUCKET = "site-assets";
const MAX_ASSET_BYTES = 12 * 1024 * 1024;
const env = (k: string, d = "") => Deno.env.get(k) ?? d;

type Page = {
  id: string; site_id: string; url: string; depth: number; attempts: number; max_attempts: number;
};

Deno.serve(async (req) => {
  const secret = env("TICK_SECRET");
  if (secret && req.headers.get("x-tick-secret") !== secret) {
    return json({ error: "unauthorised" }, 401);
  }

  const db = adminDb();
  await db.rpc("reap_stale_scrape_pages");

  const { data: pages, error } = await db.rpc("claim_scrape_pages", {
    worker: WORKER, batch: 3, lease_seconds: 120,
  });
  if (error) return json({ error: error.message }, 500);
  if (!pages?.length) return json({ worker: WORKER, claimed: 0 });

  const done: unknown[] = [];

  for (const page of pages as Page[]) {
    const t0 = Date.now();
    try {
      const { data: site } = await db.from("sites")
        .select("id, slug, source_url, max_pages, max_assets").eq("id", page.site_id).single();
      if (!site) throw new Error("site missing");

      const { res, bytes } = await safeFetch(page.url, {
        accept: "text/html,application/xhtml+xml", ua: UA, timeoutMs: 20_000, maxBytes: 6 * 1024 * 1024,
      });
      const ctype = res.headers.get("content-type") ?? "";
      if (!/html/i.test(ctype)) throw new Error(`not html (${ctype.slice(0, 40)})`);

      const html = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      const ex = extract(html, page.url);

      // Everything a build agent will read, scanned together.
      const corpus = [ex.title, ex.description, ...ex.headings.map((h) => h.text), ...ex.paragraphs, ...ex.ctas]
        .filter(Boolean).join("\n");
      const flags = scanInjection(corpus);

      const path = (() => { try { return new URL(page.url).pathname || "/"; } catch { return "/"; } })();

      await db.from("scrape_pages").update({
        status: "done", http_status: res.status, bytes: bytes.byteLength, path,
        title: ex.title, description: ex.description,
        headings: ex.headings, paragraphs: ex.paragraphs, ctas: ex.ctas,
        links: ex.links.slice(0, 60), faqs: ex.faqs, contact: ex.contact,
        colors: ex.colors, fonts: ex.fonts, image_count: ex.images.length,
        injection_flags: flags, error: null,
        finished_at: new Date().toISOString(), locked_by: null, lease_until: null,
      }).eq("id", page.id);

      /* ── frontier: enqueue discovered internal links ───────────────────── */
      const { count: seen } = await db.from("scrape_pages")
        .select("id", { count: "exact", head: true }).eq("site_id", site.id);
      const room = Math.max(0, (site.max_pages ?? 14) - (seen ?? 0));
      let enqueued = 0;
      if (room > 0 && page.depth < 3) {
        const rows = ex.links.slice(0, room).map((l) => ({
          site_id: site.id, url: l.href, path: safePath(l.href),
          depth: page.depth + 1, discovered_from: page.url,
        }));
        if (rows.length) {
          // Ignore duplicates: unique(site_id,url) makes this idempotent.
          const { error: e } = await db.from("scrape_pages").upsert(rows, {
            onConflict: "site_id,url", ignoreDuplicates: true,
          });
          if (!e) enqueued = rows.length;
        }
      }

      /* ── assets: record, then store what we can ────────────────────────── */
      const { count: assetCount } = await db.from("assets")
        .select("id", { count: "exact", head: true }).eq("site_id", site.id);
      const assetRoom = Math.max(0, (site.max_assets ?? 80) - (assetCount ?? 0));

      const candidates = [
        ...ex.images.slice(0, assetRoom).map((i) => ({ url: i.url, alt: i.alt, kind: "image" as const })),
        ...(ex.logo ? [{ url: ex.logo, alt: "logo", kind: "logo" as const }] : []),
        ...ex.videos.slice(0, 4).map((v) => ({ url: v, alt: null, kind: "video" as const })),
      ];
      if (candidates.length) {
        await db.from("assets").upsert(
          candidates.map((c) => ({ site_id: site.id, source_url: c.url, alt: c.alt, kind: c.kind })),
          { onConflict: "site_id,source_url", ignoreDuplicates: true },
        );
      }

      const stored = await storeAssets(db, site.id, site.slug, Math.min(assetRoom, 12));

      await logEvent(db, site.id, "scrape", flags.length ? "warn" : "ok", {
        ms: Date.now() - t0, url: page.url, headings: ex.headings.length,
        images: ex.images.length, enqueued, stored, injection: flags,
      });
      done.push({ url: path, status: "done", headings: ex.headings.length, images: ex.images.length, enqueued, stored, flags });
    } catch (e) {
      const msg = (e as Error).message ?? String(e);
      const terminal = page.attempts >= page.max_attempts;
      await db.from("scrape_pages").update({
        status: terminal ? "failed" : "pending",
        error: msg.slice(0, 400),
        next_attempt_at: new Date(Date.now() + Math.min(300, 20 * 2 ** page.attempts) * 1000).toISOString(),
        finished_at: terminal ? new Date().toISOString() : null,
        locked_by: null, lease_until: null,
      }).eq("id", page.id);
      done.push({ url: page.url, status: terminal ? "failed" : "retry", error: msg.slice(0, 140) });
    }
  }

  /* Mark the site built once the frontier is empty. */
  for (const siteId of [...new Set((pages as Page[]).map((p) => p.site_id))]) {
    const { count: left } = await db.from("scrape_pages")
      .select("id", { count: "exact", head: true }).eq("site_id", siteId).in("status", ["pending", "running"]);
    if (!left) await db.from("sites").update({ status: "built" }).eq("id", siteId);
  }

  return json({ worker: WORKER, claimed: pages.length, done });
});

/* ── asset storage ────────────────────────────────────────────────────────── */

/**
 * Download and store a batch of discovered assets. Kept small per tick so the
 * invocation cannot run long; the queue comes back for the rest.
 */
async function storeAssets(
  db: ReturnType<typeof adminDb>, siteId: string, slug: string, limit: number,
): Promise<number> {
  if (limit <= 0) return 0;
  const { data: pending } = await db.from("assets")
    .select("id, source_url, kind, force").eq("site_id", siteId).eq("status", "discovered").limit(limit);
  if (!pending?.length) return 0;

  let stored = 0;
  for (const a of pending) {
    try {
      const { bytes } = await safeFetch(a.source_url, {
        accept: "image/*,video/*", ua: UA, timeoutMs: 20_000, maxBytes: MAX_ASSET_BYTES,
      });
      if (bytes.byteLength < 2048) {
        await skip(db, a.id, "smaller than 2KB, likely a tracking pixel");
        continue;
      }

      // Trust the bytes, never the extension or the content-type: both are
      // attacker controlled.
      const s = sniff(bytes);
      if (!s) { await skip(db, a.id, "unrecognised file type"); continue; }
      if (DANGEROUS.has(s.type)) { await skip(db, a.id, `refused: sniffed as ${s.type}`); continue; }
      if (!STORABLE.has(s.type)) { await skip(db, a.id, `not storable (${s.type})`); continue; }

      let payload = bytes;
      let mime = s.mime;
      if (s.type === "svg") {
        // Storage content ends up served from the client's own domain, so an SVG
        // carrying script is same-origin stored XSS. Strip, then assert.
        const raw = new TextDecoder().decode(bytes);
        const { svg } = sanitizeSvg(raw);
        const check = svgIsClean(svg);
        if (!check.clean) { await skip(db, a.id, `unsafe svg (${check.findings.join(", ")})`); continue; }
        payload = new TextEncoder().encode(svg);
        mime = "image/svg+xml";
      }

      /*
       * Size filter by AREA, not by both dimensions.
       *
       * Requiring 320x200 threw away real content on the first live crawl: a
       * 1208x92 banner and a 965x74 strip both failed the height test despite
       * being large, usable images. Area keeps wide banners; a minimum dimension
       * still rejects hairlines and spacer strips.
       */
      // force means the operator looked at it and wants it regardless of size.
      // It does NOT bypass the safety checks above, which are not preferences.
      if (!a.force && a.kind === "image" && s.width && s.height) {
        const area = s.width * s.height;
        const shortest = Math.min(s.width, s.height);
        if (area < 20_000 || shortest < 60) {
          await skip(db, a.id, `too small (${s.width}x${s.height}, area ${area})`);
          continue;
        }
      }

      const digest = await crypto.subtle.digest("SHA-256", payload);
      const sha = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
      const name = `${sha.slice(0, 16)}.${s.type === "jpg" ? "jpg" : s.type}`;
      const path = `${slug}/${name}`;

      const { error: upErr } = await db.storage.from(BUCKET)
        .upload(path, payload, { contentType: mime, upsert: true });
      if (upErr) throw new Error(`upload: ${upErr.message}`);

      await db.from("assets").update({
        status: "stored", storage_path: `${BUCKET}/${path}`,
        bytes: payload.byteLength, sha256: sha,
        width: s.width ?? null, height: s.height ?? null,
        kind: s.type.match(/mp4|webm/) ? "video" : a.kind,
        skip_reason: null,
      }).eq("id", a.id);
      stored++;
    } catch (e) {
      await db.from("assets").update({
        status: "failed", skip_reason: ((e as Error).message ?? String(e)).slice(0, 200),
      }).eq("id", a.id);
    }
  }
  return stored;
}

const skip = (db: ReturnType<typeof adminDb>, id: string, reason: string) =>
  db.from("assets").update({ status: "skipped", skip_reason: reason }).eq("id", id);

const safePath = (u: string) => { try { return new URL(u).pathname || "/"; } catch { return "/"; } };
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), { status, headers: { "Content-Type": "application/json" } });
