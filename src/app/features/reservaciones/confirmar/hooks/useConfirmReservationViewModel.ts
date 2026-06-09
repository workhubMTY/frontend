"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useCreateReservationBatch } from "../../crear/data/hooks";

import { useTeams } from "@/app/features/perfil/data/hooks/useTeams";
import { useUserSearchSuggestions } from "@/app/features/perfil/data/hooks/useUsers";
import { useAuth } from "@/app/shared/auth/useAuth";
import { useDebouncedSearch } from "@/app/features/perfil/hooks/useDebouncedSearch";

import type { Team, User } from "@/app/features/perfil/types/profile";
import type { InvitedGuest, ReservationDraft } from "../types/confirmation";

import {
  filterTeams,
  mapDraftToSessions,
  mapTeamToInvitedGuest,
  mapUserToInvitedGuest,
  splitInvitedGuestsForReservation,
} from "../lib/confirmationMappers";

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
  const { user } = useAuth();

  const createReservationBatch = useCreateReservationBatch();

  const [invitedGuests, setInvitedGuests] = useState<InvitedGuest[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [shouldCreateTeam, setShouldCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState("");

  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  useEffect(() => {
    if (!user) return;

    setInvitedGuests([
      {
        id: `user:${user.eId}`,
        source: "user",
        name: user.name,
        sourceId: user.eId,
        helperText: "Eres tú, no te elimines!",
      },
    ]);
  }, [user]);
  const {
    data: teams = [],
    isLoading: teamsLoading,
    error: teamsError,
  } = useTeams();

  const sessions = useMemo(
    () => mapDraftToSessions(reservationDraft),
    [reservationDraft],
  );
  const excludedUserIds = useMemo(
    () =>
      invitedGuests
        .filter((guest) => guest.source === "user")
        .map((guest) => guest.sourceId),
    [invitedGuests],
  );
  
  const searchUserSuggestions = useUserSearchSuggestions(excludedUserIds);

  const {
    results: filteredPeople,
    isSearching: isSearchingMembers,
    hasSearched: hasSearchedMembers,
  } = useDebouncedSearch<User>({
    searchTerm,
    searchFn: searchUserSuggestions,
    delay: 350,
    enabled: isOpen,
  });

  const filteredTeams = useMemo(
    () => filterTeams(teams, searchTerm),
    [teams, searchTerm],
  );

  const hasInvitedGuests = invitedGuests.length > 0;

  const isLoadingOptions = teamsLoading || isSearchingMembers;

  const resetModalState = useCallback(() => {
    setSearchTerm("");
    setShouldCreateTeam(false);
    setTeamName("");
    setTeamNameError("");
    setSubmitError("");
    setLoadError("");
    setInvitedGuests([]);
  }, []);

  const closeModal = useCallback(() => {
    resetModalState();
    onClose();
  }, [onClose, resetModalState]);

  const addPerson = useCallback((person: User) => {
    setInvitedGuests((currentGuests) => {
      const invitedGuest = mapUserToInvitedGuest(person);

      const alreadyAdded = currentGuests.some(
        (guest) =>
          guest.id === invitedGuest.id || guest.email === invitedGuest.email,
      );

      if (alreadyAdded) return currentGuests;

      return [...currentGuests, invitedGuest];
    });

    setSearchTerm("");
  }, []);

  const addTeam = useCallback((team: Team) => {
    setInvitedGuests((currentGuests) => {
      const invitedGuest = mapTeamToInvitedGuest(team);

      const alreadyAdded = currentGuests.some(
        (guest) => guest.id === invitedGuest.id,
      );

      if (alreadyAdded) return currentGuests;

      return [...currentGuests, invitedGuest];
    });

    setSearchTerm("");
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

    setSubmitError("");

    try {
      const { userIds, guestIds, workGroupIds } =
        splitInvitedGuestsForReservation(invitedGuests);

      if (guestIds.length > 0) {
        setSubmitError(
          "Por ahora solo se pueden invitar usuarios registrados a la reservación.",
        );
        return;
      }
      console.log("creating reservation", {
        reservable_id: reservationDraft.reservableId,
        category: "RESERVATION",
        description: "",
        timestamps: reservationDraft.schedules,
        participants: userIds,
        teamIds: workGroupIds.map((id) => String(id)),
      });

      await createReservationBatch.mutateAsync({
        reservable_id: reservationDraft.reservableId,
        category: "RESERVATION",
        description: "",
        timestamps: reservationDraft.schedules,
        participants: userIds,
        teamIds: workGroupIds.map((id) => String(id)),
      });

      resetModalState();
      onCompleted();
    } catch {
      setSubmitError("No se pudo finalizar la reservación. Intenta de nuevo.");
    }
  }, [
    createReservationBatch,
    invitedGuests,
    onCompleted,
    reservationDraft,
    resetModalState,
    shouldCreateTeam,
    teamName,
  ]);

  return {
    state: {
      teams,
      invitedGuests,

      searchTerm,
      shouldCreateTeam,
      teamName,
      teamNameError,

      loadError:
        loadError || (teamsError ? "No se pudieron cargar los equipos." : ""),
      submitError,

      isLoadingOptions,
      isSubmitting: createReservationBatch.isPending,

      sessions,
      filteredPeople,
      filteredTeams,

      hasInvitedGuests,
      hasSearchedMembers,
    },

    actions: {
      setSearchTerm,
      setLoadError,

      closeModal,

      addPerson,
      addTeam,

      removeInvitedGuest,
      updateTeamName,
      toggleShouldCreateTeam,

      submitReservation,
    },
  };
}
