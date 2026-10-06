import { cn } from "@/lib/cn";
import { toneFills, type Tone } from "@/lib/theme";

type BarChartProps = {
  data: { label: string; value: number }[];
  tone?: Tone;
  className?: string;
};

export function BarChart({ data, tone = "primary", className }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="overflow-x-auto pb-1">
      <div
        className={cn("flex h-56 items-end gap-2 sm:gap-3", className)}
        style={{ minWidth: data.length * 44 }}
        role="img"
        aria-label="Bar chart"
      >
        {data.map((d) => (
          <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div
              title={`${d.label}: ${d.value.toLocaleString()}`}
              className={cn("w-full rounded-t-md opacity-90 transition-opacity hover:opacity-100", toneFills[tone])}
              style={{ height: `${(d.value / max) * 100}%` }}
            />
            <span className="whitespace-nowrap text-[11px] text-muted sm:text-xs">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
