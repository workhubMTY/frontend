"use client";

import type { HomeAgendaOwner } from "@/app/features/home/types/homeAgenda";

import { HomeAgendaPersonItem } from "./HomeAgendaPersonItem";
import { PeopleCardEmptyState } from "./PeopleCardEmptyState";

type HomeAgendaPeopleCardProps = {
  owners: HomeAgendaOwner[];
  selectedOwnerId: string | null;
  isLoading?: boolean;
  onSelectOwner: (ownerId: string) => void;
};

export function HomeAgendaPeopleCard({
  owners,
  selectedOwnerId,
  isLoading = false,
  onSelectOwner,
}: HomeAgendaPeopleCardProps) {
  const hasOwners = owners.length > 0;

  return (
    <aside className="flex min-h-0 flex-col border border-grid-lines bg-container">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-md font-semibold text-slate-900">Red personal</h2>

        <p className="mt-1 text-xs text-slate-500">
          Selecciona tu agenda o la de un amigo.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-1 p-3">
        {isLoading ? (
          <PeopleCardEmptyState>Cargando amigos...</PeopleCardEmptyState>
        ) : !hasOwners ? (
          <PeopleCardEmptyState>
            No hay agendas disponibles.
          </PeopleCardEmptyState>
        ) : (
          owners.map((owner) => (
            <HomeAgendaPersonItem
              key={`${owner.kind}-${owner.eId}`}
              owner={owner}
              isSelected={selectedOwnerId === owner.eId}
              onSelect={onSelectOwner}
            />
          ))
        )}
      </div>
    </aside>
  );
}