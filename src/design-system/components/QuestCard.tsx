/**
 * QuestCard — WONDERVERSE Design System
 *
 * The primary task card for the child's daily quest list.
 * Handles three visual states (pending, complete, locked) and two
 * quest types (core/must-do vs extra/bonus).
 *
 * Accessibility:
 * - Minimum tap area: 44px height (actual min ~80px)
 * - Status communicated via color + icon + ARIA label
 * - Lock state uses aria-disabled
 *
 * Layout: Horizontal — left color-accent strip → icon blob → content → right action
 *
 * @example
 * <QuestCard
 *   title="Brush your teeth"
 *   description="Morning and night! 🦷"
 *   stars={2}
 *   status="pending"
 *   isCore={true}
 *   onComplete={() => handleComplete(id)}
 * />
 */
import React from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

export type QuestStatus = "pending" | "complete" | "locked";

export interface QuestCardProps {
  /** Quest display name */
  title: string;
  /** Short description shown below the title */
  description?: string;
  /** Star value awarded for this quest */
  stars: number;
  /** Current status of this quest */
  status?: QuestStatus;
  /**
   * Core quests are "Must-Do" (Quest Gold accent).
   * Extra quests are bonus (Nebula Violet accent).
   */
  isCore?: boolean;
  /** Emoji or short string for the quest icon (e.g. "🦷", "📚") */
  icon?: string;
  /** Called when the complete tap-target is pressed (only in pending state) */
  onComplete?: () => void;
  /** Additional CSS classes for the outer container */
  className?: string;
}

// ─── Status Config ─────────────────────────────────────────────────────────

const statusConfig: Record<QuestStatus, {
  accentClass:  string;
  label:        string;
  labelColor:   string;
  icon:         string;
  actionIcon:   string;
  actionBg:     string;
  cardOpacity:  string;
}> = {
  pending: {
    accentClass: "", // set dynamically based on isCore
    label:       "Tap when done ✅",
    labelColor:  "text-[#6B5B8E]",           // Stardust
    icon:        "⭕",
    actionIcon:  "⭕",
    actionBg:    "bg-[#2A1F5F] border-2 border-[#6B5B8E]",
    cardOpacity: "opacity-100",
  },
  complete: {
    accentClass: "bg-[#4ADE80]",             // Aurora Mint
    label:       "⭐ Got it!",
    labelColor:  "text-[#4ADE80]",
    icon:        "✅",
    actionIcon:  "✅",
    actionBg:    "bg-[#4ADE80]",
    cardOpacity: "opacity-100",
  },
  locked: {
    accentClass: "bg-[#6B5B8E]",            // Stardust
    label:       "Finish your Must-Dos first! 🔒",
    labelColor:  "text-[#6B5B8E]",
    icon:        "🔒",
    actionIcon:  "🔒",
    actionBg:    "bg-[#2A1F5F] opacity-50",
    cardOpacity: "opacity-50",
  },
};

// ─── Component ─────────────────────────────────────────────────────────────

export const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  stars,
  status = "pending",
  isCore = true,
  icon = isCore ? "⚡" : "✨",
  onComplete,
  className = "",
}) => {
  const cfg = statusConfig[status];

  // Dynamic accent color: core = Quest Gold, extra = Nebula Violet
  // Overridden to Aurora Mint when complete, Stardust when locked
  const accentBg =
    status === "complete" ? "bg-[#4ADE80]" :
    status === "locked"   ? "bg-[#6B5B8E]" :
    isCore                ? "bg-[#FFB800]" : "bg-[#7C3AED]";

  const iconBg =
    status === "locked"   ? "bg-[#6B5B8E]" :
    isCore                ? "bg-[#FFB800]" : "bg-[#7C3AED]";

  const isInteractive = status === "pending";

  return (
    <div
      className={[
        // Card shell
        "relative flex items-center rounded-[20px] overflow-hidden",
        "bg-[#2A1F5F]",
        "shadow-[0_4px_16px_rgba(0,0,0,0.16)]",
        "min-h-[80px]",    // ensures tap area ≥ 44px vertically
        cfg.cardOpacity,
        "transition-all duration-200",
        className,
      ].join(" ")}
      role={isInteractive ? "button" : "article"}
      aria-label={`${title} — ${stars} star${stars !== 1 ? "s" : ""} — ${status}`}
      aria-disabled={status === "locked"}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onComplete : undefined}
      onKeyDown={isInteractive ? (e) => e.key === "Enter" && onComplete?.() : undefined}
    >
      {/* Left accent strip */}
      <div className={`absolute left-0 top-0 h-full w-1 ${accentBg}`} aria-hidden="true" />

      {/* Content wrapper — left padded past the accent strip */}
      <div className="flex items-center gap-3 w-full pl-4 pr-3 py-4">
        {/* Icon blob */}
        <div
          className={[
            "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
            "text-xl",
            iconBg,
            status === "locked" ? "opacity-60" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          {status === "locked" ? "🔒" : icon}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Quest type badge */}
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={[
                "inline-flex items-center px-2 py-0.5 rounded-full",
                "text-[11px] font-bold tracking-wide",
                "font-['Nunito',sans-serif]",
                isCore
                  ? "bg-[#FFB800] text-[#1A0F3C]"
                  : "bg-[#7C3AED] text-white",
              ].join(" ")}
            >
              {isCore ? "⚡ Must-Do" : "✨ Bonus"}
            </span>
          </div>

          {/* Title */}
          <p
            className={[
              "font-['Nunito',sans-serif] font-extrabold text-base",
              "text-[#FFFDF5] truncate",
            ].join(" ")}
          >
            {title}
          </p>

          {/* Description */}
          {description && (
            <p className="font-['Nunito',sans-serif] font-medium text-xs text-[#6B5B8E] mt-0.5 line-clamp-1">
              {description}
            </p>
          )}

          {/* Status label */}
          <p className={`font-['Nunito',sans-serif] font-medium text-xs mt-1 ${cfg.labelColor}`}>
            {cfg.label}
          </p>
        </div>

        {/* Right: star value + action */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {/* Star reward value */}
          <span
            className="font-['Nunito',sans-serif] font-black text-sm text-[#FFB800] whitespace-nowrap"
            aria-label={`${stars} star reward`}
          >
            ⭐ {stars}
          </span>

          {/* Action area (min 44x44px tap target) */}
          <div
            className={[
              "w-11 h-11 rounded-full flex items-center justify-center",
              "text-lg",
              cfg.actionBg,
              "transition-transform duration-100",
              isInteractive ? "active:scale-95 cursor-pointer" : "cursor-not-allowed",
            ].join(" ")}
            aria-hidden="true"
          >
            {status === "complete" ? "✅" : status === "locked" ? "🔒" : "⭕"}
          </div>
        </div>
      </div>
    </div>
  );
};

QuestCard.displayName = "QuestCard";
export default QuestCard;
