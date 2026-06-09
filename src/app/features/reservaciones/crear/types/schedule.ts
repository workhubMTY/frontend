export type ScheduleItemKind =
  | "space_reservation"
  | "my_reservation"
  | "calendar_event"
  | "parking_reservation";

export type ScheduleItemStatus = "normal" | "warning" | "partial" | "conflict";

export type ScheduleItem = {
  id: string;
  kind: ScheduleItemKind;

  dateId: string;
  start: string;
  end: string;

  title: string;
  location: string | null;

  status: ScheduleItemStatus;

  sourceLabel: string;

  reservableId: number | null;
  reservableName: string | null;
  floorId: number | null;
  floorName: string | null;

  attendanceStatus: string | null;
  lifecycleStatus: "ACTIVE" | "FINALIZED" | "CANCELED";

  raw?: unknown;
};

export type ScheduleItemsByDate = Record<string, ScheduleItem[]>;
