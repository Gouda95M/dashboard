import type { Tone } from "@/lib/theme";

/** Shape returned by GET https://fakestoreapi.noksha.dev/api/orders. */
export type ApiOrder = {
  _id: number;
  userId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: { productId: number; name: string; quantity: number; price: number }[];
};
export type OrdersResponse = { data: ApiOrder[]; totalOrders: number };

export type OrderItem = ApiOrder["items"][number];

export type Order = {
  id: string;
  customer: string;
  date: string;
  status: string;
  amount: number;
  items?: OrderItem[];
};

export const orderStatuses = ["Pending", "Processing", "Shipped", "Delivered"];

export const orderStatusTone: Record<string, Tone> = {
  Pending: "warning",
  Processing: "primary",
  Shipped: "info",
  Delivered: "success",
};

export const toOrder = (o: ApiOrder, names: Map<number, string>): Order => ({
  id: `#ORD-${o._id}`,
  customer: names.get(o.userId) ?? `User #${o.userId}`,
  date: o.orderDate.slice(0, 10),
  status: o.status,
  amount: o.totalAmount,
  items: o.items,
});

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

const sum = (list: Order[]) => list.reduce((total, o) => total + o.amount, 0);

export function summarize(orders: Order[]) {
  const revenue = sum(orders);
  const delivered = orders.filter((o) => o.status === "Delivered");
  return {
    revenue,
    count: orders.length,
    average: orders.length ? revenue / orders.length : 0,
    deliveredRate: orders.length
      ? Math.round((delivered.length / orders.length) * 100)
      : 0,
    customers: new Set(orders.map((o) => o.customer)).size,
  };
}

export function revenueByDay(orders: Order[]) {
  const byDay = new Map<string, number>();
  for (const o of orders)
    byDay.set(o.date, (byDay.get(o.date) ?? 0) + o.amount);
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({
      label: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: Math.round(value * 100) / 100,
    }));
}

export function statusBreakdown(orders: Order[]) {
  const statuses = [
    ...new Set([...orderStatuses, ...orders.map((o) => o.status)]),
  ];
  return statuses
    .map((status) => {
      const group = orders.filter((o) => o.status === status);
      return {
        status,
        count: group.length,
        revenue: sum(group),
        percent: orders.length
          ? Math.round((group.length / orders.length) * 100)
          : 0,
      };
    })
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function topProducts(orders: Order[], limit = 5) {
  const products = new Map<string, { units: number; revenue: number }>();
  for (const { items = [] } of orders)
    for (const i of items) {
      const p = products.get(i.name) ?? { units: 0, revenue: 0 };
      products.set(i.name, {
        units: p.units + i.quantity,
        revenue: p.revenue + i.price * i.quantity,
      });
    }
  return [...products.entries()]
    .map(([name, p]) => ({ name, ...p }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function topCustomers(orders: Order[], limit = 5) {
  const customers = new Map<string, { orders: number; spent: number }>();
  for (const o of orders) {
    const c = customers.get(o.customer) ?? { orders: 0, spent: 0 };
    customers.set(o.customer, {
      orders: c.orders + 1,
      spent: c.spent + o.amount,
    });
  }
  return [...customers.entries()]
    .map(([name, c]) => ({ name, ...c }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, limit);
}
