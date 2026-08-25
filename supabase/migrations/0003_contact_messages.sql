create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

create policy "anon can insert contact_messages"
  on contact_messages for insert
  to anon
  with check (true);

create policy "authenticated can select contact_messages"
  on contact_messages for select
  to authenticated
  using (true);

create policy "authenticated can update contact_messages"
  on contact_messages for update
  to authenticated
  using (true);

-- No select grant for anon: same reasoning as requests/reviews — there's no
-- matching select policy, and nothing on the site reads these back for anon.
grant insert on contact_messages to anon;
grant select, insert, update on contact_messages to authenticated;
grant select, insert, update on contact_messages to service_role;
