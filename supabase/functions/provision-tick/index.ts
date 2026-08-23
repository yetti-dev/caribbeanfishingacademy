/**
 * provision-tick: run ONE provisioning step per claimed job, then return.
 *
 * Why a tick rather than one long function: an Edge Function has an execution
 * ceiling, and "attach the domain then poll until DNS verifies" can take hours.
 * One step per invocation means a timeout loses at most one step, and the queue
 * retries it with backoff.
 *
 * Every handler is idempotent. A retry must be a no-op, because the queue WILL
 * retry on any transport hiccup:
 *   repo            existing repo short-circuits
 *   strip           no matching paths means nothing to commit
 *   vercel_project  an existing project short-circuits
 *   domain          already attached to THIS project is success
 *   dns             GoDaddy PUT replaces, so writing twice equals writing once
 *
 * Invoke on a schedule (pg_cron or Supabase scheduled functions) every minute.
 */
import { adminDb, logEvent, type Job, type Site } from "../_shared/db.ts";
import { GitHub } from "../_shared/github.ts";
import { requiredRecord, Vercel } from "../_shared/vercel.ts";
import { pickProvider } from "../_shared/dns.ts";
import { HttpError } from "../_shared/http.ts";

const WORKER = `tick-${crypto.randomUUID().slice(0, 8)}`;
const env = (k: string, d = "") => Deno.env.get(k) ?? d;

type StepResult = { result?: Record<string, unknown>; site?: Record<string, unknown>; skipped?: boolean };

/* ── step handlers ────────────────────────────────────────────────────────── */

