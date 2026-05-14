"use client";

import { useMemo, useState } from "react";
import { reservableSpaces } from "@/app/features/cubiculos/data/reservableSpaces";
import { FloorMapCard } from "@/app/features/cubiculos/components/panels/FloorMapCard";
import { ReservationFilters } from "@/app/features/cubiculos/components/others/ReservationFilters";
import { ReservationSearchHeader } from "@/app/features/cubiculos/components/others/ReservationSearchHeader";
import { SelectedSpacePanel } from "@/app/features/cubiculos/components/panels/SelectedSpacePanel";
import { SpacesResultsList } from "@/app/features/cubiculos/components/panels/SpacesResultsList";

export default function ReservableSpacesSearchPage() {
  const [search, setSearch] = useState("");
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | undefined>(
    "sm1",
  );

  const filteredSpaces = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return reservableSpaces;
    }

    return reservableSpaces.filter((space) => {
      return (
        space.code.toLowerCase().includes(normalizedSearch) ||
        space.name.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [search]);

  const selectedSpace = useMemo(() => {
    return reservableSpaces.find((space) => space.id === selectedSpaceId);
  }, [selectedSpaceId]);

  return (
    <main className="min-h-screen bg-background-page px-4 py-6 text-neutral-700 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col gap-5">
        <ReservationSearchHeader />

        <ReservationFilters search={search} onSearchChange={setSearch} />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <FloorMapCard
            spaces={filteredSpaces}
            selectedSpaceId={selectedSpaceId}
            onSelectSpace={setSelectedSpaceId}
          />

          <aside className="flex flex-col gap-4">
            <SelectedSpacePanel selectedSpace={selectedSpace} />

            <SpacesResultsList
              spaces={filteredSpaces}
              selectedSpaceId={selectedSpaceId}
              onSelectSpace={setSelectedSpaceId}
            />
          </aside>
        </section>
      </div>
    </main>
  );
}
