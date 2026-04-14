import { NextRequest, NextResponse } from 'next/server'
import { getRandomTonightMeal } from '@/lib/tonight-meals'

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('mode') as 'quick' | 'tired' | 'pantry' | null
  
  if (!mode || !['quick', 'tired', 'pantry'].includes(mode)) {
    return NextResponse.json(
      { error: 'Invalid mode. Use: quick, tired, or pantry' },
      { status: 400 }
    )
  }

  const meal = getRandomTonightMeal(mode)
  return NextResponse.json({ meal })
}
