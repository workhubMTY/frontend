import { useQuery } from "@tanstack/react-query";

import { reservationsApi } from "@/app/features/reservaciones/crear/data/api";

import type {
  UserTimelineData,
  UserTimelineQuery,
} from "@/app/features/reservaciones/crear/types/timeline";

export const userTimelineKeys = {
  all: ["user-timeline"] as const,

  detail: (userId: string | null, query: UserTimelineQuery | undefined) =>
    [...userTimelineKeys.all, userId, query] as const,
};

export function useUserTimeline(
  userId: string | null,
  query: UserTimelineQuery | undefined,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery<UserTimelineData>({
    queryKey: userTimelineKeys.detail(userId, query),
    queryFn: () => {
      if (!userId || !query) {
        throw new Error("userId y query son requeridos para useUserTimeline");
      }

      return reservationsApi.getUserTimeline(userId, query);
    },
    enabled: Boolean(userId && query) && (options?.enabled ?? true),
    staleTime: 1000 * 30,
  });
}