import type {
  FamilyValueId,
  FocusAreaId,
  HabitIdea,
  RewardIdea,
  RewardTier,
  StoreMotivatorId,
} from '@/types/onboarding'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL = 'gpt-4o-mini'
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined

type HabitGenerationInput = {
  childName: string
  age: number
  focusAreas: FocusAreaId[]
}

type RewardGenerationInput = {
  familyName?: string
  currency: string
  budget: number
  motivators: StoreMotivatorId[]
  values: FamilyValueId[]
}

type HabitGenerationResult = {
  core: HabitIdea[]
  bonus: HabitIdea[]
  source: 'ai' | 'fallback'
}

type RewardGenerationResult = {
  quick: RewardIdea[]
  earned: RewardIdea[]
  big: RewardIdea[]
  source: 'ai' | 'fallback'
}

type HabitTemplate = {
  title: string
  description: string
}

type RewardTemplate = {
  tier: RewardTier
  title: string
  description: string
  baseCost: number
  motivators?: StoreMotivatorId[]
  values?: FamilyValueId[]
}

async function callOpenRouter(messages: Array<{ role: 'system' | 'user'; content: string }>, schema: object) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('Missing OpenRouter API key')
  }

  const referer = typeof window !== 'undefined' ? window.location.origin : 'https://starquezz.musang.dev'

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': referer,
      'X-Title': 'StarqueZZ Onboarding',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      temperature: 0.6,
      max_tokens: 800,
      response_format: {
        type: 'json_schema',
        json_schema: schema,
      },
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`OpenRouter request failed: ${message}`)
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const output = payload.choices?.[0]?.message?.content
  if (!output) {
    throw new Error('No response from OpenRouter')
  }

  return output
}

const HABIT_LIBRARY: Record<FocusAreaId, { core: HabitTemplate[]; bonus: HabitTemplate[] }> = {
  learning: {
    core: [
      { title: '📚 Reading Time', description: 'Cozy reading nook for 15 minutes' },
      { title: '✏️ Writing Quest', description: 'Practice letters or journal' },
      { title: '🧠 Brainy Challenge', description: 'Math puzzles or flash cards' },
    ],
    bonus: [
      { title: '🔍 Curiosity Hunt', description: 'Find five interesting facts' },
      { title: '🎧 Story Podcast', description: 'Listen to an educational podcast' },
    ],
  },
  helping: {
    core: [
      { title: '🧹 Mini Helper Shift', description: 'Tidy play zone or table' },
      { title: '🧺 Laundry Squad', description: 'Sort clothes by color' },
      { title: '🍽️ Table Captain', description: 'Set the table with flair' },
    ],
    bonus: [
      { title: '🧼 Sparkle Patrol', description: 'Wipe counters or handles' },
      { title: '🌿 Plant Buddy', description: 'Water and chat with plants' },
    ],
  },
  self_care: {
    core: [
      { title: '🪥 Super Brush', description: 'Brush teeth with superhero form' },
      { title: '🛌 Sleepy Stretch', description: 'Wind-down stretch routine' },
      { title: '🥤 Hydration Hero', description: 'Finish water bottle' },
    ],
    bonus: [
      { title: '🥗 Rainbow Snack', description: 'Pick colorful fruits or veggies' },
      { title: '🧘 Calm Cloud', description: '1 minute of belly breathing' },
    ],
  },
  creativity: {
    core: [
      { title: '🎨 Art Lab', description: 'Create a tiny masterpiece' },
      { title: '🎵 Jam Session', description: 'Sing or play music for 10 min' },
      { title: '🧱 Build & Imagine', description: 'Invent with blocks or clay' },
    ],
    bonus: [
      { title: '📸 Photo Safari', description: 'Capture five silly photos' },
      { title: '📝 Story Sparks', description: 'Write a 3-line adventure' },
    ],
  },
  social: {
    core: [
      { title: '💌 Kindness Mission', description: 'Say something kind to someone' },
      { title: '🤗 Family Check-In', description: 'Ask how someone is feeling' },
      { title: '🐾 Pet Pal', description: 'Help care for a pet or plushie' },
    ],
    bonus: [
      { title: '🕺 Dance Share', description: 'Teach someone a fun move' },
      { title: '🎲 Game Host', description: 'Invite family for a quick game' },
    ],
  },
}

