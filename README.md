# Elite Venture Properties — Contract Renewal Notifier

Luxury woody-themed Next.js app for Elite Venture Properties. Team uploads PDF scan + sets rental end date. Cron fires Resend warning emails (parchment + walnut + brushed gold) to admin + renter at 30/14/7/1 days before expiry.

**Theme:** walnut sidebar, parchment cream main, brushed gold accents, Playfair Display serif headings.

## Stack
- Next.js 16 (App Router)
- Supabase (Postgres + Storage bucket `contracts`)
- Resend (email)
- Tailwind v4
- Vercel Cron

## Setup

```bash
cp .env.example .env.local
npm install
```

Fill `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `ADMIN_EMAIL`, `FROM_EMAIL`
- `CRON_SECRET` (random string; Vercel auto-passes as `Authorization: Bearer ...`)
- `WARNING_DAYS=30,14,7,1`

### Supabase
1. Run `supabase/schema.sql` in SQL editor.
2. Create private storage bucket: `contracts`.

### Run locally
```bash
npm run dev          # http://localhost:3030
```

### Trigger cron manually
```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3030/api/cron/check-expiring
```

## Routes
- `/` dashboard (list, filter expiring)
- `/new` upload form
- `POST /api/contracts` create + upload PDF
- `GET /api/contracts/file?path=...` signed URL redirect
- `GET /api/cron/check-expiring` daily 09:00 UTC (Vercel)

## Deploy
Push to Vercel. Cron runs daily at 09:00 UTC per `vercel.json`.
