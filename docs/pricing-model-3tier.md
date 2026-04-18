# ============================================================
# MealEaseAI Pricing Model Configuration Guide
# ============================================================
# 
# This document outlines the new 3-tier pricing model,
# required Stripe product IDs, and implementation details.
#
# Last Updated: April 2026
# Version: 3.0 (3-tier model)

## Pricing Tiers

### FREE — $0
- Tonight Dinner
- 3 meal generations/day
- Simple grocery list
- Basic dietary filters

### PRO — $7.99/month or $59/year
- Unlimited meal generations
- Full 7-day Weekly Planner
- Save preferences
- Household memory (1 household)
- Budget meal mode
- Healthy mode
- Meal history
- Unlimited regenerations
- Faster AI responses

Annual savings: 38% (save $96.88/year vs monthly)

### FAMILY PLUS — $12.99/month or $99/year ⭐ (Most Popular)
- Everything in Pro
- Up to 6 family members
- Kids Mode
- Lunchbox Planner
- Picky Eater Mode
- Pantry Mode
- Shared grocery lists
- Family dashboard
- Multi-profile meal balancing
- Smart family weekly planning
- Household autopilot

Annual savings: 36% (save $56.88/year vs monthly)

## Required Environment Variables

Add these to your `.env.local` file for production Stripe integration:

```
# Stripe Price IDs (prod)
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_YEARLY=price_xxx
STRIPE_PRICE_FAMILY_MONTHLY=price_xxx
STRIPE_PRICE_FAMILY_YEARLY=price_xxx

# Stripe Secret Key (for API access)
STRIPE_SECRET_KEY=sk_live_xxx

# Public key (optional, for client-side use)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

## Creating Stripe Products & Prices

### Pro Monthly ($7.99)
1. Stripe Dashboard > Products > Create
2. Name: "Pro - Monthly"
3. Pricing: $7.99/month, recurring
4. Billing period: Monthly
5. Copy the Price ID to `STRIPE_PRICE_PRO_MONTHLY`

### Pro Annual ($59)
1. Create price for same product
2. Pricing: $59/year, recurring
3. Billing period: Annually
4. Copy Price ID to `STRIPE_PRICE_PRO_YEARLY`

### Family Plus Monthly ($12.99)
1. Stripe Dashboard > Products > Create
2. Name: "Family Plus - Monthly"
3. Pricing: $12.99/month, recurring
4. Copy Price ID to `STRIPE_PRICE_FAMILY_MONTHLY`

### Family Plus Annual ($99)
1. Create price for same product
2. Pricing: $99/year, recurring
3. Copy Price ID to `STRIPE_PRICE_FAMILY_YEARLY`

## Database Schema Update

The `profiles` table supports subscription tiers:

```sql
ALTER TABLE profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free';
-- Valid values: 'free', 'pro', 'family'

ALTER TABLE profiles ADD COLUMN billing_cycle TEXT; 
-- Valid values: 'monthly', 'yearly'

ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN stripe_subscription_id TEXT;
```

## Webhook Events to Track

Configure Stripe webhooks for these events:

- `customer.subscription.created` → Activate tier
- `customer.subscription.updated` → Update tier
- `customer.subscription.deleted` → Revert to free
- `invoice.payment_succeeded` → Send receipt email
- `invoice.payment_failed` → Alert user + admin

Webhook endpoint: `https://yourdomain.com/api/webhook/stripe`

## Analytics Events Tracked

### Pricing Page
- `pricing_page_views` — User visits /pricing
- `pricing_monthly_toggle` — User toggles to monthly
- `pricing_annual_toggle` — User toggles to annual
- `pricing_cta_start_free` — Click "Start Free"
- `pricing_cta_upgrade` — Click upgrade button (plan specified)

### Checkout Flow
- `checkout_initiated` — Stripe Checkout starts
- `checkout_completed` — Payment successful
- `checkout_abandoned` — User leaves checkout

### Trial & Conversion
- `trial_started` — User starts free trial
- `trial_converted_to_paid` — Trial → Paid conversion
- `trial_expired_no_conversion` — Trial expired, user didn't upgrade

