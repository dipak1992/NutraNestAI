import { NextResponse } from 'next/server'
import { generateSmartMeal } from '@/lib/engine/engine'
import type { SmartMealRequest } from '@/lib/engine/types'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SmartMealRequest

    if (!body.household) {
      return NextResponse.json(
        { error: 'Missing required field: household' },
        { status: 400 },
      )
    }

    const { adultsCount = 0, kidsCount = 0, toddlersCount = 0, babiesCount = 0 } = body.household
    if (adultsCount + kidsCount + toddlersCount + babiesCount === 0) {
      return NextResponse.json(
        { error: 'Household must have at least one member' },
        { status: 400 },
      )
    }

    const result = generateSmartMeal({
      ...body,
      household: { adultsCount, kidsCount, toddlersCount, babiesCount },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[SmartMeal] Engine error:', error)
    return NextResponse.json(
      { error: 'Failed to generate meal' },
      { status: 500 },
    )
  }
}
