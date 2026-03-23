/**
 * POC — Wonderverse Design System Showcase
 * Self-contained, no Supabase, mock data only.
 */
import React from "react";
import {
  StarBadge,
  QuestCard,
  Button,
  PINPad,
  ProgressRing,
} from "./design-system";

// ── Section IDs for sticky nav ──────────────────────────────────────────────
const SECTIONS = [
  { id: "quest", label: "Child UI" },
  { id: "mission", label: "Parent UI" },
  { id: "pin", label: "PIN Pad" },
] as const;

// ── Sticky Nav ──────────────────────────────────────────────────────────────
const Nav: React.FC = () => (
  <nav className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-6 py-2.5 backdrop-blur-md bg-[#0F0A24]/80 border-b border-white/10">
    <span className="font-['Nunito',sans-serif] font-black text-xs sm:text-sm text-[#FFB800] truncate mr-2">
      Wonderverse — by Margaery
    </span>
    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold font-['Nunito',sans-serif] text-[#FFFDF5]/80 hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          {label}
        </a>
      ))}
    </div>
  </nav>
);

// ── Section 1: Child UI (Quest Mode) ────────────────────────────────────────
const QuestSection: React.FC = () => (
  <section
    id="quest"
    data-mode="quest"
    className="px-4 py-12 starfield"
    style={{ background: "linear-gradient(180deg, #1A0F3C 0%, #0F0A24 60%, #1A1040 100%)" }}
  >
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-['Nunito',sans-serif] font-black text-[28px] text-[#FFFDF5]">
          Zen's Quest Board
        </h1>
        <StarBadge count={12} size="md" />
      </div>

      {/* Quest Cards — stack on mobile, 2-col on wider screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuestCard
          title="Brush Teeth"
          description="Morning and night!"
          stars={2}
          status="complete"
          isCore={true}
          icon="🦷"
        />
        <QuestCard
          title="Make Bed"
          description="Tuck in those corners!"
          stars={1}
          status="pending"
          isCore={true}
          icon="🛏️"
          onComplete={() => console.log("Make Bed completed!")}
        />
        <QuestCard
          title="Read 10 Pages"
          description="Any book you like"
          stars={3}
          status="locked"
          isCore={false}
          icon="📚"
          className="sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full"
        />
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center">
        <ProgressRing
          progress={5 / 7}
          size={140}
          label="This week"
          starCount={12}
        />
      </div>

      {/* Button Row */}
      <div className="flex gap-2 sm:gap-3 justify-center">
        <Button variant="primary" mode="quest" size="md" className="!min-w-0 !px-5">
          Claim Stars!
        </Button>
        <Button variant="secondary" mode="quest" size="md" className="!min-w-0 !px-5">
          View Rewards
        </Button>
        <Button variant="ghost" mode="quest" size="md" className="!min-w-0 !px-5">
          Settings
        </Button>
      </div>
    </div>
  </section>
);

// ── Section 2: Parent UI (Mission Mode) ─────────────────────────────────────
const StatCard: React.FC<{ value: string; label: string; icon: string }> = ({
  value,
  label,
  icon,
}) => (
  <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex flex-col items-center gap-1">
    <span className="text-2xl">{icon}</span>
    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xl text-[#334155]">
      {value}
    </span>
    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-xs text-[#64748B]">
      {label}
    </span>
  </div>
);

const MissionSection: React.FC = () => (
  <section
    id="mission"
    data-mode="mission"
    className="px-4 py-12"
    style={{ backgroundColor: "#F8FAFF" }}
  >
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* Section label */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#E2E8F0]" />
        <span className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-xs uppercase tracking-widest text-[#64748B]">Parent UI</span>
        <div className="h-px flex-1 bg-[#E2E8F0]" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[28px] text-[#1E3A5F]">
          Mission Control
        </h1>
        <div className="rounded-full bg-[#1E3A5F] px-0.5">
          <StarBadge count={23} size="sm" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard value="14" label="Tasks Done" icon="✅" />
        <StatCard value="23" label="Stars Earned" icon="⭐" />
        <StatCard value="5" label="Day Streak" icon="🔥" />
      </div>

      {/* Button Row */}
      <div className="flex gap-2 sm:gap-3 justify-center">
        <Button variant="primary" mode="mission" size="sm" className="!min-w-0 !px-4">
          Approve All
        </Button>
        <Button variant="secondary" mode="mission" size="sm" className="!min-w-0 !px-4">
          View Report
        </Button>
        <Button variant="danger" mode="mission" size="sm" className="!min-w-0 !px-4">
          Reset Week
        </Button>
      </div>
    </div>
  </section>
);

// ── Section 3: PIN Pad ──────────────────────────────────────────────────────
const PINSection: React.FC = () => (
  <section
    id="pin"
    data-mode="quest"
    className="px-4 py-12 pb-8"
    style={{ background: "linear-gradient(180deg, #1A0F3C 0%, #0F0A24 60%, #1A1040 100%)" }}
  >
    <div className="max-w-sm mx-auto h-[640px]">
      <PINPad
        childName="Zia"
        onComplete={(pin) => console.log("PIN entered:", pin)}
      />
    </div>
    {/* Footer */}
    <p className="text-center mt-8 font-['Nunito',sans-serif] font-semibold text-xs text-[#6B5B8E]">
      Wonderverse Design System v0.1 — StarqueZZ POC
    </p>
  </section>
);

// ── Main POC Component ──────────────────────────────────────────────────────
export const POC: React.FC = () => (
  <div className="min-h-screen">
    <Nav />
    <QuestSection />
    <MissionSection />
    <PINSection />
  </div>
);

export default POC;
