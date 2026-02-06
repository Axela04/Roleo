create extension if not exists vector;

create type public.app_status as enum ('Saved','Applied','Contacted','Interview','Offer','Closed');
create type public.plan_tier as enum ('launch','advance','accelerate','executive');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  full_name text,
  headline text,
  summary text,
  location text,
  skills text[] default '{}',
  experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  certifications jsonb not null default '[]'::jsonb,
  links jsonb not null default '{}'::jsonb,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.documents (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  kind text not null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table public.resume_versions (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  source_document_id bigint references public.documents(id),
  job_id bigint,
  mode text not null,
  content text not null,
  change_summary text[] default '{}',
  keyword_additions text[] default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.cover_letters (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  job_id bigint,
  mode text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.companies (
  id bigserial primary key,
  name text not null unique,
  domain text,
  created_at timestamptz not null default now()
);

create table public.jobs (
  id bigserial primary key,
  company_id bigint references public.companies(id),
  source text not null,
  source_id text,
  title text not null,
  location text,
  remote_type text,
  salary_min int,
  salary_max int,
  experience_level text,
  job_url text,
  description text,
  posted_at timestamptz,
  imported_by_user_id uuid references public.users(id),
  created_at timestamptz not null default now(),
  unique (source, source_id)
);

create table public.embeddings (
  id bigserial primary key,
  owner_type text not null check (owner_type in ('job','profile','resume')),
  owner_id bigint not null,
  user_id uuid,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);
create index on public.embeddings using ivfflat (embedding vector_cosine_ops);

create table public.applications (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  job_id bigint references public.jobs(id),
  company text not null,
  role text not null,
  source text,
  job_url text,
  status public.app_status not null default 'Saved',
  date_applied timestamptz,
  resume_version_id bigint references public.resume_versions(id),
  notes text,
  follow_up_date date,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.favorites (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  company_id bigint references public.companies(id),
  keyword text,
  created_at timestamptz not null default now()
);

create table public.alerts (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  kind text not null,
  payload jsonb not null,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  channel text not null,
  subject text,
  body text,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id bigserial primary key,
  user_id uuid not null unique references public.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  tier public.plan_tier not null default 'launch',
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.usage_counters (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  week_start date not null,
  applications_count int not null default 0,
  ai_edits_count int not null default 0,
  unique (user_id, week_start)
);

create table public.audit_logs (
  id bigserial primary key,
  user_id uuid,
  event_type text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  ip inet,
  created_at timestamptz not null default now()
);

create table public.notion_connections (
  id bigserial primary key,
  user_id uuid not null unique references public.users(id) on delete cascade,
  encrypted_token text not null,
  database_id text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.resume_versions enable row level security;
alter table public.cover_letters enable row level security;
alter table public.jobs enable row level security;
alter table public.embeddings enable row level security;
alter table public.applications enable row level security;
alter table public.favorites enable row level security;
alter table public.alerts enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_counters enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notion_connections enable row level security;

create policy "self read write users" on public.users for all using (id = auth.uid()) with check (id = auth.uid());
create policy "self profile" on public.profiles for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "self documents" on public.documents for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "self resumes" on public.resume_versions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "self cover letters" on public.cover_letters for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "jobs readable" on public.jobs for select using (auth.uid() is not null);
create policy "self embeddings" on public.embeddings for all using (user_id = auth.uid() or user_id is null) with check (user_id = auth.uid() or user_id is null);
create policy "self applications" on public.applications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "self favorites" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "self alerts" on public.alerts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "self notifications" on public.notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "self subscriptions" on public.subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "self usage" on public.usage_counters for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "self notion" on public.notion_connections for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "admin audit read" on public.audit_logs for select using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "service write audit" on public.audit_logs for insert with check (true);