const DEFAULT_HABITS: HabitTemplate[] = [
  { title: '🛏️ Make Your Nest', description: 'Fluff pillows and smooth blankets' },
  { title: '🧴 Ready Set Prep', description: 'Pack tomorrow’s backpack together' },
  { title: '🐾 Gentle Guardian', description: 'Feed pets with care' },
  { title: '📖 Storytime', description: 'Read aloud with expression' },
]

function pickTemplates(
  templates: HabitTemplate[],
  count: number,
  takenTitles: Set<string>,
): HabitTemplate[] {
  const picks: HabitTemplate[] = []
  for (const template of templates) {
    if (picks.length >= count) break
    if (takenTitles.has(template.title)) continue
    picks.push(template)
    takenTitles.add(template.title)
  }
  return picks
}

function buildHabitFallback(input: HabitGenerationInput): HabitGenerationResult {
  const taken = new Set<string>()
  const selectedAreas = input.focusAreas.length ? input.focusAreas : (['learning', 'self_care'] satisfies FocusAreaId[])

  const core: HabitIdea[] = []
  for (const area of selectedAreas) {
    const picks = pickTemplates(HABIT_LIBRARY[area].core, 1, taken)
    for (const template of picks) {
      core.push({
        id: `${area}-core-${template.title}`,
        title: template.title,
        description: template.description,
        type: 'core',
      })
    }
  }

  while (core.length < 3) {
    const template = DEFAULT_HABITS[(core.length + input.age) % DEFAULT_HABITS.length]
    if (taken.has(template.title)) break
    taken.add(template.title)
    core.push({
      id: `extra-core-${template.title}`,
      title: template.title,
      description: template.description,
      type: 'core',
    })
  }

  const bonus: HabitIdea[] = []
  for (const area of selectedAreas) {
    const picks = pickTemplates(HABIT_LIBRARY[area].bonus, 1, taken)
    for (const template of picks) {
      bonus.push({
        id: `${area}-bonus-${template.title}`,
        title: template.title,
        description: template.description,
        type: 'bonus',
      })
    }
  }

  while (bonus.length < 4) {
    const template = DEFAULT_HABITS[(bonus.length + core.length) % DEFAULT_HABITS.length]
    if (taken.has(template.title)) break
    taken.add(template.title)
    bonus.push({
      id: `extra-bonus-${template.title}`,
      title: template.title,
      description: template.description,
      type: 'bonus',
    })
  }

  return { core, bonus, source: 'fallback' }
}

