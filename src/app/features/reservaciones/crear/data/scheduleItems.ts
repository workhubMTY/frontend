import type { ScheduleItem, ScheduleItemsByDate } from "@/app/features/reservaciones/crear/types/schedule";
import { MyScheduleApiItem } from "../../confirmar/types/confirmation";


export function toDateId(value: Date | string) {
  return new Date(value).toLocaleDateString("en-CA");
}

export function toTime(value: Date | string) {
  return new Date(value).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function toServerDateId(value: string) {
  return value.slice(0, 10);
}

function toServerTime(value: string) {
  return value.slice(11, 16);
}

function getScheduleItemKind(
  item: MyScheduleApiItem,
): ScheduleItem["kind"] {
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

function getDefaultStatus(kind: ScheduleItem["kind"]): ScheduleItem["status"] {
  if (kind === "calendar_event") return "normal";

  return "partial";
}

export function myScheduleApiItemToScheduleItem(
  item: MyScheduleApiItem,
): ScheduleItem {
  const kind = getScheduleItemKind(item);

  return {
    id: item.id,
    kind,

    dateId: toServerDateId(item.start_time),
    start: toServerTime(item.start_time),
    end: toServerTime(item.end_time),

    title: item.title ?? getDefaultTitle(kind),
    location: item.location ?? item.reservable_name ?? null,

    status: getDefaultStatus(kind),

    sourceLabel: getSourceLabel(kind),

    reservableId: item.reservable_id ?? null,
    reservableName: item.reservable_name ?? null,
    floorId: item.floor_id ?? null,
    floorName: item.floor_name ?? null,

    attendanceStatus: item.attendance_status ?? null,
    lifecycleStatus: item.lifecycle_status,

    raw: item,
  };
}


export function groupScheduleItemsByDate(
  items: ScheduleItem[],
): ScheduleItemsByDate {
  return items.reduce<ScheduleItemsByDate>((itemsByDate, item) => {
    if (!itemsByDate[item.dateId]) {
      itemsByDate[item.dateId] = [];
    }

    itemsByDate[item.dateId].push(item);

    return itemsByDate;
  }, {});
}