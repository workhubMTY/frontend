import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";

export type HomeAgendaSelectedDetail =
  | {
      type: "office";
      id: number;
    }
  | {
      type: "parking";
      id: number;
    };

function getNumberFromUnknown(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const directNumber = Number(value);

    if (Number.isFinite(directNumber)) {
      return directNumber;
    }

    const match = value.match(/\d+$/);

    if (match) {
      return Number(match[0]);
    }
  }

  return null;
}

export function getAgendaSelectedDetail(
  item: ScheduleItem,
): HomeAgendaSelectedDetail | null {
  const itemRecord = item as unknown as Record<string, unknown>;

  const id =
    getNumberFromUnknown(itemRecord.reservationId) ??
    getNumberFromUnknown(itemRecord.reservation_id) ??
    getNumberFromUnknown(itemRecord.sourceReservationId) ??
    getNumberFromUnknown(itemRecord.id);

  if (id === null) return null;

  if (item.kind === "parking_reservation") {
    return {
      type: "parking",
      id,
    };
  }

  if (item.kind === "my_reservation" || item.kind === "space_reservation") {
    return {
      type: "office",
      id,
    };
  }

  return null;
}