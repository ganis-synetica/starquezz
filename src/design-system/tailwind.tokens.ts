/**
 * WONDERVERSE Design System — Tailwind v3/v4 Token Config
 * Margaery 🎨 | Synetica Design Ops | StarqueZZ Phase 2
 *
 * NOTE: This project uses Tailwind v4 (CSS-first, no tailwind.config.js).
 * This file exports typed token constants that can be consumed by:
 *   - tailwind.theme.css (via @theme block)  — PRIMARY integration
 *   - tokens.css (CSS custom properties)
 *   - Any JS/TS component that needs raw token values
 *
 * For Tailwind v3 projects, use the `v3Config` export as your
 * `theme.extend` object inside tailwind.config.ts.
 */

// ─────────────────────────────────────────────
// COLOR TOKENS
// ─────────────────────────────────────────────

export const colors = {
  // ── Child UI: Quest Mode ──────────────────
  quest: {
    "deep-space":           "#1A0F3C",
    "midnight-cosmos":      "#0F0A24",
    "nebula-surface":       "#2A1F5F",
    "gold":                 "#FFB800",
    "gold-light":           "#FFD54F",
    "nebula-violet":        "#7C3AED",
    "nebula-violet-light":  "#A78BFA",
    "cosmic-coral":         "#FF6B6B",
    "aurora-mint":          "#4ADE80",
    "moonbeam":             "#F5F0FF",
    "star-white":           "#FFFDF5",
    "stardust":             "#6B5B8E",
    "cosmic-teal":          "#22D3EE",
  },

  // ── Parent UI: Mission Control ────────────
  mission: {
    "command-navy":         "#1E3A5F",
    "horizon-blue":         "#2563EB",
    "horizon-blue-light":   "#3B82F6",
    "cloud-white":          "#F8FAFF",
    "surface-white":        "#FFFFFF",
    "border-gray":          "#E2E8F0",
    "slate-text":           "#334155",
    "muted-text":           "#64748B",
    "placeholder":          "#94A3B8",
    "success":              "#22C55E",
    "alert-red":            "#EF4444",
    "gold-amber":           "#F59E0B",
    "streak-orange":        "#F97316",
  },

  // ── Shared Semantic ───────────────────────
  semantic: {
    "star":                 "#FFB800",
    "pending":              "#F59E0B",
    "success-child":        "#4ADE80",
    "success-parent":       "#22C55E",
    "locked-child":         "#6B5B8E",
    "locked-parent":        "#94A3B8",
    "error-child":          "#FF6B6B",
    "error-parent":         "#EF4444",
  },
} as const;

// ─────────────────────────────────────────────
// TYPOGRAPHY TOKENS
// ─────────────────────────────────────────────

export const fontFamily = {
  quest:   ["Nunito", "ui-rounded", "system-ui", "sans-serif"],
  mission: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
  mono:    ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
} as const;

export const fontWeight = {
  regular:    "400",
  medium:     "500",
  semibold:   "600",
  bold:       "700",
  extrabold:  "800",
  black:      "900",
} as const;

/** [size, { lineHeight }] — Tailwind v3 fontSize format */
export const fontSize = {
  // Child UI scale (Nunito)
  "display-xl":   ["48px", { lineHeight: "1.1",  fontWeight: "900" }],
  "display":      ["36px", { lineHeight: "1.15", fontWeight: "900" }],
  "heading-1":    ["28px", { lineHeight: "1.2",  fontWeight: "800" }],
  "heading-2":    ["22px", { lineHeight: "1.25", fontWeight: "800" }],
  "heading-3":    ["18px", { lineHeight: "1.3",  fontWeight: "700" }],
  "body-lg":      ["16px", { lineHeight: "1.5",  fontWeight: "600" }],
  "body":         ["14px", { lineHeight: "1.5",  fontWeight: "600" }],
  "caption":      ["12px", { lineHeight: "1.4",  fontWeight: "500" }],

  // Parent UI scale (Plus Jakarta Sans)
  "p-display":    ["28px", { lineHeight: "1.2",  fontWeight: "700" }],
  "p-heading-1":  ["22px", { lineHeight: "1.25", fontWeight: "700" }],
  "p-heading-2":  ["18px", { lineHeight: "1.3",  fontWeight: "600" }],
  "p-heading-3":  ["16px", { lineHeight: "1.35", fontWeight: "600" }],
  "p-body-lg":    ["16px", { lineHeight: "1.6",  fontWeight: "400" }],
  "p-body":       ["14px", { lineHeight: "1.6",  fontWeight: "400" }],
  "p-small":      ["12px", { lineHeight: "1.5",  fontWeight: "400" }],
  "p-label":      ["11px", { lineHeight: "1.4",  fontWeight: "500" }],
} as const;

// ─────────────────────────────────────────────
// SPACING TOKENS (8px base grid)
// ─────────────────────────────────────────────

export const spacing = {
  "xs":  "4px",
  "sm":  "8px",
  "md":  "16px",
  "lg":  "24px",
  "xl":  "32px",
  "2xl": "48px",
  "3xl": "64px",
} as const;

// ─────────────────────────────────────────────
// BORDER RADIUS TOKENS
// ─────────────────────────────────────────────

export const borderRadius = {
  "pill":    "9999px",
  "card":    "16px",
  "card-lg": "20px",
  "soft":    "12px",
  "subtle":  "8px",
  "circle":  "50%",
} as const;

// ─────────────────────────────────────────────
// BOX SHADOW TOKENS
// ─────────────────────────────────────────────

