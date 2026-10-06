"use client";

import { BarChart } from "@/components/charts/BarChart";
import { OrdersLoader } from "@/components/OrdersLoader";
import { OrdersTable } from "@/components/OrdersTable";
import { StatGrid } from "@/components/StatGrid";
import { Card, CardBody, CardHeader } from "@/components/customizeComponents";
import { formatCurrency, revenueByDay, summarize } from "@/lib/orders";

export function OverviewContent() {
  return (
    <OrdersLoader>
      {(orders) => {
        const s = summarize(orders);
        const recent = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
        return (
          <>
            <StatGrid
              items={[
                { label: "Revenue", value: formatCurrency(s.revenue), hint: "All orders", icon: "dollar", tone: "primary" },
                { label: "Orders", value: String(s.count), hint: `${s.customers} customers`, icon: "cart", tone: "info" },
                { label: "Average order", value: formatCurrency(s.average), hint: "Per order", icon: "chart", tone: "success" },
                { label: "Delivered", value: `${s.deliveredRate}%`, hint: "Of all orders", icon: "activity", tone: "warning" },
              ]}
            />
            <div className="mt-6 grid gap-4 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader title="Revenue" description="Per day" />
                <CardBody>
                  <BarChart data={revenueByDay(orders)} />
                </CardBody>
              </Card>
              <OrdersTable title="Recent orders" rows={recent} />
            </div>
          </>
        );
      }}
    </OrdersLoader>
  );
}
