import { NextRequest, NextResponse } from 'next/server'
import { generateMealPlan } from '@/lib/ai/meal-generator'
import type { AIGenerationRequest } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as AIGenerationRequest

    if (!body.household || !body.members || !body.week_start) {
      return NextResponse.json({ error: 'Missing required fields: household, members, week_start' }, { status: 400 })
    }

    const plan = await generateMealPlan(body)
    return NextResponse.json(plan)
  } catch (err) {
    console.error('[generate-plan]', err)
    return NextResponse.json({ error: 'Failed to generate meal plan' }, { status: 500 })
  }
}
