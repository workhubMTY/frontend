"use client";

import { Calendar, Check, Clock, LogOut, Search, Users, X } from "lucide-react";

import type { ReservationDraft } from "../types/confirmation";
import { useConfirmReservationViewModel } from "../hooks/useConfirmReservationViewModel";
import { Avatar } from "./Avatar";

type ConfirmReservationModalProps = {
  isOpen: boolean;
  reservationDraft: ReservationDraft | null;
  onClose: () => void;
  onCompleted: () => void;
};

export function ConfirmReservationModal({
  isOpen,
  reservationDraft,
  onClose,
  onCompleted,
}: ConfirmReservationModalProps) {
  const { state, refs, actions } = useConfirmReservationViewModel({
    isOpen,
    reservationDraft,
    onClose,
    onCompleted,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          actions.closeModal();
        }
      }}
    >
      <section className="flex max-h-[92vh] w-full max-w-6xl overflow-hidden  bg-white shadow-2xl">
        <aside className="hidden w-80 shrink-0 border-r border-slate-200 bg-slate-50 p-6 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            Confirmación
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            Revisa tu reserva
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Agrega colaboradores, invitados o equipos antes de finalizar la
            reservación.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-base font-bold text-slate-950">
                {reservationDraft?.reservableName ?? "Cubículo"}
              </p>

              <span className="text-xs font-medium text-slate-400">
                #{reservationDraft?.reservableId ?? "N/A"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
              <div className="flex justify-center">
                <Calendar size={15} className="text-slate-400" />
              </div>
              <div className="flex justify-center">
                <Clock size={15} className="text-slate-400" />
              </div>
              <div className="flex justify-center">
                <LogOut size={15} className="text-slate-400" />
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {state.sessions.map((session, index) => (
                <div
                  key={`${session.dateLabel}-${session.startLabel}-${index}`}
                  className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 px-3 py-2"
                >
                  <span className="text-center text-xs font-semibold text-slate-700">
                    {session.dateLabel}
                  </span>
                  <span className="text-center text-xs font-semibold text-slate-700">
                    {session.startLabel}
                  </span>
                  <span className="text-center text-xs font-semibold text-slate-700">
                    {session.endLabel}
                  </span>
                </div>
              ))}

              {state.sessions.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-400">
                  No hay horarios seleccionados.
                </p>
              )}
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
            <div>
              <h3 className="text-xl font-bold text-slate-950">
                Agregar invitados
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Busca personas o equipos para invitarlos a esta reservación.
              </p>
            </div>

            <button
              type="button"
              onClick={actions.closeModal}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_340px]">
            <main className="min-w-0 overflow-y-auto px-6 py-5">
              {state.loadError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {state.loadError}
                </div>
              )}

              <div ref={refs.searchContainerRef} className="relative">
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-slate-400">
                    <Search size={18} />
                  </span>

                  <input
                    value={state.searchTerm}
                    onChange={(event) =>
                      actions.setSearchTerm(event.target.value)
                    }
                    onFocus={actions.openDropdown}
                    placeholder="Buscar nombre, correo o equipo"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                {state.isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="max-h-[420px] overflow-y-auto py-3">
                      <div className="px-4 pb-2">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          Personas
                        </p>
                      </div>

                      {state.filteredPeople.map((person) => (
                        <button
                          key={person.id}
                          type="button"
                          onClick={() => actions.addPerson(person)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-50"
                        >
                          <Avatar
                            name={person.name}
                            kind={person.kind}
                            size="sm"
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {person.name}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {person.email}
                            </p>
                          </div>
                        </button>
                      ))}

                      {state.filteredPeople.length === 0 && (
                        <p className="px-4 py-4 text-sm text-slate-400">
                          No encontramos personas con esa búsqueda.
                        </p>
                      )}

                      <div className="mt-2 border-t border-slate-100 px-4 pb-2 pt-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          Equipos
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 px-4 pb-2">
                        {state.filteredWorkGroups.map((workGroup) => (
                          <button
                            key={workGroup.id}
                            type="button"
                            onClick={() => actions.addWorkGroup(workGroup)}
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition hover:opacity-80 ${workGroup.colorClassName}`}
                          >
                            <Users size={14} />
                            {workGroup.name}
                            <span className="text-xs opacity-70">
                              ({workGroup.memberCount})
                            </span>
                          </button>
                        ))}
                      </div>

                      {state.filteredWorkGroups.length === 0 && (
                        <p className="px-4 py-4 text-sm text-slate-400">
                          No encontramos equipos con esa búsqueda.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <section className="mt-auto rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-950">
                      Crear equipo con esta selección
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Puedes guardar estos invitados como equipo para usarlos
                      después.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={actions.toggleShouldCreateTeam}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                      state.shouldCreateTeam
                        ? "bg-violet-700 text-white"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    }`}
                    aria-label="Crear equipo"
                  >
                    {state.shouldCreateTeam && <Check size={18} />}
                  </button>
                </div>

                {state.shouldCreateTeam && (
                  <div className="mt-4">
                    <input
                      value={state.teamName}
                      onChange={(event) =>
                        actions.updateTeamName(event.target.value)
                      }
                      placeholder="Nombre del equipo"
                      className={`h-11 w-full rounded-xl border bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:ring-4 ${
                        state.teamNameError
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                      }`}
                    />

                    {state.teamNameError && (
                      <p className="mt-2 text-xs font-semibold text-red-500">
                        {state.teamNameError}
                      </p>
                    )}
                  </div>
                )}
              </section>
            </main>

            <aside className="flex min-h-0 flex-col border-t border-slate-200 bg-slate-50 lg:border-l lg:border-t-0">
              <div className="shrink-0 border-b border-slate-200 px-5 py-4">
                <p className="text-sm font-bold text-slate-950">
                  Invitados seleccionados
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {state.invitedGuests.length} agregado
                  {state.invitedGuests.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {state.invitedGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3"
                    >
                      <Avatar name={guest.name} kind={guest.kind} />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {guest.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {guest.email}
                        </p>
                      </div>

                      {guest.kind === "invitado" && (
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700">
                          Invitado
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => actions.removeInvitedGuest(guest.id)}
                        className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Eliminar invitado"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {!state.hasInvitedGuests && (
                  <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
                    <Users size={28} className="text-slate-300" />
                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      Todavía no hay invitados
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Puedes finalizar la reserva sin invitados o agregar
                      personas desde la búsqueda.
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>

          <footer className="flex shrink-0 flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {state.submitError && (
                <p className="text-sm font-semibold text-red-600">
                  {state.submitError}
                </p>
              )}

              {!state.submitError && (
                <p className="text-sm text-slate-500">
                  Se enviará invitación por correo a los contactos
                  seleccionados.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={actions.closeModal}
                disabled={state.isSubmitting}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={actions.submitReservation}
                disabled={state.isSubmitting}
                className="rounded-xl bg-violet-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {state.isSubmitting ? "Finalizando..." : "Finalizar reserva"}
              </button>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}