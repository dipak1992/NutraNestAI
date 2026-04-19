import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import { generateText, stripJsonFences } from '@/lib/ai/service'
import logger from '@/lib/logger'
import { getUserDietaryPrefs, buildPreferenceContext } from '@/lib/meal-engine/preferences'
import { normalizeTier } from '@/lib/paywall/config'
import { getFamilyMembers } from '@/lib/family/service'

export type KidsToolIntent = 'lunchbox' | 'snack' | 'bake' | 'picky' | 'fast'

export interface LunchboxResult {
  intent: 'lunchbox'
  section_title: string
  main_item: string
  fruit: string
  side_snack: string
  optional_treat: string
  prep_time: string
  tip: string
}

export interface SnackResult {
  intent: 'snack'
  section_title: string
  name: string
  category: string
  ingredients: string[]
  prep_time: string
  why_kids_love_it: string
}

export interface BakeResult {
  intent: 'bake'
  section_title: string
  activity_name: string
  kid_age_fit: string
  prep_time: string
  mess_level: 'low' | 'medium' | 'high'
  ingredients: string[]
  steps: string[]
  fun_tip: string
}

export interface PickyResult {
  intent: 'picky'
  section_title: string
  meal_name: string
  acceptance_score: number
  why_it_may_work: string
  optional_upgrade_path: string
  serving_tip: string
}

export interface FastResult {
  intent: 'fast'
  section_title: string
  meal_name: string
  ready_in_minutes: number
  ingredients_needed: string[]
  urgency_score: number
  shortcut_tip: string
}

export type KidsToolResult = LunchboxResult | SnackResult | BakeResult | PickyResult | FastResult

type CatalogSnack = {
  name: string
  category: SnackResult['category']
  ingredients: string[]
  prep_time: string
  why_kids_love_it: string
}

type CatalogBake = {
  activity_name: string
  kid_age_fit: string
  prep_time: string
  mess_level: BakeResult['mess_level']
  ingredients: string[]
  steps: string[]
  fun_tip: string
}

const SNACK_LIBRARY: CatalogSnack[] = [
  { name: 'Berry Yogurt Crunch Bowl', category: 'healthy', ingredients: ['Greek yogurt', 'mixed berries', 'granola', 'honey'], prep_time: '4 min', why_kids_love_it: 'Creamy + crunchy with natural sweetness.' },
  { name: 'Banana Peanut Butter Toast Bites', category: 'filling', ingredients: ['whole wheat bread', 'peanut butter', 'banana', 'cinnamon'], prep_time: '5 min', why_kids_love_it: 'Bite-size pieces are easy and fun to eat.' },
  { name: 'Cheese & Cracker Rainbow Plate', category: 'after_school', ingredients: ['whole grain crackers', 'cheddar cubes', 'grapes', 'cucumber slices'], prep_time: '5 min', why_kids_love_it: 'A colorful snack board feels like mini lunch.' },
  { name: 'Apple Nacho Slices', category: 'quick', ingredients: ['apple', 'sunflower butter', 'raisins', 'chia seeds'], prep_time: '4 min', why_kids_love_it: 'Looks like dessert but keeps it wholesome.' },
  { name: 'Mini Veggie Dip Cups', category: 'healthy', ingredients: ['carrot sticks', 'bell pepper strips', 'cucumber', 'hummus'], prep_time: '6 min', why_kids_love_it: 'Dipping makes veggies more exciting.' },
  { name: 'Mango Oat Smoothie', category: 'light', ingredients: ['frozen mango', 'milk', 'rolled oats', 'vanilla'], prep_time: '5 min', why_kids_love_it: 'Tastes like a milkshake with better nutrition.' },
  { name: 'No-Bake Oat Energy Bites', category: 'filling', ingredients: ['rolled oats', 'nut butter', 'maple syrup', 'mini chocolate chips'], prep_time: '8 min', why_kids_love_it: 'Soft sweet bites that feel like cookie dough.' },
  { name: 'Strawberry Cream Cheese Roll-Ups', category: 'after_school', ingredients: ['whole wheat tortilla', 'cream cheese', 'strawberries'], prep_time: '5 min', why_kids_love_it: 'Soft roll-ups are easy for little hands.' },
  { name: 'Cottage Cheese Fruit Cup', category: 'healthy', ingredients: ['cottage cheese', 'pineapple chunks', 'berries'], prep_time: '3 min', why_kids_love_it: 'Sweet fruit balances creamy texture.' },
  { name: 'Mini Avocado Egg Toast Squares', category: 'filling', ingredients: ['toast', 'avocado', 'hard-boiled egg', 'lemon'], prep_time: '7 min', why_kids_love_it: 'Looks like tiny party snacks.' },
]

