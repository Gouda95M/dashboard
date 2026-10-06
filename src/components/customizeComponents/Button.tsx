import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { buttonSizes, buttonVariants, focusRing, type ButtonVariant, type Size } from "@/lib/theme";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: Size;
};

export function Button({ variant = "primary", size = "md", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        focusRing,
        className,
      )}
      {...props}
    />
  );
}
