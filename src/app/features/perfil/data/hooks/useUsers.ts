import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { perfilApi } from "../api";

export function useUsers(query?: string, excludeId?: string) {
  return useQuery({
    queryKey: ["users", query, excludeId],
    queryFn: () => perfilApi.getUsers(query, excludeId ? [excludeId] : []),
  });
}

export function useUserSearchSuggestions(
  excludeIds: Array<string | number | null | undefined> = [],
) {
  const queryClient = useQueryClient();

  const normalizedExcludeIds = useMemo(
    () =>
      Array.from(
        new Set(
          excludeIds
            .filter((id): id is string | number => id !== null && id !== undefined)
            .map(String),
        ),
      ).sort(),
    [excludeIds],
  );

  return useCallback(
    async (query: string) => {
      const normalizedQuery = query.trim();

      if (!normalizedQuery) {
        return [];
      }

      return queryClient.fetchQuery({
        queryKey: [
          "users",
          "suggestions",
          normalizedQuery,
          normalizedExcludeIds,
        ],
        queryFn: () =>
          perfilApi.getUsers(normalizedQuery, normalizedExcludeIds),
      });
    },
    [queryClient, normalizedExcludeIds],
  );
}