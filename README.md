# ⭐ StarqueZZ

**Gamified habit tracking for kids** - Turn daily responsibilities into fun quests!

## Live Demo
🚀 https://starquezz.musang.dev

---

## Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Fill in your Supabase keys

# 3. Run dev server
npm run dev
```

## Deployment (One-time Setup)

### 1. Supabase Setup
```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Login & link project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Run schema (creates tables)
# Go to Supabase Dashboard → SQL Editor → paste supabase/schema.sql
```

### 2. Vercel Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login & deploy
vercel login
vercel --prod

# Add env vars (one-time)
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

### 3. Seed Data (optional)
```bash
# After signing up in the app, get your UUID from Supabase Auth dashboard
npm run seed YOUR_PARENT_UUID your@email.com
```

## Ongoing Deployment

After initial setup, deploying is simple:

```bash
# Push code changes
git push origin main

# Vercel auto-deploys on push, OR manually:
npm run deploy
```

## Database Changes

For schema changes, create a migration:
```bash
# Edit supabase/schema.sql with your changes
# Then run in Supabase SQL Editor

# Note: Migrations are ADDITIVE - existing data is preserved
```

## NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run deploy` | Build & deploy to Vercel |
| `npm run seed` | Seed database with test data |
| `npm run db:push` | Push migrations to Supabase |

## Environment Variables

**For app (.env.local):**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**For scripts (seed, migrations):**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-service-role-key
```

## Features

### For Kids 👧👦
- Daily Quests (must-do habits)
- Bonus Quests (unlock after cores)
- Star Economy
- Star Store (redeem for rewards)

### For Parents 👨‍👩‍👧‍👦
- Approval Queue
- Habit Builder
- Reward Manager
- Progress Tracking

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS (Neo-Brutalism)
- **Backend**: Supabase (Auth, Postgres, Edge Functions)
- **Hosting**: Vercel

---

Built with ❤️ for Zen & Zia by Synetica
