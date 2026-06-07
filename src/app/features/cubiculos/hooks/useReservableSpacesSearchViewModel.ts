"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { useReservableSpacesSearch } from "@/app/features/cubiculos/hooks/useReservableSpacesSearch";
import { useSlotReservations } from "@/app/features/cubiculos/data/hooks";

const SELECTED_SPACE_STORAGE_KEY = "cubiculos:selectedSpace";

function getTodayDateId() {
  return new Date().toISOString().split("T")[0];
}

export function useReservableSpacesSearchViewModel() {
  const router = useRouter();

  const search = useReservableSpacesSearch();

  const selectedSpaceId = search.selectedSpace?.id ?? null;

  const selectedDateIds = useMemo(() => {
    if (search.filters.daysToApply.length > 0) {
      return search.filters.daysToApply;
    }

    return [getTodayDateId()];
  }, [search.filters.daysToApply]);

  const {
    data: selectedSpaceReservations = [],
    isLoading: isLoadingSelectedSpaceReservations,
    isFetching: isFetchingSelectedSpaceReservations,
    error: selectedSpaceReservationsError,
  } = useSlotReservations(selectedSpaceId, selectedDateIds, false);

  const canContinue = Boolean(search.selectedSpace);

  function continueToReservation() {
    if (!search.selectedSpace) return;

    const selectedSpaceDetail = {
      ...search.selectedSpace,
      reservations: selectedSpaceReservations,
    };

    window.sessionStorage.setItem(
      SELECTED_SPACE_STORAGE_KEY,
      JSON.stringify(selectedSpaceDetail),
    );

    router.push("/cubiculos/reservacion");
  }

  return {
    state: {
      filters: search.filters,
      submittedFilters: search.submittedFilters,

      spaces: search.spaces,

      selectedSpace: search.selectedSpace,
      selectedSpaceCode: search.selectedSpaceCode,
      selectedMapId: search.selectedMapId,

      availableMapIds: search.availableMapIds,
      reservedMapIds: search.reservedMapIds,
      soonMapIds: search.soonMapIds,
      disabledMapIds: search.disabledMapIds,

      selectedDateIds,
      selectedSpaceReservations,

      isLoading: search.isLoading,
      isFetching: search.isFetching,
      error: search.error,

      isLoadingSelectedSpaceReservations,
      isFetchingSelectedSpaceReservations,
      selectedSpaceReservationsError,

      canContinue,
    },

    actions: {
      setFilters: search.setFilters,
      setSelectedSpaceCode: search.setSelectedSpaceCode,

      selectMapId: search.handleSelectMapId,
      submitFilters: search.handleSubmitFilters,
      resetFilters: search.handleResetFilters,
      refetchSpaces: search.refetch,

      continueToReservation,
    },
  };
}