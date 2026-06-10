"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/app/shared/socket/socket.context";
import type {
  OfficeUpdateMessage,
  OfficeReservationPublic,
} from "@/app/shared/socket/socket.context";

import { reservationsApi } from "./api";

import type {
  CalendarCell,
  CreateReservationBatchDto,
} from "@/app/features/reservaciones/crear/types/reservaciones";

import type { UserTimelineQuery } from "@/app/features/reservaciones/crear/types/timeline";
import type { ReservationDetail } from "@/app/features/cubiculos/data/types";

export const reservationKeys = {
  all: ["reservations"] as const,

  detail: (id: number | null) =>
    [...reservationKeys.all, "detail", id] as const,

  me: () => [...reservationKeys.all, "me"] as const,

  friends: () => [...reservationKeys.all, "friends"] as const,

  users: () => [...reservationKeys.all, "users"] as const,

  guests: () => [...reservationKeys.all, "guests"] as const,

  events: () => [...reservationKeys.all, "events"] as const,

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
};

function useJoinOfficeRoom() {
  const socket = useSocket();

  useEffect(() => {
    socket.emit("joinOfficeRoom");
    return () => {
      socket.emit("leaveOfficeRoom");
    };
  }, [socket]);
}

function patchReservationDetail(
  existing: ReservationDetail,
  pub: OfficeReservationPublic,
): ReservationDetail {
  return {
    ...existing,
    participants: pub.participants.map((p) => ({
      id: p.id,
      reservationId: pub.id,
      userId: p.user_id,
      guestId: null,
      ownershipPriority: p.ownership_priority ?? 0,
      checkedIn: p.attendance_status === "CHECKED_IN",
      status:
        (p.attendance_status as "PENDING" | "ACCEPTED" | "REJECTED") ??
        "PENDING",
      user: null,
      guest: null,
    })),
  };
}

export function useReservationDetail(id: number | null) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinOfficeRoom();

  const query = useQuery({
    queryKey: reservationKeys.detail(id),
    queryFn: () => reservationsApi.getReservationDetail(id as number),
    enabled: id !== null,
  });

  useEffect(() => {
    if (id === null) return;

    function onOfficeUpdate(msg: OfficeUpdateMessage) {
      if (
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.checkedin" ||
        msg.type === "reservation.checkedout" ||
        msg.type === "reservation.noshow" ||
        msg.type === "reservation.attendance_updated" ||
        msg.type === "participant.updated"
      ) {
        if (msg.payload.id !== id) return;

        queryClient.setQueryData<ReservationDetail>(
          reservationKeys.detail(id),
          (prev) =>
            prev ? patchReservationDetail(prev, msg.payload) : prev,
        );
      }
    }

    socket.on("officeUpdate", onOfficeUpdate);
    return () => {
      socket.off("officeUpdate", onOfficeUpdate);
    };
  }, [socket, queryClient, id]);

  return query;
}

export function useMyReservations() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinOfficeRoom();

  const query = useQuery({
    queryKey: reservationKeys.me(),
    queryFn: () => reservationsApi.getMyReservations(),
  });

  useEffect(() => {
    function onOfficeUpdate(msg: OfficeUpdateMessage) {
      if (
        msg.type === "reservation.created" ||
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.checkedin" ||
        msg.type === "reservation.checkedout" ||
        msg.type === "reservation.noshow" ||
        msg.type === "reservation.attendance_updated" ||
        msg.type === "participant.updated"
      ) {
        queryClient.invalidateQueries({ queryKey: reservationKeys.me() });
      }
    }

    socket.on("officeUpdate", onOfficeUpdate);
    return () => {
      socket.off("officeUpdate", onOfficeUpdate);
    };
  }, [socket, queryClient]);

  return query;
}

export function useFriendsReservations() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinOfficeRoom();

  const query = useQuery({
    queryKey: reservationKeys.friends(),
    queryFn: () => reservationsApi.getFriendsReservations(),
  });

  useEffect(() => {
    function onOfficeUpdate(msg: OfficeUpdateMessage) {
      if (
        msg.type === "reservation.created" ||
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.checkedin" ||
        msg.type === "reservation.checkedout" ||
        msg.type === "reservation.noshow" ||
        msg.type === "reservation.attendance_updated" ||
        msg.type === "participant.updated"
      ) {
        queryClient.invalidateQueries({ queryKey: reservationKeys.friends() });
      }
    }

    socket.on("officeUpdate", onOfficeUpdate);
    return () => {
      socket.off("officeUpdate", onOfficeUpdate);
    };
  }, [socket, queryClient]);

  return query;
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
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinOfficeRoom();

  const queryResult = useQuery({
    queryKey: reservationKeys.userTimeline(userId, query),
    queryFn: () => {
      if (!userId || !query) {
        throw new Error("userId y query son requeridos para timeline");
      }

      return reservationsApi.getUserTimeline(userId, query);
    },
    enabled: Boolean(userId && query) && (options?.enabled ?? true),
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (!userId) return;

    function onOfficeUpdate(msg: OfficeUpdateMessage) {
      if (
        msg.type === "reservation.created" ||
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.checkedin" ||
        msg.type === "reservation.checkedout" ||
        msg.type === "reservation.noshow" ||
        msg.type === "reservation.attendance_updated"
      ) {
        queryClient.invalidateQueries({
          queryKey: reservationKeys.userTimeline(userId, query),
        });
      }
    }

    socket.on("officeUpdate", onOfficeUpdate);
    return () => {
      socket.off("officeUpdate", onOfficeUpdate);
    };
  }, [socket, queryClient, userId, query]);

  return queryResult;
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
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinOfficeRoom();

  const query = useQuery({
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

  useEffect(() => {
    if (!reservableId) return;

    function onOfficeUpdate(msg: OfficeUpdateMessage) {
      if (
        msg.type === "reservation.created" ||
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.checkedin" ||
        msg.type === "reservation.checkedout" ||
        msg.type === "reservation.noshow"
      ) {
        if (msg.payload.reservable_id === reservableId) {
          queryClient.invalidateQueries({
            queryKey: reservationKeys.spaceScheduleItemsInVisibleRange(
              reservableId,
              calendarCells,
            ),
          });
        }
      }
    }

    socket.on("officeUpdate", onOfficeUpdate);
    return () => {
      socket.off("officeUpdate", onOfficeUpdate);
    };
  }, [socket, queryClient, reservableId, calendarCells]);

  return query;
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