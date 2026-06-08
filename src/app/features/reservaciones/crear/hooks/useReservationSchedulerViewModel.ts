"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createCalendarCells } from "@/app/features/reservaciones/crear/lib/dates";

import { useSelectedSpace } from "@/app/features/reservaciones/crear/hooks/useSelectedSpace";
import { useReservationQueries } from "@/app/features/reservaciones/crear/hooks/useReservationQueries";
import { useReservationScheduler } from "@/app/features/reservaciones/crear/hooks/useReservationScheduler";

import type { ReservationDraft } from "@/app/features/reservaciones/confirmar/types/confirmation";
import { useAuth } from "@/app/shared/auth/useAuth";

type UseReservationSchedulerViewModelParams = {
  showAllEvents: boolean;
};

export function useReservationSchedulerViewModel({
  showAllEvents,
}: UseReservationSchedulerViewModelParams) {
  const router = useRouter();

  const { user } = useAuth();

  const [confirmationDraft, setConfirmationDraft] =
    useState<ReservationDraft | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);

  const { selectedSpace, spaceId, spaceName } = useSelectedSpace();

  const calendarCells = useMemo(() => createCalendarCells(), []);

  const reservationQueries = useReservationQueries({
    calendarCells,
    reservableId: spaceId ? Number(spaceId) : null,
    userId: user?.eId ? String(user.eId) : null,
    enabled: Boolean(spaceId && user?.eId),
  });

  const scheduler = useReservationScheduler({
    calendarCells,
    spaceScheduleItemsByDate: reservationQueries.spaceScheduleItemsByDate,
  });

  const activeDaySpaceScheduleItems = useMemo(
    () =>
      reservationQueries.spaceScheduleItemsByDate[scheduler.activeDayId] ?? [],
    [reservationQueries.spaceScheduleItemsByDate, scheduler.activeDayId],
  );

  const activeDayMyScheduleItems = useMemo(
    () => reservationQueries.myScheduleItemsByDate[scheduler.activeDayId] ?? [],
    [reservationQueries.myScheduleItemsByDate, scheduler.activeDayId],
  );

  const selectedDaysSpaceScheduleItems = useMemo(
    () =>
      scheduler.selectableSelectedDateIds.flatMap(
        (dateId) => reservationQueries.spaceScheduleItemsByDate[dateId] ?? [],
      ),
    [
      scheduler.selectableSelectedDateIds,
      reservationQueries.spaceScheduleItemsByDate,
    ],
  );

  const selectedDaysMyScheduleItems = useMemo(
    () =>
      scheduler.selectableSelectedDateIds.flatMap(
        (dateId) => reservationQueries.myScheduleItemsByDate[dateId] ?? [],
      ),
    [
      scheduler.selectableSelectedDateIds,
      reservationQueries.myScheduleItemsByDate,
    ],
  );

  const visibleMyScheduleItems = useMemo(() => {
    if (showAllEvents) return activeDayMyScheduleItems;

    return activeDayMyScheduleItems.slice(0, 2);
  }, [activeDayMyScheduleItems, showAllEvents]);

  const conflictCount = useMemo(
    () =>
      activeDayMyScheduleItems.filter((item) => item.status === "conflict")
        .length,
    [activeDayMyScheduleItems],
  );

  function openConfirmationModal() {
    if (!selectedSpace) return;

    const schedules = scheduler.createReservationSchedules();

    if (!schedules) return;

    setConfirmationDraft({
      reservableId: Number(selectedSpace.id),
      reservableCode: selectedSpace.code,
      reservableName: selectedSpace.name,
      schedules,
    });

    setIsConfirmModalOpen(true);
  }

  function closeConfirmationModal() {
    setIsConfirmModalOpen(false);
  }

  function handleReservationCompleted() {
    setIsConfirmModalOpen(false);
    setIsFinishedModalOpen(true);
  }

  function backToReservations() {
    setIsFinishedModalOpen(false);
    router.push("/cubiculos");
  }

  function cancelReservation() {
    router.push("/cubiculos");
  }

  return {
    state: {
      selectedSpace,
      spaceId,
      spaceName,
      calendarCells,
      scheduler,

      spaceScheduleItems: reservationQueries.spaceScheduleItems,
      myScheduleItems: reservationQueries.myScheduleItems,

      spaceScheduleItemsByDate: reservationQueries.spaceScheduleItemsByDate,
      myScheduleItemsByDate: reservationQueries.myScheduleItemsByDate,

      activeDaySpaceScheduleItems,
      activeDayMyScheduleItems,

      selectedDaysSpaceScheduleItems,
      selectedDaysMyScheduleItems,

      visibleMyScheduleItems,
      conflictCount,

      isLoading: reservationQueries.isLoading,
      isFetching: reservationQueries.isFetching,
      error: reservationQueries.error,

      confirmationDraft,
      isConfirmModalOpen,
      isFinishedModalOpen,
    },
    actions: {
      openConfirmationModal,
      closeConfirmationModal,
      handleReservationCompleted,
      backToReservations,
      cancelReservation,
    },
  };
}
