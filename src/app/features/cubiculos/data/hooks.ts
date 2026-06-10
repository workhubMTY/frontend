"use client";

import { useQuery } from "@tanstack/react-query";

import { officeSlotsApi } from "./api";

import type { SpaceSearchFilters } from "@/app/features/cubiculos/types/searchFilters";

function parseTimeInput(input: string): string | null {
  const match = input
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);

  if (!match) return null;

  const [, hStr, mStr, ampm] = match;
  let hours = parseInt(hStr, 10);
  const minutes = mStr ? parseInt(mStr, 10) : 0;

  if (ampm === "pm" && hours < 12) hours += 12;
  if (ampm === "am" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function buildDateTime(dateId: string, time: string) {
  return new Date(`${dateId}T${time}:00`).toISOString();
}

export function areReservableSpaceFiltersEmpty(filters: SpaceSearchFilters) {
  return (
    filters.search.trim() === "" &&
    filters.time.startTime.trim() === "" &&
    filters.time.endTime.trim() === "" &&
    filters.capacity.minCapacity === "" &&
    filters.capacity.maxCapacity === "" &&
    filters.daysToApply.length === 0
  );
}

export function buildAvailableSlotsFilters(nextFilters: SpaceSearchFilters) {
  const parsedStartTime = parseTimeInput(nextFilters.time.startTime);
  const parsedEndTime = parseTimeInput(nextFilters.time.endTime);

  const firstSelectedDay = nextFilters.daysToApply[0];

  const startTime =
    parsedStartTime && firstSelectedDay
      ? buildDateTime(firstSelectedDay, parsedStartTime)
      : undefined;

  const endTime =
    parsedEndTime && firstSelectedDay
      ? buildDateTime(firstSelectedDay, parsedEndTime)
      : undefined;

  return {
    query: nextFilters.search.trim() || undefined,

    startTime,
    endTime,

    minCapacity: nextFilters.capacity.minCapacity
      ? Number(nextFilters.capacity.minCapacity)
      : undefined,

    maxCapacity: nextFilters.capacity.maxCapacity
      ? Number(nextFilters.capacity.maxCapacity)
      : undefined,

    daysToApply:
      nextFilters.daysToApply.length > 0
        ? nextFilters.daysToApply.map((dateId) =>
            new Date(`${dateId}T00:00:00`).toISOString(),
          )
        : undefined,
  };
}

export const officeSlotKeys = {
  all: ["office", "slots"] as const,

  list: () => [...officeSlotKeys.all, "list"] as const,

  search: (filters: SpaceSearchFilters) =>
    [...officeSlotKeys.all, "search", filters] as const,

  detail: (slotId: number | null) =>
    [...officeSlotKeys.all, "detail", slotId] as const,

  reservations: {
    slot: (slotId: number | null, dates?: string[], detail = false) =>
      [
        ...officeSlotKeys.all,
        slotId,
        "reservations",
        dates ?? [],
        detail,
      ] as const,
  },
};

export function useOfficeSlots() {
  return useQuery({
    queryKey: officeSlotKeys.list(),
    queryFn: () => officeSlotsApi.getAllSlots(),
  });
}

export function useReservableSpaces(filters: SpaceSearchFilters) {
  return useQuery({
    queryKey: officeSlotKeys.search(filters),
    queryFn: () => {
      const hasNoFilters = areReservableSpaceFiltersEmpty(filters);

      if (hasNoFilters) {
        return officeSlotsApi.getAllSlots();
      }

      return officeSlotsApi.getAvailableSlots(
        buildAvailableSlotsFilters(filters),
      );
    },
  });
}

export function useOfficeSlotDetail(slotId: number | null) {
  return useQuery({
    queryKey: officeSlotKeys.detail(slotId),
    queryFn: () => officeSlotsApi.getSlotById(slotId as number),
    enabled: slotId !== null,
  });
}

export function useSlotReservations(
  slotId: number | null,
  dates?: string[],
  detail = false,
  showOnlyActiveReservations?:boolean
) {
  return useQuery({
    queryKey: officeSlotKeys.reservations.slot(slotId, dates, detail),
    queryFn: () =>
      officeSlotsApi.getSlotReservations(
        slotId as number,
        dates && dates.length > 0 ? { dates } : undefined,
        detail,
        showOnlyActiveReservations
      ),
    enabled: slotId !== null,
  });
}