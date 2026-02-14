# Starquezz User Flow

## Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STARQUEZZ APP                                │
│                                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │  PARENT  │───▶│  CHILD   │───▶│  HABITS  │───▶│  REWARDS │      │
│  │  SETUP   │    │  SELECT  │    │  TRACKER │    │  STORE   │      │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│       │                                │                             │
│       │                                ▼                             │
│       │                         ┌──────────┐                        │
│       └────────────────────────▶│ APPROVAL │                        │
│                                 │  QUEUE   │                        │
│                                 └──────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. New User Journey (First Time Parent)

```
┌─────────┐     ┌─────────┐     ┌───────────┐     ┌─────────────┐
│ Landing │────▶│ Sign Up │────▶│ Onboarding│────▶│ Parent Setup│
│  Page   │     │  Page   │     │  Wizard   │     │   Wizard    │
└─────────┘     └─────────┘     └───────────┘     └─────────────┘
                                      │                  │
                                      │                  ▼
                                      │           ┌─────────────┐
                                      │           │  Add Child  │
                                      │           │   Wizard    │
                                      │           └─────────────┘
                                      │                  │
                                      ▼                  ▼
                                ┌─────────────────────────────┐
                                │         Home Page           │
                                │   (Child Profile Select)    │
                                └─────────────────────────────┘
```

### Steps:
1. **Landing Page** (`/`) - See app intro, "Parent Login" button
2. **Sign Up** (`/signup`) - Email + password
3. **Onboarding Wizard** (`/onboarding`) - Intro slides explaining the app
4. **Parent Setup** (`/parent/setup`) - Set parent PIN, family name
5. **Add Child Wizard** (`/parent/add-child`) - Name, avatar, age, habits, rewards
6. **Home Page** (`/`) - See child profiles, ready to use!

---

## 2. Returning Parent Journey

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌───────────────┐
│ Landing │────▶│  Login  │────▶│  Home   │────▶│   PIN Entry   │
│  Page   │     │  Page   │     │  Page   │     │    Page       │
└─────────┘     └─────────┘     └─────────┘     └───────────────┘
                                                        │
                    ┌───────────────────────────────────┘
                    ▼
            ┌───────────────┐     ┌───────────────┐
            │   Approval    │────▶│   Add Child   │
            │    Queue      │     │    Wizard     │
            └───────────────┘     └───────────────┘
```

### Steps:
1. **Landing** → **Login** (`/login`)
2. **Home Page** → Click "Parent Dashboard"
3. **PIN Entry** (`/parent/pin`) - Enter 4-digit PIN
4. **Approval Queue** (`/parent/approvals`) - Approve/reject completed habits
5. Optional: Add another child

---

## 3. Child Daily Journey

```
┌─────────┐     ┌───────────┐     ┌───────────────┐     ┌───────────┐
│  Home   │────▶│  Child    │────▶│    Tap to     │────▶│  Pending  │
│  Page   │     │ Dashboard │     │   Complete    │     │  Approval │
└─────────┘     └───────────┘     └───────────────┘     └───────────┘
                     │                                        │
                     │                                        ▼
                     │                                  ┌───────────┐
                     │                                  │  Parent   │
                     │                                  │  Approves │
                     │                                  └───────────┘
                     │                                        │
                     ▼                                        ▼
               ┌───────────┐                           ┌───────────┐
               │   Star    │◀──────────────────────────│  ⭐ +1    │
               │   Store   │                           │  Earned!  │
               └───────────┘                           └───────────┘
