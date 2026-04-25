import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { syncSubscriptionToProfile, clearSubscription } from '@/lib/stripe/sync'

// ─── POST /api/stripe/webhook ─────────────────────────────────────────────────

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // Use unknown cast to avoid Stripe v22 Event type complexity
  let event: { type: string; data: { object: unknown } }

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret) as unknown as typeof event
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error'
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as { id: string }
        await syncSubscriptionToProfile(supabase, sub.id)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as { id: string }
        await clearSubscription(supabase, sub.id)
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as { subscription?: string }
        if (session.subscription) {
          await syncSubscriptionToProfile(supabase, session.subscription)
        }
        break
      }

      default:
        break
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Handler error'
    console.error('[stripe/webhook] handler error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
