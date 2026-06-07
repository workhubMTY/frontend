"use client";

import { Check } from "lucide-react";

type CreateTeamCardProps = {
  shouldCreateTeam: boolean;
  teamName: string;
  teamNameError: string;
  onToggle: () => void;
  onTeamNameChange: (value: string) => void;
};

export function CreateTeamCard({
  shouldCreateTeam,
  teamName,
  teamNameError,
  onToggle,
  onTeamNameChange,
}: CreateTeamCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-950">
            Crear equipo con esta selección
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Puedes guardar estos invitados como equipo para usarlos después.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
            shouldCreateTeam
              ? "bg-violet-700 text-white"
              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
          }`}
          aria-label="Crear equipo"
        >
          {shouldCreateTeam && <Check size={18} />}
        </button>
      </div>

      {shouldCreateTeam && (
        <div className="mt-4">
          <input
            value={teamName}
            onChange={(event) => onTeamNameChange(event.target.value)}
            placeholder="Nombre del equipo"
            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:ring-4 ${
              teamNameError
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
            }`}
          />

          {teamNameError && (
            <p className="mt-2 text-xs font-semibold text-red-500">
              {teamNameError}
            </p>
          )}
        </div>
      )}
    </section>
  );
}