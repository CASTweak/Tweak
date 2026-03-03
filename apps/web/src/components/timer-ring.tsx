import { useState, useEffect } from "react";
import { formatOffset } from "../lib/utils";

interface OffsetDisplayProps {
  offsetSeconds: number;
  elapsedSeconds: number;
  pendingMinutes: number | null;
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function OffsetDisplay({
  offsetSeconds,
  elapsedSeconds,
  pendingMinutes,
}: OffsetDisplayProps) {
  const isRunning = elapsedSeconds > 0 || offsetSeconds !== 0;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const displaySeconds = Math.floor(elapsedSeconds) + offsetSeconds + tick;
  const hasOffset = offsetSeconds !== 0;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <p
        className="text-[10px] font-semibold tracking-[0.14em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        {isRunning ? "Laufzeit" : "Zeitversatz"}
      </p>
      <p
        className="text-[40px] font-light tracking-tight leading-none"
        style={{
          color: isRunning ? "var(--blue-300)" : "var(--text-muted)",
          fontFamily:
            "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, monospace",
        }}
      >
        {isRunning ? formatTime(displaySeconds) : "0:00"}
      </p>
      {hasOffset && isRunning ? (
        <p
          className="text-[10px] font-medium tracking-wider uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          Versatz {formatOffset(offsetSeconds)}
        </p>
      ) : null}
      {pendingMinutes ? (
        <p
          className="text-[10px] font-medium tracking-wider uppercase animate-pulse-slow"
          style={{ color: "var(--blue-400)" }}
        >
          Ziel {pendingMinutes}m ausstehend
        </p>
      ) : null}
    </div>
  );
}
