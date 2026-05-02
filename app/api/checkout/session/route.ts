// ============================================================
// API: POST /api/checkout/session
// Creates a Stripe Checkout Session for MealEaseAI Pro.
// Uses direct Stripe REST API (no SDK dependency).
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { serverEnv } from '@/lib/env'
import { getSiteUrl } from '@/lib/seo'
import { isStripePriceId, normalizeStripePriceId } from '@/lib/stripe/price-id'

type Plan = 'pro_monthly' | 'pro_yearly'

const PRICE_IDS: Record<Plan, string | undefined> = {
  pro_monthly: serverEnv.stripePricingTierPro.monthly,
  pro_yearly:  serverEnv.stripePricingTierPro.yearly,
}

const PLAN_TIERS: Record<Plan, 'pro'> = {
  pro_monthly: 'pro',
  pro_yearly:  'pro',
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Login required to upgrade' },
        { status: 401 },
      )
    }

    const { plan } = (await req.json()) as { plan: Plan }
    if (!['pro_monthly', 'pro_yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const priceId = normalizeStripePriceId(PRICE_IDS[plan])
    if (!priceId || !serverEnv.stripeSecretKey) {
      // Stripe not configured yet — gracefully tell the client
      return NextResponse.json(
        {
          error: 'billing_not_configured',
          message: 'Stripe checkout is not live yet. Email hello@mealeaseai.com to upgrade manually.',
        },
        { status: 503 },
      )
    }

    if (!isStripePriceId(priceId)) {
      console.error('[checkout/session] Invalid Stripe price ID configured for plan:', plan)
      return NextResponse.json(
        { error: 'billing_not_configured', message: 'Stripe price ID is invalid.' },
        { status: 503 },
      )
    }

    // Validate origin against allowlist to prevent post-payment redirect to phishing pages
    const ALLOWED_ORIGINS = [
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.NEXT_PUBLIC_SITE_URL,
      'https://mealeaseai.com',
      'https://www.mealeaseai.com',
      'http://localhost:3000',
    ].filter(Boolean) as string[]
    const rawOrigin = req.headers.get('origin') ?? ''
    const site = ALLOWED_ORIGINS.includes(rawOrigin)
      ? rawOrigin.replace(/\/$/, '')
      : getSiteUrl().replace(/\/$/, '')
    const tier = PLAN_TIERS[plan]

    // Stripe Checkout Session via REST API
    const body = new URLSearchParams()
    body.set('mode', 'subscription')
    body.set('line_items[0][price]', priceId)
    body.set('line_items[0][quantity]', '1')
    body.set('success_url', `${site}/dashboard?welcome=${plan}&session_id={CHECKOUT_SESSION_ID}`)
    body.set('cancel_url', `${site}/upgrade?cancelled=1`)
    body.set('client_reference_id', user.id)
    // Metadata for webhook to extract tier (backup if price ID lookup fails)
    body.set('subscription_data[metadata][user_id]', user.id)
    body.set('subscription_data[metadata][plan]', plan)
    body.set('subscription_data[metadata][tier]', tier)
    if (serverEnv.stripeTrialDays > 0) {
      body.set('subscription_data[trial_period_days]', String(serverEnv.stripeTrialDays))
    }
    // Pass email only if available (avoids conflict if customer already exists)
    if (user.email) {
      body.set('customer_email', user.email)
    }

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serverEnv.stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    if (!res.ok) {
      let stripeError = 'Unknown Stripe error'
      try {
        const errJson = await res.json() as { error?: { message?: string } }
        stripeError = errJson?.error?.message ?? stripeError
      } catch {
        stripeError = await res.text().catch(() => stripeError)
      }
      console.error('[checkout/session] Stripe error:', stripeError)
      return NextResponse.json(
        { error: stripeError || 'Could not start checkout. Please try again.' },
        { status: 502 },
      )
    }

    const session = (await res.json()) as { id: string; url: string }
    return NextResponse.json({ url: session.url, id: session.id })
  } catch (err) {
    console.error('[checkout/session] unexpected error:', err)
    return NextResponse.json({ error: 'Payment setup failed. Please try again.' }, { status: 500 })
  }
}
