# StarqueZZ Figma Mockup Brief

## Project Overview

Create a comprehensive Figma mockup for **StarqueZZ**, a gamified chore-tracking PWA for children aged 5-8. The mockup should demonstrate both the responsive landing page and the mobile PWA app experience.

## Design System Foundation

### Base Theme: TweakCN Neo-Brutalism
- **Typography**: DM Sans (primary), Space Mono (mono)
- **Border Radius**: 0px (sharp corners)
- **Shadows**: Hard shadows (4px 4px 0px black)
- **Border Width**: Bold borders (2-4px black)
- **Color Palette**: Use the CSS variables from architecture document

### Key Design Principles
- **Child Interface**: Playful, funny adventure tone with silly language
- **Parent Interface**: Professional but warm and encouraging
- **Accessibility**: WCAG AA compliance, high contrast, 44x44px minimum tap targets
- **Mobile-First**: All PWA screens optimized for 375x812px (iPhone 13)

## Screen Specifications

### 1. Landing Home (Responsive)
**Breakpoints**: Mobile (375px), Tablet (768px), Desktop (1440px)

**Content Structure**:
- Hero section with app preview mockup
- Feature highlights: "Gamified Chores", "Parent Controls", "PWA Benefits"
- CTA buttons: "Get Started", "Learn More"
- Social proof placeholder
- Footer with links

**Key Elements**:
- App preview showing child dashboard
- Feature icons with neo-brutalism styling
- Bold, playful typography for headlines
- Strong visual hierarchy

### 2. Parent Login + Child Profile Selection (375x812px)

**Layout**:
- Top: Parent login form (email/password)
- Bottom: Child profile cards grid
- "Create Account" link
- "Add Child" button for parents

**Child Profile Cards**:
- Avatar placeholder (circular, 80px)
- Child name below avatar
- Subtle border and shadow
- Hover/active states

### 3. Child PIN Login (375x812px)

**Layout**:
- Header: Child name + avatar
- Center: 4-dot PIN indicator
- Bottom: Large numeric keypad (0-9)
- "Back" button (top-left)

**Keypad Design**:
- Large buttons (60x60px minimum)
- Bold numbers, clear contrast
- Error state: red border on PIN dots
- Success state: green checkmark

### 4. Child Daily Dashboard (375x812px)

**Header Section**:
- Child name, avatar, star balance
- Date indicator ("Today")
- Star animation placeholder

**Core Tasks Section**:
- 2 task cards (must complete both)
- Locked/unlocked visual states
- Checkmark animation placeholder

**Extra Tasks Section**:
- Locked if cores incomplete
- Unlocked if cores complete
- Individual task cards

**Bottom Navigation**:
- Home (active), Star Store, Profile icons
- Bold, clear iconography

### 5. Child Star Store (375x812px)

**Header**:
- Current star balance (prominent)
- "Star Store" title

**Rewards Grid**:
- 2-column grid layout
- Each reward card: image, title, cost
- "Not enough stars" state (grayed out)
- "Redeem" button (enabled/disabled)

**Redemption Flow**:
- Reward detail modal
- Cost confirmation
- Success screen with animation

### 6. Parent Dashboard (375x812px)

**Overview Cards**:
- One card per child
- Avatar, name, weekly progress
- Pending approvals counter (red badge)

**Quick Stats**:
- Weekly completions
- Stars earned
- Streak indicators

**Navigation Tabs**:
- Dashboard (active), Approvals, Management
- Clear tab styling

### 7. Parent Management Hub (375x812px)

**Tabbed Interface**:
- **Chores Tab**: List, add/edit, assign children
- **Rewards Tab**: List, add/edit, manage costs
- **Children Tab**: Profiles, add child, PIN management
- **Reports Tab**: Weekly charts, star breakdown

**Form Elements**:
- Input fields with neo-brutalism styling
- Toggle switches for active/inactive
- Multi-select for child assignment
- Save/cancel buttons

### 8. Design System Components

**Buttons**:
- Primary: Bold, high contrast
- Secondary: Outlined style
- Destructive: Red background
- All with hard shadows

**Cards**:
- Task cards, reward cards, child cards
- Consistent padding and borders
- Status indicators (badges)

**Input Fields**:
- Text inputs with bold borders
- PIN keypad component
- Form validation states

**Navigation**:
- Bottom nav (child)
- Tab nav (parent)
- Back buttons, menu icons

## Content Guidelines

### Child Interface Language
- "Time for your daily dose of quest-astic fun!"
- "You're a quest-master extraordinaire! Have a star! ⭐"
- "The Star Store is calling your name... or maybe it's just hungry!"
- "Quest complete! You're officially a star-collecting superstar!"

### Parent Interface Language
- Professional but warm tone
- Clear, direct instructions
- Supportive messaging about child progress

### Sample Content
**Tasks**: "Make your bed", "Put toys away", "Feed the pet", "Set the table"
**Rewards**: "Extra screen time (30 min)", "Choose dinner", "Stay up 30 min later", "Special treat"

## Technical Specifications

### Frame Setup
- **Landing**: 375px, 768px, 1440px frames
- **PWA Screens**: 375x812px (iPhone 13)
- **Grid System**: 8px base grid
- **Spacing**: 16px, 24px, 32px increments

### Color System
- Use CSS variables from architecture document
- Primary: Orange/red tones
- Secondary: Green tones
- Accent: Purple/blue tones
- High contrast ratios (WCAG AA)

### Typography Scale
- **Headings**: 24px, 20px, 18px (DM Sans Bold)
- **Body**: 16px, 14px (DM Sans Regular)
- **Small**: 12px (DM Sans Regular)
- **Mono**: 14px (Space Mono)

## Prototyping Requirements

### Key Interactions
1. **Landing → Get Started**: Navigate to parent login
2. **Parent Login → Child Selection**: Show child profiles
3. **Child PIN → Dashboard**: Enter PIN, show tasks
4. **Task Completion**: Mark done, show pending state
5. **Star Store**: Browse rewards, redemption flow
6. **Parent Approvals**: Approve/reject tasks
7. **Management**: Create/edit chores and rewards

### Animation Placeholders
- Star earning animations
- Task completion celebrations
- Loading states
- Success confirmations

## Deliverables

### Figma File Structure
1. **Page 1: Landing (Responsive)**
2. **Page 2: Authentication**
3. **Page 3: Child Experience**
4. **Page 4: Parent Experience**
5. **Page 5: Components & States**

### Export Requirements
- High-fidelity mockups
- Component library
- Style guide documentation
- Prototype with key user flows

## Success Criteria

- ✅ All 8 core screens designed
- ✅ Responsive landing page
- ✅ Mobile PWA experience
- ✅ Neo-brutalism design system applied
- ✅ Child-friendly playful interface
- ✅ Parent professional interface
- ✅ Accessibility considerations
- ✅ Interactive prototype
- ✅ Component library
- ✅ Clear user flows

## Notes

- Focus on MVP features only
- Theme customization will be Phase 2
- Offline indicators should be subtle
- Error states and empty states included
- Loading states for all async actions
- Consistent with existing style guide in `/mockup-design/style-guide.html`

This brief provides everything needed to create a comprehensive StarqueZZ mockup that demonstrates the full user experience for both children and parents.

