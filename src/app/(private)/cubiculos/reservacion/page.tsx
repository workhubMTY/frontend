"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { MonthCalendar } from "@/app/features/reservaciones/components/Calendar/MonthCalendar";
import { Card } from "@/app/features/reservaciones/components/Card";
import { EventsAndConflictsCard } from "@/app/features/reservaciones/components/EventsAndConflictCard";
import { ProposedSchedulesCard } from "@/app/features/reservaciones/components/ProposedSchedulesCard";
import { ReservationFooter } from "@/app/features/reservaciones/components/ReservationFooter";
import { ReservationTimelineCard } from "@/app/features/reservaciones/components/ReservationTimelineCard";
import PageTransition from "@/app/shared/components/PageTransition/PageTransition";

import {
  createApiJson,
  toTimelineEvent,
} from "@/app/features/reservaciones/data/reservationsApi";

import { createCalendarCells } from "@/app/features/reservaciones/lib/dates";
import { cn } from "@/app/features/reservaciones/lib/cn";

import { useSelectedSpace } from "@/app/features/reservaciones/hooks/useSelectedSpace";
import { useReservationQueries } from "@/app/features/reservaciones/hooks/useReservationQueries";
import { useReservationScheduler } from "@/app/features/reservaciones/hooks/useReservationScheduler";
import { TimelineEvent } from "@/app/features/reservaciones/types/reservaciones";

export default function ReservationSchedulerPage() {
  const router = useRouter();

  const { selectedSpace, spaceId, spaceName } = useSelectedSpace();

  const calendarCells = useMemo(() => createCalendarCells(), []);
  const apiJson = useMemo(() => createApiJson(calendarCells), [calendarCells]);
  const spaceReservationsByDate = useMemo(() => {
    if (!spaceName) return {};

    return apiJson.spaceReservations
      .filter((reservation) => reservation.location === spaceName)
      .reduce<Record<string, TimelineEvent[]>>((acc, reservation) => {
        const dateId = reservation.dateId;

        if (!acc[dateId]) {
          acc[dateId] = [];
        }

        acc[dateId].push(toTimelineEvent(reservation, "reserved"));

        return acc;
      }, {});
  }, [apiJson.spaceReservations, spaceName]);

  const scheduler = useReservationScheduler({
    calendarCells,
    spaceReservationsByDate,
  });
  const { spaceReservationsForActiveDay, externalEventsForInterval } =
    useReservationQueries({
      apiJson,
      calendarCells,
      activeDayId: scheduler.activeDayId,
      spaceName,
      enabled: Boolean(spaceId),
    });

  const [showAllEvents, setShowAllEvents] = useState(false);

  const activeDayExternalEvents = useMemo(
    () =>
      externalEventsForInterval.filter(
        (event) => event.dateId === scheduler.activeDayId,
      ),
    [scheduler.activeDayId, externalEventsForInterval],
  );

  const externalTimelineEventsForActiveDay = useMemo(
    () =>
      activeDayExternalEvents.map((event) =>
        toTimelineEvent(event, "external"),
      ),
    [activeDayExternalEvents],
  );

  const conflictCount = activeDayExternalEvents.filter(
    (event) => event.status !== "normal",
  ).length;

  const visibleEvents = showAllEvents
    ? activeDayExternalEvents
    : activeDayExternalEvents
        .filter((event) => event.status !== "normal")
        .slice(0, 2);

  function handleContinue() {
    if (!selectedSpace) return;

    const draft = scheduler.createReservationDraft(selectedSpace);

    if (!draft) return;

    router.push("/cubiculos/reservacion/confirmar");
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background-page p-4 text-slate-950 sm:p-6 lg:p-8">
        <header className="mb-5 flex items-center justify-between rounded-2xl px-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Ajusta tu reservación · {spaceName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Revisa disponibilidad, arrastra días y configura múltiples
              horarios.
            </p>
          </div>
        </header>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-5">
            <Card className="p-5">
              <ReservationTimelineCard
                activeDayId={scheduler.activeDayId}
                activeBlocks={scheduler.activeBlocks}
                pendingBlocks={scheduler.pendingBlocksForActiveDay}
                spaceReservationsForActiveDay={spaceReservationsForActiveDay}
                externalTimelineEventsForActiveDay={
                  externalTimelineEventsForActiveDay
                }
              />
            </Card>

            <ProposedSchedulesCard
              activeDayId={scheduler.activeDayId}
              activeBlocks={scheduler.activeBlocks}
              pendingBlocks={scheduler.pendingBlocksForActiveDay}
              onAddPendingBlock={scheduler.addPendingBlock}
              onDeletePendingBlock={scheduler.deletePendingBlock}
              onDeleteSavedBlock={scheduler.deleteSavedBlock}
              onTogglePendingBlockScope={scheduler.togglePendingBlockScope}
              onUpdatePendingBlock={scheduler.updatePendingBlock}
              onUpdateSavedBlock={scheduler.updateSavedBlock}
            />

            <ReservationFooter
              selectedCount={scheduler.selectedDateIds.length}
              activeSavedBlocksCount={scheduler.activeBlocks.length}
              pendingBlocksCount={scheduler.pendingBlocks.length}
              savedEditsCount={scheduler.editedSavedDateIds.length}
              hasBlockingSpaceConflict={scheduler.hasBlockingSpaceConflict}
              canSaveChanges={scheduler.canSaveChanges}
              canContinue={scheduler.canContinue}
              onSaveChanges={scheduler.applyPendingBlocks}
              onCancel={() => router.push("/cubiculos")}
              onContinue={handleContinue}
            />
          </div>

          <aside className="sticky top-5 self-start space-y-5">
            <Card className="p-5">
              <div className="mb-4 grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => scheduler.handleModeChange("single")}
                  className={cn(
                    "rounded-lg px-3 py-2 transition",
                    scheduler.selectionMode === "single"
                      ? "bg-violet-700 text-white shadow-sm"
                      : "hover:bg-white",
                  )}
                >
                  Un día
                </button>

                <button
                  type="button"
                  onClick={() => scheduler.handleModeChange("multiple")}
                  className={cn(
                    "rounded-lg px-3 py-2 transition",
                    scheduler.selectionMode === "multiple"
                      ? "bg-violet-700 text-white shadow-sm"
                      : "hover:bg-white",
                  )}
                >
                  Varios días
                </button>

                <button
                  type="button"
                  onClick={() => scheduler.handleModeChange("repeat")}
                  className={cn(
                    "rounded-lg px-3 py-2 transition",
                    scheduler.selectionMode === "repeat"
                      ? "bg-violet-700 text-white shadow-sm"
                      : "hover:bg-white",
                  )}
                >
                  Repetir
                </button>
              </div>

              <MonthCalendar
                activeDayId={scheduler.activeDayId}
                selectionMode={scheduler.selectionMode}
                selectedDateIds={scheduler.selectedDateIds}
                modifiedDateIds={scheduler.modifiedDateIds}
                conflictDateIds={scheduler.conflictDateIds}
                calendarCells={calendarCells}
                onSelect={scheduler.handleCalendarSelect}
              />

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={scheduler.clearSelection}
                  disabled={scheduler.selectedDateIds.length === 0}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                  Limpiar selección
                </button>
              </div>

              <div className="border-slate-200 pt-4 text-sm">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full border border-violet-200 bg-violet-50" />
                    Seleccionado
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-violet-600" />
                    Con horarios
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-red-500 ring-2 ring-red-100" />
                    Empalme
                  </span>
                </div>
              </div>
            </Card>

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
    </PageTransition>
  );
}
