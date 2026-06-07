import type {
  InvitedGuest,
  PersonOption,
  ReservationDraft,
  ReservationSession,
  WorkGroupOption,
} from "../types/confirmation";

type ApiUser = {
  id: string | number;
  name: string;
  email: string;
};

type ApiGuest = {
  id: string | number;
  name: string;
  email: string;
};

type ApiWorkGroup = {
  id: string | number;
  name: string;
  memberCount?: number | null;
};

const WORK_GROUP_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-pink-100 text-pink-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
];

export function mapUserToPersonOption(user: ApiUser): PersonOption {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    kind: "colaborador",
  };
}

export function mapGuestToPersonOption(guest: ApiGuest): PersonOption {
  return {
    id: `guest-${guest.id}`,
    name: guest.name,
    email: guest.email,
    kind: "invitado",
  };
}

export function mapWorkGroupToOption(
  group: ApiWorkGroup,
  index: number,
): WorkGroupOption {
  return {
    id: String(group.id),
    name: group.name,
    memberCount: group.memberCount ?? 0,
    colorClassName:
      WORK_GROUP_COLORS[index % WORK_GROUP_COLORS.length] ??
      "bg-violet-100 text-violet-700",
  };
}

export function mapPersonToInvitedGuest(person: PersonOption): InvitedGuest {
  return {
    id: person.id,
    name: person.name,
    email: person.email,
    kind: person.kind,
  };
}

export function mapWorkGroupToInvitedGuest(
  workGroup: WorkGroupOption,
): InvitedGuest {
  return {
    id: `equipo-${workGroup.id}`,
    name: workGroup.name,
    email: `${workGroup.memberCount} miembros`,
    kind: "colaborador",
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

export function filterPeopleOptions(
  people: PersonOption[],
  searchTerm: string,
): PersonOption[] {
  const normalizedSearch = normalizeSearch(searchTerm);

  if (normalizedSearch.length <= 1) return people;

  return people.filter(
    (person) =>
      normalizeSearch(person.name).includes(normalizedSearch) ||
      normalizeSearch(person.email).includes(normalizedSearch),
  );
}

export function filterWorkGroupOptions(
  workGroups: WorkGroupOption[],
  searchTerm: string,
): WorkGroupOption[] {
  const normalizedSearch = normalizeSearch(searchTerm);

  if (normalizedSearch.length <= 1) return workGroups;

  return workGroups.filter((workGroup) =>
    normalizeSearch(workGroup.name).includes(normalizedSearch),
  );
}

export function splitInvitedGuestsForReservation(invitedGuests: InvitedGuest[]) {
  const userIds = invitedGuests
    .filter(
      (guest) =>
        !guest.id.startsWith("guest-") && !guest.id.startsWith("equipo-"),
    )
    .map((guest) => guest.id);

  const guestIds = invitedGuests
    .filter((guest) => guest.id.startsWith("guest-"))
    .map((guest) => Number(guest.id.replace("guest-", "")))
    .filter(Number.isFinite);

  const workGroupIds = invitedGuests
    .filter((guest) => guest.id.startsWith("equipo-"))
    .map((guest) => Number(guest.id.replace("equipo-", "")))
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