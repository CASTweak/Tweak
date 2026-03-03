import { formatOffset } from "../lib/utils";

interface OffsetDisplayProps {
  offsetSeconds: number;
  pendingMinutes: number | null;
}

export function OffsetDisplay({
  offsetSeconds,
  pendingMinutes,
}: OffsetDisplayProps) {
  const hasOffset = offsetSeconds !== 0;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <p
        className="text-[10px] font-semibold tracking-[0.14em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        Time Offset
      </p>
      <p
        className="text-[40px] font-light tracking-tight leading-none"
        style={{
          color: hasOffset ? "var(--blue-300)" : "var(--text-muted)",
          fontFamily:
            "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, monospace",
        }}
      >
        {hasOffset ? formatOffset(offsetSeconds) : "0:00"}
      </p>
      {pendingMinutes ? (
        <p
          className="text-[10px] font-medium tracking-wider uppercase animate-pulse-slow"
          style={{ color: "var(--blue-400)" }}
        >
          Target {pendingMinutes}m pending
        </p>
      ) : null}
    </div>
  );
}
