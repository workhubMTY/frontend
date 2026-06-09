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

function getScheduleItemKind(item: MyScheduleApiItem): ScheduleItem["kind"] {
  if (item.kind === "parking_reservation") return "parking_reservation";
  if (item.kind === "event") return "calendar_event";

  return "my_reservation";
}

function getSourceLabel(kind: ScheduleItem["kind"]) {
  if (kind === "parking_reservation") return "Parking";
  if (kind === "calendar_event") return "Evento";
  if (kind === "my_reservation") return "Reservación";

  return "Agenda";
}

function getDefaultTitle(kind: ScheduleItem["kind"]) {
  if (kind === "parking_reservation") return "Reservación de estacionamiento";
  if (kind === "calendar_event") return "Evento";

  return "Mi reservación";
}

function getDefaultStatus(): ScheduleItem["status"] {
  return "normal";
}

/**
 * Mapper legado.
 * Déjalo si alguna llamada vieja todavía regresa MyScheduleApiItem[].
 */
export function myScheduleApiItemToScheduleItem(
  item: MyScheduleApiItem,
): ScheduleItem {
  const kind = getScheduleItemKind(item);

  return {
    id: item.id,
    kind,

    dateId: toLocalDateId(item.start_time),
    start: toTime(item.start_time),
    end: toTime(item.end_time),

    title: item.title ?? getDefaultTitle(kind),
    location: item.location ?? item.reservable_name ?? null,

    status: getDefaultStatus(),

    sourceLabel: getSourceLabel(kind),

    reservableId: item.reservable_id ?? null,
    reservableName: item.reservable_name ?? null,
    floorId: item.floor_id ?? null,
    floorName: item.floor_name ?? null,

    attendanceStatus: item.attendance_status ?? null,
    lifecycleStatus: item.lifecycle_status ?? null,

    raw: item,
  };
}

export function officeReservationToScheduleItem(
  reservation: TimelineOfficeReservation,
): ScheduleItem {
  const reservableName =
    reservation.reservable?.name ?? `Espacio ${reservation.reservable_id}`;

  return {
    id:reservation.id,
    kind: "my_reservation",

    dateId: toLocalDateId(reservation.start_time),
    start: toTime(reservation.start_time),
    end: toTime(reservation.end_time),

    title:
      reservation.category === "MEETING"
        ? "Reunión"
        : "Reservación de espacio",

    location: reservableName,

    sourceLabel: "Cubículo",

    reservableId: reservation.reservable_id,
    reservableName,

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
    id: reservation.id,
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
    id:event.id,
    kind: "calendar_event",

    dateId: toLocalDateId(start),
    start: toTime(start),
    end: toTime(end),

    title: event.title ?? event.summary ?? "Evento",

    location: event.location ?? null,
    sourceLabel: "Calendario",

    reservableId: null,
    reservableName: null,
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