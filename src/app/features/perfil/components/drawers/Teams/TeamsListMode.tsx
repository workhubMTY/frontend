import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import { TeamMembersState, TeamSummary } from "./types";
import { getInitials } from "../../../lib/formatting";
import { Avatar } from "./TeamsDrawer";

type TeamsListModeProps = {
  search: string;
  teams: TeamSummary[];
  openTeamId: string | null;
  membersByTeamId: Record<string, TeamMembersState>;
  onSearchChange: (value: string) => void;
  onClose: () => void;
  onToggleTeam: (teamId: string) => void;
  onCreateMode: () => void;
};

export function TeamsListMode({
  search,
  teams,
  openTeamId,
  membersByTeamId,
  onSearchChange,
  onClose,
  onToggleTeam,
  onCreateMode,
}: TeamsListModeProps) {
  return (
    <>
      <header className="border-b border-neutral-100 px-8 py-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
              Todos los equipos
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Consulta tus equipos y abre solo el que quieras revisar.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Cerrar drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative mt-6">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar equipo"
            className="h-11 w-full border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {teams.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {teams.map((team) => {
              const isOpen = openTeamId === team.id;
              const membersState = membersByTeamId[team.id];

              return (
                <article key={team.id} className="px-8 py-6">
                  <button
                    type="button"
                    onClick={() => onToggleTeam(team.id)}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 text-left"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700">
                      {getInitials(team.name)}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-neutral-950">
                        {team.name}
                      </h3>

                      <p className="mt-1 text-sm text-neutral-500">
                        {team.membersCount} miembros
                        {team.userRole ? ` · ${team.userRole}` : ""}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center text-neutral-500">
                      {isOpen ? (
                        <ChevronUp size={19} />
                      ) : (
                        <ChevronDown size={19} />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-5 border border-neutral-200 bg-white">
                      <div className="grid grid-cols-[1fr_auto] border-b border-neutral-100 px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                        <span>Miembros</span>
                        <span>Miembro desde</span>
                      </div>

                      {membersState?.loading && (
                        <div className="flex items-center gap-3 px-5 py-6 text-sm text-neutral-500">
                          <Loader2 size={17} className="animate-spin" />
                          Cargando miembros...
                        </div>
                      )}

                      {membersState?.error && (
                        <div className="px-5 py-6 text-sm text-red-600">
                          {membersState.error}
                        </div>
                      )}

                      {!membersState?.loading &&
                        !membersState?.error &&
                        membersState?.members.length === 0 && (
                          <div className="px-5 py-6 text-sm text-neutral-500">
                            Este equipo todavía no tiene miembros registrados.
                          </div>
                        )}

                      {!membersState?.loading &&
                        !membersState?.error &&
                        membersState?.members.length > 0 && (
                          <div className="max-h-[280px] overflow-y-auto">
                            {membersState.members.map((member) => (
                              <div
                                key={member.eId}
                                className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-100 px-5 py-4 last:border-b-0"
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  <Avatar
                                    name={member.name}
                                    src={member.avatarUrl}
                                  />

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-neutral-950">
                                      {member.name}
                                    </p>
                                    <p className="truncate text-xs text-neutral-500">
                                      {member.role}
                                    </p>
                                  </div>
                                </div>

                                {"joinedAt" in member && (
                                  <p className="whitespace-nowrap text-sm text-neutral-500">
                                    {String(member.joinedAt ?? "—")}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center bg-purple-50 text-purple-700">
              <UsersRound size={25} />
            </div>

            <h3 className="text-lg font-semibold text-neutral-950">
              No se encontraron equipos
            </h3>

            <p className="mt-2 max-w-sm text-sm text-neutral-500">
              Intenta buscar con otro nombre.
            </p>
          </div>
        )}
      </div>

      <footer className="border-t border-neutral-100 px-8 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <UsersRound size={21} className="text-purple-700" />

            <div>
              <p className="text-sm font-semibold text-neutral-950">
                Crear o unirse a un equipo
              </p>
              <p className="text-sm text-neutral-500">
                Busca equipos disponibles o crea uno nuevo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCreateMode}
            className="inline-flex h-10 items-center justify-center bg-purple-700 px-5 text-sm font-medium text-white transition hover:bg-purple-800"
          >
            Crear / Unirse
          </button>
        </div>
      </footer>
    </>
  );
}
