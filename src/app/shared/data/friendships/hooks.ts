"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../users/api";
import { friendshipsApi } from "./api";
import { createUserViewModel } from "../users/types";
import type { UserViewModel } from "../users/types";
import type {
  FriendRequest,
  CreateFriendRequestDto,
  AcceptFriendRequestDto,
} from "./types";
import { useSocket } from "@/app/shared/socket/socket.context";
import type { UserUpdateMessage } from "@/app/shared/socket/socket.context";

export const friendsKeys = {
  all: ["friends"] as const,
  me: () => [...friendsKeys.all, "me"] as const,
  requests: {
    sent: ["friendRequests", "sent"] as const,
    received: ["friendRequests", "received"] as const,
  },
};

export function useFriends() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: friendsKeys.me(),
    queryFn: usersApi.getMeFriendships,
    select: (users) => users.map(createUserViewModel),
  });

  useEffect(() => {
    function onUserUpdate(msg: UserUpdateMessage) {
      if (msg.type === "friendship.created") {
        // La amistad se creó — refrescamos la lista completa porque necesitamos
        // los datos del usuario amigo (nombre, avatar, etc.) que no vienen en el evento
        queryClient.invalidateQueries({ queryKey: friendsKeys.me() });
        return;
      }

      if (msg.type === "friendship.removed") {
        queryClient.setQueryData<UserViewModel[]>(
          friendsKeys.me(),
          (prev) => {
            if (!prev) return prev;
            const { userLow, userHigh } = msg.payload;
            return prev.filter(
              (u) => u.eId !== userLow && u.eId !== userHigh,
            );
          },
        );
        return;
      }

      if (
        msg.type === "friendRequest.accepted"
      ) {
        // Al aceptar, la amistad ya fue creada — refrescamos amigos
        queryClient.invalidateQueries({ queryKey: friendsKeys.me() });
      }
    }

    socket.on("userUpdate", onUserUpdate);
    return () => {
      socket.off("userUpdate", onUserUpdate);
    };
  }, [socket, queryClient]);

  const removeFriend = useMutation({
    mutationFn: (eId: string) => friendshipsApi.remove({ userId: eId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendsKeys.me() });
    },
  });

  return {
    ...query,
    removeFriend,
  };
}

export function useSentFriendRequests() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: friendsKeys.requests.sent,
    queryFn: friendshipsApi.getSentRequests,
  });

  useEffect(() => {
    function onUserUpdate(msg: UserUpdateMessage) {
      if (
        msg.type === "friendRequest.sent" ||
        msg.type === "friendRequest.canceled" ||
        msg.type === "friendRequest.accepted" ||
        msg.type === "friendRequest.rejected"
      ) {
        queryClient.invalidateQueries({ queryKey: friendsKeys.requests.sent });
      }
    }

    socket.on("userUpdate", onUserUpdate);
    return () => {
      socket.off("userUpdate", onUserUpdate);
    };
  }, [socket, queryClient]);

  const createFriendRequest = useMutation({
    mutationFn: (payload: CreateFriendRequestDto) =>
      friendshipsApi.createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendsKeys.requests.sent,
      });
    },
  });

  const cancelFriendRequest = useMutation({
    mutationFn: (toUser: string) => friendshipsApi.cancelSentRequest(toUser),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendsKeys.requests.sent,
      });
    },
  });

  return {
    ...query,
    createFriendRequest,
    cancelFriendRequest,
  };
}

export function useReceivedFriendRequests() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: friendsKeys.requests.received,
    queryFn: friendshipsApi.getReceivedRequests,
  });

  useEffect(() => {
    function onUserUpdate(msg: UserUpdateMessage) {
      if (
        msg.type === "friendRequest.sent" ||
        msg.type === "friendRequest.accepted" ||
        msg.type === "friendRequest.canceled" ||
        msg.type === "friendRequest.rejected"
      ) {
        queryClient.invalidateQueries({
          queryKey: friendsKeys.requests.received,
        });
      }
    }

    socket.on("userUpdate", onUserUpdate);
    return () => {
      socket.off("userUpdate", onUserUpdate);
    };
  }, [socket, queryClient]);

  const acceptFriendRequest = useMutation({
    mutationFn: (payload: AcceptFriendRequestDto) =>
      friendshipsApi.acceptRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendsKeys.requests.received,
      });
      queryClient.invalidateQueries({ queryKey: friendsKeys.me() });
    },
  });

  const rejectFriendRequest = useMutation({
    mutationFn: (fromUser: string) =>
      friendshipsApi.rejectReceivedRequest(fromUser),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendsKeys.requests.received,
      });
    },
  });

  return {
    ...query,
    acceptFriendRequest,
    rejectFriendRequest,
  };
}