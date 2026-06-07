import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import type { CalendarCell } from "@/app/features/reservaciones/crear/types/reservaciones";

import {
  apiGetExternalEventsInVisibleRange,
  apiGetSpaceReservationsInVisibleRange,
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
      apiGetSpaceReservationsInVisibleRange({
        reservableId: reservableId as number,
        calendarCells,
      }),
  });

  const externalEventsQuery = useQuery({
    queryKey: [
      "reservations",
      "events",
      "external",
      visibleRange?.firstDateId,
      visibleRange?.lastDateId,
    ],
    enabled: enabled && Boolean(visibleRange),
    queryFn: () =>
      apiGetExternalEventsInVisibleRange({
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
