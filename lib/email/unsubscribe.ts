import { createHmac } from 'crypto'

const SECRET = process.env.UNSUBSCRIBE_SECRET ?? process.env.CRON_SECRET ?? 'default-unsub-secret'

/**
 * Generate an HMAC-signed unsubscribe token for a user.
 */
export function generateUnsubscribeToken(userId: string): string {
  const hmac = createHmac('sha256', SECRET)
  hmac.update(userId)
  return `${userId}.${hmac.digest('hex')}`
}

/**
 * Verify and extract userId from an unsubscribe token.
 */
export function verifyUnsubscribeToken(token: string): string | null {
  const dotIdx = token.indexOf('.')
  if (dotIdx === -1) return null

  const userId = token.slice(0, dotIdx)
  const sig = token.slice(dotIdx + 1)

  const hmac = createHmac('sha256', SECRET)
  hmac.update(userId)
  const expected = hmac.digest('hex')

  // Constant-time comparison
  if (sig.length !== expected.length) return null
  const a = Buffer.from(sig, 'hex')
  const b = Buffer.from(expected, 'hex')
  if (a.length !== b.length) return null

  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i]
  }
  return diff === 0 ? userId : null
}
