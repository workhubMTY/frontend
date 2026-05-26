import { useMemo, useState } from "react";

import type {
  CalendarCell,
  CalendarSelectionAction,
  SelectionMode,
} from "../../types/reservaciones";

import { getRangeIds } from "../../lib/dates";

type UseCalendarDragSelectionParams = {
  calendarCells: CalendarCell[];
  selectionMode: SelectionMode;
  onSelect: (action: CalendarSelectionAction) => void;
};

export function useCalendarDragSelection({
  calendarCells,
  selectionMode,
  onSelect,
}: UseCalendarDragSelectionParams) {
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  const [dragPreviewIds, setDragPreviewIds] = useState<string[]>([]);

  const dragPreviewDatesSet = useMemo(
    () => new Set(dragPreviewIds),
    [dragPreviewIds],
  );

  const canDragSelect = selectionMode === "multiple";

  function isBlockedDate(dayId: string) {
    return calendarCells.find((cell) => cell.id === dayId)?.isWeekend ?? false;
  }

  function handlePointerDown(dayId: string) {
    if (isBlockedDate(dayId)) return;

    if (!canDragSelect) {
      onSelect({
        type: "day",
        dayId,
      });

      return;
    }

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

    if (dragPreviewIds.length <= 1) {
      onSelect({
        type: "day",
        dayId: dragStartId,
      });
    } else {
      onSelect({
        type: "range",
        dateIds: dragPreviewIds,
      });
    }

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
