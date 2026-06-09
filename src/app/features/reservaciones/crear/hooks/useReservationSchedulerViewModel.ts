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

  const userId = user?.eId ? String(user.eId) : null;

  const reservationQueries = useReservationQueries({
    calendarCells,
    reservableId: spaceId ? Number(spaceId) : null,
    userId,
    enabled: Boolean(spaceId && userId),
  });

  /**
   * El scheduler SOLO debe conocer las reservaciones del espacio actual.
   * Estas son las únicas que bloquean la selección.
   */
  const scheduler = useReservationScheduler({
    calendarCells,
    spaceScheduleItemsByDate: reservationQueries.spaceScheduleItemsByDate,
  });

  /**
   * Día activo: espacio actual.
   * Estos datos sí bloquean.
   */
  const activeDayBlockingScheduleItems = useMemo(
    () =>
      reservationQueries.spaceScheduleItemsByDate[scheduler.activeDayId] ?? [],
    [reservationQueries.spaceScheduleItemsByDate, scheduler.activeDayId],
  );

  const activeDaySpaceScheduleItems = activeDayBlockingScheduleItems;

  /**
   * Día activo: agenda del usuario.
   * Estos datos son informativos.
   * Pueden incluir una reservación que también aparece en el espacio ocupado.
   */
  const activeDayMyScheduleItems = useMemo(
    () => reservationQueries.myScheduleItemsByDate[scheduler.activeDayId] ?? [],
    [reservationQueries.myScheduleItemsByDate, scheduler.activeDayId],
  );
  const activeDayMyOfficeScheduleItems = useMemo(() => {
    const items =
      reservationQueries.myOfficeScheduleItemsByDate[scheduler.activeDayId] ??
      [];

    return items.filter((item) => item.lifecycleStatus === "ACTIVE");
  }, [reservationQueries.myOfficeScheduleItemsByDate, scheduler.activeDayId]);

  const activeDayMyParkingScheduleItems = useMemo(() =>{
    const items = reservationQueries.myParkingScheduleItemsByDate[scheduler.activeDayId] ??
      []
      return items.filter(item => item.lifecycleStatus ==="ACTIVE")
  },
    [reservationQueries.myParkingScheduleItemsByDate, scheduler.activeDayId]
  );

  const activeDayMyEventScheduleItems = useMemo(
    () =>
      reservationQueries.myEventScheduleItemsByDate[scheduler.activeDayId] ??
      [],
    [reservationQueries.myEventScheduleItemsByDate, scheduler.activeDayId],
  );

  /**
   * Días seleccionados: espacio actual.
   * Estos datos sí bloquean continuar.
   */
  const selectedDaysBlockingScheduleItems = useMemo(
    () =>
      scheduler.selectableSelectedDateIds.flatMap(
        (dateId) => reservationQueries.spaceScheduleItemsByDate[dateId] ?? [],
      ),
    [
      scheduler.selectableSelectedDateIds,
      reservationQueries.spaceScheduleItemsByDate,
    ],
  );

  const selectedDaysSpaceScheduleItems = selectedDaysBlockingScheduleItems;

  /**
   * Días seleccionados: agenda del usuario.
   * Estos datos NO bloquean.
   */
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

  const selectedDaysMyOfficeScheduleItems = useMemo(
    () =>
      scheduler.selectableSelectedDateIds.flatMap(
        (dateId) =>
          reservationQueries.myOfficeScheduleItemsByDate[dateId] ?? [],
      ),
    [
      scheduler.selectableSelectedDateIds,
      reservationQueries.myOfficeScheduleItemsByDate,
    ],
  );

  const selectedDaysMyParkingScheduleItems = useMemo(
    () =>
      scheduler.selectableSelectedDateIds.flatMap(
        (dateId) =>
          reservationQueries.myParkingScheduleItemsByDate[dateId] ?? [],
      ),
    [
      scheduler.selectableSelectedDateIds,
      reservationQueries.myParkingScheduleItemsByDate,
    ],
  );

  const selectedDaysMyEventScheduleItems = useMemo(
    () =>
      scheduler.selectableSelectedDateIds.flatMap(
        (dateId) => reservationQueries.myEventScheduleItemsByDate[dateId] ?? [],
      ),
    [
      scheduler.selectableSelectedDateIds,
      reservationQueries.myEventScheduleItemsByDate,
    ],
  );

  const visibleMyScheduleItems = useMemo(() => {
    if (showAllEvents) return activeDayMyScheduleItems;

    return activeDayMyScheduleItems.slice(0, 2);
  }, [activeDayMyScheduleItems, showAllEvents]);

  const blockingConflictCount = useMemo(
    () => scheduler.conflictDateIds.length,
    [scheduler.conflictDateIds],
  );

  const conflictCount = blockingConflictCount;

  const hasBlockingConflict = scheduler.hasBlockingConflict;
  const canContinue = scheduler.canContinue;

  function openConfirmationModal() {
    if (!selectedSpace) return;

    /**
     * Solo bloquea si empalma con reservaciones del espacio actual.
     * Si empalma con mi agenda personal, sí puede continuar.
     */
    if (hasBlockingConflict) return;

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

      timeline: reservationQueries.timeline,

      spaceScheduleItems: reservationQueries.spaceScheduleItems,

      myScheduleItems: reservationQueries.myScheduleItems,
      myOfficeScheduleItems: reservationQueries.myOfficeScheduleItems,
      myParkingScheduleItems: reservationQueries.myParkingScheduleItems,
      myEventScheduleItems: reservationQueries.myEventScheduleItems,

      myOfficeReservations: reservationQueries.myOfficeReservations,
      myParkingReservations: reservationQueries.myParkingReservations,
      myEvents: reservationQueries.myEvents,

      spaceScheduleItemsByDate: reservationQueries.spaceScheduleItemsByDate,
      blockingScheduleItemsByDate: reservationQueries.spaceScheduleItemsByDate,

      myScheduleItemsByDate: reservationQueries.myScheduleItemsByDate,
      myOfficeScheduleItemsByDate:
        reservationQueries.myOfficeScheduleItemsByDate,
      myParkingScheduleItemsByDate:
        reservationQueries.myParkingScheduleItemsByDate,
      myEventScheduleItemsByDate: reservationQueries.myEventScheduleItemsByDate,

      activeDaySpaceScheduleItems,
      activeDayBlockingScheduleItems,

      activeDayMyScheduleItems,
      activeDayMyOfficeScheduleItems,
      activeDayMyParkingScheduleItems,
      activeDayMyEventScheduleItems,

      selectedDaysSpaceScheduleItems,
      selectedDaysBlockingScheduleItems,

      selectedDaysMyScheduleItems,
      selectedDaysMyOfficeScheduleItems,
      selectedDaysMyParkingScheduleItems,
      selectedDaysMyEventScheduleItems,

      visibleMyScheduleItems,

      conflictCount,
      blockingConflictCount,

      hasBlockingConflict,
      canContinue,

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
