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
import { getHourFromTimeLabel } from "@/app/features/estacionamientos/components/Timeline/utils";

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
    calendarCells,
    scheduler,
    parkingBuckets,
    parkingReservationsForActiveDay,
    myParkingReservationsForActiveDay,
    createParkingReservation,
  } = useParkingReservationSchedulerPage({
    parkingId,
  });

  const parkingCapacity = parkingLot?.capacity ?? FALLBACK_PARKING_CAPACITY;

  const highOccupationThreshold = Math.floor(
    parkingCapacity * HIGH_OCCUPATION_THRESHOLD_PERCENTAGE,
  );
  const myReservationConflictRanges = useMemo(
    () =>
      myParkingReservationsForActiveDay.map((reservation) => ({
        startHour: getHourFromTimeLabel(reservation.start),
        endHour: getHourFromTimeLabel(reservation.end),
      })),
    [myParkingReservationsForActiveDay],
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

  async function handleContinue() {
    const schedules = scheduler.createReservationSchedules();

    if (!schedules) return;

    await Promise.all(
      schedules.map((schedule) =>
        createParkingReservation.mutateAsync({
          start_time: new Date(schedule.start_time),
          end_time: new Date(schedule.end_time),
        }),
      ),
    );

    // router.push("/home");
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
            capacity={parkingLot?.capacity ?? FALLBACK_PARKING_CAPACITY}
            blocks={scheduler.proposedBlocksForActiveDay}
            buckets={parkingBuckets}
            conflictRanges={myReservationConflictRanges}
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
            canContinue={
              scheduler.canContinue && !createParkingReservation.isPending
            }
            onCancel={() => router.push("/home")}
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
            onActivateDay={scheduler.setActiveDayId}
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
