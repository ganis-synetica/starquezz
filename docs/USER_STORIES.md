# User Stories - StarqueZZ MVP

## Epic 1: Parent Authentication

### US-1.1: Parent Sign Up
**As a** parent  
**I want to** create an account with email and password  
**So that** I can manage my children's habits and rewards

**Acceptance Criteria:**
- [ ] Sign up form with email, password, confirm password
- [ ] Password minimum 8 characters
- [ ] Email validation
- [ ] Error messages for invalid input
- [ ] Success → redirect to onboarding
- [ ] Creates row in `parents` table

### US-1.2: Parent Login
**As a** parent  
**I want to** log in to my account  
**So that** I can access my dashboard

**Acceptance Criteria:**
- [ ] Login form with email, password
- [ ] "Forgot password" link (Supabase handles)
- [ ] Error message for wrong credentials
- [ ] Success → redirect to parent dashboard
- [ ] Session persists on refresh

### US-1.3: Parent Logout
**As a** parent  
**I want to** log out  
**So that** my account is secure

**Acceptance Criteria:**
- [ ] Logout button in parent dashboard
- [ ] Clears session
- [ ] Redirects to home page

---

## Epic 2: Onboarding

### US-2.1: Add First Child
**As a** new parent  
**I want to** add my first child during onboarding  
**So that** I can start tracking their habits

**Acceptance Criteria:**
- [ ] Step 1: "What's your child's name?"
- [ ] Step 2: "Choose an avatar" (emoji picker)
- [ ] Step 3: "Set a 4-digit PIN"
- [ ] PIN confirmation (enter twice)
- [ ] Creates row in `children` table
- [ ] PIN stored as bcrypt hash

### US-2.2: LLM Habit Recommendations
**As a** parent during onboarding  
**I want to** get AI-suggested habits  
**So that** I don't have to think of everything myself

**Acceptance Criteria:**
- [ ] Step 4: "How old is [child]?" (5-8 slider)
- [ ] Step 5: "What areas to focus on?" (multi-select)
  - Learning & Practice
  - Helping at Home
  - Self-Care & Routine
  - Focus & Discipline
- [ ] Call OpenRouter API with prompt
- [ ] Display 5-6 suggested habits
- [ ] Parent can select/deselect habits
- [ ] Parent can edit habit text
- [ ] Selected habits saved to DB

### US-2.3: Set Core Habits
**As a** parent  
**I want to** mark which habits are "core" (required daily)  
**So that** my child knows their must-dos

**Acceptance Criteria:**
- [ ] Toggle to mark habit as core
- [ ] Minimum 2 core habits, maximum 4
- [ ] Visual distinction for core vs bonus
- [ ] Saves `is_core` flag to DB

### US-2.4: Set Initial Rewards
**As a** parent  
**I want to** add a few rewards during onboarding  
**So that** my child has something to work toward

**Acceptance Criteria:**
- [ ] "Add a reward" form (title, star cost)
- [ ] Suggested rewards shown (10, 25, 50 star examples)
- [ ] At least 1 reward required
- [ ] Saves to `rewards` table

### US-2.5: Complete Onboarding
**As a** parent  
**I want to** finish onboarding  
**So that** my child can start using the app

