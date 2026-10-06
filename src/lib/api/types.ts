export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type EndpointConfig = { url: string; method: HttpMethod };

export type RequestOptions = { body?: object; headers?: Record<string, string> };

export type Requester = { endpoint: EndpointConfig; options?: RequestOptions };

export type ApiError = Error & { status: number; data: unknown };
