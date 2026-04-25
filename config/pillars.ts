export const pillars = [
  {
    id: 'tonight',
    icon: '🍽️',
    question: "What's for dinner?",
    title: 'Tonight Suggestions',
    answer:
      'Open the app. See tonight\'s dinner tailored to your household. Cook in under 30 minutes.',
    badge: null,
  },
  {
    id: 'snap',
    icon: '📸',
    question: "What's in my fridge?",
    title: 'Snap & Cook',
    answer:
      "Point your camera at your fridge. We'll identify ingredients and suggest 3 recipes you can make right now.",
    badge: null,
  },
  {
    id: 'autopilot',
    icon: '📅',
    question: "What's this week?",
    title: 'Weekly Autopilot',
    answer:
      'One tap, seven dinners planned. Based on your household, preferences, and budget.',
    badge: null,
  },
  {
    id: 'leftovers',
    icon: '🍱',
    question: 'What do I do with leftovers?',
    title: 'Leftovers AI',
    answer:
      "Cooked chicken last night? We'll turn it into tacos, stir-fry, or a lunch salad — automatically.",
    badge: 'NEW',
  },
  {
    id: 'budget',
    icon: '💰',
    question: 'What will it cost me?',
    title: 'Budget Intelligence',
    answer:
      "See your week's grocery total before you shop. Set a budget, stay under it. Save $100+ a month.",
    badge: 'NEW',
  },
] as const
