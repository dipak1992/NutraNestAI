/**
 * Unified AI text-generation service.
 * Provider priority: OpenAI (gpt-4o) → Anthropic (claude-opus-4-5).
 * Each call is wrapped with a 30-second AbortSignal timeout.
 */
import logger from '@/lib/logger'

const TIMEOUT_MS = 30_000

export interface AITextOptions {
  /** System instruction */
  system: string
  /** User message */
  user: string
  /** Max output tokens (default 8192) */
  maxTokens?: number
}

export interface AITextResult {
  text: string
  provider: 'openai' | 'anthropic'
}

// ── OpenAI ────────────────────────────────────────────────────────────────────

async function callOpenAI(opts: AITextOptions): Promise<AITextResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')

  const { default: OpenAI } = await import('openai')
  const client = new OpenAI({ apiKey })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await client.chat.completions.create(
      {
        model: 'gpt-4o',
        max_tokens: opts.maxTokens ?? 8192,
        messages: [
          { role: 'system', content: opts.system },
          { role: 'user', content: opts.user },
        ],
      },
      { signal: controller.signal }
    )

    const text = response.choices[0]?.message?.content ?? ''
    return { text, provider: 'openai' }
  } finally {
    clearTimeout(timer)
  }
}

// ── Anthropic ─────────────────────────────────────────────────────────────────

async function callAnthropic(opts: AITextOptions): Promise<AITextResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'mock') throw new Error('ANTHROPIC_API_KEY not set')

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const message = await client.messages.create(
      {
        model: 'claude-opus-4-5',
        max_tokens: opts.maxTokens ?? 8192,
        system: opts.system,
        messages: [{ role: 'user', content: opts.user }],
      },
      { signal: controller.signal }
    )

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected Anthropic response type')
    return { text: content.text, provider: 'anthropic' }
  } finally {
    clearTimeout(timer)
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Call AI with automatic provider fallback.
 * Tries OpenAI first; if unavailable or erroring, falls back to Anthropic.
 */
export async function generateText(opts: AITextOptions): Promise<AITextResult> {
  // Try OpenAI first if key is configured
  if (process.env.OPENAI_API_KEY) {
    try {
      const result = await callOpenAI(opts)
      logger.info('[ai/service] Generated via OpenAI')
      return result
    } catch (err) {
      logger.warn('[ai/service] OpenAI failed, falling back to Anthropic', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  // Fall back to Anthropic
  const result = await callAnthropic(opts)
  logger.info('[ai/service] Generated via Anthropic')
  return result
}

/**
 * Strip markdown code fences from an AI JSON response.
 */
export function stripJsonFences(text: string): string {
  let clean = text.trim()
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }
  return clean
}
