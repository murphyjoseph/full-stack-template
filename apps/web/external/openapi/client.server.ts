import { createApiClient } from "@repo/api-schema";
import type { Middleware } from "openapi-fetch";
import { logger } from "../logger";
// import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    // const cookieStore = await cookies();
    // const token = cookieStore.get("session")?.value;
    // if (token) {
    //   request.headers.set("Authorization", `Bearer ${token}`);
    // }
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

const client = createApiClient(baseUrl);
client.use(authMiddleware);
client.use(errorMiddleware);

export const $apiServer = client;
