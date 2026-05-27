"use client";

import { X } from "lucide-react";

import { Card } from "@/app/shared/components/Card";
import { MonthCalendar } from "@/app/features/reservaciones/components/Calendar/MonthCalendar";
import { SelectionModeSegmentedControl } from "@/app/features/reservaciones/components/Calendar/DaysSelection/SelectionModeSegmentedControl";

import { cn } from "@/app/features/reservaciones/lib/cn";

import type {
  CalendarCell,
  CalendarSelectionAction,
  SelectionMode,
} from "@/app/features/reservaciones/types/reservaciones";

type SelectionModeCalendarCardProps = {
  calendarCells: CalendarCell[];
  activeDayId: string;
  selectionMode: SelectionMode;
  selectedDateIds: string[];
  conflictDateIds: string[];
  onModeChange: (mode: SelectionMode) => void;
  onSelect: (action: CalendarSelectionAction) => void;
  onClearSelection: () => void;
};
export function SelectionModeCalendarCard({
  calendarCells,
  activeDayId,
  selectionMode,
  selectedDateIds,
  conflictDateIds,
  onModeChange,
  onSelect,
  onClearSelection,
}: SelectionModeCalendarCardProps) {
  const hasSelectedDates = selectedDateIds.length > 0;

  return (
    <Card className="p-5">
      <SelectionModeSegmentedControl
        value={selectionMode}
        onChange={onModeChange}
      />

      <div className="mt-4 p-4">
        <MonthCalendar
          activeDayId={activeDayId}
          selectionMode={selectionMode}
          selectedDateIds={selectedDateIds}
          conflictDateIds={conflictDateIds}
          calendarCells={calendarCells}
          onSelect={onSelect}
        />

        <CalendarActions
          disabled={!hasSelectedDates}
          onClearSelection={onClearSelection}
        />

        <CalendarLegend />
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

function CalendarLegend() {
  return (
    <div className="border-slate-200 pt-4 text-sm">
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <CalendarLegendItem
          className="border border-violet-200 bg-violet-50"
          label="Seleccionado"
        />

        <CalendarLegendItem className="bg-violet-600" label="Con horarios" />

        <CalendarLegendItem
          className="bg-red-500 ring-2 ring-red-100"
          label="Empalme"
        />
      </div>
    </div>
  );
}

type CalendarLegendItemProps = {
  label: string;
  className: string;
};

function CalendarLegendItem({ label, className }: CalendarLegendItemProps) {
  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-5 w-5 rounded-full", className)} />
      {label}
    </span>
  );
}
