# MealEase Founder Launch Checklist

Use this as the working checklist for launch. Complete one phase at a time. After each phase, stop and verify before moving on.

---

## Phase 1: Accounts to Create

### Password manager and control

- [ ] Confirm you can log in to the domain registrar for `mealeaseai.com`
- [ ] Confirm you can edit DNS records for `mealeaseai.com`
- [ ] Create a password manager vault named `MealEase`
- [ ] Create a secure note named `MealEase Production Keys`

### Namecheap Private Email

- [ ] Activate Namecheap Private Email for `mealeaseai.com`
- [ ] Create the first mailbox as `hello@mealeaseai.com`
- [ ] Save the Namecheap Private Email login in your password manager

### Supabase

- [ ] Create a Supabase organization named `MealEase`
- [ ] Create a Supabase project named `mealease-prod`
- [ ] Choose a US region close to your expected users
- [ ] Save the Supabase database password in your password manager

### Google Cloud

- [ ] Create a Google Cloud project named `MealEase Auth`
- [ ] Save the Google Cloud billing and admin access details

### Resend

- [ ] Create a Resend account
- [ ] Create or rename the workspace to `MealEase`

### Vercel

- [ ] Create or use a Vercel account
- [ ] Create a Vercel team named `MealEase`

### PostHog

- [ ] Create a PostHog account
- [ ] Create a project named `MealEase Production`

### Sentry

- [ ] Create a Sentry account
- [ ] Create an organization named `mealease`
- [ ] Create a project named `mealease-web`

### AI providers

- [ ] Create an OpenAI account or confirm you can access the API dashboard
- [ ] Create an Anthropic account or confirm you can access the API console

### Optional for later

- [ ] Decide whether billing is launching now or later
- [ ] If billing is launching now, create a Stripe account

**Stop here after Phase 1.**

Verification before moving on:

- [ ] I can log in to every required platform
- [ ] I have saved every account login in my password manager
- [ ] I am ready to start domain and DNS setup

---

## Phase 2: Domain and DNS

### Namecheap mail setup

- [ ] Add Namecheap Private Email MX records at the root domain
- [ ] Remove any old MX records that conflict with Private Email
- [ ] Wait for MX propagation
- [ ] Send a test email to `hello@mealeaseai.com`
- [ ] Confirm the test email arrives in Namecheap webmail

### Email authentication

- [ ] Add a single SPF TXT record at the root domain
- [ ] Add a DMARC TXT record at `_dmarc`
- [ ] Add Namecheap DKIM DNS record and confirm it passes
- [ ] Add Resend DKIM DNS record and confirm it passes

### Pre-Vercel DNS awareness

- [ ] Confirm you are not using two SPF records
- [ ] Confirm DNS changes are visible in your DNS provider UI
- [ ] Confirm you know where to add the Vercel A record and CNAME later

**Stop here after Phase 2.**

Verification before moving on:

- [ ] `hello@mealeaseai.com` receives email
- [ ] SPF, DKIM, and DMARC are configured

---

## Phase 3: Core Backend Setup

### Supabase project values

- [ ] Open Supabase -> Project Settings -> API
- [ ] Copy the Project URL
- [ ] Copy the anon public key
- [ ] Copy the service role key
- [ ] Save all three values in your password manager

### Run Supabase migrations

- [ ] Open Supabase SQL Editor
- [ ] Run `supabase/migrations/001_content_system.sql`
- [ ] Run `supabase/migrations/002_paywall_profiles.sql`
- [ ] Run `supabase/migrations/003_referrals.sql`
- [ ] Run `supabase/migrations/004_habit_system.sql`
- [ ] Run `supabase/migrations/005_email_system.sql`

### Run onboarding SQL

- [ ] Open `app/api/onboarding/route.ts`
- [ ] Copy the SQL block for `onboarding_preferences`
- [ ] Run that SQL in Supabase SQL Editor

### Supabase auth URL settings

