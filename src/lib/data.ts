import type { IconName } from "@/components/customizeComponents";
import type { Tone } from "@/lib/theme";

export type StatItem = {
  label: string;
  value: string;
  change?: number;
  hint?: string;
  icon: IconName;
  tone: Tone;
};
