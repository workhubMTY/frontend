"use client";

import { Clock3 } from "lucide-react";
import { useTimeFilter } from "../../hooks/useTimeFilter";
import { getTimeButtonLabel } from "../../lib/filterLabels";
import type { TimeFilterValue } from "../../types/searchFilters";
import { FilterFlyout } from "./FilterFlyout";

type TimeFilterProps = {
  value: TimeFilterValue;
  onChange: (value: TimeFilterValue) => void;
};

export function TimeFilter({ value, onChange }: TimeFilterProps) {
  const timeFilter = useTimeFilter({
    value,
    onChange,
  });

  return (
    <div ref={timeFilter.timeFilterRef} className="relative">
      <FilterFlyout
        icon={<Clock3 className="h-5 w-5 shrink-0 text-neutral-700" />}
        label={getTimeButtonLabel(value.startTime, value.endTime)}
        isOpen={timeFilter.isOpen}
        isActive={timeFilter.hasActiveTimeFilter}
        onToggle={timeFilter.openTimeFilter}
      >
        <div className="w-[430px]">
          <div className="mb-3">
            <p className="text-sm font-semibold text-neutral-900">
              Selecciona un horario
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Puedes escribir solo inicio, solo fin o ambos. Ejemplo: 3pm,
              8:30am, 15:00.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-neutral-800">
                Hora de inicio
              </span>

              <input
                value={timeFilter.draftStartTime}
                onChange={(event) => {
                  timeFilter.setDraftStartTime(event.target.value);
                  timeFilter.setStartTimeError(false);
                }}
                onBlur={timeFilter.handleStartTimeBlur}
                placeholder="Ej. 3pm"
                className={`h-12 border bg-white px-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-purple-100 ${
                  timeFilter.startTimeError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-300 hover:border-primary-2 focus:border-primary-2"
                }`}
              />

              {timeFilter.startTimeError && (
                <span className="text-xs font-medium text-red-600">
                  Usa un formato válido y asegúrate de que sea menor a la hora
                  de fin.
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-neutral-800">
                Hora de fin
              </span>

              <input
                value={timeFilter.draftEndTime}
                onChange={(event) => {
                  timeFilter.setDraftEndTime(event.target.value);
                  timeFilter.setEndTimeError(false);
                }}
                onBlur={timeFilter.handleEndTimeBlur}
                placeholder="Ej. 5pm"
                className={`h-12 border bg-white px-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-purple-100 ${
                  timeFilter.endTimeError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-300 hover:border-primary-2 focus:border-primary-2"
                }`}
              />

              {timeFilter.endTimeError && (
                <span className="text-xs font-medium text-red-600">
                  Usa un formato válido y asegúrate de que sea mayor a la hora
                  de inicio.
                </span>
              )}
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={timeFilter.handleCancelTimeFilter}
              className="h-10 border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={timeFilter.handleApplyTimeFilter}
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
