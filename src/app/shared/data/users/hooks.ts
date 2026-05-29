// Hooks para el módulo de usuarios
"use client";

import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { usersApi } from "./api";
import type { CreateUserDto } from "./types";

export const usersKeys = {
  all: ["users"] as const,

  lists: () => [...usersKeys.all, "list"] as const,

  list: (filters?: unknown) =>
    [...usersKeys.lists(), filters] as const,

  detail: (eId: string) =>
    [...usersKeys.all, "detail", eId] as const,

  search: (query: string) =>
    [...usersKeys.all, "search", query] as const,

  profile: (eId: string) =>
    [...usersKeys.all, "profile", eId] as const,

  myProfile: () =>
    [...usersKeys.all, "profile", "me"] as const,

  friendships: (eId: string) =>
    [...usersKeys.all, "friendships", eId] as const,

  myFriendships: () =>
    [...usersKeys.all, "friendships", "me"] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: usersKeys.lists(),
    queryFn: usersApi.getAll,
  });
}

export function useUser(eId?: string) {
  return useQuery({
    queryKey: usersKeys.detail(eId ?? ""),
    queryFn: () => usersApi.getById(eId!),
    enabled: !!eId,
  });
}

export function useUserProfile(eId?: string) {
  return useQuery({
    queryKey: usersKeys.profile(eId ?? ""),
    queryFn: () => usersApi.getProfile(eId!),
    enabled: !!eId,
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: usersKeys.myProfile(),
    queryFn: usersApi.getMyProfile,
  });
}

export function useUserFriendships(eId?: string) {
  return useQuery({
    queryKey: usersKeys.friendships(eId ?? ""),
    queryFn: () => usersApi.getFriendships(eId!),
    enabled: !!eId,
  });
}

export function useMyFriendships() {
  return useQuery({
    queryKey: usersKeys.myFriendships(),
    queryFn: usersApi.getMeFriendships,
  });
}

export function useUsersByName(name: string) {
  const normalizedName = name.trim();

}