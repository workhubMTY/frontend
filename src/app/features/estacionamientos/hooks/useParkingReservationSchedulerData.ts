"use client";

import { useMemo } from "react";

import {
  useMyParkingReservations,
  useParkingBuckets,
  useParkingLotDetail,
  useParkingReservations,
} from "@/app/features/estacionamientos/data/hooks";

import { createCalendarCells } from "@/app/features/reservaciones/crear/lib/dates";

import {
  getVisibleRange,
  groupScheduleItemsByDate,
} from "@/app/features/reservaciones/crear/data/api";

import { useReservationScheduler } from "@/app/features/reservaciones/crear/hooks/useReservationScheduler";

import type {
  ListReservationsQuery,
  ReservationBucketsQuery,
} from "@/app/features/estacionamientos/data/types";

import { getLocalDayRange } from "../lib/parkingAvailability";
import { parkingReservationToScheduleItem } from "../data/lib";
import { useAuth } from "@/app/shared/auth/useAuth";

import type { UserTimelineQuery } from "@/app/features/reservaciones/crear/types/timeline";

import { useUserTimeline } from "@/app/features/reservaciones/crear/data/hooks";

import { timelineToScheduleItems } from "@/app/features/reservaciones/crear/data/myScheduleMappers";
type UseParkingReservationSchedulerPageParams = {
  parkingId: number | null;
};

