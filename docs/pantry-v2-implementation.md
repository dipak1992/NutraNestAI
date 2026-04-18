# MealEase Pantry Mode v2 — Complete Implementation Guide

## Overview

**Problem**: Pantry mode was suggesting recipes with ingredients the user didn't actually have, destroying trust.

**Solution**: Two-stage strict constraint system that ensures recipes ONLY use ingredients in the pantry.

---

## Architecture

### Stage 1: Vision Detection (Improved)

**Endpoint**: `POST /api/pantry/vision-v2`

**Key Changes**:
- Classifies detected items by confidence: `confirmed`, `probable`, `uncertain`
- Conservative prompt prevents hallucinations
- Only suggests ingredients clearly visible in photo

**Request**:
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response**:
```json
{
  "confirmed_items": ["pasta", "canned beans", "olive oil"],
  "probable_items": ["rice", "tomato sauce"],
  "uncertain_items": ["unlabeled jar"],
  "raw_response": "...",
  "timestamp": "2026-04-18T..."
}
```

### Stage 2: User Review (NEW)

**Component**: `EditPantryIngredientsModal`

**Features**:
- Display detected ingredients by confidence tier
- Allow user to:
  - Confirm/remove items from `confirmed`
  - Promote/demote items between tiers
  - Add missing items
- Shows trust indicator based on how many items are in `uncertain`

**UX Flow**:
1. User scans pantry photo
2. System detects ingredients with confidence tiers
3. **User Reviews** - edits detected list (NEW STEP)
4. User approves/adjusts
5. System generates recipes based on APPROVED items only

### Stage 3: Recipe Generation (Strict)

**Endpoint**: `POST /api/pantry/match-v2`

**Key Changes**:
- Uses constraint engine that categorizes meals into 3 types
- **Never** suggests recipes with missing major ingredients
- Basic staples (salt, pepper, oil, water) assumed to be always available

**Request**:
```json
{
  "confirmed": ["pasta", "canned beans", "olive oil"],
  "probable": ["rice", "tomato sauce"],
  "household": { "adultsCount": 2, "kidsCount": 1, "toddlersCount": 0, "babiesCount": 0 },
  "includeProbable": true,
  "allergies": ["peanuts"],
  "dietaryRestrictions": ["vegetarian"],
  "budget": "low",
  "maxCookTime": 30,
  "maxMissingForAlmostReady": 1
}
```

**Response**:
```json
{
  "statusCode": 200,
  "scannedIngredients": {
    "confirmed": ["pasta", "canned beans", "olive oil"],
    "probable": ["rice", "tomato sauce"],
    "uncertain": [],
    "manuallyAdded": [],
    "lastUpdated": "2026-04-18T..."
  },
  "suggestions": {
    "make_now": [
      {
        "type": "make_now",
        "confidence": 100,
        "mealId": "pasta-001",
        "title": "Pasta Aglio e Olio",
        "badge": "✅ Everything Available",
        "availableIngredients": ["pasta", "olive oil", "garlic", "salt", "pepper"],
        "missingIngredients": [],
        "missingCount": 0,
        "reasons": ["Everything you need is available", "Quick & easy to prepare"],
        "totalTime": 15,
        "difficulty": "easy"
      }
    ],
    "almost_ready": [
      {
        "type": "almost_ready",
        "confidence": 83,
        "mealId": "bean-rice-001",
        "title": "Bean & Rice Bowl",
        "badge": "🟡 Missing 1 Item",
        "availableIngredients": ["beans", "rice", "olive oil", "salt"],
        "missingIngredients": ["onion"],
        "missingCount": 1,
        "reasons": ["Just need: onion", "Kid-friendly"],
        "totalTime": 25,
        "difficulty": "easy"
      }
    ],
    "shopping_upgrade": [
      {
        "type": "shopping_upgrade",
        "confidence": 60,
        "mealId": "curry-001",
        "title": "Chickpea Curry",
        "badge": "🛒 Needs Few Extras",
        "availableIngredients": ["chickpeas", "rice", "onion"],
        "missingIngredients": ["coconut milk", "curry powder", "ginger"],
        "missingCount": 3,
        "reasons": ["3 items to shop", "Quick & easy to prepare"]
      }
    ]
  },
  "trustScore": 82,
  "editIngredientsSuggested": false
}
```

