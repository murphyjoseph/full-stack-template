import createClient from "openapi-react-query";
import { createApiClient } from "@repo/api-schema";
import type { Middleware } from "openapi-fetch";
import { logger } from "../logger";

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    // const token = getToken();
    // request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  },
};

const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    if (!response.ok) {
      logger.warn("API request failed", {
        status: response.status,
        url: response.url,
      });
    }
    return response;
  },
};

export type QueryApi = ReturnType<typeof createQueryApi>;

export function createQueryApi(baseUrl: string) {
  const fetchClient = createApiClient(baseUrl);
  fetchClient.use(authMiddleware);
  fetchClient.use(errorMiddleware);
  return createClient(fetchClient);
}
