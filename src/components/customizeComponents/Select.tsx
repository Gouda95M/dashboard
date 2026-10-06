import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { focusRing } from "@/lib/theme";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { options: string[] };

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <select
      className={cn("h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm", focusRing, className)}
      {...props}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
