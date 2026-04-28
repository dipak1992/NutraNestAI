import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPaywallStatus } from '@/lib/paywall/server'

type Params = { params: Promise<{ id: string }> }

// ─── GET /api/recipes/[id]/audio ──────────────────────────────────────────────
// Plus-only: returns TTS audio URL for recipe narration.
// Falls back to a structured script if TTS provider is not configured.

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params
    const paywall = await getPaywallStatus()

    if (!paywall.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!paywall.isPro && !paywall.isFamily) {
      return NextResponse.json(
        { error: 'Upgrade required', code: 'UPGRADE_REQUIRED' },
        { status: 403 }
      )
    }

    const supabase = await createClient()

    // Fetch recipe
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('id, name, description, steps, ingredients')
      .eq('id', id)
      .maybeSingle()

    if (error || !recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    // Build narration script
    const steps: Array<{ order: number; instruction: string }> = recipe.steps ?? []
    const ingredients: Array<{ name: string; quantity: number; unit: string }> = recipe.ingredients ?? []

    const scriptParts: string[] = []
    scriptParts.push(`Let's cook ${recipe.name}.`)
    if (recipe.description) scriptParts.push(recipe.description)

    if (ingredients.length > 0) {
      scriptParts.push('You will need:')
      ingredients.forEach((ing) => {
        scriptParts.push(`${ing.quantity} ${ing.unit} of ${ing.name}.`)
      })
    }

    scriptParts.push("Let's begin.")
    steps.forEach((step) => {
      scriptParts.push(`Step ${step.order}. ${step.instruction}`)
    })
    scriptParts.push('Great job! Enjoy your meal.')

    const script = scriptParts.join(' ')

    // Check if OpenAI TTS is configured
    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey) {
      // Return script-only response — client can use Web Speech API as fallback
      return NextResponse.json({
        audioUrl: null,
        script,
        segments: steps.map((step, i) => ({
          stepIndex: i,
          stepOrder: step.order,
          text: `Step ${step.order}. ${step.instruction}`,
        })),
        provider: 'web-speech',
        cached: false,
      })
    }

    // Call OpenAI TTS
    const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'nova',
        input: script.slice(0, 4000),
        response_format: 'mp3',
      }),
    })

    if (!ttsRes.ok) {
      // Fallback to script-only
      return NextResponse.json({
        audioUrl: null,
        script,
        segments: steps.map((step, i) => ({
          stepIndex: i,
          stepOrder: step.order,
          text: `Step ${step.order}. ${step.instruction}`,
        })),
        provider: 'web-speech',
        cached: false,
      })
    }

    // Upload to Supabase Storage
    const audioBuffer = await ttsRes.arrayBuffer()
    const path = `recipe-audio/${id}.mp3`

    const { error: uploadError } = await supabase.storage
      .from('recipe-audio')
      .upload(path, audioBuffer, { contentType: 'audio/mpeg', upsert: true })

    if (uploadError) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('recipe-audio').getPublicUrl(path)

    return NextResponse.json({
      audioUrl: urlData.publicUrl,
      script,
      segments: steps.map((step, i) => ({
        stepIndex: i,
        stepOrder: step.order,
        text: `Step ${step.order}. ${step.instruction}`,
      })),
      provider: 'openai-tts',
      cached: false,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
