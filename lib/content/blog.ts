export interface BlogSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export interface BlogFaq {
  question: string
  answer: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  description: string
  category: string
  tags: string[]
  publishedAt: string
  updatedAt?: string
  readingTime: string
  author: {
    name: string
    role: string
  }
  sections: BlogSection[]
  faq?: BlogFaq[]
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'family-meal-planning-for-busy-weeknights',
    title: 'Family Meal Planning for Busy Weeknights',
    excerpt:
      'A practical system for planning family dinners that are fast, repeatable, and realistic on low-energy weeknights.',
    description:
      'Learn a realistic weeknight family meal planning system with repeatable dinner templates, prep shortcuts, and grocery discipline.',
    category: 'Meal Planning',
    tags: ['family meal planning', 'weeknight dinners', 'meal prep'],
    publishedAt: '2026-04-14',
    readingTime: '6 min read',
    author: {
      name: 'MealEase Editorial',
      role: 'Family nutrition team',
    },
    sections: [
      {
        heading: 'Start with a dinner framework, not seven original ideas',
        paragraphs: [
          'Most families stall because they try to invent a full week from scratch. A stronger system is to rotate a few dependable dinner formats: bowl night, pasta night, tray bake night, soup night, taco night, leftovers night, and one flexible pantry meal.',
          'That structure reduces decision fatigue and makes it easier to adapt one base dinner for babies, toddlers, older kids, and adults with different needs.',
        ],
      },
      {
        heading: 'Use ingredients across multiple meals on purpose',
        paragraphs: [
          'Organic growth in meal planning comes from search, but household growth comes from repetition. Pick proteins, vegetables, and staples that can show up in more than one dinner so your grocery bill stays controlled and food waste stays low.',
        ],
        bullets: [
          'Cook one batch of rice and use it for bowls, stir-fry, and lunch leftovers.',
          'Reuse roast vegetables in grain bowls or wraps the next day.',
          'Choose sauces that change the feel of the meal without changing the whole ingredient list.',
        ],
      },
      {
        heading: 'Plan for energy levels, not ideal conditions',
        paragraphs: [
          'Weeknight meal planning breaks when every meal assumes perfect energy, a clean kitchen, and full attention. Build in at least two low-effort dinners each week that still cover protein, produce, and something easy for children to accept.',
          'A working plan is one your household can actually execute on a Wednesday, not one that looks impressive on Sunday.',
        ],
      },
    ],
    faq: [
      {
        question: 'How many dinners should I plan for one week?',
        answer:
          'Most families only need five planned dinners. Leave one night for leftovers and one for a pantry or takeout fallback so the plan stays flexible instead of brittle.',
      },
      {
        question: 'What makes a meal plan easier to stick to?',
        answer:
          'Low decision count, repeated ingredients, two easy nights, and one base meal that can be safely adapted for each family member.',
      },
    ],
  },
  {
    slug: 'healthy-toddler-dinners-the-whole-family-can-eat',
    title: 'Healthy Toddler Dinners the Whole Family Can Eat',
    excerpt:
      'Toddler dinners work better when they are part of the family meal, not a second menu made under pressure.',
    description:
      'Healthy toddler dinner ideas that fit the whole family meal with texture changes, simple flavors, and low-pressure serving strategies.',
    category: 'Toddlers',
    tags: ['healthy toddler dinners', 'family dinners', 'picky eaters'],
    publishedAt: '2026-04-14',
    readingTime: '5 min read',
    author: {
      name: 'MealEase Editorial',
      role: 'Family nutrition team',
    },
    sections: [
      {
        heading: 'Build toddler dinners from the adult meal down',
        paragraphs: [
          'A toddler-friendly dinner does not need to be separate. It usually needs milder seasoning, smaller pieces, manageable textures, and one or two familiar components already on the plate.',
          'That is why base-meal planning works well for families with toddlers. The main recipe stays shared, while serving details change by age and confidence level.',
        ],
      },
      {
        heading: 'Keep the plate simple and recognizable',
        paragraphs: [
          'Toddlers often do better when ingredients are visible and not overloaded with sauces or mixed textures. Serve components in a way that lets them inspect the food without turning dinner into a negotiation.',
        ],
        bullets: [
          'Offer a familiar carbohydrate like rice, pasta, or potatoes.',
          'Keep one fruit or vegetable soft and easy to grab.',
          'Cut proteins into manageable pieces or shred them for easier chewing.',
        ],
      },
      {
        heading: 'Repeat exposure matters more than one perfect dinner',
        paragraphs: [
          'Many healthy toddler dinners fail because adults expect immediate acceptance. In practice, repeated low-pressure exposure builds comfort faster than swapping the plan every time a child resists a new ingredient.',
        ],
      },
    ],
  },
  {
    slug: 'low-sodium-family-dinners-without-bland-food',
    title: 'Low-Sodium Family Dinners Without Bland Food',
    excerpt:
      'You can lower sodium for one family member without flattening the entire meal if you design the base recipe correctly.',
    description:
      'Make low-sodium family dinners that still taste good by separating seasoning from salt, controlling sauces, and finishing plates individually.',
    category: 'Health Conditions',
    tags: ['low sodium family dinners', 'heart healthy meals', 'family nutrition'],
    publishedAt: '2026-04-14',
    readingTime: '7 min read',
    author: {
      name: 'MealEase Editorial',
      role: 'Family nutrition team',
    },
    sections: [
      {
        heading: 'Design the meal around flavor that is not sodium-dependent',
        paragraphs: [
          'Low-sodium dinners get a bad reputation when the only change is removing salt. A better approach is to build flavor through acid, aromatics, herbs, browning, and texture first, then control salt separately.',
        ],
      },
      {
        heading: 'Watch packaged shortcuts first',
        paragraphs: [
          'In family cooking, sodium spikes usually come from sauces, broths, seasoning packets, deli meats, and frozen convenience items. If you need a lower-sodium dinner, those are the first places to adjust.',
        ],
        bullets: [
          'Use no-salt-added or low-sodium broth when possible.',
          'Thin high-sodium sauces and use them selectively at the table.',
          'Rely on lemon, garlic, onion, ginger, and vinegar to restore brightness.',
        ],
      },
      {
        heading: 'Finish plates individually when households have mixed needs',
        paragraphs: [
          'For many families, the practical answer is one shared base meal with different finishing touches. That keeps the lower-sodium version safe while still letting other diners season to taste.',
        ],
      },
    ],
  },
  {
    slug: 'baby-led-weaning-meals-for-the-whole-family',
    title: 'Baby-Led Weaning Meals for the Whole Family',
    excerpt:
      'Baby-led weaning gets easier when family dinners are planned with safe textures and serving shapes from the start.',
    description:
      'Baby-led weaning meal ideas that work for the whole family with safety-first serving shapes, soft textures, and realistic dinner formats.',
    category: 'Babies',
    tags: ['baby led weaning meals', 'family meals for babies', 'baby safe dinners'],
    publishedAt: '2026-04-14',
    readingTime: '6 min read',
    author: {
      name: 'MealEase Editorial',
      role: 'Family nutrition team',
    },
    sections: [
      {
        heading: 'Plan the base meal with baby safety in mind',
        paragraphs: [
          'When a baby is joining family dinner, the easiest path is to choose meals that can be softened, stripped back, or served in graspable shapes without changing the entire recipe.',
          'This is where one-base-meal planning is useful. Adults and older kids can eat the composed dinner while the baby gets the same core ingredients in a safe form.',
        ],
      },
      {
        heading: 'Texture and shape are the main adjustments',
        paragraphs: [
          'Most baby-led weaning adaptations are about serving technique rather than separate cooking. Keep textures soft, pieces large enough to grasp when appropriate, and avoid ingredients that are unsafe for babies.',
        ],
        bullets: [
          'Serve soft-cooked vegetables that mash easily between fingers.',
          'Offer shredded or moist proteins instead of tough chunks.',
          'Skip honey and use age-appropriate safety guidance for choking risks.',
        ],
      },
      {
        heading: 'Consistency beats novelty',
        paragraphs: [
          'A steady rotation of safe family meals usually works better than chasing novelty. Repetition helps babies learn textures and helps adults keep dinner manageable.',
        ],
      },
    ],
  },
]

export function getAllBlogPosts() {
  return BLOG_POSTS.toSorted((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null
}
