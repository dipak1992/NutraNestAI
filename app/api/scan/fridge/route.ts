import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAndIncrementScanUsage } from '@/lib/scan/gating'
import { validateScanImage } from '@/lib/scan/upload-validation'
import type { FridgeResult } from '@/lib/scan/types'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check plan for gating
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single()

  const isPlusMember = profile?.subscription_tier === 'plus' || profile?.subscription_tier === 'pro'

  // Gate check (3 fridge scans/week for free users)
  const gateReason = await checkAndIncrementScanUsage(user.id, 'fridge', isPlusMember)
  if (gateReason) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', reason: gateReason },
      { status: 429 }
    )
  }

  try {
    const formData = await req.formData()
    const image = formData.get('image') as File | null

    const imageError = validateScanImage(image)
    if (imageError) return imageError

    // TODO: Replace with real AI analysis (OpenAI Vision / Anthropic Claude)
    const result: FridgeResult = {
      ingredients: [
        { id: '1', name: 'Eggs', quantity: '6', unit: '', emoji: '🥚' },
        { id: '2', name: 'Milk', quantity: '1', unit: 'L', emoji: '🥛' },
        { id: '3', name: 'Cheddar cheese', quantity: '200', unit: 'g', emoji: '🧀' },
        { id: '4', name: 'Bell pepper', quantity: '2', unit: '', emoji: '🫑' },
        { id: '5', name: 'Spinach', quantity: '1', unit: 'bag', emoji: '🥬' },
        { id: '6', name: 'Butter', quantity: '100', unit: 'g', emoji: '🧈' },
      ],
      recipes: [
        {
          id: 'r1',
          title: 'Cheesy Spinach Omelette',
          cookTime: 15,
          servings: 2,
          estimatedCost: 4.50,
          matchedIngredients: ['Eggs', 'Cheddar cheese', 'Spinach', 'Butter'],
          missingIngredients: [],
        },
        {
          id: 'r2',
          title: 'Veggie Frittata',
          cookTime: 25,
          servings: 4,
          estimatedCost: 6.00,
          matchedIngredients: ['Eggs', 'Bell pepper', 'Spinach', 'Cheddar cheese'],
          missingIngredients: ['Onion'],
        },
        {
          id: 'r3',
          title: 'Scrambled Eggs with Peppers',
          cookTime: 10,
          servings: 2,
          estimatedCost: 3.00,
          matchedIngredients: ['Eggs', 'Bell pepper', 'Butter'],
          missingIngredients: [],
        },
      ],
      savedToPantry: false,
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/scan/fridge]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
