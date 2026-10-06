"use client";

import { requester } from "@/lib/api/requester";
import type { RequestOptions, Requester } from "@/lib/api/types";
import { useCallback, useEffect, useRef, useState } from "react";
import useErrorHandler, { type UseErrorHandlerParams } from "./useErrorHandler";

export interface UseRequesterProps<T> extends UseErrorHandlerParams {
  initialState?: T;
  request: Requester;
  requestImmediately?: boolean;
  initialLoading?: boolean;
  showReloadIndicator?: boolean;
  doAfter?: (data: T) => void | Promise<void>;
}

export function useRequester<T = unknown>({
  initialState,
  request: { endpoint, options: defaultOptions = {} },
  requestImmediately = true,
  initialLoading = true,
  showReloadIndicator = true,
  doAfter,
  ...errorHandlerArgs
}: UseRequesterProps<T>) {
  const [data, setData] = useState<T | undefined>(initialState);
  const requestRef = useRef({ endpoint, options: defaultOptions });
  useEffect(() => {
    requestRef.current = { endpoint, options: defaultOptions };
  });

  const reset = useCallback(() => setData(initialState), [initialState]);

  const { callWrapperBase, loading, setLoading } = useErrorHandler({
    ...errorHandlerArgs,
    initialLoading: requestImmediately ? initialLoading : false,
  });

  const loadData = useCallback(
    async (
      overrideOptions?: RequestOptions,
      showIndicator: boolean = showReloadIndicator,
    ): Promise<T | null> => {
      const { endpoint: ep, options: opts } = requestRef.current;
      const mergedOptions = { ...opts, ...overrideOptions };

      return callWrapperBase(showIndicator)(async () => {
        const res = await requester<T>(ep, mergedOptions);
        setData(res.data);
        if (doAfter) await doAfter(res.data);
        return res.data;
      });
    },
    [callWrapperBase, doAfter, showReloadIndicator],
  );

  useEffect(() => {
    if (requestImmediately) {
      void loadData(undefined, showReloadIndicator);
    }
  }, [requestImmediately]);

  return {
    reload: loadData,
    data,
    setData,
    loading,
    setLoading,
    reset,
  };
}
