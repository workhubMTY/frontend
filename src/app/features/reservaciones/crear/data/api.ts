import { authFetch } from "@/app/shared/data/api";

import type {
  Guest,
  ReservationDetail,
  ReservationParticipant,
  UpdateParticipantStatusDto,
  UserSummary,
  UserReservationSummary,
  FriendReservationsSummary,
  ReservationSummary,
} from "@/app/features/cubiculos/data/types";

import type {
  UserTimelineData,
  UserTimelineQuery,
} from "@/app/features/reservaciones/crear/types/timeline";

import type {
  CalendarCell,
  CreateReservationBatchDto,
} from "@/app/features/reservaciones/crear/types/reservaciones";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";

import { officeSlotsApi } from "@/app/features/cubiculos/data/api";
import { dateToId } from "@/app/features/reservaciones/crear/lib/dates";

import {
  groupScheduleItemsByDate,
  toTime,
} from "@/app/features/reservaciones/crear/data/scheduleItems";

import type { ParticipantAttendanceStatus } from "../types/reservaciones"

const RESERVATIONS_BASE = `/office/reservations`;

export { groupScheduleItemsByDate };

function appendBooleanParam(
  params: URLSearchParams,
  key: string,
  value: boolean | undefined,
) {
  if (value === undefined) return;

  params.set(key, String(value));
}

function appendArrayParam<T extends string | number>(
  params: URLSearchParams,
  key: string,
  value: T[] | undefined,
) {
  if (!value || value.length === 0) return;

  params.set(key, value.join(","));
}

function buildUserTimelineSearchParams(query: UserTimelineQuery) {
  const params = new URLSearchParams();

  params.set("from", query.from);
  params.set("to", query.to);

  appendBooleanParam(
    params,
    "includeOfficeReservations",
    query.includeOfficeReservations,
  );

  appendBooleanParam(
    params,
    "includeParkingReservations",
    query.includeParkingReservations,
  );

  appendBooleanParam(params, "includeEvents", query.includeEvents);
  appendBooleanParam(params, "includeFriends", query.includeFriends);

  appendArrayParam(params, "officeCategories", query.officeCategories);
  appendArrayParam(params, "includeEIds", query.includeEIds);

  return params.toString();
}

export function getVisibleRange(calendarCells: CalendarCell[]) {
  const dateIds = calendarCells.map((cell) => cell.id).sort();

  const firstDateId = dateIds[0];
  const lastDateId = dateIds[dateIds.length - 1];

  if (!firstDateId || !lastDateId) {
    return null;
  }

  return {
    firstDateId,
    lastDateId,

    from: firstDateId,
    to: lastDateId,

    start_time: new Date(`${firstDateId}T00:00:00`).toISOString(),
    end_time: new Date(`${lastDateId}T23:59:59`).toISOString(),
  };
}

export function reservationSummaryToScheduleItem(
  reservation: ReservationSummary,
): ScheduleItem {
  return {
    id: `space_reservation-${reservation.id}`,
    kind: "space_reservation",

    dateId: dateToId(new Date(reservation.start_time)),
    start: toTime(reservation.start_time),
    end: toTime(reservation.end_time),

    title: "Reservación",
    location: reservation.reservable_name ?? "Cubículo",

    status: "normal",

    sourceLabel: "Cubículo",

    reservableId: reservation.reservable_id ?? null,
    reservableName: reservation.reservable_name ?? null,
    reservableCode: reservation.reservable_code,
    floorId: reservation.floor_id ?? null,
    floorName: reservation.floor_name ?? null,

    attendanceStatus: reservation.attendance_status ?? null,
    lifecycleStatus : reservation.lifecycle_status ?? null,

    raw: reservation,
  };
}

export const reservationsApi = {
  getReservationDetail: (id: number) =>
    authFetch<ReservationDetail>(`${RESERVATIONS_BASE}/${id}`),

  createReservationBatch: (payload: CreateReservationBatchDto) =>
    authFetch<ReservationDetail[]>(`${RESERVATIONS_BASE}/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateParticipantStatus: (reservationId: number, participantId: number, attendance_status: ParticipantAttendanceStatus) =>
    authFetch<ReservationParticipant>(
      `${RESERVATIONS_BASE}/${reservationId}/participants/${participantId}/attendance`,
      {
        method: "PATCH",
        body: JSON.stringify({ attendance_status }),
      },
    ),

  getMyReservations: () =>
    authFetch<UserReservationSummary>(`${RESERVATIONS_BASE}/me`),

  getFriendsReservations: () =>
    authFetch<FriendReservationsSummary>(`${RESERVATIONS_BASE}/me/friends`),

  getUsers: () => authFetch<UserSummary[]>(`${RESERVATIONS_BASE}/users`),

  getGuests: () => authFetch<Guest[]>(`${RESERVATIONS_BASE}/guests`),

  getUserTimeline: (userId: string, query: UserTimelineQuery) => {
    const search = buildUserTimelineSearchParams(query);

    return authFetch<UserTimelineData>(
      `/users/${userId}/timeline?${search}`,
      {
        method: "GET",
      },
    );
  },

  getSpaceScheduleItemsInVisibleRange: async ({
    reservableId,
    calendarCells,
  }: {
    reservableId: number;
    calendarCells: CalendarCell[];
  }): Promise<ScheduleItem[]> => {
    const visibleRange = getVisibleRange(calendarCells);

    if (!visibleRange) return [];

    const reservations = await officeSlotsApi.getSlotReservationsInRange({
      id: reservableId,
      startTime: visibleRange.start_time,
      endTime: visibleRange.end_time,
    });

    return reservations.map(reservationSummaryToScheduleItem);
  },
};