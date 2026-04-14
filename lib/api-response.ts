import { NextResponse } from 'next/server'
import logger from './logger'

/** Standard success envelope */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

/** Standard error envelope — never exposes internal details */
export function apiError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status })
}

/** Rate-limit exceeded response */
export function apiRateLimited(reset?: number) {
  const headers: Record<string, string> = { 'Retry-After': '60' }
  if (reset) headers['X-RateLimit-Reset'] = String(Math.ceil(reset / 1000))
  return NextResponse.json(
    { success: false, error: 'Too many requests. Please slow down.' },
    { status: 429, headers }
  )
}

type RouteHandler = (req: Request, ctx?: unknown) => Promise<Response>

/**
 * Wraps a route handler with a top-level try/catch.
 * Logs unexpected errors and returns a generic 500.
 */
export function withErrorHandler(name: string, handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx)
    } catch (err) {
      logger.error(`[${name}] Unhandled error`, {
        error: err instanceof Error ? err.message : String(err),
      })
      return apiError('An unexpected error occurred. Please try again.', 500)
    }
  }
}
