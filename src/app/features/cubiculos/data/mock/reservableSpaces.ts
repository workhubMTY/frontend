import { officeSlotsApi } from "@/app/features/cubiculos/data/api";
import type { SlotAvailabilityResult } from "@/app/features/cubiculos/data/types";
import type { SpaceSearchFilters } from "../../types/searchFilters";
import type { ReservableSpace } from "../../types/reservableSpaces";

export const reservableSpaces: ReservableSpace[] = [];

const toHourMinute = (iso: string): string => {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso.slice(0, 5);
  return parsed.toISOString().slice(11, 16);
};

const nowIso = () => new Date().toISOString();
const plusHourIso = () => new Date(Date.now() + 60 * 60 * 1000).toISOString();

const toReservableSpace = (slot: SlotAvailabilityResult): ReservableSpace => ({
  id: slot.id,
  code: slot.code ?? slot.name,
  name: slot.name,
  floor: slot.floor_name,
  capacity: slot.capacity,
  status: slot.status ?? (slot.is_available ? "available" : "occupied"),
  statusLabel:
    slot.statusLabel ?? (slot.is_available ? "Disponible" : "Ocupado"),
  timeline:
    slot.timeline?.map((block) => ({
      id: block.id,
      start: block.start,
      end: block.end,
      status: block.status,
    })) ?? [],
});

export async function fetchReservableSpaces(filters: SpaceSearchFilters) {
  const start_time = filters.time.startTime
    ? new Date(filters.time.startTime).toISOString()
    : nowIso();
  const end_time = filters.time.endTime
    ? new Date(filters.time.endTime).toISOString()
    : plusHourIso();

  const results = await officeSlotsApi.getAvailableSlots({
    start_time,
    end_time,
  });

  return results
    .map(toReservableSpace)
    .filter((space) => {
      const normalizedSearch = filters.search.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        space.code.toLowerCase().includes(normalizedSearch) ||
        space.name.toLowerCase().includes(normalizedSearch);

      const matchesCapacity =
        (!filters.capacity.minCapacity ||
          space.capacity >= Number(filters.capacity.minCapacity)) &&
        (!filters.capacity.maxCapacity ||
          space.capacity <= Number(filters.capacity.maxCapacity));

      return matchesSearch && matchesCapacity;
    })
    .map((space) => ({
      ...space,
      timeline:
        space.timeline.length > 0
          ? space.timeline
          : [
              {
                id: `search-${space.id}`,
                start: toHourMinute(start_time),
                end: toHourMinute(end_time),
                status:
                  space.status === "available"
                    ? ("free" as const)
                    : ("occupied" as const),
              },
            ],
    }));
}
