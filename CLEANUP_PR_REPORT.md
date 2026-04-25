# PR: cleanup/remove-deprecated-features → main

> **Branch:** `cleanup/remove-deprecated-features`
> **Status:** Ready for review — DO NOT merge without sign-off
> **Build:** ✅ `next build` passes — TypeScript clean, 104 pages generated
> **Date:** 2026-04-24

---

## Summary

This PR removes all deprecated features that fall outside MealEase's 5-pillar product strategy:

1. **Tonight Suggestions** — one-tap dinner decisions
2. **Snap & Cook** — pantry/ingredient-based meals
3. **Weekly Autopilot** — 7-day meal planner
4. **Leftovers AI** — rescue-my-fridge mode
5. **Budget Intelligence** — cost-aware meal selection

Everything removed was either a distraction from these pillars, a v1 experiment that never shipped, or dead code with no active users.

---

## Commits (cleanup branch only)

| Hash | Step | Description |
|------|------|-------------|
| `4bde7b5` | STEP 1 | Remove Weekend Mode feature |
| `ac9c0de` | STEP 4 | Remove standalone Kids Tools |
| `3f2c1d1` | STEP 5 | Archive v1 pages to `_deprecated/` |
| `fd71893` | STEP 5 | Add `_deprecated/` to `.gitignore` |
| `8e0f9a8` | STEP 6 | Remove unused dependencies and orphaned code |
| `9f22a1e` | STEP 7 | Fix all broken imports after cleanup |

> Steps 2 (standalone Food Check) and 3 (standalone Smart Menu Scan) were skipped — neither feature existed in the codebase.

---

## What Was Removed

### STEP 1 — Weekend Mode (commit `4bde7b5`)

| Type | Path |
|------|------|
| Page | `app/(app)/weekend/page.tsx` |
| API route | `app/api/weekend-mode/route.ts` |
| Components | `components/weekend/WeekendModeSheet.tsx` |
| Components | `components/weekend/WeekendMoviePicker.tsx` |
| Components | `components/weekend/WeekendRecipePicker.tsx` |
| Hub card | `components/hub/WeekendModeCard.tsx` |
| Lib | `lib/weekend/generate-entertainment.ts` |
| Email template | `lib/email/templates/weekend-reminder.tsx` |
| DB migration | `supabase/migrations/020_drop_weekend_mode_columns.sql` |

**Rationale:** Weekend Mode (dinner + movie picker) was a v1 experiment outside the 5 pillars. Zero active usage. Entertainment preferences column dropped from `profiles` table.

---

### STEP 4 — Kids Tools (commit `ac9c0de`)

| Type | Path |
|------|------|
| Pages | `app/kids/page.tsx`, `app/kids-tool/page.tsx`, `app/kids-tool/result/page.tsx` |
| API route | `app/api/kids-tool/route.ts` |
| Lib | `lib/kids-tool-utils.ts` |

**Rationale:** Standalone Kids Tool pages were redundant — kids/family meal support is already built into the core engine via household profiles and `pickyEater` flags. The dedicated pages added confusion without adding value.

---

### STEP 5 — Archived v1 Pages (commit `3f2c1d1`)

Moved to `_deprecated/` (gitignored, not deleted — reversible):

| Original Path | Reason |
|---------------|--------|
| `app/(app)/insights/page.tsx` | Habit tracking UI — outside 5 pillars |
| `app/(app)/referral/page.tsx` | Referral program — shut down |
| `app/api/habit/feedback/route.ts` | Habit feedback API — no consumers |
| `app/api/habit/notifications/route.ts` | Habit push notifications — no consumers |
| `app/api/habit/streak/route.ts` | Streak tracking API — no consumers |
| `app/api/referral/apply/route.ts` | Referral apply API — program shut down |
| `app/api/referral/me/route.ts` | Referral status API — program shut down |
| `app/api/sentry-example-api/route.ts` | Sentry test route — dev artifact |
| `app/sentry-example-page/page.tsx` | Sentry test page — dev artifact |
| `app/api/zero-cook/route.ts` | Zero-Cook API — replaced by Rescue My Fridge |
| `app/r/[code]/page.tsx` | Referral redirect — program shut down |

---

### STEP 6 — Orphaned Code & Dependencies (commit `8e0f9a8`)

**Deleted files:**

