"use client";

import { useState } from "react";

import { Card } from "@/app/shared/components/Card";

import { EventsCard } from "@/app/features/reservaciones/crear/components/Cards/EventsCard";
import { ProposedSchedulesCard } from "@/app/features/reservaciones/crear/components/Cards/ProposedSchedulesCard";
import { ReservationFooter } from "@/app/features/reservaciones/crear/components/ReservationFooter";
import { ReservationTimelineCard } from "@/app/features/reservaciones/crear/components/Cards/ReservationTimelineCard";
import { SelectionModeCalendarCard } from "@/app/features/reservaciones/crear/components/Calendar/DaysSelection/SelectionModeCalendarCard";

import { ConfirmReservationModal } from "@/app/features/reservaciones/confirmar/components/modals/ConfirmReservationModal";
import { ReservationFinishedModal } from "@/app/features/reservaciones/confirmar/components/ReservationFinishedModal";

import { useReservationSchedulerViewModel } from "@/app/features/reservaciones/crear/hooks/useReservationSchedulerViewModel";

export function ReservationSchedulerContent() {
  const [showAllEvents, setShowAllEvents] = useState(false);

  const { state, actions } = useReservationSchedulerViewModel({
    showAllEvents,
  });

  return (
    <>
      <main className="min-h-full bg-background-page p-4 text-slate-950 sm:p-6 lg:p-8">
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="flex min-w-0 flex-col gap-4">
            <Card className="p-4">
              <ReservationTimelineCard
                activeDayId={state.scheduler.activeDayId}
                proposedBlocks={state.scheduler.proposedBlocksForActiveDay}
                spaceItems={state.activeDaySpaceScheduleItems}
                myItems={state.activeDayMyScheduleItems}
              />
            </Card>

            <EventsCard
              events={state.activeDayMyScheduleItems}
              visibleEvents={state.visibleMyScheduleItems}
              conflictCount={state.conflictCount}
              showAllEvents={showAllEvents}
              onToggleShowAllEvents={() => setShowAllEvents((value) => !value)}
            />

            <ReservationFooter
              selectedCount={state.scheduler.selectableSelectedDateIds.length}
              proposedBlocksCount={state.scheduler.proposedBlocks.length}
              hasBlockingConflict={state.scheduler.hasBlockingConflict}
              canContinue={state.scheduler.canContinue}
              onCancel={actions.cancelReservation}
              onContinue={actions.openConfirmationModal}
            />
          </section>

          <aside className="flex h-full flex-col gap-5 self-start xl:sticky xl:top-6">
            <SelectionModeCalendarCard
              calendarCells={state.calendarCells}
              activeDayId={state.scheduler.activeDayId}
              selectionMode={state.scheduler.selectionMode}
              selectedDateIds={state.scheduler.selectedDateIds}
              conflictDateIds={state.scheduler.conflictDateIds}
              onModeChange={state.scheduler.handleModeChange}
              onSelect={state.scheduler.handleCalendarSelect}
              onClearSelection={state.scheduler.clearSelection}
              onActivateDay={state.scheduler.setActiveDayId}
            />

            <ProposedSchedulesCard
              proposedBlocks={state.scheduler.proposedBlocks}
              selectedDateCount={
                state.scheduler.selectableSelectedDateIds.length
              }
              hasSelectedDates={
                state.scheduler.selectableSelectedDateIds.length > 0
              }
              onAddBlock={state.scheduler.addProposedBlock}
              onDeleteBlock={state.scheduler.deleteProposedBlock}
              onUpdateBlock={state.scheduler.updateProposedBlock}
            />
          </aside>
        </div>
      </main>

      <ConfirmReservationModal
        isOpen={state.isConfirmModalOpen}
        reservationDraft={state.confirmationDraft}
        onClose={actions.closeConfirmationModal}
        onCompleted={actions.handleReservationCompleted}
      />

      <ReservationFinishedModal
        isOpen={state.isFinishedModalOpen}
        onBackToReservations={actions.backToReservations}
      />
    </>
  );
}
