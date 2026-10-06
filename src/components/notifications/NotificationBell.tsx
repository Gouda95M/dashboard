"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Icon } from "@/components/customizeComponents";
import { cn } from "@/lib/cn";
import { clearAll, markAllRead, useNotifications } from "@/lib/notifications";
import { toneFills } from "@/lib/theme";

export function NotificationBell() {
  const notifications = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative size-9 px-0"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="bell" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-card border border-border bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <div className="flex gap-3 text-xs">
              <button type="button" onClick={markAllRead} disabled={!unreadCount} className="text-primary disabled:text-muted">
                Mark all read
              </button>
              <button type="button" onClick={clearAll} disabled={!notifications.length} className="text-muted hover:text-foreground disabled:opacity-50">
                Clear
              </button>
            </div>
          </div>
          {notifications.length ? (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className={cn("flex gap-3 border-b border-border px-4 py-3 last:border-0", !n.read && "bg-primary-soft/40")}>
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-border" : toneFills[n.tone])} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    {n.description && <p className="text-sm text-muted">{n.description}</p>}
                    <p className="mt-1 text-xs text-muted">{n.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-8 text-center text-sm text-muted">You&apos;re all caught up.</p>
          )}
        </div>
      )}
    </div>
  );
}
