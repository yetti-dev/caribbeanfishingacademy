-- ============================================================================
--  Provisioning queue + scraped asset tracking
-- ============================================================================
--  Provisioning is a state machine, one step per invocation, because an Edge
--  Function has an execution ceiling and "attach the domain then poll until DNS
--  verifies" can take hours. A single long-running function would time out with
--  no record of how far it got.
--
--  Steps run in order for one site, and many sites run in parallel. Claiming
--  uses FOR UPDATE SKIP LOCKED so two ticks can never take the same job.
-- ============================================================================

-- ── the ordered pipeline ────────────────────────────────────────────────────
create table if not exists provision_jobs (
  id              uuid primary key default gen_random_uuid(),
  site_id         uuid not null references sites (id) on delete cascade,
  step            text not null check (step in (
                    'repo',          -- generate from the GitHub template
                    'strip',         -- remove factory tooling from the client repo
                    'holding',       -- commit the coming soon page
                    'vercel_project',-- create the project, linked to the repo
                    'deploy',        -- trigger production
                    'deploy_wait',   -- poll until READY
                    'domain',        -- attach to the Vercel project
                    'dns',           -- write the record at the registrar
                    'dns_verify',    -- poll until Vercel stops calling it misconfigured
                    'smoke'          -- GET the domain and expect 200, never a 404
                  )),
  position        integer not null,
  status          text not null default 'pending'
                    check (status in ('pending','running','done','failed','skipped')),
  attempts        integer not null default 0,
  max_attempts    integer not null default 6,
  next_attempt_at timestamptz not null default now(),
  -- a claim lease, so a tick that dies mid-step releases the job
  locked_by       text,
  locked_at       timestamptz,
  lease_until     timestamptz,
  payload         jsonb not null default '{}'::jsonb,
  result          jsonb not null default '{}'::jsonb,
  error           text,
  started_at      timestamptz,
  finished_at     timestamptz,
  duration_ms     integer generated always as (
                    case when finished_at is null or started_at is null then null
                         else (extract(epoch from (finished_at - started_at)) * 1000)::int end
                  ) stored,
  created_at      timestamptz not null default now(),
  -- one row per step per site: makes the whole pipeline idempotent to enqueue
  unique (site_id, step)
);
create index if not exists provision_due_idx
  on provision_jobs (next_attempt_at)
  where status in ('pending', 'running');
create index if not exists provision_site_idx on provision_jobs (site_id, position);

-- ── scraped assets ─────────────────────────────────────────────────────────
--  An Edge Function can discover image URLs but cannot resize: sharp is a native
--  binary and Deno Edge has no equivalent. So a row starts as a URL and is
--  promoted to a stored object once something with sharp has processed it.
create table if not exists assets (
  id            uuid primary key default gen_random_uuid(),
  site_id       uuid not null references sites (id) on delete cascade,
  source_url    text not null,
  storage_path  text,                -- site-assets/<slug>/<file>, null until stored
  kind          text not null default 'image' check (kind in ('image','video','logo','favicon')),
  alt           text,
  width         integer,
  height        integer,
  bytes         integer,
  sha256        text,
  status        text not null default 'discovered'
                  check (status in ('discovered','stored','skipped','failed')),
  skip_reason   text,
  created_at    timestamptz not null default now(),
  -- the same photo found on three pages is one asset
  unique (site_id, source_url)
);
create index if not exists assets_site_idx on assets (site_id, status);

-- ── claiming work ───────────────────────────────────────────────────────────
--  SKIP LOCKED is the whole point: concurrent ticks take different jobs instead
--  of blocking on each other or doubling up.
create or replace function claim_provision_jobs(worker text, batch integer default 5, lease_seconds integer default 120)
returns setof provision_jobs
language plpgsql
security definer set search_path = public
as $$
begin
  return query
  with due as (
    select j.id
    from provision_jobs j
    join sites s on s.id = j.site_id
    where j.status = 'pending'
      and j.next_attempt_at <= now()
      and j.attempts < j.max_attempts
      -- steps are ordered: never start one while an earlier step is unfinished
      and not exists (
        select 1 from provision_jobs prev
        where prev.site_id = j.site_id
          and prev.position < j.position
          and prev.status not in ('done', 'skipped')
      )
    order by j.next_attempt_at, j.position
    limit batch
    for update of j skip locked
  )
  update provision_jobs u
  set status = 'running',
      attempts = u.attempts + 1,
      locked_by = worker,
      locked_at = now(),
      lease_until = now() + make_interval(secs => lease_seconds),
      started_at = coalesce(u.started_at, now())
  from due
  where u.id = due.id
  returning u.*;
