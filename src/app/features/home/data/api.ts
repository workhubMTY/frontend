import { authFetch } from "@/app/shared/data/api";
import { ParkingReservationData, OfficeReservations } from "./types";
import { Friend } from "../../perfil/types/profile";

const ParkingLink = "/parking";
const OfficeLink = "/office"
const UserLink = "/users"

export const listParkingReservations = {
    // Get /parking/reservations/me
    getParkingReservationsMe: () => authFetch<ParkingReservationData>(`${ParkingLink}/reservations/me`),
} as const;

export const listOfficeReservations = {
    // Get /office/reservations/me
    getOfficeReservationsMe: () => authFetch<OfficeReservations>(`${OfficeLink}/reservations/me`),
    // Get /office/reservations/:id
    getOfficeReservatiosnId: (id: number) => authFetch<OfficeReservations>(`${OfficeLink}/reservatios/${id}`),
} as const;

export const listFriends = {
    // Get /users/me/friendships
    getUserMeFriendships: () => authFetch<Friend>(`${UserLink}/me/friendship`),
} as const;