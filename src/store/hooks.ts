"use client";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./index";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/** undefined while the stored session is still being read, then the Session or null. */
export const useSession = () => useAppSelector((state) => (state.auth.hydrated ? state.auth.session : undefined));
