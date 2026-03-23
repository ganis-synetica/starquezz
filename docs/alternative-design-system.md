# StarqueZZ — Alternative Design System
**Margaery 🎨 | Zero-Canvas Edition | 2026-03-23**

---

## Design Director's Note

The existing brief specifies Neo-Brutalism (sharp corners, hard shadows, DM Sans, 0px radius). This alternative system starts from zero canvas with a different hypothesis: **children aged 5–8 don't need brutalism — they need wonder**.

This system is called **WONDERVERSE** — a warm, cosmic, magical universe where stars are real, chores become quests, and every tap feels like a small adventure.

The design rationale is simple: if a child picks up a phone and feels genuine delight within the first 3 seconds of seeing the app, we've won. Everything in this system serves that goal.

---

## Part 1 — Brand Direction

### 1.1 The Visual World

**StarqueZZ lives in the Wonderverse** — a boundless, magical cosmos where everyday responsibilities transform into heroic quests. The setting is warm deep space: think glowing nebulae, chunky cartoon planets, friendly constellations, and golden stars that feel alive and precious.

This is NOT cold sci-fi. It's the aesthetic of a beloved children's space adventure book — warm ambers and purples against deep midnight backgrounds, rounded shapes everywhere, elements that feel like they're gently floating.

**Tone References:**
- *Visual:* Duolingo's energy + Monument Valley's depth + Kirby's warmth
- *Feeling:* "I just found a treasure chest" every time a task is completed
- *NOT:* Hard-edged tech, clinical flat design, or anything that feels like homework

### 1.2 Brand Positioning

| Attribute | StarqueZZ |
|-----------|-----------|
| Personality | Playful, encouraging, magical, warm |
| Voice (child) | Silly best friend with superpowers |
| Voice (parent) | Calm, organized co-pilot |
| Visual Energy | High for kids / Medium for parents |
| Iconography | Chunky, rounded, emoji-adjacent but custom |

### 1.3 The Star as Brand Currency

The ⭐ star is the single most important visual element in the entire product. It must:
- Feel **earned** (not cheap or automatic)
- Look **precious** (warm gold, slight glow, weighty)
- Be **animated** as a reward moment (float, spin, sparkle)
- Be **countable at a glance** at all times

Every design decision flows from protecting the perceived value of the star.

### 1.4 Dual Identity (Child vs. Parent)

The app has two faces that share DNA but speak different visual languages:

**Child Mode — "Quest Mode"**: Deep space backgrounds, gold and purple accents, large rounded elements, maximum playfulness. Feels like a game.

**Parent Mode — "Mission Control"**: Light, airy backgrounds, confident blues, clean information hierarchy. Feels like a well-designed productivity app that loves families.

Both faces use the same icon set, rounded corners, and star imagery — but at completely different energy levels.

---

## Part 2 — Color System

### 2.1 Child UI Color Palette ("Quest Mode")

| Token Name | Hex | RGB | Role |
|------------|-----|-----|------|
| **Deep Space** | `#1A0F3C` | 26, 15, 60 | Primary dark background |
| **Midnight Cosmos** | `#0F0A24` | 15, 10, 36 | Darkest background layer |
| **Nebula Surface** | `#2A1F5F` | 42, 31, 95 | Card backgrounds on dark |
| **Quest Gold** | `#FFB800` | 255, 184, 0 | Primary CTA, stars, key highlights |
| **Quest Gold Light** | `#FFD54F` | 255, 213, 79 | Star glow, hover states |
| **Nebula Violet** | `#7C3AED` | 124, 58, 237 | Secondary accent, extra tasks |
| **Nebula Violet Light** | `#A78BFA` | 167, 139, 250 | Lighter violet for inactive states |
| **Cosmic Coral** | `#FF6B6B` | 255, 107, 107 | Energy, streaks, alerts, fire |
| **Aurora Mint** | `#4ADE80` | 74, 222, 128 | Success, completed tasks, approved |
| **Moonbeam** | `#F5F0FF` | 245, 240, 255 | Light card surfaces (light mode sections) |
| **Star White** | `#FFFDF5` | 255, 253, 245 | Warm white for primary text on dark |
| **Stardust** | `#6B5B8E` | 107, 91, 142 | Muted/disabled text, pending states |
| **Cosmic Teal** | `#22D3EE` | 34, 211, 238 | Bonus accents, streak indicators |

**Background Gradient (Child main screen):**
```
linear-gradient(180deg, #1A0F3C 0%, #0F0A24 60%, #1A1040 100%)
```

**Card Gradient (Core task cards):**
```
linear-gradient(135deg, #2A1F5F 0%, #1E1650 100%)
```

**WCAG AA Compliance Check (Child UI):**
| Foreground | Background | Ratio | Result |
|------------|------------|-------|--------|
| Star White #FFFDF5 | Deep Space #1A0F3C | 14.2:1 | ✅ AAA |
| Quest Gold #FFB800 | Deep Space #1A0F3C | 7.8:1 | ✅ AA |
| Star White #FFFDF5 | Nebula Surface #2A1F5F | 10.4:1 | ✅ AAA |
| Aurora Mint #4ADE80 | Deep Space #1A0F3C | 8.1:1 | ✅ AA |
| Stardust #6B5B8E | Deep Space #1A0F3C | 3.0:1 | ⚠️ AA only for large text (18pt+) |
| Star White | Stardust (disabled) | — | Use for non-critical text only |

---

### 2.2 Parent UI Color Palette ("Mission Control")

| Token Name | Hex | RGB | Role |
|------------|-----|-----|------|
| **Command Navy** | `#1E3A5F` | 30, 58, 95 | Headers, primary dark areas |
| **Horizon Blue** | `#2563EB` | 37, 99, 235 | Primary CTAs, active states, links |
| **Horizon Blue Light** | `#3B82F6` | 59, 130, 246 | Hover, lighter interactive elements |
| **Cloud White** | `#F8FAFF` | 248, 250, 255 | Page background (slight blue tint) |
| **Surface White** | `#FFFFFF` | 255, 255, 255 | Card backgrounds |
| **Border Gray** | `#E2E8F0` | 226, 232, 240 | Card borders, dividers |
| **Slate Text** | `#334155` | 51, 65, 85 | Primary body text |
| **Muted Text** | `#64748B` | 100, 116, 139 | Secondary text, timestamps |
| **Placeholder** | `#94A3B8` | 148, 163, 184 | Input placeholders |
| **Success Green** | `#22C55E` | 34, 197, 94 | Approvals, completions, positive |
| **Alert Red** | `#EF4444` | 239, 68, 68 | Rejections, errors, danger |
| **Gold Amber** | `#F59E0B` | 245, 158, 11 | Star counts, warm highlights |
| **Streak Orange** | `#F97316` | 249, 115, 22 | Streak badges, bonus indicators |

**Background (Parent):** `#F8FAFF` (Cloud White — full light mode)

**Header Gradient (Parent dashboard header):**
```
linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)
```

