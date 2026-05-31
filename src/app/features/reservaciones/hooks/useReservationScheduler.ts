"use client";

import { useMemo, useState } from "react";

import type {
  CalendarCell,
  CalendarSelectionAction,
  SelectionMode,
  TimeBlock,
  TimelineEvent,
} from "@/app/features/reservaciones/types/reservaciones";

import { getFirstAvailableDateId } from "@/app/features/reservaciones/lib/dates";
import { hasOverlappingBlocks } from "@/app/features/reservaciones/lib/conflicts";
import { uniqueSortedIds } from "@/app/features/reservaciones/lib/formatting";
import { to24Hour } from "@/app/features/reservaciones/lib/time";

type SelectedSpace = {
  id: string;
  name: string;
};

type ReservationDraftSchedule = {
  start_time: string;
  end_time: string;
};

type SpaceReservationsByDate = Record<string, TimelineEvent[]>;

type UseReservationSchedulerParams = {
  calendarCells: CalendarCell[];

  /**
   * Reservaciones reales que ya existen en la API.
   * El scheduler solo las usa para validar conflictos.
   */
  spaceReservationsByDate?: SpaceReservationsByDate;
};

function blockOverlapsReservation(
  block: TimeBlock,
  reservation: TimelineEvent,
) {
  const blockStart = to24Hour(block.start);
  const blockEnd = to24Hour(block.end);

  const reservationStart = to24Hour(reservation.start);
  const reservationEnd = to24Hour(reservation.end);

  return blockStart < reservationEnd && blockEnd > reservationStart;
}

