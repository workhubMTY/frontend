"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import PageTransition from "@/app/components/PageTransition/PageTransition";

import { Card } from "@/app/features/reservaciones/components/Card";
import { ProposedSchedulesCard } from "@/app/features/reservaciones/components/ProposedSchedulesCard";
import { ReservationFooter } from "@/app/features/reservaciones/components/ReservationFooter";
import { ReservationTimelineCard } from "@/app/features/reservaciones/components/ReservationTimelineCard";

import { ReservationDaysSelectorCard } from "@/app/features/estacionamientos/components/ReservationDaysSelectorCard";
import { AvailabilityIntervalCard } from "@/app/features/estacionamientos/components/AvailabilityIntervalCard";
import { ParkingReservationHeaderCard } from "@/app/features/estacionamientos/components/ParkingReservationHeaderCard";

import {
  apiGetExternalEventsInInterval,
  createApiJson,
  toTimelineEvent,
} from "@/app/features/reservaciones/data/reservationsApi";

import { apiGetSpaceReservationsByDay } from "@/app/features/reservaciones/data/mockApisss";

import {
  createCalendarCells,
  getFirstAvailableDateId,
} from "@/app/features/reservaciones/lib/dates";

import {
  blockOverlapsApiReservation,
  hasOverlappingBlocks,
} from "@/app/features/reservaciones/lib/conflicts";

import { uniqueSortedIds } from "@/app/features/reservaciones/lib/formatting";

import { getParkingAvailability } from "@/app/features/estacionamientos/lib/parkingAvailability";

import type { CalendarSelectionAction } from "@/app/features/reservaciones/types/reservaciones";

import type {
  DayEvent,
  SelectionMode,
  TimeBlock,
  TimelineEvent,
} from "@/app/features/reservaciones/types/reservaciones";
import { ParkingCapacityTimelineCard } from "@/app/features/estacionamientos/components/ParkingCapacityTimelineCard";

const PARKING_CAPACITY = 40;
const BASE_OCCUPIED_SPOTS = 34;
const HIGH_OCCUPATION_THRESHOLD = 37;

