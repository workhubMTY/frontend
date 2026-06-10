"use client";

import { useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/app/shared/socket/socket.context";
import type { UserUpdateMessage } from "@/app/shared/socket/socket.context";

import { perfilApi } from "../api";
import type { SendFriendRequestsPayload } from "../../components/drawers/Friends/types";

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
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: ["friendships"],
    queryFn: () => perfilApi.getFriends(),
  });

  useEffect(() => {
    function onUserUpdate(msg: UserUpdateMessage) {
      if (
        msg.type === "friendship.created" ||
        msg.type === "friendRequest.accepted"
      ) {
        // Necesitamos datos completos del amigo, refetch
        queryClient.invalidateQueries({ queryKey: ["friendships"] });
        return;
      }

      if (msg.type === "friendship.removed") {
        queryClient.setQueryData<any[]>(["friendships"], (prev) => {
          if (!prev) return prev;
          const { userLow, userHigh } = msg.payload;
          return prev.filter(
            (u: any) => u.eId !== userLow && u.eId !== userHigh,
          );
        });
      }
    }

    socket.on("userUpdate", onUserUpdate);
    return () => {
      socket.off("userUpdate", onUserUpdate);
    };
  }, [socket, queryClient]);

  return query;
}

export function useSentFriendRequests() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: ["friend-requests"],
    queryFn: () => perfilApi.getSentRequests(),
  });

  useEffect(() => {
    function onUserUpdate(msg: UserUpdateMessage) {
      if (
        msg.type === "friendRequest.sent" ||
        msg.type === "friendRequest.canceled" ||
        msg.type === "friendRequest.accepted" ||
        msg.type === "friendRequest.rejected"
      ) {
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      }
    }

    socket.on("userUpdate", onUserUpdate);
    return () => {
      socket.off("userUpdate", onUserUpdate);
    };
  }, [socket, queryClient]);

  return query;
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendFriendRequestsPayload) => {
      return perfilApi.sendFriendRequest(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendships"] });
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["users", "potential-friends"],
      });
    },
  });
}

export function useCancelFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => {
      return perfilApi.deleteFriendRequest(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["users", "potential-friends"],
      });
    },
  });
}

export function useRemoveFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: string) => {
      return perfilApi.removeFriend(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendships"] });
    },
  });
}