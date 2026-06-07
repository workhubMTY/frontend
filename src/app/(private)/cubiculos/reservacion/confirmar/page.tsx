"use client";

import PageTransition from "@/app/shared/components/PageTransition/PageTransition";

import { GuestSearchBox } from "@/app/features/reservaciones/confirmar/components/GuestSearchBox";
import { InvitedGuestsPanel } from "@/app/features/reservaciones/confirmar/components/InvitedGuestsPanel";
import { ReservationFinishedModal } from "@/app/features/reservaciones/confirmar/components/ReservationFinishedModal";
import { ReservationSummaryCard } from "@/app/features/reservaciones/confirmar/components/ReservationSummaryCard";
import { useCubiculoConfirmarViewModel } from "@/app/features/reservaciones/confirmar/hooks/useCubiculoConfirmarViewModel";

export function CubiculoConfirmarView() {
  const { state, refs, actions } = useCubiculoConfirmarViewModel();

  return (
    <PageTransition>
      <section className="flex h-screen w-full overflow-hidden bg-background-page">
        <ReservationFinishedModal
          isOpen={state.isSuccessModalOpen}
          onClose={actions.closeSuccessModal}
          onBackToReservations={actions.goBackToReservations}
        />

        <div className="flex flex-1 flex-col px-20 py-8">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
              Reserva completa
            </h1>
          </div>

          {state.loadError && (
            <div className="mb-3 border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {state.loadError}
            </div>
          )}

          <div className="flex min-h-0 flex-1 gap-6">
            <ReservationSummaryCard
              reservationDraft={state.reservationDraft}
              sessions={state.sessions}
            />

            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <GuestSearchBox
                containerRef={refs.searchContainerRef}
                searchTerm={state.searchTerm}
                people={state.filteredPeople}
                workGroups={state.filteredWorkGroups}
                isOpen={state.isDropdownOpen}
                onSearchTermChange={actions.setSearchTerm}
                onOpen={actions.openDropdown}
                onPersonSelect={actions.addPerson}
                onWorkGroupSelect={actions.addWorkGroup}
              />

              <InvitedGuestsPanel
                invitedGuests={state.invitedGuests}
                shouldCreateTeam={state.shouldCreateTeam}
                teamName={state.teamName}
                teamNameError={state.teamNameError}
                onRemoveInvitedGuest={actions.removeInvitedGuest}
                onToggleShouldCreateTeam={actions.toggleShouldCreateTeam}
                onTeamNameChange={actions.updateTeamName}
              />
            </div>
          </div>

          <button
            onClick={actions.finishReservation}
            disabled={state.isSubmitting}
            className="no-select mt-4 w-full shrink-0 cursor-pointer border-none bg-violet-700 p-3 text-lg font-bold tracking-wide text-white transition-all hover:bg-violet-800 active:scale-99 disabled:cursor-not-allowed disabled:opacity-60 font-[inherit]"
          >
            {state.isSubmitting ? "Finalizando..." : "Finalizar"}
          </button>
        </div>
      </section>
    </PageTransition>
  );
}
