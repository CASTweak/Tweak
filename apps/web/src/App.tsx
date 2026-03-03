import { useState } from "react";
import { Shield, EyeOff, Focus, Terminal } from "lucide-react";
import { useTweakData, postToTweak } from "./bridge";
import { TimerRing } from "./components/timer-ring";
import { TimerControls } from "./components/timer-controls";
import { FeatureCard } from "./components/feature-card";

const codes = [
  { code: "9653", label: "Open this panel" },
  { code: "00XX", label: "Set timer to XX minutes" },
];

export default function App() {
  const data = useTweakData();
  const [pendingMinutes, setPendingMinutes] = useState<number | null>(
    data.timerTargetSeconds > 0
      ? Math.round(data.timerTargetSeconds / 60)
      : null
  );

  function handleSetTimer(minutes: number) {
    postToTweak("setTimer", { minutes });
    setPendingMinutes(minutes);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center px-6 py-10">
      {/* ── Header ──────────────────────────── */}
      <header
        className="flex w-full max-w-2xl items-center justify-between animate-fade-up"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 border border-emerald-400/20">
            <Terminal size={14} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight text-zinc-100">
              CASTweak
            </h1>
            <p className="text-[10px] font-medium tracking-wider text-zinc-600 uppercase">
              v0.0.1
            </p>
          </div>
        </div>
        <button
          onClick={() => postToTweak("close")}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-500 transition-colors hover:text-zinc-300 hover:bg-white/[0.08] active:scale-95"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 1L11 11M11 1L1 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {/* Divider */}
      <div
        className="mt-6 mb-8 w-full max-w-2xl h-px animate-fade-up"
        style={{
          animationDelay: "60ms",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 50%, transparent)",
        }}
      />

      {/* ── Timer Section ───────────────────── */}
      <section
        className="animate-fade-up"
        style={{ animationDelay: "100ms" }}
      >
        <TimerRing
          offsetSeconds={data.timerOffsetSeconds}
          pendingMinutes={pendingMinutes}
        />
      </section>

      <div className="mt-8">
        <TimerControls onSetTimer={handleSetTimer} />
      </div>

      {/* ── Features ────────────────────────── */}
      <section className="mt-10 w-full max-w-2xl">
        <p
          className="mb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-zinc-600 animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          Active Modules
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FeatureCard
            icon={Shield}
            title="Bypass"
            description="Fakes assessment session to bypass entitlement lock"
            delay={350}
          />
          <FeatureCard
            icon={EyeOff}
            title="Stealth"
            description="Suppresses all exam activity logging and alerts"
            delay={400}
          />
          <FeatureCard
            icon={Focus}
            title="Guard"
            description="Prevents lost-focus detection when switching apps"
            delay={450}
          />
        </div>
      </section>

      {/* ── Quick Reference ─────────────────── */}
      <section className="mt-8 w-full max-w-2xl">
        <div
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 animate-fade-up"
          style={{ animationDelay: "500ms" }}
        >
          <p className="mb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-zinc-600">
            Keypad Codes
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {codes.map((c) => (
              <div key={c.code} className="flex items-center gap-3">
                <code className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[12px] font-semibold text-emerald-300 font-[ui-monospace,'SF_Mono',SFMono-Regular,Menlo,monospace]">
                  {c.code}
                </code>
                <span className="text-[12px] text-zinc-500">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-10" />
    </div>
  );
}
