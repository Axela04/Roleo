# Test Plan (Minimum MVP)

## Unit
- Ranking score calculation
- Plan limit gate logic
- AI output validator (no hallucinated entities)

## Integration
- Authenticated CRUD for profile/jobs/applications with RLS-aware test users
- Stripe webhook updates subscription + usage counters
- Ingestion worker upsert dedupe logic

## End-to-End (Playwright)
1. Sign up/login
2. Fill profile + upload resume
3. Ingest jobs + import manual job
4. Generate tailored resume
5. Create Apply Kit and mark applied
6. Check CRM stage transition and alert creation

## Coverage target
- Backend services/helpers: >=70%
- Critical policy checks and billing middleware: 100% branch coverage for happy/blocked paths
