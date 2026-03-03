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
        "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5",
        "backdrop-blur-sm transition-all duration-300",
        "hover:border-white/[0.1] hover:bg-white/[0.04]",
        "animate-fade-up"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle gradient highlight on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(52,211,153,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <Icon size={18} className="text-zinc-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-[13px] font-semibold text-zinc-200 tracking-tight">
              {title}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  active
                    ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)] animate-pulse-slow"
                    : "bg-zinc-600"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium tracking-wider uppercase",
                  active ? "text-emerald-400/80" : "text-zinc-600"
                )}
              >
                {active ? "Active" : "Off"}
              </span>
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
