"use client";

import { FloorMapCard } from "@/app/features/cubiculos/components/panels/FloorMapCard";
import { ReservationFilters } from "@/app/features/cubiculos/components/filters/ReservationFilters";
import { SelectedSpacePanel } from "@/app/features/cubiculos/components/panels/SelectedSpacePanel";
import { SpacesResultsList } from "@/app/features/cubiculos/components/panels/SpacesResultsList";

import { useReservableSpacesSearchViewModel } from "@/app/features/cubiculos/hooks/useReservableSpacesSearchViewModel";

export default function ReservableSpacesSearchPage() {
  const { state, actions } = useReservableSpacesSearchViewModel();

  return (
    <main className="min-h-screen bg-background-page px-4 py-6 text-neutral-700 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col gap-5">
        <ReservationFilters
          value={state.filters}
          onChange={actions.setFilters}
          onSubmit={actions.submitFilters}
        />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <FloorMapCard
            spaces={state.spaces}
            isLoading={state.isLoading}
            selectedMapId={state.selectedMapId}
            availableMapIds={state.availableMapIds}
            reservedMapIds={state.reservedMapIds}
            disabledMapIds={state.disabledMapIds}
            onSelectMapId={actions.selectMapId}
          />

          <aside className="flex flex-col gap-4">
            <SelectedSpacePanel
              selectedSpace={state.selectedSpace}
              selectedSpaceReservations={state.selectedSpaceReservations}
              isLoading={state.isLoadingSelectedSpaceReservations}
              onContinue={actions.continueToReservation}
            />

            <SpacesResultsList
              spaces={state.spaces}
              selectedSpaceCode={state.selectedSpaceCode}
              onSelectSpace={actions.setSelectedSpaceCode}
            />
          </aside>
        </section>
      </div>
    </main>
  );
}