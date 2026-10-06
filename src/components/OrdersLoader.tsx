"use client";

import type { ReactNode } from "react";
import { Button, Card } from "@/components/customizeComponents";
import { useOrders } from "@/hooks/useOrders";
import type { Order } from "@/lib/orders";

export function OrdersLoader({
  children,
}: {
  children: (orders: Order[]) => ReactNode;
}) {
  const { orders, loading, reload } = useOrders();

  if (loading)
    return (
      <Card className="p-8 text-center text-sm text-muted">
        Loading orders...
      </Card>
    );
  if (!orders) {
    return (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <p className="text-sm text-danger">Could not load orders.</p>
        <Button variant="secondary" size="sm" onClick={() => reload()}>
          Try again
        </Button>
      </Card>
    );
  }
  return <>{children(orders)}</>;
}
