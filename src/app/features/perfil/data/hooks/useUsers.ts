import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { perfilApi } from "../api";

export function useUsers(query?: string, excludeId?: string) {
  return useQuery({
    queryKey: ["users", query, excludeId],
    queryFn: () => perfilApi.getUsers(query, excludeId),
  });
}


export function useUserSearchSuggestions(excludeId?: string | number | null) {
  const queryClient = useQueryClient();

  return useCallback(
    async (query: string) => {
      const normalizedQuery = query.trim();

      if (!normalizedQuery) {
        return [];
      }

      return queryClient.fetchQuery({
        queryKey: ["users", "suggestions", normalizedQuery, excludeId],
        queryFn: () =>
          perfilApi.getUsers(normalizedQuery, excludeId ? String(excludeId) : undefined),
      });
    },
    [queryClient, excludeId],
  );
}
