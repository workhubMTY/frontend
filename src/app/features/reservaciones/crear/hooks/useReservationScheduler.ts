"use client";

import { useMemo, useState } from "react";

import type {
  CalendarCell,
  CalendarSelectionAction,
  SelectionMode,
  TimeBlock,
} from "@/app/features/reservaciones/crear/types/reservaciones";

import { getFirstAvailableDateId } from "@/app/features/reservaciones/crear/lib/dates";
import { hasOverlappingBlocks } from "@/app/features/reservaciones/crear/lib/conflicts";
import { uniqueSortedIds } from "@/app/features/reservaciones/crear/lib/formatting";
import {
  isValidTimeRange,
  normalizeTimeInput,
  parseTimeToMinutes,
} from "@/app/features/reservaciones/crear/lib/time";
import { ScheduleItem, ScheduleItemsByDate } from "../types/schedule";

type UseReservationSchedulerParams = {
  calendarCells: CalendarCell[];
  spaceScheduleItemsByDate?: ScheduleItemsByDate;
};
function blockOverlapsScheduleItem(block: TimeBlock, item: ScheduleItem) {
  const blockStart = parseTimeToMinutes(block.start);
  const blockEnd = parseTimeToMinutes(block.end);

  const itemStart = parseTimeToMinutes(item.start);
  const itemEnd = parseTimeToMinutes(item.end);

  if (
    blockStart === null ||
    blockEnd === null ||
    itemStart === null ||
    itemEnd === null
  ) {
    return false;
  }

  return blockStart < itemEnd && blockEnd > itemStart;
}
export function useReservationScheduler({
  calendarCells,
  spaceScheduleItemsByDate = {},
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
    draggedDateIds: string[],
  ) {
    const previousDateIdsSet = new Set(previousDateIds);

    const isEntireRangeAlreadySelected = draggedDateIds.every((dateId) =>
      previousDateIdsSet.has(dateId),
    );

    if (isEntireRangeAlreadySelected) {
      return uniqueSortedIds(
        previousDateIds.filter((dateId) => !draggedDateIds.includes(dateId)),
      );
    }

    return uniqueSortedIds([...previousDateIds, ...draggedDateIds]);
  }

  function handleCalendarSelect(action: CalendarSelectionAction) {
    if (action.type === "day") {
      const dayId = action.dayId;

      if (isWeekendDateId(dayId)) return;

      setActiveDayId(dayId);

      if (selectionMode === "single") {
        setSelectedDateIds([dayId]);
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
        return;
      }

      if (selectionMode === "multiple") {
        setSelectedDateIds((previousDateIds) => {
          const alreadySelected = previousDateIds.includes(dayId);

          if (alreadySelected) {
            return uniqueSortedIds(
              previousDateIds.filter(
                (selectedDayId) => selectedDayId !== dayId,
              ),
            );
          }

          return uniqueSortedIds([...previousDateIds, dayId]);
        });
      }
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

      setActiveDayId(draggedDateIds[0]);
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
        start: "",
        end: "",
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

  const proposedBlocksHaveInternalConflict =
    hasOverlappingBlocks(proposedBlocks);
  const proposedBlocksHaveSpaceConflict = selectableSelectedDateIds.some(
    (dateId) => {
      const scheduleItemsForDate = spaceScheduleItemsByDate[dateId] ?? [];

      return proposedBlocks.some((block) =>
        scheduleItemsForDate.some((item) =>
          blockOverlapsScheduleItem(block, item),
        ),
      );
    },
  );

  const hasBlockingConflict =
    proposedBlocksHaveInternalConflict || proposedBlocksHaveSpaceConflict;

  const proposedBlocksHaveValidTimes = proposedBlocks.every((block) =>
    isValidTimeRange(block.start, block.end),
  );

  const canContinue =
    selectableSelectedDateIds.length > 0 &&
    proposedBlocks.length > 0 &&
    proposedBlocksHaveValidTimes &&
    !hasBlockingConflict;
  const conflictDateIds = useMemo(() => {
    const conflictIds = new Set<string>();

    selectableSelectedDateIds.forEach((dateId) => {
      const scheduleItemsForDate = spaceScheduleItemsByDate[dateId] ?? [];

      const hasSpaceConflict = proposedBlocks.some((block) =>
        scheduleItemsForDate.some((item) =>
          blockOverlapsScheduleItem(block, item),
        ),
      );

      if (proposedBlocksHaveInternalConflict || hasSpaceConflict) {
        conflictIds.add(dateId);
      }
    });

    return uniqueSortedIds(Array.from(conflictIds));
  }, [
    selectableSelectedDateIds,
    proposedBlocks,
    proposedBlocksHaveInternalConflict,
    spaceScheduleItemsByDate,
  ]);

  function createReservationSchedules() {
    if (!canContinue) return null;

    return selectableSelectedDateIds.flatMap((dateId) =>
      proposedBlocks.map((block) => {
        const start = normalizeTimeInput(block.start);
        const end = normalizeTimeInput(block.end);

        if (!start || !end) {
          throw new Error("Invalid proposed block time");
        }

        return {
          start_time: new Date(`${dateId}T${start}:00`).toISOString(),
          end_time: new Date(`${dateId}T${end}:00`).toISOString(),
        };
      }),
    );
  }

  return {
    selectionMode,
    selectedDateIds,
    selectableSelectedDateIds,
    activeDayId,
    activeDayIsSelected,
    proposedBlocks,
    proposedBlocksForActiveDay,
    conflictDateIds,
    proposedBlocksHaveInternalConflict,
    proposedBlocksHaveSpaceConflict,
    proposedBlocksHaveValidTimes,
    hasBlockingConflict,
    canContinue,

    setActiveDayId,
    handleCalendarSelect,
    handleModeChange,
    clearSelection,
    addProposedBlock,
    updateProposedBlock,
    deleteProposedBlock,
    createReservationSchedules,
  };
}
