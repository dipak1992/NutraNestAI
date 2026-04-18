# MealEase Launch Runbook

This is the shortest practical path to get MealEase live without missing any required setup.

## 1. Accounts to Create

Create these accounts in this order:

1. Namecheap Private Email
2. Supabase
3. Google Cloud Console
4. Resend
5. Vercel
6. PostHog
7. Sentry
8. OpenAI
9. Anthropic

Use these names everywhere for consistency:

- Team or org: MealEase
- Production app/project: mealease-prod
- Vercel project: mealease-web
- Google Cloud project: MealEase Auth
- PostHog project: MealEase Production
- Sentry project: mealease-web

## 2. Domain and Email First

Domain: `mealeaseai.com`

Email roles already expected by the codebase:

- `hello@mealeaseai.com` = support inbox + transactional sender + internal alerts

### Namecheap Private Email

1. Buy or confirm control of `mealeaseai.com` at your registrar.
2. Activate Namecheap Private Email.
3. Set up the first mailbox as `hello@mealeaseai.com`.
4. Use this mailbox for manual support and business replies.

### DNS records to add early

Add these in the DNS provider for your domain:

- Namecheap Private Email MX records
- One SPF TXT record at root
- One DMARC TXT record at `_dmarc`
- Namecheap and Resend DKIM records

Recommended SPF pattern once Resend is added:

```txt
v=spf1 include:spf.privateemail.com include:amazonses.com ~all
```

Recommended DMARC starter record:

```txt
v=DMARC1; p=quarantine; rua=mailto:hello@mealeaseai.com; adkim=s; aspf=s
```

Important:

- Never create two SPF records.
- TXT and CNAME changes often propagate in minutes, but allow up to 24 hours.

## 3. Core Backend Setup

### Supabase

1. Create org `MealEase`.
2. Create project `mealease-prod`.
3. Choose a US region close to your Vercel region and users.
4. Save the DB password in your password manager.
5. Copy these values from Project Settings -> API:
   - Project URL
   - anon key
   - service_role key

### Run migrations in exact order

Run these SQL files in Supabase SQL Editor:

1. `supabase/migrations/001_content_system.sql`
2. `supabase/migrations/002_paywall_profiles.sql`
3. `supabase/migrations/003_referrals.sql`
4. `supabase/migrations/004_habit_system.sql`
5. `supabase/migrations/005_email_system.sql`

Then also run the onboarding table SQL from `app/api/onboarding/route.ts`.

### Supabase Auth URL config

Set:

- Site URL: `https://mealeaseai.com`

Add redirect URLs:

- `http://localhost:3000/auth/callback`
- `https://mealeaseai.com/auth/callback`
- `https://www.mealeaseai.com/auth/callback`
- `https://YOUR-VERCEL-PROJECT.vercel.app/auth/callback`

### Google sign-in through Supabase

1. In Google Cloud Console, create project `MealEase Auth`.
2. Set up OAuth consent screen:
   - App name: MealEase
   - Support email: `hello@mealeaseai.com`
   - Developer contact email: `hello@mealeaseai.com`
   - Authorized domain: `mealeaseai.com`
3. Create OAuth Client ID -> Web application.
4. Add origins:
   - `http://localhost:3000`
   - `https://mealeaseai.com`
   - `https://www.mealeaseai.com`
5. Add redirect URI from Supabase Google provider page.
   - Usually: `https://PROJECT_REF.supabase.co/auth/v1/callback`
6. In Supabase -> Authentication -> Providers -> Google:
   - Enable Google
   - Paste Google client ID
   - Paste Google client secret

Important:

- Google redirects to Supabase first.
- Supabase then redirects to `/auth/callback` in your app.

### Storage

Supabase Storage is not currently used by the app. Open the Storage section once so it is ready, but do not create buckets yet.

## 4. Email Delivery Setup

### Resend

