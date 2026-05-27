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
   * Aquí entran las reservaciones reales de la api
   *
   * Ejemplo:
   * {
   *   "2026-05-21": [
   *      { id: "...", start: "08:00 PM", end: "09:00 PM", ... }
   *   ]
   * }
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

  const [dayBlocks, setDayBlocks] = useState<Record<string, TimeBlock[]>>({});

  const [pendingBlocks, setPendingBlocks] = useState<TimeBlock[]>([]);

  const [editedSavedDateIds, setEditedSavedDateIds] = useState<string[]>([]);

  const [hasAppliedCurrentSelection, setHasAppliedCurrentSelection] =
    useState(false);

  const modifiedDateIds = useMemo(
    () => uniqueSortedIds(Object.keys(dayBlocks)),
    [dayBlocks],
  );

  const activeBlocks = dayBlocks[activeDayId] ?? [];

  function isWeekendDateId(dateId: string) {
    return calendarCells.find((cell) => cell.id === dateId)?.isWeekend ?? false;
  }

  function getAffectedDateIdsForBlock(block: TimeBlock) {
    const selectableDateIds = selectedDateIds.filter(
      (dateId) => !isWeekendDateId(dateId),
    );

    if (selectableDateIds.length === 0) {
      return [];
    }

    if (block.applyToAllSelected) {
      return selectableDateIds;
    }

    if (!selectableDateIds.includes(activeDayId)) {
      return [];
    }

    return [activeDayId];
  }

  const pendingBlocksForActiveDay = useMemo(
    () =>
      pendingBlocks.filter((block) =>
        getAffectedDateIdsForBlock(block).includes(activeDayId),
      ),
    [pendingBlocks, selectedDateIds, activeDayId, calendarCells],
  );

  const affectedDateIdsForPendingBlocks = useMemo(
    () =>
      uniqueSortedIds(
        pendingBlocks.flatMap((block) => getAffectedDateIdsForBlock(block)),
      ),
    [pendingBlocks, selectedDateIds, activeDayId, calendarCells],
  );

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
        setHasAppliedCurrentSelection(false);
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
        setHasAppliedCurrentSelection(false);
        return;
      }

      if (selectionMode === "multiple") {
        if (hasAppliedCurrentSelection) {
          setSelectedDateIds([dayId]);
          setActiveDayId(dayId);
          setHasAppliedCurrentSelection(false);
          return;
        }

        setSelectedDateIds((previousDateIds) => {
          const alreadySelected = previousDateIds.includes(dayId);
          const alreadyActive = activeDayId === dayId;

          if (!alreadySelected) {
            return uniqueSortedIds([...previousDateIds, dayId]);
          }

          if (alreadySelected && !alreadyActive) {
            return previousDateIds;
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

      setSelectedDateIds((previousDateIds) => {
        if (hasAppliedCurrentSelection) {
          return draggedDateIds;
        }

        return mergeOrRemoveRange(previousDateIds, draggedDateIds);
      });

      setHasAppliedCurrentSelection(false);
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
      setHasAppliedCurrentSelection(false);
    }
  }

  function clearSelection() {
    setSelectedDateIds([]);
    setHasAppliedCurrentSelection(false);
  }

  function deleteSavedBlock(dateId: string, blockId: string) {
    setDayBlocks((previousBlocks) => {
      const blocksForDate = previousBlocks[dateId] ?? [];

      return {
        ...previousBlocks,
        [dateId]: blocksForDate.filter((block) => block.id !== blockId),
      };
    });

    setEditedSavedDateIds((previousDateIds) =>
      uniqueSortedIds([...previousDateIds, dateId]),
    );
  }

  function updateSavedBlock(
    dateId: string,
    blockId: string,
    field: "start" | "end",
    value: string,
  ) {
    setDayBlocks((previousBlocks) => {
      const blocksForDate = previousBlocks[dateId] ?? [];

      return {
        ...previousBlocks,
        [dateId]: blocksForDate.map((block) =>
          block.id === blockId
            ? {
                ...block,
                [field]: value,
                conflict: undefined,
              }
            : block,
        ),
      };
    });

    setEditedSavedDateIds((previousDateIds) =>
      uniqueSortedIds([...previousDateIds, dateId]),
    );
  }

  function updatePendingBlock(
    blockId: string,
    field: "start" | "end",
    value: string,
  ) {
    setPendingBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              [field]: value,
            }
          : block,
      ),
    );
  }

  function togglePendingBlockScope(blockId: string) {
    setPendingBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              applyToAllSelected: !block.applyToAllSelected,
            }
          : block,
      ),
    );
  }

  function deletePendingBlock(blockId: string) {
    setPendingBlocks((currentBlocks) =>
      currentBlocks.filter((block) => block.id !== blockId),
    );
  }

  function addPendingBlock() {
    const nextNumber = pendingBlocks.length + 1;

    setPendingBlocks((currentBlocks) => [
      ...currentBlocks,
      {
        id: `p-${Date.now()}`,
        label: `Nuevo ${nextNumber}`,
        start: "08:00 PM",
        end: "09:00 PM",
        applyToAllSelected: true,
      },
    ]);
  }

  function buildNextDayBlocks() {
    const nextDayBlocks = { ...dayBlocks };

    pendingBlocks.forEach((block, blockIndex) => {
      const dateIdsForBlock = getAffectedDateIdsForBlock(block);

      dateIdsForBlock.forEach((dateId) => {
        const currentBlocksForDate = nextDayBlocks[dateId] ?? [];

        nextDayBlocks[dateId] = [
          ...currentBlocksForDate,
          {
            ...block,
            id: `b-${dateId}-${Date.now()}-${blockIndex}`,
            label: `Bloque ${currentBlocksForDate.length + 1}`,
            applyToAllSelected: undefined,
          },
        ];
      });
    });

    return nextDayBlocks;
  }

  function applyPendingBlocks() {
    if (!canSaveChanges) return;

    if (pendingBlocks.length > 0) {
      const nextDayBlocks = buildNextDayBlocks();

      setSelectedDateIds((previousDateIds) =>
        uniqueSortedIds([
          ...previousDateIds,
          ...affectedDateIdsForPendingBlocks,
        ]),
      );

      setDayBlocks(nextDayBlocks);
      setPendingBlocks([]);
    }

    setEditedSavedDateIds([]);
    setHasAppliedCurrentSelection(true);
  }

  const conflictDateIds = useMemo(() => {
    const conflictIds = new Set<string>();

    Object.entries(dayBlocks).forEach(([dateId, blocks]) => {
      const reservationsForDate = spaceReservationsByDate[dateId] ?? [];

      const hasInternalConflict = hasOverlappingBlocks(blocks);

      const hasSpaceConflict = blocks.some((block) =>
        reservationsForDate.some((reservation) =>
          blockOverlapsReservation(block, reservation),
        ),
      );

      if (hasInternalConflict || hasSpaceConflict) {
        conflictIds.add(dateId);
      }
    });

    pendingBlocks.forEach((block) => {
      getAffectedDateIdsForBlock(block).forEach((dateId) => {
        const reservationsForDate = spaceReservationsByDate[dateId] ?? [];

        const hasPendingSpaceConflict = reservationsForDate.some(
          (reservation) => blockOverlapsReservation(block, reservation),
        );

        if (hasPendingSpaceConflict) {
          conflictIds.add(dateId);
        }
      });
    });

    return uniqueSortedIds(Array.from(conflictIds));
  }, [
    dayBlocks,
    pendingBlocks,
    selectedDateIds,
    activeDayId,
    calendarCells,
    spaceReservationsByDate,
  ]);

  const selectedSavedBlocksHaveSpaceConflict = selectedDateIds.some(
    (dateId) => {
      if (isWeekendDateId(dateId)) return false;

      const blocksForDate = dayBlocks[dateId] ?? [];
      const reservationsForDate = spaceReservationsByDate[dateId] ?? [];

      return blocksForDate.some((block) =>
        reservationsForDate.some((reservation) =>
          blockOverlapsReservation(block, reservation),
        ),
      );
    },
  );

  const pendingBlocksHaveSpaceConflict = pendingBlocks.some((block) =>
    getAffectedDateIdsForBlock(block).some((dateId) => {
      const reservationsForDate = spaceReservationsByDate[dateId] ?? [];

      return reservationsForDate.some((reservation) =>
        blockOverlapsReservation(block, reservation),
      );
    }),
  );

  const hasBlockingSpaceConflict =
    selectedSavedBlocksHaveSpaceConflict || pendingBlocksHaveSpaceConflict;

  const hasPendingChanges = pendingBlocks.length > 0;
  const hasSavedBlockEdits = editedSavedDateIds.length > 0;

  const hasValidPendingTarget =
    hasPendingChanges && affectedDateIdsForPendingBlocks.length > 0;

  const hasSavedBlocksToContinue = Object.values(dayBlocks).some(
    (blocks) => blocks.length > 0,
  );

  const canSaveChanges =
    (hasValidPendingTarget || hasSavedBlockEdits) && !hasBlockingSpaceConflict;

  const canContinue =
    !hasBlockingSpaceConflict &&
    (hasValidPendingTarget || hasSavedBlockEdits || hasSavedBlocksToContinue);

  function createReservationDraft(selectedSpace: SelectedSpace) {
    if (!canContinue) return null;

    let finalDayBlocks = dayBlocks;

    if (pendingBlocks.length > 0) {
      finalDayBlocks = buildNextDayBlocks();

      setDayBlocks(finalDayBlocks);
      setPendingBlocks([]);
      setEditedSavedDateIds([]);
      setHasAppliedCurrentSelection(true);
    }

    const schedules: ReservationDraftSchedule[] = [];

    Object.entries(finalDayBlocks).forEach(([dateId, blocks]) => {
      blocks.forEach((block) => {
        const start = to24Hour(block.start);
        const end = to24Hour(block.end);

        schedules.push({
          start_time: new Date(`${dateId}T${start}:00`).toISOString(),
          end_time: new Date(`${dateId}T${end}:00`).toISOString(),
        });
      });
    });

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
    activeDayId,
    dayBlocks,
    pendingBlocks,
    editedSavedDateIds,

    modifiedDateIds,
    conflictDateIds,
    activeBlocks,
    pendingBlocksForActiveDay,
    affectedDateIdsForPendingBlocks,

    hasBlockingSpaceConflict,
    canSaveChanges,
    canContinue,

    setActiveDayId,
    handleModeChange,
    handleCalendarSelect,
    clearSelection,

    addPendingBlock,
    updatePendingBlock,
    deletePendingBlock,
    togglePendingBlockScope,

    updateSavedBlock,
    deleteSavedBlock,

    applyPendingBlocks,
    createReservationDraft,
  };
}
