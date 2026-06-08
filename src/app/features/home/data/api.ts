import { authFetch } from "@/app/shared/data/api";
import { ParkingReservationData, OfficeReservations } from "./types";
import { Friend } from "../../perfil/types/profile";

const ParkingLink = "/parking";
const OfficeLink = "/office";
const UserLink = "/users";

export type ReservationsQuery = {
  user_id?: string;
  start_time?: string;
  end_time?: string;
  limit?: number;
  cursor?: string | null;
};

export const listParkingReservations = {
  // GET /parking/reservations
  getParkingReservations: (params?: ReservationsQuery) => {
    const qs = params ? "?" + new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])
      )
    ).toString() : "";
    return authFetch<ParkingReservationData>(`${ParkingLink}/reservations${qs}`);
  },
  // GET /parking/reservations/me
  getParkingReservationsMe: () =>
    authFetch<ParkingReservationData>(`${ParkingLink}/reservations/me`),
} as const;

export const listOfficeReservations = {
  // GET /office/reservations
  getOfficeReservations: (params?: ReservationsQuery) => {
    const qs = params ? "?" + new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])
      )
    ).toString() : "";
    return authFetch<OfficeReservations>(`${OfficeLink}/reservations${qs}`);
  },
  // GET /office/reservations/me
  getOfficeReservationsMe: () => authFetch<OfficeReservations>(`${OfficeLink}/reservations/me`),
  // GET /office/reservations/:id
  getOfficeReservationsId: (eId: string) => authFetch<OfficeReservations>(`${OfficeLink}/users/${eId}/reservations`),
} as const;

export const listFriends = {
  // GET /users/me/friendships
  getUserMeFriendships: () => authFetch<Friend>(`${UserLink}/me/friendships`),
} as const;