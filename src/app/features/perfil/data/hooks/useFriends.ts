import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { perfilApi } from "../api";

export function usePotentialFriendsSearchSuggestions() {
  const queryClient = useQueryClient();

  return useCallback(
    async (query: string) => {
      const normalizedQuery = query.trim();

      if (!normalizedQuery) {
        return [];
      }

      return queryClient.fetchQuery({
        queryKey: ["users", "potential-friends", normalizedQuery],
        queryFn: () => perfilApi.getPotentialFriends(normalizedQuery),
      });
    },
    [queryClient],
  );
}

export function useFriends() {
  return useQuery({
    queryKey: ["friendships"],
    queryFn: () => perfilApi.getFriends(),
  });
}
