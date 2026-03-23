# StarqueZZ WONDERVERSE — Figma Hand-off Spec
**Margaery 🎨 | Synetica Design Ops | Phase 2**
**Version:** 1.0.0 | **Date:** 2026-03-23

---

## How to Use This Document

This spec is the authoritative hand-off for Figma implementation. For every component:
1. Create a **component** in Figma matching exact dimensions and layer names
2. Add **variants** matching all described states
3. Apply **color styles** and **text styles** using exact names below
4. Configure **auto-layout** with specified padding/gap values
5. Add **prototype interactions** as described in Section 4

---

## Part 1 — Color Styles

Create these as **local color styles** in Figma. Use slash-notation for grouping.

### Quest Mode Palette (Child UI)

| Figma Style Name | Hex | Notes |
|------------------|-----|-------|
| `Quest/Background/Deep Space` | `#1A0F3C` | Primary screen background |
| `Quest/Background/Midnight Cosmos` | `#0F0A24` | Darkest layer, gradient end |
| `Quest/Surface/Nebula` | `#2A1F5F` | Card backgrounds |
| `Quest/Gold/Primary` | `#FFB800` | ⭐ Star color, primary CTA |
| `Quest/Gold/Light` | `#FFD54F` | Hover / glow inner |
| `Quest/Violet/Primary` | `#7C3AED` | Secondary accent |
| `Quest/Violet/Light` | `#A78BFA` | Inactive, secondary text |
| `Quest/Status/Success` | `#4ADE80` | Aurora Mint — completed |
| `Quest/Status/Error` | `#FF6B6B` | Cosmic Coral — error/rejection |
| `Quest/Status/Pending` | `#F59E0B` | Gold Amber — awaiting approval |
| `Quest/Status/Locked` | `#6B5B8E` | Stardust — disabled |
| `Quest/Accent/Teal` | `#22D3EE` | Bonus/streak indicators |
| `Quest/Text/Primary` | `#FFFDF5` | Star White — main text |
| `Quest/Text/Muted` | `#6B5B8E` | Stardust — secondary text |
| `Quest/Text/Moonbeam` | `#F5F0FF` | Light sections on dark |

### Mission Mode Palette (Parent UI)

| Figma Style Name | Hex | Notes |
|------------------|-----|-------|
| `Mission/Background/Cloud` | `#F8FAFF` | Cloud White — page bg |
| `Mission/Surface/White` | `#FFFFFF` | Card backgrounds |
| `Mission/Surface/Border` | `#E2E8F0` | Border Gray — dividers |
| `Mission/Blue/Primary` | `#2563EB` | Horizon Blue — main CTA |
| `Mission/Blue/Light` | `#3B82F6` | Hover state |
| `Mission/Navy/Primary` | `#1E3A5F` | Command Navy — headers |
| `Mission/Text/Primary` | `#334155` | Slate Text |
| `Mission/Text/Muted` | `#64748B` | Secondary text |
| `Mission/Text/Placeholder` | `#94A3B8` | Input placeholders |
| `Mission/Status/Success` | `#22C55E` | Approvals, completions |
| `Mission/Status/Error` | `#EF4444` | Alert Red |
| `Mission/Status/Pending` | `#F59E0B` | Gold Amber |
| `Mission/Status/Locked` | `#94A3B8` | Placeholder gray |
| `Mission/Accent/Streak` | `#F97316` | Streak orange |
| `Mission/Accent/Star` | `#F59E0B` | Gold Amber for star counts |

### Shared Semantic Styles

| Figma Style Name | Hex |
|------------------|-----|
| `Semantic/Star` | `#FFB800` |
| `Semantic/Success/Child` | `#4ADE80` |
| `Semantic/Success/Parent` | `#22C55E` |
| `Semantic/Error/Child` | `#FF6B6B` |
| `Semantic/Error/Parent` | `#EF4444` |
| `Semantic/Pending` | `#F59E0B` |

### Gradient Styles (create as fill styles)

| Figma Style Name | Value |
|------------------|-------|
| `Gradient/Space Background` | Linear 180°: `#1A0F3C` → `#0F0A24` (60%) → `#1A1040` |
| `Gradient/Card Core` | Linear 135°: `#2A1F5F` → `#1E1650` |
| `Gradient/Quest Gold` | Linear 135°: `#FFB800` → `#FFD54F` |
| `Gradient/Parent Header` | Linear 135°: `#1E3A5F` → `#2563EB` |
| `Gradient/Nebula Violet` | Linear 135°: `#7C3AED` → `#A78BFA` |

