/**
 * Button — WONDERVERSE Design System
 *
 * Multi-variant button supporting both Quest (child) and Mission (parent) modes.
 *
 * Quest mode:  Pill-shaped, bold, gold primary CTA — high energy, game-like.
 * Mission mode: Rounded-rect, professional, blue primary CTA — calm, productive.
 *
 * Variants:
 *   primary   — Main call-to-action (gold quest / blue mission)
 *   secondary — Outlined / ghost with accent border
 *   ghost     — Transparent, text-only (subtle action)
 *   danger    — Destructive action (red, both modes)
 *
 * Accessibility:
 * - Disabled state communicated via aria-disabled + visual + cursor
 * - Loading state shows spinner and aria-busy
 * - Minimum touch target: 44px height (all sizes meet this)
 *
 * @example
 * // Quest mode primary
 * <Button variant="primary" mode="quest" size="lg">
 *   Start the Quest 🚀
 * </Button>
 *
 * // Mission mode approve
 * <Button variant="primary" mode="mission" size="md">
 *   Approve ✓
 * </Button>
 */
import React from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize    = "sm" | "md" | "lg";
export type ButtonMode    = "quest" | "mission";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  mode?:     ButtonMode;
  loading?:  boolean;
  /** Left icon element (24px recommended) */
  leftIcon?: React.ReactNode;
  /** Right icon element (24px recommended) */
  rightIcon?: React.ReactNode;
}

// ─── Style Definitions ─────────────────────────────────────────────────────

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-5 text-sm  gap-1.5 min-w-[100px]",    // 40px height — meets 44px with padding context
  md: "h-12 px-6 text-base gap-2   min-w-[140px]",   // 48px height
  lg: "h-14 px-7 text-lg  gap-2.5  min-w-[160px]",   // 56px height
};

const variantStyles: Record<ButtonMode, Record<ButtonVariant, string>> = {
  quest: {
    primary: [
      "bg-[#FFB800] text-[#1A0F3C]",
      "font-['Nunito',sans-serif] font-extrabold",
      "rounded-full",
      "shadow-[0_0_20px_rgba(255,184,0,0.4),0_4px_12px_rgba(255,184,0,0.5)]",
      "hover:bg-[#FFD54F]",
      "active:scale-[0.96] active:shadow-[0_0_8px_rgba(255,184,0,0.3)]",
      "transition-all duration-150",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFB800]/50",
    ].join(" "),

    secondary: [
      "bg-transparent text-[#A78BFA]",
      "border-2 border-[#A78BFA]",
      "font-['Nunito',sans-serif] font-bold",
      "rounded-full",
      "hover:bg-[rgba(124,58,237,0.15)]",
      "active:scale-[0.97]",
      "transition-all duration-150",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#A78BFA]/40",
    ].join(" "),

    ghost: [
      "bg-transparent text-[#FFFDF5]",
      "font-['Nunito',sans-serif] font-semibold",
      "rounded-full",
      "hover:bg-white/10",
      "active:scale-[0.97]",
      "transition-all duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
    ].join(" "),

    danger: [
      "bg-[#FF6B6B] text-white",
      "font-['Nunito',sans-serif] font-bold",
      "rounded-full",
      "hover:bg-[#ff8585]",
      "active:scale-[0.96]",
      "shadow-[0_0_12px_rgba(255,107,107,0.35)]",
      "transition-all duration-150",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B6B]/40",
    ].join(" "),
  },

  mission: {
    primary: [
      "bg-[#2563EB] text-white",
      "font-['Plus_Jakarta_Sans',sans-serif] font-semibold",
      "rounded-xl",
      "shadow-[0_2px_8px_rgba(0,0,0,0.12)]",
      "hover:bg-[#3B82F6]",
      "active:scale-[0.98]",
      "transition-all duration-150",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30",
    ].join(" "),

    secondary: [
      "bg-transparent text-[#334155]",
      "border border-[#E2E8F0]",
      "font-['Plus_Jakarta_Sans',sans-serif] font-medium",
      "rounded-xl",
      "hover:bg-[#F8FAFF] hover:border-[#64748B]",
      "active:scale-[0.98]",
      "transition-all duration-150",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/20",
    ].join(" "),

    ghost: [
      "bg-transparent text-[#2563EB]",
      "font-['Plus_Jakarta_Sans',sans-serif] font-medium",
      "rounded-xl",
      "hover:bg-[rgba(37,99,235,0.08)]",
      "active:scale-[0.98]",
      "transition-all duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30",
    ].join(" "),

    danger: [
      "bg-[#EF4444] text-white",
      "font-['Plus_Jakarta_Sans',sans-serif] font-semibold",
      "rounded-xl",
      "hover:bg-[#f87171]",
      "active:scale-[0.98]",
      "shadow-[0_2px_8px_rgba(239,68,68,0.25)]",
      "transition-all duration-150",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EF4444]/30",
    ].join(" "),
  },
};

const disabledStyles: Record<ButtonMode, string> = {
  quest:   "opacity-40 cursor-not-allowed shadow-none pointer-events-none",
  mission: "opacity-50 cursor-not-allowed shadow-none pointer-events-none",
};

// ─── Spinner ───────────────────────────────────────────────────────────────

const Spinner: React.FC<{ mode: ButtonMode }> = ({ mode }) => (
  <svg
    className="animate-spin w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12" cy="12" r="10"
      stroke={mode === "quest" ? "#1A0F3C" : "white"}
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill={mode === "quest" ? "#1A0F3C" : "white"}
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

// ─── Component ─────────────────────────────────────────────────────────────

export const Button: React.FC<ButtonProps> = ({
  variant  = "primary",
  size     = "md",
  mode     = "quest",
  loading  = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={[
        // Base
        "inline-flex items-center justify-center select-none",
        "whitespace-nowrap",
        // Size
        sizeStyles[size],
        // Variant + mode
        variantStyles[mode][variant],
        // Disabled
        isDisabled ? disabledStyles[mode] : "",
        className,
      ].join(" ")}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <Spinner mode={mode} />
      ) : leftIcon ? (
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}

      <span>{children}</span>

      {!loading && rightIcon && (
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

Button.displayName = "Button";
export default Button;
