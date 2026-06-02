"use client";

import { useMemo } from "react";

import {
  useMyParkingReservations,
  useParkingBuckets,
  useParkingLotDetail,
  useParkingReservations,
} from "@/app/features/estacionamientos/data/hooks";

import { createCalendarCells } from "@/app/features/reservaciones/lib/dates";
import {
  getVisibleRange,
  groupTimelineEventsByDate,
} from "@/app/features/reservaciones/data/reservationsApi";

import { useReservationScheduler } from "@/app/features/reservaciones/hooks/useReservationScheduler";

import type { TimelineEvent } from "@/app/features/reservaciones/types/reservaciones";
import type {
  ListReservationsQuery,
  ParkingReservation,
  ReservationBucketsQuery,
} from "@/app/features/estacionamientos/data/types";

import { getLocalDayRange } from "../lib/parkingAvailability";

function toDateId(value: Date | string) {
  return new Date(value).toLocaleDateString("en-CA");
}

function toTime(value: Date | string) {
  return new Date(value).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function toParkingTimelineEvent(
  reservation: ParkingReservation,
): TimelineEvent {
  return {
    id: String(reservation.id),
    dateId: toDateId(reservation.start_time),
    start: toTime(reservation.start_time),
    end: toTime(reservation.end_time),
    title: "Reservación",
    label: `${toTime(reservation.start_time)} - ${toTime(reservation.end_time)}`,
    row: "reserved",
  };
}

type UseParkingReservationSchedulerPageParams = {
  parkingId: number | null;
};

export function useParkingReservationSchedulerPage({
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

  const parkingTimelineEvents = useMemo(
    () =>
      (reservationsQuery.data?.items ?? []).map((reservation) =>
        toParkingTimelineEvent(reservation),
      ),
    [reservationsQuery.data?.items],
  );
const myParkingReservations = useMemo(
  () =>
    (myReservationsQuery.data ?? [])
      .filter((item) => item.reservation.lifecycle_status === "ACTIVE")
      .map((item) => item.reservation),
  [myReservationsQuery.data],
);

const myParkingTimelineEvents = useMemo(
  () =>
    myParkingReservations.map((reservation) =>
      toParkingTimelineEvent(reservation),
    ),
  [myParkingReservations],
);

  const parkingReservationsByDate = useMemo(
    () => groupTimelineEventsByDate(parkingTimelineEvents),
    [parkingTimelineEvents],
  );

  const myParkingReservationsByDate = useMemo(
    () => groupTimelineEventsByDate(myParkingTimelineEvents),
    [myParkingTimelineEvents],
  );

  const scheduler = useReservationScheduler({
    calendarCells,

    // Importante:
    // Para estacionamientos, los conflictos bloqueantes son TUS reservaciones,
    // no todas las reservaciones del estacionamiento.
    spaceReservationsByDate: myParkingReservationsByDate,
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

  const parkingReservationsForActiveDay = useMemo(
    () => parkingReservationsByDate[scheduler.activeDayId] ?? [],
    [parkingReservationsByDate, scheduler.activeDayId],
  );

  const myParkingReservationsForActiveDay = useMemo(
    () => myParkingReservationsByDate[scheduler.activeDayId] ?? [],
    [myParkingReservationsByDate, scheduler.activeDayId],
  );

  return {
    calendarCells,
    scheduler,

    parkingLot: parkingLotQuery.data ?? null,
    parkingName: parkingLotQuery.data?.name ?? "Estacionamiento",

    parkingReservationsByDate,
    parkingReservationsForActiveDay,

    myParkingReservationsByDate,
    myParkingReservationsForActiveDay,

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
