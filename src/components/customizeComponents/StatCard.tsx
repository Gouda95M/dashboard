import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { tones, type Tone } from "@/lib/theme";
import { Card } from "./Card";

type StatCardProps = {
  label: string;
  value: string;
  change?: number; // percent, signed
  hint?: string; // shown instead of the change when there is no comparison period
  icon: ReactNode;
  tone?: Tone;
};

export function StatCard({ label, value, change, hint, icon, tone = "primary" }: StatCardProps) {
  const positive = (change ?? 0) >= 0;
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span className={cn("inline-flex size-9 items-center justify-center rounded-lg", tones[tone])}>{icon}</span>
      </div>
      <p className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
      {change !== undefined ? (
        <p className={cn("mt-1 text-xs font-medium", positive ? "text-success" : "text-danger")}>
          {positive ? "▲" : "▼"} {Math.abs(change)}%{" "}
          <span className="font-normal text-muted">vs last month</span>
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-muted">{hint}</p>
      )}
    </Card>
  );
}
