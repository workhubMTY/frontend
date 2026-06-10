export type GuestKind = "colaborador" | "invitado";

export type InvitedGuestSource = "user" | "guest" | "team";

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

export type InvitedGuest = {
  /**
   * Id único para render/lista local.
   * Ejemplos:
   * - user:A01234567
   * - team:5
   * - guest:12
   */
  id: string;

  /**
   * De dónde viene el invitado seleccionado.
   */
  source: InvitedGuestSource;

  /**
   * Id real de la entidad.
   * Para user: eId
   * Para team: id del equipo
   * Para guest: id del invitado externo
   */
  sourceId: string;

  name: string;
  email?: string;

  /**
   * Solo aplica para equipos.
   */
  memberCount?: number;

  helperText?:string;
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

export type CreateReservationBatchDto = {
  reservable_id: number;
  category: ReservationCategory;
  description: string;
  timestamps: TimestampPairDto[];

  /**
   * Por ahora tu backend está usando participantes como users/eIds.
   */
  participants: string[];
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
  id: number;
  kind: MyScheduleApiItemKind;

  title: string | null;
  location: string | null;

  start_time: string;
  end_time: string;

  reservable_id: number | null;
  reservable_name: string | null;
  reservable_code: string;
  floor_id: number | null;
  floor_name: string | null;

  attendance_status: string | null;
  lifecycle_status: "ACTIVE" | "FINALIZED" | "CANCELED"
};