1. Create workspace `MealEase`.
2. Add domain `mealeaseai.com`.
3. Add the DNS verification records Resend shows.
4. Merge SPF with your existing Namecheap SPF into one record.
5. Wait for verification to pass.
6. Create API key named `mealease-production`.
7. Save the key.

### Resend webhook

Create a webhook in Resend:

- URL: `https://mealeaseai.com/api/email/webhook`
- Events: delivered, bounced, complained, opened, clicked

Copy the signing secret.

### Supabase custom SMTP

Go to Supabase -> Authentication -> SMTP Settings and set:

- Host: `smtp.resend.com`
- Port: `587`
- Username: `resend`
- Password: your Resend API key
- Sender name: `MealEase`
- Sender email: `hello@mealeaseai.com`

This is required so auth emails come from your domain.

## 5. App Deployment

### Vercel

1. Create team `MealEase`.
2. Import GitHub repo.
3. Project name: `mealease-web`.
4. Framework: Next.js.
5. Production branch: `main`.
6. Add all production environment variables before first real deploy.
7. Deploy.

### Custom domains in Vercel

Add domains:

- `mealeaseai.com`
- `www.mealeaseai.com`

Recommended DNS for Vercel:

- A record: `@` -> `76.76.21.21`
- CNAME: `www` -> `cname.vercel-dns.com`

Make `mealeaseai.com` the primary domain.

### Vercel Cron

Add these cron jobs in Vercel:

1. `/api/email/reminders?type=dinner`
   - `0 21 * * *`
2. `/api/email/reminders?type=weekly`
   - `0 9 * * MON`
3. `/api/email/reminders?type=admin-summary`
   - `0 10 * * MON`

Set `CRON_SECRET` in Vercel.

## 6. Monitoring and Analytics

### PostHog

1. Create project `MealEase Production`.
2. Use US region.
3. Copy the project API key.
4. Set host to `https://us.i.posthog.com`.

Minimum events to verify:

- `landing_page_view`
- `signup_started`
- `signup_completed`
- `meal_generated`
- `swipe_action`
- `paywall_view`
- `subscription_success`

Note: the current codebase uses `meal_generated`, not `instant_meal_generated`.

### Sentry

1. Create org `mealease`.
2. Create project `mealease-web`.
3. Platform: Next.js.
4. Copy DSN.
5. Create auth token for source maps.
6. Save DSN, org slug, project slug, auth token.

## 7. AI Providers

Set up both providers.

### OpenAI

- Create production server key
- Store as `OPENAI_API_KEY`

### Anthropic

- Create production server key
- Store as `ANTHROPIC_API_KEY`

Recommended live strategy based on current code:

- Primary text generation: OpenAI
- Fallback text generation: Anthropic
- Image analysis / vision path: Anthropic

## 8. Pre-Launch Test Flow

Run this exact sequence on the live domain:

1. Open `https://mealeaseai.com`
2. Confirm page loads over HTTPS.
3. Create an account with email/password.
4. Confirm verification email arrives from `hello@mealeaseai.com`.
5. Confirm reply goes to `hello@mealeaseai.com`.
6. Test Google login.
7. Complete onboarding.
8. Generate an instant meal.
9. Trigger swipe interactions.
10. Confirm PostHog events appear.
11. Trigger one browser error and confirm it reaches Sentry.
12. Trigger one server-side error in a preview environment and confirm it reaches Sentry.
13. Manually call the reminders endpoint with the bearer secret.
14. Confirm admin alerts go to `hello@mealeaseai.com`.

## 9. Launch Blockers to Watch

Do not announce publicly until these are true:

- Domain verified and SSL active
- Auth emails use Resend SMTP
- Google sign-in works
- PostHog receives production events
- Sentry receives browser and server events
- Reminder cron is configured if reminders are part of launch
- AI generation works with both providers available

Important product note:

- Stripe env vars exist in the app, but billing is not fully wired yet. Do not market live paid subscriptions until checkout and webhook handling are actually implemented.