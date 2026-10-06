import type { ApiError, EndpointConfig, RequestOptions } from "./types";

export async function requester<T = unknown>(
  endpoint: EndpointConfig,
  options: RequestOptions = {},
): Promise<{ data: T; ok: true }> {
  const { url, method } = endpoint;
  const isAbsolute = /^https?:\/\//.test(url);
  const apiUrl = isAbsolute ? "" : process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl === undefined) {
    throw new Error("API URL is not configured");
  }

  const { body, headers: extraHeaders } = options;

  const headers: Record<string, string> = { ...extraHeaders };
  if (body) headers["Content-Type"] = "application/json";

  const response = await fetch(`${apiUrl}${url}`, {
    method,
    ...(!isAbsolute && { credentials: "include" as const }),
    ...(Object.keys(headers).length > 0 && { headers }),
    ...(body && { body: JSON.stringify(body) }),
  });

  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    const error = new Error(
      data?.message ?? "Something went wrong",
    ) as ApiError;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return { data, ok: true };
}
