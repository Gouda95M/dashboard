import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { writeStoredSession } from "@/lib/auth";
import authReducer, { clearSession, setSession, type AuthState } from "./authSlice";

/** A new store per provider mount (no shared state between server requests). */
export function makeStore() {
  const persist = createListenerMiddleware();
  // Keep localStorage in step with the session whenever it is set or cleared.
  persist.startListening({
    matcher: isAnyOf(setSession, clearSession),
    effect: (_action, api) => writeStoredSession((api.getState() as { auth: AuthState }).auth.session),
  });

  return configureStore({
    reducer: { auth: authReducer },
    middleware: (getDefault) => getDefault().prepend(persist.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