---

## Part 2 — Text Styles

Create as **local text styles**. Font must be installed: **Nunito** + **Plus Jakarta Sans** + **JetBrains Mono**.

### Child UI Text Styles (Nunito)

| Figma Style Name | Size | Weight | Line Height | Tracking |
|------------------|------|--------|-------------|----------|
| `Child/Display XL` | 48 | 900 Black | 110% | -0.5px |
| `Child/Display` | 36 | 900 Black | 115% | -0.5px |
| `Child/Heading 1` | 28 | 800 ExtraBold | 120% | 0 |
| `Child/Heading 2` | 22 | 800 ExtraBold | 125% | 0 |
| `Child/Heading 3` | 18 | 700 Bold | 130% | 0 |
| `Child/Body Large` | 16 | 600 SemiBold | 150% | 0 |
| `Child/Body` | 14 | 600 SemiBold | 150% | 0 |
| `Child/Caption` | 12 | 500 Medium | 140% | 0 |
| `Child/Badge Label` | 11 | 700 Bold | 140% | 0.02em |

### Parent UI Text Styles (Plus Jakarta Sans)

| Figma Style Name | Size | Weight | Line Height | Tracking |
|------------------|------|--------|-------------|----------|
| `Parent/Display` | 28 | 700 Bold | 120% | 0 |
| `Parent/Heading 1` | 22 | 700 Bold | 125% | 0 |
| `Parent/Heading 2` | 18 | 600 SemiBold | 130% | 0 |
| `Parent/Heading 3` | 16 | 600 SemiBold | 135% | 0 |
| `Parent/Body Large` | 16 | 400 Regular | 160% | 0 |
| `Parent/Body` | 14 | 400 Regular | 160% | 0 |
| `Parent/Small` | 12 | 400 Regular | 150% | 0 |
| `Parent/Label` | 11 | 500 Medium | 140% | 0.08em |
| `Parent/Label Caps` | 11 | 600 SemiBold | 140% | 0.08em |

### Mono Styles (JetBrains Mono)

| Figma Style Name | Size | Weight | Use |
|------------------|------|--------|-----|
| `Mono/PIN Display` | 24 | 700 Bold | PIN entry dot alternates |
| `Mono/Star Counter` | 18 | 400 Regular | Tabular star balance |

---

## Part 3 — Effect Styles

Create as **local effect styles**.

| Figma Style Name | Value |
|------------------|-------|
| `Shadow/XS` | Drop shadow: 0,1,3 — 8% black |
| `Shadow/SM` | Drop shadow: 0,2,8 — 12% black |
| `Shadow/MD` | Drop shadow: 0,4,16 — 16% black |
| `Shadow/LG` | Drop shadow: 0,8,32 — 24% black |
| `Glow/Gold` | Drop shadow: 0,0,20 — rgba(255,184,0,0.4) + 0,4,12 rgba(255,184,0,0.5) |
| `Glow/Violet` | Drop shadow: 0,0,16 — rgba(124,58,237,0.35) |
| `Glow/Mint` | Drop shadow: 0,0,12 — rgba(74,222,128,0.35) |
| `Glow/Coral` | Drop shadow: 0,0,12 — rgba(255,107,107,0.35) |

---

## Part 4 — Component Inventory

---

### 4.1 StarBadge

**Purpose:** Primary star currency display. Lives in the child header.

**Dimensions:**
| Size | Height | H-Padding | Icon | Font |
|------|--------|-----------|------|------|
| SM | 28px | 10px | 16px | 14px |
| MD | 36px | 12px | 20px | 18px |
| LG | 44px | 16px | 24px | 24px |

**Auto-layout:**
- Direction: Horizontal
- Alignment: Center
- Padding: 0 12px (MD)
- Gap: 6px
- Border radius: 9999px (pill)

**Layers (name these exactly):**
```
StarBadge [component]
  └── container [frame, pill, auto-layout horizontal]
        ├── icon [text, ⭐ emoji]
        └── count [text, Child/Body Large or larger per size]
```

**States (variants):**
| Property | Values |
|----------|--------|
| Size | SM / MD / LG |
| Animated | True / False |

