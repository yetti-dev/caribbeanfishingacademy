-- ============================================================================
--  Scheduler visibility
-- ============================================================================
--  pg_cron and Vault live in schemas PostgREST does not expose, so there is no way
--  to see from the app whether the scheduler is actually running. Without that,
--  "it is scheduled" is a belief rather than a fact.
--
--  This exposes a read-only status function so the dashboard, and anyone
--  debugging, can see: are the jobs registered, did they run, did the HTTP call
--  succeed, and are the Vault secrets present.
-- ============================================================================

create or replace function factory_scheduler_status()
returns jsonb
language plpgsql
security definer
set search_path = public, cron, vault, net
as $$
declare
  jobs        jsonb;
  runs        jsonb;
  secrets     jsonb;
  responses   jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
           'name', jobname, 'schedule', schedule, 'active', active)), '[]'::jsonb)
    into jobs
  from cron.job
  where jobname in ('provision-tick', 'scrape-tick');

  select coalesce(jsonb_agg(x), '[]'::jsonb) into runs from (
    select jsonb_build_object(
             'name', j.jobname, 'status', r.status,
             'started', r.start_time, 'message', left(coalesce(r.return_message, ''), 160)) as x
    from cron.job_run_details r
    join cron.job j on j.jobid = r.jobid
    where j.jobname in ('provision-tick', 'scrape-tick')
    order by r.start_time desc
    limit 10
  ) t;

  -- Names only. Never return the values.
  select coalesce(jsonb_agg(name order by name), '[]'::jsonb) into secrets
  from vault.secrets
  where name in ('tick_secret', 'functions_base_url');

  -- The HTTP result matters as much as the cron result: cron can report success
  -- while every request 401s.
  select coalesce(jsonb_agg(x), '[]'::jsonb) into responses from (
    select jsonb_build_object('status', status_code, 'at', created,
                             'body', left(coalesce(content, ''), 120)) as x
    from net._http_response
    order by created desc
    limit 6
  ) t;

  return jsonb_build_object(
    'jobs', jobs,
    'secrets_present', secrets,
    'recent_cron_runs', runs,
    'recent_http_responses', responses,
    'checked_at', now()
  );
exception when others then
  -- A missing extension or schema must report itself, not 500 the caller.
  return jsonb_build_object('error', SQLERRM, 'checked_at', now());
end $$;

revoke all on function factory_scheduler_status() from public, anon;
grant execute on function factory_scheduler_status() to authenticated, service_role;
