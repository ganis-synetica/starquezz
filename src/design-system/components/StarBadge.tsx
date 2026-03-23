/**
 * StarBadge — WONDERVERSE Design System
 *
 * Displays the child's star count with an animated glow effect.
 * This is the primary currency display component for quest mode.
 *
 * Styling: Deep-space pill with Quest Gold star icon + Nunito black counter.
 * The "animated" prop triggers a receive-bounce + pulse-glow cycle, intended
 * to fire when the count increments (parent should toggle `animated` on change
 * then remove it after the animation ends via onAnimationEnd or a timeout).
 *
 * @example
 * <StarBadge count={12} size="md" animated={justEarned} />
 */
import React from "react";

// ─── Prop Types ────────────────────────────────────────────────────────────

export type StarBadgeSize = "sm" | "md" | "lg";

export interface StarBadgeProps {
  /** Number of stars to display */
  count: number;
  /** Visual size variant */
  size?: StarBadgeSize;
  /**
   * When true, plays the star-receive bounce animation.
   * Toggle this on after count increments; component calls
   * onAnimationEnd automatically to signal when done.
   */
  animated?: boolean;
  /** Called when the bounce animation finishes */
  onAnimationEnd?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ─── Size Maps ─────────────────────────────────────────────────────────────

const sizeMap: Record<StarBadgeSize, {
  container: string;
  icon: string;
  text: string;
  padding: string;
}> = {
  sm: {
    container: "h-7 gap-1",
    icon:      "text-base leading-none",   // ~16px
    text:      "text-sm font-black",       // 14px Nunito 900
    padding:   "px-2.5",
  },
  md: {
    container: "h-9 gap-1.5",
    icon:      "text-xl leading-none",     // ~20px
    text:      "text-lg font-black",       // 18px Nunito 900
    padding:   "px-3",
  },
  lg: {
    container: "h-11 gap-2",
    icon:      "text-2xl leading-none",    // 24px
    text:      "text-2xl font-black",      // 24px Nunito 900
    padding:   "px-4",
  },
};

// ─── Component ─────────────────────────────────────────────────────────────

export const StarBadge: React.FC<StarBadgeProps> = ({
  count,
  size = "md",
  animated = false,
  onAnimationEnd,
  className = "",
}) => {
  const s = sizeMap[size];

  return (
    <div
      className={[
        // Layout
        "inline-flex items-center rounded-full",
        s.container,
        s.padding,
        // Background + border
        "bg-[#2A1F5F]",
        // Glow effect (always present, pulse when animated)
        animated
          ? "shadow-[0_0_20px_rgba(255,184,0,0.4),0_4px_12px_rgba(255,184,0,0.5)] animate-[star-receive_350ms_cubic-bezier(0.34,1.56,0.64,1)_both]"
          : "shadow-[0_0_8px_rgba(255,184,0,0.2)]",
        // Transition for hover
        "transition-shadow duration-200",
        className,
      ].join(" ")}
      onAnimationEnd={onAnimationEnd}
      role="status"
      aria-label={`${count} star${count !== 1 ? "s" : ""}`}
    >
      {/* Star icon — inline SVG for crisp rendering at all sizes */}
      <span
        className={[s.icon, animated ? "animate-[star-receive_350ms_cubic-bezier(0.34,1.56,0.64,1)_both]" : ""].join(" ")}
        aria-hidden="true"
      >
        ⭐
      </span>

      {/* Count display */}
      <span
        className={[
          s.text,
          "font-['Nunito','ui-rounded',sans-serif]",
          "text-[#FFB800]", // Quest Gold
          "tabular-nums",
          "leading-none",
        ].join(" ")}
      >
        {count.toLocaleString()}
      </span>
    </div>
  );
};

StarBadge.displayName = "StarBadge";
export default StarBadge;