**Fill:** `Quest/Surface/Nebula`
**Shadow (default):** Custom: 0 0 8px rgba(255,184,0,0.2) — subtle warmth
**Shadow (animated):** `Glow/Gold` effect style

**Notes:**
- Count text uses `Quest/Gold/Primary` color
- Icon slot is a 1:1 frame containing the ⭐ emoji at the specified size
- No border/stroke on the pill

---

### 4.2 QuestCard

**Purpose:** Core interaction card for child's daily quest list.

**Base Dimensions:**
- Width: fill container (16px margin each side)
- Min height: 80px
- Border radius: 20px

**Auto-layout:**
- Direction: Horizontal
- Alignment: Center
- Padding: 16px right, 16px top/bottom, 4px left (leaving room for accent strip)
- Gap: 12px

**Layers:**
```
QuestCard [component]
  ├── accent-strip [rectangle, 4px wide, full height, fill by state]
  └── content [frame, auto-layout horizontal, fill remaining]
        ├── icon-blob [frame, 48x48px, circle, auto-layout center]
        │     └── icon [text, emoji, 24px]
        ├── text-stack [frame, auto-layout vertical, fill, gap 4px]
        │     ├── badge-row [frame, auto-layout horizontal]
        │     │     └── type-badge [text + fill, Child/Badge Label]
        │     ├── title [text, Child/Heading 2]
        │     ├── description [text, Child/Body, optional]
        │     └── status-label [text, Child/Caption]
        └── right-stack [frame, auto-layout vertical, align end, gap 8px]
              ├── star-value [text, Child/Caption, Quest/Gold/Primary]
              └── action-target [frame, 44x44px, circle]
                    └── action-icon [text, emoji, 20px]
```

**Variant Matrix:**
| Property | Values |
|----------|--------|
| Type | Core / Extra |
| Status | Pending / Complete / Locked |

**Accent Strip Colors:**
| State | Color |
|-------|-------|
| Core Pending | `Quest/Gold/Primary` |
| Extra Pending | `Quest/Violet/Primary` |
| Any Complete | `Quest/Status/Success` |
| Any Locked | `Quest/Status/Locked` |

**Background:** `Quest/Surface/Nebula`
**Shadow:** `Shadow/MD`
**Locked state:** Layer opacity 50%

**Interaction (prototype):**
- Action target: on tap → state changes to Complete variant
- Hover: scale 1.02 (Smart Animate)

---

### 4.3 Button

**Purpose:** Primary interactive element. Dual personality per mode.

**Quest Mode Dimensions:**
| Size | Height | H-Padding | Font | Radius |
|------|--------|-----------|------|--------|
| SM | 40px | 20px | 14px | 9999px (pill) |
| MD | 48px | 24px | 16px | 9999px (pill) |
| LG | 56px | 28px | 18px | 9999px (pill) |

**Mission Mode Dimensions:**
| Size | Height | H-Padding | Font | Radius |
|------|--------|-----------|------|--------|
| SM | 40px | 20px | 14px | 12px |
| MD | 48px | 24px | 15px | 12px |
| LG | 56px | 28px | 16px | 12px |

**Auto-layout:**
- Direction: Horizontal
- Alignment: Center, Center
- Min width: 120px (SM), 140px (MD), 160px (LG)
- Gap: 8px

**Layers:**
```
Button [component]
  └── container [frame, auto-layout horizontal]
        ├── left-icon [frame, 20x20, optional]
        ├── label [text]
        ├── right-icon [frame, 20x20, optional]
        └── spinner [frame, 16x16, visible when loading=true]
```

**Variant Matrix:**
| Property | Values |
|----------|--------|
| Variant | Primary / Secondary / Ghost / Danger |
| Size | SM / MD / LG |
| Mode | Quest / Mission |
| State | Default / Hover / Active / Disabled / Loading |

**Quest Primary fills:**
- Default BG: `Quest/Gold/Primary`
- Default Text: `Quest/Background/Deep Space`
- Hover BG: `Quest/Gold/Light`
- Shadow: `Glow/Gold`

**Mission Primary fills:**
- Default BG: `Mission/Blue/Primary`
- Default Text: white
- Hover BG: `Mission/Blue/Light`
- Shadow: `Shadow/SM`

**Notes:**
- Disabled: Layer opacity 40% (Quest) / 50% (Mission)
- Loading: Replace label + icons with 16px spinner (animated in prototype)
- "Danger" uses `Quest/Status/Error` or `Mission/Status/Error` depending on mode

