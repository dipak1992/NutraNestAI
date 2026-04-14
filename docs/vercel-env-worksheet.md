# MealEase Vercel Env Worksheet

Use this as your source of truth when filling in Vercel Project -> Settings -> Environment Variables.

## Production Variables

Copy these names exactly.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_SITE_URL=https://mealeaseai.com

ANTHROPIC_API_KEY=
OPENAI_API_KEY=

RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=

CRON_SECRET=

NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Which ones are required now

Required for current production launch:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `RESEND_WEBHOOK_SECRET`
- `CRON_SECRET`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `SENTRY_DSN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`

Only add Stripe keys if billing is actually implemented before launch.

## Where to get each value

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
  - Supabase -> Project Settings -> API -> Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Supabase -> Project Settings -> API -> anon public key
- `SUPABASE_SERVICE_ROLE_KEY`
  - Supabase -> Project Settings -> API -> service_role secret key

### Site URL

- `NEXT_PUBLIC_SITE_URL`
  - Set manually to `https://mealeaseai.com`

### AI Providers

- `ANTHROPIC_API_KEY`
  - Anthropic console -> API Keys
- `OPENAI_API_KEY`
  - OpenAI dashboard -> API Keys

### Resend

- `RESEND_API_KEY`
  - Resend -> API Keys
- `RESEND_WEBHOOK_SECRET`
  - Resend -> Webhooks -> select webhook -> signing secret

### Cron

- `CRON_SECRET`
  - Generate a long random string yourself
  - Example length: 32 to 64 characters

### PostHog

- `NEXT_PUBLIC_POSTHOG_KEY`
  - PostHog -> Project Settings -> Project API Key
- `NEXT_PUBLIC_POSTHOG_HOST`
  - `https://us.i.posthog.com`

### Sentry

- `SENTRY_DSN`
  - Sentry -> Project Settings -> Client Keys (DSN)
- `SENTRY_ORG`
  - Sentry org slug
- `SENTRY_PROJECT`
  - Sentry project slug
- `SENTRY_AUTH_TOKEN`
  - Sentry -> Settings -> Auth Tokens

### Stripe

- `STRIPE_SECRET_KEY`
  - Stripe dashboard -> Developers -> API keys
- `STRIPE_WEBHOOK_SECRET`
  - Stripe dashboard -> Developers -> Webhooks
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Stripe dashboard -> Developers -> API keys

## Public vs server-only

Safe to expose to browser:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Server-only, never expose in client code:

- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `RESEND_WEBHOOK_SECRET`
- `CRON_SECRET`
- `SENTRY_AUTH_TOKEN`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Runtime or build-time sensitive:

- `SENTRY_DSN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

## Local development starter file

Create `.env.local` from this template:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

NEXT_PUBLIC_SITE_URL=http://localhost:3000

ANTHROPIC_API_KEY=YOUR_ANTHROPIC_KEY
OPENAI_API_KEY=YOUR_OPENAI_KEY

RESEND_API_KEY=YOUR_RESEND_KEY
RESEND_WEBHOOK_SECRET=YOUR_RESEND_WEBHOOK_SECRET

CRON_SECRET=YOUR_RANDOM_CRON_SECRET

NEXT_PUBLIC_POSTHOG_KEY=YOUR_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

SENTRY_DSN=YOUR_SENTRY_DSN
SENTRY_ORG=YOUR_SENTRY_ORG
SENTRY_PROJECT=YOUR_SENTRY_PROJECT
SENTRY_AUTH_TOKEN=YOUR_SENTRY_AUTH_TOKEN
```

Add Stripe keys only if billing is implemented.

## Vercel entry checklist

For each variable in Vercel:

1. Add to Production.
2. Add to Preview if preview testing needs that integration.
3. Save.
4. Redeploy after env changes.

Recommended minimum Preview envs:

- Supabase vars
- Site URL for preview if needed
- AI keys
- Resend key only if you want preview email tests
- PostHog vars
- Sentry vars

If you use production PostHog in Preview, filter preview traffic in dashboards.