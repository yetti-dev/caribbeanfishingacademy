/**
 * site-state — keep Supabase and the team in the loop while Claude builds.
 *
 * The ten provisioning steps run server side and write their own progress. The
 * part AFTER provisioning (layout, copy, images: the agent work) wrote nothing
 * anywhere, so the dashboard showed a site sitting at 'live' with zero pages and
 * no way to tell whether anyone was working on it. Two colleagues could start
 * the same site and neither would know.
 *
 * This closes that gap. It is deliberately a small CLI rather than a library so
 * the build skill can call it between phases without importing anything.
 *
 *   npm run site -- start <slug>          claim it, status=building, email the team
 *   npm run site -- sync  <slug>          recount pages/sections/images into Supabase
 *   npm run site -- done  <slug>          status=built, final counts, email the team
 *   npm run site -- fail  <slug> "why"    status=failed, email the team
 *
 * A slug with no row in Supabase is created rather than refused: a site built
 * from a bare clone still belongs on the dashboard.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { readEnv, root } from "./lib/env.mjs";
import { send } from "./lib/notify.mjs";

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`, cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
};

const env = readEnv();
const URL_ = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SERVICE_ROLE_KEY;

const die = (m) => { console.error(`${c.red("error")}  ${m}`); process.exit(1); };
const say = (k, m) => console.log(`  ${c.dim(k.padEnd(9))} ${m}`);

const [cmd, slug, ...extra] = process.argv.slice(2);
if (!cmd || !slug) die('usage: npm run site -- <start|sync|done|fail> <slug> ["message"]');
if (!URL_ || !KEY) die("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be in .env");

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

async function rest(path, init = {}) {
  const r = await fetch(`${URL_}/rest/v1/${path}`, { ...init, headers: { ...H, ...(init.headers || {}) } });
  const text = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

/* ── counters, read off the working tree ──────────────────────────────────── */

const walk = (dir, hit, out = []) => {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, hit, out);
    else if (hit(e.name)) out.push(p);
  }
  return out;
};

function counts() {
  const pages = walk(join(root, "app/(site)"), (n) => n === "page.tsx").length;

  // A section only counts once it is actually imported by a route or a content
  // file. Counting the library itself would report 139 on an empty site.
  const used = new Set();
  for (const f of [...walk(join(root, "app/(site)"), (n) => n.endsWith(".tsx")),
                   ...walk(join(root, "content"), (n) => n.endsWith(".ts"))]) {
    for (const m of readFileSync(f, "utf8").matchAll(/@\/components\/sections\/([\w/-]+)/g)) used.add(m[1]);
  }

  const ingested = join(root, "public/ingested", slug);
  const images = existsSync(ingested)
    ? readdirSync(ingested).filter((n) => statSync(join(ingested, n)).isFile()).length
    : walk(join(root, "public/ingested"), () => true).length;

  return { page_count: pages, section_count: used.size, image_count: images };
}

/* ── the row ──────────────────────────────────────────────────────────────── */

async function getSite() {
  const [row] = await rest(`sites?slug=eq.${encodeURIComponent(slug)}&select=*`);
  return row ?? null;
}

async function ensureSite() {
  const found = await getSite();
  if (found) return found;
  say("supabase", `${c.yellow("no row")} for ${c.cyan(slug)}, creating one`);
  const [row] = await rest("sites", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      slug,
      name: slug.replace(/-/g, " ").replace(/^./, (ch) => ch.toUpperCase()),
      status: "building",
      created_by: env.NOTIFY_TO || "factory",
    }),
  });
  return row;
}

