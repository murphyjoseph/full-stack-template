import createFetchClient from "openapi-fetch";
import type { paths } from "./schema.js";

export function createApiClient(baseUrl: string) {
  return createFetchClient<paths>({ baseUrl });
}

export type { paths } from "./schema.js";
