"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { useReservableSpacesSearch } from "@/app/features/cubiculos/hooks/filters/useReservableSpacesSearch";
import { useSlotReservations } from "@/app/features/cubiculos/data/hooks";

const SELECTED_SPACE_STORAGE_KEY = "cubiculos:selectedSpace";

function getLocalDateId(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getReservationLookupDateIds(daysToApply: string[]) {
  return daysToApply.length > 0 ? daysToApply : [getLocalDateId()];
}

function getActiveReservationDateId(selectedDateIds: string[]) {
  return selectedDateIds[0] ?? getLocalDateId();
}

function getDateIdFromApiDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function filterReservationsByDate<T extends { start_time: string | Date }>(
  reservations: T[],
  dateId: string,
) {
  return reservations.filter((reservation) => {
    return getDateIdFromApiDate(reservation.start_time) === dateId;
  });
}

export function useReservableSpacesSearchViewModel() {
  const router = useRouter();

  const search = useReservableSpacesSearch();

  const selectedSpaceId = search.selectedSpace?.id ?? null;

  const selectedDateIds = useMemo(
    () => getReservationLookupDateIds(search.filters.daysToApply),
    [search.filters.daysToApply],
  );

  const activeReservationDateId = useMemo(
    () => getActiveReservationDateId(selectedDateIds),
    [selectedDateIds],
  );

  const {
    data: selectedSpaceReservations = [],
    isLoading: isLoadingSelectedSpaceReservations,
    isFetching: isFetchingSelectedSpaceReservations,
    error: selectedSpaceReservationsError,
  } = useSlotReservations(selectedSpaceId, selectedDateIds, false, true);

  const selectedSpaceReservationsForActiveDate = useMemo(
    () =>
      filterReservationsByDate(
        selectedSpaceReservations,
        activeReservationDateId,
      ),
    [selectedSpaceReservations, activeReservationDateId],
  );

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
      activeReservationDateId,

      selectedSpaceReservations,
      selectedSpaceReservationsForActiveDate,

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