---

## Files Changed / Created

### New Files

1. **`lib/pantry/types.ts`** - Type definitions
   - `ConfidenceLevel` enum
   - `VisionScanResult` interface
   - `PantryState` interface
   - `PantryRecipeSuggestion` interface
   - `PantryMatchResponse` interface

2. **`lib/pantry/constraint-engine.ts`** - Core logic
   - `categorizeMealForPantry()` - Classify a meal
   - `filterMealsForPantry()` - Filter by constraints
   - `rankPantryMeals()` - Sort by confidence
   - `calculateTrustScore()` - Generate trust metric

3. **`app/api/pantry/vision-v2/route.ts`** - New vision endpoint
   - Improved prompt with confidence tiers
   - Conservative detection

4. **`app/api/pantry/match-v2/route.ts`** - New matching endpoint
   - Strict constraint enforcement
   - Three-tier output categorization

### Modified Files (Optional - For Better UX)

- `components/pantry/EditPantryIngredientsModal.tsx` - NEW COMPONENT
  - Shows detected ingredients with confidence indicators
  - Allows user edits
  - Shows trust score

---

## Three Output Categories Explained

### 1. ✅ MAKE NOW (Make Now Cards)

**Criteria**: 0 missing items (beyond basic staples)

**Example**:
- User has: pasta, canned tomatoes, olive oil, garlic
- Recipe: Pasta Pomodoro
- Status: **Make right now, everything available**

**Trust**: Highest - user can start cooking immediately

### 2. 🟡 ALMOST READY (Inspirational Cards)

**Criteria**: 1 missing item

**Example**:
- User has: rice, beans, olive oil, salt
- Recipe: Bean & Rice Bowl
- Missing: 1 onion
- Status: **Nearly ready, need 1 item**

**Trust**: High - users often have items not visible in scan

**Why useful**:
- User might already have onion somewhere
- Low friction to add one item
- Prevents "no suggestions" feeling

### 3. 🛒 SHOPPING UPGRADE (Inspiration)

**Criteria**: 2+ missing items

**Example**:
- User has: rice, oil, salt
- Recipe: Coconut Curry
- Missing: coconut milk, curry powder, ginger
- Status: **Could make with shopping**

**Trust**: Inspiration only
- Users aren't promised they can make these
- Sets healthy expectations
- Prevents hallucinated recipes

---

## Basic Staples (Always Assumed Available)

The constraint engine assumes these are always available:

```typescript
const BASIC_STAPLES = [
  'salt',
  'pepper',
  'oil',
  'water',
  'sugar',
  'vinegar',
  'garlic',
  'onion',
]
```

**Why**:
- Most kitchens have these core items
- Reduces friction for recipes
- Still respects major ingredient constraints

**Can be configured per region later** (e.g., cumin in Indian kitchens)

---

## Trust Score Calculation

```
TrustScore (0-100) =
  (pantrySize / 10) * 50         [50% weight on pantry size]
  + (mealCount / 5) * 30         [30% weight on options available]
  + (avgConfidence / 100) * 20   [20% weight on suggestion confidence]
```

**Examples**:
- 15 pantry items, 6 meals, 95% confidence → ~85 trust
- 5 pantry items, 2 meals, 70% confidence → ~50 trust

**UI**: Shown as visual indicator
- Green: 75+ (confident)
- Yellow: 50-74 (moderate)
- Red: <50 (limited options, edit suggested)

---

## User Workflow

### 1. User Takes Pantry Photo

```
📸 User taps "Scan Pantry" button
→ Uploads photo
```

### 2. System Analyzes

```
🤖 GPT-4o-mini analyzes image
→ Detects: confirmed, probable, uncertain items
→ Returns JSON with confidence tiers
```

### 3. **USER REVIEWS** (NEW CRITICAL STEP)

