import { cn } from "@/lib/cn";
import { toneFills, type Tone } from "@/lib/theme";

type ProgressBarProps = { value: number; tone?: Tone; className?: string };

export function ProgressBar({ value, tone = "primary", className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-muted", className)}
    >
      <div className={cn("h-full rounded-full", toneFills[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}
