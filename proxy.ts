import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

function buildCsp(nonce: string) {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' https://*.posthog.com https://*.sentry.io`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self' https://*.supabase.co https://*.posthog.com https://*.sentry.io https://api.resend.com https://api.openai.com https://api.anthropic.com`,
    `frame-ancestors 'none'`,
  ].join('; ')
}

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  request.headers.set('x-nonce', nonce)

  try {
    const response = await updateSession(request)
    response.headers.set('Content-Security-Policy', buildCsp(nonce))
    return response
  } catch {
    // Supabase unavailable (e.g. missing env vars) — pass through
    const response = NextResponse.next()
    response.headers.set('Content-Security-Policy', buildCsp(nonce))
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}