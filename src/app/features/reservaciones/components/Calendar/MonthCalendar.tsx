import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import type { CalendarCell, SelectionMode } from "../../types/reservaciones";
import { getRangeIds } from "../../lib/dates";
import { cn } from "../../lib/cn";
import { CalendarSelectionAction } from "../../types/reservaciones";

type MonthCalendarProps = {
  activeDayId: string;
  selectionMode: SelectionMode;
  selectedDateIds: string[];
  modifiedDateIds: string[];
  conflictDateIds: string[];
  calendarCells: CalendarCell[];
  variant?: "default" | "compact";
  onSelect: (action: CalendarSelectionAction) => void;
};

export function MonthCalendar({
  activeDayId,
  selectionMode,
  selectedDateIds,
  modifiedDateIds,
  conflictDateIds,
  calendarCells,
  variant = "default",
  onSelect,
}: MonthCalendarProps) {
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  const [dragPreviewIds, setDragPreviewIds] = useState<string[]>([]);

  const selectedDatesSet = new Set(selectedDateIds);
  const modifiedDatesSet = new Set(modifiedDateIds);
  const conflictDatesSet = new Set(conflictDateIds);
  const dragPreviewDatesSet = new Set(dragPreviewIds);
  const canDragSelect = selectionMode === "multiple";

  function isBlockedDate(dayId: string) {
    return calendarCells.find((cell) => cell.id === dayId)?.isWeekend ?? false;
  }

  function handlePointerDown(dayId: string) {
    if (isBlockedDate(dayId)) return;

    if (selectionMode === "single" || selectionMode === "repeat") {
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
    if (!canDragSelect || dragStartId === null || isBlockedDate(dayId)) return;
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

    setDragStartId(null);
    setDragPreviewIds([]);
  }

  return (
    <div onPointerUp={finishDrag} onPointerLeave={finishDrag}>
      <div className="mb-4 flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-800">
          {calendarCells[0]?.date.toLocaleDateString("es-MX", {
            month: "short",
            day: "numeric",
          })}{" "}
          -{" "}
          {calendarCells[calendarCells.length - 1]?.date.toLocaleDateString(
            "es-MX",
            { month: "short", day: "numeric" },
          )}
        </p>
      </div>

      <div
        className={cn(
          "grid select-none grid-cols-7 text-center text-xs",
          variant === "compact" ? "gap-y-1" : "gap-y-3",
        )}
      >
        {" "}
        {["D", "L", "M", "M", "J", "V", "S"].map((dayLabel, index) => (
          <div
            key={`${dayLabel}-${index}`}
            className="pb-1 text-xs font-semibold text-slate-500"
          >
            {dayLabel}
          </div>
        ))}
        {Array.from({ length: calendarCells[0]?.date.getDay() ?? 0 }).map(
          (_, index) => (
            <div key={`calendar-placeholder-${index}`} aria-hidden="true" />
          ),
        )}
        {calendarCells.map((cell) => {
          const isSelected = selectedDatesSet.has(cell.id);
          const isModified = modifiedDatesSet.has(cell.id);
          const hasConflict = conflictDatesSet.has(cell.id);
          const isPreview = dragPreviewDatesSet.has(cell.id);
          const isActive = activeDayId === cell.id;
          const isModifiedAndSelected = isModified && isSelected;
          const isConflictAndSelected = hasConflict && isSelected;

          return (
            <button
              key={cell.id}
              type="button"
              disabled={cell.isWeekend}
              onPointerDown={() => handlePointerDown(cell.id)}
              onPointerEnter={() => handlePointerEnter(cell.id)}
              title={cell.date.toLocaleDateString("es-MX", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              className={cn(
                "relative mx-auto flex flex-col items-center justify-center rounded-md text-xs font-medium transition",
                variant === "compact" ? "h-8 w-8" : "h-10 w-10",
                cell.isWeekend &&
                  "cursor-not-allowed border border-slate-200 bg-slate-200 text-slate-400 opacity-70 shadow-inner",
                !cell.isWeekend &&
                  !cell.isStartMonth &&
                  "bg-slate-50 text-slate-500 ring-1 ring-slate-200",
                !cell.isWeekend &&
                  cell.isMonthBoundary &&
                  !cell.isStartMonth &&
                  "border-l-4 border-slate-300",
                !cell.isWeekend &&
                  !isSelected &&
                  !isModified &&
                  !hasConflict &&
                  !isPreview &&
                  "hover:bg-slate-100",
                !cell.isWeekend &&
                  isSelected &&
                  !isModified &&
                  !hasConflict &&
                  "border border-violet-200 bg-violet-50 text-violet-700",
                !cell.isWeekend &&
                  isModified &&
                  !isSelected &&
                  !hasConflict &&
                  "bg-violet-600 text-white shadow-sm",
                !cell.isWeekend &&
                  isModifiedAndSelected &&
                  !hasConflict &&
                  "border-2 border-violet-950 bg-violet-600 text-white shadow-sm ring-4 ring-violet-100",
                !cell.isWeekend &&
                  hasConflict &&
                  !isConflictAndSelected &&
                  "bg-red-500 text-white shadow-sm ring-2 ring-red-100",
                !cell.isWeekend &&
                  isConflictAndSelected &&
                  "border-2 border-red-950 bg-red-500 text-white shadow-sm ring-4 ring-red-100",
                !cell.isWeekend &&
                  isPreview &&
                  !isModified &&
                  !hasConflict &&
                  "border-2 border-violet-600 bg-violet-50 text-violet-700",
                !cell.isWeekend &&
                  isPreview &&
                  (isModified || hasConflict) &&
                  "ring-4 ring-violet-100",
                !cell.isWeekend &&
                  isActive &&
                  !isPreview &&
                  "outline outline-2 outline-offset-2 outline-violet-300",
              )}
            >
              <span>{cell.dayNumber}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