---

### 4.4 PINPad

**Purpose:** Secure child login using a numeric PIN. Full-screen component.

**Container:** 375×812px (full PWA viewport), Deep Space background gradient

**Sections (vertical stack with fixed positions):**

**Avatar section (top ~30%):**
- Avatar frame: 96×96px circle
  - Fill: `Gradient/Nebula Violet`
  - Shadow: `Glow/Violet`
  - Image: child photo (clip to circle) or initials (Child/Display, white)
- Name: `Child/Display` style, `Quest/Text/Primary`
- Prompt: `Child/Body` style, opacity 75%

**PIN Dots (middle ~10%):**
- Row of N dots (4 by default), 20px gap
- Each dot: 24×24px circle
  - Empty: 2px stroke, `Quest/Status/Locked` (Stardust)
  - Filled: fill `Quest/Gold/Primary`, shadow `Glow/Gold`
  - Error: fill `Quest/Status/Error`, shake animation
  - Success: fill `Quest/Status/Success`, scale 28px momentarily

**Keypad (bottom ~50%):**
- 3-column grid, 12px gap
- Key button: 72×72px circle
  - Layers: `[KeyButton] > [circle bg] + [number text] + [sub-label text]`
  - Default fill: `Quest/Surface/Nebula`, shadow `Shadow/MD`
  - Number text: `Child/Display` (24px), `Quest/Text/Primary`
  - Sub-label: 8px, Nunito Medium, `Quest/Text/Muted`
  - Active fill: `Quest/Gold/Primary`, text `Quest/Background/Deep Space`
- Backspace key: transparent bg, `Quest/Violet/Light` icon, 24px
- Confirm (✓) key: only visible when PIN complete, `Quest/Status/Success` bg

**Variant Matrix:**
| Property | Values |
|----------|--------|
| State | Idle / Entering / Error / Success / Locked |
| Digits | 0 / 1 / 2 / 3 / 4 (filled count) |

---

### 4.5 ProgressRing

**Purpose:** Circular streak/progress indicator for weekly completion display.

**Sizes:**
| Size | Outer Ø | Stroke | Center area |
|------|---------|--------|-------------|
| SM | 80px | 6px | 68px |
| MD | 120px | 8px | 104px |
| LG | 160px | 10px | 140px |

**Layers:**
```
ProgressRing [component]
  └── svg-frame [frame, size x size]
        ├── track-circle [ellipse, full radius, no fill, stroke = Quest/Surface/Nebula]
        ├── fill-arc [ellipse, same, stroke = Quest/Gold/Primary, variable dash offset]
        └── center-content [frame, auto-layout vertical, centered]
              ├── percentage [text, Child/Heading 1 or scaled]
              ├── label [text, Child/Caption, optional]
              └── star-count [text, Child/Caption, Quest/Gold/Primary, optional]
```

**Track color:** `Quest/Surface/Nebula` (`#2A1F5F`)
**Fill color:** `Quest/Gold/Primary` (`#FFB800`)
**Fill effect:** Outer glow `Glow/Gold` on the arc only
**Stroke cap:** Round

**Variant Matrix:**
| Property | Values |
|----------|--------|
| Progress | 0% / 25% / 50% / 75% / 100% (for static previews) |
| Size | SM / MD / LG |
| Show Label | Yes / No |
| Show Stars | Yes / No |

---

## Part 5 — Prototype Interaction Notes

### Global Animation Config
- Figma Smart Animate: **ON** for all state transitions
- Default easing: **Spring (Bounce)** for quest mode / **Ease Out** for mission mode
- Default duration: Quest 350ms / Mission 250ms

---

### StarBadge: Star Receive Animation

| Step | Trigger | Animation | Duration |
|------|---------|-----------|----------|
| 1 | On component property "Animated" → True | Scale 1.0 → 1.35 + rotate 15deg | 175ms Spring |
| 2 | Auto-continues | Scale 1.35 → 0.95 + rotate -5deg | 100ms |
| 3 | Auto-continues | Scale 0.95 → 1.0 + rotate 0deg | 75ms |

In prototype: Create 3 intermediate frames and chain with Smart Animate.

---

### QuestCard: Complete Tap

