"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { officeSlotsApi } from "@/app/features/cubiculos/data/api";
import { RESERVATION_DRAFT_STORAGE_KEY } from "../constants";
import {
  filterPeopleOptions,
  filterWorkGroupOptions,
  formatReservationSessions,
  mapGuestToPersonOption,
  mapUserToPersonOption,
  mapWorkGroupToOption,
  parseReservationDraft,
  personToInvitedGuest,
  splitInvitedGuestsForReservation,
  workGroupToInvitedGuest,
} from "../lib/confirmationMappers";
import type {
  InvitedGuest,
  PersonOption,
  ReservationDraft,
  WorkGroupOption,
} from "../types";
import { useClickOutside } from "./useClickOutside";

export function useCubiculoConfirmarViewModel() {
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [invitedGuests, setInvitedGuests] = useState<InvitedGuest[]>([]);
  const [people, setPeople] = useState<PersonOption[]>([]);
  const [workGroups, setWorkGroups] = useState<WorkGroupOption[]>([]);
  const [reservationDraft, setReservationDraft] = useState<ReservationDraft | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [shouldCreateTeam, setShouldCreateTeam] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [teamNameError, setTeamNameError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessions = useMemo(
    () => formatReservationSessions(reservationDraft?.schedules ?? []),
    [reservationDraft?.schedules],
  );

  const filteredPeople = useMemo(
    () => filterPeopleOptions(people, searchTerm),
    [people, searchTerm],
  );

  const filteredWorkGroups = useMemo(
    () => filterWorkGroupOptions(workGroups, searchTerm),
    [workGroups, searchTerm],
  );

  const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);
  useClickOutside(searchContainerRef, closeDropdown);

  useEffect(() => {
    async function loadConfirmationData() {
      try {
        const draft = parseReservationDraft(
          window.sessionStorage.getItem(RESERVATION_DRAFT_STORAGE_KEY),
        );
        setReservationDraft(draft);

        const [users, guests, fetchedWorkGroups] = await Promise.all([
          officeSlotsApi.getUsers(),
          officeSlotsApi.getGuests(),
          officeSlotsApi.getWorkGroups(),
        ]);

        setPeople([
          ...users.map(mapUserToPersonOption),
          ...guests.map(mapGuestToPersonOption),
        ]);
        setWorkGroups(fetchedWorkGroups.map(mapWorkGroupToOption));
      } catch {
        setLoadError("No se pudieron cargar los datos de invitados.");
      }
    }

    void loadConfirmationData();
  }, []);

  const removeInvitedGuest = useCallback((id: string) => {
    setInvitedGuests((currentGuests) =>
      currentGuests.filter((guest) => guest.id !== id),
    );
  }, []);

  const addPerson = useCallback((person: PersonOption) => {
    setInvitedGuests((currentGuests) => {
      const alreadyAdded = currentGuests.some(
        (guest) => guest.id === person.id || guest.email === person.email,
      );

      if (alreadyAdded) return currentGuests;
      return [...currentGuests, personToInvitedGuest(person)];
    });

    setSearchTerm("");
    setIsDropdownOpen(false);
  }, []);

  const addWorkGroup = useCallback((workGroup: WorkGroupOption) => {
    setInvitedGuests((currentGuests) => {
      const workGroupId = `equipo-${workGroup.id}`;
      const alreadyAdded = currentGuests.some((guest) => guest.id === workGroupId);

      if (alreadyAdded) return currentGuests;
      return [...currentGuests, workGroupToInvitedGuest(workGroup)];
    });

    setSearchTerm("");
    setTeamName("");
    setIsDropdownOpen(false);
  }, []);

  const toggleShouldCreateTeam = useCallback(() => {
    setShouldCreateTeam((currentValue) => !currentValue);
    setTeamNameError("");
  }, []);

  const updateTeamName = useCallback((value: string) => {
    setTeamName(value);
    setTeamNameError("");
  }, []);

  const finishReservation = useCallback(async () => {
    if (isSubmitting) return;

    if (shouldCreateTeam && teamName.trim() === "") {
      setTeamNameError("El nombre del equipo no puede estar vacío");
      return;
    }

    if (!reservationDraft?.reservableId || reservationDraft.schedules.length === 0) {
      setLoadError("No se encontró una reserva válida para confirmar.");
      return;
    }

    const { userIds, guestIds, workGroupIds } =
      splitInvitedGuestsForReservation(invitedGuests);

    try {
      setIsSubmitting(true);
      await officeSlotsApi.createReservationBatch({
        reservableId: reservationDraft.reservableId,
        description: "",
        schedules: reservationDraft.schedules,
        workGroupIds,
        userIds,
        guestIds,
        canOverlap: false,
      });

      setIsSuccessModalOpen(true);
    } catch {
      setLoadError("No se pudo finalizar la reserva. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    invitedGuests,
    isSubmitting,
    reservationDraft,
    shouldCreateTeam,
    teamName,
  ]);

  const closeSuccessModal = useCallback(() => {
    setIsSuccessModalOpen(false);
  }, []);

  const goBackToReservations = useCallback(() => {
    setIsSuccessModalOpen(false);
    router.push("/cubiculos");
  }, [router]);

  return {
    state: {
      invitedGuests,
      sessions,
      reservationDraft,
      searchTerm,
      filteredPeople,
      filteredWorkGroups,
      isDropdownOpen,
      shouldCreateTeam,
      teamName,
      teamNameError,
      loadError,
      isSuccessModalOpen,
      isSubmitting,
    },
    refs: {
      searchContainerRef,
    },
    actions: {
      setSearchTerm,
      openDropdown: () => setIsDropdownOpen(true),
      addPerson,
      addWorkGroup,
      removeInvitedGuest,
      toggleShouldCreateTeam,
      updateTeamName,
      finishReservation,
      closeSuccessModal,
      goBackToReservations,
    },
  };
}
