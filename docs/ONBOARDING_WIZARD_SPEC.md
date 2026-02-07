# StarqueZZ Onboarding Wizard Spec

## Overview
Conversational onboarding flow that guides parents through setup with smart suggestions based on their answers. Uses AI to generate personalized habit and reward recommendations.

## Flow: After PIN Setup

```
PIN Set ✓
    ↓
Onboarding Wizard (Kids)
    ↓
Onboarding Wizard (Habits per kid)
    ↓
Store Setup Wizard
    ↓
Ready to Go! 🎉
```

---

## Part 1: Kids Setup Wizard

### Screen 1: Welcome
```
🎉 Welcome to StarqueZZ!

Let's set up your family's quest headquarters.
This will only take a few minutes.

[Let's Go! →]
```

### Screen 2: How Many Kids?
```
How many adventurers are joining?

[1] [2] [3] [4+]
```

### Screen 3: Kid Details (repeat for each)
```
Tell us about Adventurer #1

Name: [____________]

Age: [Dropdown: 3-12]

Pick an avatar:
🦊 🦋 🐻 🦁 🐰 🐼 🦝 🐸 🦄 🐶

[Next →]
```

**Avatar Options (with 🦝 musang!):**
- 🦊 Fox
- 🦋 Butterfly  
- 🐻 Bear
- 🦁 Lion
- 🐰 Bunny
- 🐼 Panda
- 🦝 Raccoon/Musang ← NEW
- 🐸 Frog
- 🦄 Unicorn
- 🐶 Puppy

### Screen 4: Focus Areas (per child)
```
What would you like [Name] to work on?
Pick up to 3 areas.

□ 📚 Learning & Focus
   Reading, homework, practice

□ 🧹 Helping at Home  
   Chores, tidying, responsibilities

□ 🪥 Self-Care & Health
   Hygiene, sleep, eating well

□ 🎨 Creativity & Play
   Art, music, imagination

□ 🤝 Social & Kindness
   Sharing, manners, empathy

[Generate Habits →]
```

### Screen 5: AI-Generated Habits
```
Here's what we suggest for [Name] (age [X]):

CORE HABITS (must complete daily for ⭐)
┌────────────────────────────────────┐
│ ✓ 📖 Reading Time (20 min)        │
│ ✓ ✏️ Writing Practice             │
│ ✓ 🎹 Piano Practice (15 min)      │
└────────────────────────────────────┘

BONUS HABITS (extra ⭐ each)
┌────────────────────────────────────┐
│ + 🛏️ Make Your Bed               │
│ + 🧹 Tidy Room                    │
│ + 🪥 Brush Teeth (morning)        │
│ + 🪥 Brush Teeth (evening)        │
└────────────────────────────────────┘

[Edit Habits] [Looks Good! →]

                    [↻ Start Over]
```

**AI Habit Generation Logic:**
- Use child's age to calibrate difficulty
- Use selected focus areas to pick categories
- Pull from curated habit library + best practices
- Core habits = 3 max (achievable daily)
- Bonus habits = 3-5 (stretch goals)

---

## Part 2: Store Setup Wizard

### Screen 1: Currency
```
What currency should we use for the Star Store?

[🇮🇩 IDR] [🇺🇸 USD] [🇸🇬 SGD] [🇪🇺 EUR] [Other...]

(We'll suggest reward values based on this)
```

### Screen 2: Budget
```
What's your monthly reward budget?

This helps us suggest a good mix of quick wins
and bigger rewards worth saving for.

[Slider: 0 ----●---- 500,000+ IDR]

Or type: [____________] IDR/month
```

### Screen 3: What Motivates?
```
What does [Name] enjoy most?
Pick their top 3 motivators.

□ 🎬 Screen time (movies, shows, games)
□ 🎲 Board games & puzzles
□ 🍦 Treats & snacks  
□ 🎨 Creative activities
□ 📚 Books & stories
□ 🏃 Outdoor adventures
□ 🎁 Small toys or collectibles
□ 👨‍👩‍👧 Quality time with family
```

