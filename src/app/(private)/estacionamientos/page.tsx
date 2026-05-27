"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ProposedSchedulesCard } from "@/app/features/reservaciones/components/Cards/ProposedSchedulesCard";
import { ReservationFooter } from "@/app/features/reservaciones/components/ReservationFooter";
import { SelectionModeCalendarCard } from "@/app/features/reservaciones/components/Calendar/DaysSelection/SelectionModeCalendarCard";

import { AvailabilityIntervalCard } from "@/app/features/estacionamientos/components/AvailabilityIntervalCard";
import { ParkingCapacityTimelineCard } from "@/app/features/estacionamientos/components/ParkingCapacityTimelineCard";

import {
  createApiJson,
  toTimelineEvent,
} from "@/app/features/reservaciones/data/reservationsApi";

import { createCalendarCells } from "@/app/features/reservaciones/lib/dates";

import { useReservationQueries } from "@/app/features/reservaciones/hooks/useReservationQueries";
import { useReservationScheduler } from "@/app/features/reservaciones/hooks/useReservationScheduler";

import { getParkingAvailability } from "@/app/features/estacionamientos/lib/parkingAvailability";

import type { TimelineEvent } from "@/app/features/reservaciones/types/reservaciones";

const PARKING_CAPACITY = 40;
const BASE_OCCUPIED_SPOTS = 34;
const HIGH_OCCUPATION_THRESHOLD = 37;

export default function ParkingReservationSchedulerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showAllEvents, setShowAllEvents] = useState(false);

  const parkingId =
    searchParams.get("parkingId") ?? searchParams.get("spaceId");

  const parkingName =
    searchParams.get("parkingName") ??
    searchParams.get("spaceName") ??
    "Estacionamiento";

  const calendarCells = useMemo(() => createCalendarCells(), []);

  const apiJson = useMemo(() => createApiJson(calendarCells), [calendarCells]);

  const spaceReservationsByDate = useMemo(() => {
    if (!parkingName) return {};

    return apiJson.spaceReservations
      .filter((reservation) => reservation.location === parkingName)
      .reduce<Record<string, TimelineEvent[]>>(
        (reservationsByDate, reservation) => {
          const dateId = reservation.dateId;

          if (!reservationsByDate[dateId]) {
            reservationsByDate[dateId] = [];
          }

          reservationsByDate[dateId].push(
            toTimelineEvent(reservation, "reserved"),
          );

          return reservationsByDate;
        },
        {},
      );
  }, [apiJson.spaceReservations, parkingName]);

  const scheduler = useReservationScheduler({
    calendarCells,
    spaceReservationsByDate,
  });

  const { spaceReservationsForActiveDay, externalEventsForInterval } =
    useReservationQueries({
      apiJson,
      calendarCells,
      activeDayId: scheduler.activeDayId,
      spaceName: parkingName,
      enabled: Boolean(parkingId || parkingName),
    });

  const activeDayExternalEvents = useMemo(
    () =>
      externalEventsForInterval.filter(
        (event) => event.dateId === scheduler.activeDayId,
      ),
    [externalEventsForInterval, scheduler.activeDayId],
  );

  const conflictCount = useMemo(
    () =>
      activeDayExternalEvents.filter((event) => event.status !== "normal")
        .length,
    [activeDayExternalEvents],
  );

  const visibleEvents = useMemo(() => {
    if (showAllEvents) return activeDayExternalEvents;

    return activeDayExternalEvents
      .filter((event) => event.status !== "normal")
      .slice(0, 2);
  }, [activeDayExternalEvents, showAllEvents]);

  const parkingAvailability = useMemo(
    () =>
      getParkingAvailability({
        capacity: PARKING_CAPACITY,
        baseOccupiedSpots: BASE_OCCUPIED_SPOTS,
        highOccupationThreshold: HIGH_OCCUPATION_THRESHOLD,
        activeBlocks: [],
        pendingBlocks: scheduler.proposedBlocksForActiveDay,
        spaceReservationsForActiveDay,
      }),
    [spaceReservationsForActiveDay, scheduler.proposedBlocksForActiveDay],
  );

  function handleContinue() {
    const selectedParking = {
      id: parkingId ?? "parking-default",
      name: parkingName,
    };

    const draft = scheduler.createReservationDraft(selectedParking);

    if (!draft) return;

    router.push("/estacionamientos/reservacion/confirmar");
  }

  return (
    <main className="min-h-screen bg-background-page p-4 text-slate-950 sm:p-6 lg:p-8">
      <header className="mb-5 flex items-center justify-between rounded-2xl px-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Ajusta tu reservación · {parkingName}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Revisa disponibilidad, arrastra días y configura los horarios de tu
            reservación.
          </p>
        </div>
      </header>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="space-y-5">
          <ParkingCapacityTimelineCard
            capacity={PARKING_CAPACITY}
            blocks={scheduler.proposedBlocksForActiveDay}
          />

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
            onCancel={() => router.push("/estacionamientos")}
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
          <AvailabilityIntervalCard
            {...parkingAvailability}
            onViewCapacityDetail={() => {
              // Aquí podrías abrir un modal o redirigir a una página con más detalles de la disponibilidad
            }}
          />
        </aside>
      </div>
    </main>
  );
}
