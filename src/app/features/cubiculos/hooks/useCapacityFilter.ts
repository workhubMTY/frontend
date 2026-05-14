"use client";

import { useCallback, useRef, useState } from "react";
import { normalizeCapacityInput } from "../lib/capacity";
import { useCloseOnOutsideClick } from "./useCloseOnOutsideClick";

export function useCapacityFilter() {
  const [isOpen, setIsOpen] = useState(false);

  const [appliedMinCapacity, setAppliedMinCapacity] = useState("");
  const [appliedMaxCapacity, setAppliedMaxCapacity] = useState("");

  const [draftMinCapacity, setDraftMinCapacity] = useState("");
  const [draftMaxCapacity, setDraftMaxCapacity] = useState("");

  const [minCapacityError, setMinCapacityError] = useState(false);
  const [maxCapacityError, setMaxCapacityError] = useState(false);

  const capacityFilterRef = useRef<HTMLDivElement | null>(null);

  const hasActiveCapacityFilter = Boolean(
    appliedMinCapacity || appliedMaxCapacity,
  );

  const closeAndRevert = useCallback(() => {
    setDraftMinCapacity(appliedMinCapacity);
    setDraftMaxCapacity(appliedMaxCapacity);
    setMinCapacityError(false);
    setMaxCapacityError(false);
    setIsOpen(false);
  }, [appliedMinCapacity, appliedMaxCapacity]);

  useCloseOnOutsideClick({
    ref: capacityFilterRef,
    enabled: isOpen,
    onClose: closeAndRevert,
  });

  function openCapacityFilter() {
    setDraftMinCapacity(appliedMinCapacity);
    setDraftMaxCapacity(appliedMaxCapacity);
    setMinCapacityError(false);
    setMaxCapacityError(false);
    setIsOpen((current) => !current);
  }

  function handleCancelCapacityFilter() {
    setAppliedMinCapacity("");
    setAppliedMaxCapacity("");
    setDraftMinCapacity("");
    setDraftMaxCapacity("");
    setMinCapacityError(false);
    setMaxCapacityError(false);
    setIsOpen(false);
  }

  function handleApplyCapacityFilter() {
    const normalizedMin = normalizeCapacityInput(draftMinCapacity);
    const normalizedMax = normalizeCapacityInput(draftMaxCapacity);

    setMinCapacityError(!normalizedMin.isValid);
    setMaxCapacityError(!normalizedMax.isValid);

    if (!normalizedMin.isValid || !normalizedMax.isValid) {
      return;
    }

    const minValue = normalizedMin.value ? Number(normalizedMin.value) : null;
    const maxValue = normalizedMax.value ? Number(normalizedMax.value) : null;

    if (minValue !== null && maxValue !== null && minValue > maxValue) {
      setMinCapacityError(true);
      setMaxCapacityError(true);
      return;
    }

    setAppliedMinCapacity(normalizedMin.value);
    setAppliedMaxCapacity(normalizedMax.value);

    setDraftMinCapacity(normalizedMin.value);
    setDraftMaxCapacity(normalizedMax.value);

    setIsOpen(false);
  }

  function handleMinCapacityBlur() {
    const normalized = normalizeCapacityInput(draftMinCapacity);

    setMinCapacityError(!normalized.isValid);

    if (normalized.isValid) {
      setDraftMinCapacity(normalized.value);
    }
  }

  function handleMaxCapacityBlur() {
    const normalized = normalizeCapacityInput(draftMaxCapacity);

    setMaxCapacityError(!normalized.isValid);

    if (normalized.isValid) {
      setDraftMaxCapacity(normalized.value);
    }
  }

  return {
    capacityFilterRef,

    isOpen,
    hasActiveCapacityFilter,

    appliedMinCapacity,
    appliedMaxCapacity,

    draftMinCapacity,
    draftMaxCapacity,

    minCapacityError,
    maxCapacityError,

    setDraftMinCapacity,
    setDraftMaxCapacity,
    setMinCapacityError,
    setMaxCapacityError,

    openCapacityFilter,
    handleCancelCapacityFilter,
    handleApplyCapacityFilter,
    handleMinCapacityBlur,
    handleMaxCapacityBlur,
    closeAndRevert,
  };
}
