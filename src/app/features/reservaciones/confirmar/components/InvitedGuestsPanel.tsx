import { Check, X } from "lucide-react";

import type { InvitedGuest } from "../types";
import { Avatar } from "./Avatar";

type InvitedGuestsPanelProps = {
  invitedGuests: InvitedGuest[];
  shouldCreateTeam: boolean;
  teamName: string;
  teamNameError: string;
  onRemoveInvitedGuest: (id: string) => void;
  onToggleShouldCreateTeam: () => void;
  onTeamNameChange: (value: string) => void;
};

export function InvitedGuestsPanel({
  invitedGuests,
  shouldCreateTeam,
  teamName,
  teamNameError,
  onRemoveInvitedGuest,
  onToggleShouldCreateTeam,
  onTeamNameChange,
}: InvitedGuestsPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-6 pb-3 pt-5">
        {invitedGuests.map((guest) => (
          <div
            key={guest.id}
            className="flex shrink-0 items-center gap-3.5 overflow-auto border border-gray-100 bg-gray-50 px-3.5 py-3"
          >
            <Avatar name={guest.name} variant={guest.kind} />
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 text-[15px] font-semibold text-gray-900">
                {guest.name}
              </div>
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500">
                {guest.email}
              </div>
            </div>

            {guest.kind === "invitado" && (
              <span className="shrink-0 rounded-md bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                Invitado
              </span>
            )}

            <button
              onClick={() => onRemoveInvitedGuest(guest.id)}
              className="flex shrink-0 cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-gray-400 transition-colors hover:text-gray-700"
              aria-label="Eliminar invitado"
            >
              <X size={18} />
            </button>
          </div>
        ))}

        {invitedGuests.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            No hay invitados agregados aún.
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 border-t border-gray-100 px-6 py-4">
        <span className="text-sm text-gray-500">
          Crear equipo a partir de la selección
        </span>
        <button
          onClick={onToggleShouldCreateTeam}
          className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border-none transition-colors ${
            shouldCreateTeam ? "bg-violet-700" : "bg-gray-200"
          }`}
          aria-label="Toggle crear equipo"
        >
          {shouldCreateTeam && <Check size={18} className="text-white" />}
        </button>

        {shouldCreateTeam && (
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="text"
              value={teamName}
              onChange={(event) => onTeamNameChange(event.target.value)}
              placeholder="Ingresa el nombre del equipo"
              className={`flex-1 rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors font-[inherit] ${
                teamName.trim() === ""
                  ? "border-red-300 focus:border-red-400"
                  : "border-gray-200 focus:border-violet-400"
              }`}
            />
            {teamNameError && (
              <span className="pl-1 text-xs text-red-500">{teamNameError}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