const REWARD_TEMPLATES: RewardTemplate[] = [
  { tier: 'quick', title: 'Extra bedtime story', description: 'Snuggle + bonus tale', baseCost: 5, motivators: ['family_time', 'books'], values: ['time_together'] },
  { tier: 'quick', title: 'Choose the dinner side', description: 'Pick veggies or dessert', baseCost: 10, motivators: ['treats', 'creative'] },
  { tier: 'quick', title: 'Dance party DJ', description: 'Lead a 10-min jam', baseCost: 12, motivators: ['family_time'] },
  { tier: 'quick', title: 'Puzzle power-up', description: 'New printable brain teasers', baseCost: 15, motivators: ['board_games', 'books'] },
  { tier: 'earned', title: 'Movie & popcorn night', description: 'Family picks the feature', baseCost: 25, motivators: ['screen_time', 'family_time'], values: ['time_together', 'delight'] },
  { tier: 'earned', title: 'Board game showdown', description: 'Kid chooses challenger + game', baseCost: 30, motivators: ['board_games', 'family_time'] },
  { tier: 'earned', title: 'Nature adventure', description: 'Bike ride or park picnic', baseCost: 35, motivators: ['outdoor'], values: ['time_together'] },
  { tier: 'earned', title: 'Chef for a night', description: 'Plan dinner + help cook', baseCost: 40, motivators: ['creative', 'treats'], values: ['independence'] },
  { tier: 'earned', title: 'Screen time ticket (30 min)', description: 'Choose show or game', baseCost: 45, motivators: ['screen_time'] },
  { tier: 'big', title: 'Backyard camp-out', description: 'Tents, smores, and stars', baseCost: 80, motivators: ['outdoor', 'family_time'], values: ['time_together'] },
  { tier: 'big', title: 'Family day trip', description: 'Zoo, museum, or beach', baseCost: 110, motivators: ['family_time'], values: ['time_together'] },
  { tier: 'big', title: 'Dream creativity kit', description: 'Supplies for big project', baseCost: 120, motivators: ['creative'], values: ['independence'] },
  { tier: 'big', title: 'Give back challenge', description: 'Plan a kindness mission', baseCost: 95, motivators: ['family_time'], values: ['earning', 'time_together'] },
]

const DEFAULT_REWARD_TIERS: Record<RewardTier, number> = {
  quick: 3,
  earned: 4,
  big: 3,
}

function scaleStarCost(base: number, budget: number) {
  const normalized = Math.max(1, budget || 1)
  const factor = Math.min(1.6, Math.max(0.75, normalized / 250_000))
  return Math.max(3, Math.round(base * factor))
}

function scoreTemplate(template: RewardTemplate, motivators: StoreMotivatorId[], values: FamilyValueId[]) {
  let score = 0
  if (template.motivators) {
    for (const motivator of template.motivators) {
      if (motivators.includes(motivator)) score += 2
    }
  }
  if (template.values) {
    for (const value of template.values) {
      if (values.includes(value)) score += 1
    }
  }
  return score
}

function buildRewardFallback(input: RewardGenerationInput): RewardGenerationResult {
  const { budget, motivators, values } = input
  const grouped: Record<RewardTier, RewardIdea[]> = {
    quick: [],
    earned: [],
    big: [],
  }

  const templates = [...REWARD_TEMPLATES].sort(
    (a, b) => scoreTemplate(b, motivators, values) - scoreTemplate(a, motivators, values),
  )

  const usedTitles = new Set<string>()
  for (const template of templates) {
    if (grouped[template.tier].length >= DEFAULT_REWARD_TIERS[template.tier]) continue
    if (usedTitles.has(template.title)) continue

    usedTitles.add(template.title)
    grouped[template.tier].push({
      id: `${template.tier}-${template.title}`,
      title: template.title,
      description: template.description,
      tier: template.tier,
      starCost: scaleStarCost(template.baseCost, budget),
    })
  }

  for (const tier of Object.keys(grouped) as RewardTier[]) {
    while (grouped[tier].length < DEFAULT_REWARD_TIERS[tier]) {
      const template = REWARD_TEMPLATES.find((t) => t.tier === tier && !usedTitles.has(t.title))
      if (!template) break
      usedTitles.add(template.title)
      grouped[tier].push({
        id: `${tier}-${template.title}`,
        title: template.title,
        description: template.description,
        tier,
        starCost: scaleStarCost(template.baseCost, budget),
      })
    }
  }

  return { ...grouped, source: 'fallback' }
}