```
👁️ User sees:
  ✅ CONFIRMED:  [pasta] [canned beans] [olive oil]
  🟡 PROBABLE:   [rice] [tomato sauce]
  ❓ UNCERTAIN:  [unlabeled jar]

👇 User can:
   - Remove items they don't have
   - Promote "probable" to "confirmed"
   - Add manually missing items
   - Tap "Add Items Manually" to add more

🟢 User taps "Generate Recipes" when satisfied
```

**This step is CRITICAL**:
- Prevents hallucinations from spreading
- Empowers user with control
- Builds trust
- Takes <30 seconds

### 4. System Generates Recipes

```
🍳 Constraint engine categorizes all meals:
  - Make Now (0 missing)
  - Almost Ready (1 missing)
  - Shopping Upgrade (2+ missing)

→ Displays with badges and missing items highlighted
```

### 5. User Selects & Cooks

```
✅ User picks recipe from "Make Now"
→ Sees full ingredient list (no surprises)
→ All ingredients marked "fromPantry: true"
→ Proceeds with full confidence
```

---

## Migration Strategy (No Breaking Changes)

### Phase 1: Deploy alongside existing endpoints
- New endpoints: `vision-v2`, `match-v2`
- Old endpoints: Still work unchanged
- Frontend: Can gradually migrate

### Phase 2: Gradual frontend migration
- Add "Edit Ingredients" modal
- Switch to `vision-v2` + `match-v2`
- Monitor user feedback

### Phase 3: Deprecate old endpoints
- Once migration complete
- Keep old for 6 months for backwards compatibility

---

## Testing Strategy

### Test Cases

1. **Vision Detection**
   - ✅ Clearly visible labeled items → confirmed
   - ✅ Partially visible items → probable
   - ✅ Unlabeled containers → uncertain
   - ✅ NO hallucinations of items not visible

2. **Constraint Engine**
   - ✅ Recipe with all items in pantry → make_now
   - ✅ Recipe with 1 missing → almost_ready
   - ✅ Recipe with 2+ missing → shopping_upgrade
   - ✅ Dietary/allergy filters still work
   - ✅ Basic staples properly assumed

3. **User Workflow**
   - ✅ User can edit detected ingredients
   - ✅ Changes reflected in recipes
   - ✅ Trust score updates
   - ✅ No confusion about missing items

### Example Test Case

**Setup**:
```
Pantry: pasta, canned tomatoes, olive oil, garlic, salt
User prefs: Vegetarian, max 20 min
```

**Expectation**:
```
Make Now: Pasta Aglio e Olio (all ingredients present)
Almost Ready: Marinara Pasta (need fresh basil)
Shopping Upgrade: Eggplant Pasta (need eggplant, more)
```

**NOT**:
```
Chicken Alfredo (requires chicken, cream, parmesan - NONE present)
```

---

## Success Metrics

### Trust Metrics
- User taps "Edit Ingredients" after scan: Shows trust in system
- Users complete "Make Now" recipes: Shows recipes actually work
- Low abandonment on Almost Ready: Shows recipes are realistic

### Usage Metrics
- Pantry mode usage increasing
- Higher completion rate on pantry-sourced recipes
- Lower "missing ingredient" support tickets

### Feedback
- NPS: "Actually uses what I have" ← This is the goal
- Reduced complaints about hallucinated ingredients

---

## FAQ

**Q: Why assume basic staples?**
A: Reduces friction while still being realistic. Most kitchens have salt/pepper/oil. Users still get maximum accuracy for important ingredients.

**Q: What if user doesn't do the review step?**
A: System generates recipes based on detected ingredients. But showing edit modal educates user about confidence levels.

**Q: Can user disable a recipe type?**
A: Yes - could add UI toggle for "Show me only Make Now recipes" vs "Show me all inspiration".

**Q: Does this work with Fridge Mode?**
A: Yes! Same constraint logic applies. Fridge detection already works well, so confidence tiers become even more accurate.

---

## Next Steps

1. Deploy vision-v2 and match-v2 endpoints
2. Build EditPantryIngredientsModal component
3. Create integration tests
4. Gradually migrate frontend
5. Monitor and iterate

