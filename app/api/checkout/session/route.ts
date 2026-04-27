// ============================================================
// API: POST /api/checkout/session
// Creates a Stripe Checkout Session for MealEaseAI Pro.
// Uses direct Stripe REST API (no SDK dependency).
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { serverEnv } from '@/lib/env'
import { getSiteUrl } from '@/lib/seo'

type Plan = 'pro_monthly' | 'pro_yearly'

const PRICE_IDS: Record<Plan, string | undefined> = {
  pro_monthly: serverEnv.stripePricingTierPro.monthly,
  pro_yearly:  serverEnv.stripePricingTierPro.yearly,
}

const PLAN_DISPLAY_NAMES: Record<Plan, string> = {
  pro_monthly: 'Pro',
  pro_yearly:  'Pro',
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

    const priceId = PRICE_IDS[plan]
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

    const site = getSiteUrl().replace(/\/$/, '')
    const tier = PLAN_TIERS[plan]

    // Stripe Checkout Session via REST API
    const body = new URLSearchParams()
    body.set('mode', 'subscription')
    body.set('line_items[0][price]', priceId)
    body.set('line_items[0][quantity]', '1')
    body.set('success_url', `${site}/dashboard?welcome=${plan}&session_id={CHECKOUT_SESSION_ID}`)
    body.set('cancel_url', `${site}/pricing?cancelled=1`)
    body.set('customer_email', user.email ?? '')
    body.set('client_reference_id', user.id)
    body.set('allow_promotion_codes', 'true')
    body.set('automatic_tax[enabled]', 'true')
    // Metadata for webhook to extract tier (backup if price ID lookup fails)
    body.set('subscription_data[metadata][user_id]', user.id)
    body.set('subscription_data[metadata][plan]', plan)
    body.set('subscription_data[metadata][tier]', tier)

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serverEnv.stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[checkout/session] Stripe error:', err)
      return NextResponse.json(
        { error: 'Could not start checkout. Please try again.' },
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