const BAKE_LIBRARY: CatalogBake[] = [
  { activity_name: 'Banana Muffin Cups', kid_age_fit: '4-10 years', prep_time: '30 min', mess_level: 'medium', ingredients: ['ripe bananas', 'flour', 'egg', 'milk', 'baking powder'], steps: ['Mash bananas in a bowl.', 'Mix wet and dry ingredients.', 'Scoop into muffin cups.', 'Bake until golden.'], fun_tip: 'Let kids add colorful paper liners.' },
  { activity_name: 'Soft Chocolate Chip Cookies', kid_age_fit: '5-12 years', prep_time: '25 min', mess_level: 'medium', ingredients: ['flour', 'butter', 'brown sugar', 'egg', 'chocolate chips'], steps: ['Cream butter and sugar.', 'Mix in egg and flour.', 'Fold in chocolate chips.', 'Bake small scoops.'], fun_tip: 'Use mini scoops to make tiny cookies.' },
  { activity_name: 'One-Bowl Brownie Bites', kid_age_fit: '6-12 years', prep_time: '28 min', mess_level: 'medium', ingredients: ['cocoa powder', 'flour', 'sugar', 'egg', 'butter'], steps: ['Whisk wet ingredients.', 'Stir in dry ingredients.', 'Pour into mini tray.', 'Bake and cool.'], fun_tip: 'Top with sprinkles before baking.' },
  { activity_name: 'Mini Pizza Faces', kid_age_fit: '4-10 years', prep_time: '20 min', mess_level: 'high', ingredients: ['mini pita', 'pizza sauce', 'mozzarella', 'bell pepper', 'olives'], steps: ['Spread sauce on mini pita.', 'Add cheese and toppings.', 'Make funny faces with veggies.', 'Bake until cheese melts.'], fun_tip: 'Host a family pizza-face contest.' },
  { activity_name: 'Blueberry Pancake Dippers', kid_age_fit: '4-10 years', prep_time: '18 min', mess_level: 'medium', ingredients: ['pancake mix', 'milk', 'egg', 'blueberries'], steps: ['Mix pancake batter.', 'Fold in blueberries.', 'Cook silver-dollar pancakes.', 'Serve with yogurt dip.'], fun_tip: 'Use cookie cutters on cooled pancakes.' },
  { activity_name: 'No-Bake Yogurt Berry Bark', kid_age_fit: '4-12 years', prep_time: '15 min', mess_level: 'low', ingredients: ['Greek yogurt', 'berries', 'granola', 'honey'], steps: ['Spread yogurt on tray.', 'Top with berries and granola.', 'Freeze until set.', 'Break into bark pieces.'], fun_tip: 'Let kids design their own corner.' },
  { activity_name: 'Wrap Pinwheel Bakery Bites', kid_age_fit: '5-12 years', prep_time: '15 min', mess_level: 'low', ingredients: ['tortilla', 'cream cheese', 'spinach', 'shredded carrot'], steps: ['Spread cream cheese on tortilla.', 'Add fillings.', 'Roll tightly and chill.', 'Slice into pinwheels.'], fun_tip: 'Arrange by color into a rainbow spiral.' },
  { activity_name: 'Simple Vanilla Cupcakes', kid_age_fit: '6-12 years', prep_time: '35 min', mess_level: 'medium', ingredients: ['flour', 'sugar', 'butter', 'egg', 'milk', 'vanilla'], steps: ['Mix wet and dry ingredients.', 'Fill cupcake liners.', 'Bake until springy.', 'Cool and frost.'], fun_tip: 'Give each child a frosting piping bag.' },
]

