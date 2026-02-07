# 📑 Product Requirement Document (PRD) – StarqueZZ

## 1. Overview

**StarqueZZ** is a **Progressive Web App (PWA)** designed to gamify chore tracking and rewards for children aged 5–8, specifically Zen and Zia. The app turns daily responsibilities into fun quests with stars as the reward currency. Parents define chores and physical rewards, while children engage with a playful, themeable interface.

---

## 2. Goals & Non-Goals

### Goals

* Encourage responsibility and habit formation in children.
* Provide parents with oversight and tools to manage chores and rewards.
* Deliver an engaging child experience via gamification, themes, and stars.
* Ensure accessibility via **PWA** (cross-device, install-free, offline support).

### Non-Goals

* No financial transactions or real-money purchases in MVP.
* No social/family networking features in MVP.
* No licensed/branded characters; theming is AI-generated palettes only.

---

## 3. User Roles

### Parent

* Create/manage multiple child accounts.
* Add and configure chores (core + extra).
* Review and approve completed tasks (mandatory for all tasks).
* Define physical rewards in a **Star Store**.
* Track weekly progress and streaks.
* Manage theme selection for children.

### Child

* Log in with PIN.
* View assigned chores (core + extra).
* Mark chores as complete (pending parent approval).
* Redeem stars in **Star Store**.
* Enjoy themeable UI adapted to favorite characters/colors.
* Access a **basic tutorial** on first-time onboarding.

---

## 4. Core Features (MVP)

### Authentication & Accounts

* Parent login via **email/password**.
* Child login via **PIN-based access** (4 digits, bcrypt hashed, 5 attempts/15min lockout, 12h JWT expiry).
* One parent manages multiple children.
* **Auto-approval**: Tasks pending parent approval >24 hours are automatically approved.

### Chore & Star System

* **Core Tasks**: 2 per day. Must complete BOTH to earn 1 star total (not 1 per task).
* **Extra Tasks**: Eligible only if core tasks completed. Each extra task = 1 star.
* **Weekly Bonus**: Completing all core tasks for 7 days straight → 50% bonus of total stars earned that week (core + extras combined).
  * Example: Child earns 7 core stars + 5 extra stars = 12 stars. Weekly bonus = 6 stars (50% of 12).
* Parents must approve all chores before stars are awarded.
* **Parent Rejection**: When parent rejects completion, child receives notification with reason. Task returns to "Not Complete" state. Child can reattempt same day.
* **Auto-approval**: Tasks pending >24 hours are automatically approved.

### Rewards & Star Store

* Parent defines a list of physical rewards.
* Children can browse **Star Store** to redeem earned stars.
* Star balance tracked per child.
* **Redemption States**: pending (awaiting parent fulfillment) → fulfilled (parent confirmed delivery) / cancelled (refunded) / expired (pending >7 days, auto-refund).

### Parent Dashboard

* Manage chores, rewards, and approvals.
* View weekly progress reports per child.
* Manage themes (assign or regenerate AI themes).

### Theme System

* AI prompts children: *"Who's your favorite character?"*.
* Generates a matching **color palette + playful labels** (e.g., SpongeBob → yellow palette).
* No official IP assets; colors and names only.
* **Theme Customization**: AI generates base palette + allows parent to adjust colors with automatic contrast validation.
* All adjustments must pass WCAG AA contrast checks.

### Notifications

* **Daily reminder**: 4 PM if core tasks incomplete
* **Reward unlocked**: Immediate (when parent approves)
* **Streak updates**: Sunday 6 PM (weekly bonus)
* **Quiet hours**: 8 PM - 8 AM (configurable by parent)
* **Frequency cap**: Max 3 notifications per day per child

### Offline Support

* Tasks and progress stored offline.
* Syncs automatically when online.
* **Conflict Resolution**:
  * Deleted chore: Remove from local queue, notify "Chore no longer available"
  * Duplicate completion: Server deduplicates by (child_id, chore_id, date)
  * Modified chore: Accept server version, re-queue if completion still valid

### Onboarding

