// Hooks para el módulo de usuarios
"use client";

import { useEffect, useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSocket } from "@/app/shared/socket/socket.context";
import type { UserUpdateMessage } from "@/app/shared/socket/socket.context";

import { usersApi } from "./api";
import type { CreateUserDto, User, UserProfile, UserViewModel } from "./types";
import { createUserViewModel } from "./types";

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
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: usersKeys.lists(),
    queryFn: usersApi.getAll,
  });

  useEffect(() => {
    function onUserUpdate(msg: UserUpdateMessage) {
      if (msg.type === "user.updated") {
        queryClient.setQueryData<User[]>(usersKeys.lists(), (prev) => {
          if (!prev) return prev;
          return prev.map((u) =>
            u.eId === msg.payload.eId
              ? {
                  ...u,
                  name: msg.payload.name,
                  email: msg.payload.email,
                  roleName: msg.payload.role,
                }
              : u,
          );
        });
        return;
      }

      if (msg.type === "user.deleted") {
        queryClient.setQueryData<User[]>(usersKeys.lists(), (prev) => {
          if (!prev) return prev;
          return prev.filter((u) => u.eId !== msg.payload.eId);
        });
        queryClient.removeQueries({
          queryKey: usersKeys.detail(msg.payload.eId),
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

export function useUser(eId?: string) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: usersKeys.detail(eId ?? ""),
    queryFn: () => usersApi.getById(eId!),
    enabled: !!eId,
  });

  useEffect(() => {
    if (!eId) return;

    function onUserUpdate(msg: UserUpdateMessage) {
      if (msg.type === "user.updated" && msg.payload.eId === eId) {
        queryClient.setQueryData<User>(usersKeys.detail(eId), (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            name: msg.payload.name,
            email: msg.payload.email,
            roleName: msg.payload.role,
          };
        });
      }

      if (msg.type === "user.deleted" && msg.payload.eId === eId) {
        queryClient.removeQueries({ queryKey: usersKeys.detail(eId) });
      }
    }

    socket.on("userUpdate", onUserUpdate);
    return () => {
      socket.off("userUpdate", onUserUpdate);
    };
  }, [socket, queryClient, eId]);

  return query;
}

export function useUserProfile(eId?: string) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: usersKeys.profile(eId ?? ""),
    queryFn: () => usersApi.getProfile(eId!),
    enabled: !!eId,
  });

  useEffect(() => {
    if (!eId) return;

    function onUserUpdate(msg: UserUpdateMessage) {
      if (msg.type === "user.updated" && msg.payload.eId === eId) {
        queryClient.setQueryData<UserProfile>(
          usersKeys.profile(eId),
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              name: msg.payload.name,
              email: msg.payload.email,
              roleName: msg.payload.role,
            };
          },
        );
      }
    }

    socket.on("userUpdate", onUserUpdate);
    return () => {
      socket.off("userUpdate", onUserUpdate);
    };
  }, [socket, queryClient, eId]);

  return query;
}

export function useMyProfile() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: usersKeys.myProfile(),
    queryFn: usersApi.getMyProfile,
  });

  useEffect(() => {
    function onUserUpdate(msg: UserUpdateMessage) {
      if (msg.type === "user.updated") {
        queryClient.setQueryData<UserProfile>(
          usersKeys.myProfile(),
          (prev) => {
            if (!prev) return prev;
            // Solo parchear si el eId coincide con el perfil en caché
            if (prev.eId !== msg.payload.eId) return prev;
            return {
              ...prev,
              name: msg.payload.name,
              email: msg.payload.email,
              roleName: msg.payload.role,
            };
          },
        );
      }
    }

    socket.on("userUpdate", onUserUpdate);
    return () => {
      socket.off("userUpdate", onUserUpdate);
    };
  }, [socket, queryClient]);

  return query;
}

export function useUserFriendships(eId?: string) {
  return useQuery({
    queryKey: usersKeys.friendships(eId ?? ""),
    queryFn: () => usersApi.getFriendships(eId!),
    enabled: !!eId,
  });
}

export function useMyFriendships() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: usersKeys.myFriendships(),
    queryFn: usersApi.getMeFriendships,
  });

  useEffect(() => {
    function onUserUpdate(msg: UserUpdateMessage) {
      if (
        msg.type === "friendship.created" ||
        msg.type === "friendRequest.accepted"
      ) {
        queryClient.invalidateQueries({ queryKey: usersKeys.myFriendships() });
        return;
      }

      if (msg.type === "friendship.removed") {
        queryClient.setQueryData<User[]>(
          usersKeys.myFriendships(),
          (prev) => {
            if (!prev) return prev;
            const { userLow, userHigh } = msg.payload;
            return prev.filter(
              (u) => u.eId !== userLow && u.eId !== userHigh,
            );
          },
        );
      }
    }

    socket.on("userUpdate", onUserUpdate);
    return () => {
      socket.off("userUpdate", onUserUpdate);
    };
  }, [socket, queryClient]);

  return query;
}

export function useUsersByName(name: string) {
  const normalizedName = name.trim();

}