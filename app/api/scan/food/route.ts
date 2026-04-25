import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { FoodResult } from '@/lib/scan/types'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Food scans are unlimited for all users — no gating needed

  try {
    const formData = await req.formData()
    const image = formData.get('image') as File | null

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // TODO: Replace with real AI analysis (OpenAI Vision / Anthropic Claude)
    const result: FoodResult = {
      name: 'Chicken Caesar Salad',
      calories: 480,
      protein: 38,
      carbs: 22,
      fat: 28,
      fiber: 4,
      sugar: 3,
      sodium: 820,
      servingSize: '1 large bowl (~400g)',
      warnings: [
        'High in sodium (820mg — 36% of daily value)',
        'Caesar dressing adds significant saturated fat',
      ],
      positives: [
        'Excellent source of protein (38g)',
        'Good source of vitamin K from romaine',
        'Moderate calorie count for a filling meal',
      ],
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/scan/food]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
