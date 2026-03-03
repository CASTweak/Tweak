import { useState } from "react";

interface TimerControlsProps {
  onSetTarget: (minutes: number) => void;
}

const presets = [15, 30, 45, 60, 90];

export function TimerControls({ onSetTarget }: TimerControlsProps) {
  const [custom, setCustom] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const m = parseInt(custom, 10);
    if (m > 0) {
      onSetTarget(m);
      setCustom("");
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p
        className="text-[10px] font-semibold tracking-[0.14em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        Set Target Time
      </p>

      {/* Presets */}
      <div className="flex items-center gap-1.5">
        {presets.map((m) => (
          <button
            key={m}
            onClick={() => onSetTarget(m)}
            className="h-8 px-3 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-150 active:scale-95"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(56, 118, 220, 0.1)";
              e.currentTarget.style.borderColor = "rgba(56, 118, 220, 0.2)";
              e.currentTarget.style.color = "var(--blue-300)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--surface)";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {m}m
          </button>
        ))}
      </div>

      {/* Custom input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
        <div className="relative">
          <input
            type="number"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Custom"
            min={1}
            max={999}
            className="h-8 w-24 rounded-lg px-2.5 pr-7 text-[11px] font-medium outline-none transition-all duration-150"
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
          <span
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            min
          </span>
        </div>
        <button
          type="submit"
          className="h-8 px-3.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-150 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          style={{
            background: "rgba(56, 118, 220, 0.12)",
            border: "1px solid rgba(56, 118, 220, 0.18)",
            color: "var(--blue-300)",
          }}
          disabled={!custom || parseInt(custom, 10) <= 0}
        >
          Set
        </button>
      </form>
    </div>
  );
}
