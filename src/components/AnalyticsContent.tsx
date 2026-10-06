"use client";

import { BarChart } from "@/components/charts/BarChart";
import { OrdersLoader } from "@/components/OrdersLoader";
import { Avatar, Card, CardBody, CardHeader, ProgressBar } from "@/components/customizeComponents";
import {
  formatCurrency,
  orderStatusTone,
  revenueByDay,
  statusBreakdown,
  topCustomers,
  topProducts,
} from "@/lib/orders";

export function AnalyticsContent() {
  return (
    <OrdersLoader>
      {(orders) => {
        const products = topProducts(orders);
        const topRevenue = products[0]?.revenue ?? 1;
        return (
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Daily revenue" description="Order value per day" />
              <CardBody>
                <BarChart data={revenueByDay(orders)} tone="info" />
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Orders by status" description="Share of all orders" />
              <CardBody className="flex flex-col gap-5">
                {statusBreakdown(orders).map((s) => (
                  <div key={s.status}>
                    <div className="mb-1.5 flex flex-col gap-0.5 text-sm sm:flex-row sm:justify-between sm:gap-3">
                      <span>{s.status}</span>
                      <span className="text-xs text-muted sm:text-sm">
                        {s.count} orders · {s.percent}% · {formatCurrency(s.revenue)}
                      </span>
                    </div>
                    <ProgressBar value={s.percent} tone={orderStatusTone[s.status] ?? "neutral"} />
                  </div>
                ))}
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Top products" description="By revenue" />
              <CardBody className="flex flex-col gap-5">
                {products.map((p) => (
                  <div key={p.name}>
                    <div className="mb-1.5 flex flex-col gap-0.5 text-sm sm:flex-row sm:justify-between sm:gap-3">
                      <span className="truncate">{p.name}</span>
                      <span className="shrink-0 text-xs text-muted sm:text-sm">
                        {p.units} sold · {formatCurrency(p.revenue)}
                      </span>
                    </div>
                    <ProgressBar value={(p.revenue / topRevenue) * 100} tone="primary" />
                  </div>
                ))}
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Top customers" description="By total spend" />
              <CardBody className="flex flex-col gap-4">
                {topCustomers(orders).map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <Avatar name={c.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted">{c.orders} orders</p>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(c.spent)}</span>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        );
      }}
    </OrdersLoader>
  );
}
