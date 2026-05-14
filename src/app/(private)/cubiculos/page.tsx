"use client";

import { useMemo, useState } from "react";
import {
  fetchReservableSpaces,
  reservableSpaces,
} from "@/app/features/cubiculos/data/reservableSpaces";
import type { SpaceSearchFilters } from "@/app/features/cubiculos/types/searchFilters";
import { FloorMapCard } from "@/app/features/cubiculos/components/panels/FloorMapCard";
import { ReservationFilters } from "@/app/features/cubiculos/components/filters/ReservationFilters";
import { ReservationSearchHeader } from "@/app/features/cubiculos/components/others/ReservationSearchHeader";
import { SelectedSpacePanel } from "@/app/features/cubiculos/components/panels/SelectedSpacePanel";
import { SpacesResultsList } from "@/app/features/cubiculos/components/panels/SpacesResultsList";

export default function ReservableSpacesSearchPage() {
  const [search, setSearch] = useState("");
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | undefined>(
    "sm1",
  );

  const [filters, setFilters] = useState<SpaceSearchFilters>({
    search: "",
    time: {
      startTime: "",
      endTime: "",
    },
    capacity: {
      minCapacity: "",
      maxCapacity: "",
    },
    period: {
      dateIds: [],
    },
  });
  const [spaces, setSpaces] = useState(reservableSpaces);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmitFilters(filters: SpaceSearchFilters) {
    setIsLoading(true);

    const result = await fetchReservableSpaces(filters);

    setSpaces(result);
    setIsLoading(false);
  }

  const selectedSpace = useMemo(() => {
    return reservableSpaces.find((space) => space.id === selectedSpaceId);
  }, [selectedSpaceId]);

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
            selectedSpaceId={selectedSpaceId}
            onSelectSpace={setSelectedSpaceId}
          />

          <aside className="flex flex-col gap-4">
            <SelectedSpacePanel selectedSpace={selectedSpace} />

            <SpacesResultsList
              spaces={spaces}
              selectedSpaceId={selectedSpaceId}
              onSelectSpace={setSelectedSpaceId}
            />
          </aside>
        </section>
      </div>
    </main>
  );
}
