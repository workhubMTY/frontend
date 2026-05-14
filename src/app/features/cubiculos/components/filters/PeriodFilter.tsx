"use client";

import { CalendarDays } from "lucide-react";

import { MonthCalendar } from "@/app/features/reservaciones/components/Calendar/MonthCalendar";
import { cn } from "@/app/features/reservaciones/lib/cn";

import { FilterFlyout } from "./FilterFlyout";
import { usePeriodFilter } from "../../hooks/usePeriodFilter";
import { getPeriodButtonLabel } from "../../lib/filterLabels";

export function PeriodFilter() {
  const periodFilter = usePeriodFilter();

  return (
    <div ref={periodFilter.periodFilterRef} className="relative">
      <FilterFlyout
        align="right"
        icon={<CalendarDays className="h-5 w-5 shrink-0 text-neutral-700" />}
        label={getPeriodButtonLabel(
          periodFilter.appliedPeriodDateIds,
          periodFilter.periodCalendarCells,
        )}
        isOpen={periodFilter.isOpen}
        isActive={periodFilter.hasActivePeriodFilter}
        onToggle={periodFilter.openPeriodFilter}
      >
        <div className="w-[420px]">
          <div className="mb-4">
            <p className="text-sm font-semibold text-neutral-900">
              Selecciona periodo
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Elige un día, varios días o una repetición semanal.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-3 border border-neutral-200 bg-neutral-50 p-1">
            <button
              type="button"
              onClick={() => periodFilter.handlePeriodModeChange("single")}
              className={cn(
                "h-10 text-sm font-medium transition",
                periodFilter.periodSelectionMode === "single"
                  ? "bg-primary-2 text-on-primary shadow-sm"
                  : "text-neutral-700 hover:bg-white",
              )}
            >
              Un día
            </button>

            <button
              type="button"
              onClick={() => periodFilter.handlePeriodModeChange("multiple")}
              className={cn(
                "h-10 text-sm font-medium transition",
                periodFilter.periodSelectionMode === "multiple"
                  ? "bg-primary-2 text-on-primary shadow-sm"
                  : "text-neutral-700 hover:bg-white",
              )}
            >
              Varios días
            </button>

            <button
              type="button"
              onClick={() => periodFilter.handlePeriodModeChange("repeat")}
              className={cn(
                "h-10 text-sm font-medium transition",
                periodFilter.periodSelectionMode === "repeat"
                  ? "bg-primary-2 text-on-primary shadow-sm"
                  : "text-neutral-700 hover:bg-white",
              )}
            >
              Repetir
            </button>
          </div>

          <MonthCalendar
            variant="compact"
            activeDayId={periodFilter.periodActiveDayId}
            selectionMode={periodFilter.periodSelectionMode}
            selectedDateIds={periodFilter.draftPeriodDateIds}
            modifiedDateIds={[]}
            conflictDateIds={[]}
            calendarCells={periodFilter.periodCalendarCells}
            onSelect={periodFilter.handlePeriodCalendarSelect}
          />

          <button
            type="button"
            onClick={periodFilter.handleClearDraftPeriod}
            disabled={periodFilter.draftPeriodDateIds.length === 0}
            className="mt-4 flex h-10 w-full items-center justify-center border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300"
          >
            Limpiar selección
          </button>

          <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={periodFilter.handleCancelPeriodFilter}
              className="h-10 border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={periodFilter.handleApplyPeriodFilter}
              className="h-10 border border-primary-2 bg-primary-2 px-4 text-sm font-medium text-on-primary transition hover:opacity-90"
            >
              Aplicar
            </button>
          </div>
        </div>
      </FilterFlyout>
    </div>
  );
}
