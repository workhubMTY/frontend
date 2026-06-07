"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ProposedSchedulesCard } from "@/app/features/reservaciones/crear/components/Cards/ProposedSchedulesCard";
import { ReservationFooter } from "@/app/features/reservaciones/crear/components/ReservationFooter";
import { SelectionModeCalendarCard } from "@/app/features/reservaciones/crear/components/Calendar/DaysSelection/SelectionModeCalendarCard";

import { AvailabilityIntervalCard } from "@/app/features/estacionamientos/components/Cards/AvailabilityIntervalCard";
import { ParkingCapacityTimelineCard } from "@/app/features/estacionamientos/components/Timeline/ParkingCapacityTimelineCard";

import { getParkingAvailability } from "@/app/features/estacionamientos/lib/parkingAvailability";
import { useParkingReservationSchedulerPage } from "@/app/features/estacionamientos/hooks/useParkingReservationSchedulerPage";
import { getHourFromTimeLabel } from "@/app/features/estacionamientos/components/Timeline/utils";

import type { TimeBlock } from "@/app/features/reservaciones/crear/types/reservaciones";
import type { CreateParkingReservation } from "@/app/features/estacionamientos/data/types";
import { ParkingReservationConfirmModal } from "@/app/features/estacionamientos/components/ParkingReservationsConfirmModals";

const FALLBACK_PARKING_CAPACITY = 40;
const BASE_OCCUPIED_SPOTS = 0;
const HIGH_OCCUPATION_THRESHOLD_PERCENTAGE = 0.9;

function buildLocalDateTime(dateId: string, time: string) {
  return new Date(`${dateId}T${time}:00`);
}

function buildParkingReservationPayloads({
  selectedDateIds,
  blocks,
}: {
  selectedDateIds: string[];
  blocks: TimeBlock[];
}): CreateParkingReservation[] {
  return selectedDateIds.flatMap((dateId) =>
    blocks.map((block) => ({
      start_time: buildLocalDateTime(dateId, block.start),
      end_time: buildLocalDateTime(dateId, block.end),
    })),
  );
}

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);

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
  const handleOpenConfirmModal = () => {
    if (scheduler.hasBlockingConflict) return;
    if (scheduler.selectedDateIds.length === 0) return;
    if (scheduler.proposedBlocks.length === 0) return;

    setIsConfirmModalOpen(true);
  };
  const handleConfirmParkingReservation = async () => {
    if (scheduler.hasBlockingConflict) return;

    const payloads = buildParkingReservationPayloads({
      selectedDateIds: scheduler.selectedDateIds,
      blocks: scheduler.proposedBlocks,
    });

    if (payloads.length === 0) return;

    try {
      setIsSubmittingReservation(true);

      await Promise.all(
        payloads.map((payload) =>
          createParkingReservation.mutateAsync(payload),
        ),
      );

      setIsConfirmModalOpen(false);
    } finally {
      setIsSubmittingReservation(false);
      router.push("/home");
    }
  };

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
            onContinue={handleOpenConfirmModal}
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
            }}
          />
        </aside>
      </div>
      <ParkingReservationConfirmModal
        open={isConfirmModalOpen}
        selectedDateIds={scheduler.selectedDateIds}
        blocks={scheduler.proposedBlocks}
        hasConflict={scheduler.hasBlockingConflict}
        isSubmitting={isSubmittingReservation}
        onClose={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={handleConfirmParkingReservation}
      />
    </main>
  );
}
