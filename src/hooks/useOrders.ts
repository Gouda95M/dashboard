"use client";

import { useMemo } from "react";
import { useRequester } from "@/hooks/useRequester";
import { endpoints } from "@/lib/api/endpoints";
import { toOrder, type OrdersResponse } from "@/lib/orders";
import type { UsersResponse } from "@/lib/users";

export function useOrders() {
  const orders = useRequester<OrdersResponse>({
    request: { endpoint: endpoints.orders.list },
  });
  const names = useRequester<UsersResponse>({
    request: { endpoint: endpoints.users.list },
    showErrorToast: false,
  });

  const data = useMemo(() => {
    if (!orders.data) return undefined;
    const lookup = new Map(
      (names.data?.data ?? []).map((u) => [u._id, u.name]),
    );
    return orders.data.data.map((o) => toOrder(o, lookup));
  }, [orders.data, names.data]);

  return {
    orders: data,
    loading: orders.loading || names.loading,
    reload: orders.reload,
  };
}
