# DeshVox 🇧🇩

**Bangladesh's smartest AI-powered cloud call center and marketing automation platform.**

DeshVox is a multi-tenant cloud call center platform built for the Bangladesh market. It provides AI-powered voice receptionists, bulk voice/SMS campaigns, IVR flow builder, real-time call handling with compliance (recording consent, DNC checks), and executive analytics — all accessible through a modern dashboard.

> 🔴🟢 The platform name is a portmanteau of _Desh_ (দেশ — country) and _Vox_ (voice).

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Receptionist** | Bilingual (Bangla/English) voice agent powered by Retell AI. Speech-to-speech conversation with department routing.
| 📊 **Analytics Dashboard** | Real-time metrics, call volume trends, lead source breakdown, sentiment analysis, campaign performance tables. CSV/PDF export.
| 📞 **Live Call Center** | Create, join, and end live AI calls with full compliance logging (recording consent, DNC checks). Falls back to demo mode when Retell is not configured.
| 🎯 **Campaign Management** | Bulk voice call, bulk SMS, and AI sequence campaigns with scheduling, lead tracking, and conversion analytics.
| 🔀 **IVR Flow Builder** | Visual drag-and-drop IVR builder using React Flow (xyflow). Design call flows with custom nodes and edges.
| 📱 **Extension Management** | Track and manage extensions across departments with online/offline status and device type classification.
| 🔒 **Compliance Engine** | Built-in consent capture, SHA-256 phone hashing, DNC list checking, and full audit trail via compliance logs.
| 🏢 **Multi-Tenant** | Tenant-scoped data isolation with Row-Level Security in Postgres.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router, React 19) · TypeScript 5 |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com) · `lucide-react` icons |
| **Database** | PostgreSQL via [Supabase](https://supabase.com) · [Prisma ORM 5](https://prisma.io) |
| **Auth** | [Supabase Auth](https://supabase.com/auth) (Email/Password, Phone OTP, Google OAuth) · `@supabase/ssr` |
| **AI Voice** | [Retell AI SDK](https://retellai.com) (`retell-sdk` + `retell-client-js-sdk`) |
| **Charts** | [Recharts](https://recharts.org) |
| **IVR Builder** | [xyflow/react](https://xyflow.com) (React Flow) |
| **Forms** | React Hook Form + Zod |
| **Hosting** | [Vercel](https://vercel.com) (recommended) |

---

## 📁 Project Structure

```
app/
├── api/calls/live/     # Live call API (CRUD + Retell web call creation)
├── auth/               # Auth pages (Supabase)
├── dashboard/          # Dashboard pages
│   ├── ai-receptionist/ # Bilingual AI voice receptionist demo
│   ├── analytics/       # Analytics with charts & CSV export
│   ├── campaigns/       # Campaign management
│   ├── extensions/      # Extension management
│   ├── ivr-builder/     # Visual IVR flow builder
│   └── live-call/       # Live AI call interface
├── layout.tsx           # Root layout with Inter + Noto Sans Bengali fonts
├── globals.css          # Tailwind + CSS variables (light/dark themes)
├── page.tsx             # Redirects to /dashboard
├── middleware.ts         # Security headers + tenant header injection

components/
├── dashboard/           # Sidebar & mobile nav
├── ui/                  # shadcn/ui primitives (button, card, dialog, etc.)
├── client-chart.tsx     # Client-only wrapper for Recharts
├── deshvox-logo.tsx     # Animated SVG logo
├── theme-provider.tsx   # next-themes wrapper

lib/
├── calls/store.ts       # Call session CRUD (DB + in-memory fallback)
├── demo-data.ts         # Demo metrics, call trends, lead sources
├── prisma.ts            # Singleton Prisma client
├── retell.ts            # Retell AI client factory
├── utils.ts             # cn(), formatNumber(), toCsv()
├── security/
│   ├── compliance.ts    # DNC checks, consent logging, phone hashing
│   ├── rate-limit.ts    # In-memory rate limiter
│   └── validation.ts    # Zod schemas + Bangladesh phone normalization
├── supabase/
│   ├── client.ts        # Browser Supabase client
│   └── server.ts        # Server Supabase client (SSR cookies)

prisma/schema.prisma     # Database schema (9 models, RLS-ready)
supabase/migrations/     # SQL migration for Supabase setup
vercel.json              # Vercel deployment configuration
PRODUCTION_CHECKLIST.md  # Step-by-step deployment guide
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm
- (Optional) A [Supabase](https://supabase.com) project for database features
- (Optional) A [Retell AI](https://retellai.com) account for real AI voice calls

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Generate Prisma client
npm run prisma:generate

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the dashboard and all demo features work immediately with hardcoded demo data.

---

## 🗄️ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Fill in your `.env.local` with the credentials from Project Settings → API:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon public key)
   - `DATABASE_URL` (connection string **with** `pgbouncer=true`)
   - `DIRECT_URL` (connection string **without** `pgbouncer`)
3. Run the migration in the Supabase SQL Editor:

```sql
-- Copy and paste supabase/migrations/0001_init.sql into the SQL Editor
```

Or via Prisma:

```bash
npm run prisma:push
```

4. Enable Auth providers in Supabase Dashboard → Authentication → Providers:
   - Email/Password
   - Phone OTP (for Bangladesh numbers)
   - Google OAuth (optional)
5. Enable Realtime for tables: `extensions`, `campaigns`, `hot_leads`, and `ivr_flows`

> **Note:** The app includes a polished demo experience even without Supabase. Once env vars are set, database writes are routed through Prisma/Supabase automatically.

---

## 🤖 AI Voice Calls (Retell)

DeshVox integrates with [Retell AI](https://retellai.com) for real-time AI-powered voice calls. The live call page works in **demo mode** without Retell keys.

| Variable | Description |
|---|---|
| `RETELL_API_KEY` | Retell API key (get from Retell dashboard) |
| `RETELL_AGENT_ID` | Voice agent ID (create an agent in Retell) |

When keys are present, the server:
1. Creates a Retell web call with metadata (tenant, caller info, department)
2. Passes dynamic variables (caller name, locale `bn-BD`) to the Retell LLM
3. Returns a short-lived access token to the browser
4. The browser's `RetellWebClient` uses the token to join the call

> ⚠️ The full access token is not persisted to the database — only a preview (`accessTokenPreview`) is stored for security.

### Compliance Logging

Every call goes through compliance checks:

- ✅ **Recording Consent** — captured before starting or joining a call
- ✅ **DNC Check** — phone numbers are SHA-256 hashed and checked against the tenant's DNC list
- ✅ **Call Events** — join, end, and error events are logged with provider call IDs
- ✅ **Audit Trail** — all events stored in `compliance_logs` table

---

## 📡 API Routes

All API routes are protected with Zod validation and rate limiting:

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/calls/live` | List recent call sessions |
| `POST` | `/api/calls/live` | Create a new live call (with consent + DNC check) |
| `POST` | `/api/calls/live/join` | Join an existing call (requires consent) |
| `POST` | `/api/calls/live/end` | End a call and clean up Retell resources |

---

## 📋 Environment Variables

| Variable | Required | Default | Source |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | Supabase → Database → Connection string (pooled) |
| `DIRECT_URL` | ✅ | — | Supabase → Database → Connection string (direct) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | — | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | — | Supabase → Project Settings → API |
| `RETELL_API_KEY` | ❌* | — | Retell AI → API Keys |
| `RETELL_AGENT_ID` | ❌* | — | Retell AI → Agent Details |
| `DEMO_TENANT_ID` | ❌ | `00000000-0000-0000-0000-000000000001` | For multi-tenant demos |
| `RATE_LIMIT_WINDOW_MS` | ❌ | `60000` | Rate limiting window |
| `RATE_LIMIT_MAX_REQUESTS` | ❌ | `30` | Max requests per window |

*\* Required only if using Retell AI voice calls.*

---

## 🌐 Deployment

This project is configured for deployment on **Vercel + Supabase**. See [`PRODUCTION_CHECKLIST.md`](./PRODUCTION_CHECKLIST.md) for a complete step-by-step guide covering:

- Supabase project setup & migration
- Retell AI configuration
- Environment variable configuration
- Vercel deployment (dashboard & CLI)
- Production caveats (rate limiting, Prisma in serverless, demo data replacement)
- Post-deployment validation
- CI/CD setup

The included [`vercel.json`](./vercel.json) handles:
- Build command: `npx prisma generate && next build`
- Node.js 20 runtime for API routes
- BOM1 (Mumbai) region for Bangladesh latency
- Security headers (HSTS, X-Frame-Options, etc.)

---

## 🛠️ Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:push` | Push Prisma schema to database |

---

## 🧪 Demo Features

Even without Supabase or Retell, the following work out of the box:

- **Dashboard** with mock KPIs, call trend chart, operations panel
- **Analytics** with call volume, lead sources (pie chart), sentiment analysis, campaign table with CSV/PDF export
- **AI Receptionist** with bilingual speech-to-text and text-to-speech conversation demo
- **IVR Builder** with visual node/edge editing (placeholder for Supabase persistence)
- **Extension & Campaign management** pages with static mock data

---

## 🔐 Security

- Security headers set at both Vercel edge (`vercel.json`) and middleware level (`middleware.ts`)
- Rate limiting via in-memory bucket (**replace with Upstash Redis for production scaling**)
- Input validation via Zod schemas on all API endpoints
- Bangladesh phone normalization and SHA-256 phone hashing for DNC compliance
- Row-Level Security on all Postgres tables
- Multi-tenant data isolation via `tenantId` scoping

---

## 📄 License

Private · All rights reserved.

---

_Built with Next.js 15, Supabase, Prisma, and Retell AI._
