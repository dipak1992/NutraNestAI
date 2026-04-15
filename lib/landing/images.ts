/**
 * Landing page image registry.
 *
 * Each scene has:
 * - `url`: a placeholder that loads today (loremflickr, category-matched)
 * - `prompt`: the full AI generation prompt (shared cohesive style below)
 * - `alt`: accessibility text
 *
 * To swap to real AI-generated imagery later:
 *   1. Generate each scene with your AI tool using the prompt.
 *   2. Drop the file into `public/images/landing/<key>.jpg`.
 *   3. Change `url` here to `'/images/landing/<key>.jpg'`. Nothing else moves.
 */

const lf = (keywords: string, lock: number) =>
  `https://loremflickr.com/1600/1000/${keywords}?lock=${lock}`

const lfSquare = (keywords: string, lock: number) =>
  `https://loremflickr.com/1000/1000/${keywords}?lock=${lock}`

export const GLOBAL_IMAGE_STYLE = `
Ultra-realistic photography (not cartoon). Warm natural lighting.
Modern clean kitchen environments. Family-friendly atmosphere.
Soft shadows, shallow depth of field. High-end food photography style.
Neutral palette with warm tones. Consistent brightness and color grading.
8k detail, cinematic realism.
`.trim()

export interface LandingImage {
  url: string
  alt: string
  prompt: string
}

export const LANDING_IMAGES = {
  hero: {
    url: lf('family,kitchen,cooking,parents', 101),
    alt: 'Family cooking dinner together in a modern home kitchen',
    prompt:
      'Modern family kitchen scene with busy parents preparing dinner together, two small kids nearby, warm lighting, realistic food on the counter, cozy lived-in atmosphere, natural candid moment.',
  },

  modeTired: {
    url: lfSquare('tired,parent,kitchen,evening', 201),
    alt: 'Tired parent at a kitchen counter with a simple ready meal',
    prompt:
      'Tired parent sitting at a kitchen counter looking at a simple ready meal, relaxed expression, soft warm lighting, minimal clutter, relatable evening mood.',
  },
  modePantry: {
    url: lfSquare('fridge,groceries,vegetables,fresh', 202),
    alt: 'Open fridge filled with fresh ingredients',
    prompt:
      'Open fridge filled with fresh groceries, vegetables, containers and ingredients, neatly arranged shelves, realistic kitchen lighting, clean and organized but natural.',
  },
  modeSurprise: {
    url: lfSquare('dinner,table,variety,cuisines', 203),
    alt: 'Table with a colorful variety of dinner dishes',
    prompt:
      'Table filled with a colorful variety of meals from different cuisines, vibrant but realistic presentation, multiple dishes arranged aesthetically, food photography style.',
  },
  modePlan: {
    url: lfSquare('tablet,kitchen,meal,plan', 204),
    alt: 'Tablet showing a weekly meal plan on a kitchen counter',
    prompt:
      'Tablet or phone showing a weekly meal plan interface with food images, placed on a kitchen counter, minimal modern environment, soft lighting.',
  },

  step1: {
    url: lf('phone,kitchen,app,meal', 301),
    alt: 'Person selecting a meal on a smartphone in a modern kitchen',
    prompt:
      'Person holding a smartphone and selecting a meal option, close-up hand interaction, modern UI visible on screen, realistic setting.',
  },
  step2: {
    url: lf('abstract,interface,glow,minimal', 302),
    alt: 'Minimal glowing AI interface concept',
    prompt:
      'Subtle AI concept scene, minimal glowing interface or abstract digital overlay, clean and modern, not overly futuristic, soft lighting.',
  },
  step3: {
    url: lf('family,dinner,table,smiling', 303),
    alt: 'Family sitting together and enjoying dinner',
    prompt:
      'Family sitting together at a dinner table enjoying a meal, smiling, warm lighting, cozy home environment, candid moment.',
  },

  meal1: {
    url: lf('grilled,chicken,vegetables,plate', 401),
    alt: 'Grilled chicken plated with vegetables',
    prompt:
      'Grilled chicken with vegetables plated beautifully, realistic food photography, natural lighting, close-up composition.',
  },
  meal2: {
    url: lf('pasta,sauce,herbs,bowl', 402),
    alt: 'Quick pasta dinner with sauce and herbs',
    prompt:
      'Quick pasta dinner with sauce and herbs, slightly messy but appetizing plating, warm tones, realistic.',
  },
  meal3: {
    url: lf('rice,curry,homestyle,table', 403),
    alt: 'Family-style rice and curry meal',
    prompt:
      'Family-style rice and curry meal served on a table, simple home-style plating, authentic and inviting.',
  },
  meal4: {
    url: lf('sheet,pan,salmon,asparagus', 404),
    alt: 'Sheet-pan salmon with asparagus',
    prompt:
      'Sheet-pan salmon with asparagus and lemon, simple home dinner, natural lighting, slightly rustic plating.',
  },
  meal5: {
    url: lf('tacos,family,dinner,colorful', 405),
    alt: 'Family taco dinner spread',
    prompt:
      'Family-style taco night dinner with warm tortillas, salsas, and toppings, inviting home table, warm light.',
  },
  meal6: {
    url: lf('stir,fry,rice,bowl,vegetables', 406),
    alt: 'Quick stir-fry dinner bowl',
    prompt:
      'Quick stir-fry rice bowl with vegetables and protein, steam rising, warm kitchen light, candid home style.',
  },

  founders: {
    url: '/images/founders-family.jpg',
    alt: 'The MealEase founding family in their kitchen',
    prompt:
      'Real-life family moment in a home kitchen, parents with two small children, candid, warm natural lighting, emotional and authentic feel.',
  },

  ctaBackdrop: {
    url: lf('family,dinner,warm,candid', 501),
    alt: 'Warm family dinner scene',
    prompt:
      'Warm candid family dinner scene at home, parents and kids around a table, inviting golden-hour lighting.',
  },
} as const satisfies Record<string, LandingImage>

export type LandingImageKey = keyof typeof LANDING_IMAGES
