import { useState } from "react";
import { cn } from "../lib/utils";

interface TimerControlsProps {
  onSetTimer: (minutes: number) => void;
}

const presets = [15, 30, 45, 60, 90];

export function TimerControls({ onSetTimer }: TimerControlsProps) {
  const [custom, setCustom] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const m = parseInt(custom, 10);
    if (m > 0) {
      onSetTimer(m);
      setCustom("");
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
      {/* Presets */}
      <div className="flex items-center gap-2">
        {presets.map((m) => (
          <button
            key={m}
            onClick={() => onSetTimer(m)}
            className={cn(
              "h-9 px-3.5 rounded-lg text-[12px] font-semibold tracking-wide",
              "bg-white/[0.04] border border-white/[0.06] text-zinc-400",
              "transition-all duration-200",
              "hover:bg-emerald-400/10 hover:border-emerald-400/20 hover:text-emerald-300",
              "active:scale-95"
            )}
          >
            {m}m
          </button>
        ))}
      </div>

      {/* Custom input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative">
          <input
            type="number"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Custom"
            min={1}
            max={999}
            className={cn(
              "h-9 w-28 rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 pr-8",
              "text-[12px] font-medium text-zinc-300 placeholder:text-zinc-600",
              "outline-none transition-all duration-200",
              "focus:border-emerald-400/30 focus:bg-white/[0.06]",
              "[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            )}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-zinc-600">
            min
          </span>
        </div>
        <button
          type="submit"
          className={cn(
            "h-9 px-4 rounded-lg text-[12px] font-semibold tracking-wide",
            "bg-emerald-400/10 border border-emerald-400/20 text-emerald-300",
            "transition-all duration-200",
            "hover:bg-emerald-400/20 hover:border-emerald-400/30",
            "active:scale-95",
            "disabled:opacity-40 disabled:pointer-events-none"
          )}
          disabled={!custom || parseInt(custom, 10) <= 0}
        >
          Set
        </button>
      </form>
    </div>
  );
}
