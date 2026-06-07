import { authFetch } from "@/app/shared/data/api";
import type {
  OfficeSlot,
  ReservationDetail,
  WorkGroup,
  ReservationParticipant,
  UserSummary,
  Guest,
  CreateOfficeSlotDto,
  UpdateOfficeSlotDto,
  BlockSlotDto,
  AvailableOfficeSlotsQuery,
  CreateReservationBatchDto,
  UpdateParticipantStatusDto,
  UserReservationSummary,
  FriendReservationsSummary,
  ReservationEvent,
  GetEventsQuery,
  CreateEventDto,
  ReservationSummary,
  GetSlotReservationsPayload,
  OfficeSlotSummary,
} from "./types";

const SLOTS_BASE = `/office/slots`;
const EVENTS = `${SLOTS_BASE}/events`;
const WORK_GROUPS = `${SLOTS_BASE}/work-groups`;
const RESERVATIONS_BASE = `/office/reservations`;

function toApiDateTime(value: string | Date | undefined) {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function normalizeSlotReservationsPayload(
  payload?: GetSlotReservationsPayload,
): GetSlotReservationsPayload {
  if (!payload) return {};

  const uniqueDates = payload.dates
    ? Array.from(new Set(payload.dates)).filter(Boolean)
    : undefined;

  if (uniqueDates && uniqueDates.length > 0) {
    return {
      dates: uniqueDates,
    };
  }

  return {
    start_time: toApiDateTime(payload.start_time),
    end_time: toApiDateTime(payload.end_time),
  };
}

export const officeSlotsApi = {
  getAllSlots: () => authFetch<OfficeSlot[]>(`${SLOTS_BASE}/`),

  getSlotById: (id: number) => authFetch<OfficeSlot>(`${SLOTS_BASE}/${id}`),

  getAvailableSlots: (query: AvailableOfficeSlotsQuery) => {
    const params = new URLSearchParams();
    if (query.floorId) params.append("floorId", query.floorId.toString());
    if (query.startTime) params.append("startTime", query.startTime);
    if (query.endTime) params.append("endTime", query.endTime);
    if (query.userId) params.append("userId", query.userId);
    if (query.minCapacity)
      params.append("minCapacity", query.minCapacity.toString());
    if (query.maxCapacity)
      params.append("maxCapacity", query.maxCapacity.toString());
    if (query.query) params.append("query", query.query);
    if (query.daysToApply && query.daysToApply.length > 0) {
      query.daysToApply.forEach((day) => params.append("daysToApply", day));
    }

    return authFetch<OfficeSlotSummary[]>(
      `${SLOTS_BASE}/available?${params.toString()}`,
    );
  },

  createSlot: (payload: CreateOfficeSlotDto) =>
    authFetch<OfficeSlot>(`${SLOTS_BASE}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateSlot: (id: number, payload: UpdateOfficeSlotDto) =>
    authFetch<OfficeSlot>(`${SLOTS_BASE}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteSlot: (id: number) =>
    authFetch<void>(`${SLOTS_BASE}/${id}`, {
      method: "DELETE",
    }),

  blockSlot: (id: number, payload: BlockSlotDto) =>
    authFetch<OfficeSlot>(`${SLOTS_BASE}/${id}/block`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getSlotReservations: (
    id: number,
    payload?: GetSlotReservationsPayload,
    detail = false,
  ) => {
    const params = new URLSearchParams();

    if (detail) {
      params.append("detail", "true");
    }

    const search = params.toString();

    return authFetch<ReservationSummary[]>(
      `${SLOTS_BASE}/${id}/reservations${search ? `?${search}` : ""}`,
      {
        method: "POST",
        body: JSON.stringify(normalizeSlotReservationsPayload(payload)),
      },
    );
  },

  getSlotReservationsInRange: ({
    id,
    startTime,
    endTime,
    detail = false,
  }: {
    id: number;
    startTime: string | Date;
    endTime: string | Date;
    detail?: boolean;
  }) =>
    officeSlotsApi.getSlotReservations(
      id,
      {
        start_time: toApiDateTime(startTime),
        end_time: toApiDateTime(endTime),
      },
      detail,
    ),

  getSlotReservationsForDates: ({
    id,
    dates,
    detail = false,
  }: {
    id: number;
    dates: string[];
    detail?: boolean;
  }) =>
    officeSlotsApi.getSlotReservations(
      id,
      {
        dates,
      },
      detail,
    ),

  getWorkGroups: () => authFetch<WorkGroup[]>(`${WORK_GROUPS}`),

  getReservationDetail: (id: number) =>
    authFetch<ReservationDetail>(`${RESERVATIONS_BASE}/${id}`),

  createReservationBatch: (payload: CreateReservationBatchDto) =>
    authFetch<ReservationDetail[]>(`${RESERVATIONS_BASE}/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateParticipantStatus: (id: number, payload: UpdateParticipantStatusDto) =>
    authFetch<ReservationParticipant>(
      `${RESERVATIONS_BASE}/participants/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    ),

  getMyReservations: () =>
    authFetch<UserReservationSummary>(`${RESERVATIONS_BASE}/me`),

  getFriendsReservations: () =>
    authFetch<FriendReservationsSummary>(`${RESERVATIONS_BASE}/me/friends`),

  getEvents: (query?: GetEventsQuery) => {
    const params = new URLSearchParams();

    if (query?.reservable_id)
      params.append("reservable_id", query.reservable_id.toString());
    if (query?.floor_id) params.append("floor_id", query.floor_id.toString());
    if (query?.start_time) params.append("start_time", query.start_time);
    if (query?.end_time) params.append("end_time", query.end_time);

    const search = params.toString();
    return authFetch<ReservationEvent[]>(
      `${EVENTS}${search ? `?${search}` : ""}`,
    );
  },

  createEvent: (payload: CreateEventDto) =>
    authFetch<ReservationEvent>(`${EVENTS}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getUsers: () => authFetch<UserSummary[]>(`${RESERVATIONS_BASE}/users`),

  getGuests: () => authFetch<Guest[]>(`${RESERVATIONS_BASE}/guests`),
};