export function useReservationScheduler({
  calendarCells,
  spaceReservationsByDate = {},
}: UseReservationSchedulerParams) {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("multiple");

  const [selectedDateIds, setSelectedDateIds] = useState<string[]>([]);

  const [activeDayId, setActiveDayId] = useState(
    getFirstAvailableDateId(calendarCells),
  );

  const [proposedBlocks, setProposedBlocks] = useState<TimeBlock[]>([]);

  function isWeekendDateId(dateId: string) {
    return calendarCells.find((cell) => cell.id === dateId)?.isWeekend ?? false;
  }

  const selectableSelectedDateIds = useMemo(
    () => selectedDateIds.filter((dateId) => !isWeekendDateId(dateId)),
    [selectedDateIds, calendarCells],
  );

  const activeDayIsSelected = selectedDateIds.includes(activeDayId);

  const proposedBlocksForActiveDay = useMemo(() => {
    if (!activeDayIsSelected) return [];

    return proposedBlocks;
  }, [activeDayIsSelected, proposedBlocks]);

  function mergeOrRemoveRange(
    previousDateIds: string[],
    rangeDateIds: string[],
  ) {
    const previousDateIdsSet = new Set(previousDateIds);

    const fullRangeAlreadySelected = rangeDateIds.every((dateId) =>
      previousDateIdsSet.has(dateId),
    );

    if (fullRangeAlreadySelected) {
      return uniqueSortedIds(
        previousDateIds.filter((dateId) => !rangeDateIds.includes(dateId)),
      );
    }

    return uniqueSortedIds([...previousDateIds, ...rangeDateIds]);
  }

  function handleCalendarSelect(action: CalendarSelectionAction) {
    if (action.type === "day") {
      const dayId = action.dayId;

      if (isWeekendDateId(dayId)) return;

      if (selectionMode === "single") {
        setSelectedDateIds([dayId]);
        setActiveDayId(dayId);
        return;
      }

      if (selectionMode === "repeat") {
        const selectedCell = calendarCells.find((cell) => cell.id === dayId);
        if (!selectedCell) return;

        const repeatedDateIds = calendarCells
          .filter(
            (cell) =>
              !cell.isWeekend &&
              cell.date >= selectedCell.date &&
              cell.date.getDay() === selectedCell.date.getDay(),
          )
          .map((cell) => cell.id);

        setSelectedDateIds(uniqueSortedIds(repeatedDateIds));
        setActiveDayId(dayId);
        return;
      }

      if (selectionMode === "multiple") {
        setSelectedDateIds((previousDateIds) => {
          const alreadySelected = previousDateIds.includes(dayId);

          if (!alreadySelected) {
            return uniqueSortedIds([...previousDateIds, dayId]);
          }

          return uniqueSortedIds(
            previousDateIds.filter((selectedDayId) => selectedDayId !== dayId),
          );
        });

        setActiveDayId(dayId);
      }

      return;
    }

    if (action.type === "range") {
      if (selectionMode !== "multiple") return;

      const draggedDateIds = uniqueSortedIds(
        action.dateIds.filter((dateId) => !isWeekendDateId(dateId)),
      );

      if (draggedDateIds.length === 0) return;

      setSelectedDateIds((previousDateIds) =>
        mergeOrRemoveRange(previousDateIds, draggedDateIds),
      );

      setActiveDayId(draggedDateIds[0] ?? activeDayId);
    }
  }

  function handleModeChange(mode: SelectionMode) {
    setSelectionMode(mode);

    if (mode === "single") {
      const nextDayId = !isWeekendDateId(activeDayId)
        ? activeDayId
        : (selectedDateIds.find((dateId) => !isWeekendDateId(dateId)) ??
          getFirstAvailableDateId(calendarCells));

      setSelectedDateIds([nextDayId]);
      setActiveDayId(nextDayId);
    }
  }

  function clearSelection() {
    setSelectedDateIds([]);
  }

  function addProposedBlock() {
    const nextNumber = proposedBlocks.length + 1;

    setProposedBlocks((currentBlocks) => [
      ...currentBlocks,
      {
        id: `p-${Date.now()}`,
        label: `Horario ${nextNumber}`,
        start: "08:00 PM",
        end: "09:00 PM",
      },
    ]);
  }

  function updateProposedBlock(
    blockId: string,
    field: "start" | "end",
    value: string,
  ) {
    setProposedBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              [field]: value,
              conflict: undefined,
            }
          : block,
      ),
    );
  }

  function deleteProposedBlock(blockId: string) {
    setProposedBlocks((currentBlocks) =>
      currentBlocks.filter((block) => block.id !== blockId),
    );
  }

  const conflictDateIds = useMemo(() => {
    const conflictIds = new Set<string>();

    selectableSelectedDateIds.forEach((dateId) => {
      const reservationsForDate = spaceReservationsByDate[dateId] ?? [];

      const hasInternalConflict = hasOverlappingBlocks(proposedBlocks);

      const hasSpaceConflict = proposedBlocks.some((block) =>
        reservationsForDate.some((reservation) =>
          blockOverlapsReservation(block, reservation),
        ),
      );

      if (hasInternalConflict || hasSpaceConflict) {
        conflictIds.add(dateId);
      }
    });

    return uniqueSortedIds(Array.from(conflictIds));
  }, [selectableSelectedDateIds, proposedBlocks, spaceReservationsByDate]);

  const proposedBlocksHaveInternalConflict =
    hasOverlappingBlocks(proposedBlocks);

  const proposedBlocksHaveSpaceConflict = selectableSelectedDateIds.some(
    (dateId) => {
      const reservationsForDate = spaceReservationsByDate[dateId] ?? [];

      return proposedBlocks.some((block) =>
        reservationsForDate.some((reservation) =>
          blockOverlapsReservation(block, reservation),
        ),
      );
    },
  );

  const hasBlockingConflict =
    proposedBlocksHaveInternalConflict || proposedBlocksHaveSpaceConflict;

  const canContinue =
    selectableSelectedDateIds.length > 0 &&
    proposedBlocks.length > 0 &&
    !hasBlockingConflict;
  function createReservationSchedules() {
    if (!canContinue) return null;

    return selectableSelectedDateIds.flatMap((dateId) =>
      proposedBlocks.map((block) => {
        const start = to24Hour(block.start);
        const end = to24Hour(block.end);

        return {
          start_time: new Date(`${dateId}T${start}:00`).toISOString(),
          end_time: new Date(`${dateId}T${end}:00`).toISOString(),
        };
      }),
    );
  }
  function createReservationDraft(selectedSpace: SelectedSpace) {
    const schedules = createReservationSchedules();

    if (!schedules) return null;

    const draft = {
      reservableId: selectedSpace.id,
      reservableName: selectedSpace.name,
      schedules,
    };

    window.sessionStorage.setItem(
      "cubiculos:reservationDraft",
      JSON.stringify(draft),
    );

    return draft;
  }
  return {
    selectionMode,
    selectedDateIds,
    selectableSelectedDateIds,
    activeDayId,

    proposedBlocks,
    proposedBlocksForActiveDay,

    activeDayIsSelected,
    conflictDateIds,
    hasBlockingConflict,
    canContinue,

    setActiveDayId,
    handleModeChange,
    handleCalendarSelect,
    clearSelection,

    addProposedBlock,
    updateProposedBlock,
    deleteProposedBlock,

    createReservationSchedules,
    createReservationDraft,
  };
}
