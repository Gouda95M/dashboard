import { cn } from "@/lib/cn";

const sizes = { md: "size-9 text-xs", lg: "size-16 text-xl" } as const;

type AvatarProps = { name: string; size?: keyof typeof sizes; className?: string };

export function Avatar({ name, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary",
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
