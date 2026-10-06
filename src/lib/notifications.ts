"use client";

import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import type { Tone } from "@/lib/theme";

export type Notification = {
  id: string;
  title: string;
  description?: string;
  tone: Tone;
  time: string;
  read: boolean;
};

/** Tiny store: sonner shows the toast, this keeps the history for the bell. */
let state: Notification[] = [
  { id: "seed-1", title: "New user", description: "Laila Samir joined as a moderator.", tone: "success", time: "09:41", read: false },
  { id: "seed-2", title: "Payment failed", description: "Order #ORD-1037 could not be charged.", tone: "danger", time: "08:15", read: false },
  { id: "seed-3", title: "Weekly report ready", description: "Your analytics summary is available.", tone: "info", time: "Yesterday", read: true },
];
const listeners = new Set<() => void>();

function setState(next: Notification[]) {
  state = next;
  listeners.forEach((l) => l());
}

function push(tone: Tone, title: string, options?: { description?: string }) {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  setState([{ id: crypto.randomUUID(), title, description: options?.description, tone, time, read: false }, ...state]);
}

export const notify = {
  success: (title: string, options?: { description?: string }) => {
    toast.success(title, options);
    push("success", title, options);
  },
  error: (title: string, options?: { description?: string }) => {
    toast.error(title, options);
    push("danger", title, options);
  },
  info: (title: string, options?: { description?: string }) => {
    toast(title, options);
    push("info", title, options);
  },
};

export const markAllRead = () => setState(state.map((n) => ({ ...n, read: true })));
export const clearAll = () => setState([]);

export function useNotifications() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}
