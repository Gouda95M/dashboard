import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { focusRing } from "@/lib/theme";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm placeholder:text-muted",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}
