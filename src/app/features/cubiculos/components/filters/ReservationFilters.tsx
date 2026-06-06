"use client";

import { SearchInputFilter } from "./SearchInputFilter";
import { TimeFilter } from "./TimeFilter";
import { CapacityFilter } from "./CapacityFilter";
import { PeriodFilter } from "./PeriodFilter";
import type { SpaceSearchFilters } from "../../types/searchFilters";

type ReservationFiltersProps = {
  value: SpaceSearchFilters;
  onChange: (value: SpaceSearchFilters) => void;
  onSubmit: (value: SpaceSearchFilters) => void;
};
export function ReservationFilters({
  value,
  onChange,
  onSubmit,
}: ReservationFiltersProps) {
  return (
    <section className="w-full border border-grid-lines bg-white p-3 ">
      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1.7fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(180px,1fr)_180px]">
        <SearchInputFilter
          search={value.search}
          onSearchChange={(search) =>
            onChange({
              ...value,
              search,
            })
          }
        />
        <PeriodFilter
          value={value["daysToApply"]}
          onChange={(period) =>
            onChange({
              ...value,
              daysToApply: period,
            })
          }
        />
        <TimeFilter
          value={value.time}
          onChange={(time) =>
            onChange({
              ...value,
              time,
            })
          }
        />

        <CapacityFilter
          value={value.capacity}
          onChange={(capacity) =>
            onChange({
              ...value,
              capacity,
            })
          }
        />

        <button
          type="button"
          onClick={() => onSubmit(value)}
          className="h-10 border border-primary-2 px-5 text-xs font-medium text-primary-2 transition hover:bg-primary-2 hover:text-on-primary focus:bg-primary-2 focus:text-on-primary"
        >
          Buscar espacios
        </button>
      </div>
    </section>
  );
}
