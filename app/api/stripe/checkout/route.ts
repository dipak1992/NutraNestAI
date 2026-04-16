import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { publicEnv } from '@/lib/env'
import { apiError, apiSuccess, withErrorHandler } from '@/lib/api-response'

export const POST = withErrorHandler('stripe-checkout', async (req: Request) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return apiError('Unauthorized', 401)
  }

  const { priceId } = (await req.json()) as { priceId?: string }
  if (!priceId || typeof priceId !== 'string') {
    return apiError('Missing priceId', 400)
  }

  const stripe = getStripe()

  // Fetch or create Stripe customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${publicEnv.siteUrl}/dashboard?checkout=success`,
    cancel_url: `${publicEnv.siteUrl}/pricing?checkout=cancelled`,
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
  })

  return apiSuccess({ url: session.url })
})
