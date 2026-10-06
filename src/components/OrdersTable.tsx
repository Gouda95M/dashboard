"use client";

import { Badge, DataTable, type Column } from "@/components/customizeComponents";
import { formatCurrency, orderStatusTone, type Order } from "@/lib/orders";

export const orderColumns: Column<Order>[] = [
  { key: "id", header: "Order", render: (o) => <span className="font-medium">{o.id}</span> },
  { key: "customer", header: "Customer", render: (o) => o.customer },
  { key: "date", header: "Date", render: (o) => <span className="text-muted">{o.date}</span> },
  {
    key: "items",
    header: "Items",
    render: (o) =>
      o.items?.length ? (
        <span className="text-muted">
          {o.items[0].name}
          {o.items.length > 1 && ` +${o.items.length - 1} more`}
        </span>
      ) : (
        <span className="text-muted">-</span>
      ),
  },
  { key: "status", header: "Status", render: (o) => <Badge tone={orderStatusTone[o.status] ?? "neutral"}>{o.status}</Badge> },
  { key: "amount", header: "Amount", align: "right", render: (o) => formatCurrency(o.amount) },
];

export function OrdersTable({ rows, title }: { rows: Order[]; title?: string }) {
  return <DataTable title={title} columns={orderColumns} rows={rows} rowKey={(o) => o.id} />;
}
