import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { serverEnv } from '@/lib/env'
import { createSupabaseServiceClient } from '@/lib/supabase/service'
import logger from '@/lib/logger'
import { getPostHogClient } from '@/lib/posthog-server'
import {
  sendProConfirmationEmail,
  sendPaymentReceiptEmail,
  sendTrialStartedEmail,
  alertAdminNewPro,
  alertAdminFailedPayment,
} from '@/lib/email/triggers'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const stripe = getStripe()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, serverEnv.stripeWebhookSecret)
  } catch (err) {
    logger.error('[stripe-webhook] Signature verification failed', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createSupabaseServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.subscription
          ? (await stripe.subscriptions.retrieve(session.subscription as string)).metadata
              .supabase_user_id
          : session.metadata?.supabase_user_id

        if (userId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = sub.items.data[0]?.price.id

          await supabase
            .from('profiles')
            .update({
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              stripe_price_id: priceId,
              subscription_tier: 'pro',
            })
            .eq('id', userId)

          logger.info('[stripe-webhook] Checkout completed', { userId })
          const posthog = getPostHogClient()
          posthog.capture({
            distinctId: userId,
            event: 'subscription_activated',
            properties: { price_id: priceId, stripe_subscription_id: session.subscription as string },
          })

          // Send pro confirmation + admin alert (non-blocking)
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', userId)
            .single()

          if (profile?.email) {
            const firstName = profile.full_name?.split(' ')[0]
            void sendProConfirmationEmail({ to: profile.email, firstName })
            void alertAdminNewPro({ userEmail: profile.email, userId })
          }
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId =
          typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.toString()

        if (customerId) {
          // Find user by stripe_customer_id
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .eq('stripe_customer_id', customerId)
            .single()

          if (profile) {
            await supabase.from('receipts').insert({
              user_id: profile.id,
              stripe_invoice_id: invoice.id,
              stripe_charge_id:
                typeof (invoice as unknown as Record<string, unknown>).charge === 'string'
                  ? (invoice as unknown as Record<string, string>).charge
                  : null,
              amount_cents: invoice.amount_paid,
              currency: invoice.currency,
              status: 'paid',
              description: invoice.description ?? `Invoice ${invoice.number}`,
              period_start: invoice.period_start
                ? new Date(invoice.period_start * 1000).toISOString()
                : null,
              period_end: invoice.period_end
                ? new Date(invoice.period_end * 1000).toISOString()
                : null,
              receipt_url: invoice.hosted_invoice_url,
            })

            logger.info('[stripe-webhook] Receipt recorded', {
              userId: profile.id,
              invoiceId: invoice.id,
            })

            // Send payment receipt email (non-blocking)
            if (profile.email) {
              const firstName = profile.full_name?.split(' ')[0]
              const amountFormatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: invoice.currency.toUpperCase(),
              }).format(invoice.amount_paid / 100)
              void sendPaymentReceiptEmail({
                to: profile.email,
                firstName,
                amount: amountFormatted,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                invoiceId: invoice.number ?? invoice.id,
              })
            }
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata.supabase_user_id
        if (userId) {
          const isActive = sub.status === 'active' || sub.status === 'trialing'
          await supabase
            .from('profiles')
            .update({
              subscription_tier: isActive ? 'pro' : 'free',
              stripe_price_id: sub.items.data[0]?.price.id ?? null,
            })
            .eq('id', userId)

          logger.info('[stripe-webhook] Subscription updated', {
            userId,
            status: sub.status,
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata.supabase_user_id
        if (userId) {
          await supabase
            .from('profiles')
            .update({
              subscription_tier: 'free',
              stripe_subscription_id: null,
              stripe_price_id: null,
            })
            .eq('id', userId)

          logger.info('[stripe-webhook] Subscription cancelled', { userId })
          const posthog = getPostHogClient()
          posthog.capture({
            distinctId: userId,
            event: 'subscription_cancelled',
            properties: { stripe_subscription_id: sub.id },
          })
        }
        break
      }

      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata.supabase_user_id
        if (userId && sub.status === 'trialing' && sub.trial_end) {
          const trialEndDate = new Date(sub.trial_end * 1000)
          const trialDays = Math.round((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          const trialEndDateFormatted = trialEndDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })

          // Persist trial_ends_at so the cron can query it
          await supabase
            .from('profiles')
            .update({ trial_ends_at: trialEndDate.toISOString() })
            .eq('id', userId)

          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', userId)
            .single()

          if (profile?.email) {
            const firstName = profile.full_name?.split(' ')[0]
            void sendTrialStartedEmail({
              to: profile.email,
              firstName,
              trialDays,
              trialEndDate: trialEndDateFormatted,
            })
          }

          logger.info('[stripe-webhook] Trial started', { userId, trialEnd: trialEndDate.toISOString() })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId =
          typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.toString()

        if (customerId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .eq('stripe_customer_id', customerId)
            .single()

          if (profile?.email) {
            logger.warn('[stripe-webhook] Payment failed', { userId: profile.id, invoiceId: invoice.id })
            void alertAdminFailedPayment({ userEmail: profile.email, userId: profile.id })
          }
        }
        break
      }

      default:
        logger.info('[stripe-webhook] Unhandled event type', { type: event.type })
    }
  } catch (err) {
    logger.error('[stripe-webhook] Error processing event', {
      type: event.type,
      error: err instanceof Error ? err.message : String(err),
    })
    // Return 200 anyway to prevent Stripe retries on app errors
  }

  return NextResponse.json({ received: true })
}
