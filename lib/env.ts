/**
 * Centralised environment variable access.
 * Server-side vars are kept in a server-only object; public vars are safe to import anywhere.
 */

// ─── Public (browser-safe) ────────────────────────────────────────────────────

export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mealeaseai.com',
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '',
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  // Stripe price IDs (public, used on client for pricing display)
  stripePricingTierPro: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY ?? '',
  },
  stripePricingTierFamily: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_FAMILY_MONTHLY ?? '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_FAMILY_YEARLY ?? '',
  },
} as const

// ─── Server-only ──────────────────────────────────────────────────────────────

export const serverEnv = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  openaiApiKey: process.env.OPENAI_API_KEY ?? '',
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  sentryDsn: process.env.SENTRY_DSN ?? '',
  // Stripe server-side keys
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  // Stripe price IDs (server-side backup)
  stripePricingTierPro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? '',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? '',
  },
  stripePricingTierFamily: {
    monthly: process.env.STRIPE_PRICE_FAMILY_MONTHLY ?? '',
    yearly: process.env.STRIPE_PRICE_FAMILY_YEARLY ?? '',
  },
  // Trial configuration
  stripeTrialDays: parseInt(process.env.STRIPE_TRIAL_DAYS ?? '7', 10),
  adminEmail: process.env.ADMIN_EMAIL ?? '',
} as const

// ─── Runtime validation (call once at startup for critical keys) ──────────────

export function assertEnv(
  keys: Array<keyof typeof serverEnv | keyof typeof publicEnv>,
  context = 'startup'
) {
  const all = { ...publicEnv, ...serverEnv }
  const missing = keys.filter((k) => !all[k])
  if (missing.length > 0) {
    throw new Error(`[env] Missing required env vars in ${context}: ${missing.join(', ')}`)
  }
}
