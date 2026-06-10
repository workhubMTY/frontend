import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type { ParkingReservation } from "@/app/features/estacionamientos/data/types";
import { toDateId, toTime } from "../../reservaciones/crear/data/scheduleItems";

export function parkingReservationToScheduleItem(
  reservation: ParkingReservation,
  kind: "space_reservation" | "parking_reservation" = "parking_reservation",
): ScheduleItem {
  const start = toTime(reservation.start_time);
  const end = toTime(reservation.end_time);

  return {
    id: `${kind}-${reservation.id}`,
    kind,

    dateId: toDateId(reservation.start_time),
    start,
    end,

    title:
      kind === "parking_reservation"
        ? "Mi reservación de estacionamiento"
        : "Reservación de estacionamiento",

    location: "Estacionamiento",

    status: kind === "parking_reservation" ? "partial" : "normal",

    sourceLabel: "Parking",

    reservableId: null,
    reservableName: null,
    reservableCode:null,
    floorId: null,
    floorName: null,

    attendanceStatus: reservation.attendance_status ?? null,
    lifecycleStatus:reservation.lifecycle_status,

    raw: reservation,
  };
}