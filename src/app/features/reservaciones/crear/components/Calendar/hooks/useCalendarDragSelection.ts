import { useMemo, useState } from "react";

import type {
  CalendarCell,
  CalendarSelectionAction,
  SelectionMode,
} from "@/app/features/reservaciones/crear/types/reservaciones";

import { getRangeIds } from "@/app/features/reservaciones/crear/lib/dates";

type UseCalendarDragSelectionParams = {
  activeDayId: string;
  selectedDateIds: string[];
  calendarCells: CalendarCell[];
  selectionMode: SelectionMode;
  onSelect: (action: CalendarSelectionAction) => void;
  onActivateDay: (dayId: string) => void;
};

export function useCalendarDragSelection({
  activeDayId,
  selectedDateIds,
  calendarCells,
  selectionMode,
  onSelect,
  onActivateDay,
}: UseCalendarDragSelectionParams) {
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  const [dragPreviewIds, setDragPreviewIds] = useState<string[]>([]);

  const selectedDatesSet = useMemo(
    () => new Set(selectedDateIds),
    [selectedDateIds],
  );

  const dragPreviewDatesSet = useMemo(
    () => new Set(dragPreviewIds),
    [dragPreviewIds],
  );

  const canDragSelect = selectionMode === "multiple";

  function isBlockedDate(dayId: string) {
    return calendarCells.find((cell) => cell.id === dayId)?.isWeekend ?? false;
  }

  function shouldOnlyActivateDay(dayId: string) {
    const isSelected = selectedDatesSet.has(dayId);
    const isActive = activeDayId === dayId;

    return isSelected && !isActive;
  }

  function handlePointerDown(dayId: string) {
    if (isBlockedDate(dayId)) return;

    if (!canDragSelect) {
      if (shouldOnlyActivateDay(dayId)) {
        onActivateDay(dayId);
        return;
      }

      onSelect({
        type: "day",
        dayId,
      });

      return;
    }

    /**
     * En multiple siempre iniciamos posible drag.
     * Todavía no sabemos si será click simple o rango.
     */
    setDragStartId(dayId);
    setDragPreviewIds([dayId]);
  }

  function handlePointerEnter(dayId: string) {
    if (!canDragSelect) return;
    if (dragStartId === null) return;
    if (isBlockedDate(dayId)) return;

    setDragPreviewIds(getRangeIds(dragStartId, dayId, calendarCells));
  }

  function finishDrag() {
    if (dragStartId === null) return;

    const isSingleDayClick = dragPreviewIds.length <= 1;

    if (isSingleDayClick) {
      if (shouldOnlyActivateDay(dragStartId)) {
        onActivateDay(dragStartId);
      } else {
        onSelect({
          type: "day",
          dayId: dragStartId,
        });
      }

      resetDragSelection();
      return;
    }

    onSelect({
      type: "range",
      dateIds: dragPreviewIds,
    });

    resetDragSelection();
  }

  function resetDragSelection() {
    setDragStartId(null);
    setDragPreviewIds([]);
  }

  return {
    dragPreviewDatesSet,
    handlePointerDown,
    handlePointerEnter,
    finishDrag,
  };
}