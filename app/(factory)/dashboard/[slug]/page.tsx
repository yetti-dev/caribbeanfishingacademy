import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SiteDetail, type Asset, type ContentFile, type Event, type Job, type Layout, type ScrapePage, type Site } from "@/components/factory/site-detail";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug };
}

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`/login?next=/dashboard/${slug}`);

  // Allowlist, not just authentication: signups are open on this project.
  const { data: member } = await supabase
    .from("factory_members").select("email").ilike("email", auth.user.email ?? "").maybeSingle();
  if (!member) redirect("/dashboard");

  const { data: site } = await supabase.from("sites").select("*").eq("slug", slug).maybeSingle();
  if (!site) notFound();

  // Four reads in parallel: they are independent and this page is the one people
  // refresh while waiting for a build.
  const [jobs, events, pages, assets, layouts, contentFiles] = await Promise.all([
    supabase.from("provision_jobs").select("*").eq("site_id", site.id).order("position"),
    supabase.from("run_events").select("*").eq("site_id", site.id).order("started_at", { ascending: false }).limit(200),
    supabase.from("scrape_pages").select("*").eq("site_id", site.id).order("depth").order("created_at"),
    supabase.from("assets").select("*").eq("site_id", site.id).order("created_at"),
    supabase.from("layouts").select("share_code, version, is_current, theme, sections, note, created_at")
      .eq("site_id", site.id).order("version", { ascending: false }),
    supabase.from("content_files").select("path, body, bytes").eq("site_id", site.id).order("path"),
  ]);

  /*
   * Thumbnails need signed URLs: the bucket is private, and making it public to
   * avoid this would put every client's scraped imagery on a guessable path.
   * Signing needs the service role, so it happens here rather than in the browser.
   */
  const rows = (assets.data ?? []) as Asset[];
  const storedPaths = rows
    .filter((a) => a.status === "stored" && a.storage_path)
    .map((a) => a.storage_path!.replace(/^site-assets\//, ""));

  const signed = new Map<string, string>();
  if (storedPaths.length) {
    const admin = createAdminClient();
    const { data } = await admin.storage.from("site-assets").createSignedUrls(storedPaths, 3600);
    for (const s of data ?? []) {
      if (s.path && s.signedUrl) signed.set(s.path, s.signedUrl);
    }
  }
  const withPreviews = rows.map((a) => ({
    ...a,
    signedUrl: a.storage_path ? signed.get(a.storage_path.replace(/^site-assets\//, "")) ?? null : null,
  }));

  return (
    <SiteDetail
      site={site as Site}
      jobs={(jobs.data ?? []) as Job[]}
      events={(events.data ?? []) as Event[]}
      pages={(pages.data ?? []) as ScrapePage[]}
      assets={withPreviews}
      layouts={(layouts.data ?? []) as Layout[]}
      contentFiles={(contentFiles.data ?? []) as ContentFile[]}
    />
  );
}
