create type public.user_role as enum ('ADMIN', 'AGENT', 'RESELLER');
create type public.extension_status as enum ('ONLINE', 'OFFLINE');
create type public.device_type as enum ('MOBILE_APP', 'WEB', 'SOFTPHONE');
create type public.campaign_type as enum ('BULK_VOICE_CALL', 'BULK_SMS', 'AI_SEQUENCE');
create type public.call_provider as enum ('RETELL', 'DEMO');
create type public.call_session_status as enum ('REGISTERED', 'ONGOING', 'ENDED', 'ERROR');
create type public.compliance_event_type as enum ('RECORDING_CONSENT', 'DNC_CHECK', 'CALL_JOIN', 'CALL_END');

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email text,
  phone text,
  full_name text,
  role public.user_role not null default 'AGENT',
  created_at timestamptz not null default now()
);

create table public.extensions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  number text not null,
  department text not null,
  device_type public.device_type not null,
  status public.extension_status not null default 'OFFLINE',
  created_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  type public.campaign_type not null,
  numbers text[] not null default '{}',
  script text not null,
  scheduled_at timestamptz,
  total_sent integer not null default 0,
  connected integer not null default 0,
  hot_lead_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.hot_leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  name text,
  phone text not null,
  interest text not null,
  source text not null,
  score integer not null default 80,
  created_at timestamptz not null default now()
);

create table public.ivr_flows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  nodes jsonb not null default '[]',
  edges jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.call_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  provider public.call_provider not null default 'RETELL',
  provider_call_id text,
  agent_id text,
  access_token_preview text,
  caller_name text,
  caller_phone text,
  department text,
  status public.call_session_status not null default 'REGISTERED',
  consent_given boolean not null default false,
  dnc_blocked boolean not null default false,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.compliance_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  call_session_id uuid references public.call_sessions(id) on delete set null,
  event_type public.compliance_event_type not null,
  phone_hash text,
  consent_given boolean,
  dnc_blocked boolean,
  details jsonb,
  created_at timestamptz not null default now()
);

create table public.dnc_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  phone_hash text not null,
  reason text,
  created_at timestamptz not null default now(),
  unique (tenant_id, phone_hash)
);

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.extensions enable row level security;
alter table public.campaigns enable row level security;
alter table public.hot_leads enable row level security;
alter table public.ivr_flows enable row level security;
alter table public.call_sessions enable row level security;
alter table public.compliance_logs enable row level security;
alter table public.dnc_entries enable row level security;

create policy "Tenant members can read tenant rows" on public.tenants
for select using (id in (select tenant_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can read profiles in tenant" on public.profiles
for select using (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()));

create policy "Tenant CRUD extensions" on public.extensions
for all using (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()))
with check (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()));

create policy "Tenant CRUD campaigns" on public.campaigns
for all using (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()))
with check (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()));

create policy "Tenant CRUD hot leads" on public.hot_leads
for all using (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()))
with check (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()));

create policy "Tenant CRUD ivr flows" on public.ivr_flows
for all using (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()))
with check (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()));

create policy "Tenant CRUD call sessions" on public.call_sessions
for all using (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()))
with check (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()));

create policy "Tenant read compliance logs" on public.compliance_logs
for select using (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()));

create policy "Tenant CRUD dnc entries" on public.dnc_entries
for all using (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()))
with check (tenant_id in (select tenant_id from public.profiles where profiles.id = auth.uid()));
