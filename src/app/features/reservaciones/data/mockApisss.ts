import type {
  ApiReservation,
  CalendarCell,
  DayEvent,
  MockApiJson,
  TimelineEvent,
} from "../types/reservaciones";
import { dateToId } from "../lib/dates";

export function createMockApiJson(calendarCells: CalendarCell[]): MockApiJson {
  const idAt = (index: number) =>
    calendarCells[index]?.id ?? calendarCells[0]?.id ?? dateToId(new Date());

  return {
    // JSON 1: reservaciones de espacios.
    // En la pantalla de "Sala A", solo se muestran como ocupado las reservaciones de Sala A.
    spaceReservations: [
      {
        id: "space-a-1",
        dateId: idAt(0),
        title: "Reservación de sala",
        location: "Sala A",
        start: "06:30",
        end: "08:00",
      },
      {
        id: "space-a-2",
        dateId: idAt(0),
        title: "Reservación de sala",
        location: "Sala A",
        start: "11:30",
        end: "13:00",
      },
      {
        id: "space-a-3",
        dateId: idAt(0),
        title: "Reservación de sala",
        location: "Sala A",
        start: "17:00",
        end: "21:30",
      },
      {
        id: "space-a-4",
        dateId: idAt(1),
        title: "Reservación de sala",
        location: "Sala A",
        start: "09:00",
        end: "10:30",
      },
      {
        id: "space-a-5",
        dateId: idAt(4),
        title: "Reservación de sala",
        location: "Sala A",
        start: "14:00",
        end: "16:00",
      },
      {
        id: "space-b-1",
        dateId: idAt(0),
        title: "Reservación de sala",
        location: "Sala B",
        start: "09:00",
        end: "10:00",
      },
      {
        id: "space-c-1",
        dateId: idAt(2),
        title: "Reservación de sala",
        location: "Sala C",
        start: "12:00",
        end: "13:00",
      },
    ],

    // JSON 2: eventos externos/importados del usuario.
    // Puede representar Google Calendar, Outlook, clases, llamadas, etc.
    externalEvents: [
      {
        id: "external-1",
        dateId: idAt(0),
        title: "Presentación de proyecto",
        location: "Calendario externo",
        start: "14:00",
        end: "15:30",
      },
      {
        id: "external-2",
        dateId: idAt(0),
        title: "Sesión de seguimiento",
        location: "Calendario externo",
        start: "15:30",
        end: "16:00",
      },
      {
        id: "external-3",
        dateId: idAt(1),
        title: "Llamada con cliente",
        location: "Online",
        start: "11:00",
        end: "11:30",
      },
      {
        id: "external-4",
        dateId: idAt(6),
        title: "Capacitación interna",
        location: "Online",
        start: "18:30",
        end: "19:30",
      },
    ],
  };
}

function wait(ms = 250) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
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

export async function apiGetSpaceReservationsByDay({
  apiJson,
  dateId,
  spaceName,
}: {
  apiJson: MockApiJson;
  dateId: string;
  spaceName: string;
}) {
  await wait();

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
  await wait();

  const dateSet = new Set(dateIds);

  return apiJson.externalEvents
    .filter((event) => dateSet.has(event.dateId))
    .map((event) => toDayEvent(event, "external", "partial"));
}
