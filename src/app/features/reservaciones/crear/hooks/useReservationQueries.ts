import { useMemo } from "react";

import type { CalendarCell } from "@/app/features/reservaciones/crear/types/reservaciones";

import type { UserTimelineQuery } from "@/app/features/reservaciones/crear/types/timeline";

import {
  getVisibleRange,
  groupScheduleItemsByDate,
} from "@/app/features/reservaciones/crear/data/api";

import {
  useSpaceScheduleItemsInVisibleRange,
  useUserTimeline,
} from "@/app/features/reservaciones/crear/data/hooks";

import { timelineToScheduleItems } from "@/app/features/reservaciones/crear/data/myScheduleMappers";

type UseReservationQueriesParams = {
  calendarCells: CalendarCell[];
  reservableId: number | null;
  userId: string | null;
  enabled: boolean;
  includeEIds?: string[];
};

export function useReservationQueries({
  calendarCells,
  reservableId,
  userId,
  enabled,
  includeEIds,
}: UseReservationQueriesParams) {
  const visibleRange = useMemo(
    () => getVisibleRange(calendarCells),
    [calendarCells],
  );

  const timelineQuery = useMemo<UserTimelineQuery | undefined>(() => {
    if (!visibleRange) return undefined;

    return {
      from: visibleRange.from,
      to: visibleRange.to,

      includeOfficeReservations: true,
      officeCategories: ["MEETING", "RESERVATION"],

      includeParkingReservations: true,
      includeEvents: true,
      includeFriends: true,

      includeEIds,
    };
  }, [visibleRange, includeEIds]);

  /**
   * Reservaciones del espacio actual.
   * Estas son las únicas bloqueantes.
   */
  const spaceScheduleItemsQuery = useSpaceScheduleItemsInVisibleRange({
    reservableId,
    calendarCells,
    enabled: enabled && Boolean(reservableId && visibleRange),
  });

  /**
   * Super endpoint del usuario.
   * Incluye agenda propia: office, parking y eventos.
   */
  const myTimelineQuery = useUserTimeline(userId, timelineQuery, {
    enabled: enabled && Boolean(userId && timelineQuery),
  });

  const timeline = myTimelineQuery.data ?? null;

  const spaceScheduleItems = useMemo(
    () => spaceScheduleItemsQuery.data ?? [],
    [spaceScheduleItemsQuery.data],
  );

  const myOfficeReservations = useMemo(
    () => timeline?.user.officeReservations ?? [],
    [timeline],
  );

  const myParkingReservations = useMemo(
    () => timeline?.user.parkingReservations ?? [],
    [timeline],
  );

  const myEvents = useMemo(() => timeline?.user.events ?? [], [timeline]);

  /**
   * NO deduplicar contra spaceScheduleItems.
   *
   * Si una reservación propia también ocupa el espacio actual,
   * debe aparecer en ambas hileras:
   *
   * - Espacio ocupado
   * - Tus horarios
   */

  const myScheduleItems = useMemo(
    () =>
      timelineToScheduleItems({
        officeReservations: myOfficeReservations,
        parkingReservations: myParkingReservations,
        events: myEvents,
      }),
    [myOfficeReservations, myParkingReservations, myEvents],
  );

  const myOfficeScheduleItems = useMemo(
    () => myScheduleItems.filter((item) => item.kind === "my_reservation"),
    [myScheduleItems],
  );

  const myParkingScheduleItems = useMemo(
    () => myScheduleItems.filter((item) => item.kind === "parking_reservation"),
    [myScheduleItems],
  );

  const myEventScheduleItems = useMemo(
    () => myScheduleItems.filter((item) => item.kind === "calendar_event"),
    [myScheduleItems],
  );

  const spaceScheduleItemsByDate = useMemo(
    () => groupScheduleItemsByDate(spaceScheduleItems),
    [spaceScheduleItems],
  );

  const myScheduleItemsByDate = useMemo(
    () => groupScheduleItemsByDate(myScheduleItems),
    [myScheduleItems],
  );

  const myOfficeScheduleItemsByDate = useMemo(
    () => {
      console.log("SIN MAPEAR", myOfficeScheduleItems)
      console.log("YA MAPEADOS A DIA", groupScheduleItemsByDate(myOfficeScheduleItems))
      return groupScheduleItemsByDate(myOfficeScheduleItems)
    },
    [myOfficeScheduleItems],
  );

  const myParkingScheduleItemsByDate = useMemo(
    () => groupScheduleItemsByDate(myParkingScheduleItems),
    [myParkingScheduleItems],
  );

  const myEventScheduleItemsByDate = useMemo(
    () => groupScheduleItemsByDate(myEventScheduleItems),
    [myEventScheduleItems],
  );

  return {
    timeline,

    spaceScheduleItems,

    myScheduleItems,
    myOfficeScheduleItems,
    myParkingScheduleItems,
    myEventScheduleItems,

    myOfficeReservations,
    myParkingReservations,
    myEvents,

    spaceScheduleItemsByDate,
    myScheduleItemsByDate,
    myOfficeScheduleItemsByDate,
    myParkingScheduleItemsByDate,
    myEventScheduleItemsByDate,

    isLoading: spaceScheduleItemsQuery.isLoading || myTimelineQuery.isLoading,

    isFetching:
      spaceScheduleItemsQuery.isFetching || myTimelineQuery.isFetching,

    error: spaceScheduleItemsQuery.error ?? myTimelineQuery.error,
  };
}
