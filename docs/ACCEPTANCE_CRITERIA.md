# Starquezz Acceptance Criteria

## HIGH PRIORITY

### 1. Add Redemptions to Parent Approval Queue
**Status:** 🔴 Not Started

**User Story:**
As a parent, I want to see pending Star Store redemptions in my approval queue so I can approve/fulfill them alongside habit completions.

**Acceptance Criteria:**
- [ ] Redemptions with status 'pending' appear in the Approvals tab of Parent Dashboard
- [ ] Each redemption shows: child name/avatar, reward title, stars spent, timestamp
- [ ] Parent can "Fulfill" a redemption (changes status to 'fulfilled')
- [ ] Parent can "Cancel" a redemption (changes status to 'cancelled', refunds stars)
- [ ] Fulfilled/cancelled redemptions disappear from the queue
- [ ] Visual distinction between habit approvals and redemption fulfillments

**Technical Notes:**
- Modify `ApprovalQueue.tsx` to fetch and display redemptions
- Add `cancelRedemption` function to redemptions service
- Need to handle star refund on cancellation

---

### 2. Add "My Rewards" History for Children
**Status:** 🔴 Not Started

**User Story:**
As a child, I want to see my reward history so I can remember what I've earned and track pending redemptions.

**Acceptance Criteria:**
- [ ] "My Rewards" button visible on child dashboard
- [ ] Shows list of all redemptions (pending, fulfilled, cancelled)
- [ ] Each entry shows: reward title, stars spent, status, date
- [ ] Pending redemptions show "Waiting for approval" status
- [ ] Fulfilled redemptions show checkmark/completed state
- [ ] Empty state when no redemptions exist

**Technical Notes:**
- Create new `MyRewards.tsx` page
- Use existing `listRedemptionsForChild` service function
- Add route `/rewards/:childId`

---

### 3. Forgot PIN Flow
**Status:** 🔴 Not Started

**User Story:**
As a parent, I want to reset my child's PIN if they forget it, without needing to delete and recreate the child.

**Acceptance Criteria:**
- [ ] "Forgot PIN" link on PIN entry page
- [ ] Opens parent login modal/page to verify parent identity
- [ ] After parent auth, allows setting a new PIN for the child
- [ ] Child is redirected to dashboard after PIN reset
- [ ] No email verification required (parent auth is sufficient)

**Technical Notes:**
- Add "Forgot PIN" link to `ParentPinEntry.tsx`
- Create PIN reset flow using parent authentication
- Update child's `pin_hash` in database

---

### 4. Push/Email Notifications for Pending Approvals
**Status:** 🔴 Not Started → ⏭️ Skipped (requires backend setup)

**Reason:** This requires setting up a notification service (email provider, push notification infrastructure). Marked for later implementation when backend is ready.

---

## MEDIUM PRIORITY

### 5. Quick Switch Between Children
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Child avatars visible at top of dashboard
- [ ] Tapping another child's avatar switches to their dashboard
- [ ] Current child is visually highlighted
- [ ] Works from both child dashboard and store

---

### 6. Habit Completion Animations/Sounds
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Satisfying animation plays when marking habit complete
- [ ] Stars/confetti effect on completion
- [ ] Optional celebration sound
- [ ] Animation respects user's reduced-motion preference

---

### 7. Streak Counter on Dashboard
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Shows current streak (consecutive days with all core habits done)
- [ ] Visual streak indicator (fire icon with count)
- [ ] Streak resets if a day is missed
- [ ] Shows "New streak!" when starting fresh

---

### 8. Habit History View
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Calendar view showing past completions
- [ ] Days with all habits done highlighted
- [ ] Tap a day to see which habits were completed
- [ ] Shows last 30 days by default

---

### 9. Achievement Badges
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Badges earned for milestones (first star, 7-day streak, 100 stars, etc.)
- [ ] Badge display on child dashboard
- [ ] New badge notification/celebration
- [ ] Badge collection view

---

### 10. Weekly Progress Summary
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Summary view showing week's progress
- [ ] Total stars earned this week
- [ ] Habits completed vs assigned
- [ ] Best day of the week
- [ ] Accessible from parent dashboard

---

### 11. Edit/Delete Habits from Dashboard
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Edit button on each habit in parent view
- [ ] Can modify title, description, category, is_core
- [ ] Delete button with confirmation
- [ ] Changes reflect immediately

---

### 12. Bulk Approve Pending Items
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] "Approve All" button when multiple items pending
- [ ] Confirmation dialog before bulk action
- [ ] Progress indicator during bulk operation
- [ ] Success message showing count approved

---

### 13. Redemption Fulfillment Queue
**Status:** 🔴 Not Started → Part of #1

**Note:** This is covered by adding redemptions to the approval queue.

---

## LOW PRIORITY

### 14. Level System
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Levels based on total stars earned
- [ ] Level indicator on dashboard
- [ ] Level-up celebration
- [ ] Progressive level thresholds

---

### 15. Weekly Challenges
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Special weekly goals (e.g., "Complete all habits 5 days")
- [ ] Bonus reward for completing challenge
- [ ] Challenge progress tracker
- [ ] New challenge each week

---

### 16. Streak Bonuses
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Bonus star for 7-day streak
- [ ] Larger bonus for longer streaks (14, 30 days)
- [ ] Streak milestone celebration

---

### 17. Theme Selector
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Theme picker in child settings
- [ ] 5 themes available (from existing preview files)
- [ ] Theme persists across sessions
- [ ] Smooth theme transition

---

### 18. Custom Avatar Upload
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Upload custom image as avatar
- [ ] Image cropping/resizing
- [ ] Default emoji avatars still available
- [ ] Reasonable file size limit

---

## TECH DEBT

### 19. Error Boundaries
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] App-level error boundary prevents white screen
- [ ] User-friendly error message
- [ ] "Try Again" button
- [ ] Error logged for debugging

---

### 20. Loading Skeletons
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Skeleton placeholders during data loading
- [ ] Matches layout of actual content
- [ ] Smooth transition to loaded state

---

### 21. Optimize Queries
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] Audit current Supabase queries
- [ ] Add appropriate indexes
- [ ] Implement query caching where beneficial
- [ ] Reduce unnecessary refetches

---

### 22. E2E Tests
**Status:** 🔴 Not Started → ⏭️ Skipped for now

**Reason:** Focus on unit tests first. E2E can be added later with Playwright.

---

### 23. PWA Support
**Status:** 🔴 Not Started

**Acceptance Criteria:**
- [ ] App installable on mobile
- [ ] Works offline (cached assets)
- [ ] Push notification support (future)
- [ ] App icon and splash screen

---

*Last updated: Auto-generated*
