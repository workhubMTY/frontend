"use client";

import type { ReservationDraft } from "../../types/confirmation";
import { useConfirmReservationViewModel } from "../../hooks/useConfirmReservationViewModel";

import { ConfirmReservationModalShell } from "./layout/ConfirmReservationModalShell";
import { ReservationSummaryAside } from "./ReservationSummaryAside";
import { InviteSearchPanel } from "./panels/InviteSearchPanel";
import { SelectedGuestsPanel } from "./panels/SelectedGuestsPanel";
import { ConfirmReservationFooter } from "./layout/ConfirmReservationFooter";
import { Message } from "@/app/shared/components/Message/Message";

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
    <ConfirmReservationModalShell onClose={actions.closeModal}>
      <ReservationSummaryAside
        reservationDraft={reservationDraft}
        sessions={state.sessions}
      />

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
            ✕
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_340px]">
          <main className="flex min-w-0 flex-col overflow-y-auto px-6 py-4 ">
            {state.loadError && (
              <Message
                onDismiss={() => actions.setLoadError("")}
                autoDismiss={true}
                delay={4000}
                extendClass="self-center w-full mb-4 bg-red-50 border-red-200 text-red-700"
              >
                {state.loadError}
              </Message>
            )}

            <InviteSearchPanel
              containerRef={refs.searchContainerRef}
              searchTerm={state.searchTerm}
              isDropdownOpen={state.isDropdownOpen}
              people={state.filteredPeople}
              workGroups={state.filteredWorkGroups}
              onSearchTermChange={actions.setSearchTerm}
              onOpenDropdown={actions.openDropdown}
              onPersonSelect={actions.addPerson}
              onWorkGroupSelect={actions.addWorkGroup}
            />

            {/* <div className="mt-auto pt-6">
              <CreateTeamCard
                shouldCreateTeam={state.shouldCreateTeam}
                teamName={state.teamName}
                teamNameError={state.teamNameError}
                onToggle={actions.toggleShouldCreateTeam}
                onTeamNameChange={actions.updateTeamName}
              />
            </div> */}
          </main>

          <SelectedGuestsPanel
            invitedGuests={state.invitedGuests}
            hasInvitedGuests={state.hasInvitedGuests}
            onRemoveInvitedGuest={actions.removeInvitedGuest}
          />
        </div>

        <ConfirmReservationFooter
          submitError={state.submitError}
          isSubmitting={state.isSubmitting}
          onCancel={actions.closeModal}
          onSubmit={actions.submitReservation}
        />
      </div>
    </ConfirmReservationModalShell>
  );
}
