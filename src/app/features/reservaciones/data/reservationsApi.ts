import { officeSlotsApi } from "@/app/modules/office-slots/api";
import type {
  ApiReservation,
  CalendarCell,
  DayEvent,
  MockApiJson,
  TimelineEvent,
} from "../types/reservaciones";
import { dateToId } from "../lib/dates";

export function createApiJson(_calendarCells: CalendarCell[]): MockApiJson {
  return {
    spaceReservations: [],
    externalEvents: [],
  };
}

export function toTimelineEvent(
  event: ApiReservation,
  row: "reserved" | "external",
): TimelineEvent {
  return {
    id: event.id,
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

const toApiReservation = (event: any): ApiReservation => ({
  id: String(event.id),
  dateId: dateToId(new Date(event.start_time)),
  title: event.title,
  location: event.reservable?.name ?? "Calendario externo",
  start: event.start_time.slice(11, 16),
  end: event.end_time.slice(11, 16),
});

export async function apiGetSpaceReservationsByDay({
  apiJson,
  dateId,
  spaceName,
}: {
  apiJson: MockApiJson;
  dateId: string;
  spaceName: string;
}) {
  const sessionSpaceRaw = window.sessionStorage.getItem("cubiculos:selectedSpace");
  const sessionSpace = sessionSpaceRaw ? JSON.parse(sessionSpaceRaw) : null;
  const reservableId = sessionSpace?.id as number | undefined;

  if (reservableId) {
    const start_time = new Date(`${dateId}T00:00:00`).toISOString();
    const end_time = new Date(`${dateId}T23:59:59`).toISOString();
    const events = await officeSlotsApi.getEvents({ reservable_id: reservableId, start_time, end_time });
    return events.map((event) => toTimelineEvent(toApiReservation(event), "reserved"));
  }

  return apiJson.spaceReservations
    .filter((event) => event.dateId === dateId && event.location === spaceName)
    .map((event) => toTimelineEvent(event, "reserved"));
}

export async function apiGetExternalEventsInInterval({
  apiJson,
  dateIds,
}: {
  apiJson: MockApiJson;
  dateIds: string[];
}) {
  const dates = dateIds
    .map((id) => new Date(`${id}T00:00:00`))
    .filter((d) => !Number.isNaN(d.getTime()));
  const first = dates[0];
  const last = dates[dates.length - 1];
  if (first && last) {
    const myReservations = await officeSlotsApi.getMyReservations();
    const filtered = myReservations.reservations.filter((r) => {
      if (r.status !== "ACCEPTED") return false;
      return true;
    });
    console.log("Mis reservaciones en el intervalo:", myReservations);
    console.log("Reservaciones filtradas por status ACCEPTED:", filtered);
    return filtered.map((event) =>
      toDayEvent(toApiReservation(event), "external", "partial"),
    );
  }

  const dateSet = new Set(dateIds);
  return apiJson.externalEvents
    .filter((event) => dateSet.has(event.dateId))
    .map((event) => toDayEvent(event, "external", "partial"));
}