const handlers: Record<string, (ctx: Ctx) => Promise<StepResult>> = {
  /**
   * Generate the repo, renaming past a collision rather than getting stuck.
   *
   * The subtlety: an existing repo is ALSO what makes a retry idempotent, so we
   * cannot simply append -1 whenever the name is taken. A transport hiccup after
   * the repo was created would then produce slug-1, slug-2, slug-3 on successive
   * attempts. The first resolved name is therefore recorded in job.result, and a
   * retry reuses it instead of resolving again.
   *
   * A free name has to be free EVERYWHERE, not just on GitHub: the Vercel project
   * and the subdomain are both derived from the slug, so a name that is free on
   * GitHub but taken on Vercel would fail three steps later. When the slug moves,
   * the site row moves with it, and the default domain is recomputed so all four
   * stay in agreement.
   */
  async repo({ site, gh, vercel, job, db }) {
    const owner = env("GITHUB_OWNER", "yetti-dev");
    const templateOwner = env("TEMPLATE_OWNER", "yetti-dev");
    const templateRepo = env("TEMPLATE_REPO", "Claude-starter-pack");
    const zone = env("DNS_ZONE") || env("FACTORY_DOMAIN") || "getyetti.com";

    // A previous attempt already resolved a name: reuse it, do not re-resolve.
    const settled = typeof job.result.slug === "string" ? (job.result.slug as string) : null;
    let slug = settled ?? site.slug;

    if (!settled) {
      const base = site.slug.replace(/-\d+$/, "");
      const provider = pickProvider();
      let found: string | null = null;

      for (let n = 0; n <= 20; n++) {
        const candidate = n === 0 ? base : `${base}-${n}`;
        // The site's own row must not count as a clash with itself.
        const { data: clash } = await db.from("sites")
          .select("id").eq("slug", candidate).neq("id", site.id).maybeSingle();
        if (clash) continue;
        if (await gh.getRepo(owner, candidate)) continue;
        if (await vercel.getProject(candidate)) continue;
        if (provider) {
          try {
            const existing = await provider.read({ zone, name: candidate, type: "CNAME" });
            if (existing.length) continue;
          } catch { /* unreadable zone is not proof of a clash */ }
        }
        found = candidate;
        break;
      }
      if (!found) throw new Error(`no free name after 20 attempts from "${base}"`);

      if (found !== site.slug) {
        // Only rewrite a domain we generated. An explicitly chosen one is the
        // operator's decision and must survive the rename.
        const wasDefault = site.domain === `${site.slug}.${zone}`;
        await db.from("sites").update({
          slug: found,
          ...(wasDefault ? { domain: `${found}.${zone}` } : {}),
        }).eq("id", site.id);
        slug = found;
      }
    }

    const { repo, created } = await gh.generateFromTemplate({
      templateOwner, templateRepo, owner, name: slug,
      private: true, description: `${site.name} website`,
    });
    // A generated repo reports a branch before the tree exists.
    await gh.waitForTree(owner, slug, repo.default_branch);
    return {
      // slug is recorded so a retry short-circuits the search above.
      result: { slug, repo: repo.full_name, created, branch: repo.default_branch, renamed: slug !== site.slug },
      site: { github_repo_url: repo.html_url, github_repo_created: true },
    };
  },

  /**
   * Remove the factory from the CLIENT repo. Done here, before the first deploy,
   * so the client's public domain never serves /dashboard or /sections at all.
   * The section library itself stays: those components are what the site is
   * built from.
   */
  async strip({ site, gh }) {
    const owner = env("GITHUB_OWNER", "yetti-dev");
    const repo = await gh.getRepo(owner, site.slug);
    if (!repo) throw new Error(`repo ${owner}/${site.slug} missing; the repo step must run first`);
    const branch = repo.default_branch;

    const PREFIXES = [
      ".claude/", "scripts/", "supabase/", "app/(factory)/", "components/factory/",
      "lib/supabase/", "components/sections/sidebar/", "ideas/",
    ];
    const EXACT = [
      "middleware.ts", "CLAUDE.md", "AGENTS.md", ".npmrc",
      "components/sections-showcase.tsx", "components/sections/catalog.tsx",
      "components/sections/theme.ts", "components/sections/font-select.tsx",
      "lib/showcase-fonts.ts", "content/demo.ts", ".env.example",
    ];

    const tree = await gh.listTree(owner, site.slug, branch);
    const doomed = tree
      .map((t) => t.path)
      .filter((p) => PREFIXES.some((x) => p.startsWith(x)) || EXACT.includes(p));

    const { skipped, commit } = await gh.deletePaths(
      owner, site.slug, branch, doomed, "Strip factory tooling from the client repo",
    );
    return {
      result: { removed: doomed.length, commit, skipped },
      site: { factory_stripped: true },
    };
  },

  /**
   * Holding page. Replaces app/(site)/page.tsx, which ships as a blank canvas,
   * so the domain has something real to serve the moment DNS resolves. noindex,
   * because this sits on the client's own domain for days and Google would
   * otherwise index "coming soon" as that domain's content.
   */
  async holding({ site, gh }) {
    const owner = env("GITHUB_OWNER", "yetti-dev");
    const repo = await gh.getRepo(owner, site.slug);
    if (!repo) throw new Error(`repo ${owner}/${site.slug} missing`);

    const page = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ${JSON.stringify(site.name)},
  description: "This site is being built.",
  // On the client's real domain for days before launch. Without this, "coming
  // soon" gets indexed as the domain's content and lingers after go live.
  robots: { index: false, follow: false },
};

export default function ComingSoon() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Opening soon</p>
        <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl">
          ${site.name.replace(/[<>{}]/g, "")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          We are putting the finishing touches to the new site. Check back shortly.
        </p>
      </div>
    </main>
  );
}
`;
    const commit = await gh.commitFiles(
      owner, site.slug, repo.default_branch,
      [{ path: "app/(site)/page.tsx", content: page }],
      "Add the coming soon page",
    );
    return { result: { commit } };
  },

  async vercel_project({ site, vercel, gh }) {
    const owner = env("GITHUB_OWNER", "yetti-dev");
    // gitRepository linked here is what makes every later push auto-deploy.
    const { project, created } = await vercel.ensureProject(site.slug, `${owner}/${site.slug}`);
    const openai = env("OPENAI_API_KEY");
    if (openai) {
      try { await vercel.setEnv(project.id, "OPENAI_API_KEY", openai); } catch { /* non fatal */ }
    }
    const repo = await gh.getRepo(owner, site.slug);
    return {
      result: { projectId: project.id, created, branch: repo?.default_branch ?? "main" },
      site: { vercel_project: project.name, vercel_project_created: true, vercel_scope: env("VERCEL_SCOPE") },
    };
  },

  async deploy({ site, vercel, gh, job }) {
    const owner = env("GITHUB_OWNER", "yetti-dev");
    const project = await vercel.getProject(site.slug);
    if (!project) throw new Error("vercel project missing");

    // Already building or ready from a previous attempt: adopt it rather than
    // stacking another deployment on top.
    const latest = await vercel.latestProduction(project.id);
    if (latest && ["READY", "BUILDING", "QUEUED", "INITIALIZING"].includes(latest.state)) {
      return { result: { deploymentId: latest.uid, url: latest.url, adopted: true } };
    }

    const ghRepo = await gh.getRepo(owner, site.slug);
    if (!ghRepo) throw new Error(`repo ${owner}/${site.slug} missing`);
    const branch = (job.result.branch as string) ?? ghRepo.default_branch;
    // Vercel wants the numeric repoId, which is why Repo carries `id`.
    const d = await vercel.deployFromGit({ name: site.slug, repoId: ghRepo.id, ref: branch });
    return { result: { deploymentId: d.id, url: d.url }, site: { preview_url: `https://${d.url}` } };
  },

  /** Poll, but only briefly: the queue reschedules instead of blocking a slot. */
  async deploy_wait({ site, vercel, job }) {
    const project = await vercel.getProject(site.slug);
    if (!project) throw new Error("vercel project missing");
    const latest = await vercel.latestProduction(project.id);
    if (!latest) throw new Error("no production deployment yet");
    if (latest.state === "READY") {
      /*
       * Store the CLEAN production alias, not the deployment specific URL.
       * Projects here run with ssoProtection all_except_custom_domains, so
       * sycorax-rn6u6uujl-team.vercel.app sits behind Vercel's login wall while
       * sycorax.vercel.app does not. Saving the protected URL means anyone who
       * clicks it from the dashboard gets a Vercel login instead of the site.
       */
      const alias = `https://${site.slug}.vercel.app`;
      return {
        result: { state: latest.state, deploymentUrl: latest.url, alias },
        site: { is_deployed: true, preview_url: alias },
      };
    }
    if (latest.state === "ERROR" || latest.state === "CANCELED") {
      throw new Error(`deployment ${latest.state}`);
    }
    // Not ready: throwing reschedules with backoff and keeps the attempt count.
    throw new Error(`deployment ${latest.state}, retrying`);
  },

  /**
   * Attach the domain only AFTER a deployment is READY. Attaching first is
   * exactly how a domain ends up serving a 404: it resolves to a project with no
   * production deployment.
   */
  /**
   * Attach the domain, stepping to <name>-N if the subdomain is already claimed.
   *
   * The repo step already picked a name whose CNAME was free, but a subdomain can
   * be attached to another Vercel project with no DNS record behind it, so the
   * clash can still surface here. Same idempotency rule as the repo step: the
   * resolved domain is recorded in job.result, and a retry reuses it rather than
   * walking further up the suffixes.
   */
  async domain({ site, vercel, job, db }) {
    if (!site.domain) return { skipped: true, result: { reason: "no domain set" } };
    const project = await vercel.getProject(site.slug);
    if (!project) throw new Error("vercel project missing");

    const settled = typeof job.result.domain === "string" ? (job.result.domain as string) : null;
    if (settled) {
      const added = await vercel.addDomain(project.id, settled);
      return { result: { domain: settled, added }, site: { domain: settled, domain_added: true } };
    }

    const zone = env("DNS_ZONE") || env("FACTORY_DOMAIN") || "getyetti.com";
    const isSubOfZone = site.domain.endsWith(`.${zone}`);
    const label = isSubOfZone ? site.domain.slice(0, -(zone.length + 1)) : null;
    const base = label ? label.replace(/-\d+$/, "") : null;

    for (let n = 0; n <= 20; n++) {
      const candidate = !base ? site.domain : n === 0 ? `${base}.${zone}` : `${base}-${n}.${zone}`;
      try {
        const added = await vercel.addDomain(project.id, candidate);
        if (candidate !== site.domain) await db.from("sites").update({ domain: candidate }).eq("id", site.id);
        return {
          result: { domain: candidate, added, renamed: candidate !== site.domain },
          site: { domain: candidate, domain_added: true },
        };
      } catch (e) {
        const msg = e instanceof HttpError ? e.message : String(e);
        // Only a clash is worth stepping past. Anything else is a real failure and
        // must not be hidden by trying twenty more names.
        const clash = /already in use|domain_already_in_use|conflict/i.test(msg);
        // A custom domain outside our zone cannot be renamed, so surface it.
        if (!clash || !base) throw e;
      }
    }
    throw new Error(`no free subdomain after 20 attempts from "${base}.${zone}"`);
  },

  async dns({ site, vercel }) {
    if (!site.domain) return { skipped: true, result: { reason: "no domain set" } };
    const provider = pickProvider();
    if (!provider) throw new Error("no DNS provider credentials configured");

    const config = await vercel.domainConfig(site.domain);
    const zone = env("DNS_ZONE") || site.domain.split(".").slice(-2).join(".");
    const rec = requiredRecord(site.domain, zone, config);

    await provider.upsert({ zone, ...rec });
    return {
      result: { provider: provider.name, zone, ...rec },
      site: { dns_written: true },
    };
  },

  /**
   * Vercel has TWO independent gates and passing one is not enough:
   *
   *   1. /v6/domains/<d>/config  -> misconfigured:false  means DNS points here
   *   2. project domain          -> verified:true        means the project may serve it
   *
   * The first version of this step only checked (1), so it reported success while
   * the domain still returned 404 and had no certificate. Gate (2) needs a TXT
   * record at _vercel.<zone> whenever the apex is claimed by another Vercel team,
   * which is exactly the case here.
   */
  async dns_verify({ site, vercel }) {
    if (!site.domain) return { skipped: true, result: { reason: "no domain set" } };

    const config = await vercel.domainConfig(site.domain);
    if (config.misconfigured !== false) throw new Error("DNS not propagated yet, retrying");

    const project = await vercel.getProject(site.slug);
    if (!project) throw new Error("vercel project missing");

    let attempt = await vercel.verifyProjectDomain(project.id, site.domain);
    if (attempt.verified) {
      return { result: { verified: true, txtWritten: false }, site: { dns_verified: true } };
    }

    if (attempt.challenge) {
      const provider = pickProvider();
      if (!provider) throw new Error(`needs TXT ${attempt.challenge} at _vercel, but no DNS provider is configured`);
      const zone = env("DNS_ZONE") || site.domain.split(".").slice(-2).join(".");
      // upsert MERGES for TXT, which matters: this record holds one entry per
      // subdomain and replacing it would break every other site on the zone.
      await provider.upsert({ zone, name: "_vercel", type: "TXT", value: attempt.challenge, ttl: 600 });
      attempt = await vercel.verifyProjectDomain(project.id, site.domain);
      if (attempt.verified) {
        return { result: { verified: true, txtWritten: true, challenge: attempt.challenge }, site: { dns_verified: true } };
      }
    }
    throw new Error("domain not verified on the project yet, retrying");
  },

  /** The "never a 404" guarantee, enforced rather than assumed. */
  async smoke({ site }) {
    const target = site.domain ? `https://${site.domain}` : null;
    if (!target) return { skipped: true, result: { reason: "no domain set" } };
    const res = await fetch(target, { redirect: "follow", signal: AbortSignal.timeout(15_000) });
    if (res.status !== 200) throw new Error(`${target} returned ${res.status}, expected 200`);
    const body = await res.text();
    return {
      result: { status: res.status, bytes: body.length, sawHolding: /Opening soon/i.test(body) },
      site: { live_url: target, status: "live" },
    };
  },
};

