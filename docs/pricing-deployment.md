# ============================================================
# Pricing Model Migration & Deployment Guide
# 3-Tier Model (Free → Pro → Family Plus)
# ============================================================

## Overview

This guide covers:
- Code changes implemented
- Database updates required
- Stripe configuration
- Deployment steps
- Testing procedures
- Rollback plan

## Code Changes Summary

### Core Files Modified

1. **lib/paywall/config.ts**
   - Added PRICING_TIERS object with all plans
   - New constants: FREE_DAILY_GENERATIONS, PRO_UNLOCKS, FAMILY_PLUS_UNLOCKS
   - Savings calculations (38% Pro, 36% Family Plus)
   - Added isFamilyTier() function

2. **types/index.ts**
   - Extended SubscriptionTier to include 'family'
   - Now supports: 'free' | 'plus' | 'pro' | 'family'

3. **components/pricing/PricingContent.tsx**
   - Complete redesign with 3 pricing cards
   - Updated hero, comparison table, FAQ
   - New checkout handlers for 4 plan types
   - Family Plus highlighted as "Most Popular"

4. **app/api/checkout/session/route.ts**
   - Updated to support: pro_monthly, pro_yearly, family_monthly, family_yearly
   - Dynamic price ID mapping

5. **lib/paywall/use-paywall-status.ts**
   - Added isFamily, freeDailyGenerations to status
   - Client-side paywall state management

6. **lib/paywall/server.ts**
   - Added isFamilyTier detection
   - Updated paywall status calculation
   - Server-side subscription logic

7. **components/paywall/ProPaywallCard.tsx**
   - Now supports both Pro and Family Plus tiers
   - Dynamic styling based on tier
   - Updated CTAs and messaging

### New Files Created

1. **lib/analytics/pricing-events.ts**
   - Comprehensive pricing event tracking
   - 40+ analytics capture functions
   - Funnel tracking for conversion optimization

2. **docs/pricing-model-3tier.md**
   - Full pricing documentation
   - Stripe setup instructions
   - API endpoint documentation

## Database Changes

### Migration SQL

```sql
-- 1. Ensure subscription_tier column exists with new values
ALTER TABLE profiles 
ADD COLUMN subscription_tier TEXT DEFAULT 'free';

-- Set existing constraint to allow 'family' tier
-- (PostgreSQL will auto-update if not explicitly constrained)

-- 2. Add billing cycle tracking
ALTER TABLE profiles 
ADD COLUMN billing_cycle TEXT 
DEFAULT 'monthly';

-- 3. Add Stripe IDs for integration
ALTER TABLE profiles 
ADD COLUMN stripe_customer_id TEXT UNIQUE;

ALTER TABLE profiles 
ADD COLUMN stripe_subscription_id TEXT UNIQUE;

-- 4. Create index for lookups
CREATE INDEX idx_profiles_subscription_tier 
ON profiles(subscription_tier);

CREATE INDEX idx_profiles_stripe_customer_id 
ON profiles(stripe_customer_id);

-- 5. Backup existing Pro users (optional)
CREATE TABLE profiles_backup AS 
SELECT * FROM profiles 
WHERE subscription_tier = 'pro';

COMMENT ON TABLE profiles_backup 
IS 'Backup of Pro users before 3-tier migration';
```

## Environment Variables

Add to `.env.local`:

```bash
# Stripe Product IDs (from Stripe Dashboard)
STRIPE_PRICE_PRO_MONTHLY=price_1234567890abcdef
STRIPE_PRICE_PRO_YEARLY=price_abcdefghijklmnop
STRIPE_PRICE_FAMILY_MONTHLY=price_qrstuvwxyz123456
STRIPE_PRICE_FAMILY_YEARLY=price_789abcdefghijklm

# Stripe Keys
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx

# Webhooks
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## Stripe Setup Steps

### 1. Create Pro Product
```
Name: Pro
Description: Unlimited meals, planner, preferences
Pricing:
  - Monthly: $7.99/month
  - Annual: $59/year
```

### 2. Create Family Plus Product
```
Name: Family Plus
Description: Everything in Pro + family tools
Pricing:
  - Monthly: $12.99/month
  - Annual: $99/year
```

### 3. Set Up Webhooks
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: https://yourdomain.com/api/webhook/stripe
3. Select events:
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
4. Copy webhook secret to STRIPE_WEBHOOK_SECRET

### 4. Test Mode
1. Create test products with same names
2. Use test price IDs in .env.local.example
3. Run tests with test Stripe keys

## Deployment Checklist

### Pre-Deployment

- [ ] All code changes committed and tested locally
- [ ] Environment variables set in production (via Vercel/hosting)
- [ ] Stripe products created with exact prices
- [ ] Stripe webhook endpoint configured
- [ ] Database migration script ready
- [ ] Backup of profiles table created
- [ ] Analytics tracking verified locally
- [ ] Email templates tested with new plan names

### Deployment Steps

1. **Merge to main**
   ```bash
   git checkout main
   git pull
   git merge feature/pricing-3tier
   ```

2. **Update database** (Run in order)
   ```sql
   -- Connect to production database
   -- Run migration SQL from above
   ```

3. **Deploy code**
   ```bash
   npm run build  # Verify no errors
   git push origin main
   # Vercel auto-deploys on push
   ```

4. **Verify deployment**
   ```
   - Check https://yourdomain.com/pricing loads
   - Verify all 3 cards render
   - Test monthly/annual toggle
   - Inspect pricing page DOM for typos
   ```

5. **Enable checkout flow**
   - Set Stripe keys in production env vars
   - Test checkout with test card: 4242 4242 4242 4242
   - Verify success and cancel URLs redirect correctly

6. **Monitor**
   - Watch PostHog for pricing_page_views
   - Monitor Stripe for test transactions
   - Check server logs for errors
   - Monitor Resend for email delivery

### Post-Deployment

- [ ] Pricing page accessible from nav
- [ ] Checkout flow works end-to-end
- [ ] Existing Pro users can still access Pro features
- [ ] Trial API endpoint working
- [ ] Paywall modals showing correct tier
- [ ] Analytics events flowing to PostHog
- [ ] Welcome & trial emails sending with correct plan names
- [ ] No console errors on pricing page

## Testing Procedures

### Manual Testing

```
1. Pricing Page
   - [ ] All 3 cards visible
   - [ ] Monthly/Annual toggle works
   - [ ] Savings badges show correct %
   - [ ] Comparison table scrolls on mobile
   - [ ] CTAs not in test mode (hidden until env vars set)

