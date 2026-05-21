import { useEffect, useState } from "react";
import type {
  CalendarCell,
  DayEvent,
  TimelineEvent,
} from "@/app/features/reservaciones/types/reservaciones";
import {
  apiGetExternalEventsInInterval,
  apiGetSpaceReservationsByDay,
} from "@/app/features/reservaciones/data/reservationsApi";

type UseReservationQueriesParams = {
  apiJson: ReturnType<
    typeof import("@/app/features/reservaciones/data/reservationsApi").createApiJson
  >;
  calendarCells: CalendarCell[];
  activeDayId: string;
  spaceName: string;
  enabled: boolean;
};

export function useReservationQueries({
  apiJson,
  calendarCells,
  activeDayId,
  spaceName,
  enabled,
}: UseReservationQueriesParams) {
  const [spaceReservationsForActiveDay, setSpaceReservationsForActiveDay] =
    useState<TimelineEvent[]>([]);

  const [externalEventsForInterval, setExternalEventsForInterval] = useState<
    DayEvent[]
  >([]);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) return;

    apiGetSpaceReservationsByDay({
      apiJson,
      dateId: activeDayId,
      spaceName,
    }).then((events) => {
      if (!cancelled) {
        setSpaceReservationsForActiveDay(events);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeDayId, apiJson, spaceName, enabled]);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) return;

    const intervalDateIds = calendarCells.map((cell) => cell.id);

    apiGetExternalEventsInInterval({
      apiJson,
      dateIds: intervalDateIds,
    }).then((externalEvents) => {
      if (!cancelled) {
        setExternalEventsForInterval(externalEvents);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [apiJson, calendarCells, enabled]);

  return {
    spaceReservationsForActiveDay,
    externalEventsForInterval,
  };
}
