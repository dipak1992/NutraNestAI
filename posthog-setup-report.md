<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into MealEase (NutriNest AI). The project already had `posthog-js` installed with a basic `PostHogProvider`, so the integration built on that foundation with the following changes:

- **`instrumentation-client.ts`** (new) — PostHog is now initialized using the Next.js 15.3+ recommended approach, replacing the old `useEffect`-based init in `PostHogProvider`. The reverse proxy (`/ingest`) is used so events are not blocked by ad-blockers. Exception capture (`capture_exceptions: true`) and the `2026-01-30` defaults snapshot are enabled.
- **`next.config.ts`** — Added `/ingest` and `/ingest/static` reverse proxy rewrites and `skipTrailingSlashRedirect: true` as required by PostHog.
- **`components/providers/PostHogProvider.tsx`** — Removed the duplicate `posthog.init()` call; the component now only wraps children in `PHProvider` to expose `usePostHog()` hooks.
- **`lib/posthog-server.ts`** (new) — Singleton server-side PostHog client (using `posthog-node`) for use in API routes.
- **`.env.local`** — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set.
- **`posthog-node`** — Installed as a new dependency.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User signs in (email or Google). Calls `posthog.identify()` on email login. | `app/(auth)/login/page.tsx` |
| `user_signed_up` | User creates a new account (email or Google). Calls `posthog.identify()` on email signup. | `app/(auth)/signup/page.tsx` |
| `onboarding_step_completed` | User advances past a step in the 5-step onboarding flow. | `app/onboarding/page.tsx` |
| `onboarding_completed` | User saves preferences and finishes onboarding. Properties: `household_type`, `cuisines_count`, `has_kids`, `picky_eater`, `low_energy`, `country`. | `app/onboarding/page.tsx` |
| `hub_tile_tapped` | User taps one of the 4 intent tiles (quick, pantry, surprise, plan). Property: `tile`. | `components/hub/HomeHub.tsx` |
| `meal_cooked` | User marks a meal as going to cook it. Properties: `meal_id`, `meal_name`, `mode`. | `components/hub/HomeHub.tsx` |
| `meal_swapped` | User swaps a meal for a different suggestion. Properties: `meal_id`, `meal_name`, `mode`, `active_chip`. | `components/hub/HomeHub.tsx` |
| `paywall_trial_started` | User clicks "Try Pro free for 7 days". Property: `redirect_path`. | `components/paywall/ProPaywallCard.tsx` |
| `checkout_session_created` | Server: Stripe checkout session created. Properties: `price_id`, `stripe_customer_id`. | `app/api/stripe/checkout/route.ts` |
| `subscription_activated` | Server: Stripe `checkout.session.completed` processed — user upgraded to Pro. Properties: `price_id`, `stripe_subscription_id`. | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Server: Stripe subscription deleted — user downgraded. Property: `stripe_subscription_id`. | `app/api/stripe/webhook/route.ts` |
| `referral_applied` | Server: Referral code successfully applied. Properties: `referral_code`, `bonus_days_granted`, `temp_pro_granted`. | `app/api/referral/apply/route.ts` |

## Next steps

We've built a dashboard and 5 insights to monitor user behavior based on the events above:

- **Dashboard:** https://us.posthog.com/project/375381/dashboard/1479966
- **Signup → Onboarding → Pro conversion funnel:** https://us.posthog.com/project/375381/insights/3JTldbFy
- **Daily new signups:** https://us.posthog.com/project/375381/insights/o6oyRfhP
- **Hub tile popularity breakdown:** https://us.posthog.com/project/375381/insights/0fq5fKWj
- **Meal engagement: cooked vs swapped:** https://us.posthog.com/project/375381/insights/DPzxzm7e
- **Paywall → subscription conversion funnel:** https://us.posthog.com/project/375381/insights/LA9822Pb

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
