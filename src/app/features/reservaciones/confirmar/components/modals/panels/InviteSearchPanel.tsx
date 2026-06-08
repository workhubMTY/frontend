"use client";

import { Search, UserPlus, UsersRound } from "lucide-react";

import { cn } from "@/app/shared/lib/cn";

import type {

} from "@/app/features/reservaciones/confirmar/types/confirmation";
import { Team, User } from "@/app/features/perfil/types/profile";

type InviteSearchPanelProps = {
  searchTerm: string;
  people: User[];
  teams: Team[];
  onSearchTermChange: (value: string) => void;
  onPersonSelect: (person: User) => void;
  onTeamSelect: (workGroup: Team) => void;
};

function getInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function InviteSearchPanel({
  searchTerm,
  people,
  teams,
  onSearchTermChange,
  onPersonSelect,
  onTeamSelect,
}: InviteSearchPanelProps) {
  const hasSearchTerm = searchTerm.trim().length > 0;
  const hasPeople = people.length > 0;
  const hasWorkGroups = teams.length > 0;
  const hasResults = hasPeople || hasWorkGroups;

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 px-4">
      <div className="shrink-0 border-b border-slate-100 ">
        <div className="flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <Search className="size-4 shrink-0 text-slate-400" />
          <input
            id="invite-search"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Busca por nombre, correo o equipo"
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="min-h-[320px] flex-1 overflow-y-auto ">
        {!hasSearchTerm ? (
          <EmptySearchState />
        ) : !hasResults ? (
          <NoResultsState />
        ) : (
          <div className="space-y-5">
            {hasPeople && (
              <ResultSection title="Personas" count={people.length}>
                <PeopleResults
                  people={people}
                  onPersonSelect={onPersonSelect}
                />
              </ResultSection>
            )}

            {hasWorkGroups && (
              <ResultSection title="Equipos" count={teams.length}>
                <WorkGroupResults
                  teams={teams}
                  onTeamSelect={onTeamSelect}
                />
              </ResultSection>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ResultSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between px-1">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </h4>

        <span className="text-xs text-slate-400">{count}</span>
      </div>

      {children}
    </section>
  );
}

function EmptySearchState() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-white shadow-sm">
        <Search className="size-5 text-slate-400" />
      </div>

      <h4 className="mt-3 text-sm font-semibold text-slate-900">
        Busca a quién quieres invitar
      </h4>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Escribe un nombre, correo o equipo para agregarlo a la reservación.
      </p>
    </div>
  );
}

function NoResultsState() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-white shadow-sm">
        <UserPlus className="size-5 text-slate-400" />
      </div>

      <h4 className="mt-3 text-sm font-semibold text-slate-900">
        No encontramos resultados
      </h4>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Intenta buscar por otro nombre, correo o equipo.
      </p>
    </div>
  );
}

function PeopleResults({
  people,
  onPersonSelect,
}: {
  people: User[];
  onPersonSelect: (person: User) => void;
}) {
  return (
    <div className="space-y-1">
      {people.map((person) => (
        <button
          key={person.eId}
          type="button"
          onClick={() => onPersonSelect(person)}
          className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition hover:border-blue-100 hover:bg-blue-50"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            {getInitials(person.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-950">
                {person.name}
              </p>

            </div>

            <p className="truncate text-xs text-slate-500">{person.email}</p>
          </div>

          <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700">
            Agregar
          </span>
        </button>
      ))}
    </div>
  );
}

function WorkGroupResults({
  teams,
  onTeamSelect,
}: {
  teams: Team[];
  onTeamSelect: (team: Team) => void;
}) {
  return (
    <div className="space-y-1">
      {teams.map((team) => (
        <button
          key={team.id}
          type="button"
          onClick={() => onTeamSelect(team)}
          className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition hover:border-violet-100 hover:bg-violet-50"
        >
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              "bg-violet-100 text-violet-700",
            )}
          >
            <UsersRound className="size-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-950">
              {team.name}
            </p>

            <p className="truncate text-xs text-slate-500">
              {team.memberCount}{" "}
              {team.memberCount === 1 ? "integrante" : "integrantes"}
            </p>
          </div>

          <span className="rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-semibold text-violet-700">
            Agregar
          </span>
        </button>
      ))}
    </div>
  );
}
