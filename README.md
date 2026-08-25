# Dark Waitlist — Next.js + Supabase + Resend

Dark-themed landing page with waitlist (Name + Email), instant queue position, confirmation email, and protected admin dashboard at `/admin`.

**Stack:** Next.js 16 (App Router) • Tailwind v4 • Supabase (Postgres) • Resend • Zod

---

## Features

- **User side `/`** — Dark landing, animated gradients, `WaitlistForm` (`src/components/WaitlistForm.tsx:1`): validates with Zod, POSTs to `src/app/api/waitlist/route.ts:1`, shows success with **position `#` + Waitlist ID** and fires email via `src/lib/email.ts:1` (Resend; mocked if no key).
- **Dedup & Position** — Email unique; duplicate returns existing `position`/`id` with `alreadyExists`. Position is `SERIAL` auto-increment (true queue order).
- **Email** — Resend template with position + ID + branding. If `RESEND_API_KEY` missing, logs to server console (does not block signup).
- **Admin `/admin` (`src/app/admin/page.tsx:1`)** — Cookie-protected (env `ADMIN_PASSWORD` + `src/lib/admin-auth.ts:1`), table with `position, name, email, id, created_at, ip`, search, delete, CSV export, stats. API `src/app/api/admin/entries/route.ts:1`.
- **Supabase schema** `supabase.sql:1` — run in SQL Editor to create `public.waitlist` + RLS + anon insert policy.

---

## 1. Setup Supabase

1. Create project at [supabase.com](https://supabase.com) → Settings → API → copy `Project URL`, `anon key`, `service_role key`.
2. SQL Editor → paste & run `supabase.sql`:

```sql
-- see supabase.sql in repo root
create table public.waitlist (...);
alter table public.waitlist enable row level security;
create policy "Allow anon insert" on public.waitlist for insert to anon with check (true);
```

> `service_role` bypasses RLS so admin reads work. Anon can only insert. Optionally add select policy for public position lookup.

---

## 2. Env

Copy `.env.example` → `.env.local` / Vercel env:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # server-only, never expose
ADMIN_PASSWORD=choose-a-strong-password  # protects /admin
RESEND_API_KEY=re_...                    # optional - if empty, emails are mocked
EMAIL_FROM=Waitlist <onboarding@resend.dev>
NEXT_PUBLIC_APP_NAME=Waitlist
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or https://yourapp.vercel.app
```

---

## 3. Run locally

```bash
npm install
npm run dev   # http://localhost:3000
# /admin -> login with ADMIN_PASSWORD
```

Test waitlist: `curl -X POST http://localhost:3000/api/waitlist -H "Content-Type: application/json" -d '{"name":"Ada Lovelace","email":"ada@example.com"}'`

---

## 4. Deploy to Vercel

1. Push to GitHub → Import in Vercel.
2. Add same env vars in Vercel → Project Settings → Environment Variables.
3. Deploy. `/admin` will redirect to `/admin/login` until you set `ADMIN_PASSWORD`.

No extra config needed; `next.config.ts:1` is default. Build verified (`npm run build` passes).

---

## Project Map

```
src/app/page.tsx                # dark landing
src/components/WaitlistForm.tsx # form + success (position/ID)
src/app/api/waitlist/route.ts   # POST validation, dedup, insert, email
src/lib/supabase.ts             # anon + admin clients
src/lib/email.ts                # Resend with mock fallback
src/lib/validation.ts           # zod schema
src/lib/admin-auth.ts           # cookie gate
src/app/admin/page.tsx          # auth gate (server)
src/app/admin/AdminDashboard.tsx# table/search/delete/csv
src/app/admin/login/page.tsx    # login
supabase.sql                    # DB schema
```

---

## Customization

- **Branding:** set `NEXT_PUBLIC_APP_NAME` / `NEXT_PUBLIC_APP_URL` and edit hero in `src/app/page.tsx:43`.
- **Theme:** Tailwind dark is default (`src/app/globals.css:1`). Accent gradient is `violet→cyan` (search `from-violet-600`).
- **Validation:** edit regex in `src/lib/validation.ts:1`.
- **Rate limit:** in-memory 5/min/IP in `src/app/api/waitlist/route.ts:8` — swap to Upstash Redis for prod.

---

## Troubleshooting

- **“Database not initialized”** → run `supabase.sql` in Supabase.
- **No email** → check `RESEND_API_KEY` + `EMAIL_FROM` (domain must be verified in Resend unless using `onboarding@resend.dev`). Server logs show `[email:mock]` when mocked.
- **Admin 401** → ensure `ADMIN_PASSWORD` matches login input; cookie is `admin_session` (12h).
