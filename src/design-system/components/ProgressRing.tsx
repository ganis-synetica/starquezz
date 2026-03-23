/**
 * ProgressRing — WONDERVERSE Design System
 *
 * Circular SVG progress indicator for weekly streaks and goal tracking.
 * Uses `strokeDashoffset` animation for a smooth fill effect on mount.
 *
 * The ring animates from empty (circumference offset) to the target offset
 * when the component mounts or when `progress` changes.
 *
 * Center content: optional label text + star count display.
 *
 * Color palette follows quest mode (gold ring, deep space background).
 * Supports 0–1 progress value (e.g. 0.57 = 4 of 7 days complete).
 *
 * Accessibility:
 * - role="progressbar" with aria-valuenow / aria-valuemin / aria-valuemax
 * - Visual percentage shown as text alternative
 * - Respects prefers-reduced-motion (animation skipped, static offset shown)
 *
 * @example
 * <ProgressRing
 *   progress={4/7}
 *   size={120}
 *   label="This week"
 *   starCount={12}
 * />
 */
import React, { useEffect, useRef, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ProgressRingProps {
  /**
   * Progress from 0 (empty) to 1 (full).
   * Values outside [0,1] are clamped.
   */
  progress: number;
  /** Outer diameter of the ring in pixels (default: 120) */
  size?: number;
  /** Label text shown below the percentage inside the ring */
  label?: string;
  /** Star count shown below the label (renders ⭐ N format) */
  starCount?: number;
  /** Stroke width of the ring track (default: 8) */
  strokeWidth?: number;
  /** Color of the filled portion (default: Quest Gold) */
  fillColor?: string;
  /** Color of the empty track (default: Nebula Surface) */
  trackColor?: string;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Returns true if the user prefers reduced motion */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ─── Component ─────────────────────────────────────────────────────────────

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size        = 120,
  label,
  starCount,
  strokeWidth = 8,
  fillColor   = "#FFB800",  // Quest Gold
  trackColor  = "#2A1F5F",  // Nebula Surface
  className   = "",
}) => {
  const safeProgress    = clamp(progress, 0, 1);
  const radius          = (size - strokeWidth) / 2;
  const circumference   = 2 * Math.PI * radius;
  const targetOffset    = circumference * (1 - safeProgress);

  // Animate offset from full (empty ring) → target on mount
  const [offset, setOffset] = useState<number>(
    prefersReducedMotion() ? targetOffset : circumference
  );
  const prevProgressRef = useRef(safeProgress);
  const animFrameRef    = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setOffset(targetOffset);
      return;
    }

    const startTime    = performance.now();
    const startOffset  = prevProgressRef.current === safeProgress ? circumference : offset;
    const duration     = 600; // ms — matches --duration-expressive
    const ease         = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic

    const animate = (now: number) => {
      const elapsed  = now - startTime;
      const fraction = Math.min(elapsed / duration, 1);
      const current  = startOffset + (targetOffset - startOffset) * ease(fraction);
      setOffset(current);

      if (fraction < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        prevProgressRef.current = safeProgress;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeProgress, circumference, targetOffset]);

  const percentage = Math.round(safeProgress * 100);
  const cx = size / 2;
  const cy = size / 2;

  // Font sizes scaled to ring size
  const percentFontSize = Math.round(size * 0.22);
  const labelFontSize   = Math.round(size * 0.1);
  const starFontSize    = Math.round(size * 0.12);

  return (
    <div
      className={["inline-flex flex-col items-center gap-2", className].join(" ")}
    >
      {/* SVG Ring */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label ? label + ": " : ""}${percentage}% complete${starCount !== undefined ? `, ${starCount} stars` : ""}`}
      >
        {/* Glow filter */}
        <defs>
          <filter id={`ring-glow-${size}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track (empty ring) */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter={`url(#ring-glow-${size})`}
          style={{ transition: prefersReducedMotion() ? "none" : undefined }}
        />

        {/* Center: percentage */}
        <text
          x={cx}
          y={cy - (label || starCount !== undefined ? labelFontSize * 0.8 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#FFFDF5"
          fontSize={percentFontSize}
          fontFamily="Nunito, ui-rounded, sans-serif"
          fontWeight="900"
        >
          {percentage}%
        </text>

        {/* Center: label */}
        {label && (
          <text
            x={cx}
            y={cy + percentFontSize * 0.55}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#6B5B8E"
            fontSize={labelFontSize}
            fontFamily="Nunito, ui-rounded, sans-serif"
            fontWeight="600"
          >
            {label}
          </text>
        )}

        {/* Center: star count */}
        {starCount !== undefined && (
          <text
            x={cx}
            y={cy + percentFontSize * 0.55 + (label ? labelFontSize * 1.4 : 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFB800"
            fontSize={starFontSize}
            fontFamily="Nunito, ui-rounded, sans-serif"
            fontWeight="800"
          >
            ⭐ {starCount}
          </text>
        )}
      </svg>
    </div>
  );
};

ProgressRing.displayName = "ProgressRing";
export default ProgressRing;
