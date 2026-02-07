# AGENTS.md - StarqueZZ Project Context

## Project Overview

**StarqueZZ** is a gamified habit tracking PWA for kids aged 5-8. Children complete daily habits ("quests") to earn stars, which they redeem for real-world rewards set by parents.

**Live URL:** https://starquezz.musang.dev
**Repo:** https://github.com/ganis-synetica/starquezz

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS v4 + Neo-Brutalism theme
- **Routing:** React Router v6
- **State:** TanStack Query + React Context
- **Backend:** Supabase (Auth, Postgres, Edge Functions)
- **AI:** OpenRouter API (gpt-4o-mini for habit suggestions)

## Architecture

```
src/
├── components/
│   ├── ui/          # Base UI components (Button, Card, Input)
│   └── layout/      # Layout components
├── pages/           # Route pages
├── hooks/           # Custom React hooks
├── lib/             # Utilities (supabase client, utils)
├── contexts/        # React contexts (Auth, Child session)
├── types/           # TypeScript types
└── services/        # API service functions
```

## Database Schema

Located at `/supabase/schema.sql`. Tables:
- `parents` - Parent accounts (linked to Supabase Auth)
- `children` - Child profiles with PIN, stars, theme
- `habits` - Habit definitions (core vs bonus)
- `habit_completions` - Daily completion records
- `rewards` - Reward definitions
- `redemptions` - Reward redemption records

## Environment Variables

```
VITE_SUPABASE_URL - Supabase project URL
VITE_SUPABASE_ANON_KEY - Supabase anon/public key
VITE_OPENROUTER_API_KEY - OpenRouter for AI features
```

## Auth Flow

### Parent Auth
1. Email/password signup via Supabase Auth
2. On signup, create row in `parents` table
3. JWT stored in localStorage
4. Protected routes check auth state

### Child Auth
1. Parent creates child profile with 4-digit PIN
2. Child selects profile from list
3. Child enters PIN
4. On success, create child session (store child_id in context)
5. Child session expires after 12 hours or on logout

## Core Business Logic

### Habit System
- **Core habits:** 2-4 per child (configurable). Must complete ALL to earn 1 star.
- **Bonus habits:** Only available after all core habits done. Each = 1 star.
- **Approval:** Parent must approve completions. Auto-approve after 24h.

### Star Economy
- Core habits complete (all) = 1 star
- Each bonus habit = 1 star
- Weekly streak (7 days all cores) = 50% bonus of week's total

### Rewards
- Parent defines rewards with star costs
- Child redeems from Star Store
- Status: pending → fulfilled/cancelled/expired
- Pending > 7 days = auto-cancel + refund

## UI/UX Guidelines

### Tone for Kids
- Silly, fun, adventure language
- "Quests" not "tasks" or "chores"
- Celebrate with emojis and animations
- Examples:
  - "Time for your daily dose of quest-astic fun!"
  - "You're a quest-master extraordinaire!"
  - "Ready to quest-ify your day?"

### Tone for Parents
- Professional but warm
- Clear, direct language
- Supportive messaging

### Design System
- Neo-Brutalism: Bold borders (4px black), hard shadows
- Bright colors: Yellow (stars), Purple (accent), Green (success)
- Large touch targets (mobile-first)
- Big, readable fonts

## Testing Credentials

For development, use:
- Parent: test@example.com / password123
- Children: Zen (PIN: 1234), Zia (PIN: 5678)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Key Files to Understand

1. `/src/lib/supabase.ts` - Supabase client
2. `/src/types/index.ts` - All TypeScript types
3. `/src/pages/` - All page components
4. `/supabase/schema.sql` - Database schema

## Current State

✅ Done:
- Project scaffold
- UI components (Button, Card, Input)
- Static demo pages
- Supabase schema defined

❌ TODO (your job):
- Implement Supabase Auth for parents
- Build onboarding flow
- Implement child PIN auth
- Wire up all DB operations
- Build habit CRUD
- Build reward CRUD
- Implement star calculations
- Add LLM habit recommendations
- Make it all work end-to-end

## Definition of Done

MVP is complete when:
1. Parent can sign up and log in
2. Parent can complete onboarding (add child, set habits)
3. Child can log in with PIN
4. Child can view and complete habits
5. Stars are calculated correctly
6. Parent can approve/reject completions
7. Star Store shows rewards
8. Child can redeem rewards
9. All data persists in Supabase
10. No console errors, smooth UX

## Rules

1. Keep code clean and typed
2. Use existing UI components from /src/components/ui
3. Follow the Neo-Brutalism design system
4. Test in browser as you build
5. Commit frequently with clear messages
6. If stuck, check the PRD docs in /docs folder
