import { authFetch } from "@/app/shared/data/api";
import type {
  OfficeCheckinResponse,
  OfficeReservationWithParticipants,
} from "@/app/features/guard-checkin/types";

const BASE = "/office";

export const officeCheckinApi = {
  /** POST /office/slots/:code/checkin  →  { reservationId } */
  checkin: (slotCode: string) =>
    authFetch<OfficeCheckinResponse>(`${BASE}/slots/${encodeURIComponent(slotCode)}/checkin`, {
      method: "POST",
    }),

  /** GET /office/reservations/:id  →  ReservationWithParticipants */
  getReservation: (id: number) =>
    authFetch<OfficeReservationWithParticipants>(`${BASE}/reservations/${id}`),
} as const;