### Paywall
- `paywall_shown` — Paywall modal shown for feature
- `paywall_conversion` — User upgrades from paywall
- `paywall_dismissed` — User closes paywall

## Email Templates Updated

1. **Pro Confirmation** (`templates/pro-confirmation.tsx`)
   - Sent after successful checkout
   - Mentions plan name (Pro or Family Plus)
   - Links to dashboard & settings

2. **Trial Started** (`templates/trial-started.tsx`)
   - Sent when trial begins
   - 7-day countdown info
   - No CC required message

3. **Trial Ending Soon** (`templates/trial-ending-soon.tsx`)
   - Sent 2 days before trial expires
   - Conversion CTA
   - Plan comparison link

4. **Payment Receipt** (`templates/payment-receipt.tsx`)
   - Sent after payment
   - Amount, date, renewal date
   - Billing settings link

## API Endpoints Updated

### POST `/api/checkout/session`
Creates Stripe Checkout Session

**Request:**
```json
{
  "plan": "pro_monthly | pro_yearly | family_monthly | family_yearly"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/...",
  "id": "cs_live_..."
}
```

### POST `/api/paywall/start-trial`
Starts 7-day free trial

**Response:**
```json
{
  "success": true,
  "tempProUntil": "2024-04-25T...",
  "trialDays": 7
}
```

### GET `/api/paywall/status`
Returns current user's paywall status

**Response:**
```json
{
  "isAuthenticated": true,
  "tier": "free | pro | family",
  "isPro": true,
  "isFamily": false,
  "isTempPro": false,
  "freeTonightSwipeLimit": 3,
  "freeDailyGenerations": 3,
  "freePlanPreviewDays": 3,
  "effectivePlanPreviewDays": 7,
  "bonusDays": 0,
  "tempProUntil": null
}
```

## Feature Gates

### Free Tier Limits
- Tonight swipes: 3/day (then paywall)
- Meal generations: 3/day
- Weekly planner: 3-day preview
- Kids recipes: 3 variations

### Pro Features (Soft Gates)
- Unlimited generations
- Full planner (7 days)
- Preferences saved
- Budget & healthy modes
- Faster responses

### Family Plus Features (Hard Gates)
- Up to 6 family members
- Kids Mode
- Lunchbox Planner
- Pantry Mode
- Shared grocery lists
- Family dashboard

## Paywall Triggers

Paywalls appear when free users:

1. **Try unlimited generations** → "Upgrade to Pro"
2. **Access Weekly Planner** (day 4+) → "Unlock full planner with Pro"
3. **Use Pantry Mode** → "Available in Family Plus"
4. **Add family members** (2+) → "Family Plus includes 6 members"
5. **Access Kids Mode** → "Family Plus feature"
6. **Generate 4th meal** → "Unlock unlimited with Pro"

## Mobile UX

- Pricing cards stack vertically
- Sticky CTA button at bottom
- Annual toggle touch-friendly
- Comparison table scrolls horizontally

## Testing Checklist

- [ ] All price IDs configured in .env.local
- [ ] Pricing page renders all 3 tiers
- [ ] Monthly/Annual toggle calculates savings correctly
- [ ] Free CTA links to /signup
- [ ] Pro/Family CTAs redirect to Stripe Checkout
- [ ] Paywalls show correct tier badges
- [ ] Analytics events fire correctly
- [ ] Email templates send with correct plan name
- [ ] Trial API endpoint works
- [ ] Paywall status API returns correct tier
- [ ] Mobile layout is responsive
- [ ] FAQ accordion opens/closes smoothly

## Rollback Plan

If issues occur with the 3-tier model:

1. Pause Family Plus checkout (remove price IDs from env)
2. Revert pricing page to 2-tier template
3. Roll back paywall component to Pro-only version
4. Keep database changes (backward compatible)

## Migration Notes

- Existing Pro users remain on Pro tier
- No existing users converted to Family Plus (opt-in only)
- Free users unchanged
- Trial system works for both tiers
- Annual/monthly billing independent per tier

## Support Resources

- Pricing issues: hello@mealeaseai.com
- Stripe dashboard: https://dashboard.stripe.com/
- PostHog analytics: https://app.posthog.com/
- Database backups stored in Supabase
