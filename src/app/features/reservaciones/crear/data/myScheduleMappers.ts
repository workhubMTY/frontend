import type {
  ScheduleItem,
  ScheduleItemStatus,
} from "@/app/features/reservaciones/crear/types/schedule";

import { toTime } from "./scheduleItems";

import type { MyScheduleApiItem } from "../../confirmar/types/confirmation";

import type {
  TimelineCalendarEvent,
  TimelineOfficeReservation,
  TimelineParkingReservation,
} from "@/app/features/reservaciones/crear/types/timeline";

function toLocalDateId(value: string) {
  const date = new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function officeReservationToScheduleItem(
  reservation: TimelineOfficeReservation,
): ScheduleItem {
  const reservableName =
    reservation.reservable?.name ?? `Espacio ${reservation.reservable_id}`;

  return {
    id: `my-reservation-${reservation.id}`,
    kind: "my_reservation",

    dateId: toLocalDateId(reservation.start_time),
    start: toTime(reservation.start_time),
    end: toTime(reservation.end_time),

    title:
      reservation.category === "MEETING"
        ? `Reunión en ${reservation.reservable?.name ?? "cubículo"}`
        : `Reservación en ${reservation.reservable?.name ?? "cubículo"}`,


    sourceLabel: "Cubículo",

    reservableId: reservation.reservable_id,
    reservableName,
    reservableCode: reservation.reservable.code,
    location:reservation.reservable.code,

    floorId: reservation.reservable?.floor_id ?? null,
    floorName: reservation.reservable?.floor_id
      ? `Piso ${reservation.reservable.floor_id}`
      : null,

    attendanceStatus: reservation.attendance_status,
    lifecycleStatus: reservation.lifecycle_status,
    status:getStatus(reservation.lifecycle_status),

    raw: reservation,
  };
}

export function parkingReservationToScheduleItem(
  item: TimelineParkingReservation,
): ScheduleItem {
  const reservation = item.reservation;
  const parkingLot = item.projection?.parking_lot;

  return {
    id: `parking-reservation-${reservation.id}`,
    kind: "parking_reservation",

    dateId: toLocalDateId(reservation.start_time),
    start: toTime(reservation.start_time),
    end: toTime(reservation.end_time),

    title: "Reservación de estacionamiento",

    location: parkingLot?.name
      ? `Estacionamiento ${parkingLot.name}`
      : "Estacionamiento",

    status: getStatus(reservation.lifecycle_status),

    sourceLabel: "Estacionamiento",

    reservableId: parkingLot?.id ?? null,
    reservableCode: null,
    reservableName: parkingLot?.name ?? null,

    floorId: null,
    floorName: null,

    attendanceStatus: reservation.attendance_status,
    lifecycleStatus: reservation.lifecycle_status,

    raw: item,
  };
}

export function calendarEventToScheduleItem(
  event: TimelineCalendarEvent,
): ScheduleItem | null {
  const start = event.start_time ?? event.start;
  const end = event.end_time ?? event.end;

  if (!start || !end) return null;

  return {
    id: `calendar-event-${event.id}`,
    kind: "calendar_event",

    dateId: toLocalDateId(start),
    start: toTime(start),
    end: toTime(end),

    title: event.title ?? event.summary ?? "Evento",

    location: event.location ?? null,
    sourceLabel: "Calendario",

    reservableId: null,
    reservableName: null,
    reservableCode:null,
    floorId: null,
    floorName: null,

    attendanceStatus: null,
    lifecycleStatus: event.lifecycle_status,
    status: getStatus(event.lifecycle_status),

    raw: event,
  };
}

export function timelineToScheduleItems(params: {
  officeReservations: TimelineOfficeReservation[];
  parkingReservations: TimelineParkingReservation[];
  events: TimelineCalendarEvent[];
}): ScheduleItem[] {
  const officeItems = params.officeReservations.map(
    officeReservationToScheduleItem,
  );

  const parkingItems = params.parkingReservations.map(
    parkingReservationToScheduleItem,
  );

  const eventItems = params.events
    .map(calendarEventToScheduleItem)
    .filter((item): item is ScheduleItem => Boolean(item));

  return [...officeItems, ...parkingItems, ...eventItems];
}

function getStatus(
  lifecycleStatus?: string | null,
): ScheduleItemStatus {
  if (lifecycleStatus === "CANCELED") return "warning";

  return "normal";
}