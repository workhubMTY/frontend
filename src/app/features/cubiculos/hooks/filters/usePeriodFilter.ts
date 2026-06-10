"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import {
  createCalendarCells,
  getFirstAvailableDateId,
} from "@/app/features/reservaciones/crear/lib/dates";
import { uniqueSortedIds } from "@/app/features/reservaciones/crear/lib/formatting";
import type {
  CalendarSelectionAction,
  SelectionMode,
} from "@/app/features/reservaciones/crear/types/reservaciones";

import { useCloseOnOutsideClick } from "../useCloseOnOutsideClick";
import type { PeriodFilterValue } from "../../types/searchFilters";

type UsePeriodFilterParams = {
  value: PeriodFilterValue;
  onChange: (value: PeriodFilterValue) => void;
};

export function usePeriodFilter({ value, onChange }: UsePeriodFilterParams) {
  const [isOpen, setIsOpen] = useState(false);

  const periodCalendarCells = useMemo(() => createCalendarCells(), []);

  const [periodSelectionMode, setPeriodSelectionMode] =
    useState<SelectionMode>("multiple");

  const [draftPeriodDateIds, setDraftPeriodDateIds] = useState<string[]>(value);

  const [periodActiveDayId, setPeriodActiveDayId] = useState(() =>
    getFirstAvailableDateId(periodCalendarCells),
  );

  const [hasAppliedPeriodSelection, setHasAppliedPeriodSelection] =
    useState(false);

  const periodFilterRef = useRef<HTMLDivElement | null>(null);

  const hasActivePeriodFilter = value.length > 0;

  function isWeekendDateId(dateId: string) {
    return (
      periodCalendarCells.find((cell) => cell.id === dateId)?.isWeekend ?? false
    );
  }

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

  const closeAndRevert = useCallback(() => {
    setDraftPeriodDateIds(value);
    setIsOpen(false);
  }, [value]);

  useCloseOnOutsideClick({
    ref: periodFilterRef,
    enabled: isOpen,
    onClose: closeAndRevert,
  });

  function openPeriodFilter() {
    setDraftPeriodDateIds(value);
    setIsOpen((current) => !current);
  }

  function handleCancelPeriodFilter() {
    onChange([]);

    setDraftPeriodDateIds([]);
    setHasAppliedPeriodSelection(false);
    setIsOpen(false);
  }

  function handleApplyPeriodFilter() {
    onChange(draftPeriodDateIds);

    setHasAppliedPeriodSelection(true);
    setIsOpen(false);
  }

  function handleClearDraftPeriod() {
    setDraftPeriodDateIds([]);
    setHasAppliedPeriodSelection(false);
  }

  function handlePeriodModeChange(mode: SelectionMode) {
    setPeriodSelectionMode(mode);

    if (mode === "single") {
      const nextDayId = !isWeekendDateId(periodActiveDayId)
        ? periodActiveDayId
        : (draftPeriodDateIds.find((dateId) => !isWeekendDateId(dateId)) ??
          getFirstAvailableDateId(periodCalendarCells));

      setDraftPeriodDateIds([nextDayId]);
      setPeriodActiveDayId(nextDayId);
      setHasAppliedPeriodSelection(false);
    }
  }

  function handlePeriodCalendarSelect(action: CalendarSelectionAction) {
    if (action.type === "day") {
      const dayId = action.dayId;

      if (isWeekendDateId(dayId)) return;

      if (periodSelectionMode === "single") {
        setDraftPeriodDateIds([dayId]);
        setPeriodActiveDayId(dayId);
        setHasAppliedPeriodSelection(false);
        return;
      }

      if (periodSelectionMode === "repeat") {
        const selectedCell = periodCalendarCells.find(
          (cell) => cell.id === dayId,
        );

        if (!selectedCell) return;

        const repeatedDateIds = periodCalendarCells
          .filter(
            (cell) =>
              !cell.isWeekend &&
              cell.date >= selectedCell.date &&
              cell.date.getDay() === selectedCell.date.getDay(),
          )
          .map((cell) => cell.id);

        setDraftPeriodDateIds(uniqueSortedIds(repeatedDateIds));
        setPeriodActiveDayId(dayId);
        setHasAppliedPeriodSelection(false);
        return;
      }

      if (periodSelectionMode === "multiple") {
        if (hasAppliedPeriodSelection) {
          setDraftPeriodDateIds([dayId]);
          setPeriodActiveDayId(dayId);
          setHasAppliedPeriodSelection(false);
          return;
        }

        setDraftPeriodDateIds((previousDateIds) => {
          const alreadySelected = previousDateIds.includes(dayId);

          if (alreadySelected) {
            return uniqueSortedIds(
              previousDateIds.filter(
                (selectedDayId) => selectedDayId !== dayId,
              ),
            );
          }

          return uniqueSortedIds([...previousDateIds, dayId]);
        });

        setPeriodActiveDayId(dayId);
        return;
      }
    }

    if (action.type === "range") {
      if (periodSelectionMode !== "multiple") return;

      const draggedDateIds = uniqueSortedIds(
        action.dateIds.filter((dateId) => !isWeekendDateId(dateId)),
      );

      if (draggedDateIds.length === 0) return;

      setDraftPeriodDateIds((previousDateIds) => {
        if (hasAppliedPeriodSelection) {
          return draggedDateIds;
        }

        return mergeOrRemoveRange(previousDateIds, draggedDateIds);
      });

      setPeriodActiveDayId(draggedDateIds[0] ?? periodActiveDayId);
      setHasAppliedPeriodSelection(false);
    }
  }

  return {
    periodFilterRef,

    isOpen,
    hasActivePeriodFilter,

    periodCalendarCells,
    periodSelectionMode,
    draftPeriodDateIds,
    periodActiveDayId,

    openPeriodFilter,
    closeAndRevert,
    handleCancelPeriodFilter,
    handleApplyPeriodFilter,
    handleClearDraftPeriod,
    handlePeriodModeChange,
    handlePeriodCalendarSelect,
  };
}