import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/client'
import { createSupabaseServiceClient } from '@/lib/supabase/service'
import { syncSubscriptionToProfile, clearSubscription } from '@/lib/stripe/sync'
import {
  alertAdminBillingEvent,
  alertAdminFailedPayment,
  alertAdminNewPro,
  sendCancellationConfirmationEmail,
  sendFailedPaymentEmail,
  sendPaymentReceiptEmail,
  sendProConfirmationEmail,
  sendRefundConfirmationEmail,
  sendTrialStartedEmail,
} from '@/lib/email/triggers'

type ProfileForEmail = {
  id: string
  email: string | null
  full_name: string | null
}

function firstName(profile?: ProfileForEmail | null): string | undefined {
  return profile?.full_name?.split(' ')[0] || undefined
}

function formatMoney(cents?: number | null, currency = 'usd'): string | undefined {
  if (typeof cents !== 'number') return undefined
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

async function getProfileByCustomer(customerId: string): Promise<ProfileForEmail | null> {
  const supabase = createSupabaseServiceClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()
  return (data as ProfileForEmail | null) ?? null
}

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
    const supabase = createSupabaseServiceClient()

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as {
          id: string
          status?: string
          customer?: string | { id: string }
          trial_end?: number | null
        }
        await syncSubscriptionToProfile(supabase, sub.id)
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
        if (customerId && sub.status === 'trialing') {
          const profile = await getProfileByCustomer(customerId)
          if (profile?.email) {
            void sendTrialStartedEmail({
              to: profile.email,
              firstName: firstName(profile),
              trialEndDate: sub.trial_end
                ? new Date(sub.trial_end * 1000).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : undefined,
              subscriptionId: sub.id,
            })
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as { id: string; customer?: string | { id: string } }
        await clearSubscription(supabase, sub.id)
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
        if (customerId) {
          const profile = await getProfileByCustomer(customerId)
          if (profile?.email) {
            void sendCancellationConfirmationEmail({
              to: profile.email,
              firstName: firstName(profile),
              subscriptionId: sub.id,
            })
            void alertAdminBillingEvent({
              title: 'Subscription cancelled',
              userEmail: profile.email,
              userId: profile.id,
              event: 'customer.subscription.deleted',
            })
          }
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as { subscription?: string; customer?: string | { id: string } }
        if (session.subscription) {
          await syncSubscriptionToProfile(supabase, session.subscription)
        }
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
        if (customerId) {
          const profile = await getProfileByCustomer(customerId)
          if (profile?.email) {
            void sendProConfirmationEmail({
              to: profile.email,
              firstName: firstName(profile),
              planName: 'Plus',
              subscriptionId: session.subscription,
            })
            void alertAdminNewPro({
              userEmail: profile.email,
              userId: profile.id,
              planName: 'Plus',
            })
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as {
          id?: string
          customer?: string
          amount_paid?: number
          currency?: string
          created?: number
          hosted_invoice_url?: string
          invoice_pdf?: string
        }
        if (!invoice.customer) break
        const profile = await getProfileByCustomer(invoice.customer)
        if (profile?.email) {
          void sendPaymentReceiptEmail({
            to: profile.email,
            firstName: firstName(profile),
            amount: formatMoney(invoice.amount_paid, invoice.currency) ?? 'Paid',
            date: invoice.created
              ? new Date(invoice.created * 1000).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            invoiceId: invoice.id,
            invoiceUrl: invoice.hosted_invoice_url ?? invoice.invoice_pdf,
            planName: 'Plus',
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as {
          id?: string
          customer?: string
          amount_due?: number
          currency?: string
          hosted_invoice_url?: string
        }
        if (!invoice.customer) break
        const profile = await getProfileByCustomer(invoice.customer)
        if (profile?.email) {
          const amount = formatMoney(invoice.amount_due, invoice.currency)
          void sendFailedPaymentEmail({
            to: profile.email,
            firstName: firstName(profile),
            amount,
            invoiceId: invoice.id,
            invoiceUrl: invoice.hosted_invoice_url,
          })
          void alertAdminFailedPayment({
            userEmail: profile.email,
            userId: profile.id,
            amount,
            reason: 'Stripe invoice.payment_failed',
          })
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as {
          customer?: string
          amount_refunded?: number
          currency?: string
          refunds?: { data?: Array<{ id?: string; amount?: number }> }
        }
        if (!charge.customer) break
        const profile = await getProfileByCustomer(charge.customer)
        const refund = charge.refunds?.data?.[0]
        if (profile?.email) {
          const amount = formatMoney(refund?.amount ?? charge.amount_refunded, charge.currency)
          void sendRefundConfirmationEmail({
            to: profile.email,
            firstName: firstName(profile),
            amount,
            refundId: refund?.id,
          })
          void alertAdminBillingEvent({
            title: 'Refund processed',
            userEmail: profile.email,
            userId: profile.id,
            event: 'charge.refunded',
            amount,
          })
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
