import { officeSlotsApi } from "@/app/features/cubiculos/data/api";

import type {
  ReservationEvent,
  ReservationSummary,
} from "@/app/features/cubiculos/data/types";

import type {
  ApiReservation,
  CalendarCell,
  DayEvent,
  TimelineEvent,
} from "@/app/features/reservaciones/crear/types/reservaciones";

import { dateToId } from "@/app/features/reservaciones/crear/lib/dates";

type SpaceReservationsByDate = Record<string, TimelineEvent[]>;

function getTimeFromIso(isoDate: string) {
  return isoDate.slice(11, 16);
}

function getEventLocation(event: ReservationEvent) {
  return event.reservable?.name ?? "Reservación";
}

function getUniqueDateIds(dateIds: string[]) {
  return Array.from(new Set(dateIds)).filter(Boolean);
}

function toApiReservationFromSlotReservation(
  reservation: ReservationSummary,
): ApiReservation {
  return {
    id: String(reservation.id),
    dateId: dateToId(new Date(reservation.start_time)),
    title: "Reservación",
    location: reservation.reservable_name ?? "Cubículo",
    start: getTimeFromIso(reservation.start_time),
    end: getTimeFromIso(reservation.end_time),
  };
}

function toApiReservationFromEvent(event: ReservationEvent): ApiReservation {
  const location = getEventLocation(event);

  return {
    id: String(event.id),
    dateId: dateToId(new Date(event.start_time)),
    title: event.title ?? location,
    location,
    start: getTimeFromIso(event.start_time),
    end: getTimeFromIso(event.end_time),
  };
}

export function toTimelineEvent(
  event: ApiReservation,
  row: "reserved" | "external",
): TimelineEvent {
  return {
    id: event.id,
    dateId: event.dateId,
    label: `${event.start} - ${event.end}`,
    title: `${event.title} · ${event.location}`,
    start: event.start,
    end: event.end,
    row,
  };
}

export function toDayEvent(
  event: ApiReservation,
  source: DayEvent["source"],
  status: DayEvent["status"],
): DayEvent {
  return {
    id: event.id,
    dateId: event.dateId,
    title: event.title,
    location: event.location,
    time: `${event.start} - ${event.end}`,
    start: event.start,
    end: event.end,
    source,
    status,
  };
}

export function getVisibleRange(calendarCells: CalendarCell[]) {
  const dateIds = calendarCells.map((cell) => cell.id).sort();

  const firstDateId = dateIds[0];
  const lastDateId = dateIds[dateIds.length - 1];

  if (!firstDateId || !lastDateId) {
    return null;
  }

  return {
    firstDateId,
    lastDateId,
    start_time: new Date(`${firstDateId}T00:00:00`).toISOString(),
    end_time: new Date(`${lastDateId}T23:59:59`).toISOString(),
  };
}

export function groupTimelineEventsByDate(
  events: TimelineEvent[],
): SpaceReservationsByDate {
  return events.reduce<SpaceReservationsByDate>((eventsByDate, event) => {
    const dateId = event.dateId;

    if (!eventsByDate[dateId]) {
      eventsByDate[dateId] = [];
    }

    eventsByDate[dateId].push(event);

    return eventsByDate;
  }, {});
}

/**
 * Reservaciones del cubículo dentro del rango visible del calendario.
 * Útil para alimentar el scheduler y pintar conflictos generales.
 */
export async function apiGetSlotReservationsInVisibleRange({
  reservableId,
  calendarCells,
}: {
  reservableId: number;
  calendarCells: CalendarCell[];
}): Promise<ReservationSummary[]> {
  const visibleRange = getVisibleRange(calendarCells);

  if (!visibleRange) return [];

  return officeSlotsApi.getSlotReservationsInRange({
    id: reservableId,
    startTime: visibleRange.start_time,
    endTime: visibleRange.end_time,
  });
}

/**
 * Reservaciones del cubículo en días específicos no necesariamente continuos.
 * Útil para mostrar eventos/reservaciones de los días seleccionados.
 */
export async function apiGetSlotReservationsForSelectedDates({
  reservableId,
  dateIds,
}: {
  reservableId: number;
  dateIds: string[];
}): Promise<ReservationSummary[]> {
  const dates = getUniqueDateIds(dateIds);

  if (dates.length === 0) return [];

  return officeSlotsApi.getSlotReservationsForDates({
    id: reservableId,
    dates,
  });
}

/**
 * Eventos externos dentro del rango visible.
 */
export async function apiGetExternalEventsInVisibleRange({
  reservableId,
  calendarCells,
}: {
  reservableId: number;
  calendarCells: CalendarCell[];
}): Promise<DayEvent[]> {
  const visibleRange = getVisibleRange(calendarCells);

  if (!visibleRange) return [];

  const events = await officeSlotsApi.getEvents({
    reservable_id: reservableId,
    start_time: visibleRange.start_time,
    end_time: visibleRange.end_time,
  });

  return events
    .map(toApiReservationFromEvent)
    .map((event) => toDayEvent(event, "external", "normal"));
}


export async function apiGetReservationEventsForSelectedDates({
  reservableId,
  dateIds,
}: {
  reservableId: number;
  dateIds: string[];
}): Promise<DayEvent[]> {
  const dates = getUniqueDateIds(dateIds);

  if (dates.length === 0) return [];

  const dateIdSet = new Set(dates);

  const reservations = await officeSlotsApi.getSlotReservationsForDates({
    id: reservableId,
    dates,
  });

  return reservations
    .map(toApiReservationFromSlotReservation)
    .filter((reservation) => dateIdSet.has(reservation.dateId))
    .map((reservation) => toDayEvent(reservation, "space", "partial"));
}

/**
 * Reservaciones del slot convertidas a TimelineEvent para el rango visible.
 * Útil para alimentar spaceReservationsByDate.
 */
export async function apiGetTimelineReservationsInVisibleRange({
  reservableId,
  calendarCells,
}: {
  reservableId: number;
  calendarCells: CalendarCell[];
}): Promise<TimelineEvent[]> {
  const reservations = await apiGetSlotReservationsInVisibleRange({
    reservableId,
    calendarCells,
  });

  return reservations
    .map(toApiReservationFromSlotReservation)
    .map((reservation) => toTimelineEvent(reservation, "reserved"));
}

/**
 * Reservaciones del slot convertidas a TimelineEvent para días seleccionados.
 */
export async function apiGetTimelineReservationsForSelectedDates({
  reservableId,
  dateIds,
}: {
  reservableId: number;
  dateIds: string[];
}): Promise<TimelineEvent[]> {
  const reservations = await apiGetSlotReservationsForSelectedDates({
    reservableId,
    dateIds,
  });

  return reservations
    .map(toApiReservationFromSlotReservation)
    .map((reservation) => toTimelineEvent(reservation, "reserved"));
}