"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/customizeComponents";
import { cn } from "@/lib/cn";
import { focusRing } from "@/lib/theme";
import { navItems } from "./nav";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center gap-2 px-2 pt-1 text-lg font-semibold">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">D</span>
        Dashboard
      </div>
      <nav className="flex flex-col gap-1" aria-label="Main">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-muted hover:text-foreground",
                focusRing,
              )}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
