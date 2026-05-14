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
} from "./types";

export const officeSlotsApi = {
  getAllSlots: () => authFetch<OfficeSlot[]>("/office-slots"),

  getSlotById: (id: number) => authFetch<OfficeSlot>(`/office-slots/${id}`),

  getAvailableSlots: (query: AvailableOfficeSlotsQuery) => {
    const params = new URLSearchParams();
    if (query.floor_id) params.append("floor_id", query.floor_id.toString());
    params.append("start_time", query.start_time);
    params.append("end_time", query.end_time);
    if (query.user_id) params.append("user_id", query.user_id);
    return authFetch<SlotAvailabilityResult[]>(
      `/office-slots/available?${params.toString()}`
    );
  },

  createSlot: (payload: CreateOfficeSlotDto) =>
    authFetch<OfficeSlot>("/office-slots", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateSlot: (id: number, payload: UpdateOfficeSlotDto) =>
    authFetch<OfficeSlot>(`/office-slots/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteSlot: (id: number) =>
    authFetch<void>(`/office-slots/${id}`, {
      method: "DELETE",
    }),

  blockSlot: (id: number, payload: BlockSlotDto) =>
    authFetch<OfficeSlot>(`/office-slots/${id}/block`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getWorkGroups: () => authFetch<WorkGroup[]>("/work-groups"),

  getReservationDetail: (id: number) =>
    authFetch<ReservationDetail>(`/${id}`),

  createReservationBatch: (payload: CreateReservationBatchDto) =>
    authFetch<ReservationDetail[]>("/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateParticipantStatus: (
    id: number,
    payload: UpdateParticipantStatusDto
  ) =>
    authFetch<ReservationParticipant>(`/participants/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  getMyReservations: () =>
    authFetch<ReservationDetail[]>("/me"),

  getFriendsReservations: () =>
    authFetch<ReservationDetail[]>("/me/friends"),

  getUsers: () => authFetch<UserSummary[]>("/users"),

  getGuests: () => authFetch<Guest[]>("/guests"),
};
