import type { IconName } from "@/components/customizeComponents";

export const navItems: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Overview", icon: "home" },
  { href: "/users", label: "Users", icon: "users" },
  { href: "/orders", label: "Orders", icon: "cart" },
  { href: "/analytics", label: "Analytics", icon: "chart" },
  { href: "/dev", label: "Dev", icon: "code" },
];
