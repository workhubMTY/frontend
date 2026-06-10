export type ParticipantAttendanceStatus =
  | "INVITED"
  | "NOT_ARRIVED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "NO_SHOW"
  | "NOT_ACCEPTED"
  | "REJECTED"
  | "CANCELED";

export type ReservationAttendanceStatus =
  | "NOT_ARRIVED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "NO_SHOW"
  | "CANCELED";

export type ReservationLifecycleStatus = "ACTIVE" | "CANCELED" | "FINALIZED";

export const PARTICIPANT_USER_TRANSITIONS: Record<
  string,
  ParticipantAttendanceStatus[]
> = {
  INVITED: ["NOT_ARRIVED", "CHECKED_IN", "REJECTED"],
  NOT_ARRIVED: ["CHECKED_IN", "CANCELED"],
  CHECKED_IN: ["CHECKED_OUT"],
};

export type ActiveReservationParticipant = {
  id: number;
  reservationId: number;
  userId: string | null;
  ownershipPriority: number | null;
  attendanceStatus: ParticipantAttendanceStatus | null;
};

export type ActiveReservable = {
  id: number;
  code: string;
  name: string | null;
  capacity: number;
  floor: string;
  floor_id: number;
};

export type ActiveReservation = {
  /** Id de la reservación */
  id: number;
  reservableId: number;
  reservableName: string | null;
  reservableCode: string;
  floorId: number;
  floorName: string;
  category: "RESERVATION" | "MEETING";
  description: string;
  startTime: string;
  endTime: string;
  /** Estado de asistencia del usuario en esta reservación */
  myAttendanceStatus: ParticipantAttendanceStatus;
  /** Id de la fila de participante del usuario (necesario para patchParticipantAttendance) */
  myParticipantId: number;
  /** Todos los participantes */
  participants: ActiveReservationParticipant[];
};

export type ReservationInvitation = Omit<
  ActiveReservation,
  "myAttendanceStatus"
> & {
  myAttendanceStatus: "INVITED";
};

export type ApiParticipant = {
  id: number;
  reservations_id: number;
  user_id: string | null;
  ownership_priority: number | null;
  attendance_status: ParticipantAttendanceStatus | null;
};

export type ApiReservable = {
  id: number;
  code: string;
  name: string | null;
  capacity: number;
  floor: string;
  floor_id: number;
};

export type ApiActiveReservation = {
  id: number;
  reservable_id: number;
  category: "RESERVATION" | "MEETING";
  description: string;
  start_time: string;
  end_time: string;
  attendance_status: ReservationAttendanceStatus;
  lifecycle_status: ReservationLifecycleStatus;
  reservable: ApiReservable;
  participants: ApiParticipant[];
};

export type UpdateParticipantAttendancePayload = {
  reservationId: number;
  participantId: number;
  attendance_status: ParticipantAttendanceStatus;
};
