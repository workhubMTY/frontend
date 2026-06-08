import type { Team, User } from "@/app/features/perfil/types/profile";

import type {
  InvitedGuest,
  ReservationDraft,
  ReservationSession,
} from "../types/confirmation";

export function mapUserToInvitedGuest(user: User): InvitedGuest {
  return {
    id: `user:${user.eId}`,
    source: "user",
    sourceId: user.eId,

    name: user.name,
    email: user.email,
    kind: "colaborador",
  };
}

export function mapTeamToInvitedGuest(team: Team): InvitedGuest {
  return {
    id: `team:${team.id}`,
    source: "team",
    sourceId: team.id,

    name: team.name,
    email: `${team.memberCount} ${
      team.memberCount === 1 ? "integrante" : "integrantes"
    }`,
    kind: "colaborador",

    memberCount: team.memberCount,
  };
}

/**
 * Para cuando tengas invitados externos reales.
 * Necesitas que el backend te regrese un id de invitado.
 */
export function mapGuestToInvitedGuest(guest: {
  id: string | number;
  name: string;
  email: string;
}): InvitedGuest {
  return {
    id: `guest:${guest.id}`,
    source: "guest",
    sourceId: String(guest.id),

    name: guest.name,
    email: guest.email,
    kind: "invitado",
  };
}

export function mapDraftToSessions(
  draft: ReservationDraft | null,
): ReservationSession[] {
  if (!draft) return [];

  return draft.schedules.map((schedule) => {
    const start = new Date(schedule.start_time);
    const end = new Date(schedule.end_time);

    return {
      dateLabel: `${String(start.getMonth() + 1).padStart(2, "0")}/${String(
        start.getDate(),
      ).padStart(2, "0")}`,
      startLabel: start.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endLabel: end.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });
}

export function filterTeams(teams: Team[], searchTerm: string): Team[] {
  const normalizedSearch = normalizeSearch(searchTerm);

  if (normalizedSearch.length <= 1) return teams;

  return teams.filter((team) => {
    const normalizedName = normalizeSearch(team.name);
    const normalizedDescription = normalizeSearch(team.description ?? "");

    return (
      normalizedName.includes(normalizedSearch) ||
      normalizedDescription.includes(normalizedSearch)
    );
  });
}

export function splitInvitedGuestsForReservation(
  invitedGuests: InvitedGuest[],
) {
  const userIds = invitedGuests
    .filter((guest) => guest.source === "user")
    .map((guest) => guest.sourceId);

  const guestIds = invitedGuests
    .filter((guest) => guest.source === "guest")
    .map((guest) => Number(guest.sourceId))
    .filter(Number.isFinite);

  const workGroupIds = invitedGuests
    .filter((guest) => guest.source === "team")
    .map((guest) => Number(guest.sourceId))
    .filter(Number.isFinite);

  return {
    userIds,
    guestIds,
    workGroupIds,
  };
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}