* **Tutorial Content** (First-Time Child Login):
  1. Welcome screen with character introduction
  2. Explain core tasks (must do both)
  3. Show extra tasks (unlock after cores)
  4. Demonstrate marking tasks complete
  5. Show Star Store preview
  6. Explain weekly bonus

---

## 5. Non-Functional Requirements

* **Performance**: Fast load times (<2s), smooth animations.
* **Reliability**: Offline-first architecture with background sync.
* **Security**: Parent data secured via encryption; child access limited to PIN.
* **Accessibility**: High-contrast palettes, readable fonts, WCAG AA compliance.
* **Compatibility**: Cross-browser and mobile-first responsive design.

---

## 5.1 Language & Tone Guidelines

### Child Interface Tone: Funny Adventure 🎭

**Core Characteristics:**
- Silly and humorous language that makes children laugh
- Uses funny words, made-up terms, and playful wordplay
- Emphasizes having fun while completing tasks
- Encourages laughter and joy in the quest experience

**Key Phrases & Examples:**
- "Time for your daily dose of quest-astic fun!"
- "You're a quest-master extraordinaire! Have a star! ⭐"
- "The Star Store is calling your name... or maybe it's just hungry!"
- "Quest complete! You're officially a star-collecting superstar!"
- "Ready to quest-ify your day? Let's go on an adventure!"
- "You sly little quest-master! You've outsmarted another task!"
- "Psst... want to sneak in an extra quest and earn bonus stars?"
- "Shh... don't tell anyone, but you're doing amazing!"

**Tone Principles:**
- Make chores feel like silly adventures rather than work
- Use humor to reduce task anxiety and increase engagement
- Celebrate achievements with playful, exaggerated language
- Create a sense of fun and excitement around responsibility
- Use "we" language to make it feel collaborative and supportive

**Parent Interface Tone:**
- Professional but warm and encouraging
- Clear, direct language for management tasks
- Supportive messaging that reinforces the child's progress
- Maintains the fun spirit while providing necessary oversight

**Rejection & Auto-Approval Messages:**
- Rejection: "Oops! Looks like this task needs another try. Don't worry, you've got this! 🌟"
- Auto-approval: "Great job! Your task was automatically approved after 24 hours. Keep up the amazing work!"

---

## 6. Acceptance Criteria

* ✅ Parent can create an account with email/password.
* ✅ Parent can create multiple child profiles.
* ✅ Child can log in with 4-digit PIN (5 attempts/15min lockout, 12h expiry).
* ✅ Parent can assign 2 daily core tasks and extra tasks.
* ✅ Child earns 1 star total for completing BOTH core tasks (not 1 per task).
* ✅ Weekly bonus correctly applies at 50% of total stars earned that week (core + extras).
* ✅ Parent must review and approve all completed chores (with 24h auto-approval).
* ✅ Parent can reject completions with reason, child can reattempt same day.
* ✅ Star Store displays rewards with redemption states (pending/fulfilled/cancelled/expired).
* ✅ AI-generated theme allows parent color adjustments with contrast validation.
* ✅ App works offline and syncs when back online with conflict resolution.
* ✅ Push notifications follow schedule (4PM reminder, immediate reward, Sunday streak, quiet hours).
* ✅ 6-step child tutorial appears on first onboarding.
* ✅ Redemptions pending >7 days auto-cancel with star refund.

---

## 7. Resolved Decisions

* **Theme Customization**: AI generates base palette + allows parent color adjustments with contrast validation
* **Weekly Bonus**: 50% of total stars earned that week (core + extras combined)
* **Auto-Approval**: Tasks pending >24 hours are automatically approved
* **LLM Provider**: OpenAI GPT-4 for palette generation
* **PIN Security**: 4 digits, 5 attempts/15min lockout, bcrypt hashed, 12h JWT expiry
* **Redemption Expiry**: Pending redemptions >7 days auto-cancel with star refund

---

## 8. Future Considerations (Post-MVP)

* Leveling system for avatars.
* Adventure maps and virtual pets.
* Achievement badges.
* Mini-games as star unlockables.
* Social features (family leaderboards).

---

✅ This PRD defines the MVP scope for **StarqueZZ**, ensuring clarity for design and development teams.
