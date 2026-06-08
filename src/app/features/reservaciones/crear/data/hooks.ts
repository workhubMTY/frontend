import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { reservationsApi } from "./api";

import type {
  CalendarCell,
  CreateReservationBatchDto,
} from "@/app/features/reservaciones/crear/types/reservaciones";

import type { UserTimelineQuery } from "@/app/features/reservaciones/confirmar/types/confirmation";

export const reservationKeys = {
  all: ["reservations"] as const,

  detail: (id: number | null) =>
    [...reservationKeys.all, "detail", id] as const,

  me: () => [...reservationKeys.all, "me"] as const,

  friends: () => [...reservationKeys.all, "friends"] as const,

  users: () => [...reservationKeys.all, "users"] as const,

  guests: () => [...reservationKeys.all, "guests"] as const,

  userTimeline: (userId: string | null, query: UserTimelineQuery | undefined) =>
    [
      ...reservationKeys.all,
      "user-timeline",
      userId,
      query?.from,
      query?.to,
      query?.includeOfficeReservations,
      query?.officeCategories?.join(","),
      query?.includeParkingReservations,
      query?.includeEvents,
      query?.includeFriends,
      query?.includeEIds?.join(","),
    ] as const,

  spaceScheduleItemsInVisibleRange: (
    reservableId: number | null,
    calendarCells: CalendarCell[],
  ) =>
    [
      ...reservationKeys.all,
      "space-schedule-items-visible-range",
      reservableId,
      calendarCells.map((cell) => cell.id).join(","),
    ] as const,

  myScheduleItemsInVisibleRange: (
    userId: string | null,
    calendarCells: CalendarCell[],
    includeEIds?: string[],
  ) =>
    [
      ...reservationKeys.all,
      "my-schedule-items-visible-range",
      userId,
      calendarCells.map((cell) => cell.id).join(","),
      includeEIds?.join(","),
    ] as const,
};

export function useReservationDetail(id: number | null) {
  return useQuery({
    queryKey: reservationKeys.detail(id),
    queryFn: () => reservationsApi.getReservationDetail(id as number),
    enabled: id !== null,
  });
}

export function useMyReservations() {
  return useQuery({
    queryKey: reservationKeys.me(),
    queryFn: () => reservationsApi.getMyReservations(),
  });
}

export function useFriendsReservations() {
  return useQuery({
    queryKey: reservationKeys.friends(),
    queryFn: () => reservationsApi.getFriendsReservations(),
  });
}

export function useReservationUsers() {
  return useQuery({
    queryKey: reservationKeys.users(),
    queryFn: () => reservationsApi.getUsers(),
  });
}

export function useReservationGuests() {
  return useQuery({
    queryKey: reservationKeys.guests(),
    queryFn: () => reservationsApi.getGuests(),
  });
}

export function useUserTimeline(
  userId: string | null,
  query: UserTimelineQuery | undefined,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: reservationKeys.userTimeline(userId, query),
    enabled: Boolean(userId && query) && (options?.enabled ?? true),
    queryFn: () => reservationsApi.getUserTimeline(userId!, query!),
  });
}

export function useSpaceScheduleItemsInVisibleRange({
  reservableId,
  calendarCells,
  enabled = true,
}: {
  reservableId: number | null;
  calendarCells: CalendarCell[];
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: reservationKeys.spaceScheduleItemsInVisibleRange(
      reservableId,
      calendarCells,
    ),
    enabled: Boolean(reservableId) && enabled,
    queryFn: () =>
      reservationsApi.getSpaceScheduleItemsInVisibleRange({
        reservableId: reservableId!,
        calendarCells,
      }),
  });
}

export function useMyScheduleItemsInVisibleRange({
  userId,
  calendarCells,
  includeEIds,
  enabled = true,
}: {
  userId: string | null;
  calendarCells: CalendarCell[];
  includeEIds?: string[];
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: reservationKeys.myScheduleItemsInVisibleRange(
      userId,
      calendarCells,
      includeEIds,
    ),
    enabled: Boolean(userId) && enabled,
    queryFn: () =>
      reservationsApi.getMyScheduleItemsInVisibleRange({
        userId: userId!,
        calendarCells,
        includeEIds,
      }),
  });
}

export function useCreateReservationBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReservationBatchDto) =>
      reservationsApi.createReservationBatch(payload),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: reservationKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: ["office", "slots"],
        }),

        variables.reservable_id
          ? queryClient.invalidateQueries({
              queryKey: ["office", "slots", variables.reservable_id],
            })
          : Promise.resolve(),
      ]);
    },
  });
}