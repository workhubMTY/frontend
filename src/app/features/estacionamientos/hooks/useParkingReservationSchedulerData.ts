"use client";

import { useMemo } from "react";

import {
  useMyParkingReservations,
  useParkingBuckets,
  useParkingLotDetail,
  useParkingReservations,
} from "@/app/features/estacionamientos/data/hooks";

import { createCalendarCells } from "@/app/features/reservaciones/crear/lib/dates";

import { getVisibleRange, groupScheduleItemsByDate } from "@/app/features/reservaciones/crear/data/api";

import { useReservationScheduler } from "@/app/features/reservaciones/crear/hooks/useReservationScheduler";

import type {
  ListReservationsQuery,
  ReservationBucketsQuery,
} from "@/app/features/estacionamientos/data/types";

import { getLocalDayRange } from "../lib/parkingAvailability";
import { parkingReservationToScheduleItem } from "../data/lib";

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

  const parkingLotQuery = useParkingLotDetail(parkingId ?? 0);

  const reservationsQueryParams = useMemo<
    ListReservationsQuery | undefined
  >(() => {
    if (!parkingId || !visibleRange) return undefined;

    return {
      parking_lot_id: parkingId,
      start_time: new Date(`${visibleRange.firstDateId}T00:00:00.000`),
      end_time: new Date(`${visibleRange.lastDateId}T23:59:59.999`),
    };
  }, [parkingId, visibleRange]);

  const myReservationsQueryParams = useMemo<
    ListReservationsQuery | undefined
  >(() => {
    if (!visibleRange) return undefined;

    return {
      start_time: new Date(`${visibleRange.firstDateId}T00:00:00.000`),
      end_time: new Date(`${visibleRange.lastDateId}T23:59:59.999`),
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

    isLoading:
      parkingLotQuery.isLoading ||
      reservationsQuery.isLoading ||
      myReservationsQuery.isLoading ||
      bucketsQuery.isLoading,

    isFetching:
      parkingLotQuery.isFetching ||
      reservationsQuery.isFetching ||
      myReservationsQuery.isFetching ||
      bucketsQuery.isFetching,

    error:
      parkingLotQuery.error ??
      reservationsQuery.error ??
      myReservationsQuery.error ??
      bucketsQuery.error,
  };
}