end $$;

--  Release jobs whose worker died mid-step, so the pipeline self-heals instead
--  of stalling on a lease nobody will ever complete.
create or replace function reap_stale_provision_jobs()
returns integer
language sql security definer set search_path = public
as $$
  with reaped as (
    update provision_jobs
    set status = 'pending',
        locked_by = null, locked_at = null, lease_until = null,
        next_attempt_at = now() + make_interval(secs => 30 * attempts),
        error = coalesce(error, 'lease expired, retrying')
    where status = 'running' and lease_until < now()
    returning 1
  )
  select count(*)::int from reaped;
$$;

-- ── enqueue the whole pipeline for a site ───────────────────────────────────
create or replace function enqueue_provisioning(p_site_id uuid)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  steps text[] := array['repo','strip','holding','vercel_project','deploy','deploy_wait','domain','dns','dns_verify','smoke'];
  i integer;
  added integer := 0;
begin
  for i in 1 .. array_length(steps, 1) loop
    -- on conflict do nothing: enqueueing twice must not duplicate the pipeline
    insert into provision_jobs (site_id, step, position)
    values (p_site_id, steps[i], i)
    on conflict (site_id, step) do nothing;
    if found then added := added + 1; end if;
  end loop;
  update sites set status = 'draft' where id = p_site_id and status = 'draft';
  return added;
end $$;

-- ── claim a site for scraping, so two Claude sessions cannot collide ────────
-- Columns first: the function below reads them, and a plpgsql body is not parsed
-- at creation time, so a missing column would surface only on the first call.
alter table sites add column if not exists scrape_claimed_by  text;
alter table sites add column if not exists scrape_lease_until timestamptz;

create or replace function claim_site_for_scrape(worker text, lease_seconds integer default 900)
returns setof sites
language plpgsql security definer set search_path = public
as $$
begin
  return query
  with pick as (
    select s.id from sites s
    where s.status = 'draft'
      and s.source_url is not null
      and (s.scrape_lease_until is null or s.scrape_lease_until < now())
    order by s.created_at
    limit 1
    for update skip locked
  )
  update sites u
  set status = 'scraping',
      scrape_claimed_by = worker,
      scrape_lease_until = now() + make_interval(secs => lease_seconds)
  from pick
  where u.id = pick.id
  returning u.*;
end $$;

-- ── provisioning progress, for the dashboard ────────────────────────────────
create or replace view provision_progress as
select
  s.id   as site_id,
  s.slug,
  s.name,
  count(j.id)                                             as steps_total,
  count(*) filter (where j.status = 'done')               as steps_done,
  count(*) filter (where j.status = 'failed')             as steps_failed,
  min(j.position) filter (where j.status in ('pending','running')) as current_position,
  (array_agg(j.step order by j.position)
     filter (where j.status in ('pending','running')))[1] as current_step,
  (array_agg(j.error order by j.position desc)
     filter (where j.error is not null))[1]               as last_error,
  sum(j.duration_ms)                                     as total_ms
from sites s
left join provision_jobs j on j.site_id = s.id
group by s.id, s.slug, s.name;

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table provision_jobs enable row level security;
alter table assets         enable row level security;

drop policy if exists member_read on provision_jobs;
create policy member_read on provision_jobs
  for select to authenticated using (is_factory_member());

drop policy if exists member_read on assets;
create policy member_read on assets
  for select to authenticated using (is_factory_member());

-- Workers run as the service role, which bypasses RLS, so these functions must
-- not be callable by a browser: they mutate the queue.
revoke all on function claim_provision_jobs(text, integer, integer) from public, anon, authenticated;
revoke all on function reap_stale_provision_jobs() from public, anon, authenticated;
revoke all on function claim_site_for_scrape(text, integer) from public, anon, authenticated;
-- Enqueue is safe for a signed-in member: it only adds rows for a site that exists.
revoke all on function enqueue_provisioning(uuid) from public, anon;
grant execute on function enqueue_provisioning(uuid) to authenticated;
