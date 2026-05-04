import { NextRequest, NextResponse } from 'next/server'
import { validateScanImageStrict } from '@/lib/scan/upload-validation'
import type { FridgeResult } from '@/lib/scan/types'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File | null
    const imageError = await validateScanImageStrict(image)
    if (imageError) return imageError

    const result: FridgeResult = {
      ingredients: [
        { id: 'demo-1', name: 'Eggs', quantity: '6', unit: '', emoji: '🥚' },
        { id: 'demo-2', name: 'Spinach', quantity: '1', unit: 'bag', emoji: '🥬' },
        { id: 'demo-3', name: 'Cheddar', quantity: '1', unit: 'block', emoji: '🧀' },
        { id: 'demo-4', name: 'Bell pepper', quantity: '2', unit: '', emoji: '🫑' },
        { id: 'demo-5', name: 'Tortillas', quantity: '1', unit: 'pack', emoji: '🌯' },
      ],
      recipes: [
        {
          id: 'signup-spinach-omelet',
          title: 'Spinach Cheddar Omelet',
          cookTime: 12,
          servings: 2,
          estimatedCost: 4.25,
          matchedIngredients: ['Eggs', 'Spinach', 'Cheddar'],
          missingIngredients: [],
        },
        {
          id: 'signup-breakfast-quesadillas',
          title: 'Breakfast Quesadillas',
          cookTime: 15,
          servings: 3,
          estimatedCost: 6.5,
          matchedIngredients: ['Eggs', 'Cheddar', 'Tortillas', 'Bell pepper'],
          missingIngredients: ['Salsa'],
        },
        {
          id: 'signup-frittata',
          title: 'Veggie Frittata Squares',
          cookTime: 25,
          servings: 4,
          estimatedCost: 7.25,
          matchedIngredients: ['Eggs', 'Spinach', 'Bell pepper', 'Cheddar'],
          missingIngredients: ['Onion'],
        },
      ],
      savedToPantry: false,
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/scan/demo]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
