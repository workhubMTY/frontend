"use client";

import { useQuery } from "@tanstack/react-query";
import { perfilApi } from "./api";
import { Friend } from "./types";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => perfilApi.getProfile(),
  });
}

export function useFriends() {
  return useQuery({
    queryKey: ["friendships"],
    queryFn: () => perfilApi.getFriends(),
  });
}

type UseAchievementsOptions = {
  enabled?: boolean;
};

export function useAchievements(
  userId?: string | null,
  options?: UseAchievementsOptions,
) {
  return useQuery({
    queryKey: ["achievements", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("userId is required to fetch achievements.");
      }

      return perfilApi.getAchievements(userId);
    },
    enabled: Boolean(userId) && (options?.enabled ?? true),
  });
}

type UseTeamsOptions = {
  enabled?: boolean;
};

export function useTeams(userId?: string | null, options?: UseTeamsOptions) {
  return useQuery({
    queryKey: ["teams", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("userId is required to fetch teams.");
      }

      return perfilApi.getTeams(userId);
    },
    enabled: Boolean(userId) && (options?.enabled ?? true),
  });
}


export function useUsers(query?: string, excludeId?: string) {
  return useQuery({
    queryKey: ["users", query, excludeId],
    queryFn: () => perfilApi.getUsers(query, excludeId),
  });
}

export function useSelectedFriendAchievements({
  selectedFriendId,
  friends,
}: {
  selectedFriendId: string | null;
  friends: Friend[];
}) {
  const selectedFriend = friends.find(
    (friend) => String(friend.eId) === String(selectedFriendId),
  );
console.log("friends:", friends);
console.log("selectedFriendId:", selectedFriendId);
console.log("selectedFriend:", selectedFriend);

  const friendUserId = selectedFriend?.eId;

  const achievementsQuery = useAchievements(String(friendUserId) ?? undefined, {
    enabled: Boolean(friendUserId),
  });

  return {
    ...achievementsQuery,
    data:
      selectedFriend && achievementsQuery.data
        ? {
            name: selectedFriend.name,
            achievements: achievementsQuery.data,
          }
        : null,
  };
}