export const boxShadow = {
  "none":        "none",
  "xs":          "0 1px 3px rgba(0,0,0,0.08)",
  "sm":          "0 2px 8px rgba(0,0,0,0.12)",
  "md":          "0 4px 16px rgba(0,0,0,0.16)",
  "lg":          "0 8px 32px rgba(0,0,0,0.24)",
  "glow-gold":   "0 0 20px rgba(255,184,0,0.4), 0 4px 12px rgba(255,184,0,0.5)",
  "glow-violet": "0 0 16px rgba(124,58,237,0.35)",
  "glow-mint":   "0 0 12px rgba(74,222,128,0.35)",
  "glow-coral":  "0 0 12px rgba(255,107,107,0.35)",
} as const;

// ─────────────────────────────────────────────
// ANIMATION KEYFRAMES
// ─────────────────────────────────────────────

export const keyframes = {
  // Star earn: float upward from source to counter
  "star-earn": {
    "0%":   { transform: "translate(0, 0) scale(1)", opacity: "1" },
    "60%":  { transform: "translate(-10px, -60px) scale(1.3)", opacity: "1" },
    "100%": { transform: "translate(-20px, -120px) scale(0.6)", opacity: "0" },
  },

  // Counter receives star: scale bounce
  "star-receive": {
    "0%":   { transform: "scale(1) rotate(0deg)" },
    "30%":  { transform: "scale(1.35) rotate(15deg)" },
    "60%":  { transform: "scale(0.95) rotate(-5deg)" },
    "100%": { transform: "scale(1) rotate(0deg)" },
  },

  // Generic spring bounce
  "bounce-spring": {
    "0%":   { transform: "scale(0.96)" },
    "40%":  { transform: "scale(1.06)" },
    "70%":  { transform: "scale(0.99)" },
    "100%": { transform: "scale(1)" },
  },

  // Float: gentle idle hover
  "float": {
    "0%":   { transform: "translateY(0)" },
    "50%":  { transform: "translateY(-6px)" },
    "100%": { transform: "translateY(0)" },
  },

  // Sparkle: opacity pop for star glow ring
  "sparkle": {
    "0%":   { transform: "scale(0.8)", opacity: "0" },
    "50%":  { transform: "scale(1.2)", opacity: "1" },
    "100%": { transform: "scale(1)",   opacity: "0" },
  },

  // PIN error shake
  "shake": {
    "0%":   { transform: "translateX(0)" },
    "15%":  { transform: "translateX(-8px)" },
    "30%":  { transform: "translateX(8px)" },
    "45%":  { transform: "translateX(-8px)" },
    "60%":  { transform: "translateX(8px)" },
    "75%":  { transform: "translateX(-4px)" },
    "90%":  { transform: "translateX(4px)" },
    "100%": { transform: "translateX(0)" },
  },

  // Pulse glow: star counter idle reminder
  "pulse-glow": {
    "0%":   { boxShadow: "0 0 8px rgba(255,184,0,0.2)" },
    "50%":  { boxShadow: "0 0 24px rgba(255,184,0,0.6)" },
    "100%": { boxShadow: "0 0 8px rgba(255,184,0,0.2)" },
  },

  // Progress ring fill (used via CSS custom property offset)
  "ring-fill": {
    "0%":   { strokeDashoffset: "var(--ring-circumference)" },
    "100%": { strokeDashoffset: "var(--ring-offset)" },
  },

  // Star burst particle (short lived, exits outward)
  "burst": {
    "0%":   { transform: "translate(0,0) scale(1)", opacity: "1" },
    "100%": { transform: "var(--burst-translate) scale(0)", opacity: "0" },
  },

  // Locked task teaser wobble
  "wobble": {
    "0%":   { transform: "rotate(0deg)" },
    "15%":  { transform: "rotate(-8deg)" },
    "30%":  { transform: "rotate(8deg)" },
    "45%":  { transform: "rotate(-4deg)" },
    "60%":  { transform: "rotate(4deg)" },
    "100%": { transform: "rotate(0deg)" },
  },
} as const;

export const animation = {
  "star-earn":    "star-earn 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
  "star-receive": "star-receive 350ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
  "bounce-spring":"bounce-spring 350ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
  "float":        "float 3s ease-in-out infinite",
  "sparkle":      "sparkle 600ms ease-out forwards",
  "shake":        "shake 500ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
  "pulse-glow":   "pulse-glow 8s ease-in-out infinite",
  "ring-fill":    "ring-fill 600ms cubic-bezier(0.4, 0, 0.2, 1) both",
  "burst":        "burst 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
  "wobble":       "wobble 600ms ease-in-out both",
} as const;

// ─────────────────────────────────────────────
// TAILWIND v3 COMPATIBLE EXPORT
// (use as theme.extend in tailwind.config.ts)
// ─────────────────────────────────────────────

export const v3Config = {
  colors: {
    quest:   colors.quest,
    mission: colors.mission,
    sem:     colors.semantic,
  },
  fontFamily,
  fontWeight,
  fontSize,
  spacing: {
    ...spacing,
    // Merge with Tailwind defaults using spread (add default values as needed)
  },
  borderRadius,
  boxShadow,
  keyframes,
  animation,
} as const;

export type ColorToken =
  | `quest-${keyof typeof colors.quest}`
  | `mission-${keyof typeof colors.mission}`
  | `sem-${keyof typeof colors.semantic}`;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken  = keyof typeof borderRadius;
export type ShadowToken  = keyof typeof boxShadow;
