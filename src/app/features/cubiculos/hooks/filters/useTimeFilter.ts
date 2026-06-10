"use client";

import { useCallback, useRef, useState } from "react";
import { normalizeTimeInput, timeToMinutes } from "../../lib/time";
import { useCloseOnOutsideClick } from "../useCloseOnOutsideClick";

type TimeFilterValue = {
  startTime: string;
  endTime: string;
};

type UseTimeFilterParams = {
  value: TimeFilterValue;
  onChange: (value: TimeFilterValue) => void;
};

export function useTimeFilter({ value, onChange }: UseTimeFilterParams) {
  const [isOpen, setIsOpen] = useState(false);

  const [draftStartTime, setDraftStartTime] = useState(value.startTime);
  const [draftEndTime, setDraftEndTime] = useState(value.endTime);

  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);

  const timeFilterRef = useRef<HTMLDivElement | null>(null);

  const hasActiveTimeFilter = Boolean(value.startTime || value.endTime);

  const closeAndRevert = useCallback(() => {
    setDraftStartTime(value.startTime);
    setDraftEndTime(value.endTime);
    setStartTimeError(false);
    setEndTimeError(false);
    setIsOpen(false);
  }, [value.startTime, value.endTime]);

  useCloseOnOutsideClick({
    ref: timeFilterRef,
    enabled: isOpen,
    onClose: closeAndRevert,
  });

  function openTimeFilter() {
    setDraftStartTime(value.startTime);
    setDraftEndTime(value.endTime);
    setStartTimeError(false);
    setEndTimeError(false);
    setIsOpen((current) => !current);
  }

  function handleCancelTimeFilter() {
    onChange({
      startTime: "",
      endTime: "",
    });

    setDraftStartTime("");
    setDraftEndTime("");
    setStartTimeError(false);
    setEndTimeError(false);
    setIsOpen(false);
  }

  function handleApplyTimeFilter() {
    const normalizedStart = normalizeTimeInput(draftStartTime);
    const normalizedEnd = normalizeTimeInput(draftEndTime);

    setStartTimeError(!normalizedStart.isValid);
    setEndTimeError(!normalizedEnd.isValid);

    if (!normalizedStart.isValid || !normalizedEnd.isValid) {
      return;
    }

    const startMinutes = timeToMinutes(normalizedStart.value);
    const endMinutes = timeToMinutes(normalizedEnd.value);

    if (
      startMinutes !== null &&
      endMinutes !== null &&
      startMinutes >= endMinutes
    ) {
      setStartTimeError(true);
      setEndTimeError(true);
      return;
    }

    onChange({
      startTime: normalizedStart.value,
      endTime: normalizedEnd.value,
    });

    setDraftStartTime(normalizedStart.value);
    setDraftEndTime(normalizedEnd.value);
    setIsOpen(false);
  }

  function handleStartTimeBlur() {
    const normalized = normalizeTimeInput(draftStartTime);

    setStartTimeError(!normalized.isValid);

    if (normalized.isValid) {
      setDraftStartTime(normalized.value);
    }
  }

  function handleEndTimeBlur() {
    const normalized = normalizeTimeInput(draftEndTime);

    setEndTimeError(!normalized.isValid);

    if (normalized.isValid) {
      setDraftEndTime(normalized.value);
    }
  }

  return {
    timeFilterRef,

    isOpen,
    hasActiveTimeFilter,

    draftStartTime,
    draftEndTime,

    startTimeError,
    endTimeError,

    setDraftStartTime,
    setDraftEndTime,
    setStartTimeError,
    setEndTimeError,

    openTimeFilter,
    closeAndRevert,
    handleCancelTimeFilter,
    handleApplyTimeFilter,
    handleStartTimeBlur,
    handleEndTimeBlur,
  };
}
