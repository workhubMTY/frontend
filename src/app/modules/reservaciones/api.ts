import { authFetch } from "@/lib/api";

export const reservacionesApi = {
  getOfficeSlots: () =>
    authFetch<Array<{ id: number; name: string; capacity: number; floor_id: number; is_blocked: boolean; floor_name: string }>>("/reservations/office-slots"),

  getWorkGroups: () =>
    authFetch<Array<{ id: number; name: string; description: string | null }>>("/reservations/work-groups"),

  getUsers: () =>
    authFetch<Array<{ id: string; name: string; email: string; role: string }>>("/reservations/users"),

  getGuests: () =>
    authFetch<Array<{ id: number; name: string; email: string }>>("/reservations/guests"),

  createReservationBatch: (body: {
    reservableId: number;
    schedules: Array<{ start_time: string; end_time: string }>;
    workGroupIds?: number[];
    userIds?: string[];
    guestIds?: number[];
    canOverlap: boolean;
  }) =>
    authFetch<unknown>("/reservations", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getReservationDetails: (id: number) =>
    authFetch<unknown>(`/reservations/${id}`),

  getMyReservations: () =>
    authFetch<unknown>("/reservations/me"),

  getMyFriendsReservations: () =>
    authFetch<unknown>("/reservations/me/friends"),
};