| Step | Trigger | Target layer | Animation | Duration |
|------|---------|-------------|-----------|----------|
| 1 | On tap | Whole card | Scale 0.96 | 100ms Spring |
| 2 | Auto | Action icon | Swap to ✅ emoji | Instant |
| 3 | Auto | Accent strip | Color → Aurora Mint | 200ms Ease Out |
| 4 | Auto | Status label | Text → "⭐ Got it!" | Instant |
| 5 | Auto | Whole card | Scale back 1.0 | 100ms Spring |

In Figma: 3 component variants (Pending → Pending-Pressed → Complete), Smart Animate.

---

### Button: Quest Primary Press

| Trigger | Animation | Duration |
|---------|-----------|----------|
| On press down | Scale → 0.96, shadow reduce | 100ms |
| On release | Scale → 1.0, shadow restore | 150ms Spring |
| Hover | BG Quest/Gold/Light | 150ms Ease Out |

---

### PINPad: Dot Fill Sequence

| Step | Trigger | Animation | Duration |
|------|---------|-----------|----------|
| Each digit entered | Dot i fills | Scale 0.8 → 1.1 → 1.0, fill appears | 200ms Spring |
| Error state | All filled dots | Shake horizontal ±8px × 3 cycles | 500ms total |
| Error → reset | All dots | Fade to empty | 200ms |
| Success | All dots | Color → Success green, scale 1.1 | 200ms |

Prototype tip: Build 5 dot-row states (0/1/2/3/4 filled), connect with Smart Animate on tap of each key.

---

### PINPad: Error Shake

Prototype flow:
1. Wrong PIN state → swap to "Error" variant
2. After 700ms delay → swap back to "Idle 0 digits" variant
Use Figma "After delay" trigger: 700ms → navigate to idle.

---

### ProgressRing: Fill Animation

On component mount / "Progress" property change:
- `stroke-dashoffset` from `circumference` → `target`
- Duration: 600ms, Ease Out Cubic
- In Figma: use intermediate variants at 0%, 50%, target% with Smart Animate

---

### QuestCard: Locked → Wobble (Idle)

The lock icon on locked cards has a periodic teaser:
- Trigger: "After delay" 4000ms → play wobble → loop
- Wobble: Rotation ±8° over 600ms ease-in-out
- Only fires on cards in "Locked" state

---

## Part 6 — Asset Export Specs

### Icons (from Lucide React + custom)

| Asset | Format | Size | Notes |
|-------|--------|------|-------|
| Navigation icons (home, store, profile) | SVG | 24×24px | 2px stroke, rounded caps |
| Star (custom glow) | SVG | 24×24px | Filled star with inner gradient |
| Lock icon | SVG | 24×24px | Rounded lock, 2px stroke |
| Checkmark | SVG | 24×24px | Rounded check path |
| Backspace | SVG | 24×24px | Left arrow with × |
| All app icons | SVG | 24×24px, @2x = 48×48px | Must work at 16px minimum |

**Icon export settings in Figma:**
- Select icon frame → Export → SVG
- Flatten strokes before export (Outline Stroke)
- Remove any clip masks

### Illustrations

| Asset | Format | Dimensions | Usage |
|-------|--------|------------|-------|
| Hero app preview (landing) | PNG @2x | 640×900px | Landing page, slight tilt CSS |
| Empty state: Star Store empty | PNG @2x | 320×320px | Shopping cart illustration |
| Empty state: All quests done | PNG @2x | 320×320px | Trophy/celebration |
| Welcome screen character | PNG @2x | 280×400px | Onboarding mascot |
| Bonus unlock overlay asset | PNG @2x | 400×400px | Full-screen celebration |

**Illustration export settings:**
- Frame background: transparent
- Export at @2x (Retina)
- Trim transparent pixels (use "Clip content" OFF, then export)
- Max file size: 200KB per illustration (compress with Squoosh)

### PWA App Icons

| Size | Format | Usage |
|------|--------|-------|
| 16×16px | PNG | Browser favicon |
| 32×32px | PNG | Browser favicon @2x |
| 180×180px | PNG | Apple Touch Icon |
| 192×192px | PNG | Android homescreen |
| 512×512px | PNG | Splash/PWA manifest |
| 1024×1024px | PNG | App Store (if native) |

Design brief for app icon:
- Background: `Gradient/Space Background`
- Foreground: Gold ⭐ star, centered, slightly oversized (fills ~65% of frame)
- Star has inner glow: `Glow/Gold` effect
- Border radius: 22.5% (matches iOS icon rounding)
- Do NOT round in Figma — export square, OS applies rounding

