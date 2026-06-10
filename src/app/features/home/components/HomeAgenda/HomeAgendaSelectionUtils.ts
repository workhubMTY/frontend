import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";

const OFFICE_RESERVATION_KINDS = new Set([
  "my_reservation",
  "space_reservation",
]);

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

export function getOfficeReservationDetailId(item: ScheduleItem) {
  if (!OFFICE_RESERVATION_KINDS.has(item.kind)) {
    return null;
  }

  const itemRecord = item as unknown as Record<string, unknown>;

  return (
    getNumberFromUnknown(itemRecord.reservationId) ??
    getNumberFromUnknown(itemRecord.reservation_id) ??
    getNumberFromUnknown(itemRecord.id)
  );
}