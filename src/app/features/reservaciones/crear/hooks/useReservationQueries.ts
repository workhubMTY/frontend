import { useMemo } from "react";

import type { CalendarCell } from "@/app/features/reservaciones/crear/types/reservaciones";
import type { UserTimelineQuery } from "@/app/features/reservaciones/confirmar/types/confirmation";

import {
  getVisibleRange,
  groupScheduleItemsByDate,
} from "@/app/features/reservaciones/crear/data/api";

import {
  useSpaceScheduleItemsInVisibleRange,
  useUserTimeline,
} from "@/app/features/reservaciones/crear/data/hooks";

import { myScheduleApiItemToScheduleItem } from "@/app/features/reservaciones/crear/data/myScheduleMappers";

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

  const spaceScheduleItemsQuery = useSpaceScheduleItemsInVisibleRange({
    reservableId,
    calendarCells,
    enabled: enabled && Boolean(visibleRange),
  });

  const myTimelineQuery = useUserTimeline(userId, timelineQuery, {
    enabled: enabled && Boolean(userId && timelineQuery),
  });

  const spaceScheduleItems = spaceScheduleItemsQuery.data ?? [];

  const myScheduleItems = useMemo(
    () => (myTimelineQuery.data ?? []).map(myScheduleApiItemToScheduleItem),
    [myTimelineQuery.data],
  );

  const spaceScheduleItemsByDate = useMemo(
    () => groupScheduleItemsByDate(spaceScheduleItems),
    [spaceScheduleItems],
  );

  const myScheduleItemsByDate = useMemo(
    () => groupScheduleItemsByDate(myScheduleItems),
    [myScheduleItems],
  );

  return {
    spaceScheduleItems,
    myScheduleItems,

    spaceScheduleItemsByDate,
    myScheduleItemsByDate,

    isLoading: spaceScheduleItemsQuery.isLoading || myTimelineQuery.isLoading,

    isFetching: spaceScheduleItemsQuery.isFetching || myTimelineQuery.isFetching,

    error: spaceScheduleItemsQuery.error ?? myTimelineQuery.error,
  };
}