2. Trial Flow
   - [ ] Logged-out user → signup
   - [ ] Logged-in free user → 7-day trial starts
   - [ ] Trial status shows in account
   - [ ] Trial ending email sends 2 days before
   - [ ] Post-trial user can upgrade

3. Checkout Flow
   - [ ] Click Pro monthly CTA
   - [ ] Stripe Checkout loads with correct amount
   - [ ] Test card 4242... completes successfully
   - [ ] User redirected to /dashboard?welcome=pro_monthly
   - [ ] Confirmation email sent

4. Paywalls
   - [ ] Free user hits meal limit → sees paywall
   - [ ] Paywall shows Pro CTA first, Family Plus second
   - [ ] Click "Upgrade to Family Plus" goes to pricing
   - [ ] Paywall dismisses on background click

5. Feature Gates
   - [ ] Free: 3 daily generations (4th shows paywall)
   - [ ] Free: 3 weekly preview (day 4+ shows paywall)
   - [ ] Free: Pantry Mode locked (paywall shows Family badge)
   - [ ] Pro: Unlimited everything
   - [ ] Family: All features + family tools
```

### Automated Testing

```bash
# Test build
npm run build

# Test types
npm run type-check

# Run existing tests
npm run test
```

### Analytics Verification

```javascript
// Open browser console and check:
posthog.capture.calls  // Should have 'pricing_page_views'
```

## Rollback Plan

If critical issues occur:

### Immediate Rollback (Option 1 - Fast)

```bash
# Revert last commit
git revert HEAD
git push origin main
# Vercel redeploys within seconds
```

### Full Rollback (Option 2 - Database Reset)

```bash
# Only if data corruption occurred
psql production_db < profiles_backup.sql
```

### Partial Rollback (Option 3 - Feature Flag)

1. Disable Family Plus in env vars
   ```bash
   ENABLE_FAMILY_PLUS=false
   ```
2. Users see 2-tier pricing
3. Existing Family users still access family features

## Monitoring & Alerts

### Key Metrics to Watch

```
1. Checkout Success Rate
   - Expected: 70%+ completion
   - Alert if < 50%

2. Trial Start Rate
   - Expected: 40%+ of free users try trial
   - Alert if < 20%

3. Paywall Dismissal Rate
   - Expected: 60% dismiss (normal)
   - Alert if > 80% dismiss

4. Email Delivery
   - Expected: 99%+ delivery
   - Alert if < 95%

5. API Error Rate
   - Expected: < 1% errors
   - Alert if > 5%
```

### PostHog Dashboards

Create these dashboards:

1. **Pricing Conversion Funnel**
   - Pricing page views → Checkout → Completion

2. **Trial Metrics**
   - Trials started → Trials converted → Revenue

3. **Feature Gate Usage**
   - Paywall shows by feature
   - Conversions by paywall type

4. **Error Monitoring**
   - Failed checkouts
   - API errors
   - Email failures

## Support & Communication

### Internal Documentation
- [ ] Shared pricing model doc in team wiki
- [ ] Stripe setup guide for teammates
- [ ] Analytics dashboard link in Slack

### Customer-Facing
- [ ] Pricing page live and publicized
- [ ] Email to existing users about Family Plus option
- [ ] FAQ updated on marketing site
- [ ] Support docs covering plan differences

### Help Resources
- Pricing issues: hello@mealeaseai.com
- Stripe docs: https://stripe.com/docs
- PostHog docs: https://posthog.com/docs

## Success Criteria

Migration is successful when:

✅ Pricing page renders all 3 tiers without errors
✅ Checkout completes successfully for both Pro plans
✅ Family Plus checkout works end-to-end
✅ Trial API working for 7-day free access
✅ Paywalls show correct tier badges
✅ Analytics events flowing to PostHog
✅ Email confirmation sent after purchase
✅ Existing Pro users still have access
✅ Mobile layout responsive and functional
✅ No critical bugs reported in first 24 hours

## Timeline

- Day 1: Deploy code + setup Stripe
- Day 2: Enable checkout flow, run full QA
- Day 3-7: Monitor metrics, collect user feedback
- Week 2: Iterate based on feedback, optimize CTAs
- Week 3: Scale marketing, promote Family Plus
