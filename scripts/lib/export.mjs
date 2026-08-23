/**
 * Clean export — the tree we actually deploy.
 *
 * `git archive HEAD` (not a copy of the working dir) so node_modules, .next and
 * anything gitignored — including .env with every token in it — can never reach
 * the pushed repo. Then the factory tooling is stripped and the result is
 * sanity-checked, because the failures below all produce a GREEN build that
 * serves an unstyled or broken site.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

/** Every file in the export, so the leak checks can read all of them. */
function walkFiles(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git" || e.name === ".next") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

export const STRIP = [
  ".claude", ".scrape", ".factory", ".security", "supabase",
  "CLAUDE.md", "AGENTS.md", "scripts", "ideas", ".env.example", ".npmrc",
  // The factory route group: picker, dashboard and everything talking to
  // Supabase. This is the whole reason the app is split into route groups.
  "app/(factory)",
  "components/sections/sidebar",
  "components/sections-showcase.tsx",
  "components/sections/catalog.tsx",
  "components/sections/theme.ts",
  "components/sections/font-select.tsx",
  "lib/showcase-fonts.ts",
  "content/demo.ts",
];
export const FACTORY_SCRIPTS = ["brand", "check", "clone", "guard", "deploy", "go", "up", "verify", "db", "blocks", "blocks:prune", "blocks:curate"];
/**
 * Dependencies that exist only for the factory. Left in place they are dead
 * weight in every client install, and @supabase/supabase-js in particular would
 * invite someone to wire a client site straight to the factory database.
 */
export const FACTORY_DEPS = ["@supabase/supabase-js"];

const git = (args, cwd) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();

/** Commit whatever is uncommitted, and fail loudly if the commit did not land. */
export function commitAll(root, message = "Build site") {
  const dirty = git(["status", "--porcelain"], root);
  if (!dirty) return { committed: false, files: 0 };
  const before = (() => { try { return git(["rev-parse", "HEAD"], root); } catch { return null; } })();
  git(["add", "-A"], root);
  try {
    git(["-c", "user.name=deploy", "-c", "user.email=deploy@local", "commit", "-m", message], root);
  } catch { /* fall through to the HEAD check, which gives a better message */ }
  const after = git(["rev-parse", "HEAD"], root);
  if (after === before) {
    throw new Error(
      "the commit did not land, so the push would ship the PREVIOUS tree.\n" +
      "Run `git commit` by hand and read the error (a pre-commit hook or missing git identity is usual).\n" +
      git(["status", "--short"], root),
    );
  }
  return { committed: true, files: dirty.split("\n").length };
}

/** Materialise the stripped, validated export into a temp dir. Caller disposes it. */
export function buildExport(root) {
  const work = mkdtempSync(join(tmpdir(), "deploy-"));
  try {
    execFileSync("sh", ["-c", `git archive HEAD | tar -x -C '${work}'`], { cwd: root, stdio: "pipe" });
    for (const p of STRIP) rmSync(join(work, p), { recursive: true, force: true });

    const pkgPath = join(work, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
      for (const k of FACTORY_SCRIPTS) delete pkg.scripts?.[k];
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    }

    /*
     * The client site's root layout now lives in the (site) route group, since
     * app/layout.tsx was removed when the app was split. Without a root layout
     * the export builds to a broken tree.
     */
    for (const required of ["package.json", "postcss.config.mjs", "app/globals.css", "app/(site)/layout.tsx", "app/(site)/page.tsx", "next.config.ts"]) {
      if (!existsSync(join(work, required))) throw new Error(`the export is missing ${required}. Is it committed and not gitignored?`);
    }
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    for (const d of FACTORY_DEPS) {
      delete pkg.dependencies?.[d];
      delete pkg.devDependencies?.[d];
    }
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

    const misplaced = ["tailwindcss", "@tailwindcss/postcss", "typescript"].filter((d) => !pkg.dependencies?.[d]);
    if (misplaced.length) {
      throw new Error(
        `${misplaced.join(" and ")} must live in "dependencies", not "devDependencies".\n` +
        "Vercel skips devDependencies when NODE_ENV=production is set on the project, and the build then\n" +
        "either fails on unresolved @/ imports or ships with no CSS.",
      );
    }
    if (!readFileSync(join(work, "app", "(site)", "layout.tsx"), "utf8").includes("globals.css")) {
      throw new Error("app/(site)/layout.tsx does not import globals.css, so the deployed site would have no stylesheet.");
    }
    // Belt and braces: prove no secret rode along.
    for (const leak of [".env", ".env.local", ".env.production"]) {
      if (existsSync(join(work, leak))) throw new Error(`${leak} is inside the export. Remove it from git and add it to .gitignore before deploying.`);
    }

    /*
     * Factory leak assertions. Stripping by path is only half the job: a single
     * surviving import would ship the dashboard, or worse, a reference to the
     * service role key, to a client repo. These checks fail the deploy rather
     * than let that happen quietly.
     */
    for (const p of STRIP) {
      if (existsSync(join(work, p))) throw new Error(`"${p}" survived the strip and is still in the export.`);
    }
    const offenders = [];
    for (const file of walkFiles(work)) {
      const rel = relative(work, file);
      if (!/\.(tsx?|jsx?|mjs|cjs)$/.test(rel)) continue;
      const src = readFileSync(file, "utf8");
      if (/@\/app\/\(factory\)|components\/sections\/(?:sidebar|catalog|theme|font-select)|sections-showcase|showcase-fonts|content\/demo/.test(src)) {
        offenders.push(`${rel} imports factory-only code`);
      }
      if (/SERVICE_ROLE_KEY|service_role/.test(src)) {
        offenders.push(`${rel} references the Supabase service role key`);
      }
      if (/@supabase\/supabase-js/.test(src)) {
        offenders.push(`${rel} imports the Supabase client`);
      }
    }
    if (offenders.length) {
      throw new Error(
        `the export still references factory-only code:\n  ${offenders.slice(0, 8).join("\n  ")}\n` +
        "Move that code under app/(factory) or a stripped path before deploying.",
      );
    }
    return work;
  } catch (err) {
    rmSync(work, { recursive: true, force: true });
    throw err;
  }
}

/** Force-push the export as a single fresh commit. `remote` may embed a token. */
export function pushExport(work, remote, branch = "main") {
  git(["init", "-q", "-b", branch], work);
  git(["add", "-A"], work);
  git(["-c", "user.name=deploy", "-c", "user.email=deploy@local", "commit", "-q", "-m", "Deploy site"], work);
  git(["remote", "add", "origin", remote], work);
  git(["push", "-f", "origin", branch], work);
  return git(["rev-parse", "HEAD"], work);
}