- [ ] Set Site URL to `https://mealeaseai.com`
- [ ] Add redirect URL `http://localhost:3000/auth/callback`
- [ ] Add redirect URL `https://mealeaseai.com/auth/callback`
- [ ] Add redirect URL `https://www.mealeaseai.com/auth/callback`
- [ ] Add your Vercel preview or production URL callback once available

### Google OAuth in Google Cloud

- [ ] Open Google Cloud -> APIs & Services -> OAuth consent screen
- [ ] Set app name to `MealEase`
- [ ] Set support email to `hello@mealeaseai.com`
- [ ] Set developer contact email to `hello@mealeaseai.com`
- [ ] Add `mealeaseai.com` as an authorized domain
- [ ] Publish the OAuth consent screen

### Google OAuth client

- [ ] Create OAuth Client ID of type Web application
- [ ] Name it `MealEase Web OAuth`
- [ ] Add origin `http://localhost:3000`
- [ ] Add origin `https://mealeaseai.com`
- [ ] Add origin `https://www.mealeaseai.com`
- [ ] Copy the Google redirect URI shown in Supabase Google provider settings
- [ ] Add that Supabase callback URI in Google Cloud OAuth client settings
- [ ] Copy the Google client ID
- [ ] Copy the Google client secret

### Connect Google to Supabase

- [ ] Open Supabase -> Authentication -> Providers -> Google
- [ ] Enable Google provider
- [ ] Paste the Google client ID
- [ ] Paste the Google client secret
- [ ] Save the provider

### Security basics

- [ ] Verify RLS is enabled on user-owned tables
- [ ] Verify onboarding preferences policy exists
- [ ] Verify service role key is only used server-side

### Storage

- [ ] Open Supabase Storage once to confirm it is available
- [ ] Do not create buckets yet unless you add uploads

**Stop here after Phase 3.**

Verification before moving on:

- [ ] Supabase migrations have all run successfully
- [ ] Google OAuth is connected to Supabase
- [ ] Supabase auth redirect URLs are configured

---

## Phase 4: App Deployment

### Resend domain setup

- [ ] Add `mealeaseai.com` as a sending domain in Resend
- [ ] Add every DNS verification record Resend provides
- [ ] Merge Resend SPF into your single SPF record if needed
- [ ] Wait for Resend domain verification

### Resend API and webhook

- [ ] Create a Resend API key named `mealease-production`
- [ ] Save the API key
- [ ] Create a webhook pointing to `https://mealeaseai.com/api/email/webhook`
- [ ] Subscribe the webhook to delivered, bounced, complained, opened, and clicked events
- [ ] Copy the Resend webhook signing secret

### Supabase SMTP

- [ ] Open Supabase -> Authentication -> SMTP Settings
- [ ] Enable custom SMTP
- [ ] Set host to `smtp.resend.com`
- [ ] Set port to `587`
- [ ] Set username to `resend`
- [ ] Set password to the Resend API key
- [ ] Set sender name to `MealEase`
- [ ] Set sender email to `hello@mealeaseai.com`
- [ ] Save SMTP settings

### Vercel project

- [ ] Import the MealEase GitHub repo into Vercel
- [ ] Name the project `mealease-web`
- [ ] Confirm framework preset is Next.js
- [ ] Confirm production branch is `main`

### Vercel production environment variables

- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Add `NEXT_PUBLIC_SITE_URL=https://mealeaseai.com`
- [ ] Add `ANTHROPIC_API_KEY`
- [ ] Add `OPENAI_API_KEY`
- [ ] Add `RESEND_API_KEY`
- [ ] Add `RESEND_WEBHOOK_SECRET`
- [ ] Add `CRON_SECRET`
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY`
- [ ] Add `NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`
- [ ] Add `SENTRY_DSN`
- [ ] Add `SENTRY_ORG`
- [ ] Add `SENTRY_PROJECT`
- [ ] Add `SENTRY_AUTH_TOKEN`
- [ ] Add Stripe keys only if billing is truly implemented

### First deploy

- [ ] Trigger the first Vercel deployment
- [ ] Open the generated Vercel URL
- [ ] Confirm the app loads without a server error

### Custom domain in Vercel

- [ ] Add `mealeaseai.com` to the Vercel project
- [ ] Add `www.mealeaseai.com` to the Vercel project
- [ ] Set `mealeaseai.com` as primary
- [ ] Add Vercel A record for root domain
- [ ] Add Vercel CNAME record for `www`
- [ ] Wait for Vercel to verify both domains
- [ ] Confirm HTTPS is active

### Vercel Cron

- [ ] Create cron job `/api/email/reminders?type=dinner` with `0 21 * * *`
- [ ] Create cron job `/api/email/reminders?type=weekly` with `0 9 * * MON`
- [ ] Create cron job `/api/email/reminders?type=admin-summary` with `0 10 * * MON`

**Stop here after Phase 4.**

Verification before moving on:

- [ ] The live Vercel project deploys successfully
- [ ] `https://mealeaseai.com` resolves correctly
- [ ] Auth SMTP is configured through Resend

---

## Phase 5: Monitoring and Analytics

### PostHog

- [ ] Copy the PostHog project API key
- [ ] Confirm PostHog host is `https://us.i.posthog.com`
- [ ] Add PostHog variables to Vercel if not already added

### Sentry

- [ ] Copy the Sentry DSN
- [ ] Copy the Sentry org slug
- [ ] Copy the Sentry project slug
- [ ] Create a Sentry auth token for source maps
- [ ] Add Sentry variables to Vercel if not already added

### Redeploy after monitoring env vars

- [ ] Redeploy the Vercel project after adding or changing env vars

### Event checklist

- [ ] Confirm `landing_page_view` is firing
- [ ] Confirm `signup_started` is firing
- [ ] Confirm `signup_completed` is firing
- [ ] Confirm `meal_generated` is firing
- [ ] Confirm `swipe_action` is firing
- [ ] Confirm `paywall_view` is firing
- [ ] Confirm `subscription_success` is only expected if billing is implemented

### Error tracking checklist

- [ ] Trigger one browser-side test error and confirm it reaches Sentry
- [ ] Trigger one server-side test error in a safe preview environment and confirm it reaches Sentry
- [ ] Confirm source maps uploaded successfully during build

**Stop here after Phase 5.**

Verification before moving on:

- [ ] PostHog is receiving live production events
- [ ] Sentry is receiving frontend and backend errors

---

## Phase 6: Final Testing

### Auth and user flows

- [ ] Test email signup on the live domain
- [ ] Confirm verification email arrives
- [ ] Test login on the live domain
- [ ] Test Google sign-in on the live domain
- [ ] Test password reset flow
- [ ] Complete onboarding end to end

### Email and cron flows

- [ ] Send a test support email to `hello@mealeaseai.com`
- [ ] Confirm transactional emails come from `hello@mealeaseai.com`
- [ ] Confirm replies go to `hello@mealeaseai.com`
- [ ] Confirm admin alerts reach `hello@mealeaseai.com`
- [ ] Manually call `/api/email/reminders?type=dinner` with the bearer secret
- [ ] Manually call `/api/email/reminders?type=weekly` with the bearer secret

### Product flows

- [ ] Generate an instant meal successfully
- [ ] Generate a weekly plan successfully
- [ ] Test swipe interactions successfully
- [ ] Test image analysis successfully
- [ ] Confirm OpenAI path works
- [ ] Confirm Anthropic path works

### Launch readiness

- [ ] Confirm the live site is loading over HTTPS with no obvious console errors
- [ ] Confirm Vercel production env vars are complete
- [ ] Confirm no broken navigation links exist on the live site
- [ ] Confirm pricing or paywall messaging matches what is truly implemented

### Billing reality check

- [ ] If billing is not fully wired, do not market paid subscriptions yet
- [ ] If billing is live, test successful checkout and webhook handling before launch

**Stop here after Phase 6.**

Final verification:

- [ ] I have tested the full live product on the production domain
- [ ] I am confident users can sign up, log in, and use the core value path
- [ ] I am ready to announce MealEase publicly