function titleToId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

function containsRestrictedIngredient(ingredients: string[], allergies: string[]): boolean {
  if (!allergies.length) return false
  const flattened = ingredients.join(' ').toLowerCase()
  const allergyMap: Record<string, string[]> = {
    peanuts: ['peanut'],
    tree_nuts: ['almond', 'cashew', 'walnut', 'pecan', 'hazelnut', 'pistachio'],
    dairy: ['milk', 'cheese', 'butter', 'cream', 'yogurt'],
    eggs: ['egg'],
    soy: ['soy', 'tofu', 'edamame'],
    gluten: ['flour', 'bread', 'wheat', 'cracker'],
    sesame: ['sesame', 'tahini'],
    shellfish: ['shrimp', 'crab', 'lobster'],
    fish: ['fish', 'salmon', 'tuna', 'cod'],
  }
  return allergies.some((a) => (allergyMap[a] ?? [a]).some((token) => flattened.includes(token)))
}

function pickCatalogIndex(size: number, seedBase: string): number {
  const hash = seedBase.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const base = Math.abs(hash) % Math.max(size, 1)
  const jitter = Math.floor(Math.random() * Math.max(size, 1))
  return (base + jitter) % Math.max(size, 1)
}

function buildPrompt(intent: KidsToolIntent, prefContext: string, targetContext: string, varietyContext: string): { system: string; user: string } {
  const prefSuffix = prefContext ? `\n\n${prefContext}` : ''
  const targetSuffix = targetContext ? `\n\n${targetContext}` : ''
  const varietySuffix = varietyContext ? `\n\n${varietyContext}` : ''
  switch (intent) {
    case 'lunchbox':
      return {
        system: `You are a friendly kids nutrition expert helping parents pack school lunchboxes. Return ONLY valid JSON. No markdown fences, no extra text.${prefSuffix}${targetSuffix}${varietySuffix}`,
        user: `Generate one creative and nutritious school lunchbox idea. Return this exact JSON shape:
{
  "intent": "lunchbox",
  "section_title": "Lunchbox Ideas",
  "main_item": "the main sandwich/wrap/meal item e.g. Turkey & Cheese Roll-Up",
  "fruit": "the fruit to include e.g. Sliced apple with cinnamon",
  "side_snack": "a healthy side snack e.g. Carrot sticks with hummus",
  "optional_treat": "a small treat e.g. 2 mini chocolate chip cookies",
  "prep_time": "how long to prepare e.g. 5 min",
  "tip": "a practical packing tip for parents"
}
Be creative but practical. Keep everything kid-friendly ages 4-12.`,
      }

    case 'snack':
      return {
        system: `You are a kids snack specialist helping parents find quick, healthy after-school snacks. Return ONLY valid JSON. No markdown fences, no extra text.${prefSuffix}${targetSuffix}${varietySuffix}`,
        user: `Generate one great after-school snack idea for kids. Return this exact JSON shape:
{
  "intent": "snack",
  "section_title": "Snack Rescue",
  "name": "snack name e.g. Apple Nachos with Peanut Butter",
  "category": "one of: after_school, healthy, quick, filling, light",
  "ingredients": ["3-5 simple ingredients"],
  "prep_time": "e.g. 3 min",
  "why_kids_love_it": "a fun reason why kids enjoy this"
}
Keep it healthy, fast, and fun for kids aged 4-12.`,
      }

    case 'bake':
      return {
        system: `You are a family baking expert who specializes in fun baking activities for parents and kids. Return ONLY valid JSON. No markdown fences, no extra text.${prefSuffix}${targetSuffix}${varietySuffix}`,
        user: `Generate one fun baking activity parents and kids can do together. Return this exact JSON shape:
{
  "intent": "bake",
  "section_title": "Bake Together",
  "activity_name": "name of the baking activity e.g. Rainbow Sprinkle Sugar Cookies",
  "kid_age_fit": "best age range e.g. 4-10 years",
  "prep_time": "total time e.g. 35 min",
  "mess_level": "exactly one of: low, medium, high",
  "ingredients": ["5-8 simple ingredients"],
  "steps": ["4-6 simple kid-friendly steps"],
  "fun_tip": "a tip to make it more fun for kids"
}
Make it genuinely fun, achievable for kids, with manageable mess.`,
      }

    case 'picky':
      return {
        system: `You are a pediatric feeding specialist helping parents with picky eaters. You specialize in bridge meals — familiar foods kids are likely to accept. Return ONLY valid JSON. No markdown fences, no extra text.${prefSuffix}${targetSuffix}${varietySuffix}`,
        user: `Generate one picky eater bridge meal a picky child is likely to accept. Return this exact JSON shape:
{
  "intent": "picky",
  "section_title": "Picky Eater Wins",
  "meal_name": "meal name e.g. Sneaky Mac & Cheese with Hidden Cauliflower",
  "acceptance_score": 8,
  "why_it_may_work": "brief explanation of why a picky eater might accept this",
  "optional_upgrade_path": "how to expand this meal when they are ready",
  "serving_tip": "practical tip for getting picky eaters to try it"
}
acceptance_score is an integer 1-10 (10 = highest picky-eater acceptance). Focus on familiar textures and flavors.`,
      }

    case 'fast':
      return {
        system: `You are a quick-meal expert for busy parents who need food on the table in 5 minutes or less. Return ONLY valid JSON. No markdown fences, no extra text.${prefSuffix}${targetSuffix}${varietySuffix}`,
        user: `Generate one ultra-fast meal ready in 5 minutes or less for hungry kids. Return this exact JSON shape:
{
  "intent": "fast",
  "section_title": "Ready in 5 Minutes",
  "meal_name": "meal name e.g. Peanut Butter Banana Roll-Up",
  "ready_in_minutes": 5,
  "ingredients_needed": ["3-5 simple pantry or fridge staples"],
  "urgency_score": 9,
  "shortcut_tip": "the key trick that makes this so fast"
}
ready_in_minutes must be 5 or less. urgency_score is an integer 1-10. No cooking required if possible.`,
      }
  }
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: rateLimitKeyFromRequest(req), limit: 20, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthenticated', 401)

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .maybeSingle()

  const tier = normalizeTier(profile?.subscription_tier)
  if (tier !== 'family') {
    return apiError('Kids tools are available on Family Plus only.', 403)
  }

  try {
    const body = (await req.json()) as {
      intent?: string
      targetMemberId?: string
      targetMode?: 'whole_family' | 'adults_only'
      excludeTitles?: string[]
      requestNonce?: string
    }
    const intent = body.intent as KidsToolIntent | undefined

    if (!intent || !['lunchbox', 'snack', 'bake', 'picky', 'fast'].includes(intent)) {
      return NextResponse.json({ error: 'Invalid intent. Use: lunchbox, snack, bake, picky, fast' }, { status: 400 })
    }

    const prefs = await getUserDietaryPrefs(user.id)
    const prefContext = prefs ? buildPreferenceContext(prefs, { includeKidsSettings: true }) : ''
    const allergies = (prefs?.allergies ?? []).map((a) => a.toLowerCase())

    const excludes = (body.excludeTitles ?? [])
      .map((v) => String(v).trim().toLowerCase())
      .filter(Boolean)
      .slice(-16)

    let targetContext = ''
    if (body.targetMode === 'adults_only') {
      targetContext = 'Targeting: Adults only tonight. Keep flavors more mature and avoid kid-centric simplifications.'
    } else if (body.targetMode === 'whole_family') {
      targetContext = 'Targeting: Whole family dinner context. Balance child acceptance with adult satisfaction.'
    } else if (body.targetMemberId) {
      const members = await getFamilyMembers(supabase as any, user.id)
      const target = members.find((m) => m.id === body.targetMemberId)
      if (target) {
        targetContext = `Targeting: ${target.first_name} (${target.role}${target.age_years ? `, ${target.age_years} years` : ''}). Prioritize foods accepted: ${target.foods_accepted_json.join(', ') || 'n/a'}. Avoid rejected foods: ${target.foods_rejected_json.join(', ') || 'n/a'}.`
      }
    }

    const varietyContext = [
      excludes.length > 0
        ? `Do not repeat these recent suggestions: ${excludes.join(', ')}.`
        : '',
      body.requestNonce
        ? `Variation token: ${body.requestNonce}. Return a distinct option from prior outputs.`
        : '',
      'Prefer novelty when multiple valid options exist.',
    ].filter(Boolean).join(' ')

    if (intent === 'snack') {
      const safePool = SNACK_LIBRARY.filter((entry) => !containsRestrictedIngredient(entry.ingredients, allergies))
      const dedupedPool = safePool.filter((entry) => !excludes.includes(entry.name.toLowerCase()))
      const candidatePool = dedupedPool.length > 0 ? dedupedPool : (safePool.length > 0 ? safePool : SNACK_LIBRARY)
      const idx = pickCatalogIndex(candidatePool.length, `${user.id}:${intent}:${new Date().toISOString().slice(0, 13)}`)
      const chosen = candidatePool[idx]
      const result: SnackResult = {
        intent: 'snack',
        section_title: 'Snack Rescue',
        name: chosen.name,
        category: chosen.category,
        ingredients: chosen.ingredients,
        prep_time: chosen.prep_time,
        why_kids_love_it: chosen.why_kids_love_it,
      }
      try {
        await supabase.from('recently_shown_meals').insert({
          user_id: user.id,
          meal_id: `kids-snack-${titleToId(result.name)}`,
          source_mode: 'kids:snack',
          metadata: { title: result.name, intent: 'snack' },
        })
      } catch {
        // non-fatal
      }
      return NextResponse.json(result)
    }

    if (intent === 'bake') {
      const safePool = BAKE_LIBRARY.filter((entry) => !containsRestrictedIngredient(entry.ingredients, allergies))
      const dedupedPool = safePool.filter((entry) => !excludes.includes(entry.activity_name.toLowerCase()))
      const candidatePool = dedupedPool.length > 0 ? dedupedPool : (safePool.length > 0 ? safePool : BAKE_LIBRARY)
      const idx = pickCatalogIndex(candidatePool.length, `${user.id}:${intent}:${new Date().toISOString().slice(0, 13)}`)
      const chosen = candidatePool[idx]
      const result: BakeResult = {
        intent: 'bake',
        section_title: 'Bake Together',
        activity_name: chosen.activity_name,
        kid_age_fit: chosen.kid_age_fit,
        prep_time: chosen.prep_time,
        mess_level: chosen.mess_level,
        ingredients: chosen.ingredients,
        steps: chosen.steps,
        fun_tip: chosen.fun_tip,
      }
      try {
        await supabase.from('recently_shown_meals').insert({
          user_id: user.id,
          meal_id: `kids-bake-${titleToId(result.activity_name)}`,
          source_mode: 'kids:bake',
          metadata: { title: result.activity_name, intent: 'bake' },
        })
      } catch {
        // non-fatal
      }
      return NextResponse.json(result)
    }

    const { system, user: userPrompt } = buildPrompt(intent, prefContext, targetContext, varietyContext)
    const { text } = await generateText({ system, user: userPrompt, maxTokens: 1024 })
    const clean = stripJsonFences(text)
    const result = JSON.parse(clean) as KidsToolResult

    try {
      const title =
        result.intent === 'lunchbox'
          ? result.main_item
          : result.intent === 'snack'
            ? result.name
            : result.intent === 'bake'
              ? result.activity_name
              : result.meal_name
      await supabase.from('recently_shown_meals').insert({
        user_id: user.id,
        meal_id: `kids-${result.intent}-${titleToId(title)}`,
        source_mode: `kids:${result.intent}`,
        metadata: { title, intent: result.intent },
      })
    } catch {
      // non-fatal
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error('[kids-tool] Error generating result', {
      error: error instanceof Error ? error.message : String(error),
    })
    return apiError('Failed to generate kids tool result')
  }
}