export default function ParkingReservationSchedulerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parkingId =
    searchParams.get("parkingId") ?? searchParams.get("spaceId");
  const parkingName =
    searchParams.get("parkingName") ??
    searchParams.get("spaceName") ??
    "Estacionamiento Torre Norte";

  const calendarCells = useMemo(() => createCalendarCells(), []);

  const [selectionMode, setSelectionMode] = useState<SelectionMode>("multiple");

  const [selectedDateIds, setSelectedDateIds] = useState<string[]>([]);

  const [activeDayId, setActiveDayId] = useState(
    getFirstAvailableDateId(calendarCells),
  );

  const [dayBlocks, setDayBlocks] = useState<Record<string, TimeBlock[]>>({});

  const [pendingBlocks, setPendingBlocks] = useState<TimeBlock[]>([]);

  const [hasAppliedCurrentSelection, setHasAppliedCurrentSelection] =
    useState(false);

  const [spaceReservationsForActiveDay, setSpaceReservationsForActiveDay] =
    useState<TimelineEvent[]>([]);

  const [externalEventsForInterval, setExternalEventsForInterval] = useState<
    DayEvent[]
  >([]);

  const [editedSavedDateIds, setEditedSavedDateIds] = useState<string[]>([]);

  const apiJson = useMemo(() => createApiJson(calendarCells), [calendarCells]);

  const modifiedDateIds = useMemo(
    () => uniqueSortedIds(Object.keys(dayBlocks)),
    [dayBlocks],
  );

  function isWeekendDateId(dateId: string) {
    return calendarCells.find((cell) => cell.id === dateId)?.isWeekend ?? false;
  }

  function getAffectedDateIdsForBlock(block: TimeBlock) {
    const selectableDateIds = selectedDateIds.filter(
      (dateId) => !isWeekendDateId(dateId),
    );

    if (selectableDateIds.length === 0) {
      return [];
    }

    if (block.applyToAllSelected) {
      return selectableDateIds;
    }

    if (!selectableDateIds.includes(activeDayId)) {
      return [];
    }

    return [activeDayId];
  }

  const pendingBlocksForActiveDay = useMemo(
    () =>
      pendingBlocks.filter((block) =>
        getAffectedDateIdsForBlock(block).includes(activeDayId),
      ),
    [pendingBlocks, selectedDateIds, activeDayId, calendarCells],
  );

  const affectedDateIdsForPendingBlocks = useMemo(
    () =>
      uniqueSortedIds(
        pendingBlocks.flatMap((block) => getAffectedDateIdsForBlock(block)),
      ),
    [activeDayId, calendarCells, pendingBlocks, selectedDateIds],
  );

  function mergeOrRemoveRange(
    previousDateIds: string[],
    rangeDateIds: string[],
  ) {
    const previousDateIdsSet = new Set(previousDateIds);

    const fullRangeAlreadySelected = rangeDateIds.every((dateId) =>
      previousDateIdsSet.has(dateId),
    );

    if (fullRangeAlreadySelected) {
      return uniqueSortedIds(
        previousDateIds.filter((dateId) => !rangeDateIds.includes(dateId)),
      );
    }

    return uniqueSortedIds([...previousDateIds, ...rangeDateIds]);
  }

  function handleCalendarSelect(action: CalendarSelectionAction) {
    if (action.type === "day") {
      const dayId = action.dayId;

      if (isWeekendDateId(dayId)) return;

      if (selectionMode === "single") {
        setSelectedDateIds([dayId]);
        setActiveDayId(dayId);
        setHasAppliedCurrentSelection(false);
        return;
      }

      if (selectionMode === "repeat") {
        const selectedCell = calendarCells.find((cell) => cell.id === dayId);
        if (!selectedCell) return;

        const repeatedDateIds = calendarCells
          .filter(
            (cell) =>
              !cell.isWeekend &&
              cell.date >= selectedCell.date &&
              cell.date.getDay() === selectedCell.date.getDay(),
          )
          .map((cell) => cell.id);

        setSelectedDateIds(uniqueSortedIds(repeatedDateIds));
        setActiveDayId(dayId);
        setHasAppliedCurrentSelection(false);
        return;
      }

      if (selectionMode === "multiple") {
        if (hasAppliedCurrentSelection) {
          setSelectedDateIds([dayId]);
          setActiveDayId(dayId);
          setHasAppliedCurrentSelection(false);
          return;
        }

        setSelectedDateIds((previousDateIds) => {
          const alreadySelected = previousDateIds.includes(dayId);
          const alreadyActive = activeDayId === dayId;

          if (!alreadySelected) {
            return uniqueSortedIds([...previousDateIds, dayId]);
          }

          if (alreadySelected && !alreadyActive) {
            return previousDateIds;
          }

          return uniqueSortedIds(
            previousDateIds.filter((selectedDayId) => selectedDayId !== dayId),
          );
        });

        setActiveDayId(dayId);
        return;
      }
    }

    if (action.type === "range") {
      if (selectionMode !== "multiple") return;

      const draggedDateIds = uniqueSortedIds(
        action.dateIds.filter((dateId) => !isWeekendDateId(dateId)),
      );

      if (draggedDateIds.length === 0) return;

      setSelectedDateIds((previousDateIds) => {
        if (hasAppliedCurrentSelection) {
          return draggedDateIds;
        }

        return mergeOrRemoveRange(previousDateIds, draggedDateIds);
      });

      setHasAppliedCurrentSelection(false);
      setActiveDayId(draggedDateIds[0] ?? activeDayId);
    }
  }

  const conflictDateIds = useMemo(() => {
    const conflictIds = new Set<string>();

    Object.entries(dayBlocks).forEach(([dateId, blocks]) => {
      const spaceReservationsForDate = apiJson.spaceReservations.filter(
        (reservation) =>
          reservation.dateId === dateId && reservation.location === parkingName,
      );

      const hasInternalConflict = hasOverlappingBlocks(blocks);

      const hasSpaceConflict = blocks.some((block) =>
        spaceReservationsForDate.some((reservation) =>
          blockOverlapsApiReservation(block, reservation),
        ),
      );

      if (hasInternalConflict || hasSpaceConflict) {
        conflictIds.add(dateId);
      }
    });

    pendingBlocks.forEach((block) => {
      getAffectedDateIdsForBlock(block).forEach((dateId) => {
        const hasPendingSpaceConflict = apiJson.spaceReservations.some(
          (reservation) =>
            reservation.dateId === dateId &&
            reservation.location === parkingName &&
            blockOverlapsApiReservation(block, reservation),
        );

        if (hasPendingSpaceConflict) {
          conflictIds.add(dateId);
        }
      });
    });

    return uniqueSortedIds(Array.from(conflictIds));
  }, [
    activeDayId,
    apiJson.spaceReservations,
    calendarCells,
    dayBlocks,
    pendingBlocks,
    selectedDateIds,
    parkingName,
  ]);

  const activeBlocks = dayBlocks[activeDayId] ?? [];

  const activeDayExternalEvents = useMemo(
    () =>
      externalEventsForInterval.filter((event) => event.dateId === activeDayId),
    [activeDayId, externalEventsForInterval],
  );

  const externalTimelineEventsForActiveDay = useMemo(
    () =>
      activeDayExternalEvents.map((event) =>
        toTimelineEvent(event, "external"),
      ),
    [activeDayExternalEvents],
  );

  const selectedSavedBlocksHaveSpaceConflict = selectedDateIds.some(
    (dateId) => {
      if (isWeekendDateId(dateId)) return false;

      const blocksForDate = dayBlocks[dateId] ?? [];

      return blocksForDate.some((block) =>
        apiJson.spaceReservations.some(
          (reservation) =>
            reservation.dateId === dateId &&
            reservation.location === parkingName &&
            blockOverlapsApiReservation(block, reservation),
        ),
      );
    },
  );

  const pendingBlocksHaveSpaceConflict = pendingBlocks.some((block) =>
    getAffectedDateIdsForBlock(block).some((dateId) =>
      apiJson.spaceReservations.some(
        (reservation) =>
          reservation.dateId === dateId &&
          reservation.location === parkingName &&
          blockOverlapsApiReservation(block, reservation),
      ),
    ),
  );

  const hasBlockingSpaceConflict =
    selectedSavedBlocksHaveSpaceConflict || pendingBlocksHaveSpaceConflict;

  const hasPendingChanges = pendingBlocks.length > 0;
  const hasSavedBlockEdits = editedSavedDateIds.length > 0;

  const hasValidPendingTarget =
    hasPendingChanges && affectedDateIdsForPendingBlocks.length > 0;

  const hasSavedBlocksToContinue = Object.values(dayBlocks).some(
    (blocks) => blocks.length > 0,
  );

  const canSaveChanges =
    (hasValidPendingTarget || hasSavedBlockEdits) && !hasBlockingSpaceConflict;

  const canContinue =
    !hasBlockingSpaceConflict &&
    (hasValidPendingTarget || hasSavedBlockEdits || hasSavedBlocksToContinue);

  const availability = useMemo(
    () =>
      getParkingAvailability({
        capacity: PARKING_CAPACITY,
        baseOccupiedSpots: BASE_OCCUPIED_SPOTS,
        highOccupationThreshold: HIGH_OCCUPATION_THRESHOLD,
        activeBlocks,
        pendingBlocks: pendingBlocksForActiveDay,
        spaceReservationsForActiveDay,
      }),
    [activeBlocks, pendingBlocksForActiveDay, spaceReservationsForActiveDay],
  );

  const partialConflictsCount =
    availability.status === "partial" || availability.status === "conflict"
      ? 1
      : 0;

  const dateRangeLabel = useMemo(() => {
    if (selectedDateIds.length === 0) return "Sin días seleccionados";

    if (selectedDateIds.length === 1) {
      return selectedDateIds[0];
    }

    return `${selectedDateIds.length} días seleccionados`;
  }, [selectedDateIds]);

  useEffect(() => {
    let cancelled = false;

    if (!parkingName || !parkingId) return;

    apiGetSpaceReservationsByDay({
      apiJson,
      dateId: activeDayId,
      spaceName: parkingName,
    }).then((events) => {
      if (!cancelled) setSpaceReservationsForActiveDay(events);
    });

    return () => {
      cancelled = true;
    };
  }, [activeDayId, apiJson, parkingId, parkingName]);

  useEffect(() => {
    let cancelled = false;

    const intervalDateIds = calendarCells.map((cell) => cell.id);

    apiGetExternalEventsInInterval({
      apiJson,
      dateIds: intervalDateIds,
    }).then((externalEvents) => {
      if (cancelled) return;
      setExternalEventsForInterval(externalEvents);
    });

    return () => {
      cancelled = true;
    };
  }, [apiJson, calendarCells]);

  function handleModeChange(mode: SelectionMode) {
    setSelectionMode(mode);

    if (mode === "single") {
      const nextDayId = !isWeekendDateId(activeDayId)
        ? activeDayId
        : (selectedDateIds.find((dateId) => !isWeekendDateId(dateId)) ??
          getFirstAvailableDateId(calendarCells));

      setSelectedDateIds([nextDayId]);
      setActiveDayId(nextDayId);
      setHasAppliedCurrentSelection(false);
    }
  }

  function clearSelection() {
    setSelectedDateIds([]);
    setHasAppliedCurrentSelection(false);
  }

  function deleteSavedBlock(dateId: string, blockId: string) {
    setDayBlocks((previousBlocks) => {
      const blocksForDate = previousBlocks[dateId] ?? [];

      return {
        ...previousBlocks,
        [dateId]: blocksForDate.filter((block) => block.id !== blockId),
      };
    });

    setEditedSavedDateIds((previousDateIds) =>
      uniqueSortedIds([...previousDateIds, dateId]),
    );
  }

  function updateSavedBlock(
    dateId: string,
    blockId: string,
    field: "start" | "end",
    value: string,
  ) {
    setDayBlocks((previousBlocks) => {
      const blocksForDate = previousBlocks[dateId] ?? [];

      return {
        ...previousBlocks,
        [dateId]: blocksForDate.map((block) =>
          block.id === blockId
            ? {
                ...block,
                [field]: value,
                conflict: undefined,
              }
            : block,
        ),
      };
    });

    setEditedSavedDateIds((previousDateIds) =>
      uniqueSortedIds([...previousDateIds, dateId]),
    );
  }

  function updatePendingBlock(
    blockId: string,
    field: "start" | "end",
    value: string,
  ) {
    setPendingBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === blockId ? { ...block, [field]: value } : block,
      ),
    );
  }

  function togglePendingBlockScope(blockId: string) {
    setPendingBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === blockId
          ? { ...block, applyToAllSelected: !block.applyToAllSelected }
          : block,
      ),
    );
  }

  function deletePendingBlock(blockId: string) {
    setPendingBlocks((currentBlocks) =>
      currentBlocks.filter((block) => block.id !== blockId),
    );
  }

  function addPendingBlock() {
    const nextNumber = pendingBlocks.length + 1;

    setPendingBlocks((currentBlocks) => [
      ...currentBlocks,
      {
        id: `p-${Date.now()}`,
        label: `Nuevo ${nextNumber}`,
        start: "08:00 PM",
        end: "09:00 PM",
        applyToAllSelected: true,
      },
    ]);
  }

  function applyPendingBlocks() {
    if (!canSaveChanges) return;

    if (pendingBlocks.length > 0) {
      setSelectedDateIds((previousDateIds) =>
        uniqueSortedIds([
          ...previousDateIds,
          ...affectedDateIdsForPendingBlocks,
        ]),
      );

      setDayBlocks((previousBlocks) => {
        const nextDayBlocks = { ...previousBlocks };

        pendingBlocks.forEach((block, blockIndex) => {
          const dateIdsForBlock = getAffectedDateIdsForBlock(block);

          dateIdsForBlock.forEach((dateId) => {
            const currentBlocksForDate = nextDayBlocks[dateId] ?? [];

            nextDayBlocks[dateId] = [
              ...currentBlocksForDate,
              {
                ...block,
                id: `b-${dateId}-${Date.now()}-${blockIndex}`,
                label: `Bloque ${currentBlocksForDate.length + 1}`,
                applyToAllSelected: undefined,
              },
            ];
          });
        });

        return nextDayBlocks;
      });

      setPendingBlocks([]);
    }

    setEditedSavedDateIds([]);
    setHasAppliedCurrentSelection(true);
  }

  function handleContinue() {
    if (!canContinue) return;

    if (pendingBlocks.length > 0) {
      applyPendingBlocks();
    }

    router.push("/estacionamientos/reservacion/confirmar");
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background-page p-4 text-slate-950 sm:p-6 lg:p-8">
        <div className="space-y-5">
          <header className="mb-5 flex items-center justify-between rounded-2xl px-5">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Ajusta tu reservación de estacionamiento
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Revisa disponibilidad, arrastra días y configura múltiples
                  horarios.
                </p>
              </div>
            </div>
          </header>

          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="space-y-5">
              <ParkingCapacityTimelineCard
                capacity={40}
                blocks={[...activeBlocks, ...pendingBlocksForActiveDay]}
                highOccupationRange={{
                  startHour: 8,
                  endHour: 13,
                }}
                conflictRange={{
                  startHour: 10.5,
                  endHour: 12,
                }}
              />

              <ProposedSchedulesCard
                activeDayId={activeDayId}
                activeBlocks={activeBlocks}
                pendingBlocks={pendingBlocksForActiveDay}
                onAddPendingBlock={addPendingBlock}
                onDeletePendingBlock={deletePendingBlock}
                onDeleteSavedBlock={deleteSavedBlock}
                onTogglePendingBlockScope={togglePendingBlockScope}
                onUpdatePendingBlock={updatePendingBlock}
                onUpdateSavedBlock={updateSavedBlock}
              />

              <ReservationFooter
                selectedCount={selectedDateIds.length}
                activeSavedBlocksCount={activeBlocks.length}
                pendingBlocksCount={pendingBlocks.length}
                savedEditsCount={editedSavedDateIds.length}
                hasBlockingSpaceConflict={hasBlockingSpaceConflict}
                canSaveChanges={canSaveChanges}
                canContinue={canContinue}
                onSaveChanges={applyPendingBlocks}
                onCancel={() => {
                  router.push("/estacionamientos");
                }}
                onContinue={handleContinue}
              />
            </div>

            <aside className="sticky top-5 self-start space-y-5">
              <ReservationDaysSelectorCard
                activeDayId={activeDayId}
                selectionMode={selectionMode}
                selectedDateIds={selectedDateIds}
                modifiedDateIds={modifiedDateIds}
                conflictDateIds={conflictDateIds}
                calendarCells={calendarCells}
                onModeChange={handleModeChange}
                onSelect={handleCalendarSelect}
                onClearSelection={clearSelection}
              />

              <AvailabilityIntervalCard
                status={availability.status}
                minimumFreeSpots={availability.minimumFreeSpots}
                maximumOccupiedSpots={availability.maximumOccupiedSpots}
                capacity={availability.capacity}
                saturationRange={availability.saturationRange}
                onViewCapacityDetail={() => {
                  console.log("Ver detalle de capacidad");
                }}
              />
            </aside>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
