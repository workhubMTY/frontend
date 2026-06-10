"use client";

import { useCallback, useRef, useState } from "react";
import { normalizeCapacityInput } from "../../lib/capacity";
import { useCloseOnOutsideClick } from "../useCloseOnOutsideClick";
import type { CapacityFilterValue } from "../../types/searchFilters";

type UseCapacityFilterParams = {
  value: CapacityFilterValue;
  onChange: (value: CapacityFilterValue) => void;
};

export function useCapacityFilter({
  value,
  onChange,
}: UseCapacityFilterParams) {
  const [isOpen, setIsOpen] = useState(false);

  const [draftMinCapacity, setDraftMinCapacity] = useState(value.minCapacity);
  const [draftMaxCapacity, setDraftMaxCapacity] = useState(value.maxCapacity);

  const [minCapacityError, setMinCapacityError] = useState(false);
  const [maxCapacityError, setMaxCapacityError] = useState(false);

  const capacityFilterRef = useRef<HTMLDivElement | null>(null);

  const hasActiveCapacityFilter = Boolean(
    value.minCapacity || value.maxCapacity,
  );

  const closeAndRevert = useCallback(() => {
    setDraftMinCapacity(value.minCapacity);
    setDraftMaxCapacity(value.maxCapacity);
    setMinCapacityError(false);
    setMaxCapacityError(false);
    setIsOpen(false);
  }, [value.minCapacity, value.maxCapacity]);

  useCloseOnOutsideClick({
    ref: capacityFilterRef,
    enabled: isOpen,
    onClose: closeAndRevert,
  });

  function openCapacityFilter() {
    setDraftMinCapacity(value.minCapacity);
    setDraftMaxCapacity(value.maxCapacity);
    setMinCapacityError(false);
    setMaxCapacityError(false);
    setIsOpen((current) => !current);
  }

  function handleCancelCapacityFilter() {
    onChange({
      minCapacity: "",
      maxCapacity: "",
    });

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

    onChange({
      minCapacity: normalizedMin.value,
      maxCapacity: normalizedMax.value,
    });

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

    draftMinCapacity,
    draftMaxCapacity,

    minCapacityError,
    maxCapacityError,

    setDraftMinCapacity,
    setDraftMaxCapacity,
    setMinCapacityError,
    setMaxCapacityError,

    openCapacityFilter,
    closeAndRevert,
    handleCancelCapacityFilter,
    handleApplyCapacityFilter,
    handleMinCapacityBlur,
    handleMaxCapacityBlur,
  };
}