**Acceptance Criteria:**
- [ ] Summary screen showing child, habits, rewards
- [ ] "Looks good!" button
- [ ] Redirect to parent dashboard
- [ ] Onboarding marked complete (don't show again)

---

## Epic 3: Child Experience

### US-3.1: Child Profile Selection
**As a** child  
**I want to** tap my name/avatar on the home screen  
**So that** I can access my quests

**Acceptance Criteria:**
- [ ] Home page shows all children for logged-in parent
- [ ] Each child shows name, avatar, star count
- [ ] Tapping child → PIN entry screen

### US-3.2: Child PIN Login
**As a** child  
**I want to** enter my PIN  
**So that** I can see my quests

**Acceptance Criteria:**
- [ ] 4-digit PIN pad (big buttons, kid-friendly)
- [ ] Visual feedback on button press
- [ ] Wrong PIN → shake animation, "Try again!"
- [ ] 5 wrong attempts → 15 min lockout
- [ ] Correct PIN → child dashboard
- [ ] Session stored in context

### US-3.3: View Daily Quests
**As a** child  
**I want to** see my quests for today  
**So that** I know what to do

**Acceptance Criteria:**
- [ ] Core quests shown at top with "⚡ Must-Do" label
- [ ] Bonus quests shown below (locked if cores incomplete)
- [ ] Each quest shows: title, checkbox, category icon
- [ ] Progress indicator: "2/3 quests done"
- [ ] Fun greeting: "Hey [name]! Ready to quest-ify your day?"

### US-3.4: Complete a Quest
**As a** child  
**I want to** mark a quest as done  
**So that** I can earn stars

**Acceptance Criteria:**
- [ ] Tap checkbox → animation + sound
- [ ] Quest marked complete in DB
- [ ] Status: "pending approval" shown
- [ ] If all cores done, unlock bonus quests
- [ ] Fun message: "Quest complete! Waiting for approval 🎉"

### US-3.5: View Star Balance
**As a** child  
**I want to** see how many stars I have  
**So that** I know what I can buy

**Acceptance Criteria:**
- [ ] Star count always visible in header
- [ ] Tapping stars → Star Store
- [ ] Shows approved stars only (not pending)

### US-3.6: Browse Star Store
**As a** child  
**I want to** see available rewards  
**So that** I can choose what to save for

**Acceptance Criteria:**
- [ ] Grid of reward cards
- [ ] Each shows: title, star cost
- [ ] "Get it!" button if can afford
- [ ] "Need X more" if can't afford
- [ ] Affordable items highlighted

### US-3.7: Redeem Reward
**As a** child  
**I want to** spend my stars on a reward  
**So that** I get something I want

**Acceptance Criteria:**
- [ ] Tap "Get it!" → confirmation modal
- [ ] "Are you sure? This costs X stars"
- [ ] Confirm → deduct stars, create redemption
- [ ] Fun message: "Woohoo! Ask your parent for your prize!"
- [ ] Redemption status: pending

---

## Epic 4: Parent Dashboard

### US-4.1: View Dashboard Home
**As a** parent  
**I want to** see an overview of my children's progress  
**So that** I can track how they're doing

**Acceptance Criteria:**
- [ ] Each child card shows: name, today's progress, streak
- [ ] Quick stats: quests completed this week
- [ ] Pending approvals count with badge

### US-4.2: Approve Quest Completions
**As a** parent  
**I want to** approve my child's completed quests  
**So that** they can earn their stars

**Acceptance Criteria:**
- [ ] List of pending completions
- [ ] Each shows: child name, quest, time completed
- [ ] Approve button (green) → awards stars
- [ ] Reject button (red) → modal for reason
- [ ] Rejection notifies child: "Try again!"
- [ ] Auto-approve after 24h (background job)

### US-4.3: Manage Habits
**As a** parent  
**I want to** add/edit/remove habits  
**So that** I can adjust what my child works on

**Acceptance Criteria:**
- [ ] List of all habits per child
- [ ] Add habit: title, description, category, core?
- [ ] Edit habit: all fields editable
- [ ] Disable habit (soft delete)
- [ ] Reorder habits (drag & drop nice-to-have)

### US-4.4: Manage Rewards
**As a** parent  
**I want to** add/edit/remove rewards  
**So that** I can control the Star Store

**Acceptance Criteria:**
- [ ] List of all rewards
- [ ] Add reward: title, description, star cost
- [ ] Edit reward: all fields editable
- [ ] Disable reward (soft delete)

### US-4.5: Fulfill Redemptions
**As a** parent  
**I want to** mark rewards as fulfilled  
**So that** my child knows I delivered

**Acceptance Criteria:**
- [ ] List of pending redemptions
- [ ] Each shows: child, reward, when redeemed
- [ ] "Mark Fulfilled" button
- [ ] "Cancel & Refund" button
- [ ] Auto-cancel after 7 days with refund

### US-4.6: Add Another Child
**As a** parent  
**I want to** add more children  
**So that** all my kids can use the app

**Acceptance Criteria:**
- [ ] "Add Child" button in settings
- [ ] Same flow as onboarding (name, avatar, PIN, habits)
- [ ] New child appears on home page

---

## Epic 5: Star Calculations

### US-5.1: Daily Core Stars
**As the** system  
**I need to** award 1 star when all core habits are approved  
**So that** the star economy works correctly

**Acceptance Criteria:**
- [ ] Check: all core habits for child on date approved?
- [ ] If yes and not already awarded → +1 star
- [ ] Update `children.stars`
- [ ] Only award once per day

### US-5.2: Bonus Stars
**As the** system  
**I need to** award 1 star per approved bonus habit  
**So that** extra effort is rewarded

**Acceptance Criteria:**
- [ ] When bonus habit approved → +1 star
- [ ] Only if all cores done that day
- [ ] Update `children.stars`

### US-5.3: Weekly Streak Bonus
**As the** system  
**I need to** award 50% bonus for perfect weeks  
**So that** consistency is rewarded

**Acceptance Criteria:**
- [ ] Calculate on Sunday night
- [ ] Check: all 7 days had core habits completed?
- [ ] If yes → sum week's stars × 0.5 (rounded down)
- [ ] Award bonus, show celebration to child

---

## Priority Order for Implementation

### Phase 1: Core Auth & Data (Must Have First)
1. US-1.1 Parent Sign Up
2. US-1.2 Parent Login
3. US-2.1 Add First Child (basic, no LLM yet)
4. US-3.2 Child PIN Login
5. Database integration for all operations

### Phase 2: Core Loop
6. US-3.3 View Daily Quests
7. US-3.4 Complete a Quest
8. US-4.2 Approve Quest Completions
9. US-5.1 Daily Core Stars
10. US-3.5 View Star Balance

### Phase 3: Rewards
11. US-3.6 Browse Star Store
12. US-3.7 Redeem Reward
13. US-4.4 Manage Rewards
14. US-4.5 Fulfill Redemptions

### Phase 4: Polish
15. US-2.2 LLM Habit Recommendations
16. US-4.1 Dashboard Home
17. US-4.3 Manage Habits
18. US-5.2 Bonus Stars
19. US-5.3 Weekly Streak Bonus
20. US-4.6 Add Another Child

---

## Out of Scope for MVP
- Push notifications
- Offline mode
- Theme customization
- Multiple parents per family
- Social features
- Achievement badges