```

### Steps:
1. **Home Page** → Tap child profile
2. **Child Dashboard** (`/child/:id`)
   - See daily "Must Do" quests (core habits)
   - See "Bonus" quests (extra habits for more stars)
3. **Complete Habit** → Tap habit card
4. **Pending State** → "Waiting for grown-up ⏳"
5. **Parent Approves** → Star awarded!
6. **Star Store** (`/store/:id`) → Spend stars on rewards

---

## 4. Approval Flow (Parent)

```
┌───────────────┐     ┌────────────────────────────────────────────┐
│   Approval    │     │              Pending Item                   │
│    Queue      │────▶│  ┌─────────────────────────────────────┐   │
│               │     │  │ 🦖 Zen completed "Brush teeth"      │   │
│  📋 3 items   │     │  │                                     │   │
│               │     │  │   [✓ Approve]    [✗ Reject]         │   │
└───────────────┘     │  └─────────────────────────────────────┘   │
                      └────────────────────────────────────────────┘
                                          │
                      ┌───────────────────┴───────────────────┐
                      ▼                                       ▼
               ┌─────────────┐                         ┌─────────────┐
               │  Approved!  │                         │  Rejected   │
               │  ⭐ +1 star │                         │  Try again  │
               └─────────────┘                         └─────────────┘
```

---

## 5. Screen Inventory

| Screen | Route | Access | Purpose |
|--------|-------|--------|---------|
| Landing/Home | `/` | Public | Child select, parent login |
| Sign Up | `/signup` | Public | New parent registration |
| Login | `/login` | Public | Existing parent login |
| Forgot Password | `/forgot-password` | Public | Password reset request |
| Reset Password | `/reset-password` | Public | Set new password |
| Onboarding | `/onboarding` | Auth | First-time app tour |
| Parent Setup | `/parent/setup` | Auth | Set PIN, family settings |
| PIN Entry | `/parent/pin` | Auth | Unlock parent features |
| Add Child | `/parent/add-child` | Auth+PIN | Add new child profile |
| Approval Queue | `/parent/approvals` | Auth+PIN | Approve completed habits |
| Child Dashboard | `/child/:id` | Auth | Daily habit tracker |
| Star Store | `/store/:id` | Auth | Redeem stars for rewards |

---

## 6. Key Interactions

### Habit Completion
```
Child taps habit → Creates "completion" record → Status: PENDING
                                                      │
Parent approves ─────────────────────────────────────▶│
                                                      ▼
                                              Status: APPROVED
                                              Child stars += reward
```

### Star Store Purchase (Implemented ✅)
```
Child taps "Get it!" → Check: stars >= cost?
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
    Yes: Can afford                     No: Can't afford
    │                                   - Gray out button
    ▼                                   - "Need X more stars"
    Show loading spinner
    │
    ▼
    createRedemption()
    ├── Check stars again (防止 race condition)
    ├── Deduct stars from child
    └── Create redemption record (status: pending)
    │
    ▼
    Show "Got it! 🎉" success state
    │
    ▼
    Parent sees in Approval Queue → Fulfills reward
```

**Purchase States:**
- `pending` - Child purchased, waiting for parent to fulfill
- `fulfilled` - Parent gave the reward to child
- `cancelled` - Purchase was cancelled (refund stars)
- `expired` - Took too long, auto-cancelled

---

## 7. Issues / Gaps to Review

### ❓ Questions
1. **No "forgot PIN" flow** - What if parent forgets PIN?
2. **No child switching from dashboard** - Must go back to home
3. **No habit history view** - Can child see past completions?
4. **No streak visualization** - Could motivate kids
5. **No notifications** - Parent doesn't know when to approve
6. **No reward redemption history** - What rewards were claimed?

### 💡 Potential Improvements
1. Add "Quick switch" between children
2. Add streak counter on dashboard
3. Add push/email notification for pending approvals
4. Add weekly progress summary for parents
5. Add "favorite" habits for quick access
6. Add sound effects / animations for completions

---

## 8. Data Model (Simplified)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Parent    │──────▶│   Child     │──────▶│   Habit     │
│   (user)    │ 1:N   │             │ 1:N   │             │
└─────────────┘       └─────────────┘       └─────────────┘
                             │                     │
                             │                     │
                             ▼                     ▼
                      ┌─────────────┐       ┌─────────────┐
                      │   Reward    │       │ Completion  │
                      │             │       │  (pending/  │
                      └─────────────┘       │  approved)  │
                             │              └─────────────┘
                             ▼
                      ┌─────────────┐
                      │ Redemption  │
                      │             │
                      └─────────────┘
```

---

*Generated by Musmus 🦝 - 2026-02-14*
