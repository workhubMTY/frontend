import { authFetch } from "@/app/shared/data/api";

import type {
  ApiActiveReservation,
  ActiveReservation,
  ReservationInvitation,
  ApiParticipant,
  UpdateParticipantAttendancePayload,
  ParticipantAttendanceStatus,
} from "../types/activeReservations";

const BASE = `/office/reservations`;

function mapParticipant(p: ApiParticipant, reservationId: number) {
  return {
    id: p.id,
    reservationId,
    userId: p.user_id,
    ownershipPriority: p.ownership_priority,
    attendanceStatus: p.attendance_status,
  };
}

function mapToActiveReservation(
  raw: ApiActiveReservation,
  myUserId: string,
): ActiveReservation | null {
  const mine = raw.participants.find((p) => p.user_id === myUserId);
  if (!mine || mine.attendance_status === null) return null;

  return {
    id: raw.id,
    reservableId: raw.reservable.id,
    reservableName: raw.reservable.name,
    reservableCode: raw.reservable.code,
    floorId: raw.reservable.floor_id,
    floorName: raw.reservable.floor,
    category: raw.category,
    description: raw.description,
    startTime: raw.start_time,
    endTime: raw.end_time,
    myAttendanceStatus: mine.attendance_status,
    myParticipantId: mine.id,
    participants: raw.participants.map((p) => mapParticipant(p, raw.id)),
  };
}

async function getMyActiveReservations(
  myUserId: string,
): Promise<ActiveReservation[]> {
  const raw = await authFetch<ApiActiveReservation[]>(
    `${BASE}/me?scope=without_invites`,
  );

  return raw
    .map((r) => mapToActiveReservation(r, myUserId))
    .filter(
      (r): r is ActiveReservation =>
        r !== null &&
        (r.myAttendanceStatus === "NOT_ARRIVED" ||
          r.myAttendanceStatus === "CHECKED_IN"),
    );
}

async function getMyInvitations(
  myUserId: string,
): Promise<ReservationInvitation[]> {
  const raw = await authFetch<ApiActiveReservation[]>(
    `${BASE}/me?scope=invites_only`,
  );

  return raw
    .map((r) => mapToActiveReservation(r, myUserId))
    .filter(
      (r): r is ReservationInvitation =>
        r !== null && r.myAttendanceStatus === "INVITED",
    );
}

function checkinReservation(reservationId: number) {
  return authFetch(`${BASE}/${reservationId}/checkin`, { method: "POST" });
}

function checkoutReservation(reservationId: number) {
  return authFetch(`${BASE}/${reservationId}/checkout`, { method: "POST" });
}

function cancelReservation(reservationId: number) {
  return authFetch(`${BASE}/${reservationId}`, { method: "DELETE" });
}

function updateParticipantAttendance({
  reservationId,
  participantId,
  attendance_status,
}: UpdateParticipantAttendancePayload) {
  return authFetch(
    `${BASE}/${reservationId}/participants/${participantId}/attendance`,
    {
      method: "PATCH",
      body: JSON.stringify({ attendance_status }),
    },
  );
}

function addParticipantToReservation(
  reservationId: number,
  userId: string,
): Promise<unknown> {
  throw new Error(
    `addParticipantToReservation(${reservationId}, ${userId}) — endpoint no disponible aún. Implementar en backend.`,
  );
}

function removeParticipantFromReservation(
  reservationId: number,
  participantId: number,
): Promise<unknown> {
  return updateParticipantAttendance({
    reservationId,
    participantId,
    attendance_status: "CANCELED" as ParticipantAttendanceStatus,
  });
}

export const activeReservationsApi = {
  getMyActiveReservations,
  getMyInvitations,
  checkinReservation,
  checkoutReservation,
  cancelReservation,
  updateParticipantAttendance,
  addParticipantToReservation,
  removeParticipantFromReservation,
};
