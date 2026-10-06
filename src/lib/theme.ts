export type ColorTokens = {
  background: string;
  surface: string;
  "surface-muted": string;
  border: string;
  foreground: string;
  muted: string;
  primary: string;
  "primary-foreground": string;
  "primary-soft": string;
  success: string;
  "success-soft": string;
  warning: string;
  "warning-soft": string;
  danger: string;
  "danger-soft": string;
  info: string;
  "info-soft": string;
};

const light: ColorTokens = {
  background: "#f6f7fb",
  surface: "#ffffff",
  "surface-muted": "#f1f3f9",
  border: "#e4e7ef",
  foreground: "#141824",
  muted: "#6b7285",
  primary: "#4f46e5",
  "primary-foreground": "#ffffff",
  "primary-soft": "#eceafd",
  success: "#16a34a",
  "success-soft": "#dcf5e5",
  warning: "#d97706",
  "warning-soft": "#fdf0d5",
  danger: "#dc2626",
  "danger-soft": "#fde2e2",
  info: "#0284c7",
  "info-soft": "#dbf0fb",
};

const dark: ColorTokens = {
  background: "#0d1017",
  surface: "#151a24",
  "surface-muted": "#1c2230",
  border: "#262d3d",
  foreground: "#e8eaf1",
  muted: "#8a92a8",
  primary: "#818cf8",
  "primary-foreground": "#0d1017",
  "primary-soft": "#242a52",
  success: "#4ade80",
  "success-soft": "#143324",
  warning: "#fbbf24",
  "warning-soft": "#3a2d0f",
  danger: "#f87171",
  "danger-soft": "#3d1a1a",
  info: "#38bdf8",
  "info-soft": "#0f2f42",
};

export const colors = { light, dark } as const;

export const radius = { sm: "0.5rem", md: "0.75rem", lg: "1rem" } as const;

const toVars = (tokens: ColorTokens) =>
  Object.entries(tokens)
    .map(([key, value]) => `--${key}:${value};`)
    .join("");

/** CSS injected once in the root layout. `.dark` on <html> switches mode. */
export const themeCss = `:root{${toVars(light)}--radius-card:${radius.lg};color-scheme:light}.dark{${toVars(dark)}color-scheme:dark}`;

export const THEME_STORAGE_KEY = "dashboard-theme";

/** Runs before paint to avoid a flash of the wrong theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`;

/* ------------------------------------------------------------------ */
/* Shared class maps                                                   */
/* ------------------------------------------------------------------ */

export type Tone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

/** Soft tinted surfaces (badges, icon chips). */
export const tones: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-surface-muted text-muted",
};

/** Solid fills (chart bars, progress). */
export const toneFills: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-muted",
};

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type Size = "sm" | "md" | "lg";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-surface-muted text-foreground hover:bg-border",
  ghost: "text-muted hover:bg-surface-muted hover:text-foreground",
  danger: "bg-danger text-primary-foreground hover:opacity-90",
};

export const buttonSizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export const theme = {
  colors,
  radius,
  tones,
  toneFills,
  buttonVariants,
  buttonSizes,
  focusRing,
};
