import { authFetch } from "@/lib/api";
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

export const officeSlotsApi = {
  getAllSlots: () => authFetch<OfficeSlot[]>(`${BASE}/office-slots`),

  getSlotById: (id: number) => authFetch<OfficeSlot>(`${BASE}/office-slots/${id}`),

  getAvailableSlots: (query: AvailableOfficeSlotsQuery) => {
    const params = new URLSearchParams();
    if (query.floor_id) params.append("floor_id", query.floor_id.toString());
    params.append("start_time", query.start_time);
    params.append("end_time", query.end_time);
    if (query.user_id) params.append("user_id", query.user_id);

    return authFetch<SlotAvailabilityResult[]>(`${BASE}/office-slots/available?${params.toString()}`);
  },

  createSlot: (payload: CreateOfficeSlotDto) =>
    authFetch<OfficeSlot>(`${BASE}/office-slots`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateSlot: (id: number, payload: UpdateOfficeSlotDto) =>
    authFetch<OfficeSlot>(`${BASE}/office-slots/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteSlot: (id: number) =>
    authFetch<void>(`${BASE}/office-slots/${id}`, {
      method: "DELETE",
    }),

  blockSlot: (id: number, payload: BlockSlotDto) =>
    authFetch<OfficeSlot>(`${BASE}/office-slots/${id}/block`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getWorkGroups: () => authFetch<WorkGroup[]>(`${BASE}/work-groups`),

  getReservationDetail: (id: number) => authFetch<ReservationDetail>(`${BASE}/${id}`),

  createReservationBatch: (payload: CreateReservationBatchDto) =>
    authFetch<ReservationDetail[]>(`${BASE}/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateParticipantStatus: (id: number, payload: UpdateParticipantStatusDto) =>
    authFetch<ReservationParticipant>(`${BASE}/participants/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  getMyReservations: () => authFetch<UserReservationSummary>(`${BASE}/me`),

  getFriendsReservations: () => authFetch<FriendReservationsSummary>(`${BASE}/me/friends`),

  getEvents: (query?: GetEventsQuery) => {
    const params = new URLSearchParams();

    if (query?.reservable_id) params.append("reservable_id", query.reservable_id.toString());
    if (query?.floor_id) params.append("floor_id", query.floor_id.toString());
    if (query?.start_time) params.append("start_time", query.start_time);
    if (query?.end_time) params.append("end_time", query.end_time);

    const search = params.toString();
    return authFetch<ReservationEvent[]>(`${BASE}/events${search ? `?${search}` : ""}`);
  },

  createEvent: (payload: CreateEventDto) =>
    authFetch<ReservationEvent>(`${BASE}/events`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getUsers: () => authFetch<UserSummary[]>(`${BASE}/users`),

  getGuests: () => authFetch<Guest[]>(`${BASE}/guests`),
};
