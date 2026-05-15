"use client";

import { useMemo, useState } from "react";
import {
  fetchReservableSpaces,
  reservableSpaces,
} from "@/app/features/cubiculos/data/reservableSpaces";
import type { SpaceSearchFilters } from "@/app/features/cubiculos/types/searchFilters";

export function useReservableSpacesSearch() {
  const [selectedSpaceCode, setSelectedSpaceCode] = useState<
    string | undefined
  >("MZ001");

  const [filters, setFilters] = useState<SpaceSearchFilters>({
    search: "",
    time: {
      startTime: "",
      endTime: "",
    },
    capacity: {
      minCapacity: "",
      maxCapacity: "",
    },
    period: {
      dateIds: [],
    },
  });

  const [spaces, setSpaces] = useState(reservableSpaces);
  const [isLoading, setIsLoading] = useState(false);

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

  const disabledMapIds = useMemo(() => {
    return spaces
      .filter((space) => space.status === "occupied")
      .map((space) => space.code);
  }, [spaces]);

  function handleSelectMapId(mapId: string) {
    const spaceExists = spaces.some((space) => space.code === mapId);

    if (!spaceExists) {
      return;
    }

    setSelectedSpaceCode(mapId);
  }

  async function handleSubmitFilters(nextFilters: SpaceSearchFilters) {
    setIsLoading(true);

    try {
      const result = await fetchReservableSpaces(nextFilters);

      setSpaces(result);

      const stillExists = result.some(
        (space) => space.code === selectedSpaceCode,
      );

      if (!stillExists) {
        setSelectedSpaceCode(result[0]?.code);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    filters,
    setFilters,

    spaces,
    isLoading,

    selectedSpace,
    selectedSpaceCode,
    selectedMapId,

    availableMapIds,
    reservedMapIds,
    disabledMapIds,

    setSelectedSpaceCode,
    handleSelectMapId,
    handleSubmitFilters,
  };
}
