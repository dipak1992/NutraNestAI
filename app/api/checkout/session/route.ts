// ============================================================
// API: POST /api/checkout/session
// Creates a Stripe Checkout Session with multi-brand support.
// Uses direct Stripe REST API (no SDK dependency).
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { serverEnv } from '@/lib/env'
import { getSiteUrl } from '@/lib/seo'
import { isStripePriceId, normalizeStripePriceId } from '@/lib/stripe/price-id'
import { getCurrentBrand } from '@/lib/stripe/brands'

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

    // Multi-brand: get current brand config
    const brand = getCurrentBrand()
    const site = getSiteUrl().replace(/\/$/, '')
    const tier = PLAN_TIERS[plan]

    // Stripe Checkout Session via REST API
    const body = new URLSearchParams()
    body.set('mode', 'subscription')
    body.set('line_items[0][price]', priceId)
    body.set('line_items[0][quantity]', '1')
    body.set('success_url', `${site}${brand.successUrlPattern}&session_id={CHECKOUT_SESSION_ID}`)
    body.set('cancel_url', `${site}${brand.cancelUrlPattern}`)
    body.set('client_reference_id', user.id)

    // Multi-brand: statement descriptor suffix
    // Customer sees: "DDS SUPPLY* MEALEASE" on their bank statement
    body.set('payment_intent_data[statement_descriptor_suffix]', brand.statementDescriptorSuffix)

    // Multi-brand: custom text on checkout page
    body.set('custom_text[submit][message]', `Subscribe to ${brand.displayName} Plus. Billed by DDS Supply LLC.`)

    // Metadata for webhook to extract tier + brand
    body.set('subscription_data[metadata][user_id]', user.id)
    body.set('subscription_data[metadata][plan]', plan)
    body.set('subscription_data[metadata][tier]', tier)
    body.set('subscription_data[metadata][brand]', brand.id)
    body.set('metadata[brand]', brand.id)
    body.set('metadata[user_id]', user.id)

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
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
