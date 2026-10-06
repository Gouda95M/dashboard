"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Avatar, Button, Icon, Input } from "@/components/customizeComponents";
import { clearSession } from "@/store/authSlice";
import { useAppDispatch, useSession } from "@/store/hooks";
import { cn } from "@/lib/cn";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const session = useSession();
  const router = useRouter();

  function logout() {
    dispatch(clearSession());
    router.replace("/login");
  }
  return (
    <div className="min-h-screen">
      {/* mobile backdrop */}
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur sm:px-8">
          <Button variant="ghost" size="sm" className="size-9 px-0 lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Icon name="menu" />
          </Button>
          <div className="relative hidden w-full max-w-sm sm:block">
            <Icon name="search" width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input placeholder="Search..." aria-label="Search" className="pl-9" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
            {session && (
              <>
                <Avatar name={`${session.firstName} ${session.lastName}`} />
                <span className="hidden text-sm font-medium md:block">{session.firstName}</span>
                <Button variant="ghost" size="sm" className="size-9 px-0" aria-label="Log out" onClick={logout}>
                  <Icon name="logout" />
                </Button>
              </>
            )}
          </div>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
