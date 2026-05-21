import { ChevronRight, UsersRound } from "lucide-react";
import type { Team } from "../../types/profile";
import { getInitials } from "../../lib/formatting";

type TeamsCardProps = {
  teams: Team[];
  isLoading?: boolean;
  error?: Error | null;
  onDisplayAll: () => void;
  onCreateTeamShortcut: () => void;
  onDisplayMembers: (teamId: string) => void;
};

export function TeamsCard({
  teams,
  isLoading = false,
  error = null,
  onDisplayAll,
  onCreateTeamShortcut,
  onDisplayMembers,
}: TeamsCardProps) {
  const hasTeams = teams.length > 0;

  return (
    <section className="flex h-full flex-col border border-neutral-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-neutral-100 px-7 py-5">
        <div className="flex items-center gap-3">
          <UsersRound size={22} className="text-neutral-700" />
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            Equipos
          </h2>
        </div>

        <button
          type="button"
          onClick={onDisplayAll}
          disabled={isLoading || Boolean(error) || !hasTeams}
          className="text-sm font-medium text-purple-700 transition hover:text-purple-900 disabled:cursor-not-allowed disabled:text-neutral-300"
        >
          Ver todos
        </button>
      </header>

      <div className="flex-1 divide-y divide-neutral-100">
        {isLoading ? (
          <TeamsCardSkeleton />
        ) : error ? (
          <TeamsCardError />
        ) : !hasTeams ? (
          <TeamsCardEmpty onCreateTeamShortcut={onCreateTeamShortcut} />
        ) : (
          teams.slice(0, 3).map((team) => (
            <article
              key={team.id}
              className="grid items-center gap-4 px-7 py-5 transition hover:bg-neutral-50 sm:grid-cols-[1fr_auto]"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">
                  {getInitials(team.name)}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-neutral-950">
                    {team.name}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {team.membersCount} miembros
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDisplayMembers(team.id)}
                className="inline-flex items-center gap-2 justify-self-start text-sm font-medium text-purple-700 transition hover:text-purple-900 sm:justify-self-end"
              >
                Ver miembros
                <ChevronRight size={17} />
              </button>
            </article>
          ))
        )}
      </div>

      <footer className="mt-auto border-t border-neutral-100 px-7 py-5">
        <button
          type="button"
          onClick={onCreateTeamShortcut}
          disabled={isLoading}
          className="inline-flex items-center gap-3 text-sm font-medium text-purple-700 transition hover:text-purple-900 disabled:cursor-not-allowed disabled:text-neutral-300"
        >
          <UsersRound size={20} />
          Crear equipo
        </button>
      </footer>
    </section>
  );
}

function TeamsCardSkeleton() {
  return (
    <div className="divide-y divide-neutral-100">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="grid items-center gap-4 px-7 py-5 sm:grid-cols-[1fr_auto]"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-neutral-100" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>

          <div className="h-4 w-24 animate-pulse rounded bg-neutral-100 sm:justify-self-end" />
        </article>
      ))}
    </div>
  );
}

function TeamsCardError() {
  return (
    <div className="px-7 py-8">
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
        <h3 className="text-sm font-semibold text-red-900">
          No se pudieron cargar los equipos
        </h3>
        <p className="mt-1 text-sm text-red-700">
          Intenta nuevamente más tarde o revisa tu conexión.
        </p>
      </div>
    </div>
  );
}

function TeamsCardEmpty({
  onCreateTeamShortcut,
}: {
  onCreateTeamShortcut: () => void;
}) {
  return (
    <div className="px-7 py-8">
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <UsersRound size={20} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-950">
              Todavía no tienes equipos
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Crea un equipo para agrupar amigos y comparar progreso.
            </p>

            <button
              type="button"
              onClick={onCreateTeamShortcut}
              className="mt-4 text-sm font-medium text-purple-700 transition hover:text-purple-900"
            >
              Crear primer equipo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
