import { useState } from "react";
import { Shield, EyeOff, Focus } from "lucide-react";
import { useTweakData, postToTweak } from "./bridge";
import { OffsetDisplay } from "./components/timer-ring";
import { TimerControls } from "./components/timer-controls";
import { FeatureCard } from "./components/feature-card";
import { PasscodeSettings } from "./components/passcode-settings";

export default function App() {
  const data = useTweakData();
  const [pendingMinutes, setPendingMinutes] = useState<number | null>(
    data.timerTargetSeconds > 0
      ? Math.round(data.timerTargetSeconds / 60)
      : null
  );

  function handleSetTarget(minutes: number) {
    postToTweak("setTimer", { minutes });
    setPendingMinutes(minutes);
  }

  const codes = [
    { code: data.passcode, label: "Dieses Panel öffnen" },
    { code: "00XX", label: "Zielzeit auf XX Min setzen" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center px-5 py-8">
      {/* ── Header ──────────────────────────── */}
      <header
        className="flex w-full max-w-md items-center justify-between animate-fade-up"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex items-center gap-2.5">
          <h1
            className="text-[15px] font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            CASTweak
          </h1>
          <span
            className="text-[10px] font-medium tracking-wider uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            v0.0.1
          </span>
        </div>
        <button
          onClick={() => postToTweak("close")}
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors active:scale-95"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 1L11 11M11 1L1 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {/* ── Offset ──────────────────────────── */}
      <section
        className="mt-10 animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        <OffsetDisplay
          offsetSeconds={data.timerOffsetSeconds}
          elapsedSeconds={data.elapsedSeconds}
          pendingMinutes={pendingMinutes}
        />
      </section>

      <div className="mt-6 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <TimerControls onSetTarget={handleSetTarget} />
      </div>

      {/* ── Modules ─────────────────────────── */}
      <section className="mt-10 w-full max-w-md">
        <p
          className="mb-2.5 text-[10px] font-semibold tracking-[0.14em] uppercase animate-fade-up"
          style={{ animationDelay: "240ms", color: "var(--text-muted)" }}
        >
          Module
        </p>
        <div className="flex flex-col gap-2">
          <FeatureCard
            icon={Shield}
            title="Bypass"
            description="Umgeht die Prüfungssperre durch simulierte Sitzung"
            delay={280}
          />
          <FeatureCard
            icon={EyeOff}
            title="Tarnung"
            description="Unterdrückt alle Prüfungsaktivitäts-Protokolle"
            delay={320}
          />
          <FeatureCard
            icon={Focus}
            title="Schutz"
            description="Verhindert Fokusverlust-Erkennung beim App-Wechsel"
            delay={360}
          />
        </div>
      </section>

      {/* ── Codes ───────────────────────────── */}
      <section
        className="mt-6 w-full max-w-md animate-fade-up"
        style={{ animationDelay: "400ms" }}
      >
        <div
          className="rounded-xl p-4"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            className="mb-2.5 text-[10px] font-semibold tracking-[0.14em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Tastencodes
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {codes.map((c) => (
              <div key={c.code} className="flex items-center gap-2.5">
                <code
                  className="rounded-md px-2 py-0.5 text-[12px] font-semibold"
                  style={{
                    background: "rgba(56, 118, 220, 0.08)",
                    border: "1px solid rgba(56, 118, 220, 0.12)",
                    color: "var(--blue-400)",
                    fontFamily:
                      "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, monospace",
                  }}
                >
                  {c.code}
                </code>
                <span
                  className="text-[11px]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Passcode Settings ────────────────── */}
      <section
        className="mt-4 w-full max-w-md animate-fade-up"
        style={{ animationDelay: "440ms" }}
      >
        <PasscodeSettings currentPasscode={data.passcode} />
      </section>

      <div className="h-8" />
    </div>
  );
}
