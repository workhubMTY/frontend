"use client";

import { FloorMapCard } from "@/app/features/oficinas/components/panels/FloorMapCard"
import { useReservableSpacesSearch } from "@/app/features/cubiculos/hooks/useReservableSpacesSearch";
import { ReservationFilters } from "@/app/features/cubiculos/components/filters/ReservationFilters";

export default function Oficinas() {
    const {
        filters,
        setFilters,
        spaces,
        isLoading,
        selectedMapId,
        availableMapIds,
        reservedMapIds,
        disabledMapIds,
        handleSelectMapId,
        handleSubmitFilters
    } = useReservableSpacesSearch();

    return (
        <main className="min-h-screen bg-background-page px-4 py-6 text-neutral-700 sm:px-6 lg:px-12">
            <div className="mx-auto flex flex-col gap-5">
                <ReservationFilters
                    value={filters}
                    onChange={setFilters}
                    onSubmit={handleSubmitFilters}
                />
        
                <FloorMapCard
                    spaces={spaces}
                    isLoading={isLoading}
                    selectedMapId={selectedMapId}
                    availableMapIds={availableMapIds}
                    reservedMapIds={reservedMapIds}
                    disabledMapIds={disabledMapIds}
                    onSelectMapId={handleSelectMapId}
                />
                </div>
        </main>
    );
}