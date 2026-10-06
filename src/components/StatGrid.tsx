import { Icon, StatCard } from "@/components/customizeComponents";
import type { StatItem } from "@/lib/data";

export function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {items.map(({ icon, ...stat }) => (
        <StatCard key={stat.label} icon={<Icon name={icon} />} {...stat} />
      ))}
    </div>
  );
}
