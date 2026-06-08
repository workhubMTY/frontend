"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { toTimelineEvent } from "@/app/features/reservaciones/crear/data/reservationsApi";
import { createCalendarCells } from "@/app/features/reservaciones/crear/lib/dates";

import { useSelectedSpace } from "@/app/features/reservaciones/crear/hooks/useSelectedSpace";
import { useReservationQueries } from "@/app/features/reservaciones/crear/hooks/useReservationQueries";
import { useReservationScheduler } from "@/app/features/reservaciones/crear/hooks/useReservationScheduler";

import type { ReservationDraft } from "@/app/features/reservaciones/confirmar/types/confirmation";

type UseReservationSchedulerViewModelParams = {
  showAllEvents: boolean;
};

export function useReservationSchedulerViewModel({
  showAllEvents,
}: UseReservationSchedulerViewModelParams) {
  const router = useRouter();

  const [confirmationDraft, setConfirmationDraft] =
    useState<ReservationDraft | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);

  const { selectedSpace, spaceId, spaceName } = useSelectedSpace();

  const calendarCells = useMemo(() => createCalendarCells(), []);

  const reservationQueries = useReservationQueries({
    calendarCells,
    reservableId: spaceId ? Number(spaceId) : null,
    enabled: Boolean(spaceId),
  });

  const scheduler = useReservationScheduler({
    calendarCells,
    spaceReservationsByDate: reservationQueries.spaceReservationsByDate,
  });

  const spaceReservationsForActiveDay = useMemo(
    () =>
      reservationQueries.spaceReservationsByDate[scheduler.activeDayId] ?? [],
    [reservationQueries.spaceReservationsByDate, scheduler.activeDayId],
  );

  const activeDayExternalEvents = useMemo(
    () =>
      reservationQueries.externalEventsForInterval.filter(
        (event) => event.dateId === scheduler.activeDayId,
      ),
    [reservationQueries.externalEventsForInterval, scheduler.activeDayId],
  );

  const externalTimelineEventsForActiveDay = useMemo(
    () =>
      activeDayExternalEvents.map((event) =>
        toTimelineEvent(event, "external"),
      ),
    [activeDayExternalEvents],
  );

  const proposedTimelineEventsForActiveDay = useMemo(
    () =>
      scheduler.proposedBlocksForActiveDay.map((block) => ({
        id: block.id,
        dateId: scheduler.activeDayId,
        start: block.start,
        end: block.end,
        title: block.label ?? "Horario propuesto",
        type: "pending",
        status: "normal",
      })),
    [scheduler.proposedBlocksForActiveDay, scheduler.activeDayId],
  );

  const conflictCount = useMemo(
    () =>
      activeDayExternalEvents.filter((event) => event.status !== "normal")
        .length,
    [activeDayExternalEvents],
  );
  const selectedDaysSpaceReservations = useMemo(
    () =>
      scheduler.selectableSelectedDateIds.flatMap(
        (dateId) => reservationQueries.spaceReservationsByDate[dateId] ?? [],
      ),
    [
      scheduler.selectableSelectedDateIds,
      reservationQueries.spaceReservationsByDate,
    ],
  );

  const selectedDaysExternalEvents = useMemo(
    () =>
      reservationQueries.externalEventsForInterval.filter((event) =>
        scheduler.selectableSelectedDateIds.includes(event.dateId),
      ),
    [
      reservationQueries.externalEventsForInterval,
      scheduler.selectableSelectedDateIds,
    ],
  );

  const visibleEvents = useMemo(() => {
    if (showAllEvents) return activeDayExternalEvents;

    return activeDayExternalEvents
      .filter((event) => event.status !== "normal")
      .slice(0, 2);
  }, [activeDayExternalEvents, showAllEvents]);

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

      activeDayExternalEvents,
      externalTimelineEventsForActiveDay,
      proposedTimelineEventsForActiveDay,
      spaceReservationsForActiveDay,

      conflictCount,
      visibleEvents,

      isLoading: reservationQueries.isLoading,
      isFetching: reservationQueries.isFetching,
      error: reservationQueries.error,

      confirmationDraft,
      isConfirmModalOpen,
      isFinishedModalOpen,

      selectedDaysSpaceReservations,
      selectedDaysExternalEvents,
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
