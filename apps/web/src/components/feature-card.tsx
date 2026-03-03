import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  active?: boolean;
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  active = true,
  delay = 0,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl p-3.5 transition-all duration-200 animate-fade-up"
      )}
      style={{
        animationDelay: `${delay}ms`,
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: active
              ? "rgba(56, 118, 220, 0.1)"
              : "rgba(255,255,255,0.03)",
            border: active
              ? "1px solid rgba(56, 118, 220, 0.15)"
              : "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Icon
            size={15}
            style={{
              color: active ? "var(--blue-400)" : "var(--text-muted)",
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[12px] font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </span>
            <span className="flex items-center gap-1">
              <span
                className={cn("h-1.5 w-1.5 rounded-full", {
                  "animate-pulse-slow": active,
                })}
                style={{
                  background: active ? "var(--blue-400)" : "var(--text-muted)",
                  boxShadow: active
                    ? "0 0 6px rgba(56, 118, 220, 0.4)"
                    : "none",
                }}
              />
              <span
                className="text-[9px] font-medium tracking-wider uppercase"
                style={{
                  color: active
                    ? "var(--blue-400)"
                    : "var(--text-muted)",
                }}
              >
                {active ? "An" : "Aus"}
              </span>
            </span>
          </div>
          <p
            className="text-[10px] leading-relaxed mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
