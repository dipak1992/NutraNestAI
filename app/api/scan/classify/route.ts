import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateScanImageStrict } from '@/lib/scan/upload-validation'
import type { ClassifyResponse } from '@/lib/scan/types'

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const image = formData.get('image') as File | null
    const rawMode = formData.get('mode')
    const mode = rawMode === 'fridge' || rawMode === 'menu' || rawMode === 'food' ? rawMode : 'auto'

    const imageError = await validateScanImageStrict(image)
    if (imageError) return imageError

    // TODO: Replace with real AI classification (e.g., OpenAI Vision)
    // For now, return a mock classification based on mode hint
    let result: ClassifyResponse

    if (mode === 'fridge') {
      result = { type: 'fridge', confidence: 0.95 }
    } else if (mode === 'menu') {
      result = { type: 'menu', confidence: 0.95 }
    } else if (mode === 'food') {
      result = { type: 'food', confidence: 0.95 }
    } else {
      // Auto mode — mock a fridge detection with high confidence
      result = { type: 'fridge', confidence: 0.88 }
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/scan/classify]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