---

## Part 7 — Auto-Layout Specification Summary

| Component | Direction | Padding | Gap | Min W/H | Fill |
|-----------|-----------|---------|-----|---------|------|
| StarBadge SM | H | 0 10px | 4px | — | 28px |
| StarBadge MD | H | 0 12px | 6px | — | 36px |
| StarBadge LG | H | 0 16px | 8px | — | 44px |
| QuestCard | H | 16px / content 16px 4px | 12px | — / 80px | fill |
| Button SM Quest | H | 0 20px | 6px | 100px / 40px | — |
| Button MD Quest | H | 0 24px | 8px | 140px / 48px | — |
| Button LG Quest | H | 0 28px | 10px | 160px / 56px | — |
| PINPad container | V | 32px 16px | auto | 375px / 812px | — |
| PINPad keypad | Grid | — | 12px | 264px / — | — |
| PINPad dot row | H | — | 20px | — / — | — |
| ProgressRing | — | — | 8px | size / size | — |

---

## Part 8 — Figma File Structure

Recommended Figma page layout:

```
📄 00 – Cover (project name, version, date)
📄 01 – Color Styles (visual reference grid)
📄 02 – Text Styles (type specimen)
📄 03 – Component Library
    ├── Atoms:  StarBadge, Button, ProgressRing
    ├── Molecules: QuestCard, PINPad dots, Badge chips
    └── Organisms: PINPad, nav bars, cards with context
📄 04 – Screens: Quest Mode
    ├── 01 – Child: Daily Dashboard
    ├── 02 – Child: PIN Login
    ├── 03 – Child: Star Store
    └── 04 – Child: Profile
📄 05 – Screens: Mission Mode
    ├── 01 – Parent: Dashboard
    ├── 02 – Parent: Approvals
    ├── 03 – Parent: Task Builder
    └── 04 – Parent: Reports
📄 06 – Prototype Flows (linked frames)
📄 07 – Motion References (GIFs or After Effects links)
📄 08 – Landing Page (Web, 1440px + 375px)
```

---

## Part 9 — Accessibility Checklist for Figma

Before handing off any screen:

- [ ] All text layers have a named text style applied
- [ ] All color fills reference a named color style (no raw hex overrides)
- [ ] All interactive elements have a min tap area frame of 44×44px
- [ ] Focus rings are designed: 3px ring, `Quest/Gold/Primary` or `Mission/Blue/Primary`
- [ ] Error states use icon + color + text (never color alone)
- [ ] All images have alt text notes in the component description
- [ ] Contrast ratios marked in annotation for any borderline color pair
- [ ] Loading/empty/error states exist for all data-dependent components
- [ ] Reduced motion variants: comment "animation skips — static state shown"

---

## Part 10 — Design Token ↔ Code Mapping

| Figma Style | CSS Variable | Tailwind Class (if applicable) |
|-------------|-------------|-------------------------------|
| `Quest/Gold/Primary` | `--color-quest-gold` | `bg-[#FFB800]` / `text-[#FFB800]` |
| `Quest/Background/Deep Space` | `--color-quest-deep-space` | `bg-[#1A0F3C]` |
| `Quest/Surface/Nebula` | `--color-quest-nebula-surface` | `bg-[#2A1F5F]` |
| `Mission/Blue/Primary` | `--color-mission-horizon-blue` | `bg-[#2563EB]` |
| `Shadow/MD` | `--shadow-md` | `shadow-[0_4px_16px_rgba(0,0,0,0.16)]` |
| `Glow/Gold` | `--shadow-glow-gold` | `shadow-[0_0_20px_rgba(255,184,0,0.4)]` |
| `Child/Heading 2` | `--font-size-heading-2` + `--font-quest` | `text-[22px] font-['Nunito'] font-extrabold` |
| Border radius pill | `--radius-pill` | `rounded-full` |
| Border radius card | `--radius-card-lg` | `rounded-[20px]` |
| Spacing MD | `--space-md` | `p-4` / `gap-4` |
| Animation star-receive | `--duration-standard` + `--ease-snappy` | `animate-[star-receive_350ms_...]` |

---

*StarqueZZ WONDERVERSE Design System Figma Spec*
*Margaery 🎨 | Synetica Design Operations | 2026-03-23*
*Zero-canvas. No legacy. Pure intent.*
