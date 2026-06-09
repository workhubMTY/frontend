"use client";

import { useState } from "react";

import { EventsCard } from "@/app/features/reservaciones/crear/components/Cards/EventsCard";
import { ProposedSchedulesCard } from "@/app/features/reservaciones/crear/components/Cards/ProposedSchedulesCard";
import { ReservationFooter } from "@/app/features/reservaciones/crear/components/ReservationFooter";
import { SelectionModeCalendarCard } from "@/app/features/reservaciones/crear/components/Calendar/DaysSelection/SelectionModeCalendarCard";

import { ParkingCapacityTimelineCard } from "@/app/features/estacionamientos/components/Timeline/ParkingCapacityTimelineCard";
import { ParkingReservationConfirmModal } from "@/app/features/estacionamientos/components/ParkingReservationsConfirmModals";

import { useParkingReservationSchedulerViewModel } from "@/app/features/estacionamientos/hooks/useParkingReservationSchedulerViewModel";
import { dateToId } from "@/app/features/reservaciones/crear/lib/dates";
import { useCurrentMinute } from "@/app/features/reservaciones/crear/hooks/useCurrentMinute";

export default function ParkingReservationSchedulerPage() {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const now = useCurrentMinute();

  const todayId = dateToId(now);

  const { state, actions } = useParkingReservationSchedulerViewModel({
    showAllEvents,
  });
  const hasTodaySelected =
    state.scheduler.selectableSelectedDateIds.includes(todayId);

  return (
    <main className="min-h-full bg-background-page p-4 text-slate-950 sm:p-6 lg:p-8">
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
        <section className="space-y-5">
          <ParkingCapacityTimelineCard
            capacity={state.parkingCapacity}
            blocks={state.scheduler.proposedBlocksForActiveDay}
            buckets={state.parkingBuckets}
            conflictRanges={state.myReservationConflictRanges}
          />
          <EventsCard
            events={state.activeDayParkingItems}
            visibleEvents={state.visibleEvents}
            conflictCount={state.conflictCount}
            showAllEvents={showAllEvents}
            onToggleShowAllEvents={() => setShowAllEvents((value) => !value)}
          />

          <ReservationFooter
            selectedCount={state.scheduler.selectableSelectedDateIds.length}
            proposedBlocksCount={state.scheduler.proposedBlocks.length}
            hasBlockingConflict={state.scheduler.hasBlockingConflict}
            canContinue={state.canSubmitReservation}
            onCancel={actions.cancelReservation}
            onContinue={actions.openConfirmationModal}
          />
        </section>

        <aside className="sticky h-full flex flex-col top-5 self-start space-y-5">
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
            selectedDateCount={state.scheduler.selectableSelectedDateIds.length}
            hasSelectedDates={
              state.scheduler.selectableSelectedDateIds.length > 0
            }
            hasTodaySelected={hasTodaySelected}
            now={now}
            onAddBlock={state.scheduler.addProposedBlock}
            onDeleteBlock={state.scheduler.deleteProposedBlock}
            onUpdateBlock={state.scheduler.updateProposedBlock}
          />
        </aside>
      </div>

      <ParkingReservationConfirmModal
        open={state.isConfirmModalOpen}
        selectedDateIds={state.scheduler.selectedDateIds}
        blocks={state.scheduler.proposedBlocks}
        hasConflict={state.scheduler.hasBlockingConflict}
        isSubmitting={state.isSubmittingReservation}
        onClose={actions.closeConfirmationModal}
        onConfirm={actions.confirmParkingReservation}
      />
    </main>
  );
}