export function useParkingReservationSchedulerData({
  parkingId,
}: UseParkingReservationSchedulerPageParams) {
  const calendarCells = useMemo(() => createCalendarCells(), []);

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
    };
  }, [visibleRange]);
  const { user } = useAuth();

  const userId = user?.eId ? String(user.eId) : null;
  const myTimelineQuery = useUserTimeline(userId, timelineQuery, {
    enabled: Boolean(userId && timelineQuery),
  });
  const timeline = myTimelineQuery.data ?? null;

  const myOfficeReservations = useMemo(
    () => timeline?.user.officeReservations ?? [],
    [timeline],
  );

  const myTimelineParkingReservations = useMemo(
    () => timeline?.user.parkingReservations ?? [],
    [timeline],
  );

  const myEvents = useMemo(() => timeline?.user.events ?? [], [timeline]);

  const myScheduleItems = useMemo(
    () =>
      timelineToScheduleItems({
        officeReservations: myOfficeReservations,
        parkingReservations: myTimelineParkingReservations,
        events: myEvents,
      }),
    [myOfficeReservations, myTimelineParkingReservations, myEvents],
  );

  const myScheduleItemsByDate = useMemo(
    () => groupScheduleItemsByDate(myScheduleItems),
    [myScheduleItems],
  );

  const parkingLotQuery = useParkingLotDetail(parkingId ?? 0);

  const reservationsQueryParams = useMemo<
    ListReservationsQuery | undefined
  >(() => {
    if (!parkingId || !visibleRange) return undefined;

    return {
      parking_lot_id: parkingId,
      start_time: `${visibleRange.firstDateId}T00:00:00.000`,
      end_time: `${visibleRange.lastDateId}T23:59:59.999`,
    };
  }, [parkingId, visibleRange]);

  const myReservationsQueryParams = useMemo<
    ListReservationsQuery | undefined
  >(() => {
    if (!visibleRange) return undefined;

    return {
      start_time: `${visibleRange.firstDateId}T00:00:00.000`,
      end_time: `${visibleRange.lastDateId}T23:59:59.999`,
    };
  }, [visibleRange]);

  const reservationsQuery = useParkingReservations(reservationsQueryParams, {
    enabled: Boolean(parkingId && visibleRange),
  });

  const myReservationsQuery = useMyParkingReservations(
    myReservationsQueryParams,
    {
      enabled: Boolean(visibleRange),
    },
  );

  /**
   * Todas las reservaciones del estacionamiento seleccionado.
   * Sirven para pintar ocupación/capacidad, pero NO necesariamente bloquean.
   */
  const parkingScheduleItems = useMemo(
    () =>
      (reservationsQuery.data?.items ?? []).map((reservation) =>
        parkingReservationToScheduleItem(reservation, "space_reservation"),
      ),
    [reservationsQuery.data?.items],
  );

  /**
   * Mis reservaciones de parking.
   * Sirven para bloquear empalmes del usuario y para la segunda hilera/card.
   */
  const myParkingScheduleItems = useMemo(
    () =>
      (myReservationsQuery.data ?? [])
        .filter((item) => item.reservation.lifecycle_status === "ACTIVE")
        .map((item) =>
          parkingReservationToScheduleItem(
            item.reservation,
            "parking_reservation",
          ),
        ),
    [myReservationsQuery.data],
  );

  const parkingScheduleItemsByDate = useMemo(
    () => groupScheduleItemsByDate(parkingScheduleItems),
    [parkingScheduleItems],
  );

  const myParkingScheduleItemsByDate = useMemo(
    () => groupScheduleItemsByDate(myParkingScheduleItems),
    [myParkingScheduleItems],
  );

  const scheduler = useReservationScheduler({
    calendarCells,

    /**
     * En parking, los conflictos bloqueantes son contra MIS reservaciones,
     * no contra todas las reservaciones del estacionamiento.
     */
    spaceScheduleItemsByDate: myParkingScheduleItemsByDate,
  });
  const myScheduleItemsForActiveDay = useMemo(
    () => myScheduleItemsByDate[scheduler.activeDayId] ?? [],
    [myScheduleItemsByDate, scheduler.activeDayId],
  );

  const bucketsQueryParams = useMemo<
    ReservationBucketsQuery | undefined
  >(() => {
    if (!scheduler.activeDayId) return undefined;

    const { start, end } = getLocalDayRange(scheduler.activeDayId);

    return {
      start_time: start,
      end_time: end,
      step_minutes: "15",
    };
  }, [scheduler.activeDayId]);

  const bucketsQuery = useParkingBuckets(bucketsQueryParams, {
    enabled: Boolean(scheduler.activeDayId),
  });

  const parkingScheduleItemsForActiveDay = useMemo(
    () => parkingScheduleItemsByDate[scheduler.activeDayId] ?? [],
    [parkingScheduleItemsByDate, scheduler.activeDayId],
  );

  const myParkingScheduleItemsForActiveDay = useMemo(
    () => myParkingScheduleItemsByDate[scheduler.activeDayId] ?? [],
    [myParkingScheduleItemsByDate, scheduler.activeDayId],
  );

  return {
    calendarCells,
    scheduler,

    parkingLot: parkingLotQuery.data ?? null,
    parkingName: parkingLotQuery.data?.name ?? "Estacionamiento",

    parkingScheduleItems,
    parkingScheduleItemsByDate,
    parkingScheduleItemsForActiveDay,

    myParkingScheduleItems,
    myParkingScheduleItemsByDate,
    myParkingScheduleItemsForActiveDay,

    parkingBuckets: bucketsQuery.data?.buckets ?? [],

    createParkingReservation: reservationsQuery.createReservation,
    timeline,

    myScheduleItems,
    myScheduleItemsByDate,
    myScheduleItemsForActiveDay,

    myOfficeReservations,
    myTimelineParkingReservations,
    myEvents,
    isLoading:
      parkingLotQuery.isLoading ||
      reservationsQuery.isLoading ||
      myReservationsQuery.isLoading ||
      bucketsQuery.isLoading ||
      myTimelineQuery.isLoading,

    isFetching:
      parkingLotQuery.isFetching ||
      reservationsQuery.isFetching ||
      myReservationsQuery.isFetching ||
      bucketsQuery.isFetching ||
      myTimelineQuery.isFetching,

    error:
      parkingLotQuery.error ??
      reservationsQuery.error ??
      myReservationsQuery.error ??
      bucketsQuery.error ??
      myTimelineQuery.error,
  };
}
