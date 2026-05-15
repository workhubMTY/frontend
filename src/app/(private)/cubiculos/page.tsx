"use client";

import { FloorMapCard } from "@/app/features/cubiculos/components/panels/FloorMapCard";
import { ReservationFilters } from "@/app/features/cubiculos/components/filters/ReservationFilters";
import { ReservationSearchHeader } from "@/app/features/cubiculos/components/others/ReservationSearchHeader";
import { SelectedSpacePanel } from "@/app/features/cubiculos/components/panels/SelectedSpacePanel";
import { SpacesResultsList } from "@/app/features/cubiculos/components/panels/SpacesResultsList";
import { useReservableSpacesSearch } from "@/app/features/cubiculos/hooks/useReservableSpacesSearch";

export default function ReservableSpacesSearchPage() {
  const {
    filters,
    setFilters,
    spaces,
    isLoading,
    selectedSpace,
    selectedSpaceCode,
    selectedMapId,
    availableMapIds,
    reservedMapIds,
    disabledMapIds,
    setSelectedSpaceCode,
    handleSelectMapId,
    handleSubmitFilters,
  } = useReservableSpacesSearch();

  return (
    <main className="min-h-screen bg-background-page px-4 py-6 text-neutral-700 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col gap-5">
        <ReservationSearchHeader />

        <ReservationFilters
          value={filters}
          onChange={setFilters}
          onSubmit={handleSubmitFilters}
        />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <FloorMapCard
            spaces={spaces}
            isLoading={isLoading}
            selectedMapId={selectedMapId}
            availableMapIds={availableMapIds}
            reservedMapIds={reservedMapIds}
            disabledMapIds={disabledMapIds}
            onSelectMapId={handleSelectMapId}
          />

          <aside className="flex flex-col gap-4">
            <SelectedSpacePanel selectedSpace={selectedSpace} />

            <SpacesResultsList
              spaces={spaces}
              selectedSpaceCode={selectedSpaceCode}
              onSelectSpace={setSelectedSpaceCode}
            />
          </aside>
        </section>
      </div>
    </main>
  );
}
