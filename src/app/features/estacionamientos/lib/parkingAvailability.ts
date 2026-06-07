import type {
  TimeBlock,
  TimelineEvent,
} from "@/app/features/reservaciones/crear/types/reservaciones";

type ParkingAvailabilityResult = {
  status: "available" | "partial" | "conflict";
  minimumFreeSpots: number;
  maximumOccupiedSpots: number;
  capacity: number;
  saturationRange?: string;
};

type GetParkingAvailabilityParams = {
  capacity: number;
  baseOccupiedSpots: number;
  highOccupationThreshold: number;
  activeBlocks: TimeBlock[];
  pendingBlocks: TimeBlock[];
  spaceReservationsForActiveDay: TimelineEvent[];
};

export function getParkingAvailability({
  capacity,
  baseOccupiedSpots,
  highOccupationThreshold,
  activeBlocks,
  pendingBlocks,
  spaceReservationsForActiveDay,
}: GetParkingAvailabilityParams): ParkingAvailabilityResult {
  const selectedBlocks = [...activeBlocks, ...pendingBlocks];

  if (selectedBlocks.length === 0) {
    const freeSpots = Math.max(capacity - baseOccupiedSpots, 0);

    return {
      status: freeSpots > 0 ? "available" : "conflict",
      minimumFreeSpots: freeSpots,
      maximumOccupiedSpots: baseOccupiedSpots,
      capacity,
    };
  }

  const hasHardConflict = spaceReservationsForActiveDay.length >= capacity;

  const estimatedExtraOccupation = Math.min(
    selectedBlocks.length * 2,
    Math.floor(capacity * 0.2),
  );

  const maximumOccupiedSpots = Math.min(
    capacity,
    baseOccupiedSpots + estimatedExtraOccupation,
  );

  const minimumFreeSpots = Math.max(capacity - maximumOccupiedSpots, 0);

  const hasSaturation = maximumOccupiedSpots >= highOccupationThreshold;

  if (hasHardConflict || minimumFreeSpots === 0) {
    return {
      status: "conflict",
      minimumFreeSpots,
      maximumOccupiedSpots,
      capacity,
      saturationRange: getSaturationRange(selectedBlocks),
    };
  }

  if (hasSaturation) {
    return {
      status: "partial",
      minimumFreeSpots,
      maximumOccupiedSpots,
      capacity,
      saturationRange: getSaturationRange(selectedBlocks),
    };
  }

  return {
    status: "available",
    minimumFreeSpots,
    maximumOccupiedSpots,
    capacity,
  };
}

function getSaturationRange(blocks: TimeBlock[]) {
  const longestBlock = blocks.slice().sort((a, b) => {
    const durationA =
      getMinutesFromTimeLabel(a.end) - getMinutesFromTimeLabel(a.start);
    const durationB =
      getMinutesFromTimeLabel(b.end) - getMinutesFromTimeLabel(b.start);

    return durationB - durationA;
  })[0];

  if (!longestBlock) return undefined;

  return `${longestBlock.start} – ${longestBlock.end}`;
}

function getMinutesFromTimeLabel(value: string) {
  const normalizedValue = value.trim().toUpperCase();
  const [time = "00:00", period = "AM"] = normalizedValue.split(" ");
  const [rawHours = "0", rawMinutes = "0"] = time.split(":");

  let hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}


export function getLocalDayRange(dateId: string) {
  const start = new Date(`${dateId}T00:00:00`);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}