"use client";

import { useMemo } from "react";
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

  const query = useQuery({
    queryKey: friendsKeys.me(),
    queryFn: usersApi.getMeFriendships,
    select: (users) => users.map(createUserViewModel),
  });

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

  const query = useQuery({
    queryKey: friendsKeys.requests.sent,
    queryFn: friendshipsApi.getSentRequests,
  });

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

  const query = useQuery({
    queryKey: friendsKeys.requests.received,
    queryFn: friendshipsApi.getReceivedRequests,
  });

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