/**
 * PINPad — WONDERVERSE Design System
 *
 * Full-screen PIN entry keypad for child login.
 * Pure UI component — handles its own local digit state and calls
 * `onComplete(pin)` when the required number of digits is entered.
 *
 * Features:
 * - Large 72×72px circular number keys (exceeds 44px minimum)
 * - Dot indicators that fill gold as digits are entered
 * - Animated error shake (set `error` prop, clear after ~700ms)
 * - Success state (green dots) before calling onComplete
 * - Backspace key clears last digit
 * - Child avatar + name displayed above keypad for personalization
 * - Fully keyboard accessible (Enter = confirm when length met)
 *
 * Accessibility:
 * - Each button has descriptive aria-label
 * - Error state announced via aria-live="assertive"
 * - Dot indicators use aria-label for screen readers
 *
 * @example
 * <PINPad
 *   childName="Zen"
 *   avatarUrl="/avatars/zen.png"
 *   length={4}
 *   onComplete={(pin) => handleLogin(pin)}
 *   error={loginFailed}
 *   onErrorDismiss={() => setLoginFailed(false)}
 * />
 */
import React, { useState, useEffect, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PINPadProps {
  /** Number of digits required (default: 4) */
  length?: number;
  /** Called with the complete PIN string when all digits entered */
  onComplete: (pin: string) => void;
  /** Child's display name shown above the keypad */
  childName: string;
  /** Child's avatar URL — shown as 96px circle. Falls back to emoji initials. */
  avatarUrl?: string;
  /**
   * Set to true to trigger the error shake + red dot animation.
   * Parent should set this to false after ~700ms to allow retry.
   */
  error?: boolean;
  /** Called after error animation ends (use to clear error state) */
  onErrorDismiss?: () => void;
  /** Custom prompt text (default: "Enter your secret code! 🔐") */
  prompt?: string;
}

// ─── Dot Indicator ──────────────────────────────────────────────────────────

interface DotProps {
  filled:  boolean;
  error:   boolean;
  success: boolean;
  index:   number;
}

const Dot: React.FC<DotProps> = ({ filled, error, success, index }) => {
  const bgClass =
    error   ? "bg-[#FF6B6B] shadow-[0_0_12px_rgba(255,107,107,0.5)]" :
    success ? "bg-[#4ADE80] shadow-[0_0_12px_rgba(74,222,128,0.5)] scale-110" :
    filled  ? "bg-[#FFB800] border-[#FFB800] shadow-[0_0_12px_rgba(255,184,0,0.5)]" :
              "bg-transparent border-2 border-[#6B5B8E]";

  return (
    <div
      className={[
        "w-6 h-6 rounded-full transition-all duration-200",
        bgClass,
        error ? "animate-[shake_500ms_cubic-bezier(0.36,0.07,0.19,0.97)_both]" : "",
      ].join(" ")}
      style={{ animationDelay: `${index * 50}ms` }}
      aria-hidden="true"
    />
  );
};

// ─── Key Button ─────────────────────────────────────────────────────────────

interface KeyButtonProps {
  label:    string;
  subLabel?: string;
  onPress:  () => void;
  disabled?: boolean;
  variant?: "number" | "action";
}

const KeyButton: React.FC<KeyButtonProps> = ({ label, subLabel, onPress, disabled, variant = "number" }) => (
  <button
    type="button"
    className={[
      // Sizing — 72×72px (exceeds 44px minimum)
      "w-[72px] h-[72px] rounded-full",
      "flex flex-col items-center justify-center",
      "select-none touch-manipulation",
      // Background + text
      variant === "number"
        ? "bg-[#2A1F5F] text-[#FFFDF5] shadow-[0_4px_16px_rgba(0,0,0,0.16)]"
        : "bg-transparent text-[#A78BFA]",
      // Typography
      "font-['Nunito',sans-serif] font-black text-2xl",
      // Press state
      "active:bg-[#FFB800] active:text-[#1A0F3C] active:scale-[0.94]",
      "transition-all duration-100",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFB800]/50",
      disabled ? "opacity-40 pointer-events-none" : "",
    ].join(" ")}
    onClick={onPress}
    disabled={disabled}
    aria-label={label === "⌫" ? "Delete last digit" : label === "✓" ? "Confirm PIN" : `${label}`}
  >
    <span>{label}</span>
    {subLabel && (
      <span className="text-[8px] font-medium tracking-widest text-[#6B5B8E] leading-none mt-0.5">
        {subLabel}
      </span>
    )}
  </button>
);

// ─── Keypad Layout ──────────────────────────────────────────────────────────
// Standard phone layout: 1-2-3 / 4-5-6 / 7-8-9 / DEL-0-OK