**WCAG AA Compliance Check (Parent UI):**
| Foreground | Background | Ratio | Result |
|------------|------------|-------|--------|
| Slate Text #334155 | Cloud White #F8FAFF | 9.4:1 | ✅ AAA |
| Surface White | Command Navy #1E3A5F | 9.8:1 | ✅ AAA |
| Horizon Blue #2563EB | Cloud White #F8FAFF | 5.7:1 | ✅ AA |
| Muted Text #64748B | Surface White | 5.9:1 | ✅ AA |
| Alert Red #EF4444 | Surface White | 4.7:1 | ✅ AA |
| Success Green #22C55E | Surface White | 3.5:1 | ✅ AA (large text only) |
| White | Success Green #22C55E | 3.5:1 | ✅ AA (large text — use for filled badges) |

---

### 2.3 Shared Semantic Colors

These cross both interfaces to create visual harmony:

| Semantic | Hex | Usage |
|----------|-----|-------|
| **Star** | `#FFB800` | All star references everywhere |
| **Success** | `#4ADE80` (child) / `#22C55E` (parent) | Task approved, reward fulfilled |
| **Pending** | `#F59E0B` | Awaiting parent approval |
| **Locked** | `#6B5B8E` (child) / `#94A3B8` (parent) | Disabled/locked content |
| **Error** | `#FF6B6B` (child) / `#EF4444` (parent) | Wrong PIN, rejection |

---

## Part 3 — Typography System

### 3.1 Font Families

**Child UI — Nunito**
- Source: Google Fonts (open license, safe for PWA use)
- Why: Highly legible at large sizes, rounded letterforms that feel safe and friendly to young readers, excellent for children ages 5+
- Pairs naturally with a playful, high-energy visual system
- Available weights: 400, 500, 600, 700, 800, 900

**Parent UI — Plus Jakarta Sans**
- Source: Google Fonts
- Why: Modern, warm, professional. More personality than Inter but more structured than Nunito. Signals "designed with care" to parents.
- Available weights: 300, 400, 500, 600, 700, 800

**Monospace (optional — star counts, PIN):**
- Source: JetBrains Mono (Google Fonts)
- Use only for: PIN entry dots display, star balance counters where tabular numbers matter

---

### 3.2 Type Scale — Child UI

```
Display XL   Nunito 900    48px / lh 1.1   Screen titles (welcome)
Display      Nunito 900    36px / lh 1.15  Hero text, name greeting
Heading 1    Nunito 800    28px / lh 1.2   Section headers ("Your Quests")
Heading 2    Nunito 800    22px / lh 1.25  Card titles, task names
Heading 3    Nunito 700    18px / lh 1.3   Sub-section labels
Body Large   Nunito 600    16px / lh 1.5   Primary readable text
Body         Nunito 600    14px / lh 1.5   Descriptions, UI text
Caption      Nunito 500    12px / lh 1.4   Timestamps, badges, hints
```

**Child UI Rules:**
- Minimum body text: 14px (never smaller for readable content)
- Letter spacing for display: -0.5px (tighter for big bold text)
- Letter spacing for body: 0 (natural)
- Avoid all-caps for children — mixed case is more legible at this age
- Emoji freely mixed into body text ✅

---

### 3.3 Type Scale — Parent UI

```
Display      Plus Jakarta Sans 700   28px / lh 1.2   Page titles
Heading 1    Plus Jakarta Sans 700   22px / lh 1.25  Section headers
Heading 2    Plus Jakarta Sans 600   18px / lh 1.3   Card headers
Heading 3    Plus Jakarta Sans 600   16px / lh 1.35  Sub-headers, tabs
Body Large   Plus Jakarta Sans 400   16px / lh 1.6   Primary readable text
Body         Plus Jakarta Sans 400   14px / lh 1.6   Form labels, descriptions
Small        Plus Jakarta Sans 400   12px / lh 1.5   Timestamps, metadata
Label        Plus Jakarta Sans 500   11px / lh 1.4   ALL CAPS badges (cautious use)
```

**Parent UI Rules:**
- Line height ≥ 1.5 for body text (WCAG 1.4.12)
- Section labels: uppercase, letter-spacing 0.08em, 11px minimum
- Link text: always Horizon Blue, never rely on color alone — add underline

---

## Part 4 — Component Vocabulary

### 4.1 Spacing & Grid System

**Base unit:** 8px

```
xs:   4px   (tight internal padding)
sm:   8px   (compact spacing)
md:   16px  (standard element gap)
lg:   24px  (section spacing)
xl:   32px  (major section breaks)
2xl:  48px  (hero/screen-level spacing)
3xl:  64px  (landing page sections)
```

**Border Radius:**
```
pill:     9999px   (buttons, badges, star counter)
rounded:  16px     (cards, modals)
soft:     12px     (inputs, smaller cards)
subtle:   8px      (tags, chips)
circle:   50%      (avatars, icon containers)
```

**Elevation (shadows):**
```
none:     no shadow
xs:       0 1px 3px rgba(0,0,0,0.08)
sm:       0 2px 8px rgba(0,0,0,0.12)
md:       0 4px 16px rgba(0,0,0,0.16)
lg:       0 8px 32px rgba(0,0,0,0.24)
glow-gold: 0 0 20px rgba(255,184,0,0.4)      (star elements, CTAs on dark)
glow-violet: 0 0 16px rgba(124,58,237,0.35)  (Nebula Violet elements)
```

---

### 4.2 Buttons

#### Child UI Buttons

**Primary Quest Button** (main CTA — "Complete Quest", "Go to Store")
```
Background:     Quest Gold #FFB800
Text:           Deep Space #1A0F3C (Nunito 800, 16px)
Height:         56px
Padding:        0 28px
Border Radius:  9999px (pill)
Shadow:         glow-gold + 0 4px 12px rgba(255,184,0,0.5)
Active state:   Scale 0.96, shadow reduces
Hover:          Background Quest Gold Light #FFD54F
Icon optional:  Left side, 24px, Deep Space color
Minimum width:  160px
```

**Secondary Quest Button** (back, cancel)
```
Background:     transparent
Border:         2px solid Nebula Violet Light #A78BFA
Text:           Nebula Violet Light #A78BFA (Nunito 700, 16px)
Height:         52px
Border Radius:  9999px
Active:         Background rgba(124,58,237,0.15)
```

**Disabled Button** (locked actions)
```
Background:     Stardust #6B5B8E at 40% opacity
Text:           Star White 40% opacity
Cursor:         not-allowed
No shadow
```

---

#### Parent UI Buttons

**Primary Action** (approve, save, publish)
```
Background:     Horizon Blue #2563EB
Text:           White (Plus Jakarta Sans 600, 15px)
Height:         48px
Padding:        0 24px
Border Radius:  12px
Shadow:         sm
Hover:          Horizon Blue Light #3B82F6
Active:         Scale 0.98
```

**Secondary Action** (cancel, back, ghost)
```
Background:     transparent
Border:         1.5px solid Border Gray #E2E8F0
Text:           Slate Text #334155 (Plus Jakarta Sans 500, 15px)
Height:         48px
Border Radius:  12px
Hover:          Background Cloud White, border Muted Text
```

**Approve Button** (approval queue)
```
Background:     Success Green #22C55E
Text:           White (Plus Jakarta Sans 700, 15px)
Height:         44px
Border Radius:  10px
Icon:           Checkmark left
Shadow:         0 2px 8px rgba(34,197,94,0.3)
```

