"use client";

import { OrdersLoader } from "@/components/OrdersLoader";
import { ResourceManager } from "@/components/crud/ResourceManager";
import type { FieldConfig } from "@/components/crud/types";
import { StatGrid } from "@/components/StatGrid";
import { formatCurrency, orderStatuses, summarize, type Order } from "@/lib/orders";
import { orderColumns } from "./OrdersTable";

const fields: FieldConfig<Order>[] = [
  { name: "customer", label: "Customer", type: "text", placeholder: "Customer name" },
  { name: "date", label: "Date", type: "date" },
  { name: "status", label: "Status", type: "select", options: orderStatuses },
  { name: "amount", label: "Amount (USD)", type: "number", min: 0 },
];

const nextOrderId = (list: Order[]) =>
  `#ORD-${Math.max(0, ...list.map((o) => Number(o.id.replace("#ORD-", "")) || 0)) + 1}`;

function orderStats(items: Order[]) {
  const s = summarize(items);
  const open = items.filter((o) => o.status === "Pending" || o.status === "Processing").length;
  return [
    { label: "Revenue", value: formatCurrency(s.revenue), hint: `${s.count} orders`, icon: "dollar", tone: "success" },
    { label: "Average order", value: formatCurrency(s.average), hint: "Per order", icon: "cart", tone: "info" },
    { label: "Open orders", value: String(open), hint: "Pending or processing", icon: "activity", tone: "warning" },
    { label: "Delivered", value: `${s.deliveredRate}%`, hint: "Of all orders", icon: "chart", tone: "primary" },
  ] as const;
}

export function OrdersManager() {
  return (
    <OrdersLoader>
      {(orders) => (
        <ResourceManager
          title="Orders"
          singular="order"
          pageSize={10}
          initialItems={orders}
          columns={orderColumns}
          fields={fields}
          newId={nextOrderId}
          itemLabel={(o) => o.id}
          summary={(items) => <StatGrid items={[...orderStats(items)]} />}
        />
      )}
    </OrdersLoader>
  );
}
