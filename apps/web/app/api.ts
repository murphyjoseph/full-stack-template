import { createQueryApi, type QueryApi } from "../external/openapi/client.browser";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const $apiBrowser: QueryApi = createQueryApi(baseUrl);
