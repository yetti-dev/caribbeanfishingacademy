#!/usr/bin/env node
/**
 * db — apply migrations and inspect the factory schema.
 *
 *   npm run db check     what exists right now
 *   npm run db apply     run pending migrations (needs SUPABASE_DB_URL)
 *   npm run db seed      add yourself to the member allowlist
 *
 * Supabase's REST API cannot run DDL, so `apply` needs a direct Postgres
 * connection string in SUPABASE_DB_URL. Get it from
 * Project settings -> Database -> Connection string -> URI, and use the pooler
 * URI on port 5432. Without it, `apply` prints the SQL to paste into the SQL
 * editor instead of failing silently.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { readEnv, root, mask } from "./lib/env.mjs";

const cmd = process.argv[2] || "check";
const env = readEnv();
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`, cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
const die = (m) => { console.error(`\n${c.red("db failed:")} ${m}\n`); process.exit(1); };

const URL_ = env.SUPABASE_URL;
// Accept either name: SERVICE_ROLE_KEY is what this project already had.
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY || env.SERVICE_ROLE_KEY;
if (!URL_ || !SERVICE) die("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SERVICE_ROLE_KEY) must be in .env");

const rest = async (path, init = {}) => {
  const r = await fetch(`${URL_}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE, Authorization: `Bearer ${SERVICE}`,
      "Content-Type": "application/json", Prefer: "return=representation",
      ...(init.headers || {}),
    },
  });
  const text = await r.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
  return { status: r.status, ok: r.ok, body };
};

const TABLES = [
  "factory_members", "sites", "runs", "run_events", "layouts",
  "scrapes", "content_files", "deploys", "domains", "notifications",
];

if (cmd === "check") {
  console.log(`\n${c.bold("db check")} ${c.dim(URL_)}\n`);
  let missing = 0;
  for (const t of TABLES) {
    const r = await rest(`${t}?select=*&limit=1`);
    if (r.status === 200) {
      const count = await rest(`${t}?select=count`, { headers: { Prefer: "count=exact" } });
      const n = Array.isArray(count.body) && count.body[0]?.count != null ? count.body[0].count : "?";
      console.log(`  ${c.green("ok")}    ${t.padEnd(16)} ${c.dim(`${n} row(s)`)}`);
    } else {
      missing++;
      const msg = r.body?.message || r.body?.hint || `status ${r.status}`;
      console.log(`  ${c.red("miss")}  ${t.padEnd(16)} ${c.dim(String(msg).slice(0, 60))}`);
    }
  }
  const view = await rest("site_overview?select=*&limit=1");
  console.log(`  ${view.status === 200 ? c.green("ok") : c.red("miss")}    ${"site_overview".padEnd(16)} ${c.dim("(view)")}`);
  console.log(missing ? `\n${c.yellow(`${missing} table(s) missing.`)} Run: npm run db apply\n` : `\n${c.green("schema present")}\n`);
  process.exit(0);
}

if (cmd === "apply") {
  const dir = join(root, "supabase", "migrations");
  if (!existsSync(dir)) die("no supabase/migrations directory");
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  if (!files.length) die("no .sql migrations found");

  const dbUrl = env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.log(`\n${c.yellow("SUPABASE_DB_URL is not set,")} so the migration cannot be applied from here.\n`);
    console.log(`  Option 1  add it to .env, then re-run:`);
    console.log(`            ${c.dim("Supabase dashboard -> Project settings -> Database -> Connection string -> URI")}`);
    console.log(`            ${c.dim("SUPABASE_DB_URL=postgresql://postgres.<ref>:<password>@<host>:5432/postgres")}\n`);
    console.log(`  Option 2  paste each file into the SQL editor, in order:`);
    for (const f of files) console.log(`            ${c.cyan(`supabase/migrations/${f}`)}`);
    console.log();
    process.exit(1);
  }
  let psqlOk = true;
  try { execFileSync("psql", ["--version"], { stdio: "pipe" }); } catch { psqlOk = false; }
  if (!psqlOk) die("psql is not installed. Install libpq (brew install libpq) or use the SQL editor.");

  for (const f of files) {
    process.stdout.write(`  ${c.dim("apply")} ${f} ... `);
    try {
      execFileSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-f", join(dir, f)], { stdio: "pipe", encoding: "utf8" });
      console.log(c.green("ok"));
    } catch (e) {
      console.log(c.red("failed"));
      die(`${f}: ${String(e.stderr || e.message).split("\n").filter(Boolean).slice(-3).join("\n")}`);
    }
  }
  console.log(`\n${c.green("migrations applied.")} Now: npm run db seed\n`);
  process.exit(0);
}

if (cmd === "seed") {
  const email = process.argv[3] || env.NOTIFY_TO || "anique.cs@gmail.com";
  const r = await rest("factory_members", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify([{ email, role: "owner" }]),
  });
  if (!r.ok) die(`could not add ${email}: ${r.body?.message || r.status}`);
  console.log(`\n${c.green("allowlisted")} ${c.cyan(email)} as owner\n`);
  process.exit(0);
}

die(`unknown command "${cmd}". Use check, apply or seed.`);