type Ctx = { site: Site; job: Job; gh: GitHub; vercel: Vercel; db: ReturnType<typeof adminDb> };

/* ── dispatcher ───────────────────────────────────────────────────────────── */

Deno.serve(async (req) => {
  // Not public: a stranger must not be able to drive provisioning.
  const secret = env("TICK_SECRET");
  if (secret && req.headers.get("x-tick-secret") !== secret) {
    return new Response(JSON.stringify({ error: "unauthorised" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const db = adminDb();
  await db.rpc("reap_stale_provision_jobs");

  const { data: jobs, error } = await db.rpc("claim_provision_jobs", { worker: WORKER, batch: 4, lease_seconds: 120 });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  if (!jobs?.length) {
    return new Response(JSON.stringify({ worker: WORKER, claimed: 0 }), { headers: { "Content-Type": "application/json" } });
  }

  const gh = new GitHub(env("GITHUB_TOKEN"));
  const vercelToken = env("VERCEL_TOKEN");
  const teamId = await new Vercel(vercelToken).resolveTeam(env("VERCEL_SCOPE")).catch(() => undefined);
  const vercel = new Vercel(vercelToken, teamId);

  const done: unknown[] = [];
  for (const job of jobs as Job[]) {
    const started = Date.now();
    const { data: site } = await db.from("sites").select("*").eq("id", job.site_id).single();
    const handler = handlers[job.step];

    if (!site || !handler) {
      await db.from("provision_jobs").update({
        status: "failed", error: !site ? "site missing" : `no handler for step ${job.step}`,
        finished_at: new Date().toISOString(),
      }).eq("id", job.id);
      continue;
    }

    try {
      const out = await handler({ site: site as Site, job, gh, vercel, db });
      await db.from("provision_jobs").update({
        status: out.skipped ? "skipped" : "done",
        result: { ...job.result, ...(out.result ?? {}) },
        error: null,
        finished_at: new Date().toISOString(),
        locked_by: null, lease_until: null,
      }).eq("id", job.id);
      if (out.site) await db.from("sites").update(out.site).eq("id", job.site_id);
      await logEvent(db, job.site_id, job.step, out.skipped ? "skipped" : "ok", { ms: Date.now() - started, ...(out.result ?? {}) });
      done.push({ step: job.step, status: out.skipped ? "skipped" : "done", ms: Date.now() - started });
    } catch (e) {
      const msg = e instanceof HttpError ? e.message : (e as Error).message ?? String(e);
      const terminal = job.attempts >= job.max_attempts;
      // Exponential backoff, capped: DNS propagation is measured in minutes.
      const delay = Math.min(600, 15 * 2 ** Math.max(0, job.attempts - 1));
      await db.from("provision_jobs").update({
        status: terminal ? "failed" : "pending",
        error: msg.slice(0, 500),
        next_attempt_at: new Date(Date.now() + delay * 1000).toISOString(),
        finished_at: terminal ? new Date().toISOString() : null,
        locked_by: null, lease_until: null,
      }).eq("id", job.id);
      if (terminal) await db.from("sites").update({ status: "failed" }).eq("id", job.site_id);
      await logEvent(db, job.site_id, job.step, terminal ? "failed" : "warn", { error: msg.slice(0, 300), attempt: job.attempts });
      done.push({ step: job.step, status: terminal ? "failed" : "retry", error: msg.slice(0, 160), retryInS: terminal ? null : delay });
    }
  }

  return new Response(JSON.stringify({ worker: WORKER, claimed: jobs.length, done }, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
});
