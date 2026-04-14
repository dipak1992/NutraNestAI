import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/service'
import { resend, EMAIL_ADMIN, EMAIL_FROM } from '@/lib/email/client'

// Resend sends a `svix-signature` header for verification
// https://resend.com/docs/dashboard/webhooks/introduction

interface ResendWebhookPayload {
  type: string
  created_at: string
  data: {
    email_id?: string
    from?: string
    to?: string[]
    subject?: string
    bounce?: { message: string }
    complaint?: { userAgent: string }
    [key: string]: unknown
  }
}

export async function POST(request: NextRequest) {
  // ── Signature verification ───────────────────────────────────────────────
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
  if (webhookSecret) {
    const signature = request.headers.get('svix-signature')
    const msgId = request.headers.get('svix-id')
    const msgTs = request.headers.get('svix-timestamp')

    if (!signature || !msgId || !msgTs) {
      return NextResponse.json({ error: 'Missing signature headers' }, { status: 401 })
    }

    try {
      const { Webhook } = await import('svix')
      const wh = new Webhook(webhookSecret)
      const body = await request.text()
      wh.verify(body, {
        'svix-id': msgId,
        'svix-timestamp': msgTs,
        'svix-signature': signature,
      })
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  let payload: ResendWebhookPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { type, data } = payload
  const emailId = data?.email_id
  const recipient = data?.to?.[0] ?? 'unknown'

  // ── Idempotency — skip duplicate events ──────────────────────────────────
  const supabase = createSupabaseServiceClient()

  const resendEventId = request.headers.get('svix-id')
  if (resendEventId) {
    const { data: existing } = await supabase
      .from('email_webhook_events')
      .select('id')
      .eq('resend_event_id', resendEventId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true })
    }
  }

  // ── Store event ──────────────────────────────────────────────────────────
  await supabase.from('email_webhook_events').insert({
    resend_event_id: resendEventId,
    event_type: type,
    email_id: emailId,
    recipient,
    payload,
  })

  // ── Update email_logs if we have a resend message ID ─────────────────────
  if (emailId) {
    if (type === 'email.bounced') {
      await supabase
        .from('email_logs')
        .update({ status: 'bounced' })
        .eq('resend_message_id', emailId)
    } else if (type === 'email.complained') {
      await supabase
        .from('email_logs')
        .update({ status: 'complained' })
        .eq('resend_message_id', emailId)
    }
  }

  // ── Alert admin on critical events ───────────────────────────────────────
  if (type === 'email.bounced' || type === 'email.complained' || type === 'email.failed') {
    const label = type === 'email.bounced'
      ? 'Bounce'
      : type === 'email.complained'
        ? 'Spam complaint'
        : 'Delivery failure'

    const reason =
      data.bounce?.message ?? data.complaint?.userAgent ?? 'No detail provided'

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: [EMAIL_ADMIN],
        subject: `[MealEase] ⚠️ ${label} — ${recipient}`,
        html: `
          <p><strong>${label}</strong></p>
          <p><strong>Email ID:</strong> ${emailId ?? 'N/A'}</p>
          <p><strong>Recipient:</strong> ${recipient}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p><strong>Event type:</strong> ${type}</p>
          <p><em>${new Date().toISOString()}</em></p>
        `,
      })
    } catch {
      // Non-fatal — best effort
    }
  }

  return NextResponse.json({ ok: true })
}
