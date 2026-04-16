// ============================================================
// API: POST /api/webhook/stripe
// Handles Stripe webhook events to sync subscription state
// with the Supabase profiles table.
//
// Events handled:
//   checkout.session.completed    → upgrade user to pro
//   customer.subscription.updated → sync tier on plan change
//   customer.subscription.deleted → downgrade to free
//   invoice.payment_failed        → log (no immediate downgrade)
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { serverEnv } from '@/lib/env'
import { publicEnv } from '@/lib/env'

// Use service-role client so we can update any user's profile (bypasses RLS)
function adminSupabase() {
  return createClient(publicEnv.supabaseUrl, serverEnv.supabaseServiceRoleKey)
}

// ── Stripe signature verification (no SDK) ────────────────────────────────────

async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
): Promise<boolean> {
  const parts = Object.fromEntries(
    sigHeader.split(',').map((p) => p.split('=')),
  ) as Record<string, string>

  const timestamp = parts['t']
  const signatures = sigHeader
    .split(',')
    .filter((p) => p.startsWith('v1='))
    .map((p) => p.slice(3))

  if (!timestamp || signatures.length === 0) return false

  // Replay-attack guard: reject webhooks older than 5 minutes
  const age = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (age > 300) {
    console.warn('[stripe-webhook] Rejecting stale event, age:', age, 's')
    return false
  }

  const signedPayload = `${timestamp}.${payload}`
  const keyData = new TextEncoder().encode(secret)
  const msgData = new TextEncoder().encode(signedPayload)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
  const expected = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return signatures.some((sig) => sig === expected)
}

// ── Subscription → tier mapping ───────────────────────────────────────────────

function tierFromStatus(status: string): 'pro' | 'free' {
  // active / trialing = pro; everything else = free
  return status === 'active' || status === 'trialing' ? 'pro' : 'free'
}

// ── Event handlers ────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Record<string, unknown>) {
  const userId = session['client_reference_id'] as string | null
  const customerId = session['customer'] as string | null
  const subscriptionId = session['subscription'] as string | null

  if (!userId || !customerId) {
    console.error('[stripe-webhook] checkout.session.completed missing user/customer')
    return
  }

  const supabase = adminSupabase()
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_tier: 'pro',
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId ?? null,
    })
    .eq('id', userId)

  if (error) {
    console.error('[stripe-webhook] checkout update failed:', error.message)
  } else {
    console.log('[stripe-webhook] upgraded user to pro:', userId)
  }
}

async function handleSubscriptionUpserted(sub: Record<string, unknown>) {
  const customerId = sub['customer'] as string | null
  const subscriptionId = sub['id'] as string | null
  const status = sub['status'] as string
  const priceId = (
    (
      (sub['items'] as Record<string, unknown>)?.['data'] as Array<
        Record<string, unknown>
      >
    )?.[0]?.['price'] as Record<string, unknown> | undefined
  )?.['id'] as string | undefined

  if (!customerId) {
    console.error('[stripe-webhook] subscription event missing customer')
    return
  }

  const tier = tierFromStatus(status)
  const supabase = adminSupabase()

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_tier: tier,
      stripe_subscription_id: subscriptionId ?? null,
      ...(priceId ? { stripe_price_id: priceId } : {}),
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('[stripe-webhook] subscription upsert failed:', error.message)
  } else {
    console.log(`[stripe-webhook] subscription synced → ${tier} for customer:`, customerId)
  }
}

async function handleSubscriptionDeleted(sub: Record<string, unknown>) {
  const customerId = sub['customer'] as string | null
  if (!customerId) return

  const supabase = adminSupabase()
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_tier: 'free',
      stripe_subscription_id: null,
      stripe_price_id: null,
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('[stripe-webhook] subscription delete failed:', error.message)
  } else {
    console.log('[stripe-webhook] downgraded to free for customer:', customerId)
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const webhookSecret = serverEnv.stripeWebhookSecret
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const sigHeader = req.headers.get('stripe-signature') ?? ''
  const payload = await req.text()

  const valid = await verifyStripeSignature(payload, sigHeader, webhookSecret)
  if (!valid) {
    console.warn('[stripe-webhook] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: { type: string; data: { object: Record<string, unknown> } }
  try {
    event = JSON.parse(payload)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpserted(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break

      case 'invoice.payment_failed':
        console.warn(
          '[stripe-webhook] payment_failed for customer:',
          event.data.object['customer'],
        )
        break

      default:
        // Ignore unhandled event types
        break
    }
  } catch (err) {
    console.error('[stripe-webhook] handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
