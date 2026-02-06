# Roleo MVP Architecture

## 1) Services and Responsibilities
- **Vercel / Next.js Web (`apps/web`)**
  - Authenticated product UI (Profile Hub, Jobs, Apply Kit, CRM, Billing, Admin).
  - Uses Supabase Auth session + API bearer token.
- **Render API (`apps/api`)**
  - Business APIs, Stripe webhooks, signed storage URLs, ingestion controls, audit APIs.
  - Enforces RBAC and usage limits.
- **Render Workers (`apps/workers`)**
  - Scheduled ingestion (SerpAPI Google Jobs), alert fanout, async AI tailoring jobs.
- **Supabase**
  - Postgres + pgvector + RLS for tenant isolation.
  - Auth and private object storage for uploaded files and generated artifacts.
- **Upstash Redis**
  - Queue topics: `job-ingest`, `ai-tailor`, `alerts`.
  - Rate limit buckets for import/tailor endpoints.
- **Stripe**
  - Subscription plans + usage gating.

## 2) Core Data Flow
1. User signs in via Supabase Auth.
2. User creates canonical profile and uploads master docs.
3. Ingestion worker polls SerpAPI and writes normalized `jobs` + embeddings.
4. User opens job feed; API combines SQL filters + vector similarity ranking.
5. User starts tailoring; API queues AI task with immutable profile snapshot.
6. Worker calls Claude Opus with guardrails, validates changes, stores resume version + audit event.
7. User builds Apply Kit and marks application as applied.
8. Application state transitions trigger reminders + networking recommendation generation.
9. Billing middleware blocks actions beyond plan quota and prompts upgrade.

## 3) Queue Topology
- `job-ingest`: dedupe + normalize + embed jobs
- `ai-tailor`: resume/cover generation + diff validation
- `alerts`: favorite company/keyword matching + notification writes + email dispatch

## 4) Security Model
- Supabase RLS on every tenant table by `auth.uid()`.
- Admin reads gated by `app_metadata.role='admin'`.
- Private storage buckets + signed URL access.
- Immutable audit logs for uploads/downloads/AI/job/application/admin events.

## 5) MVP Assumptions
- Google Jobs via SerpAPI is primary source.
- LinkedIn/Indeed/Glassdoor are BYO-link/manual JD only.
- DOCX/PDF generation is asynchronous and optional fallback to structured markdown/text for speed.
