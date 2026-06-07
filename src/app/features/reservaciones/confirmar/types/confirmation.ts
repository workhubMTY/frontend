export type GuestKind = "colaborador" | "invitado";

export type ReservationDraftSchedule = {
  start_time: string;
  end_time: string;
};

export type ReservationDraft = {
  reservableId: number;
  reservableName: string;
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