"use client";

import { Users, X } from "lucide-react";

import type { InvitedGuest } from "../../types/confirmation";
import { Avatar } from "../Avatar";

type SelectedGuestsPanelProps = {
  invitedGuests: InvitedGuest[];
  hasInvitedGuests: boolean;
  onRemoveInvitedGuest: (guestId: string) => void;
};

export function SelectedGuestsPanel({
  invitedGuests,
  hasInvitedGuests,
  onRemoveInvitedGuest,
}: SelectedGuestsPanelProps) {
  return (
    <aside className="flex min-h-0 flex-col border-t border-slate-200 bg-slate-50 lg:border-l lg:border-t-0">
      <header className="shrink-0 border-b border-slate-200 px-5 py-4">
        <p className="text-sm font-bold text-slate-950">
          Invitados seleccionados
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {invitedGuests.length} agregado{invitedGuests.length === 1 ? "" : "s"}
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {hasInvitedGuests ? (
          <div className="space-y-2">
            {invitedGuests.map((guest) => (
              <SelectedGuestItem
                key={guest.id}
                guest={guest}
                onRemove={onRemoveInvitedGuest}
              />
            ))}
          </div>
        ) : (
          <EmptySelectedGuests />
        )}
      </div>
    </aside>
  );
}

function SelectedGuestItem({
  guest,
  onRemove,
}: {
  guest: InvitedGuest;
  onRemove: (guestId: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3">
      <Avatar name={guest.name} kind={guest.kind} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {guest.name}
        </p>

        <p className="truncate text-xs text-slate-500">{guest.email}</p>
      </div>

      {guest.kind === "invitado" && (
        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700">
          Invitado
        </span>
      )}

      <button
        type="button"
        onClick={() => onRemove(guest.id)}
        className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Eliminar invitado"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function EmptySelectedGuests() {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <Users size={28} className="text-slate-300" />

      <p className="mt-3 text-sm font-semibold text-slate-600">
        Todavía no hay invitados
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        Puedes finalizar la reserva sin invitados o agregar personas desde la
        búsqueda.
      </p>
    </div>
  );
}