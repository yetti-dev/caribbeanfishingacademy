/**
 * notify — Resend email for each stage of a site build.
 *
 * Three stages, one run: started -> written -> deployed. Each email carries the
 * running clock against a 30 minute budget, so a slow phase is visible while
 * there is still time to react rather than in a post mortem.
 *
 * Run state lives in .factory/run.json so the stages can be sent from separate
 * commands (the build is agent work, the deploy is scripts/deploy.mjs) and still
 * share one timeline.
 *
 * HTML is table-based with inline styles on purpose: Gmail strips <style> blocks,
 * ignores flex and grid, and does not support CSS variables. Nothing external is
 * referenced, so there is nothing to block and no tracking pixel.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readEnv, root } from "./env.mjs";

const STATE_DIR = join(root, ".factory");
const STATE = join(STATE_DIR, "run.json");
const BUDGET_MIN = 30;

/* ── run state ────────────────────────────────────────────────────────────── */

export function loadRun() {
  if (!existsSync(STATE)) return null;
  try { return JSON.parse(readFileSync(STATE, "utf8")); } catch { return null; }
}

export function saveRun(run) {
  mkdirSync(STATE_DIR, { recursive: true });
  writeFileSync(STATE, JSON.stringify(run, null, 2) + "\n");
  return run;
}

export function startRun({ project, source, brief, domain }) {
  return saveRun({
    project, source, brief, domain,
    startedAt: new Date().toISOString(),
    phases: [],
  });
}

/** Close the open phase and open a new one. Called at each stage boundary. */
export function markPhase(name) {
  const run = loadRun();
  if (!run) return null;
  const now = Date.now();
  const last = run.phases[run.phases.length - 1];
  if (last && !last.endedAt) {
    last.endedAt = new Date(now).toISOString();
    last.seconds = Math.round((now - Date.parse(last.startedAt)) / 1000);
  }
  run.phases.push({ name, startedAt: new Date(now).toISOString() });
  return saveRun(run);
}

export function closeRun() {
  const run = loadRun();
  if (!run) return null;
  const last = run.phases[run.phases.length - 1];
  if (last && !last.endedAt) {
    last.endedAt = new Date().toISOString();
    last.seconds = Math.round((Date.now() - Date.parse(last.startedAt)) / 1000);
  }
  run.endedAt = new Date().toISOString();
  return saveRun(run);
}

export const elapsedSeconds = (run) =>
  Math.round(((run?.endedAt ? Date.parse(run.endedAt) : Date.now()) - Date.parse(run.startedAt)) / 1000);

const fmt = (s) => {
  if (s == null) return "running";
  const m = Math.floor(s / 60), r = s % 60;
  return m ? `${m}m ${String(r).padStart(2, "0")}s` : `${r}s`;
};

/* ── html ─────────────────────────────────────────────────────────────────── */

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const INK = "#0d1117", MUTED = "#6b7280", LINE = "#e5e7eb", PAPER = "#ffffff", WASH = "#f6f7f9";
const TONE = {
  started: { accent: "#6d5ae6", label: "Build started" },
  written: { accent: "#0f9d76", label: "Site written" },
  deployed: { accent: "#1d6ef5", label: "Deployed" },
  failed: { accent: "#d43b3b", label: "Build failed" },
};

