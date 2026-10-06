"use client";

import { useCallback, useState } from "react";
import { notify } from "@/lib/notifications";

export interface UseErrorHandlerParams {
  onError?: (error: Error) => void;
  showErrorToast?: boolean;
  initialLoading?: boolean;
}

export default function useErrorHandler({
  onError,
  showErrorToast = true,
  initialLoading = false,
}: UseErrorHandlerParams = {}) {
  const [loading, setLoading] = useState(initialLoading);
  const callWrapperBase = useCallback(
    (showIndicator = true) =>
      async <R>(fn: () => Promise<R>): Promise<R | null> => {
        if (showIndicator) setLoading(true);
        try {
          return await fn();
        } catch (e) {
          const error =
            e instanceof Error ? e : new Error("Something went wrong");
          if (showErrorToast)
            notify.error("Request failed", { description: error.message });
          onError?.(error);
          return null;
        } finally {
          if (showIndicator) setLoading(false);
        }
      },
    [onError, showErrorToast],
  );

  return { callWrapperBase, loading, setLoading };
}
