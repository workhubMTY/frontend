import { TEAM_COLOR_CLASS_NAMES } from "../constants";
import type {
  CreateReservationGuestsPayload,
  InvitedGuest,
  PersonOption,
  ReservationDraft,
  ReservationDraftSchedule,
  ReservationSession,
  WorkGroupOption,
} from "../types";

export function parseReservationDraft(rawDraft: string | null): ReservationDraft | null {
  if (!rawDraft) return null;

  try {
    const draft = JSON.parse(rawDraft) as Partial<ReservationDraft>;

    if (!draft.reservableId || !Array.isArray(draft.schedules)) {
      return null;
    }

    return {
      reservableId: Number(draft.reservableId),
      reservableName: draft.reservableName ?? "Espacio",
      schedules: draft.schedules,
    };
  } catch {
    return null;
  }
}

export function formatReservationSessions(
  schedules: ReservationDraftSchedule[],
): ReservationSession[] {
  return schedules.map((schedule) => {
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

export function mapUserToPersonOption(user: { id: string; name: string; email: string }): PersonOption {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    kind: "colaborador",
  };
}

export function mapGuestToPersonOption(guest: { id: number | string; name: string; email: string }): PersonOption {
  return {
    id: `guest-${guest.id}`,
    name: guest.name,
    email: guest.email,
    kind: "invitado",
  };
}

export function mapWorkGroupToOption(
  group: { id: number | string; name: string; memberCount?: number | null },
  index: number,
): WorkGroupOption {
  return {
    id: String(group.id),
    name: group.name,
    members: group.memberCount ?? 0,
    colorClassName:
      TEAM_COLOR_CLASS_NAMES[index % TEAM_COLOR_CLASS_NAMES.length] ??
      "bg-violet-100",
  };
}

export function personToInvitedGuest(person: PersonOption): InvitedGuest {
  return {
    id: person.id,
    name: person.name,
    email: person.email,
    kind: person.kind,
  };
}

export function workGroupToInvitedGuest(workGroup: WorkGroupOption): InvitedGuest {
  return {
    id: `equipo-${workGroup.id}`,
    name: workGroup.name,
    email: `${workGroup.members} miembros`,
    kind: "colaborador",
  };
}

export function splitInvitedGuestsForReservation(
  invitedGuests: InvitedGuest[],
): CreateReservationGuestsPayload {
  return {
    userIds: invitedGuests
      .filter((guest) => !guest.id.startsWith("guest-") && !guest.id.startsWith("equipo-"))
      .map((guest) => guest.id),
    guestIds: invitedGuests
      .filter((guest) => guest.id.startsWith("guest-"))
      .map((guest) => Number(guest.id.replace("guest-", "")))
      .filter(Number.isFinite),
    workGroupIds: invitedGuests
      .filter((guest) => guest.id.startsWith("equipo-"))
      .map((guest) => Number(guest.id.replace("equipo-", "")))
      .filter(Number.isFinite),
  };
}

export function filterPeopleOptions(
  people: PersonOption[],
  searchTerm: string,
): PersonOption[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (normalizedSearch.length <= 1) return people;

  return people.filter(
    (person) =>
      person.name.toLowerCase().includes(normalizedSearch) ||
      person.email.toLowerCase().includes(normalizedSearch),
  );
}

export function filterWorkGroupOptions(
  workGroups: WorkGroupOption[],
  searchTerm: string,
): WorkGroupOption[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (normalizedSearch.length <= 1) return workGroups;

  return workGroups.filter((workGroup) =>
    workGroup.name.toLowerCase().includes(normalizedSearch),
  );
}
