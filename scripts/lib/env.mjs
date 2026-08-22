/**
 * .env reader.
 *
 * Deliberately NOT `set -a; . ./.env`. A key whose name starts with a digit
 * (21ST_DEV_API_KEY) makes that shell form fail, and zsh echoes the ENTIRE
 * offending line — secret included — into the error output. Parse it instead.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function readEnv(file = join(root, ".env")) {
  const out = {};
  if (!existsSync(file)) return out;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (/^\s*(#|$)/.test(line)) continue;
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_0-9]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

/** Never log a secret. Use this whenever a token must appear in output. */
export const mask = (s) => (!s ? "(unset)" : s.length <= 8 ? "*".repeat(s.length) : s.slice(0, 4) + "…" + s.slice(-2));

export function requireEnv(env, keys, why) {
  const missing = keys.filter((k) => !env[k]);
  if (missing.length) {
    throw new Error(`${missing.join(", ")} missing from .env — needed to ${why}.`);
  }
}
