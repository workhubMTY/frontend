"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchReservableSpaces,
  reservableSpaces,
} from "@/app/features/cubiculos/data/mock/reservableSpaces";
import type { SpaceSearchFilters } from "@/app/features/cubiculos/types/searchFilters";
import { ReservableSpace } from "../types/reservableSpaces";
import { officeSlotsApi } from "../data/api";

function parseTimeInput(input: string): string | null {
  const match = input.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return null;

  let [_, hStr, mStr, ampm] = match;
  let hours = parseInt(hStr, 10);
  const minutes = mStr ? parseInt(mStr, 10) : 0;

  if (ampm === "pm" && hours < 12) hours += 12;
  if (ampm === "am" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function useReservableSpacesSearch() {
  const [selectedSpaceCode, setSelectedSpaceCode] = useState<
    string | undefined
  >(undefined);

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

  const [spaces, setSpaces] = useState<ReservableSpace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void handleSubmitFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  

  /**
   * OJO:
   * occupied !== disabled
   *
   * disabled debe usarse para mantenimiento, fuera de servicio,
   * bloqueado por administración, etc.
   *
   * Como tu schema actual no tiene "maintenance" ni "blocked",
   * por ahora no bloqueamos ningún espacio.
   */
  const disabledMapIds = useMemo(() => {
    return [];
  }, []);

  function handleSelectMapId(mapId: string) {
    const exists = spaces.some((space) => space.code === mapId);

    if (!exists) {
      return;
    }

    setSelectedSpaceCode(mapId);
  }
async function handleSubmitFilters(nextFilters: SpaceSearchFilters) {
  const { time, ...baseFilters } = nextFilters;

  const parsedStartTime = parseTimeInput(time.startTime);
  const parsedEndTime = parseTimeInput(time.endTime);

  const parsedFilters = {
    ...baseFilters,
    ...(time.startTime && {
      start_time: parsedStartTime ?? time.startTime,
    }),
    ...(time.endTime && {
      end_time: parsedEndTime ?? time.endTime,
    }),
  };

  console.log("Submitting filters:", parsedFilters);
  setIsLoading(true);

 
    try {
      const result = await officeSlotsApi.getAvailableSlots(parsedFilters);

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
    soonMapIds,
    disabledMapIds,

    setSelectedSpaceCode,
    handleSelectMapId,
    handleSubmitFilters,
  };
}
