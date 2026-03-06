# Deployment Guide

## Vercel (apps/web)
1. Import repo and set root to `apps/web`.
2. Set env:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL`
3. Deploy production branch.

## Render (apps/api)
1. Create Web Service from `apps/api`.
2. Build: `npm install && npm run build`
3. Start: `npm run start`
4. Env:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `CLAUDE_API_KEY`, `SERPAPI_KEY`, `APP_BASE_URL`

## Render Workers (apps/workers)
- Create Background Worker service.
- Start: `npm run start`
- Same env vars as API plus `WORKER_MODE` (`ingestion|alerts|ai`).

## Supabase
1. Enable Auth providers: Email + Google OAuth.
2. Create private buckets: `documents`, `apply-kits`.
3. Apply migration: `supabase/migrations/0001_init.sql`.
4. Enable `pgvector` extension.

## Stripe
- Create products/plans:
  - Launch $29 (10 applications/week)
  - Advance $59 (15)
  - Accelerate $109 (25)
  - Executive $249 (50)
- Configure webhook to `POST /v1/billing/webhook`.

## Replit Console
- Deploy `replit-console` as internal-only static app.
- Add `ROLEO_API_URL` and `ROLEO_ADMIN_TOKEN` env vars.
