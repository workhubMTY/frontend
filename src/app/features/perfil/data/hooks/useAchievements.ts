import { useQuery } from "@tanstack/react-query";
import { perfilApi } from "../api";
import { Friend } from "../../types/profile";

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