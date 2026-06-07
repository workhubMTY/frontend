"use client";

import { X } from "lucide-react";

import { Card } from "@/app/shared/components/Card";
import { MonthCalendar } from "@/app/features/reservaciones/crear/components/Calendar/MonthCalendar";
import { SelectionModeSegmentedControl } from "@/app/features/reservaciones/crear/components/Calendar/DaysSelection/SelectionModeSegmentedControl";

import { cn } from "@/app/shared/lib/cn";

import type {
  CalendarCell,
  CalendarSelectionAction,
  SelectionMode,
} from "@/app/features/reservaciones/crear/types/reservaciones";

type SelectionModeCalendarCardProps = {
  calendarCells: CalendarCell[];
  activeDayId: string;
  selectionMode: SelectionMode;
  selectedDateIds: string[];
  conflictDateIds: string[];
  onModeChange: (mode: SelectionMode) => void;
  onSelect: (action: CalendarSelectionAction) => void;
  onActivateDay: (dayId: string) => void;
  onClearSelection: () => void;
};
export function SelectionModeCalendarCard({
  calendarCells,
  activeDayId,
  selectionMode,
  selectedDateIds,
  conflictDateIds,
  onModeChange,
  onActivateDay,
  onSelect,
  onClearSelection,
}: SelectionModeCalendarCardProps) {
  const hasSelectedDates = selectedDateIds.length > 0;

  return (
    <Card className="p-4 flex flex-col font-bold">
      <SelectionModeSegmentedControl
        value={selectionMode}
        onChange={onModeChange}
      />

      <div className="mt-4">
        <MonthCalendar
          activeDayId={activeDayId}
          selectionMode={selectionMode}
          selectedDateIds={selectedDateIds}
          conflictDateIds={conflictDateIds}
          calendarCells={calendarCells}
          onSelect={onSelect}
          onActivateDay={onActivateDay}
        />

        <CalendarActions
          disabled={!hasSelectedDates}
          onClearSelection={onClearSelection}
        />
      </div>
    </Card>
  );
}

type CalendarActionsProps = {
  disabled: boolean;
  onClearSelection: () => void;
};

function CalendarActions({ disabled, onClearSelection }: CalendarActionsProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onClearSelection}
        disabled={disabled}
        className="flex flex-1 items-center justify-center gap-1 border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300"
      >
        <X className="h-3.5 w-3.5" />
        Limpiar selección
      </button>
    </div>
  );
}

type CalendarLegendItemProps = {
  label: string;
  className: string;
};
