"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { readStoredSession, SESSION_STORAGE_KEY } from "@/lib/auth";
import { makeStore } from "@/store";
import { sessionLoaded } from "@/store/authSlice";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    store.dispatch(sessionLoaded(readStoredSession()));
    const onStorage = (e: StorageEvent) => {
      if (e.key === SESSION_STORAGE_KEY)
        store.dispatch(sessionLoaded(readStoredSession()));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
