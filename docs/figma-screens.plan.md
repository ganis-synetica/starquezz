# StarqueZZ Figma Mockup Screen Inventory

## Overview

Based on the PRD and Architecture documents, this plan outlines the essential screens needed for your Figma mockup. The landing page will be responsive (mobile/tablet/desktop), while the app (app.starquezz.com) will display as mobile PWA even on desktop.

## Streamlined Screen List (8 Total)

### Core Screens to Create:

1. **Landing Home** (responsive: mobile/tablet/desktop)
   - Hero section with app preview
   - Feature highlights (gamification, parent controls, PWA benefits)
   - CTA buttons (Get Started, Learn More)
   - Social proof/testimonials placeholder
   - Footer with links

2. **Parent Login + Child Profile Selection** (mobile PWA - 375x812px)
   - Parent login form (email/password)
   - "Create Account" link
   - Child profile cards (avatars + names)
   - "Add Child" option for parents

3. **Child PIN Login** (mobile PWA - 375x812px)
   - Large numeric keypad (0-9)
   - 4-dot PIN indicator
   - Child name + avatar at top
   - "Back" button
   - Error state (wrong PIN, locked out)

4. **Child Daily Dashboard** (mobile PWA - 375x812px)
   - Header: Child name, avatar, star balance
   - Date indicator (Today)
   - Core Tasks section (2 tasks, locked/unlocked states)
   - Extra Tasks section (locked if cores incomplete, unlocked if complete)
   - Weekly progress indicator
   - Bottom navigation (Home, Star Store, Profile)

5. **Child Star Store** (mobile PWA - 375x812px)
   - Header with current star balance
   - Grid/list of available rewards
   - Each reward shows: image, title, cost in stars
   - "Not enough stars" state (grayed out)
   - "Redeem" button (enabled/disabled)
   - Redemption confirmation flow

6. **Parent Dashboard** (mobile PWA - 375x812px)
   - Overview cards for each child
   - Pending approvals counter (prominent)
   - Quick stats (weekly completions, stars earned)
   - Navigation tabs: Dashboard, Approvals, Management

7. **Parent Management Hub** (mobile PWA - 375x812px)
   - Tabbed interface with:
     - **Chores Tab**: List of chores, add/edit chore, assign to children
     - **Rewards Tab**: List of rewards, add/edit reward, manage costs
     - **Children Tab**: Child profiles, add child, PIN management
     - **Reports Tab**: Weekly progress charts, star earnings breakdown

8. **Design System Components**
   - Buttons (primary, secondary, destructive)
   - Input fields (text, number, PIN keypad)
   - Cards (task card, reward card, child card)
   - Badges (status indicators)
   - Star icon/animation
   - Avatar component
   - Toggle switches, checkboxes
   - Navigation bars, modal overlays
   - Loading/error/empty states

## Recommended Figma Organization

1. **Page 1: Landing (Responsive)**
   - Mobile frames (375px)
   - Tablet frames (768px)
   - Desktop frames (1440px)

2. **Page 2: Authentication**
   - Parent Login + Child Profile Selection (375x812px)

3. **Page 3: Child Experience**
   - Child PIN Login + Daily Dashboard + Star Store (375x812px)

4. **Page 4: Parent Experience**
   - Parent Dashboard + Management Hub (375x812px)

5. **Page 5: Components & States**
   - Design system components
   - Loading/error/empty states

## Key Design Considerations

- **Base Frame:** iPhone 13 (375x812px) for all PWA screens
- **Color Scheme:** Use TweakCN Neo-Brutalism base theme as shown in architecture
- **Typography:** DM Sans (sans), Space Mono (mono)
- **Shadows:** Hard shadows (4px 4px 0px) for neo-brutalism
- **Border Radius:** 0px (sharp corners per theme)
- **Border Width:** Bold borders (2-4px black)
- **Tone:** Playful, funny adventure language for child screens; professional for parent screens
- **Accessibility:** WCAG AA compliance, high contrast, large tap targets (44x44px minimum)
- **Offline Indicators:** Show when offline/syncing

## Merged Functions Strategy

### **Authentication Screen (Screen 2):**
- Combines parent login with child profile selection
- Reduces navigation steps
- Shows child profiles immediately after parent login

### **Parent Management Hub (Screen 7):**
- **Chores Tab**: Create/edit chores, assign to children, set core/extra types
- **Rewards Tab**: Create/edit rewards, set star costs, manage availability
- **Children Tab**: Add/edit child profiles, manage PINs, view individual stats
- **Reports Tab**: Weekly progress, star earnings, streak tracking
- Single screen handles all parent management needs

### **Child Experience (Screens 4-5):**
- Dashboard and Store as separate screens (core user flow)
- Dashboard shows tasks and progress
- Store handles redemption flow

## Screen Count Summary

**Landing Page:** 1 screen × 3 breakpoints = 3 artboards
**Authentication:** 1 screen (mobile only)
**Child Screens:** 2 screens (mobile only)
**Parent Screens:** 2 screens (mobile only)
**Design System:** 1 component library

**Total Artboards:** 8 screens + design system

## Priority Order for Creation

1. **Landing Home** (responsive)
2. **Parent Login + Child Selection**
3. **Child PIN Login**
4. **Child Daily Dashboard**
5. **Child Star Store**
6. **Parent Dashboard**
7. **Parent Management Hub**
8. **Design System Components**

This streamlined approach covers all essential user flows while keeping the mockup manageable and focused!