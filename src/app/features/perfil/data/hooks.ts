"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useTeams(options?: UseTeamsOptions) {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => {

      return perfilApi.getTeams();
    },
    enabled: (options?.enabled ?? true),
  });
}
type UseTeamMembersOptions = {
  enabled?: boolean;
};

export function useTeamMembers(
  teamId?: string | null,
  options?: UseTeamMembersOptions,
) {
  return useQuery({
    queryKey: ["team-members", teamId],
    queryFn: () => {
      if (!teamId) {
        throw new Error("teamId is required to fetch team members.");
      }

      return perfilApi.getTeamMembers(teamId);
    },
    enabled: Boolean(teamId) && (options?.enabled ?? true),
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: perfilApi.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
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