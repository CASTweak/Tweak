import { useEffect, useState } from "react";
import { formatOffset } from "../lib/utils";

interface TimerRingProps {
  offsetSeconds: number;
  pendingMinutes: number | null;
}

export function TimerRing({ offsetSeconds, pendingMinutes }: TimerRingProps) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
  }, []);

  const radius = 88;
  const stroke = 4;
  const circumference = 2 * Math.PI * radius;
  const maxMinutes = 120;
  const offsetMinutes = Math.abs(offsetSeconds) / 60;
  const progress = Math.min(offsetMinutes / maxMinutes, 1);
  const dashOffset = circumference * (1 - (drawn ? progress : 0));

  // Tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * 360 - 90;
    const isMajor = i % 15 === 0;
    const r1 = isMajor ? 74 : 77;
    const r2 = 80;
    const rad = (angle * Math.PI) / 180;
    return {
      x1: 100 + r1 * Math.cos(rad),
      y1: 100 + r1 * Math.sin(rad),
      x2: 100 + r2 * Math.cos(rad),
      y2: 100 + r2 * Math.sin(rad),
      isMajor,
    };
  });

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow backdrop */}
      <div
        className="absolute rounded-full transition-opacity duration-1000"
        style={{
          width: 220,
          height: 220,
          background:
            "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)",
          opacity: drawn ? 1 : 0,
        }}
      />

      <svg
        viewBox="0 0 200 200"
        className="relative z-10"
        style={{ width: 220, height: 220 }}
      >
        <defs>
          <linearGradient
            id="ring-grad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <filter id="ring-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tick marks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.isMajor ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}
            strokeWidth={t.isMajor ? 1.5 : 0.75}
            strokeLinecap="round"
          />
        ))}

        {/* Background track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={stroke}
        />

        {/* Progress arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 100 100)"
          filter="url(#ring-glow)"
          style={{
            transition: drawn
              ? "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
              : "none",
          }}
        />

        {/* Center text */}
        <text
          x="100"
          y="94"
          textAnchor="middle"
          fill="#f4f4f5"
          fontSize="26"
          fontFamily="ui-monospace, 'SF Mono', SFMono-Regular, Menlo, monospace"
          fontWeight="600"
          letterSpacing="-0.02em"
        >
          {offsetSeconds === 0 && !pendingMinutes
            ? "0:00"
            : formatOffset(offsetSeconds)}
        </text>
        <text
          x="100"
          y="116"
          textAnchor="middle"
          fill={pendingMinutes ? "#34d399" : "#71717a"}
          fontSize="10"
          fontFamily="-apple-system, BlinkMacSystemFont, system-ui, sans-serif"
          letterSpacing="0.08em"
        >
          {pendingMinutes
            ? `TARGET ${pendingMinutes}m PENDING`
            : offsetSeconds !== 0
              ? "TIMER OFFSET"
              : "NO OFFSET"}
        </text>
      </svg>
    </div>
  );
}
