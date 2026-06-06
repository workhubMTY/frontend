import { authFetch } from "@/app/shared/data/api";
import type { 
    Parking, 
    ParkingReservations, 
    ParkingReservationData, 
    GetParkingReservationsParams,
    Users,
    Friendships,
    OfficeReservations
} from "./types";

const ParkingLink = "/parking";
const OfficeLink = "/office"
const UserLink = "/users"

export const listParkingReservations = {
  // Get /parking
  getParking: () => authFetch<Parking>(`${ParkingLink}`),
  // Get /parking/:id
  getParkingId: (eId: string) => authFetch<Parking>(`${ParkingLink}/${eId}`),
  // Get /parking/reservations
  getparkingReservations: (params?: GetParkingReservationsParams) => {
    const searchParams = new URLSearchParams();

    if (params?.limit) {
      searchParams.append("limit", String(params.limit));
    }
    if (params?.cursor) {
      searchParams.append("cursor", params.cursor);
    }

    const query = searchParams.toString();

    return authFetch<ParkingReservations>(
      `${ParkingLink}/reservations${query ? `?${query}` : ""}`
    );
  },
  // Get /parking/reservations/:id
  getParkingReservationsId: (eId: string) => authFetch<ParkingReservationData>(`${ParkingLink}/reservations/${eId}`),
  // Get /parking/reservations/me
  getParkingReservationsme: () => authFetch<ParkingReservationData>(`${ParkingLink}/reservations/me`),
} as const;

export const listOfficeReservations = {
  // Get /office/reservations
  getOfficeReservations: () => authFetch<OfficeReservations>(`${OfficeLink}/reservations`),
} as const

export const listUsers = {
    // Get /users
    getUsers: () => authFetch<Users>(`${UserLink}`),
    // Get /users/:eId/friendships
    getUsersFriendships: (eId: string) => authFetch<Friendships>(`${UserLink}/${eId}/friendships`),
} as const