const KEYS: Array<{ label: string; value: string; sub?: string }> = [
  { label: "1", value: "1", sub: "···" },
  { label: "2", value: "2", sub: "ABC" },
  { label: "3", value: "3", sub: "DEF" },
  { label: "4", value: "4", sub: "GHI" },
  { label: "5", value: "5", sub: "JKL" },
  { label: "6", value: "6", sub: "MNO" },
  { label: "7", value: "7", sub: "PQRS" },
  { label: "8", value: "8", sub: "TUV" },
  { label: "9", value: "9", sub: "WXYZ" },
  { label: "⌫", value: "backspace" },
  { label: "0", value: "0" },
  { label: "✓", value: "confirm" },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const PINPad: React.FC<PINPadProps> = ({
  length   = 4,
  onComplete,
  childName,
  avatarUrl,
  error    = false,
  onErrorDismiss,
  prompt   = "Enter your secret code! 🔐",
}) => {
  const [digits,  setDigits]  = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // Reset digits when error clears
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => {
        setDigits([]);
        onErrorDismiss?.();
      }, 700);
      return () => clearTimeout(t);
    }
  }, [error, onErrorDismiss]);

  const handleKey = useCallback((value: string) => {
    if (error || success) return;

    if (value === "backspace") {
      setDigits((d) => d.slice(0, -1));
      return;
    }

    if (value === "confirm") {
      if (digits.length === length) {
        setSuccess(true);
        setTimeout(() => {
          onComplete(digits.join(""));
          // Reset for potential re-entry
          setDigits([]);
          setSuccess(false);
        }, 400);
      }
      return;
    }

    if (digits.length < length) {
      const next = [...digits, value];
      setDigits(next);
      // Auto-submit when full (no confirm needed for quick PIN)
      if (next.length === length) {
        setSuccess(true);
        setTimeout(() => {
          onComplete(next.join(""));
          setDigits([]);
          setSuccess(false);
        }, 400);
      }
    }
  }, [digits, length, error, success, onComplete]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key))       handleKey(e.key);
      else if (e.key === "Backspace") handleKey("backspace");
      else if (e.key === "Enter")    handleKey("confirm");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const isComplete = digits.length === length;
  const initials   = childName.charAt(0).toUpperCase();

  return (
    <div
      className="flex flex-col items-center justify-between h-full py-8 px-4"
      data-mode="quest"
    >
      {/* Avatar + Name + Prompt */}
      <div className="flex flex-col items-center gap-3">
        {/* Avatar */}
        <div
          className={[
            "w-24 h-24 rounded-full flex items-center justify-center",
            "bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]",
            "text-4xl overflow-hidden",
            "shadow-[0_0_16px_rgba(124,58,237,0.35)]",
          ].join(" ")}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${childName}'s avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-['Nunito',sans-serif] font-black text-white text-3xl">
              {initials}
            </span>
          )}
        </div>

        {/* Name */}
        <h1 className="font-['Nunito',sans-serif] font-black text-[28px] text-[#FFFDF5] leading-tight">
          {childName}
        </h1>

        {/* Prompt */}
        <p className="font-['Nunito',sans-serif] font-semibold text-sm text-[#FFFDF5]/75 text-center">
          {prompt}
        </p>
      </div>

      {/* PIN Dots */}
      <div
        className="flex items-center gap-5"
        role="status"
        aria-label={`${digits.length} of ${length} digits entered`}
        aria-live="polite"
      >
        {Array.from({ length }).map((_, i) => (
          <Dot
            key={i}
            index={i}
            filled={i < digits.length}
            error={error && i < digits.length}
            success={success && i < digits.length}
          />
        ))}
      </div>

      {/* Error message */}
      <div aria-live="assertive" aria-atomic="true" className="h-5">
        {error && (
          <p className="font-['Nunito',sans-serif] font-bold text-sm text-[#FF6B6B] text-center">
            Hmm, that&apos;s not it! Try again 🤫
          </p>
        )}
      </div>

      {/* Keypad */}
      <div
        className="grid grid-cols-3 gap-3 w-full max-w-[264px]"
        aria-label="PIN keypad"
      >
        {KEYS.map(({ label, value, sub }) => (
          <div key={value} className="flex items-center justify-center">
            <KeyButton
              label={label}
              subLabel={sub}
              onPress={() => handleKey(value)}
              disabled={
                error ||
                (value === "confirm" && !isComplete) ||
                (value !== "backspace" && value !== "confirm" && digits.length >= length)
              }
              variant={label === "⌫" || label === "✓" ? "action" : "number"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

PINPad.displayName = "PINPad";
export default PINPad;
