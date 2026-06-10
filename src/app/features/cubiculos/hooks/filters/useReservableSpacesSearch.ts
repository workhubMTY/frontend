"use client";

import { useEffect, useMemo, useState } from "react";

import type { SpaceSearchFilters } from "@/app/features/cubiculos/types/searchFilters";
import { useReservableSpaces } from "@/app/features/cubiculos/data/hooks";
import { useDebounce } from "@/app/shared/hooks/useDebounce";

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

  /**
   * Este estado ahora representa los filtros aplicados.
   *
   * PeriodFilter, TimeFilter y CapacityFilter deberían tener su propio draft
   * interno y llamar setFilters solo cuando el usuario presione "Aplicar".
   */
  const [filters, setFilters] = useState<SpaceSearchFilters>(initialFilters);

  /**
   * Solo debounced para search.
   *
   * Así puedes escribir sin disparar una consulta en cada tecla,
   * pero mantienes React Query como fuente de verdad para la llamada.
   */
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

  function handleResetFilters() {
    setFilters(initialFilters);
  }

  return {
    filters,
    setFilters,

    /**
     * Lo puedes dejar temporalmente si tu ViewModel todavía espera
     * submittedFilters. Pero conceptualmente ya no existe un submit global.
     */
    submittedFilters: appliedFilters,

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
    handleResetFilters,
  };
}