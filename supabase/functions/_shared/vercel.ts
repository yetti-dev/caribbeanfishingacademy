/**
 * Vercel client for provisioning.
 *
 * teamId is pinned on every call. The CLI silently falls back to whatever scope
 * is cached locally, which is how a deploy lands in the wrong team; the REST API
 * has no such fallback, so passing it explicitly is the fix.
 */
import { HttpError, request } from "./http.ts";

const API = "https://api.vercel.com";

export type DeployState = "QUEUED" | "BUILDING" | "READY" | "ERROR" | "CANCELED" | "INITIALIZING";

export class Vercel {
  constructor(private token: string, private teamId?: string) {}

  private call<T>(method: string, path: string, body?: unknown) {
    const url = new URL(API + path);
    if (this.teamId) url.searchParams.set("teamId", this.teamId);
    return request<T>(url.toString(), {
      method,
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async resolveTeam(slug?: string) {
    if (!slug) return undefined;
    const { teams } = await this.call<{ teams: { id: string; slug: string }[] }>("GET", "/v2/teams");
    const hit = teams.find((t) => t.slug === slug);
    if (!hit) throw new Error(`Vercel scope "${slug}" is not visible to this token`);
    return hit.id;
  }

  async getProject(name: string) {
    try {
      return await this.call<{ id: string; name: string }>("GET", `/v9/projects/${encodeURIComponent(name)}`);
    } catch (e) {
      if (e instanceof HttpError && e.status === 404) return null;
      throw e;
    }
  }

  /**
   * Create the project WITH the git repo linked, so every later push
   * auto-deploys. That link is the whole point: after provisioning, the build
   * step is just a push.
   */
  async ensureProject(name: string, repo: string) {
    const existing = await this.getProject(name);
    if (existing) return { project: existing, created: false };
    const project = await this.call<{ id: string; name: string }>("POST", "/v11/projects", {
      name,
      framework: "nextjs",
      gitRepository: { type: "github", repo },
    });
    return { project, created: true };
  }

  async setEnv(projectId: string, key: string, value: string) {
    const { envs } = await this.call<{ envs: { id: string; key: string }[] }>("GET", `/v10/projects/${projectId}/env`);
    for (const e of envs.filter((e) => e.key === key)) {
      await this.call("DELETE", `/v9/projects/${projectId}/env/${e.id}`);
    }
    await this.call("POST", `/v10/projects/${projectId}/env`, {
      key,
      value,
      type: "encrypted",
      target: ["production", "preview", "development"],
    });
  }

  /** Trigger a production build from a git ref. */
  async deployFromGit(opts: { name: string; repoId: number | string; ref: string }) {
    return this.call<{ id: string; url: string; readyState?: DeployState }>("POST", "/v13/deployments", {
      name: opts.name,
      target: "production",
      gitSource: { type: "github", repoId: opts.repoId, ref: opts.ref },
    });
  }

  getDeployment = (id: string) =>
    this.call<{ id: string; url: string; readyState: DeployState; errorMessage?: string }>("GET", `/v13/deployments/${id}`);

  async latestProduction(projectId: string) {
    const r = await this.call<{ deployments: { uid: string; url: string; state: DeployState; target: string }[] }>(
      "GET",
      `/v6/deployments?projectId=${projectId}&target=production&limit=1`,
    );
    return r.deployments?.[0] ?? null;
  }

  async addDomain(projectId: string, name: string) {
    try {
      return await this.call<{ name: string }>("POST", `/v10/projects/${projectId}/domains`, { name });
    } catch (e) {
      // Already attached to THIS project is success. Attached elsewhere is not.
      if (e instanceof HttpError && (e.status === 409 || /already/i.test(e.message))) {
        const { domains } = await this.call<{ domains: { name: string }[] }>("GET", `/v9/projects/${projectId}/domains`);
        if (domains.some((d) => d.name === name)) return { name, alreadyAttached: true };
      }
      throw e;
    }
  }

  /** Project level domain record, which carries the `verified` flag. */
  projectDomain = (projectId: string, domain: string) =>
    this.call<{ name: string; verified: boolean; verification?: { type: string; domain: string; value: string }[] }>(
      "GET", `/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}`);

  /**
   * Ask Vercel to verify the domain on the project. Returns the challenge when it
   * cannot, which is the TXT record that has to exist first.
   */
  async verifyProjectDomain(projectId: string, domain: string) {
    try {
      const r = await this.call<{ verified: boolean }>(
        "POST", `/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}/verify`);
      return { verified: Boolean(r.verified), challenge: null as string | null };
    } catch (e) {
      const msg = e instanceof HttpError ? e.message : String(e);
      const value = msg.match(/vc-domain-verify=([^"\s]+)/)?.[1];
      return { verified: false, challenge: value ? `vc-domain-verify=${value}` : null };
    }
  }

  /**
   * Ask Vercel what DNS record THIS domain needs. Newer projects get anycast IPs
   * like 216.198.79.1 and per-project CNAMEs like xyz.vercel-dns-016.com, so
   * hardcoding 76.76.21.21 writes a dead record.
   */
  domainConfig = (domain: string) =>
    this.call<{
      misconfigured: boolean;
      serviceType?: string;
      nameservers?: string[];
      recommendedIPv4?: { value: string[] }[];
      recommendedCNAME?: { value: string }[];
    }>("GET", `/v6/domains/${encodeURIComponent(domain)}/config`);
}

/** apex -> A, anything else -> CNAME. Trailing dots stripped for registrars. */
export function requiredRecord(domain: string, zone: string, config: {
  recommendedIPv4?: { value: string[] }[];
  recommendedCNAME?: { value: string }[];
}) {
  const undot = (s: string) => s.replace(/\.$/, "");
  if (domain === zone) {
    const ip = config.recommendedIPv4?.[0]?.value?.[0] ?? "76.76.21.21";
    return { name: "@", type: "A" as const, value: undot(ip) };
  }
  const cname = config.recommendedCNAME?.[0]?.value ?? "cname.vercel-dns.com";
  return { name: domain.slice(0, -(zone.length + 1)), type: "CNAME" as const, value: undot(cname) };
}
