import type { TimeBlock } from "@/app/features/reservaciones/types/reservaciones";
import type { ReservationBucket } from "../../data/types";

export type ParkingCapacityBar = {
  index: number;
  reservationCount: number;
  occupationRatio: number;
  height: number;
  isFull: boolean;
  isHighOccupation: boolean;
};

export type ConflictRange = {
  startHour: number;
  endHour: number;
};

export type ParkingCapacityTimelineCardProps = {
  capacity: number;
  blocks: TimeBlock[];
  buckets?: ReservationBucket[];
  highOccupationThreshold?: number;
  conflictRanges?: ConflictRange[];
};