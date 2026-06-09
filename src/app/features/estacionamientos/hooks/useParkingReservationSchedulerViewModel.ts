"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getParkingAvailability } from "@/app/features/estacionamientos/lib/parkingAvailability";
import { getHourFromTimeLabel } from "@/app/features/estacionamientos/components/Timeline/utils";
import { useParkingReservationSchedulerData } from "@/app/features/estacionamientos/hooks/useParkingReservationSchedulerData";

import type { CreateParkingReservation } from "@/app/features/estacionamientos/data/types";
import { TimeBlock } from "../../reservaciones/crear/types/reservaciones";

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
      data.myParkingScheduleItemsForActiveDay.map((item) => ({
        startHour: getHourFromTimeLabel(item.start),
        endHour: getHourFromTimeLabel(item.end),
      })),
    [data.myParkingScheduleItemsForActiveDay],
  );

  const parkingAvailability = useMemo(
    () =>
      getParkingAvailability({
        capacity: parkingCapacity,
        baseOccupiedSpots: BASE_OCCUPIED_SPOTS,
        highOccupationThreshold,
        activeBlocks: [],
        pendingBlocks: scheduler.proposedBlocksForActiveDay,
        spaceReservationsForActiveDay: data.parkingScheduleItemsForActiveDay,
      }),
    [
      parkingCapacity,
      highOccupationThreshold,
      scheduler.proposedBlocksForActiveDay,
      data.parkingScheduleItemsForActiveDay,
    ],
  );

  const activeDayParkingItems = useMemo(
    () => data.parkingScheduleItemsForActiveDay,
    [data.parkingScheduleItemsForActiveDay],
  );
  const activeDayMyParkingItems = useMemo(
    () => data.myParkingScheduleItemsForActiveDay,
    [data.myParkingScheduleItemsForActiveDay],
  );

  const activeDayMyScheduleItems = useMemo(
    () => data.myScheduleItemsForActiveDay,
    [data.myScheduleItemsForActiveDay],
  );

  const visibleEvents = useMemo(() => {
    if (showAllEvents) return activeDayMyScheduleItems;

    return activeDayMyScheduleItems.slice(0, 2);
  }, [showAllEvents, activeDayMyScheduleItems]);
  const selectedDaysParkingItems = useMemo(
    () =>
      scheduler.selectableSelectedDateIds.flatMap(
        (dateId) => data.parkingScheduleItemsByDate[dateId] ?? [],
      ),
    [scheduler.selectableSelectedDateIds, data.parkingScheduleItemsByDate],
  );

  const selectedDaysMyParkingItems = useMemo(
    () =>
      scheduler.selectableSelectedDateIds.flatMap(
        (dateId) => data.myParkingScheduleItemsByDate[dateId] ?? [],
      ),
    [scheduler.selectableSelectedDateIds, data.myParkingScheduleItemsByDate],
  );
  const conflictCount = useMemo(() => {
    if (!scheduler.hasBlockingConflict) return 0;

    return scheduler.conflictDateIds.length;
  }, [scheduler.hasBlockingConflict, scheduler.conflictDateIds.length]);
  
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

      activeDayMyScheduleItems,
      myScheduleItems: data.myScheduleItems,
      myScheduleItemsByDate: data.myScheduleItemsByDate,

      calendarCells: data.calendarCells,
      scheduler,

      parkingLot: data.parkingLot,
      parkingName: data.parkingName,
      parkingCapacity,

      parkingBuckets: data.parkingBuckets,

      parkingScheduleItemsForActiveDay: data.parkingScheduleItemsForActiveDay,
      myParkingScheduleItemsForActiveDay:
        data.myParkingScheduleItemsForActiveDay,

      activeDayParkingItems,
      activeDayMyParkingItems,

      selectedDaysParkingItems,
      selectedDaysMyParkingItems,

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
