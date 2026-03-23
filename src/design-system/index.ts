/**
 * WONDERVERSE Design System — Root Export
 * Margaery 🎨 | Synetica Design Ops | StarqueZZ Phase 2
 *
 * Usage:
 *   import { Button, QuestCard, StarBadge, colors } from '@/design-system';
 *
 * CSS must be imported separately at the app root:
 *   import '@/design-system/tokens.css';
 */

// Components
export * from "./components";

// Token constants (for runtime use)
export {
  colors,
  fontFamily,
  fontWeight,
  fontSize,
  spacing,
  borderRadius,
  boxShadow,
  keyframes,
  animation,
  v3Config,
} from "./tailwind.tokens";

export type { ColorToken, SpacingToken, RadiusToken, ShadowToken } from "./tailwind.tokens";
