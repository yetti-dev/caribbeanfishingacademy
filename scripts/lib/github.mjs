/**
 * GitHub repo creation + push, via the REST API and plain git.
 *
 * We do NOT shell out to `gh` for auth-sensitive work: gh prefers its own
 * keyring session over GH_TOKEN in some configurations, which would create the
 * repo under the wrong account. The token in .env is the only identity here.
 */
const API = "https://api.github.com";

export class GitHub {
  constructor(token) {
    if (!token) throw new Error("GITHUB_TOKEN missing");
    this.token = token;
  }

  async call(method, path, body) {
    const res = await fetch(API + path, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
    if (!res.ok) {
      const err = new Error(data?.message || `${method} ${path} -> ${res.status}`);
      err.status = res.status;
      err.errors = data?.errors;
      throw err;
    }
    return data;
  }

  whoami = () => this.call("GET", "/user");

  async findRepo(owner, name) {
    try { return await this.call("GET", `/repos/${owner}/${name}`); }
    catch (e) { if (e.status === 404) return null; throw e; }
  }

  /** Idempotent. Returns { repo, created }. `owner` null => the token's own account. */
  async ensureRepo(name, { owner = null, private: priv = true, description = "" } = {}) {
    const me = await this.whoami();
    const target = owner || me.login;
    const existing = await this.findRepo(target, name);
    if (existing) return { repo: existing, created: false, owner: target };
    const path = owner && owner !== me.login ? `/orgs/${owner}/repos` : "/user/repos";
    const repo = await this.call("POST", path, { name, private: priv, description, has_issues: false, has_wiki: false, auto_init: false });
    return { repo, created: true, owner: target };
  }

  /**
   * A push URL carrying the token. Never print this — it contains the secret.
   * x-access-token is the documented PAT form for HTTPS git.
   */
  pushUrl(owner, name) {
    return `https://x-access-token:${this.token}@github.com/${owner}/${name}.git`;
  }
}

/** Scrub any token that leaked into an error message before it reaches a log. */
export const scrub = (s, ...secrets) =>
  secrets.filter(Boolean).reduce((acc, sec) => acc.split(sec).join("***"), String(s));
