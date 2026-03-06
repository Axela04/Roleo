# Roleo MVP

Production-focused MVP SaaS for AI-assisted job applications and career management.

## Stack
- **Frontend:** Next.js + TypeScript + Tailwind (deploy to Vercel)
- **Backend API + Workers:** Node.js + Fastify on Render
- **DB/Auth/Storage:** Supabase Postgres + Auth + Storage + RLS
- **Vector search:** pgvector in Supabase
- **Queue/Rate limits:** Upstash Redis
- **Payments:** Stripe subscriptions
- **AI:** Claude Opus (primary) with strict anti-hallucination validation

See `docs/` for architecture, API, deployment, and testing details.
