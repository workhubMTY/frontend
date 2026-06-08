export type GuestKind = "colaborador" | "invitado";

export type ReservationDraftSchedule = {
  start_time: string;
  end_time: string;
};

export type ReservationDraft = {
  reservableId: number;
  reservableName: string;
  reservableCode: string;
  schedules: ReservationDraftSchedule[];
};

export type ReservationSession = {
  dateLabel: string;
  startLabel: string;
  endLabel: string;
};

export type PersonOption = {
  id: string;
  name: string;
  email: string;
  kind: GuestKind;
};

export type WorkGroupOption = {
  id: string;
  name: string;
  memberCount: number;
  colorClassName: string;
};

export type InvitedGuest = {
  id: string;
  name: string;
  email: string;
  kind: GuestKind;
};

export type CreateReservationGuestsPayload = {
  userIds: string[];
  guestIds: number[];
  workGroupIds: number[];
};


export type ReservationCategory = "MEETING" | "RESERVATION";

export type TimestampPairDto = {
  start_time: string;
  end_time: string;
};

export type UserTimelineQuery = {
  from: string;
  to: string;

  includeOfficeReservations?: boolean;
  officeCategories?: ReservationCategory[];

  includeParkingReservations?: boolean;
  includeEvents?: boolean;
  includeFriends?: boolean;

  includeEIds?: string[];
};

export type MyScheduleApiItemKind =
  | "office_reservation"
  | "parking_reservation"
  | "event";

export type MyScheduleApiItem = {
  id: string | number;
  kind: MyScheduleApiItemKind;

  title: string | null;
  location: string | null;

  start_time: string;
  end_time: string;

  reservable_id: number | null;
  reservable_name: string | null;
  floor_id: number | null;
  floor_name: string | null;

  attendance_status: string | null;

  raw?: unknown;
};