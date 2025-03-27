"use client";

import useSWR from "swr";
import type {
  SearchApiParams,
  SearchApiResponse,
} from "@/pages/api/unsplash/search";

const errorMessage = (
  err: unknown,
  fallback = "Something went wrong"
): string =>
  typeof err === "string" ? err : err instanceof Error ? err.message : fallback;

export type UseSearchResponseData = Extract<
  SearchApiResponse,
  { type: "success" }
>["response"];

type UseSearchOptions = {
  params: SearchApiParams;
  /**
   * @default true
   */
  enabled?: boolean;
};

export const useSearch = (opts: UseSearchOptions) => {
  const { params, enabled = true } = opts;
  const key = enabled
    ? `/api/unsplash/search?query=${params.query}&resource=${params.resource}`
    : null;

  return useSWR<UseSearchResponseData, Error, string | null>(key, (...args) =>
    fetch(...args)
      .then(async (res) => {
        if (!res.ok) {
          throw Error("Failed to search");
        }
        const result = (await await res.json()) as SearchApiResponse;
        if (result.type !== "success") {
          throw Error(result.errors.join(","));
        }
        return result.response;
      })
      .catch((e) => {
        if (e instanceof Error) {
          throw e;
        }
        throw Error(errorMessage(e));
      })
  );
};
