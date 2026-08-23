import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteDetail, type Asset, type Event, type Job, type ScrapePage, type Site } from "@/components/factory/site-detail";

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
  const [jobs, events, pages, assets] = await Promise.all([
    supabase.from("provision_jobs").select("*").eq("site_id", site.id).order("position"),
    supabase.from("run_events").select("*").eq("site_id", site.id).order("started_at", { ascending: false }).limit(200),
    supabase.from("scrape_pages").select("*").eq("site_id", site.id).order("depth").order("created_at"),
    supabase.from("assets").select("*").eq("site_id", site.id).order("created_at"),
  ]);

  return (
    <SiteDetail
      site={site as Site}
      jobs={(jobs.data ?? []) as Job[]}
      events={(events.data ?? []) as Event[]}
      pages={(pages.data ?? []) as ScrapePage[]}
      assets={(assets.data ?? []) as Asset[]}
    />
  );
}
