/**
 * Copilot Function Calling Tool Definitions
 *
 * These tools map to existing MealEase APIs and allow the copilot
 * to take actions on behalf of the user (suggest meals, add to grocery, etc.)
 */

import type { ChatCompletionTool } from 'openai/resources/chat/completions'

export const COPILOT_TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'suggest_tonight_dinner',
      description: 'Get a dinner suggestion for tonight based on preferences',
      parameters: {
        type: 'object',
        properties: {
          mode: {
            type: 'string',
            enum: ['quick', 'vegetarian', 'budget', 'comfort', 'healthy'],
            description: 'Type of meal to suggest',
          },
          maxCookTime: {
            type: 'number',
            description: 'Maximum cook time in minutes',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'swap_tonight_meal',
      description: 'Swap the current tonight suggestion for a different one',
      parameters: {
        type: 'object',
        properties: {
          reason: {
            type: 'string',
            enum: ['too-complex', 'too-expensive', 'not-in-mood', 'dietary', 'quicker'],
            description: 'Why the user wants to swap',
          },
        },
        required: ['reason'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_to_grocery_list',
      description: 'Add items to the grocery list',
      parameters: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { type: 'string' },
            description: 'Items to add',
          },
        },
        required: ['items'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_weekly_plan',
      description: 'Generate a new weekly meal plan',
      parameters: {
        type: 'object',
        properties: {
          preferences: {
            type: 'string',
            description: 'Any specific preferences for this week',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'suggest_leftover_meal',
      description: 'Suggest a meal using leftover ingredients',
      parameters: {
        type: 'object',
        properties: {
          leftovers: {
            type: 'array',
            items: { type: 'string' },
            description: 'Leftover ingredients to use',
          },
        },
        required: ['leftovers'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'navigate_to_screen',
      description: 'Navigate the user to a specific screen in the app',
      parameters: {
        type: 'object',
        properties: {
          screen: {
            type: 'string',
            enum: ['tonight', 'cook', 'plan', 'leftovers', 'budget', 'grocery', 'settings'],
            description: 'Screen to navigate to',
          },
        },
        required: ['screen'],
      },
    },
  },
]

/**
 * Map of screen names to their app routes.
 */
export const SCREEN_ROUTES: Record<string, string> = {
  tonight: '/dashboard/tonight',
  cook: '/dashboard/cook',
  plan: '/dashboard',
  leftovers: '/leftovers',
  budget: '/budget',
  grocery: '/grocery',
  settings: '/settings',
}
