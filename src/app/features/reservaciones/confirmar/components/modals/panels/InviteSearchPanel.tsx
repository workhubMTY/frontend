"use client";

import type { RefObject } from "react";
import { Search, Users } from "lucide-react";

import type { PersonOption, WorkGroupOption } from "../../../types/confirmation";
import { Avatar } from "../../Avatar";

type InviteSearchPanelProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  searchTerm: string;
  isDropdownOpen: boolean;
  people: PersonOption[];
  workGroups: WorkGroupOption[];
  onSearchTermChange: (value: string) => void;
  onOpenDropdown: () => void;
  onPersonSelect: (person: PersonOption) => void;
  onWorkGroupSelect: (workGroup: WorkGroupOption) => void;
};

export function InviteSearchPanel({
  containerRef,
  searchTerm,
  isDropdownOpen,
  people,
  workGroups,
  onSearchTermChange,
  onOpenDropdown,
  onPersonSelect,
  onWorkGroupSelect,
}: InviteSearchPanelProps) {
  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </span>

        <input
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          onFocus={onOpenDropdown}
          placeholder="Buscar nombre, correo o equipo"
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="max-h-[420px] overflow-y-auto py-3">
            <SearchSectionTitle>Personas</SearchSectionTitle>

            {people.map((person) => (
              <PersonOptionButton
                key={person.id}
                person={person}
                onSelect={onPersonSelect}
              />
            ))}

            {people.length === 0 && (
              <EmptySearchMessage>
                No encontramos personas con esa búsqueda.
              </EmptySearchMessage>
            )}

            <div className="mt-2 border-t border-slate-100 pt-4">
              <SearchSectionTitle>Equipos</SearchSectionTitle>
            </div>

            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {workGroups.map((workGroup) => (
                <WorkGroupOptionButton
                  key={workGroup.id}
                  workGroup={workGroup}
                  onSelect={onWorkGroupSelect}
                />
              ))}
            </div>

            {workGroups.length === 0 && (
              <EmptySearchMessage>
                No encontramos equipos con esa búsqueda.
              </EmptySearchMessage>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pb-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {children}
      </p>
    </div>
  );
}

function PersonOptionButton({
  person,
  onSelect,
}: {
  person: PersonOption;
  onSelect: (person: PersonOption) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(person)}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-50"
    >
      <Avatar name={person.name} kind={person.kind} size="sm" />

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">
          {person.name}
        </p>

        <p className="truncate text-xs text-slate-500">{person.email}</p>
      </div>
    </button>
  );
}

function WorkGroupOptionButton({
  workGroup,
  onSelect,
}: {
  workGroup: WorkGroupOption;
  onSelect: (workGroup: WorkGroupOption) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(workGroup)}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition hover:opacity-80 ${workGroup.colorClassName}`}
    >
      <Users size={14} />
      {workGroup.name}

      <span className="text-xs opacity-70">({workGroup.memberCount})</span>
    </button>
  );
}

function EmptySearchMessage({ children }: { children: React.ReactNode }) {
  return <p className="px-4 py-4 text-sm text-slate-400">{children}</p>;
}