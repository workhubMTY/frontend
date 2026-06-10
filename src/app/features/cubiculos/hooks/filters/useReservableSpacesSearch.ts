"use client";

import { useEffect, useMemo, useState } from "react";

import type { SpaceSearchFilters } from "@/app/features/cubiculos/types/searchFilters";
import { useReservableSpaces } from "@/app/features/cubiculos/data/hooks";
import { useDebounce } from "@/app/shared/hooks/useDebounce";
import { OFFICE_FLOORS } from "@/app/features/cubiculos/constants/floors";

const initialFilters: SpaceSearchFilters = {
  floor: OFFICE_FLOORS[0].code,

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

  const debouncedSearch = useDebounce(filters.search, 350);

  const appliedFilters = useMemo<SpaceSearchFilters>(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch],
  );

  const {
    data: spaces = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useReservableSpaces(appliedFilters);

  useEffect(() => {
    setSelectedSpaceCode(undefined);
  }, [filters.floor]);

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

  const selectedFloorCode = filters.floor;

  const selectedFloor = useMemo(() => {
    return (
      OFFICE_FLOORS.find((floor) => floor.code === selectedFloorCode) ??
      OFFICE_FLOORS[0]
    );
  }, [selectedFloorCode]);

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

  function setSelectedFloorCode(floorCode: string) {
    setFilters((current) => ({
      ...current,
      floor: floorCode,
    }));
  }

  function handleSelectMapId(mapId: string) {
    const exists = spaces.some((space) => space.code === mapId);

    if (!exists) return;

    setSelectedSpaceCode(mapId);
  }

  function handleResetFilters() {
    setFilters(initialFilters);
  }

  return {
    filters,
    setFilters,

    submittedFilters: appliedFilters,

    spaces,
    isLoading,
    isFetching,
    error,
    refetch,

    floors: OFFICE_FLOORS,
    selectedFloor,
    selectedFloorCode,
    setSelectedFloorCode,

    selectedSpace,
    selectedSpaceCode,
    selectedMapId,

    availableMapIds,
    reservedMapIds,
    soonMapIds,
    disabledMapIds,

    setSelectedSpaceCode,
    handleSelectMapId,
    handleResetFilters,
  };
}