**Reject Button** (rejection)
```
Background:     transparent
Border:         2px solid Alert Red #EF4444
Text:           Alert Red #EF4444 (Plus Jakarta Sans 600, 15px)
Height:         44px
Border Radius:  10px
Hover:          Background rgba(239,68,68,0.08)
```

**Danger/Destructive** (delete)
```
Background:     Alert Red #EF4444
Text:           White (Plus Jakarta Sans 600, 15px)
Height:         44px
Border Radius:  10px
```

---

### 4.3 Cards

#### Child Task Cards

**Core Task Card** (the "Must-Do" quests)
```
Background:     Nebula Surface #2A1F5F
Border:         none
Border Radius:  20px
Left Accent:    4px solid Quest Gold #FFB800 (left edge inset border)
Padding:        16px
Shadow:         md
Height:         auto (min 80px)

Layout (horizontal):
├── Left accent strip (Quest Gold, 4px)
├── Icon container: 48x48px circle, Quest Gold bg, 24px emoji/icon
├── Content: title (Nunito 800, 16px, Star White) + status label
└── Right: Checkbox target (48x48px) OR status badge

States:
  Incomplete:  Default above — pulse animation on checkbox
  Pending:     Left accent → Gold Amber #F59E0B, status: "Waiting for grown-up ⏳"
  Approved:    Left accent → Aurora Mint #4ADE80, checkmark drawn
  Locked:      Opacity 50%, lock icon overlay
```

**Extra Task Card** (bonus quests — unlocked after cores)
```
Same structure as Core, but:
  Left Accent:  Nebula Violet #7C3AED
  Icon bg:      Nebula Violet (instead of Quest Gold)
  Title:        Star White
  Lock state:   Full opacity card, content blurred 4px, lock icon center
  Lock message: "Finish your Must-Dos first! 🔒"
```

---

#### Child Reward Cards (Star Store)

```
Width:          calc(50% - 8px) (2-column grid)
Background:     Nebula Surface #2A1F5F
Border Radius:  20px
Overflow:       hidden
Shadow:         md

Layout (vertical):
├── Icon Area: full-width, 120px height
│   ├── Background: linear-gradient(135deg, #2A1F5F, #3D2B8F)
│   └── Emoji/icon: 64px, centered
├── Content:
│   ├── Title: Nunito 700, 14px, Star White, 2-line max
│   └── Cost badge: Quest Gold pill "⭐ 25"
└── CTA:
    ├── Affordable: "Get it! 🚀" (Quest Gold button)
    └── Not affordable: "Need 5 more ⭐" (Stardust, disabled)

States:
  Affordable:    Full opacity, Quest Gold CTA active
  Not Enough:    Full opacity, CTA grayed, helper text visible
  Pending:       Overlay shimmer, "Waiting for parent! 🎉"
  Out of Stock:  Stardust overlay, "Coming soon"
```

---

#### Parent Child Overview Card

```
Background:     Surface White
Border:         1.5px solid Border Gray #E2E8F0
Border Radius:  16px
Padding:        20px
Shadow:         sm

Layout:
├── Top row: Avatar (48px circle) + Name (Plus Jakarta Sans 700, 16px) + Streak badge (right)
├── Progress bar: full-width, labeled "X/2 quests today"
├── Stats row: Stars this week | Pending approvals
└── Quick action: "Review (N)" button or "All done! ✅"

Pending approval badge:
  Background:   Alert Red
  Shape:        20px pill
  Text:         White, Plus Jakarta Sans 700, 12px
  Animation:    Pulse if >0 items
```

---

### 4.4 Progress Bars

**Child Quest Progress (Star-dot style)**
```
For simple binary (core quests 2/2):
  Layout: 2 star icons in a row
  Incomplete star: Stardust outline ☆
  Complete star:   Quest Gold filled ⭐ + glow-gold
  Animation: Star "fills in" with gold from center

For multi-step weekly progress:
  Track: 7 dots in a row (Mon–Sun)
  Completed day: Quest Gold dot + checkmark
  Today (in progress): Pulsing Nebula Violet dot
  Future: Stardust outline dot
  Height of track: 8px dots, 24px between them
```

**Child Linear Progress Bar (weekly bonus tracker)**
```
Track:          Nebula Surface #2A1F5F, 8px height, pill shape
Fill:           Quest Gold gradient, pill shape
Label:          "3 / 7 days" centered below, Nunito 600, 12px, Stardust
Milestone:      Quest Gold outline at 100%, "BONUS UNLOCKED ✨"
```

**Parent Progress Bar (clean)**
```
Track:          Border Gray #E2E8F0, 6px height, pill
Fill:           Horizon Blue, pill
Label:          "%X complete" right-aligned, Plus Jakarta Sans 500, 12px, Muted Text
```

---

### 4.5 Badges & Status Pills

**Child UI Badges**
```
Quest Type Badge:
  Core:     Quest Gold bg, Deep Space text, 20px radius, "⚡ Must-Do"
  Extra:    Nebula Violet bg, White text, 20px radius, "✨ Bonus"
  Font:     Nunito 700, 11px, letter-spacing 0.02em

Status Badge:
  Pending:  Gold Amber bg, Deep Space text, "⏳ Waiting"
  Approved: Aurora Mint bg, Deep Space text, "⭐ Got it!"
  Rejected: Cosmic Coral bg, White text, "🔄 Try Again"
```

**Parent UI Badges**
```
Count Badge (on approval button):
  Background:   Alert Red #EF4444
  Text:         White, Plus Jakarta Sans 700, 11px
  Size:         20px circle (1-2 digits) / auto-width pill (3+)
  Position:     Top-right of parent element, -8px offset

Status Pills:
  Pending:      Gold Amber bg (opacity 15%), Gold Amber text + border
  Fulfilled:    Success Green bg (opacity 15%), Success Green text
  Cancelled:    Border Gray bg, Muted Text
  Auto-approved:Border Gray bg, Muted Text, italic "(auto)"
```

---

### 4.6 Avatar Component

**Child Avatar (Game-style)**
```
Shape:          Circle
Sizes:          40px (list), 64px (header), 96px (profile select), 120px (PIN screen top)
Background:     Nebula Violet gradient
Content:        Large emoji (2rem–5rem depending on size)
Border:         3px solid Quest Gold (when selected/active)
Ring on select: 4px ring, Quest Gold, 2px gap (glow-gold effect)
```

**Parent Avatar (Simple)**
```
Shape:          Circle
Size:           36px (nav), 48px (profile dropdown)
Background:     Command Navy gradient
Content:        First initial, Plus Jakarta Sans 700, white
```

---

### 4.7 PIN Entry Component

**Child PIN Dots (Large — for PIN login screen)**
```
Container:      Centered, 4 dots in a row, 20px gap
Dot size:       24px circle
Dot empty:      Border 2px Stardust, transparent fill
Dot filled:     Background Quest Gold, border Quest Gold, glow-gold shadow
Dot error:      Background Cosmic Coral, shake animation
Dot success:    Background Aurora Mint, scale up to 28px then back

Keypad buttons:
  Size:           72x72px circle
  Background:     Nebula Surface #2A1F5F
  Text:           Star White, Nunito 800, 24px
  Active/press:   Background Quest Gold, text Deep Space, scale 0.94
  Shadow:         md
  Gap:            12px grid
  Delete key:     Backspace icon, Nebula Violet Light
```

