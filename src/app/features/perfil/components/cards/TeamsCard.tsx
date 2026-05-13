import { ChevronRight, UsersRound } from "lucide-react";
import type { Team } from "../../types/profile";
import { getInitials } from "../../lib/formatting";

type TeamsCardProps = {
  teams: Team[];
  onDisplayAll: () => void;
};

export function TeamsCard({ teams, onDisplayAll }: TeamsCardProps) {
  return (
    <section className="border border-neutral-200 bg-white shadow-sm h-full flex flex-col">
      <header className="flex items-center justify-between border-b border-neutral-100 px-7 py-5">
        <div className="flex items-center gap-3">
          <UsersRound size={22} className="text-neutral-700" />
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            Equipos
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onDisplayAll()}
          className="text-sm font-medium text-purple-700 transition hover:text-purple-900"
        >
          Ver todos
        </button>
      </header>

      <div className="divide-y divide-neutral-100">
        {teams.map((team) => (
          <article
            key={team.id}
            className="grid items-center gap-4 px-7 py-5 transition hover:bg-neutral-50 sm:grid-cols-[1fr_auto]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">
                {getInitials(team.name)}
              </div>

              <div>
                <h3 className="font-semibold text-neutral-950">{team.name}</h3>
                <p className="text-sm text-neutral-500">
                  {team.membersCount} miembros
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Ver miembros de ${team.name}`)}
              className="inline-flex items-center gap-2 justify-self-start text-sm font-medium text-purple-700 transition hover:text-purple-900 sm:justify-self-end"
            >
              Ver miembros
              <ChevronRight size={17} />
            </button>
          </article>
        ))}
      </div>

      <footer className="border-t border-neutral-100 px-7 py-5 mt-auto">
        <button
          type="button"
          onClick={() => alert("Crear o unirse a un equipo")}
          className="inline-flex items-center gap-3 text-sm font-medium text-purple-700 transition hover:text-purple-900"
        >
          <UsersRound size={20} />
          Crear o unirse a un equipo
        </button>
      </footer>
    </section>
  );
}
