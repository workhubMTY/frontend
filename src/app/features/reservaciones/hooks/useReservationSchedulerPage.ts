"use client";

import { useMemo } from "react";

import {
  createApiJson,
  toTimelineEvent,
} from "@/app/features/reservaciones/data/reservationsApi";

import { createCalendarCells } from "@/app/features/reservaciones/lib/dates";

import { useSelectedSpace } from "@/app/features/reservaciones/hooks/useSelectedSpace";
import { useReservationQueries } from "@/app/features/reservaciones/hooks/useReservationQueries";
import { useReservationScheduler } from "@/app/features/reservaciones/hooks/useReservationScheduler";

import type { TimelineEvent } from "@/app/features/reservaciones/types/reservaciones";

type UseReservationSchedulerPageParams = {
  showAllEvents: boolean;
};

export function useReservationSchedulerPage({
  showAllEvents,
}: UseReservationSchedulerPageParams) {
  const { selectedSpace, spaceId, spaceName } = useSelectedSpace();

  const calendarCells = useMemo(() => createCalendarCells(), []);

  const apiJson = useMemo(() => createApiJson(calendarCells), [calendarCells]);

  const spaceReservationsByDate = useMemo(() => {
    if (!spaceName) return {};

    return apiJson.spaceReservations
      .filter((reservation) => reservation.location === spaceName)
      .reduce<Record<string, TimelineEvent[]>>(
        (reservationsByDate, reservation) => {
          const dateId = reservation.dateId;

          if (!reservationsByDate[dateId]) {
            reservationsByDate[dateId] = [];
          }

          reservationsByDate[dateId].push(
            toTimelineEvent(reservation, "reserved"),
          );

          return reservationsByDate;
        },
        {},
      );
  }, [apiJson.spaceReservations, spaceName]);

  const scheduler = useReservationScheduler({
    calendarCells,
    spaceReservationsByDate,
  });

  const { spaceReservationsForActiveDay, externalEventsForInterval } =
    useReservationQueries({
      apiJson,
      calendarCells,
      activeDayId: scheduler.activeDayId,
      spaceName,
      enabled: Boolean(spaceId),
    });

  const activeDayExternalEvents = useMemo(
    () =>
      externalEventsForInterval.filter(
        (event) => event.dateId === scheduler.activeDayId,
      ),
    [externalEventsForInterval, scheduler.activeDayId],
  );

  const externalTimelineEventsForActiveDay = useMemo(
    () =>
      activeDayExternalEvents.map((event) =>
        toTimelineEvent(event, "external"),
      ),
    [activeDayExternalEvents],
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

  return {
    selectedSpace,
    spaceId,
    spaceName,
    calendarCells,
    scheduler,
    activeDayExternalEvents,
    externalTimelineEventsForActiveDay,
    spaceReservationsForActiveDay,
    conflictCount,
    visibleEvents,
  };
}
