"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getParkingAvailability } from "@/app/features/estacionamientos/lib/parkingAvailability";
import { getHourFromTimeLabel } from "@/app/features/estacionamientos/components/Timeline/utils";
import { useParkingReservationSchedulerData } from "@/app/features/estacionamientos/hooks/useParkingReservationSchedulerData";

import type { TimeBlock } from "@/app/features/reservaciones/crear/types/reservaciones";
import type {
  CreateParkingReservation,
} from "@/app/features/estacionamientos/data/types";

const FALLBACK_PARKING_CAPACITY = 40;
const BASE_OCCUPIED_SPOTS = 0;
const HIGH_OCCUPATION_THRESHOLD_PERCENTAGE = 0.9;

type UseParkingReservationSchedulerViewModelParams = {
  showAllEvents: boolean;
};

function buildLocalDateTime(dateId: string, time: string) {
  return new Date(`${dateId}T${time}:00`);
}

function buildParkingReservationPayloads({
  selectedDateIds,
  blocks,
}: {
  selectedDateIds: string[];
  blocks: TimeBlock[];
}): CreateParkingReservation[] {
  return selectedDateIds.flatMap((dateId) =>
    blocks.map((block) => ({
      start_time: buildLocalDateTime(dateId, block.start),
      end_time: buildLocalDateTime(dateId, block.end),
    })),
  );
}

export function useParkingReservationSchedulerViewModel({
  showAllEvents,
}: UseParkingReservationSchedulerViewModelParams) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);

  const parkingIdParam =
    searchParams.get("parkingId") ?? searchParams.get("spaceId");

  const parkingId = parkingIdParam ? Number(parkingIdParam) : null;

  const data = useParkingReservationSchedulerData({
    parkingId,
  });

  const scheduler = data.scheduler;

  const parkingCapacity =
    data.parkingLot?.capacity ?? FALLBACK_PARKING_CAPACITY;

  const highOccupationThreshold = Math.floor(
    parkingCapacity * HIGH_OCCUPATION_THRESHOLD_PERCENTAGE,
  );

  const myReservationConflictRanges = useMemo(
    () =>
      data.myParkingReservationsForActiveDay.map((reservation) => ({
        startHour: getHourFromTimeLabel(reservation.start),
        endHour: getHourFromTimeLabel(reservation.end),
      })),
    [data.myParkingReservationsForActiveDay],
  );

  const parkingAvailability = useMemo(
    () =>
      getParkingAvailability({
        capacity: parkingCapacity,
        baseOccupiedSpots: BASE_OCCUPIED_SPOTS,
        highOccupationThreshold,
        activeBlocks: [],
        pendingBlocks: scheduler.proposedBlocksForActiveDay,
        spaceReservationsForActiveDay: data.parkingReservationsForActiveDay,
      }),
    [
      parkingCapacity,
      highOccupationThreshold,
      scheduler.proposedBlocksForActiveDay,
      data.parkingReservationsForActiveDay,
    ],
  );

  /**
   * Reservaciones del día activo.
   * Estas son las que puedes mandar a EventsCard.
   */
  const activeDayParkingEvents = useMemo(
    () => data.parkingReservationsForActiveDay,
    [data.parkingReservationsForActiveDay],
  );

  /**
   * Tus reservaciones del día activo.
   * Útil si quieres otra sección tipo "Mis reservaciones".
   */
  const activeDayMyParkingEvents = useMemo(
    () => data.myParkingReservationsForActiveDay,
    [data.myParkingReservationsForActiveDay],
  );

  /**
   * Reservaciones de TODOS los días seleccionados.
   * Esto sirve para resumen, confirm modal, validaciones extra,
   * o una card que muestre "eventos en los días seleccionados".
   */
  const selectedDaysParkingEvents = useMemo(
    () =>
      scheduler.selectableSelectedDateIds.flatMap(
        (dateId) => data.parkingReservationsByDate[dateId] ?? [],
      ),
    [scheduler.selectableSelectedDateIds, data.parkingReservationsByDate],
  );

  /**
   * Tus reservaciones de TODOS los días seleccionados.
   * Estas son importantes porque en parking tus conflictos bloqueantes
   * son contra tus propias reservaciones.
   */
  const selectedDaysMyParkingEvents = useMemo(
    () =>
      scheduler.selectableSelectedDateIds.flatMap(
        (dateId) => data.myParkingReservationsByDate[dateId] ?? [],
      ),
    [scheduler.selectableSelectedDateIds, data.myParkingReservationsByDate],
  );

  /**
   * Como en reservaciones:
   * Si showAllEvents = true, muestra todo.
   * Si no, muestra solo los más importantes.
   *
   * En parking puedes considerar "conflicto" las reservaciones propias,
   * porque esas sí bloquean.
   */
  const conflictCount = useMemo(
    () => activeDayMyParkingEvents.length,
    [activeDayMyParkingEvents],
  );

  const visibleEvents = useMemo(() => {
    if (showAllEvents) return activeDayParkingEvents;

    return activeDayMyParkingEvents.slice(0, 2);
  }, [showAllEvents, activeDayParkingEvents, activeDayMyParkingEvents]);

  const canSubmitReservation =
    scheduler.canContinue && !data.createParkingReservation.isPending;

  function openConfirmationModal() {
    if (scheduler.hasBlockingConflict) return;
    if (scheduler.selectedDateIds.length === 0) return;
    if (scheduler.proposedBlocks.length === 0) return;

    setIsConfirmModalOpen(true);
  }

  function closeConfirmationModal() {
    if (isSubmittingReservation) return;

    setIsConfirmModalOpen(false);
  }

  function cancelReservation() {
    router.push("/home");
  }

  async function confirmParkingReservation() {
    if (scheduler.hasBlockingConflict) return;

    const payloads = buildParkingReservationPayloads({
      selectedDateIds: scheduler.selectedDateIds,
      blocks: scheduler.proposedBlocks,
    });

    if (payloads.length === 0) return;

    try {
      setIsSubmittingReservation(true);

      await Promise.all(
        payloads.map((payload) =>
          data.createParkingReservation.mutateAsync(payload),
        ),
      );

      setIsConfirmModalOpen(false);
      router.push("/home");
    } finally {
      setIsSubmittingReservation(false);
    }
  }

  function viewCapacityDetail() {
    // Después puedes abrir un drawer/modal de detalle.
  }

  return {
    state: {
      parkingId,

      calendarCells: data.calendarCells,
      scheduler,

      parkingLot: data.parkingLot,
      parkingName: data.parkingName,
      parkingCapacity,

      parkingBuckets: data.parkingBuckets,

      parkingReservationsForActiveDay: data.parkingReservationsForActiveDay,
      myParkingReservationsForActiveDay: data.myParkingReservationsForActiveDay,

      activeDayParkingEvents,
      activeDayMyParkingEvents,

      selectedDaysParkingEvents,
      selectedDaysMyParkingEvents,

      visibleEvents,
      conflictCount,

      myReservationConflictRanges,
      parkingAvailability,

      canSubmitReservation,

      isLoading: data.isLoading,
      isFetching: data.isFetching,
      error: data.error,

      isConfirmModalOpen,
      isSubmittingReservation,
    },

    actions: {
      cancelReservation,
      openConfirmationModal,
      closeConfirmationModal,
      confirmParkingReservation,
      viewCapacityDetail,
    },
  };
}