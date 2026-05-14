"use client";

import { UsersRound } from "lucide-react";

import { FilterFlyout } from "./FilterFlyout";
import { useCapacityFilter } from "../../hooks/useCapacityFilter";
import { getCapacityButtonLabel } from "../../lib/filterLabels";

export function CapacityFilter() {
  const capacityFilter = useCapacityFilter();

  return (
    <div ref={capacityFilter.capacityFilterRef} className="relative">
      <FilterFlyout
        icon={<UsersRound className="h-5 w-5 shrink-0 text-neutral-700" />}
        label={getCapacityButtonLabel(
          capacityFilter.appliedMinCapacity,
          capacityFilter.appliedMaxCapacity,
        )}
        isOpen={capacityFilter.isOpen}
        isActive={capacityFilter.hasActiveCapacityFilter}
        onToggle={capacityFilter.openCapacityFilter}
      >
        <div className="w-[430px]">
          <div className="mb-3">
            <p className="text-sm font-semibold text-neutral-900">
              Selecciona capacidad
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Puedes indicar capacidad mínima, máxima o un rango.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-neutral-800">
                Capacidad mínima
              </span>

              <input
                value={capacityFilter.draftMinCapacity}
                onChange={(event) => {
                  capacityFilter.setDraftMinCapacity(event.target.value);
                  capacityFilter.setMinCapacityError(false);
                }}
                onBlur={capacityFilter.handleMinCapacityBlur}
                inputMode="numeric"
                placeholder="Ej. 4"
                className={`h-12 border bg-white px-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-purple-100 ${
                  capacityFilter.minCapacityError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-300 hover:border-primary-2 focus:border-primary-2"
                }`}
              />

              {capacityFilter.minCapacityError && (
                <span className="text-xs font-medium text-red-600">
                  Usa un número válido y menor o igual a la capacidad máxima.
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-neutral-800">
                Capacidad máxima
              </span>

              <input
                value={capacityFilter.draftMaxCapacity}
                onChange={(event) => {
                  capacityFilter.setDraftMaxCapacity(event.target.value);
                  capacityFilter.setMaxCapacityError(false);
                }}
                onBlur={capacityFilter.handleMaxCapacityBlur}
                inputMode="numeric"
                placeholder="Ej. 12"
                className={`h-12 border bg-white px-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-purple-100 ${
                  capacityFilter.maxCapacityError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-300 hover:border-primary-2 focus:border-primary-2"
                }`}
              />

              {capacityFilter.maxCapacityError && (
                <span className="text-xs font-medium text-red-600">
                  Usa un número válido y mayor o igual a la capacidad mínima.
                </span>
              )}
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={capacityFilter.handleCancelCapacityFilter}
              className="h-10 border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={capacityFilter.handleApplyCapacityFilter}
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
