/** Shapes the dashboard reads. Kept hand-written and narrow on purpose. */

export type SiteStatus =
  | "draft" | "scraping" | "building" | "built"
  | "deploying" | "live" | "failed" | "archived";

export type SiteOverview = {
  id: string;
  slug: string;
  name: string;
  source_url: string | null;
  brief: string | null;
  status: SiteStatus;

  github_repo_url: string | null;
  github_repo_created: boolean;
  vercel_project: string | null;
  vercel_project_created: boolean;
  vercel_scope: string | null;
  preview_url: string | null;
  live_url: string | null;
  is_deployed: boolean;
  domain: string | null;
  domain_added: boolean;
  dns_written: boolean;
  dns_verified: boolean;
  factory_stripped: boolean;

  section_count: number;
  page_count: number;
  image_count: number;

  created_by: string | null;
  created_at: string;
  updated_at: string;
  first_deployed_at: string | null;
  last_deployed_at: string | null;

  latest_run_id: string | null;
  latest_run_status: "running" | "succeeded" | "failed" | "cancelled" | null;
  latest_run_started: string | null;
  latest_run_finished: string | null;
  latest_run_seconds: number | null;
  within_budget: boolean | null;
  latest_deploy_url: string | null;
  latest_deploy_status: string | null;
  current_layout_code: string | null;
  current_layout_sections: number;
};

export type RunEvent = {
  id: string;
  run_id: string;
  phase: string;
  status: "running" | "ok" | "warn" | "failed" | "skipped";
  detail: Record<string, unknown>;
  started_at: string;
  ended_at: string | null;
  duration_ms: number | null;
};
