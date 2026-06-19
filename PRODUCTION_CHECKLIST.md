# DeshVox Production Deployment Checklist

> **Stack:** Next.js 15 (App Router) · Prisma ORM · Supabase (Postgres + Auth) · Retell AI · Tailwind CSS / shadcn

---

## 1. Supabase Project Setup

- [ ] Create a Supabase project at [supabase.com](https://supabase.com)
- [ ] Enable **Phone Auth** (`Phone` provider) under Authentication → Providers if SMS login is needed
- [ ] Run the database migration from `supabase/migrations/0001_init.sql` in the Supabase SQL Editor
- [ ] Alternatively, run `npx prisma db push` after setting `DATABASE_URL` locally
- [ ] Under Project Settings → Database → Connection string, copy the **URI with `pgbouncer=true`** — this is your `DATABASE_URL`
- [ ] Copy the **Session pooler / direct connection string** (without `pgbouncer`) — this is your `DIRECT_URL`
- [ ] Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy the **anon public API key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] (Optional) Set up Row-Level Security policies if not already applied (migration includes RLS)

---

## 2. Retell AI Setup

- [ ] Create an account at [retellai.com](https://retellai.com)
- [ ] Create an **AI Agent** (voice agent) → copy its ID → `RETELL_AGENT_ID`
- [ ] Generate an **API key** → `RETELL_API_KEY`
- [ ] Configure the agent's voice, language (Bangla + English), and LLM prompt in Retell dashboard

---

## 3. Local Environment

```bash
cp .env.example .env.local
```

Fill in all values from the steps above.

Test locally before deploying:

```bash
npm run dev
```

Verify:
- [ ] Dashboard loads at `http://localhost:3000/dashboard`
- [ ] Analytics page renders charts
- [ ] AI Receptionist demo works (speech + text)
- [ ] API routes at `/api/calls/live` respond

---

## 4. Vercel Deployment

### via Vercel Dashboard (recommended)

- [ ] Push repo to GitHub/GitLab/Bitbucket
- [ ] Go to [vercel.com](https://vercel.com) → Import repository
- [ ] **Framework preset** → Next.js (auto-detected)
- [ ] **Root Directory** → `./` (leave default)
- [ ] **Build Command** → `npx prisma generate && next build` (set in `vercel.json`)
- [ ] **Environment Variables** — add every variable from `.env.example`

### via Vercel CLI

```bash
npx vercel --prod
```

### After Deployment

- [ ] Verify the deployment URL loads
- [ ] Check Vercel Function Logs for any runtime errors
- [ ] Confirm Supabase connection: open a page that queries the DB
- [ ] Confirm Retell AI integration: start a test live call

---

## 5. Production Caveats

### 5.1 Rate Limiting (In-Memory)

The current rate limiter in `lib/security/rate-limit.ts` stores state **in-memory**. On Vercel's serverless infrastructure, each function invocation may run on a different instance, making this unreliable at scale.

**Upgrade path:** Replace the in-memory `Map` with [Upstash Redis](https://upstash.com) (Vercel marketplace):

```bash
npm i @upstash/redis
```

Then update `lib/security/rate-limit.ts` to use Upstash. Upstash is serverless-native and works seamlessly with Vercel Edge/Node functions.

### 5.2 Call Store Fallback (In-Memory)

`lib/calls/store.ts` falls back to an in-memory `Map` when the database is unavailable. This fallback is per-instance only and will lose data when the function cold-starts.

**Fix:** Ensure the database is always reachable. Add a health-check endpoint that Vercel's cron can ping.

### 5.3 Prisma + Serverless

- `DATABASE_URL` must use the **PgBouncer connection string** (`?pgbouncer=true&connection_limit=1`)
- `DIRECT_URL` is the non-pooled connection, used only for migrations — do **not** set `pgbouncer=true` on this one
- Consider enabling [Prisma Accelerate](https://www.prisma.io/accelerate) for connection pooling at scale

### 5.4 Demo Data

The dashboard and analytics pages use hardcoded demo data from `lib/demo-data.ts`. Replace with real database queries for production.

### 5.5 Security Headers

Security headers are set in both `middleware.ts` (per-route) and `vercel.json` (global). The `vercel.json` headers serve as a fallback.

### 5.6 Custom Domain

- [ ] Add a custom domain in Vercel dashboard → Project → Domains
- [ ] Update `x-deshvox-tenant` header logic in `middleware.ts` if multi-tenant routing depends on the domain

---

## 6. Post-Deployment Validation

- [ ] Run `npx vercel inspect --logs <deployment-url>` to tail logs
- [ ] Test all dashboard pages load without client-side errors (open browser DevTools Console)
- [ ] Test the live call API flow end-to-end
- [ ] Test authentication flow (Supabase Auth)
- [ ] Run a Lighthouse audit for performance/SEO
- [ ] Set up [Vercel Analytics](https://vercel.com/analytics) or a monitoring tool

---

## 7. CI / CD (Optional)

Add a GitHub Action to auto-deploy on `main`:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: --prod
```

---

## Quick Reference: Environment Variables

| Variable                     | Required | Source                        |
|------------------------------|----------|-------------------------------|
| `DATABASE_URL`               | ✅       | Supabase → Database → URI     |
| `DIRECT_URL`                 | ✅       | Supabase → Database → URI     |
| `NEXT_PUBLIC_SUPABASE_URL`   | ✅       | Supabase → Project URL        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅    | Supabase → Anon Key           |
| `RETELL_API_KEY`             | ❌ *     | Retell AI → API Keys          |
| `RETELL_AGENT_ID`            | ❌ *     | Retell AI → Agent Details     |
| `DEMO_TENANT_ID`             | ❌       | Optional, for demo mode       |
| `RATE_LIMIT_WINDOW_MS`       | ❌       | Default: 60000 (1 min)        |
| `RATE_LIMIT_MAX_REQUESTS`    | ❌       | Default: 30 per window        |

*\* Required only if using Retell AI voice calls.*
