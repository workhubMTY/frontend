"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ProposedSchedulesCard } from "@/app/features/reservaciones/components/Cards/ProposedSchedulesCard";
import { ReservationFooter } from "@/app/features/reservaciones/components/ReservationFooter";
import { SelectionModeCalendarCard } from "@/app/features/reservaciones/components/Calendar/DaysSelection/SelectionModeCalendarCard";

import { AvailabilityIntervalCard } from "@/app/features/estacionamientos/components/AvailabilityIntervalCard";
import { ParkingCapacityTimelineCard } from "@/app/features/estacionamientos/components/Timeline/ParkingCapacityTimelineCard";

import { getParkingAvailability } from "@/app/features/estacionamientos/lib/parkingAvailability";
import { useParkingReservationSchedulerPage } from "@/app/features/estacionamientos/hooks/useParkingReservationSchedulerPage";

const FALLBACK_PARKING_CAPACITY = 40;
const BASE_OCCUPIED_SPOTS = 0;
const HIGH_OCCUPATION_THRESHOLD_PERCENTAGE = 0.9;

export default function ParkingReservationSchedulerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parkingIdParam =
    searchParams.get("parkingId") ?? searchParams.get("spaceId");

  const parkingId = parkingIdParam ? Number(parkingIdParam) : null;

  const {
    parkingLot,
    parkingName,
    calendarCells,
    scheduler,
    parkingBuckets,
    parkingReservationsForActiveDay,
  } = useParkingReservationSchedulerPage({
    parkingId,
  });

  const parkingCapacity = parkingLot?.capacity ?? FALLBACK_PARKING_CAPACITY;

  const highOccupationThreshold = Math.floor(
    parkingCapacity * HIGH_OCCUPATION_THRESHOLD_PERCENTAGE,
  );

  const parkingAvailability = useMemo(
    () =>
      getParkingAvailability({
        capacity: parkingCapacity,
        baseOccupiedSpots: BASE_OCCUPIED_SPOTS,
        highOccupationThreshold,
        activeBlocks: [],
        pendingBlocks: scheduler.proposedBlocksForActiveDay,
        spaceReservationsForActiveDay: parkingReservationsForActiveDay,
      }),
    [
      parkingCapacity,
      highOccupationThreshold,
      parkingReservationsForActiveDay,
      scheduler.proposedBlocksForActiveDay,
    ],
  );

  function handleContinue() {
    if (!parkingId) return;

    const selectedParking = {
      id: String(parkingId),
      name: parkingName,
    };

    const draft = scheduler.createReservationDraft(selectedParking);

    if (!draft) return;

    router.push("/estacionamientos/reservacion/confirmar");
  }

  return (
    <main className="min-h-screen bg-background-page p-4 text-slate-950 sm:p-6 lg:p-8">
      {/* <header className="mb-5 flex items-center justify-between rounded-2xl px-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 ">
            Ajusta tu reservación · {parkingName}
          </h1>

          <p className="mt-1 text-md text-slate-500">
            Revisa disponibilidad, arrastra días y configura los horarios de tu
            reservación.
          </p>
        </div>
      </header> */}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
        <section className="space-y-5">
          <ParkingCapacityTimelineCard
            capacity={parkingLot?.capacity ?? 0}
            blocks={scheduler.proposedBlocksForActiveDay}
            buckets={parkingBuckets}
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
              // Por ahora no haces nada aquí.
            }}
          />
        </aside>
      </div>
    </main>
  );
}
