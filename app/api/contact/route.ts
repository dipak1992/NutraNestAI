import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendSupportConfirmationEmail } from '@/lib/email/triggers'
import { alertAdminContactForm } from '@/lib/email/triggers'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const { name, email, message } = parsed.data

  // Fire both in parallel — neither should block the response
  const [userResult, adminResult] = await Promise.allSettled([
    sendSupportConfirmationEmail({ to: email, firstName: name }),
    alertAdminContactForm({ senderEmail: email, senderName: name, message }),
  ])

  const userOk = userResult.status === 'fulfilled' && userResult.value.success

  return NextResponse.json({ ok: true, confirmed: userOk })
}