### Screen 4: Family Values
```
What matters most to your family?
Pick 1-2.

○ ⏰ Time together
  "Experiences over things"

○ 🎯 Teaching value of earning  
  "Work hard → earn rewards"

○ 🌱 Building independence
  "Kids choose their own rewards"

○ 💝 Surprise & delight
  "Keep it fun and flexible"
```

### Screen 5: AI-Generated Store
```
Here's your Star Store for [Name]:

QUICK WINS (5-15 ⭐)
┌────────────────────────────────────┐
│ ⭐5   Extra bedtime story          │
│ ⭐10  15 min screen time           │
│ ⭐15  Choose dinner menu           │
└────────────────────────────────────┘

EARNED REWARDS (20-50 ⭐)
┌────────────────────────────────────┐
│ ⭐20  Small treat from store       │
│ ⭐30  Board game night 🎲          │
│ ⭐40  Stay up 30 min late          │
│ ⭐50  Ice cream trip 🍦            │
└────────────────────────────────────┘

BIG REWARDS (75-150 ⭐)
┌────────────────────────────────────┐
│ ⭐75  Movie night + popcorn 🎬     │
│ ⭐100 Family day trip              │
│ ⭐150 [Dream reward based on budget]│
└────────────────────────────────────┘

[Edit Store] [Looks Good! →]

                    [↻ Start Over]
```

**AI Store Generation Logic:**
- Scale star costs to budget (so max reward ≈ 2-3 weeks of earning)
- Prioritize wholesome rewards:
  - 60% experiences & family time
  - 25% earned privileges (screen time, staying up)
  - 15% treats/small items
- Mix communal (family movie) + solo (own game time)
- Create reward ladder: easy → medium → aspirational

---

## Reward Philosophy (Built-in)

### What We Push:
1. **Time > Stuff** — family experiences beat material things
2. **Earning builds character** — bigger rewards feel meaningful
3. **Connection > Consumption** — board games over toys
4. **Independence + Togetherness** — mix of solo and family

### Default Reward Tiers:
| Stars | Tier | Examples |
|-------|------|----------|
| 5-15 | Quick Win | Extra story, choose snack |
| 20-40 | Small Reward | Screen time, stay up late |
| 50-75 | Medium Reward | Treat trip, game night |
| 100-150 | Big Reward | Movie night, day trip |
| 200+ | Dream Reward | Based on budget input |

---

## Technical Implementation

### New Components Needed:
- `OnboardingWizard.tsx` — Main wizard container with steps
- `KidsSetupStep.tsx` — Add kids with name, age, avatar
- `FocusAreasStep.tsx` — Select habit categories
- `HabitSuggestionsStep.tsx` — AI-generated habits with edit
- `StoreSetupWizard.tsx` — Currency, budget, preferences
- `StoreSuggestionsStep.tsx` — AI-generated rewards with edit

### AI Integration:
- Use OpenRouter API (already configured)
- System prompt with habit/reward best practices
- Input: child age, focus areas, budget, preferences
- Output: structured JSON of suggestions

### Data Flow:
```
User Input → AI Generation → Suggestions Screen → Edit → Save to Supabase
```

### Database:
- No schema changes needed (uses existing tables)
- Wizard state stored in React state / localStorage
- Final save goes to: `children`, `habits`, `rewards` tables

---

## Avatar List Update

Add 🦝 (Raccoon/Musang) to avatar picker:

```typescript
const AVATARS = [
  '🦊', // Fox
  '🦋', // Butterfly
  '🐻', // Bear
  '🦁', // Lion
  '🐰', // Bunny
  '🐼', // Panda
  '🦝', // Raccoon/Musang ← ADD THIS
  '🐸', // Frog
  '🦄', // Unicorn
  '🐶', // Puppy
];
```

---

## Success Criteria

1. Parent completes full onboarding in < 5 minutes
2. AI suggestions feel personalized and age-appropriate
3. Reward ladder encourages earning, not instant gratification
4. Wholesome defaults (family time, experiences) are prominent
5. Easy to edit/customize after AI suggestions
6. "Start Over" available at any point
