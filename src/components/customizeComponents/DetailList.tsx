import type { ReactNode } from "react";

type DetailListProps = { items: { label: string; value: ReactNode }[] };

export function DetailList({ items }: DetailListProps) {
  return (
    <dl className="divide-y divide-border">
      {items.map(({ label, value }) => (
        <div key={label} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
          <dt className="text-muted">{label}</dt>
          <dd className="text-right font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
