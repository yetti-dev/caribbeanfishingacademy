-- ============================================================================
--  Run the workers on a schedule, so nobody has to click
-- ============================================================================
--  Steps for one site are strictly ordered, so a single site advances one step
--  per tick. Ticking every minute means a full 10 step provision completes on its
--  own in roughly the time the Vercel build takes, with no clicking.
--
--  The tick secret is NOT written into this migration. It lives in Vault, so the
--  value is not in git and not in the cron job definition that any dashboard
--  viewer can read.
--
--  BEFORE running this, store the secret once:
--
--    select vault.create_secret('<your TICK_SECRET>', 'tick_secret');
--
--  And the project URL, so the job does not hardcode a ref:
--
--    select vault.create_secret('https://<ref>.supabase.co', 'functions_base_url');
-- ============================================================================

create extension if not exists pg_cron;
create extension if not exists pg_net;

/**
 * Fire one worker. SECURITY DEFINER because it reads Vault, and locked down to
 * postgres so it cannot be called from the API to spam the workers.
 */
create or replace function run_factory_worker(fn text)
returns bigint
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  base   text;
  secret text;
  req_id bigint;
begin
  select decrypted_secret into base   from vault.decrypted_secrets where name = 'functions_base_url';
  select decrypted_secret into secret from vault.decrypted_secrets where name = 'tick_secret';
  if base is null or secret is null then
    raise exception 'store functions_base_url and tick_secret in Vault first';
  end if;

  -- Fire and forget. pg_net is async, so a slow worker cannot block the cron
  -- transaction and back up the scheduler.
  select net.http_post(
    url     := base || '/functions/v1/' || fn,
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-tick-secret', secret),
    body    := '{}'::jsonb,
    timeout_milliseconds := 55000
  ) into req_id;
  return req_id;
end $$;

revoke all on function run_factory_worker(text) from public, anon, authenticated;

-- Replace rather than duplicate if this migration is run twice.
select cron.unschedule('provision-tick') where exists (select 1 from cron.job where jobname = 'provision-tick');
select cron.unschedule('scrape-tick')    where exists (select 1 from cron.job where jobname = 'scrape-tick');

--  Every minute: fast enough that a 10 step provision finishes unattended,
--  slow enough that an idle factory costs almost nothing (a tick with no due work
--  returns claimed:0 immediately).
select cron.schedule('provision-tick', '* * * * *', $$select run_factory_worker('provision-tick')$$);

--  Scraping claims 3 pages a tick, so every 2 minutes walks a 14 page site in
--  about 10 minutes without hammering the source.
select cron.schedule('scrape-tick', '*/2 * * * *', $$select run_factory_worker('scrape-tick')$$);