const patch = async (id, body) => {
  const [row] = await rest(`sites?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...body, updated_at: new Date().toISOString() }),
  });
  return row;
};

/* ── email ────────────────────────────────────────────────────────────────── */

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

function mail({ headline, sub, facts, href, label, accent = "#0f172a" }) {
  const rows = facts.filter(([, v]) => v).map(([k, v]) =>
    `<tr><td style="padding:5px 0;font:400 13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#64748b;width:120px;">${esc(k)}</td>
         <td style="padding:5px 0;font:500 13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a;">${esc(v)}</td></tr>`).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:28px 0;">
    <tr><td align="center"><table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:30px 32px 0 32px;">
        <h1 style="margin:0;font:700 21px/1.25 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a;">${esc(headline)}</h1>
        <p style="margin:9px 0 0 0;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#475569;">${esc(sub)}</p>
      </td></tr>
      <tr><td style="padding:18px 32px 0 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
      ${href ? `<tr><td style="padding:22px 32px 0 32px;"><a href="${esc(href)}" style="display:inline-block;background:${accent};color:#fff;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;text-decoration:none;padding:12px 20px;border-radius:9px;">${esc(label)}</a></td></tr>` : ""}
      <tr><td style="padding:26px 32px 30px 32px;"></td></tr>
    </table></td></tr></table>`;
}

const report = (r) => say("email", r.ok ? c.green("sent") : r.skipped ? c.dim(r.reason) : `${c.yellow("not sent")} ${r.error || r.status}`);

/* ── commands ─────────────────────────────────────────────────────────────── */

const live = (s) => s.live_url || (s.domain ? `https://${s.domain}` : null);

if (cmd === "start") {
  const site = await ensureSite();

  /*
   * The case worth an email: provisioning already finished and put a real
   * domain online, but nobody has written a page yet. A colleague opening that
   * URL sees the holding page and cannot tell it is claimed. Say so explicitly.
   */
  const deployedButEmpty = site.is_deployed && (site.page_count ?? 0) === 0;

  await patch(site.id, { status: "building" });
  say("supabase", `${c.cyan(slug)} status ${c.dim("->")} building`);

  report(await send({
    subject: deployedButEmpty
      ? `Work started: ${site.name} (deployed, no pages yet)`
      : `Work started: ${site.name}`,
    html: mail({
      headline: `Build started on ${site.name}`,
      sub: deployedButEmpty
        ? "This site is already deployed and the domain resolves, but it has no pages yet. It is claimed now, so please do not start a second build on it."
        : "Someone has claimed this site and started building. Please do not start a second build on it.",
      facts: [
        ["slug", slug],
        ["status", deployedButEmpty ? "deployed, no pages yet" : site.status],
        ["source", site.source_url],
        ["domain", live(site)],
        ["repo", site.github_repo_url],
      ],
      href: live(site), label: "Open the site",
    }),
    text: `Build started on ${site.name}${deployedButEmpty ? " (already deployed, no pages yet)" : ""}`,
    env,
  }));
}

else if (cmd === "sync") {
  const site = await ensureSite();
  const n = counts();
  await patch(site.id, n);
  say("supabase", `${c.cyan(slug)} ${n.page_count} pages, ${n.section_count} sections, ${n.image_count} images`);
}

else if (cmd === "done") {
  const site = await ensureSite();
  const n = counts();
  await patch(site.id, { ...n, status: "built" });
  say("supabase", `${c.cyan(slug)} status ${c.dim("->")} built`);

  report(await send({
    subject: `Site completed: ${site.name}`,
    html: mail({
      headline: `${site.name} is built`,
      sub: "Pages, copy and images are written and the build is green. Push to redeploy, the Vercel project is already linked to the repo.",
      facts: [
        ["slug", slug],
        ["pages", n.page_count],
        ["sections", n.section_count],
        ["images", n.image_count],
        ["domain", live(site)],
        ["repo", site.github_repo_url],
      ],
      href: live(site), label: "Open the site", accent: "#047857",
    }),
    text: `${site.name} is built: ${n.page_count} pages, ${n.section_count} sections, ${n.image_count} images`,
    env,
  }));
}

else if (cmd === "fail") {
  const site = await ensureSite();
  const why = extra.length ? extra.join(" ") : "no reason given";
  await patch(site.id, { status: "failed" });
  say("supabase", `${c.cyan(slug)} status ${c.dim("->")} failed`);
  report(await send({
    subject: `Build failed: ${site.name}`,
    html: mail({
      headline: `${site.name} did not build`,
      sub: why,
      facts: [["slug", slug], ["domain", live(site)], ["repo", site.github_repo_url]],
      accent: "#b91c1c",
    }),
    text: `${site.name} failed: ${why}`,
    env,
  }));
}

else die(`unknown command "${cmd}". Use start, sync, done or fail.`);
