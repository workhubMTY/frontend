import type { ReservationBucket } from "../../data/types";
import type { ParkingCapacityBar } from "./types";

export const HOURS = [
  "00:00",
  "02:00",
  "04:00",
  "06:00",
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
  "24:00",
];
export function createCapacityBars(params: {
  buckets: ReservationBucket[];
  capacity: number;
  highOccupationThreshold: number;
}): ParkingCapacityBar[] {
  const { buckets, capacity, highOccupationThreshold } = params;

  return buckets.map((bucket, index) => {
    const reservationCount = bucket.reservation_count;
    const occupationRatio = capacity > 0 ? reservationCount / capacity : 0;
    const hasReservations = reservationCount > 0;

    return {
      index,
      reservationCount,
      occupationRatio,
      height: hasReservations
        ? Math.max(8, Math.min(58, occupationRatio * 58))
        : 0,
      isFull: capacity > 0 && reservationCount >= capacity,
      isHighOccupation: occupationRatio >= highOccupationThreshold,
    };
  });
}

export function getHourFromTimeLabel(value: string) {
  const normalizedValue = value.trim().toUpperCase();
  const [time = "00:00", period = "AM"] = normalizedValue.split(" ");
  const [rawHours = "0", rawMinutes = "0"] = time.split(":");

  let hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours + minutes / 60;
}

export function formatBlockLabel(start: string, end: string) {
  return `${start.replace(" AM", "").replace(" PM", "")} – ${end}`;
}