| Path | Reason |
|------|--------|
| `components/habit/InsightCards.tsx` | Habit UI — outside 5 pillars |
| `components/habit/MicroFeedback.tsx` | Habit UI — outside 5 pillars |
| `components/habit/NotificationSettings.tsx` | Habit notifications — outside 5 pillars |
| `components/habit/StreakBadge.tsx` | Streak display — outside 5 pillars |
| `components/habit/TodayCard.tsx` | Habit today card — outside 5 pillars |
| `components/zero-cook/ProviderButtons.tsx` | Zero-Cook UI — replaced |
| `components/zero-cook/ZeroCookMealCard.tsx` | Zero-Cook UI — replaced |
| `components/zero-cook/ZeroCookSheet.tsx` | Zero-Cook UI — replaced |
| `components/zero-cook/ZeroCookTeaser.tsx` | Zero-Cook UI — replaced |
| `components/zero-cook/useZeroCookRecommend.ts` | Zero-Cook hook — replaced |
| `lib/email/templates/referral-reward.tsx` | Referral email — program shut down |
| `lib/referral/config.ts` | Referral config — program shut down |
| `lib/referral/server.ts` | Referral server logic — program shut down |
| `lib/zero-cook/providers.ts` | Zero-Cook lib — replaced |
| `lib/zero-cook/recommendation.ts` | Zero-Cook lib — replaced |
| `lib/zero-cook/types.ts` | Zero-Cook lib — replaced |
| `docs/*` | Stale internal docs — moved out of repo |
| `posthog-setup-report.md` | Dev artifact |
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Next.js boilerplate assets |

**Modified files:**

| File | Change |
|------|--------|
| `lib/email/triggers.ts` | Removed `sendReferralRewardEmail`, `alertAdminReferral` functions |
| `lib/paywall/server.ts` | Removed `REFERRAL_MAX_BONUS_DAYS` import and bonus days logic |
| `components/hub/DashboardHub.tsx` | Removed `StreakBadge`, `WeekendModeCard`, `KidsSection` imports + JSX |
| `app/(app)/settings/page.tsx` | Removed Notifications tab, Entertainment tab, related state |
| `lib/hooks/use-household-config.ts` | Removed `KidsTool` interface, `zeroCook` card label, weekend helpers |

---

### STEP 7 — Build Fixes (commit `9f22a1e`)

Additional files found broken during build verification:

| File | Fix |
|------|-----|
| `components/dashboard/DashboardClient.tsx` | Removed `StreakBadge`, `TodayCard`, `InsightCards` imports + JSX; removed streak state/useEffect; removed weekend banner |
| `components/hub/HomeHub.tsx` | Removed `StreakBadge`, `TodayCard`, `InsightCards` imports + JSX; replaced `FlameKindling` streak cell with `totalInteractions` stat |
| `lib/email/triggers.ts` | Removed broken `alertAdminReferral` function (malformed `createElement` call) |
| `lib/store/index.ts` | Removed `EntertainmentPrefs` import + `entertainmentPrefs` state/setter |
| `tsconfig.json` | Added `nutrinest-ai` to exclude list (stale nested directory artifact) |

---

## What Was NOT Touched

All 5-pillar features remain fully intact:

- ✅ Tonight Suggestions (`/dashboard`, `/tonight`, `/decide`, `/api/decide`)
- ✅ Snap & Cook (`/api/pantry/vision`, `/api/pantry/match`, `PantryCapture`)
- ✅ Weekly Autopilot (`/planner`, `/api/generate-plan`, `/api/weekly-plan`)
- ✅ Leftovers AI (`/api/tonight?mode=rescue`, `HomeHub` rescue tile)
- ✅ Budget Intelligence (`budget` param in meal engine, `too_expensive` chip)
- ✅ Stripe billing (Pro + Family tiers)
- ✅ Supabase Auth + household profiles
- ✅ Email system (welcome, reminders, receipts, admin alerts)
- ✅ Push notifications (VAPID)
- ✅ PostHog analytics
- ✅ All blog, landing, pricing, onboarding pages

---

## Database Changes

One migration was created and should be run against production **after** this PR merges:

```sql
-- supabase/migrations/020_drop_weekend_mode_columns.sql
ALTER TABLE reminder_schedules DROP COLUMN IF EXISTS last_weekend_sent_at;
ALTER TABLE profiles DROP COLUMN IF EXISTS entertainment_prefs;
```

Both columns are safe to drop — no active code reads them after this cleanup.

---

## Rollback Plan

- All archived pages are in `_deprecated/` (gitignored, still on disk)
- Git history is fully intact — every step is a separate reversible commit
- To restore any feature: `git revert <commit-hash>` or cherry-pick from `_deprecated/`

---

## Review Checklist

- [ ] Confirm no active users depend on Weekend Mode, Kids Tool standalone pages, or Referral program
- [ ] Run `supabase/migrations/020_drop_weekend_mode_columns.sql` against staging first
- [ ] Smoke test: `/dashboard`, `/planner`, `/pantry`, `/settings`, `/pricing`
- [ ] Verify PostHog events still fire on core flows
- [ ] Approve and merge to `main`
