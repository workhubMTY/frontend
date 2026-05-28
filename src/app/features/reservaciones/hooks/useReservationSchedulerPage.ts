"use client";

import { useMemo } from "react";

import { toTimelineEvent } from "@/app/features/reservaciones/data/reservationsApi";

import { createCalendarCells } from "@/app/features/reservaciones/lib/dates";

import { useSelectedSpace } from "@/app/features/reservaciones/hooks/useSelectedSpace";
import { useReservationQueries } from "@/app/features/reservaciones/hooks/useReservationQueries";
import { useReservationScheduler } from "@/app/features/reservaciones/hooks/useReservationScheduler";

type UseReservationSchedulerPageParams = {
  showAllEvents: boolean;
};

export function useReservationSchedulerPage({
  showAllEvents,
}: UseReservationSchedulerPageParams) {
  const { selectedSpace, spaceId, spaceName } = useSelectedSpace();

  const calendarCells = useMemo(() => createCalendarCells(), []);

  const reservationQueries = useReservationQueries({
    calendarCells,
    reservableId: spaceId ? Number(spaceId) : null,
    enabled: Boolean(spaceId),
  });

  const scheduler = useReservationScheduler({
    calendarCells,
    spaceReservationsByDate: reservationQueries.spaceReservationsByDate,
  });

  const spaceReservationsForActiveDay = useMemo(
    () =>
      reservationQueries.spaceReservationsByDate[scheduler.activeDayId] ?? [],
    [reservationQueries.spaceReservationsByDate, scheduler.activeDayId],
  );

  const activeDayExternalEvents = useMemo(
    () =>
      reservationQueries.externalEventsForInterval.filter(
        (event) => event.dateId === scheduler.activeDayId,
      ),
    [reservationQueries.externalEventsForInterval, scheduler.activeDayId],
  );

  const externalTimelineEventsForActiveDay = useMemo(
    () =>
      activeDayExternalEvents.map((event) =>
        toTimelineEvent(event, "external"),
      ),
    [activeDayExternalEvents],
  );

  const proposedTimelineEventsForActiveDay = useMemo(
    () =>
      scheduler.proposedBlocksForActiveDay.map((block) => ({
        id: block.id,
        dateId: scheduler.activeDayId,
        start: block.start,
        end: block.end,
        title: block.label ?? "Horario propuesto",
        type: "pending",
        status: "normal",
      })),
    [scheduler.proposedBlocksForActiveDay, scheduler.activeDayId],
  );

  const conflictCount = useMemo(
    () =>
      activeDayExternalEvents.filter((event) => event.status !== "normal")
        .length,
    [activeDayExternalEvents],
  );

  const visibleEvents = useMemo(() => {
    if (showAllEvents) return activeDayExternalEvents;

    return activeDayExternalEvents
      .filter((event) => event.status !== "normal")
      .slice(0, 2);
  }, [activeDayExternalEvents, showAllEvents]);

  console.log("DEBUG RESERVATION PAGE", {
    activeDayId: scheduler.activeDayId,
    externalEventsForInterval: reservationQueries.externalEventsForInterval,
    activeDayExternalEvents,
    spaceReservationsByDate: reservationQueries.spaceReservationsByDate,
    spaceReservationsForActiveDay,
  });

  return {
    selectedSpace,
    spaceId,
    spaceName,
    calendarCells,
    scheduler,

    activeDayExternalEvents,
    externalTimelineEventsForActiveDay,
    proposedTimelineEventsForActiveDay,
    spaceReservationsForActiveDay,

    conflictCount,
    visibleEvents,

    isLoading: reservationQueries.isLoading,
    isFetching: reservationQueries.isFetching,
    error: reservationQueries.error,
  };
}
