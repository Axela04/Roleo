# Frontend Preview Runbook

When package installation is blocked in restricted CI/sandbox environments, run the static preview:

```bash
cd apps/web/preview
python3 -m http.server 3000
```

Open `http://127.0.0.1:3000` to view the MVP UI shell.

> In normal environments, use the full Next.js app:
>
> ```bash
> npm install
> npm run dev:web
> ```
