/**
 * Simple in-memory rate limiter — Vercel-compatible (per-instance).
 * Uses a sliding window counter per key (IP or user ID).
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// LRU-style map: evict entries older than 60 s to prevent unbounded memory growth
const store = new Map<string, RateLimitEntry>()

function prune() {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key)
  }
}

export interface RateLimitOptions {
  /** Unique key — e.g. `ip:1.2.3.4` or `user:uuid` */
  key: string
  /** Max requests allowed per window */
  limit: number
  /** Window duration in milliseconds */
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number // epoch ms
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  // Periodically evict stale entries (1 in 50 requests)
  if (Math.random() < 0.02) prune()

  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    // Start a new window
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1, reset: now + windowMs }
  }

  entry.count += 1

  if (entry.count > limit) {
    return { success: false, remaining: 0, reset: entry.resetAt }
  }

  return { success: true, remaining: limit - entry.count, reset: entry.resetAt }
}

/**
 * Convenience: derive a rate-limit key from a Next.js request.
 * Falls back to a server-side constant if no IP is detectable.
 */
export function rateLimitKeyFromRequest(req: { headers: { get(name: string): string | null } }): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `ip:${ip}`
}
