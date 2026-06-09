import { authFetch } from "@/app/shared/data/api";
import type { CheckinReservationDetail, CheckinReservation } from "../types";

const BASE = "/parking/reservations";

export const guardCheckinApi = {
  getReservation: (id: number) =>
    authFetch<CheckinReservationDetail>(`${BASE}/${id}`),

  checkin: (id: number) =>
    authFetch<CheckinReservation>(`${BASE}/${id}/checkin`, {
      method: "POST",
    }),
} as const;
