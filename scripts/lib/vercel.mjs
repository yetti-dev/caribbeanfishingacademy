/**
 * Vercel REST client.
 *
 * Uses the API, not the CLI, for anything that matters. The CLI silently falls
 * back to the scope cached in ~/Library/Application Support/com.vercel.cli when
 * a flag is absent — which is how a deploy lands in the wrong team. Every call
 * here carries teamId explicitly.
 */
const API = "https://api.vercel.com";

export class Vercel {
  constructor(token, teamId = null) {
    if (!token) throw new Error("VERCEL_TOKEN missing");
    this.token = token;
    this.teamId = teamId;
  }

  async call(method, path, body) {
    const url = new URL(API + path);
    if (this.teamId) url.searchParams.set("teamId", this.teamId);
    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
    if (!res.ok) {
      const err = new Error(data?.error?.message || `${method} ${path} -> ${res.status}`);
      err.status = res.status;
      err.code = data?.error?.code;
      throw err;
    }
    return data;
  }

  get = (p) => this.call("GET", p);
  post = (p, b) => this.call("POST", p, b);
  del = (p) => this.call("DELETE", p);

  /** Resolve a team slug to its id so every later call can pin it. */
  static async resolveScope(token, slug) {
    const v = new Vercel(token);
    if (!slug) return null;
    const { teams = [] } = await v.get("/v2/teams");
    const hit = teams.find((t) => t.slug === slug || t.id === slug);
    if (!hit) throw new Error(`VERCEL_SCOPE="${slug}" not visible to this token. Token sees: ${teams.map((t) => t.slug).join(", ") || "no teams"}`);
    return hit.id;
  }

  async findProject(name) {
    try { return await this.get(`/v9/projects/${encodeURIComponent(name)}`); }
    catch (e) { if (e.status === 404) return null; throw e; }
  }

  async ensureProject(name, repo /* "owner/name" */) {
    const existing = await this.findProject(name);
    if (existing) return { project: existing, created: false };
    const project = await this.post("/v11/projects", {
      name,
      framework: "nextjs",
      gitRepository: repo ? { type: "github", repo } : undefined,
    });
    return { project, created: true };
  }

  /** Idempotent: an already-set var of the same name is replaced, not duplicated. */
  async setEnv(projectId, key, value, targets = ["production", "preview", "development"]) {
    const { envs = [] } = await this.get(`/v10/projects/${projectId}/env`);
    for (const e of envs.filter((e) => e.key === key)) {
      await this.del(`/v9/projects/${projectId}/env/${e.id}`);
    }
    await this.post(`/v10/projects/${projectId}/env`, { key, value, type: "encrypted", target: targets });
  }

  async addDomain(projectId, domain) {
    try { return await this.post(`/v10/projects/${projectId}/domains`, { name: domain }); }
    catch (e) {
      // already attached to THIS project is success; attached elsewhere is not.
      if (e.code === "domain_already_in_use" || /already/i.test(e.message)) {
        const { domains = [] } = await this.get(`/v9/projects/${projectId}/domains`);
        if (domains.some((d) => d.name === domain)) return { name: domain, alreadyAttached: true };
      }
      throw e;
    }
  }

  /**
   * What DNS records does THIS project actually need? Never hardcode
   * 76.76.21.21 — newer projects get anycast IPs like 216.198.79.1 and
   * per-project CNAMEs like xyz.vercel-dns-016.com.
   */
  async domainConfig(domain) {
    return this.get(`/v6/domains/${encodeURIComponent(domain)}/config`);
  }

  async projectDomain(projectId, domain) {
    return this.get(`/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}`);
  }

  async verifyDomain(projectId, domain) {
    return this.post(`/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}/verify`, {});
  }
}

/**
 * Turn Vercel's config response into the records we must write.
 * apex -> A, everything else -> CNAME.
 */
export function requiredRecords(domain, config, rootDomain) {
  // The API returns FQDNs with a trailing dot ("cname.vercel-dns.com."). GoDaddy
  // and Namecheap both reject that, so strip it.
  const undot = (s) => String(s).replace(/\.$/, "");
  if (domain === rootDomain) {
    const raw = config?.recommendedIPv4?.[0]?.value ?? "76.76.21.21";
    return [{ name: "@", type: "A", value: undot(Array.isArray(raw) ? raw[0] : raw) }];
  }
  const cname = config?.recommendedCNAME?.[0]?.value ?? "cname.vercel-dns.com";
  return [{ name: domain.slice(0, -(rootDomain.length + 1)), type: "CNAME", value: undot(cname) }];
}
