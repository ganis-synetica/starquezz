# Parent Setup Wizard

## Overview

After a parent signs up/logs in for the first time (no children yet), they're guided through a wizard to set up their family.

## Flow

```
Login/Signup → Has children? 
  → Yes: Go to Parent Dashboard
  → No: Start Setup Wizard
```

## Wizard Steps

### Step 1: Welcome
- "Welcome to StarqueZZ! 🌟"
- "Let's set up your family in just a few steps"
- "Get Started" button

### Step 2: Add Child
- "What's your child's name?"
- Text input for name
- "Choose an avatar" (emoji grid: 🦊🦋🐱🐶🦁🐰🐼🐨🦄🐸)
- "Add Child" button
- **No PIN required** — kids just tap their profile to switch

### Step 3: Add Habits
- "What should [child] do daily?"
- Pre-filled suggestions (can edit/remove):
  - 🎹 Practice Piano (core)
  - ✏️ Writing Exercise (core)
  - 📖 Reading Time (core)
  - 🛏️ Make Your Bed (bonus)
  - 🧹 Tidy Room (bonus)
  - 🪥 Brush Teeth (bonus)
- Toggle core/bonus for each
- "Add custom habit" option
- Minimum 2 habits required
- "Next" button

### Step 4: Add Rewards
- "What can [child] earn?"
- Pre-filled suggestions (can edit/remove):
  - Ice Cream Trip 🍦 (10 stars)
  - Movie Night 🎬 (25 stars)
  - Pizza Party 🍕 (50 stars)
- "Add custom reward" option
- Minimum 1 reward required
- "Next" button

### Step 5: Add Another Child? (Optional)
- "Want to add another child?"
- "Add Another Child" → Go to Step 2
- "I'm Done" → Go to Summary

### Step 6: Summary & Complete
- "You're all set! 🎉"
- Summary: [X] children, [Y] habits, [Z] rewards
- List of children with avatars
- "Start Questing!" button → Home Page

## Technical Implementation

### New Components
- `src/pages/ParentSetupWizard.tsx` - Main wizard container
- `src/components/wizard/WelcomeStep.tsx`
- `src/components/wizard/AddChildStep.tsx`
- `src/components/wizard/AddHabitsStep.tsx`
- `src/components/wizard/AddRewardsStep.tsx`
- `src/components/wizard/SummaryStep.tsx`

### State Management
- Wizard state stored in component (not persisted until complete)
- On complete: batch insert children, habits, rewards
- Mark parent as "setup_complete" (optional flag or just check children.length > 0)

### Routing
- `/parent/setup` - Wizard page
- Redirect logic in `ParentDashboard` or after login

### Database Changes
- `children.pin_hash` - Now optional (nullable), no longer required
- `habits` - title, description, category, is_core, child_id, parent_id
- `rewards` - title, description, star_cost, parent_id

## UI/UX Notes

### Style
- Same whimsical Jessica Hische style as onboarding
- Soft colors, rounded corners
- Progress indicator (dots or steps)
- Animations on transitions

### Validation
- Child name: required, 2-20 chars
- Habits: minimum 2
- Rewards: minimum 1

## Parent Management Features

### Delete Child Profile
- Parent can delete a child from Settings
- Confirmation required: "Delete [name]? This removes all their quests and history."
- Soft delete (mark inactive) or hard delete

### Manage Star Store
- Parent can add/edit/remove rewards
- Set title, description, star cost
- Toggle active/inactive

### Error Handling
- Show inline errors
- Don't lose progress on error
- "Back" button on each step

## Future Enhancements (Not MVP)
- LLM-powered habit suggestions based on child age
- Import habits from templates
- Skip wizard option (add children later)
