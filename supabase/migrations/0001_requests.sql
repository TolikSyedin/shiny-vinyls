create type request_status as enum ('new', 'contacted', 'in_progress', 'done', 'cancelled');

create table requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  comment text,
  status request_status not null default 'new',
  telegram_chat_id text,
  created_at timestamptz not null default now()
);

create table request_audit_log (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests (id) on delete cascade,
  old_status request_status not null,
  new_status request_status not null,
  changed_at timestamptz not null default now()
);

-- security definer: the log is system-maintained, not client-writable, so the
-- trigger runs as its owner rather than requiring an insert grant on
-- request_audit_log for every role that's allowed to update requests.
create function log_request_status_change() returns trigger
  security definer
  set search_path = public
as $$
begin
  insert into request_audit_log (request_id, old_status, new_status)
  values (new.id, old.status, new.status);
  return new;
end;
$$ language plpgsql;

create trigger requests_status_change
  after update on requests
  for each row
  when (old.status is distinct from new.status)
  execute function log_request_status_change();

alter table requests enable row level security;
alter table request_audit_log enable row level security;

create policy "anon can insert requests"
  on requests for insert
  to anon
  with check (true);

create policy "authenticated can select requests"
  on requests for select
  to authenticated
  using (true);

create policy "authenticated can update requests"
  on requests for update
  to authenticated
  using (true);

create policy "authenticated can select request_audit_log"
  on request_audit_log for select
  to authenticated
  using (true);

-- RLS policies only govern row visibility; Postgres still checks base table
-- privileges first (and service_role, despite BYPASSRLS, needs them too).
-- No select grant for anon: there's no matching select policy (by design),
-- and granting select would only enable PostgREST's return=representation
-- to fail loudly instead of just being unavailable.
-- The app generates the row id client-side and inserts with return=minimal.
grant insert on requests to anon;
grant select, insert, update on requests to authenticated;
grant select, insert, update on requests to service_role;

grant select on request_audit_log to authenticated;
grant select on request_audit_log to service_role;
