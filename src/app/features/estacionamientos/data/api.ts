import { authFetch } from "@/app/shared/data/api";
import type {
  ParkingLot,
  CreateParkingLot,
  UpdateParkingLot,
  ParkingReservation,
  CreateParkingReservation,
  ListReservationsQuery,
  ListReservationsResponse,
  ReservationBucketsQuery,
  ReservationBucketsResponse,
  ReservationDetailResponse,
  PatchAttendance,
  ParkingReservationListItem,
} from "./types";

function toSearchParams(params: Record<string, unknown>): URLSearchParams {
  const sp = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (value instanceof Date) {
      sp.set(key, value.toISOString());
    } else if (Array.isArray(value)) {
      if (value.length > 0) sp.set(key, value.join(","));
    } else {
      sp.set(key, String(value));
    }
  }

  return sp;
}

// ─── Parking Lots ─────────────────────────────────────────────────────────────

const BASE = "/parking";

export const parkingLotsApi = {
  create: (payload: CreateParkingLot) =>
    authFetch<ParkingLot>(`${BASE}/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getAll: () => authFetch<ParkingLot[]>(`${BASE}/`),

  /** GET /parking/:id */
  getById: (id: number) => authFetch<ParkingLot>(`${BASE}/${id}`),

  update: (id: number, payload: UpdateParkingLot) =>
    authFetch<ParkingLot>(`${BASE}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (id: number) =>
    authFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
} as const;

// ─── Reservations ─────────────────────────────────────────────────────────────

export const parkingReservationsApi = {
  create: (payload: CreateParkingReservation) =>
    authFetch<ParkingReservation>(`${BASE}/reservations`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  list: (query?: ListReservationsQuery) => {
    const qs = query
      ? `?${toSearchParams(query as Record<string, unknown>)}`
      : "";
    return authFetch<ListReservationsResponse>(`${BASE}/reservations/${qs}`);
  },

  getBuckets: (query: ReservationBucketsQuery) => {
    const qs = toSearchParams(query as Record<string, unknown>);
    return authFetch<ReservationBucketsResponse>(
      `${BASE}/reservations/buckets?${qs}`,
    );
  },

  getMyReservations: (query?: ListReservationsQuery) => {
    const qs = query
      ? `?${toSearchParams(query as Record<string, unknown>)}`
      : "";

    return authFetch<ParkingReservationListItem[]>(
      `${BASE}/reservations/me${qs}`,
    );
  },

  getDetail: (id: number) =>
    authFetch<ReservationDetailResponse>(`${BASE}/reservations/${id}`),

  patchAttendance: (id: number, payload: PatchAttendance) =>
    authFetch<ParkingReservation>(`${BASE}/reservations/${id}/attendance`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  cancel: (id: number) =>
    authFetch<ParkingReservation>(`${BASE}/reservations/${id}`, {
      method: "DELETE",
    }),
} as const;
