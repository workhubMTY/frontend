"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/app/shared/socket/socket.context";
import type { OfficeUpdateMessage } from "@/app/shared/socket/socket.context";

import { officeSlotsApi } from "./api";
import type { OfficeSlot } from "./types";

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
    slot: (slotId: number | null, dates?: string[], detail = false, showOnlyActiveReservations = false) =>
      [
        ...officeSlotKeys.all,
        slotId,
        "reservations",
        dates ?? [],
        detail,
        showOnlyActiveReservations
      ] as const,
  },
};

function useJoinOfficeRoom() {
  const socket = useSocket();

  useEffect(() => {
    socket.emit("joinOfficeRoom");
    return () => {
      socket.emit("leaveOfficeRoom");
    };
  }, [socket]);
}

export function useOfficeSlots() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinOfficeRoom();

  const query = useQuery({
    queryKey: officeSlotKeys.list(),
    queryFn: () => officeSlotsApi.getAllSlots(),
  });

  useEffect(() => {
    function onOfficeUpdate(msg: OfficeUpdateMessage) {
      if (msg.type === "slot.created") {
        queryClient.setQueryData<OfficeSlot[]>(
          officeSlotKeys.list(),
          (prev) => {
            if (!prev) return prev;
            const exists = prev.some((s) => s.id === msg.payload.id);
            return exists ? prev : [...prev, msg.payload as unknown as OfficeSlot];
          },
        );
        return;
      }

      if (msg.type === "slot.updated") {
        queryClient.setQueryData<OfficeSlot[]>(
          officeSlotKeys.list(),
          (prev) => {
            if (!prev) return prev;
            return prev.map((s) =>
              s.id === msg.payload.id ? { ...s, ...msg.payload } : s,
            );
          },
        );
        return;
      }

      if (msg.type === "slot.deleted") {
        queryClient.invalidateQueries({ queryKey: officeSlotKeys.list() });
      }
    }

    socket.on("officeUpdate", onOfficeUpdate);
    return () => {
      socket.off("officeUpdate", onOfficeUpdate);
    };
  }, [socket, queryClient]);

  return query;
}

export function useReservableSpaces(filters: SpaceSearchFilters) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinOfficeRoom();

  const query = useQuery({
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

  useEffect(() => {
    function onOfficeUpdate(msg: OfficeUpdateMessage) {
      // Cualquier cambio en slots o reservaciones puede afectar la disponibilidad
      if (
        msg.type === "slot.created" ||
        msg.type === "slot.updated" ||
        msg.type === "slot.deleted" ||
        msg.type === "reservation.created" ||
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.checkedin" ||
        msg.type === "reservation.checkedout" ||
        msg.type === "reservation.noshow"
      ) {
        queryClient.invalidateQueries({
          queryKey: officeSlotKeys.search(filters),
        });
      }
    }

    socket.on("officeUpdate", onOfficeUpdate);
    return () => {
      socket.off("officeUpdate", onOfficeUpdate);
    };
  }, [socket, queryClient, filters]);

  return query;
}

export function useOfficeSlotDetail(slotId: number | null) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinOfficeRoom();

  const query = useQuery({
    queryKey: officeSlotKeys.detail(slotId),
    queryFn: () => officeSlotsApi.getSlotById(slotId as number),
    enabled: slotId !== null,
  });

  useEffect(() => {
    if (slotId === null) return;

    function onOfficeUpdate(msg: OfficeUpdateMessage) {
      if (msg.type === "slot.updated" && msg.payload.id === slotId) {
        queryClient.setQueryData<OfficeSlot>(
          officeSlotKeys.detail(slotId),
          (prev) => (prev ? { ...prev, ...msg.payload } : prev),
        );
        return;
      }

      if (msg.type === "slot.deleted" && msg.payload.id === slotId) {
        queryClient.removeQueries({
          queryKey: officeSlotKeys.detail(slotId),
        });
      }
    }

    socket.on("officeUpdate", onOfficeUpdate);
    return () => {
      socket.off("officeUpdate", onOfficeUpdate);
    };
  }, [socket, queryClient, slotId]);

  return query;
}

export function useSlotReservations(
  slotId: number | null,
  dates?: string[],
  detail = false,
  showOnlyActiveReservations?:boolean
) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinOfficeRoom();

  const query = useQuery({
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

  useEffect(() => {
    if (slotId === null) return;

    function onOfficeUpdate(msg: OfficeUpdateMessage) {
      if (
        msg.type === "reservation.created" ||
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.checkedin" ||
        msg.type === "reservation.checkedout" ||
        msg.type === "reservation.noshow" ||
        msg.type === "reservation.attendance_updated" ||
        msg.type === "participant.updated"
      ) {
        // Invalidar si la reservación pertenece a este slot
        if (msg.payload.reservable_id === slotId) {
          queryClient.invalidateQueries({
            queryKey: officeSlotKeys.reservations.slot(slotId, dates, detail),
          });
        }
      }
    }

    socket.on("officeUpdate", onOfficeUpdate);
    return () => {
      socket.off("officeUpdate", onOfficeUpdate);
    };
  }, [socket, queryClient, slotId, dates, detail]);

  return query;
}