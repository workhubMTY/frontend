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

function toApiReservationFromMyReservation(
  reservation: ReservationSummary,
): ApiReservation {
  return {
    id: String(reservation.id),
    dateId: dateToId(new Date(reservation.start_time)),
    title: "Mi reservación",
    location: "Calendario externo",
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

export async function apiGetSlotReservationsForSelectedDates({
  reservableId,
  dateIds,
}: {
  reservableId: number;
  dateIds: string[];
}): Promise<ReservationSummary[]> {
  const dates = Array.from(new Set(dateIds)).filter(Boolean);

  if (dates.length === 0) return [];

  return officeSlotsApi.getSlotReservationsForDates({
    id: reservableId,
    dates,
  });
}

export async function apiGetExternalEventsInVisibleRange({
  reservableId,
  calendarCells,
}: {
  reservableId: number;
  calendarCells: CalendarCell[];
}): Promise<DayEvent[]> {
  const visibleRange = getVisibleRange(calendarCells);

  if (!visibleRange) return [];

  const dateIds = new Set(calendarCells.map((cell) => cell.id));
  let dates = Array.from(dateIds);
  let initialDate = new Date(visibleRange.start_time);

  const payload = {
    dates,
  };

  const myReservations = await officeSlotsApi.getSlotReservations(
    reservableId,
    payload,
  );

  return myReservations
    .filter((reservation) => reservation.status === "ACCEPTED")
    .map(toApiReservationFromMyReservation)
    .filter((reservation) => dateIds.has(reservation.dateId))
    .map((reservation) => toDayEvent(reservation, "external", "partial"));
}

/*

  getSlotReservations: (
    id: number,
    payload?: GetSlotReservationsPayload,
    detail = false,
  ) => {
    const params = new URLSearchParams();

    if (detail) {
      params.append("detail", "true");
    }

    const search = params.toString();

    return authFetch<ReservationSummary[]>(
      `${SLOTS_BASE}/${id}/reservations${search ? `?${search}` : ""}`,
      {
        method: "POST",
        body: JSON.stringify(payload ?? {}),
      },
    );
  },

*/
