"use client";

import { Button, Icon } from "@/components/customizeComponents";
import { THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeToggle() {
  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    } catch {}
  }
  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme" className="size-9 px-0">
      <Icon name="moon" className="dark:hidden" />
      <Icon name="sun" className="hidden dark:block" />
    </Button>
  );
}
