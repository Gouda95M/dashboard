import type { EndpointConfig } from "./types";

// Base URL comes from NEXT_PUBLIC_API_URL in .env (https://dummyjson.com).
export const endpoints = {
  auth: {
    // POST https://dummyjson.com/user/login  (sets accessToken / refreshToken cookies)
    login: { url: "/user/login", method: "POST" } satisfies EndpointConfig,
    // GET https://dummyjson.com/user/me  (needs the Bearer access token)
    me: { url: "/user/me", method: "GET" } satisfies EndpointConfig,
  },
  orders: {
    // GET https://fakestoreapi.noksha.dev/api/orders  ->  { data: ApiOrder[], totalOrders, ... }
    list: { url: "https://fakestoreapi.noksha.dev/api/orders", method: "GET" } satisfies EndpointConfig,
  },
  users: {
    // GET https://fakestoreapi.noksha.dev/api/users  ->  { data: UserDetail[], totalUsers, ... }
    list: { url: "https://fakestoreapi.noksha.dev/api/users", method: "GET" } satisfies EndpointConfig,
    // POST https://dummyjson.com/users/add  (registration only; simulated, nothing is persisted)
    add: { url: "/users/add", method: "POST" } satisfies EndpointConfig,
    // GET https://fakestoreapi.noksha.dev/api/users/:id
    detail: (id: string): EndpointConfig => ({
      url: `https://fakestoreapi.noksha.dev/api/users/${encodeURIComponent(id)}`,
      method: "GET",
    }),
  },
};
