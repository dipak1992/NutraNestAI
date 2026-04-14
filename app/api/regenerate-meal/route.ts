import { NextRequest, NextResponse } from 'next/server'
import { regenerateMeals } from '@/lib/ai/meal-generator'
import type { AIGenerationRequest } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { request: AIGenerationRequest; modifier: string }

    if (!body.request || !body.modifier) {
      return NextResponse.json({ error: 'Missing required fields: request, modifier' }, { status: 400 })
    }

    const plan = await regenerateMeals(body.request, body.modifier)
    return NextResponse.json(plan)
  } catch (err) {
    console.error('[regenerate-meal]', err)
    return NextResponse.json({ error: 'Failed to regenerate meals' }, { status: 500 })
  }
}
