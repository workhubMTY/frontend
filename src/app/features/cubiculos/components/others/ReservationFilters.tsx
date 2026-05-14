"use client";

import { SearchInputFilter } from "../filters/SearchInputFilter";
import { TimeFilter } from "../filters/TimeFilter";
import { CapacityFilter } from "../filters/CapacityFilter";
import { PeriodFilter } from "../filters/PeriodFilter";

type ReservationFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function ReservationFilters({
  search,
  onSearchChange,
}: ReservationFiltersProps) {
  return (
    <section className="w-full border border-neutral-300 bg-white p-3 shadow-sm">
      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1.7fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(180px,1fr)_180px]">
        <SearchInputFilter search={search} onSearchChange={onSearchChange} />

        <TimeFilter />

        <CapacityFilter />

        <PeriodFilter />

        <button
          type="button"
          className="h-12 border border-primary-2 px-5 text-sm font-medium text-primary-2 transition hover:bg-primary-2 hover:text-on-primary focus:bg-primary-2 focus:text-on-primary"
        >
          Buscar espacios
        </button>
      </div>
    </section>
  );
}
