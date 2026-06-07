"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { officeSlotsApi } from "@/app/features/cubiculos/data/api";

import {
  filterPeopleOptions,
  filterWorkGroupOptions,
  mapDraftToSessions,
  mapGuestToPersonOption,
  mapPersonToInvitedGuest,
  mapUserToPersonOption,
  mapWorkGroupToInvitedGuest,
  mapWorkGroupToOption,
  splitInvitedGuestsForReservation,
} from "../lib/confirmationMappers";

import type {
  InvitedGuest,
  PersonOption,
  ReservationDraft,
  WorkGroupOption,
} from "../types/confirmation";

import { useClickOutside } from "./useClickOutside";

type UseConfirmReservationViewModelParams = {
  isOpen: boolean;
  reservationDraft: ReservationDraft | null;
  onClose: () => void;
  onCompleted: () => void;
};

export function useConfirmReservationViewModel({
  isOpen,
  reservationDraft,
  onClose,
  onCompleted,
}: UseConfirmReservationViewModelParams) {
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const [people, setPeople] = useState<PersonOption[]>([]);
  const [workGroups, setWorkGroups] = useState<WorkGroupOption[]>([]);
  const [invitedGuests, setInvitedGuests] = useState<InvitedGuest[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [shouldCreateTeam, setShouldCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState("");

  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useClickOutside(
    searchContainerRef,
    () => setIsDropdownOpen(false),
    isDropdownOpen,
  );

  const sessions = useMemo(
    () => mapDraftToSessions(reservationDraft),
    [reservationDraft],
  );

  const filteredPeople = useMemo(
    () => filterPeopleOptions(people, searchTerm),
    [people, searchTerm],
  );

  const filteredWorkGroups = useMemo(
    () => filterWorkGroupOptions(workGroups, searchTerm),
    [workGroups, searchTerm],
  );

  const hasInvitedGuests = invitedGuests.length > 0;

  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;

    async function loadOptions() {
      setIsLoadingOptions(true);
      setLoadError("");

      try {
        const [users, guests, groups] = await Promise.all([
          officeSlotsApi.getUsers(),
          officeSlotsApi.getGuests(),
          officeSlotsApi.getWorkGroups(),
        ]);

        if (ignore) return;

        setPeople([
          ...users.map(mapUserToPersonOption),
          ...guests.map(mapGuestToPersonOption),
        ]);

        setWorkGroups(groups.map(mapWorkGroupToOption));
      } catch {
        if (!ignore) {
          setLoadError("No se pudieron cargar los invitados disponibles.");
        }
      } finally {
        if (!ignore) {
          setIsLoadingOptions(false);
        }
      }
    }

    void loadOptions();

    return () => {
      ignore = true;
    };
  }, [isOpen]);

  const resetModalState = useCallback(() => {
    setSearchTerm("");
    setIsDropdownOpen(false);
    setShouldCreateTeam(false);
    setTeamName("");
    setTeamNameError("");
    setSubmitError("");
  }, []);

  const closeModal = useCallback(() => {
    resetModalState();
    onClose();
  }, [onClose, resetModalState]);

  const addPerson = useCallback((person: PersonOption) => {
    setInvitedGuests((currentGuests) => {
      const alreadyAdded = currentGuests.some(
        (guest) => guest.id === person.id || guest.email === person.email,
      );

      if (alreadyAdded) return currentGuests;

      return [...currentGuests, mapPersonToInvitedGuest(person)];
    });

    setSearchTerm("");
    setIsDropdownOpen(false);
  }, []);

  const addWorkGroup = useCallback((workGroup: WorkGroupOption) => {
    setInvitedGuests((currentGuests) => {
      const guestId = `equipo-${workGroup.id}`;
      const alreadyAdded = currentGuests.some((guest) => guest.id === guestId);

      if (alreadyAdded) return currentGuests;

      return [...currentGuests, mapWorkGroupToInvitedGuest(workGroup)];
    });

    setSearchTerm("");
    setIsDropdownOpen(false);
  }, []);

  const removeInvitedGuest = useCallback((guestId: string) => {
    setInvitedGuests((currentGuests) =>
      currentGuests.filter((guest) => guest.id !== guestId),
    );
  }, []);

  const updateTeamName = useCallback((value: string) => {
    setTeamName(value);
    setTeamNameError("");
  }, []);

  const toggleShouldCreateTeam = useCallback(() => {
    setShouldCreateTeam((currentValue) => !currentValue);
    setTeamNameError("");
  }, []);

  const submitReservation = useCallback(async () => {
    if (!reservationDraft) {
      setSubmitError("No hay una reservación para confirmar.");
      return;
    }

    if (shouldCreateTeam && teamName.trim() === "") {
      setTeamNameError("Escribe un nombre para el equipo.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { userIds, guestIds, workGroupIds } =
        splitInvitedGuestsForReservation(invitedGuests);

      await officeSlotsApi.createReservationBatch({
        reservableId: reservationDraft.reservableId,
        description: "",
        schedules: reservationDraft.schedules,
        userIds,
        guestIds,
        workGroupIds,
        canOverlap: false,
      });

      resetModalState();
      onCompleted();
    } catch {
      setSubmitError("No se pudo finalizar la reservación. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    invitedGuests,
    onCompleted,
    reservationDraft,
    resetModalState,
    shouldCreateTeam,
    teamName,
  ]);

  return {
    state: {
      people,
      workGroups,
      invitedGuests,
      searchTerm,
      isDropdownOpen,
      shouldCreateTeam,
      teamName,
      teamNameError,
      loadError,
      submitError,
      isLoadingOptions,
      isSubmitting,
      sessions,
      filteredPeople,
      filteredWorkGroups,
      hasInvitedGuests,
    },
    refs: {
      searchContainerRef,
    },
    actions: {
      setSearchTerm,
      openDropdown: () => setIsDropdownOpen(true),
      closeDropdown: () => setIsDropdownOpen(false),
      setLoadError: (errorMsg:string) => setLoadError(errorMsg),
      closeModal,
      addPerson,
      addWorkGroup,
      removeInvitedGuest,
      updateTeamName,
      toggleShouldCreateTeam,
      submitReservation,
    },
  };
}