/** Outer chrome. `stage` picks the accent, `rows` is the body html. */
function shell({ stage, project, headline, sub, body }) {
  const t = TONE[stage] || TONE.started;
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>${esc(headline)}</title></head>
<body style="margin:0;padding:0;background:${WASH};">
<div style="display:none;font-size:1px;color:${WASH};max-height:0;overflow:hidden;">${esc(sub)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WASH};padding:32px 16px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${PAPER};border:1px solid ${LINE};border-radius:14px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <tr><td style="height:4px;background:${t.accent};"></td></tr>
    <tr><td style="padding:28px 32px 8px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:${t.accent};">${esc(t.label)}</td>
        <td align="right" style="font:400 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:${MUTED};">${esc(project)}</td>
      </tr></table>
      <h1 style="margin:14px 0 6px 0;font:700 25px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};letter-spacing:-.02em;">${esc(headline)}</h1>
      <p style="margin:0;font:400 15px/1.55 inherit;color:${MUTED};">${esc(sub)}</p>
    </td></tr>
    ${body}
    <tr><td style="padding:18px 32px 26px 32px;border-top:1px solid ${LINE};font:400 12px/1.5 inherit;color:${MUTED};">
      Sent by the website factory. Budget ${BUDGET_MIN} minutes per site.
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

/** Label/value rows. Values that look like urls become links. */
function facts(pairs) {
  const rows = pairs.filter(([, v]) => v).map(([k, v], i) => {
    const val = /^https?:\/\//.test(v)
      ? `<a href="${esc(v)}" style="color:#1d6ef5;text-decoration:none;word-break:break-all;">${esc(v.replace(/^https?:\/\//, ""))}</a>`
      : `<span style="word-break:break-word;">${esc(v)}</span>`;
    return `<tr>
      <td style="padding:9px 0;${i ? `border-top:1px solid ${LINE};` : ""}width:34%;font:400 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:${MUTED};vertical-align:top;">${esc(k)}</td>
      <td style="padding:9px 0;${i ? `border-top:1px solid ${LINE};` : ""}font:400 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">${val}</td>
    </tr>`;
  }).join("");
  return `<tr><td style="padding:12px 32px 4px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>`;
}

/** Quoted brief from the colleague. */
function quote(text) {
  if (!text) return "";
  return `<tr><td style="padding:16px 32px 4px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WASH};border-left:3px solid ${LINE};border-radius:0 8px 8px 0;">
      <tr><td style="padding:14px 16px;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};white-space:pre-wrap;">${esc(text)}</td></tr>
    </table></td></tr>`;
}

/** Phase timeline with a budget bar. */
function timeline(run) {
  const total = elapsedSeconds(run);
  const pct = Math.min(100, Math.round((total / (BUDGET_MIN * 60)) * 100));
  const over = total > BUDGET_MIN * 60;
  const bar = over ? "#d43b3b" : pct > 75 ? "#e0a02c" : "#0f9d76";
  const rows = run.phases.map((p, i) => `<tr>
      <td style="padding:7px 0;${i ? `border-top:1px solid ${LINE};` : ""}font:400 13px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">${esc(p.name)}</td>
      <td align="right" style="padding:7px 0;${i ? `border-top:1px solid ${LINE};` : ""}font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:${p.seconds == null ? MUTED : INK};">${fmt(p.seconds)}</td>
    </tr>`).join("");
  return `<tr><td style="padding:20px 32px 4px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:${MUTED};padding-bottom:10px;">Timing</td>
      <td align="right" style="font:700 13px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:${over ? "#d43b3b" : INK};padding-bottom:10px;">${fmt(total)} / ${BUDGET_MIN}m</td>
    </tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${LINE};border-radius:99px;height:6px;margin-bottom:12px;">
      <tr><td style="width:${pct}%;background:${bar};border-radius:99px;height:6px;font-size:0;line-height:0;">&nbsp;</td><td style="font-size:0;line-height:0;">&nbsp;</td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
  </td></tr>`;
}

/** One prominent link. */
function cta(href, label, accent) {
  if (!href) return "";
  return `<tr><td style="padding:22px 32px 6px 32px;">
    <a href="${esc(href)}" style="display:inline-block;background:${accent};color:#fff;font:600 15px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;text-decoration:none;padding:13px 22px;border-radius:9px;">${esc(label)}</a>
  </td></tr>`;
}

/* ── send ─────────────────────────────────────────────────────────────────── */

export async function send({ subject, html, text, to, from, env = readEnv() }) {
  const key = env.RESEND_API_KEY;
  if (!key) return { ok: false, skipped: true, reason: "RESEND_API_KEY not in .env" };
  const payload = {
    from: from || env.NOTIFY_FROM || "Website Factory <factory@growtk.co>",
    to: (to || env.NOTIFY_TO || "anique.cs@gmail.com").split(",").map((s) => s.trim()),
    subject,
    html,
    text: text || subject,
  };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (!res.ok) return { ok: false, status: res.status, error: body.slice(0, 300) };
  let id = null;
  try { id = JSON.parse(body).id; } catch { /* ignore */ }
  return { ok: true, id };
}

/* ── the three stages ─────────────────────────────────────────────────────── */

export async function notifyStarted(run, env) {
  const html = shell({
    stage: "started", project: run.project,
    headline: `Building ${run.project}`,
    sub: `Cloning ${String(run.source || "").replace(/^https?:\/\//, "")} and building a new site. Target ${BUDGET_MIN} minutes.`,
    body: quote(run.brief) + facts([
      ["source", run.source],
      ["domain", run.domain ? `https://${run.domain}` : null],
      ["started", new Date(run.startedAt).toLocaleString("en-GB", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" }) + " PKT"],
    ]),
  });
  return send({ subject: `Build started: ${run.project}`, html, text: `Building ${run.project} from ${run.source}`, env });
}

export async function notifyWritten(run, env, { pages = [], blocks = null, theme = null } = {}) {
  const html = shell({
    stage: "written", project: run.project,
    headline: "Site written",
    sub: `${pages.length} page(s) built. Deploying next.`,
    body: facts([
      ["pages", pages.join(", ") || null],
      ["blocks used", blocks],
      ["theme", theme],
    ]) + timeline(run),
  });
  return send({ subject: `Site written: ${run.project} (${fmt(elapsedSeconds(run))})`, html, env });
}

export async function notifyDeployed(run, env, { repo, deployUrl, domain, dns, vercelProject, dnsProvider } = {}) {
  const live = domain ? `https://${domain}` : deployUrl;
  const total = elapsedSeconds(run);
  const html = shell({
    stage: "deployed", project: run.project,
    headline: "Live",
    sub: `${run.project} is deployed${total ? ` in ${fmt(total)}` : ""}.`,
    body: cta(live, "Open the site", TONE.deployed.accent) + facts([
      ["live", live],
      ["domain", domain],
      ["dns", dns],
      ["provider", dnsProvider],
      ["vercel", vercelProject],
      ["preview", deployUrl],
      ["repo", repo],
    ]) + timeline(run),
  });
  return send({ subject: `Live: ${run.project} at ${domain || "vercel.app"} (${fmt(total)})`, html, env });
}

export async function notifyFailed(run, env, { stage, error } = {}) {
  const html = shell({
    stage: "failed", project: run?.project || "unknown",
    headline: `Failed during ${stage || "build"}`,
    sub: "The run stopped. Nothing was deployed.",
    body: quote(error) + (run ? timeline(run) : ""),
  });
  return send({ subject: `Build failed: ${run?.project || "unknown"} (${stage || "build"})`, html, env });
}
