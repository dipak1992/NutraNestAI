import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { serverEnv } from '@/lib/env'
import { stripe } from '@/lib/stripe/client'
import { PLANS, type PlanId } from '@/lib/stripe/plans'
import { isStripePriceId, normalizeStripePriceId } from '@/lib/stripe/price-id'
import { getCurrentBrand } from '@/lib/stripe/brands'

// ─── POST /api/stripe/checkout ────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { planId } = await req.json() as { planId: PlanId }
    const plan = PLANS[planId]
    const priceId = normalizeStripePriceId(plan?.stripePriceId)
    if (!priceId || !isStripePriceId(priceId)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Multi-brand: get current brand config
    const brand = getCurrentBrand()

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()

    let customerId: string | undefined = profile?.stripe_customer_id ?? undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email ?? undefined,
        metadata: {
          supabase_user_id: user.id,
          brand: brand.id,
        },
      })
      customerId = customer.id
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}${brand.successUrlPattern}`,
      cancel_url: `${origin}${brand.cancelUrlPattern}`,
      // Multi-brand: per-session statement descriptor
      payment_intent_data: {
        statement_descriptor_suffix: brand.statementDescriptorSuffix,
      },
      metadata: {
        supabase_user_id: user.id,
        plan_id: planId,
        brand: brand.id,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan_id: planId,
          brand: brand.id,
        },
        ...(serverEnv.stripeTrialDays > 0
          ? { trial_period_days: serverEnv.stripeTrialDays }
          : {}),
      },
      // Multi-brand: custom branding for checkout page
      custom_text: {
        submit: {
          message: `Subscribe to ${brand.displayName} Plus. Billed by DDS Supply LLC.`,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
