import { authFetch } from "@/app/shared/lib/api";
import type {
  OfficeSlot,
  ReservationDetail,
  SlotAvailabilityResult,
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
} from "./types";

const BASE = "/reservations";
const RESERVABLES = `${BASE}/reservables`;
const RESERVATIONS = BASE;
const EVENTS = `${BASE}/events`;
const WORK_GROUPS = `${BASE}/work-groups`;

export const officeSlotsApi = {
  getAllSlots: () => authFetch<OfficeSlot[]>(`${RESERVABLES}`),

  getSlotById: (id: number) => authFetch<OfficeSlot>(`${RESERVABLES}/${id}`),

  getAvailableSlots: (query: AvailableOfficeSlotsQuery) => {
    const params = new URLSearchParams();
    if (query.floor_id) params.append("floor_id", query.floor_id.toString());
    params.append("start_time", query.start_time);
    params.append("end_time", query.end_time);
    if (query.user_id) params.append("user_id", query.user_id);

    return authFetch<SlotAvailabilityResult[]>(
      `${RESERVABLES}/available?${params.toString()}`,
    );
  },

  createSlot: (payload: CreateOfficeSlotDto) =>
    authFetch<OfficeSlot>(`${RESERVABLES}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateSlot: (id: number, payload: UpdateOfficeSlotDto) =>
    authFetch<OfficeSlot>(`${RESERVABLES}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteSlot: (id: number) =>
    authFetch<void>(`${RESERVABLES}/${id}`, {
      method: "DELETE",
    }),

  blockSlot: (id: number, payload: BlockSlotDto) =>
    authFetch<OfficeSlot>(`${RESERVABLES}/${id}/block`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getWorkGroups: () => authFetch<WorkGroup[]>(`${WORK_GROUPS}`),

  getReservationDetail: (id: number) =>
    authFetch<ReservationDetail>(`${RESERVATIONS}/${id}`),

  createReservationBatch: (payload: CreateReservationBatchDto) =>
    authFetch<ReservationDetail[]>(`${RESERVATIONS}/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateParticipantStatus: (id: number, payload: UpdateParticipantStatusDto) =>
    authFetch<ReservationParticipant>(
      `${RESERVATIONS}/participants/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    ),

  getMyReservations: () =>
    authFetch<UserReservationSummary>(`${RESERVATIONS}/me`),

  getFriendsReservations: () =>
    authFetch<FriendReservationsSummary>(`${RESERVATIONS}/me/friends`),

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

  getUsers: () => authFetch<UserSummary[]>(`${BASE}/users`),

  getGuests: () => authFetch<Guest[]>(`${BASE}/guests`),
};
