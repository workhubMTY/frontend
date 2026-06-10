// src/app/features/home/hooks/useHomeAgendaViewModel.ts

"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/app/shared/auth/useAuth";

import { useUserTimeline } from "@/app/features/reservaciones/crear/data/hooks";
import { timelineToScheduleItems } from "@/app/features/reservaciones/crear/data/myScheduleMappers";
import { groupScheduleItemsByDate } from "@/app/features/reservaciones/crear/data/api";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type { HomeAgendaFilter } from "../types/homeAgenda";

import {
  addDays,
  clampDate,
  filterHomeAgendaItems,
  getDaysBetween,
  getHomeAgendaQuery,
  getMondayOfWeek,
  startOfLocalDay,
  toDateId,
} from "../lib/homeAgenda";

const VISIBLE_DAYS = 5;
const MAX_DAYS_FROM_TODAY = 21;

export function useHomeAgendaViewModel() {
  const { user } = useAuth();

  const userId = user?.eId ? String(user.eId) : null;

  const today = useMemo(() => startOfLocalDay(new Date()), []);

  /**
   * Límite real del sistema:
   * hoy + 3 semanas exactas.
   */
  const maxAllowedDate = useMemo(
    () => addDays(today, MAX_DAYS_FROM_TODAY),
    [today],
  );

  /**
   * La agenda visual siempre arranca en lunes.
   * Si hoy es miércoles, se muestra lunes-viernes de esta semana.
   */
  const firstVisibleWeekStart = useMemo(() => getMondayOfWeek(today), [today]);

  /**
   * Última semana a la que se puede navegar.
   * Es el lunes de la semana donde cae hoy + 21 días.
   */
  const lastVisibleWeekStart = useMemo(
    () => getMondayOfWeek(maxAllowedDate),
    [maxAllowedDate],
  );

  const [windowStartDate, setWindowStartDate] = useState(firstVisibleWeekStart);
  const [activeFilter, setActiveFilter] = useState<HomeAgendaFilter>("all");

  const visibleDays = useMemo(
    () => getDaysBetween(windowStartDate, VISIBLE_DAYS),
    [windowStartDate],
  );

  /**
   * La consulta NO depende de la semana visible.
   * Siempre pide desde hoy hasta hoy + 3 semanas exactas.
   */
  const queryRange = useMemo(() => {
    return {
      from: today,
      to: maxAllowedDate,
    };
  }, [today, maxAllowedDate]);

  const timelineQuery = useMemo(
    () =>
      getHomeAgendaQuery({
        from: queryRange.from,
        to: queryRange.to,
        filter: activeFilter,
      }),
    [queryRange, activeFilter],
  );

  const timelineQueryResult = useUserTimeline(userId, timelineQuery, {
    enabled: Boolean(userId),
  });

  const timeline = timelineQueryResult.data ?? null;

  const rawScheduleItems = useMemo<ScheduleItem[]>(() => {
    if (!timeline) return [];

    return timelineToScheduleItems({
      officeReservations: timeline.user.officeReservations ?? [],
      parkingReservations: timeline.user.parkingReservations ?? [],
      events: timeline.user.events ?? [],
    });
  }, [timeline]);

  const scheduleItems = useMemo(() => {
    return filterHomeAgendaItems(rawScheduleItems, activeFilter).filter(
      (item) => {
        /**
         * Seguridad extra del frontend:
         * aunque el backend devuelva algo fuera del rango,
         * no lo mostramos.
         */
        return item.dateId >= toDateId(today) && item.dateId <= toDateId(maxAllowedDate);
      },
    );
  }, [rawScheduleItems, activeFilter, today, maxAllowedDate]);

  const scheduleItemsByDate = useMemo(
    () => groupScheduleItemsByDate(scheduleItems),
    [scheduleItems],
  );

  const visibleScheduleItemsByDate = useMemo(() => {
    return visibleDays.reduce<Record<string, ScheduleItem[]>>((acc, day) => {
      const isInsideAllowedRange =
        day.id >= toDateId(today) && day.id <= toDateId(maxAllowedDate);

      acc[day.id] = isInsideAllowedRange
        ? scheduleItemsByDate[day.id] ?? []
        : [];

      return acc;
    }, {});
  }, [visibleDays, scheduleItemsByDate, today, maxAllowedDate]);

  const disabledDateIds = useMemo(() => {
    return visibleDays
      .filter((day) => day.id < toDateId(today) || day.id > toDateId(maxAllowedDate))
      .map((day) => day.id);
  }, [visibleDays, today, maxAllowedDate]);

  const canGoPrevious = windowStartDate > firstVisibleWeekStart;
  const canGoNext = windowStartDate < lastVisibleWeekStart;

  function goPrevious() {
    setWindowStartDate((current) =>
      clampDate(addDays(current, -7), firstVisibleWeekStart, lastVisibleWeekStart),
    );
  }

  function goNext() {
    setWindowStartDate((current) =>
      clampDate(addDays(current, 7), firstVisibleWeekStart, lastVisibleWeekStart),
    );
  }

  function goToday() {
    setWindowStartDate(firstVisibleWeekStart);
  }

  function setFilter(filter: HomeAgendaFilter) {
    setActiveFilter(filter);
  }

  return {
    state: {
      user,

      activeFilter,

      today,
      maxAllowedDate,

      visibleDays,
      queryRange,

      timeline,

      scheduleItems,
      scheduleItemsByDate,
      visibleScheduleItemsByDate,
      disabledDateIds,

      canGoPrevious,
      canGoNext,

      isLoading: timelineQueryResult.isLoading,
      isFetching: timelineQueryResult.isFetching,
      error: timelineQueryResult.error,
    },

    actions: {
      setFilter,
      goPrevious,
      goNext,
      goToday,
    },
  };
}