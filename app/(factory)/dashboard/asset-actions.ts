"use server";

/**
 * Operator asset tools: upload, grab from a URL, delete.
 *
 * All three use the service role, so all three check factory_members first.
 * Uploads are validated by CONTENT, not filename: a browser will happily send a
 * renamed executable, and an SVG from anywhere is a stored-XSS vector once
 * Storage content is served from a client's own domain.
 */
import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  REFUSED, STORABLE, assertPublicUrl, extractImageUrls, safeFetch, sanitizeSvg, sniff,
} from "@/lib/factory/media";

const BUCKET = "site-assets";
type Result = { ok: true; message: string } | { ok: false; error: string };

async function requireMember(): Promise<string> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const email = auth.user?.email;
  if (!email) throw new Error("not signed in");
  const { data: member } = await supabase
    .from("factory_members").select("email").ilike("email", email).maybeSingle();
  if (!member) throw new Error(`${email} is not on the factory allowlist`);
  return email;
}

const sha16 = (b: Uint8Array) => createHash("sha256").update(b).digest("hex").slice(0, 16);

/* ── upload ───────────────────────────────────────────────────────────────── */

export async function uploadAssets(form: FormData): Promise<Result> {
  try { await requireMember(); } catch (e) { return { ok: false, error: (e as Error).message }; }

  const siteId = String(form.get("site_id") ?? "");
  if (!siteId) return { ok: false, error: "missing site" };
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return { ok: false, error: "Pick at least one file." };

  const db = createAdminClient();
  const { data: site } = await db.from("sites").select("slug").eq("id", siteId).maybeSingle();
  if (!site) return { ok: false, error: "site not found" };

  const stored: string[] = [];
  const refused: string[] = [];

  for (const file of files) {
    if (file.size > 50 * 1024 * 1024) { refused.push(`${file.name}: over 50MB`); continue; }
    let bytes = new Uint8Array(await file.arrayBuffer());

    // Content decides, never the filename or the browser's content-type.
    const s = sniff(bytes);
    if (!s) { refused.push(`${file.name}: unrecognised file type`); continue; }
    if (REFUSED.has(s.type)) { refused.push(`${file.name}: refused, it is a ${s.type}`); continue; }
    if (!STORABLE.has(s.type)) { refused.push(`${file.name}: ${s.type} is not storable`); continue; }

    let mime = s.mime;
    if (s.type === "svg") {
      const { svg, clean, findings } = sanitizeSvg(new TextDecoder().decode(bytes));
      if (!clean) { refused.push(`${file.name}: unsafe svg (${findings.join(", ")})`); continue; }
      bytes = new TextEncoder().encode(svg);
      mime = "image/svg+xml";
    }

    const digest = sha16(bytes);

    /*
     * Content dedup on upload too. Dragging the same photo in twice, or uploading
     * one the crawl already found, should not produce a second card.
     */
    const { data: twin } = await db.from("assets")
      .select("id, source_url").eq("site_id", siteId).eq("sha256", digest).eq("status", "stored").maybeSingle();
    if (twin) { refused.push(`${file.name}: already stored, identical to ${twin.source_url.slice(0, 40)}`); continue; }

    const path = `${site.slug}/${digest}.${s.type === "jpg" ? "jpg" : s.type}`;
    const { error: upErr } = await db.storage.from(BUCKET).upload(path, bytes, { contentType: mime, upsert: true });
    if (upErr) { refused.push(`${file.name}: ${upErr.message}`); continue; }

    // source_url is unique per site, so an upload needs a stable synthetic one.
    await db.from("assets").upsert({
      site_id: siteId, source_url: `upload://${digest}`, storage_path: `${BUCKET}/${path}`,
      kind: s.type === "mp4" || s.type === "webm" ? "video" : "image",
      alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      status: "stored", bytes: bytes.byteLength, sha256: digest,
      width: s.width ?? null, height: s.height ?? null, force: true, skip_reason: null,
    }, { onConflict: "site_id,source_url" });
    stored.push(file.name);
  }

  revalidatePath(`/dashboard/${site.slug}`);
  if (!stored.length) return { ok: false, error: refused.join(" | ") || "nothing uploaded" };
  return {
    ok: true,
    message: `Uploaded ${stored.length} file(s).${refused.length ? ` Refused ${refused.length}: ${refused.join(" | ")}` : ""}`,
  };
}

/* ── grab every image from a page ─────────────────────────────────────────── */

export async function grabImagesFrom(siteId: string, pageUrl: string): Promise<Result> {
  try { await requireMember(); } catch (e) { return { ok: false, error: (e as Error).message }; }

  const raw = pageUrl.trim();
  if (!raw) return { ok: false, error: "Give a page URL." };
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try { assertPublicUrl(withScheme); } catch (e) { return { ok: false, error: (e as Error).message }; }

  const db = createAdminClient();
  const { data: site } = await db.from("sites").select("slug").eq("id", siteId).maybeSingle();
  if (!site) return { ok: false, error: "site not found" };

  let html: string;
  try {
    const { res, bytes } = await safeFetch(withScheme, { accept: "text/html", maxBytes: 8 * 1024 * 1024 });
    if (!/html/i.test(res.headers.get("content-type") ?? "")) {
      return { ok: false, error: "that URL does not return HTML" };
    }
    html = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch (e) {
    return { ok: false, error: `could not fetch: ${(e as Error).message}` };
  }

  const found = extractImageUrls(html, withScheme);
  if (!found.length) return { ok: false, error: "no images found on that page" };

  /*
   * Recorded as `discovered`, not downloaded here. The scrape worker does the
   * fetching, so this action stays fast and the download goes through the same
   * sniffing and SVG sanitising as everything else in the bucket.
   *
   * force: true because the operator asked for this page specifically. The size
   * filter exists to keep an automated crawl tidy, not to overrule a person.
   */
  const rows = found.slice(0, 120).map((f) => ({
    site_id: siteId, source_url: f.url, alt: f.alt, kind: "image" as const,
    status: "discovered" as const, force: true,
  }));
  const { error } = await db.from("assets").upsert(rows, { onConflict: "site_id,source_url", ignoreDuplicates: true });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/${site.slug}`);
  return {
    ok: true,
    message: `Queued ${rows.length} image(s) from that page. The scrape worker downloads them within a couple of minutes.`,
  };
}

/* ── delete ───────────────────────────────────────────────────────────────── */

export async function deleteAsset(assetId: string): Promise<Result> {
  try { await requireMember(); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const db = createAdminClient();
  const { data: asset } = await db.from("assets")
    .select("id, storage_path, site_id, sites(slug)").eq("id", assetId).maybeSingle();
  if (!asset) return { ok: false, error: "asset not found" };

  // Remove the object first: a stale row is recoverable, an orphaned object in a
  // private bucket is invisible and pays rent forever.
  if (asset.storage_path) {
    const path = asset.storage_path.replace(new RegExp(`^${BUCKET}/`), "");
    const { error: rmErr } = await db.storage.from(BUCKET).remove([path]);
    if (rmErr) return { ok: false, error: `storage: ${rmErr.message}` };
  }
  const { error } = await db.from("assets").delete().eq("id", assetId);
  if (error) return { ok: false, error: error.message };

  const slug = (asset as { sites?: { slug?: string } }).sites?.slug;
  if (slug) revalidatePath(`/dashboard/${slug}`);
  return { ok: true, message: "Deleted." };
}
