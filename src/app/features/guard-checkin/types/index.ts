import type { ReactNode } from "react";

// Parking-specific

export type ReservationLifecycleStatus = "ACTIVE" | "CANCELED" | "FINALIZED";

export type ReservationAttendanceStatus =
  | "CANCELED"
  | "NOT_ARRIVED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "NO_SHOW";

export type CheckinReservation = {
  id: number;
  user_id: string;
  start_time: Date;
  end_time: Date;
  lifecycle_status: ReservationLifecycleStatus;
  attendance_status: ReservationAttendanceStatus;
  canceled_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type CheckinParkingLot = {
  id: number;
  name: string;
  capacity: number;
  priority: number;
};

export type CheckinReservationDetail = {
  reservation: CheckinReservation;
  projection: {
    parking_lot: CheckinParkingLot | null;
    slot_index: number | null;
    fifo_position: number;
  } | null;
};

// ─── Generic checkin result (used by both parking and office) ─────────────────

export type CheckinResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; successContent: ReactNode; closeLabel?: string }
  | { status: "error"; message: string }
  | { status: "invalid"; message: string }
  | {
      status: "early";
      message: string;
      minutesUntil: number;
      nextReservation: EarlyNextReservation | null;
      todayReservations: EarlyReservationSummary[];
    };

export type EarlyNextReservation = {
  id: number;
  start_time: string;
  end_time: string;
  reservable_code: string;
};

export type EarlyReservationSummary = {
  id: number;
  start_time: string;
  end_time: string;
  reservable_code: string;
  minutesUntilCheckin?: number;
};

// Office-specific

export type OfficeReservable = {
  id: number;
  code: string;
  name: string | null;
  capacity: number;
  floor: string;
  status: "available" | "occupied" | "soon" | "blocked";
  is_blocked: boolean;
};

export type OfficeParticipant = {
  id: number;
  reservations_id: number;
  user_id: string | null;
  ownership_priority: number | null;
  attendance_status: string | null;
  created_at: Date;
  updated_at: Date;
};

export type OfficeReservationWithParticipants = {
  id: number;
  reservable_id: number;
  category: "RESERVATION" | "MEETING";
  start_time: Date;
  end_time: Date;
  description: string;
  attendance_status: string;
  lifecycle_status: string;
  created_at: Date;
  updated_at: Date;
  reservable: OfficeReservable;
  participants: OfficeParticipant[];
};

// Response from POST /office/slots/:code/checkin
export type OfficeCheckinResponse = {
  reservationId: number;
};

// Response shape when check-in is too early (425 Too Early)
export type OfficeEarlyCheckinResponse = {
  nextReservation: EarlyNextReservation | null;
  todayReservations: EarlyReservationSummary[];
  minutesUntilCheckinAvailable: number;
};
