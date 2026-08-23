/**
 * GitHub client for provisioning.
 *
 * Every method is idempotent: a retried step must be a no-op, because the queue
 * will retry on any transport hiccup.
 */
import { HttpError, pool, request } from "./http.ts";

const API = "https://api.github.com";

/** `id` matters: Vercel's deployment API wants repoId, not owner/name. */
export type Repo = {
  id: number;
  full_name: string;
  default_branch: string;
  html_url: string;
  clone_url: string;
};

export class GitHub {
  constructor(private token: string) {}

  private headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    };
  }

  private call<T>(method: string, path: string, body?: unknown) {
    return request<T>(`${API}${path}`, {
      method,
      headers: this.headers(),
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  whoami = () => this.call<{ login: string }>("GET", "/user");

  async getRepo(owner: string, repo: string) {
    try {
      return await this.call<Repo>("GET", `/repos/${owner}/${repo}`);
    } catch (e) {
      if (e instanceof HttpError && e.status === 404) return null;
      throw e;
    }
  }

  /**
   * Copy the whole starter in ONE call. Much better than pushing files: the
   * template already carries the section library, the token system and the
   * widgets. Measured at 5.4s including waiting for the tree to populate.
   */
  async generateFromTemplate(opts: {
    templateOwner: string;
    templateRepo: string;
    owner: string;
    name: string;
    private?: boolean;
    description?: string;
  }) {
    const existing = await this.getRepo(opts.owner, opts.name);
    if (existing) return { repo: existing, created: false };
    const repo = await this.call<Repo>(
      "POST",
      `/repos/${opts.templateOwner}/${opts.templateRepo}/generate`,
      {
        owner: opts.owner,
        name: opts.name,
        private: opts.private ?? true,
        description: opts.description ?? "",
        include_all_branches: false,
      },
    );
    return { repo, created: true };
  }

  /** Wait until the generated tree actually has files in it. */
  async waitForTree(owner: string, repo: string, branch: string, timeoutMs = 30_000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      try {
        const tree = await this.listTree(owner, repo, branch);
        if (tree.length) return tree;
      } catch { /* the ref may not exist yet */ }
      await new Promise((r) => setTimeout(r, 1000));
    }
    throw new Error(`${owner}/${repo}: tree still empty after ${timeoutMs}ms`);
  }

  async headSha(owner: string, repo: string, branch: string) {
    const ref = await this.call<{ object: { sha: string } }>("GET", `/repos/${owner}/${repo}/git/ref/heads/${branch}`);
    return ref.object.sha;
  }

  async listTree(owner: string, repo: string, ref: string) {
    const t = await this.call<{ tree: { path: string; type: string; sha: string }[] }>(
      "GET",
      `/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`,
    );
    return (t.tree ?? []).filter((x) => x.type === "blob");
  }

  /**
   * Delete paths in one commit. Deleting through the trees API means sha:null on
   * top of base_tree; there is no separate delete endpoint.
   */
  async deletePaths(owner: string, repo: string, branch: string, paths: string[], message: string) {
    if (!paths.length) return { skipped: true as const, commit: null };
    const head = await this.headSha(owner, repo, branch);
    const tree = await this.call<{ sha: string }>("POST", `/repos/${owner}/${repo}/git/trees`, {
      base_tree: head,
      tree: paths.map((p) => ({ path: p, mode: "100644", type: "blob", sha: null })),
    });
    const commit = await this.call<{ sha: string }>("POST", `/repos/${owner}/${repo}/git/commits`, {
      message,
      tree: tree.sha,
      parents: [head],
    });
    await this.call("PATCH", `/repos/${owner}/${repo}/git/refs/heads/${branch}`, { sha: commit.sha });
    return { skipped: false as const, commit: commit.sha };
  }

  /**
   * Commit a set of files. Text goes inline in the tree, which is why a whole
   * site is a handful of calls; binaries need a blob each, uploaded in parallel.
   */
  async commitFiles(
    owner: string,
    repo: string,
    branch: string,
    files: { path: string; content: string; encoding?: "utf-8" | "base64" }[],
    message: string,
    opts: { replaceTree?: boolean } = {},
  ) {
    const head = await this.headSha(owner, repo, branch);
    const binaries = files.filter((f) => f.encoding === "base64");
    const texts = files.filter((f) => f.encoding !== "base64");

    const blobs = await pool(binaries, 8, async (f) => {
      const blob = await this.call<{ sha: string }>("POST", `/repos/${owner}/${repo}/git/blobs`, {
        content: f.content,
        encoding: "base64",
      });
      return { path: f.path, sha: blob.sha };
    });

    const tree = await this.call<{ sha: string }>("POST", `/repos/${owner}/${repo}/git/trees`, {
      ...(opts.replaceTree ? {} : { base_tree: head }),
      tree: [
        ...texts.map((f) => ({ path: f.path, mode: "100644", type: "blob", content: f.content })),
        ...blobs.map((b) => ({ path: b.path, mode: "100644", type: "blob", sha: b.sha })),
      ],
    });
    const commit = await this.call<{ sha: string }>("POST", `/repos/${owner}/${repo}/git/commits`, {
      message,
      tree: tree.sha,
      parents: [head],
    });
    await this.call("PATCH", `/repos/${owner}/${repo}/git/refs/heads/${branch}`, { sha: commit.sha, force: true });
    return commit.sha;
  }
}
