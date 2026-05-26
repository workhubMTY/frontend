import { useMemo } from "react";

import type {
  CalendarCell,
  CalendarSelectionAction,
  SelectionMode,
} from "@/app/features/reservaciones/types/reservaciones";

import { cn } from "@/app/features/reservaciones/lib/cn";
import { useCalendarDragSelection } from "./hooks/useCalendarDragSelection";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarDayButton } from "./CalendarDayButton";

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

const WEEKDAY_LABELS = ["D", "L", "M", "M", "J", "V", "S"];

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
  const selectedDatesSet = useMemo(
    () => new Set(selectedDateIds),
    [selectedDateIds],
  );

  const modifiedDatesSet = useMemo(
    () => new Set(modifiedDateIds),
    [modifiedDateIds],
  );

  const conflictDatesSet = useMemo(
    () => new Set(conflictDateIds),
    [conflictDateIds],
  );

  const {
    dragPreviewDatesSet,
    handlePointerDown,
    handlePointerEnter,
    finishDrag,
  } = useCalendarDragSelection({
    calendarCells,
    selectionMode,
    onSelect,
  });

  const firstWeekdayOffset = calendarCells[0]?.date.getDay() ?? 0;

  return (
    <div onPointerUp={finishDrag} onPointerLeave={finishDrag}>
      <CalendarHeader calendarCells={calendarCells} />

      <div
        className={cn(
          "grid select-none grid-cols-7 text-center text-xs",
          variant === "compact" ? "gap-y-2" : "gap-y-3",
        )}
      >
        <WeekdayLabels />

        <CalendarPlaceholders count={firstWeekdayOffset} />

        {calendarCells.map((cell) => (
          <CalendarDayButton
            key={cell.id}
            cell={cell}
            variant={variant}
            isActive={activeDayId === cell.id}
            isSelected={selectedDatesSet.has(cell.id)}
            isModified={modifiedDatesSet.has(cell.id)}
            hasConflict={conflictDatesSet.has(cell.id)}
            isPreview={dragPreviewDatesSet.has(cell.id)}
            onPointerDown={handlePointerDown}
            onPointerEnter={handlePointerEnter}
          />
        ))}
      </div>
    </div>
  );
}

function WeekdayLabels() {
  return (
    <>
      {WEEKDAY_LABELS.map((dayLabel, index) => (
        <div
          key={`${dayLabel}-${index}`}
          className="pb-1 text-xs font-semibold text-slate-500"
        >
          {dayLabel}
        </div>
      ))}
    </>
  );
}

type CalendarPlaceholdersProps = {
  count: number;
};

function CalendarPlaceholders({ count }: CalendarPlaceholdersProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`calendar-placeholder-${index}`} aria-hidden="true" />
      ))}
    </>
  );
}