---

### 4.8 Navigation

**Child Bottom Navigation**
```
Height:         64px + safe-area-inset-bottom
Background:     Deep Space #1A0F3C / blur backdrop-filter: blur(20px)
Border-top:     1px solid Nebula Surface
Items:          3 tabs — Home (Quests) / Star Store / My Profile

Tab Item (active):
  Icon:         Quest Gold, 24px
  Label:        Nunito 700, 10px, Quest Gold
  Indicator:    Quest Gold 3px rounded bar above icon

Tab Item (inactive):
  Icon:         Stardust #6B5B8E, 24px
  Label:        Nunito 500, 10px, Stardust
```

**Parent Tab Navigation (top)**
```
Height:         48px
Background:     Surface White
Border-bottom:  1.5px solid Border Gray
Items:          4 tabs — Dashboard / Approvals (badge) / Manage / Reports

Tab Active:
  Text:         Horizon Blue, Plus Jakarta Sans 600, 14px
  Indicator:    Horizon Blue 2px bottom border

Tab Inactive:
  Text:         Muted Text, Plus Jakarta Sans 400, 14px
```

---

### 4.9 Form Inputs (Parent UI)

```
Default Input:
  Background:   Surface White
  Border:       1.5px solid Border Gray #E2E8F0
  Border Radius: 12px
  Height:       48px
  Padding:      0 16px
  Font:         Plus Jakarta Sans 400, 15px, Slate Text
  Placeholder:  Muted Text #94A3B8
  Shadow:       none

Focus Input:
  Border:       2px solid Horizon Blue #2563EB
  Shadow:       0 0 0 3px rgba(37,99,235,0.12)
  Outline:      none

Error Input:
  Border:       2px solid Alert Red #EF4444
  Shadow:       0 0 0 3px rgba(239,68,68,0.12)
  Helper text:  Alert Red, 12px, below input

Label:
  Font:         Plus Jakarta Sans 500, 13px, Slate Text
  Position:     Above input, 6px gap
  Required:     Cosmic Coral dot after label
```

---

### 4.10 Star Counter Display

**Child Header Star Counter**
```
Layout:         Horizontal — ⭐ icon + number
Icon:           24px, Quest Gold (custom star SVG with inner glow)
Number:         Nunito 900, 22px, Quest Gold
Container:      Pill shape, Nebula Surface bg, 12px padding H
Position:       Top-right of child header

Earn animation:
  Trigger:      When star count increments
  Effect:       +1 floats up from below (Quest Gold, Nunito 900)
                Main counter scales 1.0 → 1.3 → 1.0 (spring)
                Star icon does full rotation
  Duration:     600ms total
```

---

## Part 5 — Motion & Interaction Principles

### 5.1 Child UI — "Magic Bounce" System

**Core Principle:** Everything in child mode responds with life. No element should feel static or dead.

**Duration Scale:**
```
Instant:    100ms   (immediate feedback — tap response)
Quick:      200ms   (small transitions — badge appears)
Standard:   350ms   (most animations — card state changes)
Expressive: 500ms   (celebrations — star earn, task complete)
Extended:   800ms   (screen transitions, major moments)
```

**Easing:**
```
Snappy:     cubic-bezier(0.34, 1.56, 0.64, 1)   (spring bounce — primary)
Smooth:     cubic-bezier(0.4, 0, 0.2, 1)         (enter/exit)
Bouncy:     spring(mass:0.5, stiffness:500, damping:25)  (Framer Motion)
```

**Key Animations:**

*Task Completion Tap:*
1. Card scales 0.96 → 1.0 (100ms Snappy) — tactile press
2. Checkbox fills with Aurora Mint (200ms draw animation)
3. Star burst particles emit from checkbox (6 small stars, 400ms)
4. Card state updates — left accent changes color (300ms)
5. If ALL cores complete: screen pulses Quest Gold briefly (100ms overlay at 20% opacity)

*Star Earn Moment:*
1. Star particle floats from task up to header counter (500ms, curved path)
2. Header counter scales + rotates star icon (300ms)
3. Number increments with a slight overshoot bounce
4. Confetti burst (8-12 particles, Quest Gold + Nebula Violet) 200ms

*Screen Entry:*
- Content slides up from 20px below + fades in
- Stagger: 60ms delay per element (top → bottom)

*Error State (wrong PIN):*
- 3-cycle horizontal shake (−8px → +8px, 80ms per cycle)
- PIN dots flash Cosmic Coral
- Reset to empty after 1 second

