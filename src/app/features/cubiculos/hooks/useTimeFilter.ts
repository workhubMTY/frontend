"use client";

import { useCallback, useRef, useState } from "react";

import { normalizeTimeInput, timeToMinutes } from "../lib/time";
import { useCloseOnOutsideClick } from "./useCloseOnOutsideClick";

export function useTimeFilter() {
  const [isOpen, setIsOpen] = useState(false);

  const [appliedStartTime, setAppliedStartTime] = useState("");
  const [appliedEndTime, setAppliedEndTime] = useState("");

  const [draftStartTime, setDraftStartTime] = useState("");
  const [draftEndTime, setDraftEndTime] = useState("");

  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);

  const timeFilterRef = useRef<HTMLDivElement | null>(null);

  const hasActiveTimeFilter = Boolean(appliedStartTime || appliedEndTime);

  const closeAndRevert = useCallback(() => {
    setDraftStartTime(appliedStartTime);
    setDraftEndTime(appliedEndTime);
    setStartTimeError(false);
    setEndTimeError(false);
    setIsOpen(false);
  }, [appliedStartTime, appliedEndTime]);

  useCloseOnOutsideClick({
    ref: timeFilterRef,
    enabled: isOpen,
    onClose: closeAndRevert,
  });

  function openTimeFilter() {
    setDraftStartTime(appliedStartTime);
    setDraftEndTime(appliedEndTime);
    setStartTimeError(false);
    setEndTimeError(false);
    setIsOpen((current) => !current);
  }

  function handleCancelTimeFilter() {
    setAppliedStartTime("");
    setAppliedEndTime("");
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

    setAppliedStartTime(normalizedStart.value);
    setAppliedEndTime(normalizedEnd.value);

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

    appliedStartTime,
    appliedEndTime,

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
