import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAndIncrementScanUsage } from '@/lib/scan/gating'
import type { MenuResult } from '@/lib/scan/types'

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

  // Gate check (3 menu scans/month for free users)
  const gateReason = await checkAndIncrementScanUsage(user.id, 'menu', isPlusMember)
  if (gateReason) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', reason: gateReason },
      { status: 429 }
    )
  }

  try {
    const formData = await req.formData()
    const image = formData.get('image') as File | null

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // TODO: Replace with real AI analysis (OpenAI Vision / Anthropic Claude)
    const result: MenuResult = {
      restaurantName: 'Restaurant',
      picks: [
        {
          id: 'p1',
          name: 'Grilled Salmon',
          description: 'Fresh Atlantic salmon with seasonal vegetables and lemon butter',
          price: 24.99,
          healthScore: 88,
          calories: 420,
          tags: ['High protein', 'Omega-3', 'Gluten-free'],
          rank: 1,
        },
        {
          id: 'p2',
          name: 'Mediterranean Salad',
          description: 'Mixed greens, feta, olives, cucumber, tomato with olive oil dressing',
          price: 14.99,
          healthScore: 82,
          calories: 280,
          tags: ['Low calorie', 'Vegetarian', 'High fiber'],
          rank: 2,
        },
        {
          id: 'p3',
          name: 'Grilled Chicken Bowl',
          description: 'Herb-marinated chicken breast with quinoa and roasted vegetables',
          price: 18.99,
          healthScore: 79,
          calories: 520,
          tags: ['High protein', 'Whole grain'],
          rank: 3,
        },
      ],
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/scan/menu]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
