import { RefObject } from "react";
import { Check, Search, Users, UserPlus, X } from "lucide-react";

import type { InvitedGuest, PersonOption, WorkGroupOption } from "../types/confirmation";
import { Avatar } from "./Avatar";

type InviteGuestsModalProps = {
  isOpen: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  searchTerm: string;
  people: PersonOption[];
  workGroups: WorkGroupOption[];
  invitedGuests: InvitedGuest[];
  shouldCreateTeam: boolean;
  teamName: string;
  teamNameError: string;
  onClose: () => void;
  onSearchTermChange: (value: string) => void;
  onPersonSelect: (person: PersonOption) => void;
  onWorkGroupSelect: (workGroup: WorkGroupOption) => void;
  onRemoveInvitedGuest: (id: string) => void;
  onToggleShouldCreateTeam: () => void;
  onTeamNameChange: (value: string) => void;
};

export function InviteGuestsModal({
  isOpen,
  containerRef,
  searchTerm,
  people,
  workGroups,
  invitedGuests,
  shouldCreateTeam,
  teamName,
  teamNameError,
  onClose,
  onSearchTermChange,
  onPersonSelect,
  onWorkGroupSelect,
  onRemoveInvitedGuest,
  onToggleShouldCreateTeam,
  onTeamNameChange,
}: InviteGuestsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-5 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex h-[min(760px,calc(100vh-48px))] w-full max-w-6xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/10">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-50/80 px-6 py-6 lg:block">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm">
            <UserPlus size={22} />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
            Agregar invitados
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Busca personas o equipos, agrégalos a la reserva y revisa la selección antes de confirmar.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Selección actual
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {invitedGuests.length}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              invitado{invitedGuests.length === 1 ? "" : "s"} agregado{invitedGuests.length === 1 ? "" : "s"}
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
            <div>
              <p className="text-sm font-semibold text-violet-700 lg:hidden">
                Invitados
              </p>
              <h3 className="text-xl font-semibold text-slate-950">
                Selecciona quién asistirá
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Puedes añadir personas individuales o grupos de trabajo.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Cerrar selector de invitados"
            >
              <X size={20} />
            </button>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
            <main className="min-h-0 overflow-y-auto px-6 py-5">
              <div ref={containerRef} className="sticky top-0 z-10 bg-white pb-4">
                <div className="relative">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => onSearchTermChange(event.target.value)}
                    placeholder="Buscar nombre, correo o equipo"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    autoFocus
                  />
                </div>
              </div>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Personas
                  </h4>
                  <span className="text-xs text-slate-400">
                    {people.length} resultado{people.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="grid gap-2">
                  {people.map((person) => {
                    const isSelected = invitedGuests.some(
                      (guest) => guest.id === person.id || guest.email === person.email,
                    );

                    return (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => onPersonSelect(person)}
                        className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                          isSelected
                            ? "border-violet-200 bg-violet-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <Avatar name={person.name} kind={person.kind} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {person.name}
                          </p>
                          <p className="truncate text-sm text-slate-500">
                            {person.email}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white">
                            <Check size={15} />
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {people.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                      No encontramos personas con esa búsqueda.
                    </div>
                  )}
                </div>
              </section>

              <section className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Equipos
                  </h4>
                  <span className="text-xs text-slate-400">
                    {workGroups.length} resultado{workGroups.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {workGroups.map((workGroup) => {
                    const isSelected = invitedGuests.some(
                      (guest) => guest.id === `equipo-${workGroup.id}`,
                    );

                    return (
                      <button
                        key={workGroup.id}
                        type="button"
                        onClick={() => onWorkGroupSelect(workGroup)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          isSelected
                            ? "border-violet-200 bg-violet-50 text-violet-800"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <Users size={15} />
                        {workGroup.name}
                        <span className="text-xs font-medium text-slate-400">
                          {workGroup.memberCount}
                        </span>
                        {isSelected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </section>
            </main>

            <aside className="flex min-h-0 flex-col border-t border-slate-200 bg-slate-50/80 lg:border-l lg:border-t-0">
              <div className="shrink-0 px-5 py-4">
                <h4 className="text-sm font-semibold text-slate-950">
                  Invitados seleccionados
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Revisa la lista antes de cerrar este panel.
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
                {invitedGuests.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500">
                    Todavía no hay invitados seleccionados.
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {invitedGuests.map((guest) => (
                      <div
                        key={guest.id}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
                      >
                        <Avatar name={guest.name} kind={guest.kind} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {guest.name}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {guest.email}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveInvitedGuest(guest.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
                          aria-label={`Eliminar ${guest.name}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Crear equipo
                    </p>
                    <p className="text-xs text-slate-500">
                      A partir de esta selección
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleShouldCreateTeam}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      shouldCreateTeam
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    }`}
                    aria-label="Crear equipo a partir de la selección"
                  >
                    {shouldCreateTeam && <Check size={17} />}
                  </button>
                </div>

                {shouldCreateTeam && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={teamName}
                      onChange={(event) => onTeamNameChange(event.target.value)}
                      placeholder="Nombre del equipo"
                      className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition focus:ring-4 ${
                        teamNameError
                          ? "border-red-300 focus:border-red-300 focus:ring-red-100"
                          : "border-slate-200 focus:border-violet-300 focus:ring-violet-100"
                      }`}
                    />
                    {teamNameError && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {teamNameError}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 h-11 w-full rounded-xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Listo
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
