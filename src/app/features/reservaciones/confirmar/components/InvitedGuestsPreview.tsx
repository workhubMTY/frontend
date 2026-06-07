import { UserPlus, UsersRound, X } from "lucide-react";

import type { InvitedGuest } from "../types/confirmation";
import { Avatar } from "./Avatar";

type InvitedGuestsPreviewProps = {
  invitedGuests: InvitedGuest[];
  onOpenInvites: () => void;
  onRemoveInvitedGuest: (id: string) => void;
};

export function InvitedGuestsPreview({
  invitedGuests,
  onOpenInvites,
  onRemoveInvitedGuest,
}: InvitedGuestsPreviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <UsersRound size={16} />
            Invitados
          </div>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            {invitedGuests.length === 0
              ? "Aún no agregas invitados"
              : `${invitedGuests.length} seleccionado${invitedGuests.length === 1 ? "" : "s"}`}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Puedes invitar colaboradores, invitados externos o equipos completos.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenInvites}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <UserPlus size={16} />
          Agregar invitados
        </button>
      </div>

      <div className="px-6 py-5">
        {invitedGuests.length === 0 ? (
          <button
            type="button"
            onClick={onOpenInvites}
            className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-violet-300 hover:bg-violet-50/40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
              <UserPlus size={22} />
            </span>
            <span className="mt-3 text-sm font-semibold text-slate-900">
              Abrir selector de invitados
            </span>
            <span className="mt-1 text-sm text-slate-500">
              Estilo modal para mantener esta pantalla más limpia.
            </span>
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            {invitedGuests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-2 shadow-sm"
              >
                <Avatar name={guest.name} kind={guest.kind} size="sm" />
                <div className="min-w-0">
                  <p className="max-w-44 truncate text-sm font-semibold text-slate-900">
                    {guest.name}
                  </p>
                  <p className="max-w-44 truncate text-xs text-slate-500">
                    {guest.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveInvitedGuest(guest.id)}
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label={`Eliminar ${guest.name}`}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
