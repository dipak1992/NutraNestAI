import type {
  AIGenerationRequest,
  AIGeneratedPlan,
  AIGeneratedMeal,
  AIGeneratedMealVariation,
  Household,
  HouseholdMember,
} from '@/types';
import { DEMO_WEEKLY_PLAN } from '@/lib/demo-data';
import { format, addDays } from 'date-fns';

// ── Prompt Builder ──────────────────────────────────────────

function buildHouseholdContext(household: Household, members: HouseholdMember[]): string {
  const memberDescriptions = members.map((m) => {
    const allergyList = m.allergies?.map((a) => a.allergy).join(', ') || 'none';
    const conditionList = m.conditions?.map((c) => c.condition).join(', ') || 'none';
    const disliked = m.disliked_foods?.join(', ') || 'none';
    return `
  - ${m.name} (${m.stage}, age: ${m.age || 'unknown'})
    Allergies: ${allergyList}
    Medical conditions: ${conditionList}
    Picky eater: ${m.picky_eater ? 'yes' : 'no'}
    Texture needs: ${m.texture_needs || 'normal'}
    School lunch needed: ${m.school_lunch_needed ? 'yes' : 'no'}
    Disliked foods: ${disliked}
    Cuisine preferences: ${m.cuisine_preference?.join(', ') || 'any'}`;
  }).join('\n');

  return `
HOUSEHOLD: ${household.name}
Budget: ${household.budget_level}
Cooking time preference: ${household.cooking_time_preference}
Low-energy mode: ${household.low_energy_mode ? 'YES - keep meals very simple' : 'no'}
One-pot preference: ${household.one_pot_preference ? 'yes' : 'no'}
Leftovers preference: ${household.leftovers_preference ? 'yes' : 'no'}
Cuisine preferences: ${household.cuisine_preferences?.join(', ') || 'any'}
Preferred proteins: ${household.preferred_proteins?.join(', ') || 'any'}
Meals per day: ${household.meals_per_day}

FAMILY MEMBERS:${memberDescriptions}`;
}

function buildSystemPrompt(): string {
  return `You are NutriNest AI, an expert family nutritionist and meal planning system.

Your core purpose: Generate ONE weekly family meal plan where each meal has a BASE version plus safe, realistic, age-appropriate modifications for EVERY family member.

CRITICAL RULES:
1. Every meal MUST have a clear base meal + individual member variations
2. Respect ALL allergies absolutely — never include allergens in any form
3. Baby-safe: no honey (botulism), no choking hazards, soft textures, no added salt/sugar
4. Toddler-safe: soft bite-sized pieces, deconstructed when needed
5. Picky eaters: modify presentation/texture FIRST before replacing the meal
6. Medical conditions must meaningfully influence meal design
7. Maximize ingredient overlap across the week (reduce cost + waste)
8. Keep meals realistic for busy households
9. Low-sodium for hypertension members — no added salt, avoid high-sodium sauces
10. School lunch versions must be portable, mess-friendly, nut-free if needed
11. Return valid JSON only — no markdown, no commentary

RESPONSE FORMAT: Return a JSON object exactly matching the AIGeneratedPlan schema.`;
}

function buildUserPrompt(request: AIGenerationRequest): string {
  const household = buildHouseholdContext(request.household, request.members);
  const weekStart = format(new Date(request.week_start), 'MMMM d, yyyy');
  const pantryNote = request.pantry_items?.length
    ? `\nUse these pantry items first: ${request.pantry_items.join(', ')}`
    : '';
  const regenerateNote = request.regenerate_params
    ? `\nREGENERATE with modifier: "${request.regenerate_params.modifier}". Keep the overall structure but apply this modifier to the affected meals.`
    : '';

  return `Generate a complete 7-day family meal plan for the week starting ${weekStart}.

${household}
${pantryNote}
${regenerateNote}

For each meal, provide:
- base_meal: A single recipe the whole family can share
- member_variations: Specific safe modifications for EACH family member
- Practical prep instructions for busy parents
- Ingredient list optimized for grocery shopping

Prioritize ingredient reuse across meals. Make modifications creative and appealing, not just "smaller portion".

Return a complete AIGeneratedPlan JSON object.`;
}

// ── AI Service ──────────────────────────────────────────────

export async function generateMealPlan(request: AIGenerationRequest): Promise<AIGeneratedPlan> {
  // Check if we have a real API key
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && apiKey !== 'mock') {
    return generateWithClaude(request, apiKey);
  }

  // Fallback to mock/demo data
  console.info('[NutriNest AI] Using mock meal plan — set ANTHROPIC_API_KEY to enable live generation');
  return generateMockPlan(request);
}

async function generateWithClaude(
  request: AIGenerationRequest,
  apiKey: string
): Promise<AIGeneratedPlan> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 8192,
    system: buildSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(request),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected AI response type');
  }

  try {
    // Claude sometimes wraps JSON in markdown — strip it
    let jsonText = content.text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    return JSON.parse(jsonText) as AIGeneratedPlan;
  } catch (err) {
    console.error('[NutriNest AI] Failed to parse AI response:', err);
    throw new Error('Failed to parse meal plan response from AI');
  }
}

// ── Mock/Demo Generator ─────────────────────────────────────

function generateMockPlan(request: AIGenerationRequest): AIGeneratedPlan {
  // Return the demo plan with updated dates
  const plan = structuredClone(DEMO_WEEKLY_PLAN);
  plan.week_start = request.week_start;
  plan.week_end = format(addDays(new Date(request.week_start), 6), 'yyyy-MM-dd');

  // Update day dates
  plan.days.forEach((day, i) => {
    day.date = format(addDays(new Date(request.week_start), i), 'yyyy-MM-dd');
    day.day_of_week = i;
  });

  return plan;
}

// ── Regenerate with modifier ────────────────────────────────

export async function regenerateMeals(
  request: AIGenerationRequest,
  modifier: string
): Promise<AIGeneratedPlan> {
  return generateMealPlan({
    ...request,
    regenerate_params: { modifier },
  });
}
