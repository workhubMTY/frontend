import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import type { CalendarCell } from "@/app/features/reservaciones/crear/types/reservaciones";

import {
  apiGetExternalEventsInVisibleRange,
  apiGetTimelineReservationsInVisibleRange,
  getVisibleRange,
  groupTimelineEventsByDate,
} from "@/app/features/reservaciones/crear/data/reservationsApi";

type UseReservationQueriesParams = {
  calendarCells: CalendarCell[];
  reservableId: number | null;
  enabled: boolean;
};

export function useReservationQueries({
  calendarCells,
  reservableId,
  enabled,
}: UseReservationQueriesParams) {
  const visibleRange = useMemo(
    () => getVisibleRange(calendarCells),
    [calendarCells],
  );

  const spaceReservationsQuery = useQuery({
    queryKey: [
      "reservations",
      "events",
      "space",
      reservableId,
      visibleRange?.firstDateId,
      visibleRange?.lastDateId,
    ],
    enabled: enabled && Boolean(reservableId) && Boolean(visibleRange),
    queryFn: () =>
      apiGetTimelineReservationsInVisibleRange({
        reservableId: reservableId!,
        calendarCells,
      }),
  });

  const externalEventsQuery = useQuery({
    queryKey: [
      "reservations",
      "events",
      "external",
      reservableId,
      visibleRange?.firstDateId,
      visibleRange?.lastDateId,
    ],
    enabled: enabled && Boolean(reservableId) && Boolean(visibleRange),
    queryFn: () =>
      apiGetExternalEventsInVisibleRange({
        reservableId: reservableId!,
        calendarCells,
      }),
  });

  const spaceReservationsByDate = useMemo(
    () => groupTimelineEventsByDate(spaceReservationsQuery.data ?? []),
    [spaceReservationsQuery.data],
  );

  return {
    spaceReservationsByDate,
    externalEventsForInterval: externalEventsQuery.data ?? [],

    isLoading:
      spaceReservationsQuery.isLoading || externalEventsQuery.isLoading,

    isFetching:
      spaceReservationsQuery.isFetching || externalEventsQuery.isFetching,

    error: spaceReservationsQuery.error ?? externalEventsQuery.error,
  };
}