export async function generateHabitSuggestions(input: HabitGenerationInput): Promise<HabitGenerationResult> {
  try {
    const schema = {
      name: 'HabitSuggestions',
      schema: {
        type: 'object',
        properties: {
          core: {
            type: 'array',
            minItems: 1,
            maxItems: 3,
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
              },
              required: ['title'],
            },
          },
          bonus: {
            type: 'array',
            minItems: 1,
            maxItems: 5,
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
              },
              required: ['title'],
            },
          },
        },
        required: ['core', 'bonus'],
      },
      strict: true,
    }

    const content = await callOpenRouter(
      [
        {
          role: 'system',
          content:
            'You are Musang, a playful parenting coach for StarqueZZ. Suggest age-appropriate kids habits. Keep descriptions short and fun.',
        },
        {
          role: 'user',
          content: `Child name: ${input.childName}\nAge: ${input.age}\nFocus areas: ${input.focusAreas.join(', ') || 'general kindness'}\nReturn JSON with core (max 3) and bonus (3-5) habits. Include emojis in titles.`,
        },
      ],
      schema,
    )

    const parsed = JSON.parse(content) as {
      core?: Array<{ title: string; description?: string }>
      bonus?: Array<{ title: string; description?: string }>
    }

    const toIdea = (item: { title: string; description?: string }, type: 'core' | 'bonus', idx: number): HabitIdea => ({
      id: `${type}-${idx}-${item.title}`,
      title: item.title.trim(),
      description: item.description?.trim() || '',
      type,
    })

    if (!parsed.core?.length || !parsed.bonus?.length) {
      throw new Error('AI returned empty lists')
    }

    return {
      core: parsed.core.slice(0, 3).map((item, index) => toIdea(item, 'core', index)),
      bonus: parsed.bonus.slice(0, 5).map((item, index) => toIdea(item, 'bonus', index)),
      source: 'ai',
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Falling back to manual habit suggestions', error)
    }
    return buildHabitFallback(input)
  }
}

export async function generateRewardSuggestions(input: RewardGenerationInput): Promise<RewardGenerationResult> {
  try {
    const schema = {
      name: 'RewardSuggestions',
      schema: {
        type: 'object',
        properties: {
          quick: {
            type: 'array',
            minItems: 3,
            maxItems: 4,
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                starCost: { type: 'number' },
              },
              required: ['title', 'starCost'],
            },
          },
          earned: {
            type: 'array',
            minItems: 3,
            maxItems: 4,
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                starCost: { type: 'number' },
              },
              required: ['title', 'starCost'],
            },
          },
          big: {
            type: 'array',
            minItems: 2,
            maxItems: 3,
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                starCost: { type: 'number' },
              },
              required: ['title', 'starCost'],
            },
          },
        },
        required: ['quick', 'earned', 'big'],
      },
      strict: true,
    }

    const content = await callOpenRouter(
      [
        {
          role: 'system',
          content:
            'You help parents design wholesome reward stores. Prioritize family experiences over stuff and scale star costs to effort.',
        },
        {
          role: 'user',
          content: `Budget: ${input.budget}\nCurrency: ${input.currency}\nMotivators: ${input.motivators.join(', ') || 'family time'}\nFamily values: ${input.values.join(', ') || 'time together'}\nReturn JSON with quick, earned, big rewards (include experiences).`,
        },
      ],
      schema,
    )

    const parsed = JSON.parse(content) as Record<RewardTier, Array<{ title: string; description?: string; starCost: number }>>

    const toReward = (
      tier: RewardTier,
      item: { title: string; description?: string; starCost: number },
      index: number,
    ): RewardIdea => ({
      id: `${tier}-${index}-${item.title}`,
      title: item.title.trim(),
      description: item.description?.trim(),
      starCost: Math.max(3, Math.round(item.starCost)),
      tier,
    })

    if (!parsed.quick?.length || !parsed.earned?.length || !parsed.big?.length) {
      throw new Error('AI returned incomplete reward tiers')
    }

    return {
      quick: parsed.quick.slice(0, 3).map((item, index) => toReward('quick', item, index)),
      earned: parsed.earned.slice(0, 4).map((item, index) => toReward('earned', item, index)),
      big: parsed.big.slice(0, 3).map((item, index) => toReward('big', item, index)),
      source: 'ai',
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Falling back to manual reward suggestions', error)
    }
    return buildRewardFallback(input)
  }
}
