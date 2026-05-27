"use client";

import { X } from "lucide-react";

import { MonthCalendar } from "@/app/features/reservaciones/components/Calendar/MonthCalendar";
import { Card } from "@/app/shared/components/Card";
import { cn } from "@/app/features/reservaciones/lib/cn";

import type {
  CalendarCell,
  SelectionMode,
} from "@/app/features/reservaciones/types/reservaciones";

import type { CalendarSelectionAction } from "@/app/features/reservaciones/types/reservaciones";

type ReservationDaysSelectorCardProps = {
  activeDayId: string;
  selectionMode: SelectionMode;
  selectedDateIds: string[];
  conflictDateIds: string[];
  calendarCells: CalendarCell[];
  onModeChange: (mode: SelectionMode) => void;
  onSelect: (action: CalendarSelectionAction) => void;
  onClearSelection: () => void;
};

export function ReservationDaysSelectorCard({
  activeDayId,
  selectionMode,
  selectedDateIds,
  conflictDateIds,
  calendarCells,
  onModeChange,
  onSelect,
  onClearSelection,
}: ReservationDaysSelectorCardProps) {
  return (
    <Card className="p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-950">
        Selecciona los días
      </h2>

      <div className="mb-4 grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm font-semibold text-slate-600">
        <button
          type="button"
          onClick={() => onModeChange("single")}
          className={cn(
            "rounded-lg px-3 py-2 transition",
            selectionMode === "single"
              ? "bg-violet-700 text-white shadow-sm"
              : "hover:bg-white",
          )}
        >
          Un día
        </button>

        <button
          type="button"
          onClick={() => onModeChange("multiple")}
          className={cn(
            "rounded-lg px-3 py-2 transition",
            selectionMode === "multiple"
              ? "bg-violet-700 text-white shadow-sm"
              : "hover:bg-white",
          )}
        >
          Varios días
        </button>

        <button
          type="button"
          onClick={() => onModeChange("repeat")}
          className={cn(
            "rounded-lg px-3 py-2 transition",
            selectionMode === "repeat"
              ? "bg-violet-700 text-white shadow-sm"
              : "hover:bg-white",
          )}
        >
          Repetir
        </button>
      </div>

      <MonthCalendar
        activeDayId={activeDayId}
        selectionMode={selectionMode}
        selectedDateIds={selectedDateIds}
        conflictDateIds={conflictDateIds}
        calendarCells={calendarCells}
        onSelect={onSelect}
      />

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onClearSelection}
          disabled={selectedDateIds.length === 0}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          <X className="h-3.5 w-3.5" />
          Limpiar selección
        </button>
      </div>

      <div className="pt-4 text-sm">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full border border-violet-200 bg-violet-50" />
            Seleccionado
          </span>

          <span className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-violet-600" />
            Con horarios
          </span>

          <span className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-red-500 ring-2 ring-red-100" />
            Empalme
          </span>
        </div>
      </div>
    </Card>
  );
}
