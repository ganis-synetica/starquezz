# ⭐ StarqueZZ

**Gamified habit tracking for kids** - Turn daily responsibilities into fun quests!

## Overview

StarqueZZ is a Progressive Web App designed for children aged 5-8 (specifically Zen & Zia). It transforms daily habits into engaging quests where kids earn stars for completions and redeem them for real-world rewards.

## Features (MVP)

### For Kids 👧👦
- **Daily Quests** - Core habits that must be completed
- **Bonus Quests** - Extra habits that unlock after cores
- **Star Economy** - Earn stars, see your balance grow
- **Star Store** - Redeem stars for rewards set by parents
- **Weekly Streak Bonus** - 50% bonus for completing all 7 days

### For Parents 👨‍👩‍👧‍👦
- **Habit Builder** - Create age-appropriate habits
- **LLM-Powered Suggestions** - AI recommends habits based on child's age & focus areas
- **Approval System** - Review completions (24h auto-approve)
- **Reward Manager** - Define real-world rewards
- **Progress Tracking** - Weekly reports & streaks

## Habit Categories
- 🎹 **Learning** - Piano, writing, reading
- 🧹 **Helping Out** - Tidy room, set table
- 🪥 **Self-Care** - Brush teeth, shower
- 💪 **Growth** - Exercise, focus time

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS (Neo-Brutalism theme)
- **Backend**: Supabase (Auth, Postgres, Edge Functions)
- **AI**: OpenRouter (gpt-4o-mini for habit suggestions)
- **Hosting**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and OpenRouter keys

# Run development server
npm run dev
```

## Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENROUTER_API_KEY=your-openrouter-key
```

## Live Demo

🚀 https://starquezz.musang.dev

---

Built with ❤️ for Zen & Zia by Synetica
