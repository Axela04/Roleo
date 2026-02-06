# Roleo REST API Spec (MVP)

Base URL: `/v1`
Auth: `Authorization: Bearer <supabase_jwt>`

## Auth/User
- `GET /me` → profile + plan + counters
- `PATCH /me/preferences`

## Profile Hub
- `GET /profile`
- `PUT /profile`
- `POST /documents/upload-url`
- `POST /resume-versions`
- `POST /cover-letters`
- `POST /versions/:id/rollback`

### Example: create upload URL
```json
POST /v1/documents/upload-url
{
  "kind": "master_resume",
  "filename": "resume.pdf",
  "contentType": "application/pdf"
}
```
Response:
```json
{
  "path": "users/uuid/resumes/1700000000-resume.pdf",
  "signedUploadUrl": "https://...",
  "expiresIn": 300
}
```

## Jobs
- `GET /jobs?since=24h&query=product%20manager&location=remote`
- `POST /jobs/import-link`
- `POST /jobs/import-manual`
- `POST /jobs/:id/favorite`

## Matching + AI
- `POST /jobs/:id/tailor` (queues task)
- `GET /tailor-tasks/:id`
- `GET /jobs/:id/networking-suggestions`

## Apply Kit + CRM
- `POST /jobs/:id/apply-kit`
- `GET /apply-kits/:id`
- `POST /applications`
- `PATCH /applications/:id/status`
- `GET /applications?status=Interview`

## Alerts
- `GET /alerts`
- `PATCH /alerts/:id/read`

## Stripe
- `POST /billing/checkout`
- `POST /billing/portal`
- `POST /billing/webhook` (public route)

## Admin
- `GET /admin/users`
- `GET /admin/ingestion-health`
- `GET /admin/audit-logs`
- `GET /admin/prompt-versions`
