import { useState } from "react";
import { postToTweak } from "../bridge";

interface PasscodeSettingsProps {
  currentPasscode: string;
}

export function PasscodeSettings({ currentPasscode }: PasscodeSettingsProps) {
  const [revealed, setRevealed] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (newCode.length < 4 || !/^\d+$/.test(newCode)) return;
    postToTweak("setPasscode", { passcode: newCode });
    setNewCode("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <p
        className="mb-3 text-[10px] font-semibold tracking-[0.14em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        Code ändern
      </p>

      {/* Current passcode */}
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="text-[11px]"
          style={{ color: "var(--text-secondary)" }}
        >
          Aktuell:
        </span>
        <button
          onClick={() => setRevealed(!revealed)}
          className="rounded-md px-2 py-0.5 text-[12px] font-semibold transition-all active:scale-95"
          style={{
            background: "rgba(56, 118, 220, 0.08)",
            border: "1px solid rgba(56, 118, 220, 0.12)",
            color: "var(--blue-400)",
            fontFamily:
              "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, monospace",
          }}
        >
          {revealed ? currentPasscode : "····"}
        </button>
      </div>

      {/* New passcode input */}
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          placeholder="Neuer Code"
          className="h-8 w-32 rounded-lg px-2.5 text-[11px] font-medium outline-none transition-all duration-150"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(56, 118, 220, 0.25)";
            e.currentTarget.style.background = "rgba(15, 25, 50, 0.7)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.background = "var(--surface)";
          }}
        />
        <button
          onClick={handleSave}
          disabled={newCode.length < 4 || !/^\d+$/.test(newCode)}
          className="h-8 px-3.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-150 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          style={{
            background: "rgba(56, 118, 220, 0.12)",
            border: "1px solid rgba(56, 118, 220, 0.18)",
            color: "var(--blue-300)",
          }}
        >
          Speichern
        </button>
      </div>

      {saved && (
        <p
          className="mt-2 text-[10px] font-medium"
          style={{ color: "var(--blue-400)" }}
        >
          Gespeichert!
        </p>
      )}
    </div>
  );
}
