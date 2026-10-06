"use client";

import { useMemo } from "react";
import { useRequester } from "@/hooks/useRequester";
import { endpoints } from "@/lib/api/endpoints";
import { toOrder, type OrdersResponse } from "@/lib/orders";

type NamesResponse = {
  users: { id: number; firstName: string; lastName: string }[];
};

export function useOrders() {
  const orders = useRequester<OrdersResponse>({
    request: { endpoint: endpoints.orders.list },
  });
  const names = useRequester<NamesResponse>({
    request: { endpoint: endpoints.users.names },
    showErrorToast: false,
  });

  const data = useMemo(() => {
    if (!orders.data) return undefined;
    const lookup = new Map(
      (names.data?.users ?? []).map((u) => [
        u.id,
        `${u.firstName} ${u.lastName}`,
      ]),
    );
    return orders.data.data.map((o) => toOrder(o, lookup));
  }, [orders.data, names.data]);

  return {
    orders: data,
    loading: orders.loading || names.loading,
    reload: orders.reload,
  };
}
