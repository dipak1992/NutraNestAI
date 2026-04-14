# NutriNest AI

> **Plan one meal. Feed the whole family — safely.**

NutriNest AI is a full-stack AI-powered family meal planning app built with Next.js 15. It generates a single base meal and automatically creates safe, age- and condition-appropriate variations for every family member — toddlers, babies, adults with PCOS, seniors on low-sodium diets, and everyone in between.

---

## Features

- **AI Meal Planning** — One base meal → multiple safe variations per member (powered by Claude)
- **Family Member Profiles** — Life stage, allergies, medical conditions per member
- **Weekly Planner** — 7-day grid with breakfast, lunch, dinner, and snack slots
- **Smart Grocery List** — Auto-generated, grouped by category, check items off as you shop
- **Pantry Management** — Track stocked items with expiry alerts
- **Insights** — Cuisine stats, meal type breakdown, per-member nutrition overview
- **Demo Mode** — Works fully without API keys using the Garcia-Chen demo family

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (oklch colors) |
| UI Components | shadcn/ui |
| Animation | Framer Motion |
| Auth | Supabase Auth (SSR) |
| Database | Supabase Postgres |
| AI | Claude (claude-opus-4-5) via Anthropic SDK |
| State | Zustand (3 stores) |
| Data Fetching | TanStack Query |
| Forms | React Hook Form + Zod |

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repo>
cd nutrinest-ai
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in your `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (optional — demo mode works without it) |

> **Demo mode**: If `ANTHROPIC_API_KEY` is not set, all meal generation falls back to the built-in `DEMO_WEEKLY_PLAN` (Garcia-Chen family). The app is fully explorable without any API keys.

### 3. Set Up Supabase

1. Create a new [Supabase](https://supabase.com) project
2. Enable **Email Auth** under Authentication → Providers
3. Set the Site URL to `http://localhost:3000` (and your production URL)
4. The app uses Supabase Auth only at this stage — no custom DB tables required to run

### 4. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## App Structure

```
app/
├── page.tsx                  # Landing page
├── pricing/                  # Pricing tiers
├── (auth)/
│   ├── login/                # Sign in
│   └── signup/               # Create account
├── onboarding/               # 4-step household setup wizard
├── (app)/                    # Protected app shell (requires auth)
│   ├── dashboard/            # Overview + today's meals
│   ├── planner/              # Weekly meal grid
│   ├── meal/[id]/            # Meal detail + member variations
│   ├── grocery-list/         # Interactive grocery checklist
│   ├── pantry/               # Pantry stock tracker
│   ├── insights/             # Stats & analytics
│   └── settings/             # Account, household, preferences
└── api/
    ├── generate-plan/        # POST → AI meal plan generation
    └── regenerate-meal/      # POST → regenerate specific meals

lib/
├── ai/meal-generator.ts      # Claude integration + mock fallback
├── supabase/                 # Browser + server + middleware clients
├── store/                    # Zustand stores (planner, onboarding, UI)
├── demo-data.ts              # Garcia-Chen demo family + 7-day plan
└── utils.ts                  # cn(), dates, color helpers, constants
```

---

## API Routes

### `POST /api/generate-plan`

Generates a full 7-day meal plan.

**Request body** (`AIGenerationRequest`):
```json
{
  "household": { "id": "...", "name": "...", "..." : "..." },
  "members": [{ "id": "...", "name": "...", "life_stage": "adult", "allergies": [] }],
  "week_start": "2025-01-13"
}
```

**Response**: `AIGeneratedPlan` with `days`, `grocery_list`, and `insights`.

---

### `POST /api/regenerate-meal`

Regenerates meals with a modifier.

**Request body**:
```json
{
  "request": { "...": "same as generate-plan" },
  "modifier": "make it more kid-friendly"
}
```

---

## Demo Family

| Member | Stage | Notes |
|---|---|---|
| Maya | Adult | PCOS |
| Sam | Adult | Low sodium |
| Leo | Toddler | Egg allergy |
| Ava | Baby (9mo) | — |
| Noah | Kid | — |

---

## License

MIT
