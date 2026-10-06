import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "@/lib/auth";

export type AuthState = {
  session: Session | null;
  /** false until the stored session has been read on the client. */
  hydrated: boolean;
};

const initialState: AuthState = { session: null, hydrated: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Restores the persisted session (or null) once the browser is available. */
    sessionLoaded(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
      state.hydrated = true;
    },
    setSession(state, action: PayloadAction<Session>) {
      state.session = action.payload;
      state.hydrated = true;
    },
    clearSession(state) {
      state.session = null;
      state.hydrated = true;
    },
  },
});

export const { sessionLoaded, setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