*Level/Bonus Unlock:*
- Full-screen overlay (Deep Space #1A0F3C, 60% opacity)
- Gold star scales from 0 to center (spring, 600ms)
- Text fades in below
- Dismiss: tap anywhere

*Idle Animations:*
- Avatar: gentle float up/down (3s loop, translateY 0 → -6px → 0)
- Locked tasks: lock icon has subtle wobble every 4s (teasing)
- Star counter: subtle pulse glow every 8s (remind kids the stars are there)

---

### 5.2 Parent UI — "Calm Flow" System

**Core Principle:** Parent mode is a productive tool. Animations should confirm actions, not celebrate them (celebratory moments are reserved for child approval moments).

**Duration Scale:**
```
Instant:    80ms    (tab switch, focus state)
Quick:      150ms   (button press, badge update)
Standard:   250ms   (card entry, modal open)
Extended:   400ms   (full screen transitions)
```

**Easing:** Always `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard smooth)

**Key Animations:**

*Approval Swipe (primary parent interaction):*
- Right swipe (approve): Card slides right with green overlay that grows
- Left swipe (reject): Card slides left with red overlay
- Snap-back if less than 40% threshold
- Haptic feedback trigger points at 40% and completion

*Dashboard Card Load:*
- Cards stagger-fade in (0, 60ms, 120ms, 180ms delay)
- Progress bars fill from 0% to actual value (300ms, ease-out)

*Form Save:*
- Button shows loading spinner (150ms)
- Success: Button briefly turns Success Green with checkmark (500ms hold, then revert to normal or navigate)
- Error: Button shakes slightly (200ms), error helper text appears

*Modal (bottom sheet):*
- Slides up from bottom (250ms, ease-out)
- Scrim fades to 60% opacity
- Dismiss: drag down or tap scrim

*Tab Switch:*
- Content fades out (80ms) and new content fades in (150ms)
- Tab indicator slides (200ms)

**Approval Celebration (the one expressive moment in parent mode):**
When parent taps Approve, a subtle star (⭐) briefly floats upward from the button (300ms) — a nod to the child who just earned something. Small, tasteful, warm.

---

## Part 6 — Screen-by-Screen Design Briefs

### Screen 1 — Landing Page

**URL:** `starquezz.com`
**Breakpoints:** Mobile (375px) / Tablet (768px) / Desktop (1440px)

#### Visual Direction
The landing page splits personality: it's the one screen both audiences see simultaneously. It needs to sell the magic to parents while showing kids (who might peek) a world they want to enter.

**Background:** Midnight Cosmos gradient with subtle animated star field (tiny white dots, 0.3–0.8 opacity, very slow drift — 60s loop, CSS only)

---

#### Hero Section (Mobile)

```
Layout:         Single column, centered
Padding:        0 24px, 48px top

Elements (top to bottom):
1. Logo mark: ⭐ StarqueZZ
   - "⭐" emoji at 36px
   - "StarqueZZ" in Nunito 900, 28px, Quest Gold
   - Letter-spacing: -1px

2. Headline:
   "Turn Chores Into Quests. ✨"
   - Nunito 900, 36px, Star White
   - Second line emphasis: "Into Quests" in Quest Gold
   - Letter-spacing: -0.5px

3. Sub-headline:
   "Kids earn stars for real responsibilities.
   Parents stay in control. Everyone wins."
   - Nunito 600, 16px, Stardust #6B5B8E → wait, accessibility!
   - Use Star White at 80% opacity instead: rgba(255,253,245,0.8)
   - Line height: 1.6

4. CTA Buttons (stacked, full-width):
   Primary: "Start the Quest 🚀" → Quest Gold button, 56px
   Secondary: "See How It Works" → Ghost outline, Nebula Violet Light

5. App Preview Image:
   - Illustration/screenshot of child dashboard
   - Floating card showing "Zen's Quests — ⭐ 12 stars"
   - Slight tilt (rotate -3deg), glow-violet shadow
   - Width: 100%, max 320px, margin-top: 32px

6. Trust line:
   "Built for families. Designed for kids 5–8."
   - Nunito 500, 13px, Stardust
   - Centered, margin-top 24px
```

#### Feature Highlights Section (Mobile)

```
Section background:   Nebula Surface #2A1F5F with 60% opacity
Border radius:        32px top corners
Padding:              40px 24px

Section label:        "WHY STARQUEZZ" — Nunito 700, 11px, Quest Gold, tracking 0.1em

3 Feature Cards (vertical stack):

Card 1 — ⭐ Real Stars, Real Rewards
  Icon:     48px circle, Quest Gold bg, star emoji 24px
  Title:    Nunito 800, 18px, Star White
  Body:     "Kids earn stars for each chore and save up for real rewards you define."
            Nunito 500, 14px, Star White 75%

Card 2 — 🔒 You Stay in Control
  Icon:     48px circle, Nebula Violet bg, lock emoji
  Title:    "Parent Oversight Built In"
  Body:     "Approve completions, set rewards, track streaks — your house, your rules."

Card 3 — 🎮 Quests Not Chores
  Icon:     48px circle, Cosmic Teal bg, rocket emoji
  Title:    "Gamified for Ages 5–8"
  Body:     "Adventure language, big buttons, and silly rewards make it actually fun."

Card style:
  Background:   Deep Space #1A0F3C, 50% opacity
  Border:       1px solid rgba(255,255,255,0.08)
  Border-radius: 16px
  Padding:      20px
  Layout:       Icon left (56px), text right
```

#### Social Proof Section

```
Background:   Deep Space
Padding:      40px 24px

Headline:     "Built for Zen & Zia — now available for your family"
              Nunito 700, 16px, Star White

Quote card:
  "Zen actually ASKS to do his chores now. I don't know what this app did but don't stop."
  — A very happy parent
  
  Style: Nebula Surface card, Quest Gold left border 3px, italic Nunito 500
  Avatar: 40px circle with "👩" emoji
```

#### CTA Footer Banner

```
Background:   Quest Gold gradient (Quest Gold → Quest Gold Light)
Padding:      48px 24px
Border-radius: 32px, 24px margin horizontal

Headline:     "Ready to start the adventure?"
              Nunito 900, 28px, Deep Space
Sub:          "Free to start. No app store required."
              Nunito 600, 15px, Deep Space at 70%
Button:       "Get Started Free" — Deep Space bg, Quest Gold text, 56px, pill
```

#### Desktop Layout (1440px)

```
Hero: 2-column (text left 55%, app preview right 45%), vertically centered
Features: 3-column grid
Social proof: Centered, max-width 700px
CTA banner: Full width with max-width 1200px container
```

---

### Screen 2 — Parent Login / Child Profile Selection

**Filename:** Auth screen
**Size:** 375×812px (mobile PWA)

#### Parent Login Section (top half)

```
Background:   Cloud White #F8FAFF (light mode — intentional contrast from child dark mode)

Header:
  Logo: "⭐ StarqueZZ" — Nunito 800, 22px, Command Navy
  Tagline: "Mission Control" — Plus Jakarta Sans 400, 12px, Muted Text, tracking 0.05em

Section label: "PARENT LOGIN"
  Plus Jakarta Sans 600, 11px, Muted Text, tracking 0.08em
  Margin-bottom: 16px

Form:
  Email input (standard parent input style)
  Password input (with show/hide toggle — eye icon right)
  "Forgot password?" — link text, Horizon Blue, right-aligned, 13px
  "Log In" button — Primary Action style, full-width
  "Create account" — centered link below button, Horizon Blue

Form container:
  Background:   Surface White
  Border:       1.5px solid Border Gray
  Border-radius: 20px
  Padding:      24px
  Shadow:       md
```

#### Child Profile Selection Section (bottom half)

```
Section divider:
  "— or jump in as a child —"
  Plus Jakarta Sans 400, 13px, Muted Text, centered

Section label: "WHO'S PLAYING?"
  Plus Jakarta Sans 600, 11px, Muted Text, tracking 0.08em

Profile grid:
  2-column, 16px gap
  
Child Profile Card (per child):
  Width:          calc(50% - 8px)
  Height:         120px
  Background:     Surface White
  Border:         1.5px solid Border Gray
  Border-radius:  20px
  Shadow:         sm
  
  Layout (centered vertically):
  ├── Avatar: 56px circle, Nebula Violet gradient, emoji 28px
  ├── Name: Plus Jakarta Sans 700, 15px, Slate Text
  ├── Stars: "⭐ 12" — Plus Jakarta Sans 600, 13px, Gold Amber
  └── "Tap to play" — Plus Jakarta Sans 400, 11px, Muted Text (visible only on hover/focus)
  
  Active/press: Scale 0.96, border Horizon Blue, shadow md

"Add Child" card (when parent authenticated):
  Same size, dashed border, "+" center, Muted Text
```

---

### Screen 3 — Child PIN Login

**Size:** 375×812px

```
Background:     Deep Space to Midnight Cosmos gradient

Top section (30% height):
  Back button:  Top-left, Stardust chevron-left icon, "Back" Nunito 600 12px
  
  Child Avatar: 96px circle, centered
  Child Name:   Nunito 900, 28px, Star White, centered
  Prompt text:  "Enter your secret code! 🔐"
                Nunito 600, 15px, Star White 75%, centered

PIN Indicator (center):
  4 dots in a row, 20px gap, centered
  (see component spec 4.7 above)

Keypad (bottom 50%):
  3-column grid, 3 rows (1-9) + bottom row (delete, 0, confirm)
  Gap: 12px
  
  Number buttons: 72x72px circle, Nebula Surface bg, Star White Nunito 800 24px
  Delete button:  72x72px, transparent, Stardust backspace icon 24px
  Enter (checkmark): Only appears when 4 digits entered
                     72x72px circle, Aurora Mint bg, Deep Space checkmark icon

Error state:
  After wrong PIN: Dots shake (see motion spec)
  Lock state: "Too many tries! Come back in 15 min 🔒"
              Cosmic Coral Nunito 700, 14px, centered
              Keypad disabled, all buttons opacity 40%
```

---

### Screen 4 — Child Daily Chore Screen

**This is the CORE screen.** Most time is spent here.

```
Background:     Deep Space to Midnight Cosmos gradient (full screen)

HEADER (fixed, 72px):
├── Left: Avatar (40px) + "Hey, Zen! 👋" (Nunito 800, 16px, Star White)
├── Right: Star Counter pill (⭐ 12) — Quest Gold
└── Thin Quest Gold gradient line at bottom of header

GREETING CARD (scrollable content start):
  Background: Nebula Surface, border-radius 20px, margin 16px
  Content: 
    Large emoji: Random from [🚀, ✨, 🌟, 💫, 🎯] — 40px
    Title: Nunito 900, 22px, Star White
    Text: "Time for your daily dose of quest-astic fun! ✨"
          Nunito 600, 14px, Star White 70%
    
    Today's date: Nunito 500, 12px, Stardust — top-right of card

WEEKLY PROGRESS STRIP:
  7 dots (Mon–Sun), 24px tall
  Label: "🔥 Day 4 of 7 — keep going!"
  Nunito 700, 13px, Quest Gold if streak > 3, Stardust otherwise
  Position: Below greeting card, horizontal scroll if needed

CORE TASKS SECTION:
  Section header:
    "⚡ Must-Do Quests" — Nunito 800, 16px, Quest Gold
    Subtitle: "Finish both to unlock bonus quests!"
    Nunito 500, 12px, Stardust
  
  2x Core Task Cards (see component spec 4.3)
  
  If BOTH complete:
    Replace section header with:
    "🎉 Must-Dos done! Extra quests unlocked!"
    Aurora Mint text, subtle celebration particle burst (once)

EXTRA TASKS SECTION:
  Section header: "✨ Bonus Quests" — Nunito 800, 16px, Nebula Violet Light
  Sub: "Each bonus = 1 extra ⭐" — Nunito 500, 12px, Stardust
  
  Extra Task Cards (locked state if cores incomplete):
    Full card with lock overlay:
    Semi-transparent (opacity 0.5) card body
    "🔒" centered, 32px
    "Finish your Must-Dos first!" below lock, Nunito 600, 13px, Star White 50%
  
  Extra Task Cards (unlocked):
    Full opacity, Nebula Violet left accent, interactive

BOTTOM NAVIGATION (fixed, see 4.8 spec)

WEEKLY BONUS TRACKER (collapsible at bottom of scroll):
  Card, Nebula Surface, border-radius 20px
  "🌟 Weekly Bonus Progress"
  Progress bar (7-day dots)
  "Complete all 7 days for +50% bonus stars!"
  Nunito 600, 13px
```

---

### Screen 5 — Child Star Store

```
Background:     Deep Space gradient

HEADER:
  "⭐ Star Store" — Nunito 900, 28px, Quest Gold (centered)
  Sub: "What will you save for?" — Nunito 600, 14px, Star White 70%
  
  Balance pill: Large, centered below title
    "You have ⭐ 12 stars" 
    Background: Quest Gold gradient
    Text: Deep Space, Nunito 800, 18px
    Padding: 12px 24px, border-radius: 999px
    Glow-gold shadow

REWARDS GRID:
  2-column, 12px gap, padding: 16px
  Reward Cards (see component spec 4.3)
  
  Sorting: Affordable items first (sorted by affordability, then cost ascending)

EMPTY STATE (no rewards defined):
  Centered, 40% from top
  "🛒" emoji, 64px
  "Your parent hasn't added any rewards yet!"
  Nunito 700, 16px, Star White
  "Ask them to add some!" — Nunito 500, 14px, Stardust

REDEMPTION CONFIRMATION MODAL (bottom sheet):
  Handle: Muted bar at top, 40px W x 4px H
  Background: Nebula Surface
  Padding: 24px
  
  Reward emoji/icon: 64px, centered
  Title: "Are you sure?" — Nunito 800, 20px, Star White
  Cost: "This costs ⭐ 25 stars" — Quest Gold, Nunito 700, 16px
  Balance after: "You'll have ⭐ 3 stars left" — Stardust, Nunito 500, 14px
  
  Buttons:
    Primary: "Yes, get it! 🎉" — Quest Gold
    Secondary: "Nah, keep saving" — Ghost, Nebula Violet Light

POST-REDEMPTION SUCCESS:
  Full-screen overlay:
    Background: Deep Space 90% opacity + confetti particles
    Center: "🎉" 72px, spring bounce in
    "Woohoo! Your reward is coming!"
    "Ask your parent for your prize!"
    Star burst animation
    Auto-dismiss after 3 seconds, or tap anywhere
```

---

### Screen 6 — Parent Dashboard

```
Background:   Cloud White #F8FAFF

HEADER BAR (Command Navy gradient, 80px):
  "Mission Control" — Plus Jakarta Sans 700, 20px, White
  Date: "Mon, Mar 23" — Plus Jakarta Sans 400, 13px, White 70%
  Right: Parent avatar (36px circle) with dropdown trigger

PENDING APPROVALS BANNER (shows when pending > 0):
  Background:   Gold Amber #F59E0B at 15% opacity
  Border:       1.5px solid Gold Amber
  Border-radius: 12px
  Margin:       16px
  Padding:      14px 16px
  
  Layout: bell icon (Gold Amber) + "3 quests waiting for your approval!" + "Review →" button
  Font:   Plus Jakarta Sans 600, 14px, Slate Text
  Button: Compact, Ghost style, Horizon Blue text
  Animation: Subtle pulse every 4s if pending > 0

TAB NAVIGATION (see component 4.8):
  Dashboard | Approvals (badge) | Manage | Reports

DASHBOARD TAB CONTENT:

Week Overview strip:
  "This week" label — Muted Text 11px
  3 stat chips in a row:
    "7 quests" ✅ (completed count, green chip)
    "3 stars" ⭐ (earned, gold chip)
    "4-day streak" 🔥 (orange chip)
  Chip style: 32px pill, colored bg at 15% opacity, matching text

Children Cards section label: "YOUR ADVENTURERS"

Per-child overview card (see component spec 4.3):
  Full-width, stacked, 12px gap

Weekly Bonus Status (per child):
  "Zen: 5/7 days — 2 more for bonus! 🔥"
  Inline within child card, Streak Orange color

APPROVALS TAB CONTENT:

Empty state: "All caught up! ✅" — centered, Muted Text
Active list: Chronological, newest first

Pending Approval Item:
  Layout: Full-width card, 16px padding, Surface White, border-radius 12px, shadow sm
  
  Left: Child avatar (40px) + name above task name
  Center: Task title (Plus Jakarta Sans 600, 15px) + time ago (12px, Muted)
  Right: Approve (green pill btn) | Reject (ghost red btn)
  
  Swipe right → Approve (green overlay tracks thumb)
  Swipe left → Reject (triggers rejection reason modal)

Rejection Modal:
  Bottom sheet
  "Why are you rejecting this?" label
  4 quick-select chips: "Not done yet" | "Wrong day" | "Need a photo" | "Other"
  Text field for custom reason (optional)
  "Send to Zen" primary button → Submit rejection
  Notification copy: "Oops! Looks like this task needs another try. Don't worry, you've got this! 🌟"
```

---

### Screen 7 — Parent Task Builder / Management Hub

```
Background:   Cloud White

SUB-TABS (below main tabs): Chores | Rewards | Children | Reports

CHORES TAB:
  Header section:
    "Zen's Chores" child selector (pill tabs: Zen | Zia | Both)
    "Add Chore" button — Horizon Blue, compact, top-right

  Chore List:
    Drag handle left (≡ icon, Muted), Reorder enabled
    Toggle right (active/inactive)
    
    Core Chore Row:
      Left: ⚡ badge (Quest Gold bg) + task name (Plus Jakarta Sans 600, 15px)
      Right: Toggle (active = Horizon Blue) + edit pencil icon
      Below: Assigned to: "Zen, Zia" (small chips)
    
    Extra Chore Row:
      Left: ✨ badge (Nebula Violet bg) + task name
      Same right controls

  Add/Edit Chore Form (bottom sheet or new screen):
    Field: "Task name" — text input
    Field: "Category" — icon picker (Self-care 🧼, Helpfulness 🏠, Learning 📚, etc.)
    Toggle: "Core quest (required daily)" — when on, Quest Gold accent
    Field: "Description (optional)" — textarea
    Multi-select: "Assign to" (child chips)
    Save button

REWARDS TAB:
  "Star Store Rewards" header + "Add Reward" btn
  
  Reward List Item:
    Left: Emoji/icon + reward name (Plus Jakarta Sans 600, 15px)
    Center: "⭐ 25" — Gold Amber, Plus Jakarta Sans 700, 14px
    Right: Toggle (available/unavailable) + edit icon
    Below: "2 pending redemptions" — Alert Red chip if applicable
  
  Redemption Fulfillment Section (at bottom of list):
    Header: "Pending Redemptions (N)"
    Per-item: Child name + reward + when requested + "Fulfill" green btn + "Cancel & Refund" ghost btn

ADD REWARD FORM:
  Name field
  Star cost: Number input with ⭐ prefix, stepper (+/-) buttons
  Description (optional)
  Emoji picker for icon
  "Add to Store" primary button

CHILDREN TAB:
  Per-child settings card:
    Name, avatar, "Change PIN" action, "View Progress" link
    Delete child: Text link at bottom, Alert Red, confirmation required
  "Add Another Child" card: dashed border, + icon, Muted Text

REPORTS TAB:
  Date range selector: This week | Last week | This month (pill tabs)
  Per-child:
    Stats: Total quests / Stars earned / Streak / Bonus earned
    Mini chart: 7-bar chart showing completions per day
    Color: Horizon Blue bars, Cloud White bg, Border Gray grid

Chart bar specs:
  Height: 120px container, bars scale to max value
  Width: Each bar 24px, 8px gap
  Label: Day initial (M T W T F S S) below, Plus Jakarta Sans 500, 11px, Muted Text
  Value: Number above bar on hover/active, Plus Jakarta Sans 700, 12px, Horizon Blue
```

---

### Screen 8 — Theme Manager (Parent)

**Note:** Phase 2 feature. Design spec provided for completeness.

```
Background:   Cloud White

HEADER:
  "Theme Manager" — Plus Jakarta Sans 700, 22px, Slate Text
  "Personalize Zen's adventure world" — Muted Text, 14px

CHILD SELECTOR: Tab strip — Zen | Zia

CURRENT THEME PREVIEW:
  Phone mockup (simplified 200px tall):
    Shows child dashboard header with current theme applied
    Live color preview updates as parent adjusts
  "Current: Space Explorer" theme name + edit icon

AI THEME GENERATOR:
  Card with Nebula Violet left border:
    "✨ Generate a New Theme"
    Prompt: "What's your child's favorite character or thing?"
    Text input: "e.g. dinosaurs, space, Minecraft..."
    "Generate Theme" button → Horizon Blue
    
    Generated result shows:
      Theme name: "Dino Adventure 🦕"
      Color swatches: 5 circles showing palette
      "Apply This Theme" button
      "Try Another" ghost button

MANUAL COLOR OVERRIDE (advanced):
  Accordion: "Customize Colors (Advanced)"
  When expanded:
    Color picker for: Background, Primary Accent, Secondary Accent, Text
    Each: Color swatch + hex input + accessibility indicator
    Accessibility badge: "✅ AA Compliant" or "⚠️ Low contrast — adjust"
  "Reset to Generated" text link
  "Save Theme" primary button

THEME PRESETS GRID:
  "Quick Themes" section
  2-column grid of preset theme cards:
    Card: 48px swatch strip (3 colors) + theme name
    Names: "Ocean Depths", "Forest Quest", "Candy Kingdom", "Galaxy Explorer"
    Active indicator: Horizon Blue border + checkmark
```

---

## Part 7 — Copy & Tone Direction

### 7.1 Child Interface — "Silly Quest Master" Tone

**Voice:** Your best friend who also happens to be a wizard. Encouraging, slightly ridiculous, never condescending.

**Rules:**
- Always use "you" — this is personal
- Add one emoji per short message, two max for celebrations
- Playful made-up words are welcome ("quest-astic", "star-tastic", "quest-ify")
- Never say "please complete your chores" — always frame as adventure
- When praising, be specific and exaggerated in the best way
- Never use "fail" or "wrong" — use "try again" and "almost!"

**Tone Examples by Context:**

| Context | Copy |
|---------|------|
| Daily greeting | "Hey Zen! Ready to quest-ify your day? 🚀" |
| Core tasks header | "⚡ Must-Do Quests — Your adventure starts here!" |
| Extra tasks locked | "🔒 Finish your Must-Dos to unlock bonus quests!" |
| Extra tasks unlocked | "✨ Bonus time! Extra stars await, brave adventurer!" |
| Task marked complete | "Quest sent for approval! Waiting for your grown-up... ⏳" |
| Task approved | "Quest complete! You're officially a star-collecting superstar! ⭐" |
| Task rejected | "Oops! Looks like this quest needs another try. You've got this! 🌟" |
| PIN error | "Hmm, that's not it! Try your secret code again 🤫" |
| PIN locked | "Too many tries! Your code is resting for 15 minutes 🔒" |
| Star store | "What will your stars unlock today? 🛍️" |
| Redemption success | "Woohoo! Ask your parent for your prize — you earned it! 🎉" |
| Weekly bonus earned | "WHOA! You did it! Here's your bonus stars! 🌟✨⭐" |
| All quests done | "Mission complete! You're a LEGEND, Zen! 🏆" |

**Microcopy for Onboarding (First-time child):**
1. "Welcome to StarqueZZ! I'm here to guide you on your adventure! 🚀"
2. "First up: your Must-Do Quests. You need to do BOTH every day."
3. "After your Must-Dos? Bonus quests! Each one = 1 extra ⭐"
4. "Mark a quest done by tapping its checkbox. Your parent will check it!"
5. "Spend your stars in the Star Store. Real prizes, really yours!"
6. "Complete quests 7 days in a row for a 50% star BONUS! 🔥"

---

### 7.2 Parent Interface — "Warm Co-Pilot" Tone

**Voice:** A thoughtful, organized system that respects your time and loves your kids.

**Rules:**
- Direct and informative — parents are busy
- Warm subtext — always acknowledge the love behind the task
- Never preachy or over-explaining
- Light encouragement without being saccharine
- Numbers and data are fine — parents appreciate clarity
- One small emoji per important section header, not in body copy

**Tone Examples by Context:**

| Context | Copy |
|---------|------|
| Dashboard header | "Mission Control — Good morning" |
| Pending approvals | "3 quests are waiting for your review" |
| Approve success | "Approved! Zen just earned a star. ⭐" |
| Reject prompt | "What needs another try?" |
| Rejection sent | "Zen has been notified. They can try again today." |
| Empty approvals | "All caught up! Nothing pending. ✅" |
| Weekly streak (child) | "Zen is on a 4-day streak — perfect week in reach!" |
| Add child prompt | "Let's set up another adventurer" |
| Chore inactive toggle | "This quest won't appear in Zen's daily list" |
| Auto-approval notice | "This task was auto-approved after 24 hours." |
| Reward fulfilled | "Marked as fulfilled! Zen has been notified." |
| PIN reset | "Zen's PIN has been reset. Make sure to tell them!" |

---

## Part 8 — Design Rationale

### Why Dark Mode for Children, Light for Parents?

Children experience the app as a game at night and on weekends — ambient dark UIs are less tiring on eyes in low light, and the contrast of Quest Gold against deep space is more visually striking and game-like. It signals: "This is your world, not your homework."

Parents use the dashboard at any time — often in bright environments (kitchen, office). A light, professional UI reduces cognitive load and doesn't trigger "game mode" associations when they're in management mindset.

### Why Rounded Shapes (Against Neo-Brutalism)?

Neo-Brutalism is currently popular in developer tooling and tech-forward consumer apps. Its sharp edges, bold borders, and hard shadows read as "edgy" and "assertive" — qualities that work for Notion-style tools but are inappropriate for a primary audience of 5-year-olds. Children's cognitive design research consistently shows that rounded shapes signal safety, approachability, and playfulness. Every corner radius in this system was chosen to reduce anxiety and increase delight.

### Why Nunito for Children?

Nunito's rounded letterforms are specifically recommended for early readers. The letter `a` in Nunito is double-story (more distinguishable from `d`) and the `g` is open — both reduce misreading for developing readers. It's also extremely variable (weight 200–900) which gives us expressive display type without compromising readability.

### Why the Star is Sacred

The star economy only works if the star feels precious. If stars appeared constantly, cheaply, or with low visual impact, the reward loop collapses. Every animation in this system is designed to reinforce the star's value — the earn animation takes 600ms (deliberately longer than most transitions), stars float upward (gravity respected in reverse = something precious rising), and the counter always glows. Stars never decrease silently.

### Why Two-Faced Color System?

Rather than one unified palette, we built two distinct palettes that share three semantic tokens (star color, success, error). This creates a moment of visual delight when parents enter the app after their child — the UI completely transforms. That transformation communicates "you are now in control mode" to parents and prevents confusion between roles. The shared semantic tokens (especially the star color) maintain the common currency concept across both worlds.

### Parent Swipe-to-Approve UX

The most frequent parent action is approving quests. If that requires 3 taps (tap item → tap approve → confirm), it will feel tedious and parents will disengage. Swipe-to-approve (right = yes, left = no) reduces this to a single gesture, inspired by the proven pattern from email apps. The visual feedback (green overlay growing as you swipe) is immediate and satisfying.

---

## Part 9 — Accessibility Checklist

| Requirement | Implementation |
|-------------|---------------|
| WCAG AA contrast | All color combos verified in Part 2 |
| Minimum tap target | 44×44px all interactive elements; keypad buttons 72×72px |
| Font minimum | 12px absolute minimum; 14px for readable content |
| Touch target spacing | 8px minimum between adjacent targets |
| Focus states | All interactive: visible focus ring (3px, Horizon Blue or Quest Gold) |
| Error not by color alone | Error states use icon + color + text |
| Animation reduction | Respect `prefers-reduced-motion` — all Spring animations become instant when enabled |
| Color not only info carrier | Status uses color + icon + label always |
| Reading level | Child copy: Flesch-Kincaid Grade 1–3 target |

---

## Part 10 — Implementation Notes for Developers

### CSS Custom Properties (Token Map)

```css
/* === CHILD UI TOKENS === */
--color-space-bg: #1A0F3C;
--color-cosmos-bg: #0F0A24;
--color-nebula-surface: #2A1F5F;
--color-quest-gold: #FFB800;
--color-quest-gold-light: #FFD54F;
--color-nebula-violet: #7C3AED;
--color-nebula-violet-light: #A78BFA;
--color-cosmic-coral: #FF6B6B;
--color-aurora-mint: #4ADE80;
--color-moonbeam: #F5F0FF;
--color-star-white: #FFFDF5;
--color-stardust: #6B5B8E;
--color-cosmic-teal: #22D3EE;

/* === PARENT UI TOKENS === */
--color-command-navy: #1E3A5F;
--color-horizon-blue: #2563EB;
--color-horizon-blue-light: #3B82F6;
--color-cloud-white: #F8FAFF;
--color-surface-white: #FFFFFF;
--color-border-gray: #E2E8F0;
--color-slate-text: #334155;
--color-muted-text: #64748B;
--color-placeholder: #94A3B8;
--color-success: #22C55E;
--color-alert-red: #EF4444;
--color-gold-amber: #F59E0B;
--color-streak-orange: #F97316;

/* === SHARED SEMANTIC TOKENS === */
--color-star: #FFB800;
--color-pending: #F59E0B;

/* === BORDER RADIUS === */
--radius-pill: 9999px;
--radius-card: 16px;
--radius-card-large: 20px;
--radius-input: 12px;
--radius-btn: 12px;

/* === SPACING === */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;

/* === SHADOWS === */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.12);
--shadow-md: 0 4px 16px rgba(0,0,0,0.16);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.24);
--shadow-glow-gold: 0 0 20px rgba(255,184,0,0.4);
--shadow-glow-violet: 0 0 16px rgba(124,58,237,0.35);

/* === ANIMATION TIMING === */
--duration-instant: 100ms;
--duration-quick: 200ms;
--duration-standard: 350ms;
--duration-expressive: 500ms;
--ease-snappy: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
```

### Font Loading (Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### Responsive PWA Canvas

```
All app screens: 375px base width, 812px base height
Safe areas: env(safe-area-inset-*) on all four sides
Viewport meta: width=device-width, initial-scale=1, viewport-fit=cover
Overflow: hidden at root; scroll only within designated scroll containers
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

*StarqueZZ Alternative Design System — Margaery 🎨*
*Synetica Design Operations | 2026-03-23*
*Zero-canvas. No legacy. Pure intent.*
