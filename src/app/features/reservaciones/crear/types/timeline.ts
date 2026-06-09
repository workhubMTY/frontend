// src/app/features/reservaciones/crear/types/timeline.ts

export type TimelineOfficeReservationCategory = "MEETING" | "RESERVATION";

export type UserTimelineQuery = {
  from: string;
  to: string;

  includeOfficeReservations?: boolean;
  officeCategories?: TimelineOfficeReservationCategory[];

  includeParkingReservations?: boolean;
  includeEvents?: boolean;
  includeFriends?: boolean;

  includeEIds?: string[];
};

export type TimelineOfficeReservation = {
  id: number;
  reservable_id: number;
  category: TimelineOfficeReservationCategory;

  start_time: string;
  end_time: string;

  description: string | null;
  attendance_status: string | null;

  created_at: string;
  updated_at: string;

  lifecycle_status: "ACTIVE" | "FINALIZED" | "CANCELED";

  reservable: {
    id: number;
    name: string | null;
    capacity: number | null;
    floor_id: number | null;
    is_blocked: boolean;
    code: string
  };

  participants: Array<{
    id: number;
    reservations_id: number;
    user_id: string | null;
    ownership_priority: number | null;
    attendance_status: string | null;
    created_at: string;
    updated_at: string;
  }>;
};

export type TimelineParkingReservation = {
  reservation: {
    id: number;
    user_id: string;

    start_time: string;
    end_time: string;

    attendance_status: string | null;
    canceled_at: string | null;

    created_at: string;
    updated_at: string;

  lifecycle_status: "ACTIVE" | "FINALIZED" | "CANCELED"
  };

  projection: {
    parking_lot: {
      id: number;
      name: string;
      capacity: number;
      priority: number;
    } | null;

    slot_index: number | null;
    fifo_position: number | null;
  } | null;
};

export type TimelineCalendarEvent = {
  id:  number;

  title?: string | null;
  summary?: string | null;

  start_time?: string;
  end_time?: string;

  start?: string;
  end?: string;

  location?: string | null;
  lifecycle_status: "ACTIVE" | "CANCELED";
  raw?: unknown;
};

export type UserTimelineData = {
  from: string;
  to: string;

  user: {
    eId: string;

    events: TimelineCalendarEvent[];
    officeReservations: TimelineOfficeReservation[];
    parkingReservations: TimelineParkingReservation[];
  };
};