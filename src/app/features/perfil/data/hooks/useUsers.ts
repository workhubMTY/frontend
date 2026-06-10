"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/app/shared/socket/socket.context";
import type { UserUpdateMessage } from "@/app/shared/socket/socket.context";

import { perfilApi } from "../api";

export function useUsers(query?: string, excludeId?: string) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const queryResult = useQuery({
    queryKey: ["users", query, excludeId],
    queryFn: () => perfilApi.getUsers(query, excludeId ? [excludeId] : []),
  });

  useEffect(() => {
    function onUserUpdate(msg: UserUpdateMessage) {
      if (msg.type === "user.updated") {
        queryClient.setQueryData<any[]>(
          ["users", query, excludeId],
          (prev) => {
            if (!prev) return prev;
            return prev.map((u: any) =>
              u.eId === msg.payload.eId
                ? {
                    ...u,
                    name: msg.payload.name,
                    email: msg.payload.email,
                    roleName: msg.payload.role,
                  }
                : u,
            );
          },
        );
        return;
      }

      if (msg.type === "user.deleted") {
        queryClient.setQueryData<any[]>(
          ["users", query, excludeId],
          (prev) => {
            if (!prev) return prev;
            return prev.filter((u: any) => u.eId !== msg.payload.eId);
          },
        );
      }
    }

    socket.on("userUpdate", onUserUpdate);
    return () => {
      socket.off("userUpdate", onUserUpdate);
    };
  }, [socket, queryClient, query, excludeId]);

  return queryResult;
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