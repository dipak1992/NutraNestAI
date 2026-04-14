import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'

const SYSTEM_PROMPT = `You are a food recognition assistant. Analyze the image and determine:
1. Is this a photo of INGREDIENTS/GROCERIES, or a PREPARED MEAL/DISH?
2. Based on what you see, extract the relevant information.

Rules:
- If ingredients/groceries: list each ingredient you can identify, comma-separated. Be specific (e.g. "chicken breast" not just "meat").
- If a prepared meal/dish: describe the meal in one short phrase (e.g. "creamy mushroom pasta with parmesan").
- If you cannot identify food in the image, respond with type "unknown".

Respond ONLY with valid JSON in this exact format:
{"type": "ingredients" | "inspiration" | "unknown", "result": "your comma-separated ingredients OR meal description OR empty string"}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { image, mimeType } = body as { image?: string; mimeType?: string }

    if (!image || !mimeType) {
      return NextResponse.json(
        { error: 'Missing image or mimeType' },
        { status: 400 },
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Image analysis is not configured. Please set ANTHROPIC_API_KEY.' },
        { status: 503 },
      )
    }

    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: image,
              },
            },
            {
              type: 'text',
              text: SYSTEM_PROMPT,
            },
          ],
        },
      ],
    })

    const text =
      message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { type: 'unknown', result: '' },
        { status: 200 },
      )
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      type: string
      result: string
    }

    if (!['ingredients', 'inspiration', 'unknown'].includes(parsed.type)) {
      parsed.type = 'unknown'
    }

    return NextResponse.json({
      type: parsed.type,
      result: parsed.result || '',
    })
  } catch (err) {
    console.error('[analyze-image] Error:', err)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 },
    )
  }
}
