"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/app/shared/components/Card";
import { EventsAndConflictsCard } from "@/app/features/reservaciones/components/Cards/EventsAndConflictCard";
import { ProposedSchedulesCard } from "@/app/features/reservaciones/components/Cards/ProposedSchedulesCard";
import { ReservationFooter } from "@/app/features/reservaciones/components/ReservationFooter";
import { ReservationTimelineCard } from "@/app/features/reservaciones/components/Cards/ReservationTimelineCard";
import { SelectionModeCalendarCard } from "@/app/features/reservaciones/components/Calendar/DaysSelection/SelectionModeCalendarCard";

import { useReservationSchedulerPage } from "@/app/features/reservaciones/hooks/useReservationSchedulerPage";

export function ReservationSchedulerContent() {
  const router = useRouter();
  const [showAllEvents, setShowAllEvents] = useState(false);

  const {
    spaceName,
    selectedSpace,
    calendarCells,
    scheduler,
    activeDayExternalEvents,
    externalTimelineEventsForActiveDay,
    proposedTimelineEventsForActiveDay,
    spaceReservationsForActiveDay,
    conflictCount,
    visibleEvents,
  } = useReservationSchedulerPage({ showAllEvents });

  function handleContinue() {
    if (!selectedSpace) return;

    const draft = scheduler.createReservationDraft(selectedSpace);

    if (!draft) return;

    router.push("/cubiculos/reservacion/confirmar");
  }

  return (
    <main className="min-h-screen bg-background-page p-4 text-slate-950 sm:p-6 lg:p-8">
      <header className="mb-5 flex items-center justify-between rounded-2xl px-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Ajusta tu reservación · {spaceName}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Revisa disponibilidad, arrastra días y configura los horarios de tu
            reservación.
          </p>
        </div>
      </header>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="space-y-5">
          <Card className="p-5">
            <ReservationTimelineCard
              activeDayId={scheduler.activeDayId}
              proposedBlocks={scheduler.proposedBlocksForActiveDay}
              spaceReservationsForActiveDay={spaceReservationsForActiveDay}
              externalTimelineEventsForActiveDay={
                externalTimelineEventsForActiveDay
              }
            />
          </Card>

          <ProposedSchedulesCard
            proposedBlocks={scheduler.proposedBlocks}
            selectedDateCount={scheduler.selectableSelectedDateIds.length}
            hasSelectedDates={scheduler.selectableSelectedDateIds.length > 0}
            onAddBlock={scheduler.addProposedBlock}
            onDeleteBlock={scheduler.deleteProposedBlock}
            onUpdateBlock={scheduler.updateProposedBlock}
          />

          <ReservationFooter
            selectedCount={scheduler.selectableSelectedDateIds.length}
            proposedBlocksCount={scheduler.proposedBlocks.length}
            hasBlockingConflict={scheduler.hasBlockingConflict}
            canContinue={scheduler.canContinue}
            onCancel={() => router.push("/cubiculos")}
            onContinue={handleContinue}
          />
        </section>

        <aside className="sticky top-5 self-start space-y-5">
          <SelectionModeCalendarCard
            calendarCells={calendarCells}
            activeDayId={scheduler.activeDayId}
            selectionMode={scheduler.selectionMode}
            selectedDateIds={scheduler.selectedDateIds}
            conflictDateIds={scheduler.conflictDateIds}
            onModeChange={scheduler.handleModeChange}
            onSelect={scheduler.handleCalendarSelect}
            onClearSelection={scheduler.clearSelection}
          />
          <EventsAndConflictsCard
            events={activeDayExternalEvents}
            visibleEvents={visibleEvents}
            conflictCount={conflictCount}
            showAllEvents={showAllEvents}
            onToggleShowAllEvents={() => setShowAllEvents((value) => !value)}
          />
        </aside>
      </div>
    </main>
  );
}
