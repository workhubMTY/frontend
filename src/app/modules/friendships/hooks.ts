"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../users/api";
import { friendshipsApi } from "./api";
import type {
  FriendRequest,
  CreateFriendRequestDto,
  AcceptFriendRequestDto,
} from "./types";

export function useFriends() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["friends", "me"],
    queryFn: () => usersApi.getMeFriendships(),
  });

  const removeFriend = useMutation({
    mutationFn: (userId: string) =>
      friendshipsApi.remove({ userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friends", "me"],
      });
    },
  });

  return {
    ...query,
    removeFriend,
  }
}

export function useSentFriendRequests() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["friendRequests", "sent"],
    queryFn: () => friendshipsApi.getSentRequests(),
  });

  const createFriendRequest = useMutation({
    mutationFn: (payload: CreateFriendRequestDto) =>
      friendshipsApi.createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendRequests", "sent"],
      });
    },
  });

  const cancelFriendRequest = useMutation({
    mutationFn: (toUser: string) =>
      friendshipsApi.cancelSentRequest(toUser),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendRequests", "sent"],
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
    queryKey: ["friendRequests", "received"],
    queryFn: () => friendshipsApi.getReceivedRequests(),
  });

  const acceptFriendRequest = useMutation({
    mutationFn: (payload: AcceptFriendRequestDto) =>
      friendshipsApi.acceptRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendRequests", "received"],
      });
    },
  });

  const rejectFriendRequest = useMutation({
    mutationFn: (fromUser: string) =>
      friendshipsApi.rejectReceivedRequest(fromUser),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendRequests", "received"],
      });
    },
  });

  return {
    ...query,
    acceptFriendRequest,
    rejectFriendRequest,
  };
}