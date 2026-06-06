"use client";

import { useEffect, useMemo, useState } from "react";
import type { SpaceSearchFilters } from "@/app/features/cubiculos/types/searchFilters";
import { useReservableSpaces } from "@/app/features/cubiculos/data/hooks";

const initialFilters: SpaceSearchFilters = {
  search: "",
  time: {
    startTime: "",
    endTime: "",
  },
  capacity: {
    minCapacity: "",
    maxCapacity: "",
  },
  daysToApply: [],
};

export function useReservableSpacesSearch() {
  const [selectedSpaceCode, setSelectedSpaceCode] = useState<
    string | undefined
  >(undefined);

  const [filters, setFilters] = useState<SpaceSearchFilters>(initialFilters);
  const [submittedFilters, setSubmittedFilters] =
    useState<SpaceSearchFilters>(initialFilters);

  const {
    data: spaces = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useReservableSpaces(submittedFilters);

  useEffect(() => {
    if (spaces.length === 0) {
      setSelectedSpaceCode(undefined);
      return;
    }

    const stillExists = spaces.some((space) => space.code === selectedSpaceCode);

    if (!selectedSpaceCode || !stillExists) {
      setSelectedSpaceCode(spaces[0].code);
    }
  }, [spaces, selectedSpaceCode]);

  const selectedSpace = useMemo(() => {
    return spaces.find((space) => space.code === selectedSpaceCode);
  }, [spaces, selectedSpaceCode]);

  const selectedMapId = selectedSpace?.code ?? null;

  const availableMapIds = useMemo(() => {
    return spaces
      .filter((space) => space.status === "available")
      .map((space) => space.code);
  }, [spaces]);

  const reservedMapIds = useMemo(() => {
    return spaces
      .filter((space) => space.status === "occupied")
      .map((space) => space.code);
  }, [spaces]);

  const soonMapIds = useMemo(() => {
    return spaces
      .filter((space) => space.status === "soon")
      .map((space) => space.code);
  }, [spaces]);

  const disabledMapIds = useMemo(() => {
    return spaces
      .filter((space) => space.status === "blocked" || space.is_blocked)
      .map((space) => space.code);
  }, [spaces]);

  function handleSelectMapId(mapId: string) {
    const exists = spaces.some((space) => space.code === mapId);

    if (!exists) return;

    setSelectedSpaceCode(mapId);
  }

  function handleSubmitFilters(nextFilters: SpaceSearchFilters) {
    setFilters(nextFilters);
    setSubmittedFilters(nextFilters);
  }

  function handleResetFilters() {
    setFilters(initialFilters);
    setSubmittedFilters(initialFilters);
  }

  return {
    filters,
    setFilters,

    submittedFilters,

    spaces,
    isLoading,
    isFetching,
    error,
    refetch,

    selectedSpace,
    selectedSpaceCode,
    selectedMapId,

    availableMapIds,
    reservedMapIds,
    soonMapIds,
    disabledMapIds,

    setSelectedSpaceCode,
    handleSelectMapId,
    handleSubmitFilters,
    handleResetFilters,
  };
}