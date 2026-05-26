"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Loader2,
  Lock,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import { getInitials } from "../../lib/formatting";
import type { User } from "../../types/profile";

export type TeamSummary = {
  id: string;
  name: string;
  membersCount: number;
  userRole?: string;
};

type TeamMembersState = {
  loading: boolean;
  error?: string;
  members: User[];
};

type CreateTeamPayload = {
  name: string;
  description: string;
  invitedMemberIds: string[];
};

type TeamsDrawerProps = {
  open: boolean;
  teams: TeamSummary[];
  initialOpenTeamId?: string | null;
  initialTeamDrawerMode?: "list" | "create";
  inviteCandidates?: User[];
  onClose: () => void;
  onGetTeamMembers: (teamId: string) => Promise<User[]>;
  onCreateTeam?: (payload: CreateTeamPayload) => Promise<void> | void;
};

type AvatarProps = {
  name: string;
  src?: string;
  size?: "sm" | "md";
};

type DrawerMode = "list" | "create";

export function Avatar({ name, src, size = "md" }: AvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-[11px]",
    md: "h-10 w-10 text-xs",
  };

  const className = `${sizeClasses[size]} shrink-0 rounded-full`;

  if (!src || hasImageError) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-neutral-100 font-semibold text-neutral-600`}
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasImageError(true)}
      className={`${className} object-cover`}
    />
  );
}

export function TeamsDrawer({
  open,
  teams,
  onClose,
  initialOpenTeamId,
  inviteCandidates = [],
  initialTeamDrawerMode = "list",
  onCreateTeam,
  onGetTeamMembers,
}: TeamsDrawerProps) {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(
    initialTeamDrawerMode,
  );
  const [search, setSearch] = useState("");
  const [openTeamId, setOpenTeamId] = useState<string | null>(null);

  const [membersByTeamId, setMembersByTeamId] = useState<
    Record<string, TeamMembersState>
  >({});

  const filteredTeams = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return teams;

    return teams.filter((team) =>
      team.name.toLowerCase().includes(normalizedSearch),
    );
  }, [teams, search]);

  useEffect(() => {
    if (!open) return;

    setDrawerMode(initialTeamDrawerMode);

    if (!initialOpenTeamId) {
      setOpenTeamId(null);
      return;
    }

    setOpenTeamId(initialOpenTeamId);
    loadTeamMembersIfNeeded(initialOpenTeamId);
  }, [open, initialOpenTeamId, initialTeamDrawerMode]);

  async function loadTeamMembersIfNeeded(teamId: string) {
    let shouldFetch = false;

    setMembersByTeamId((current) => {
      const currentState = current[teamId];

      if (currentState?.loading || currentState?.members.length > 0) {
        return current;
      }

      shouldFetch = true;

      return {
        ...current,
        [teamId]: {
          loading: true,
          members: [],
        },
      };
    });

    if (!shouldFetch) return;

    try {
      const members = await onGetTeamMembers(teamId);

      setMembersByTeamId((current) => ({
        ...current,
        [teamId]: {
          loading: false,
          members,
        },
      }));
    } catch {
      setMembersByTeamId((current) => ({
        ...current,
        [teamId]: {
          loading: false,
          members: [],
          error: "No se pudieron cargar los miembros.",
        },
      }));
    }
  }

  async function handleToggleTeam(teamId: string) {
    const isCurrentlyOpen = openTeamId === teamId;

    if (isCurrentlyOpen) {
      setOpenTeamId(null);
      return;
    }

    setOpenTeamId(teamId);
    await loadTeamMembersIfNeeded(teamId);
  }

  function handleClose() {
    setDrawerMode("list");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar panel"
        onClick={handleClose}
        className="absolute inset-0 bg-black/45"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[720px] flex-col border-l border-neutral-200 bg-white shadow-2xl">
        {drawerMode === "list" ? (
          <TeamsListMode
            search={search}
            teams={filteredTeams}
            openTeamId={openTeamId}
            membersByTeamId={membersByTeamId}
            onSearchChange={setSearch}
            onClose={handleClose}
            onToggleTeam={handleToggleTeam}
            onCreateMode={() => setDrawerMode("create")}
          />
        ) : (
          <CreateTeamMode
            inviteCandidates={inviteCandidates}
            onBack={() => setDrawerMode("list")}
            onClose={handleClose}
            onCreateTeam={async (payload) => {
              await onCreateTeam?.(payload);
              setDrawerMode("list");
            }}
          />
        )}
      </aside>
    </div>
  );
}

type TeamsListModeProps = {
  search: string;
  teams: TeamSummary[];
  openTeamId: string | null;
  membersByTeamId: Record<string, TeamMembersState>;
  onSearchChange: (value: string) => void;
  onClose: () => void;
  onToggleTeam: (teamId: string) => void;
  onCreateMode: () => void;
};

function TeamsListMode({
  search,
  teams,
  openTeamId,
  membersByTeamId,
  onSearchChange,
  onClose,
  onToggleTeam,
  onCreateMode,
}: TeamsListModeProps) {
  return (
    <>
      <header className="border-b border-neutral-100 px-8 py-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
              Todos los equipos
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Consulta tus equipos y abre solo el que quieras revisar.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Cerrar drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative mt-6">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar equipo"
            className="h-11 w-full border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {teams.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {teams.map((team) => {
              const isOpen = openTeamId === team.id;
              const membersState = membersByTeamId[team.id];

              return (
                <article key={team.id} className="px-8 py-6">
                  <button
                    type="button"
                    onClick={() => onToggleTeam(team.id)}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 text-left"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700">
                      {getInitials(team.name)}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-neutral-950">
                        {team.name}
                      </h3>

                      <p className="mt-1 text-sm text-neutral-500">
                        {team.membersCount} miembros
                        {team.userRole ? ` · ${team.userRole}` : ""}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center text-neutral-500">
                      {isOpen ? (
                        <ChevronUp size={19} />
                      ) : (
                        <ChevronDown size={19} />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-5 border border-neutral-200 bg-white">
                      <div className="grid grid-cols-[1fr_auto] border-b border-neutral-100 px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                        <span>Miembros</span>
                        <span>Miembro desde</span>
                      </div>

                      {membersState?.loading && (
                        <div className="flex items-center gap-3 px-5 py-6 text-sm text-neutral-500">
                          <Loader2 size={17} className="animate-spin" />
                          Cargando miembros...
                        </div>
                      )}

                      {membersState?.error && (
                        <div className="px-5 py-6 text-sm text-red-600">
                          {membersState.error}
                        </div>
                      )}

                      {!membersState?.loading &&
                        !membersState?.error &&
                        membersState?.members.length === 0 && (
                          <div className="px-5 py-6 text-sm text-neutral-500">
                            Este equipo todavía no tiene miembros registrados.
                          </div>
                        )}

                      {!membersState?.loading &&
                        !membersState?.error &&
                        membersState?.members.length > 0 && (
                          <div className="max-h-[280px] overflow-y-auto">
                            {membersState.members.map((member) => (
                              <div
                                key={member.id}
                                className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-100 px-5 py-4 last:border-b-0"
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  <Avatar
                                    name={member.name}
                                    src={member.avatarUrl}
                                  />

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-neutral-950">
                                      {member.name}
                                    </p>
                                    <p className="truncate text-xs text-neutral-500">
                                      {member.role}
                                    </p>
                                  </div>
                                </div>

                                {"joinedAt" in member && (
                                  <p className="whitespace-nowrap text-sm text-neutral-500">
                                    {String(member.joinedAt ?? "—")}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center bg-purple-50 text-purple-700">
              <UsersRound size={25} />
            </div>

            <h3 className="text-lg font-semibold text-neutral-950">
              No se encontraron equipos
            </h3>

            <p className="mt-2 max-w-sm text-sm text-neutral-500">
              Intenta buscar con otro nombre.
            </p>
          </div>
        )}
      </div>

      <footer className="border-t border-neutral-100 px-8 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <UsersRound size={21} className="text-purple-700" />

            <div>
              <p className="text-sm font-semibold text-neutral-950">
                Crear o unirse a un equipo
              </p>
              <p className="text-sm text-neutral-500">
                Busca equipos disponibles o crea uno nuevo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCreateMode}
            className="inline-flex h-10 items-center justify-center bg-purple-700 px-5 text-sm font-medium text-white transition hover:bg-purple-800"
          >
            Crear / Unirse
          </button>
        </div>
      </footer>
    </>
  );
}

type CreateTeamModeProps = {
  inviteCandidates: User[];
  onBack: () => void;
  onClose: () => void;
  onCreateTeam: (payload: CreateTeamPayload) => Promise<void>;
};

function CreateTeamMode({
  inviteCandidates,
  onBack,
  onClose,
  onCreateTeam,
}: CreateTeamModeProps) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  // const [privacy, setPrivacy] = useState<"private" | "public">("private");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = memberSearch.trim().toLowerCase();

    if (!normalizedSearch) return [];

    return inviteCandidates.filter((candidate) => {
      const isAlreadySelected = selectedMembers.some(
        (member) => member.id === candidate.id,
      );

      if (isAlreadySelected) return false;

      return candidate.name.toLowerCase().includes(normalizedSearch);
    });
  }, [inviteCandidates, memberSearch, selectedMembers]);

  const canCreateTeam = teamName.trim().length >= 3 && !isSubmitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canCreateTeam) return;

    try {
      setIsSubmitting(true);

      await onCreateTeam({
        name: teamName.trim(),
        description: description.trim(),
        invitedMemberIds: selectedMembers.map((member) => member.id),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSelectMember(member: User) {
    setSelectedMembers((current) => [...current, member]);
    setMemberSearch("");
  }

  function handleRemoveMember(memberId: string) {
    setSelectedMembers((current) =>
      current.filter((member) => member.id !== memberId),
    );
  }

  return (
    <>
      <header className="border-b border-neutral-100 px-8 py-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-purple-700 transition hover:text-purple-900"
            >
              <ChevronLeft size={17} />
              Volver a equipos
            </button>

            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
              Crear nuevo equipo
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Crea un equipo y agrega a tus miembros.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Cerrar drawer"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="space-y-7">
            <div>
              <label
                htmlFor="team-name"
                className="text-sm font-semibold text-neutral-950"
              >
                Nombre del equipo
              </label>

              <input
                id="team-name"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                placeholder="Ej. Equipo de Marketing"
                className="mt-3 h-11 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              {teamName.trim().length > 0 && teamName.trim().length < 3 && (
                <p className="mt-2 text-xs text-red-600">
                  El nombre debe tener al menos 3 caracteres.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="team-description"
                className="text-sm font-semibold text-neutral-950"
              >
                Descripción{" "}
                <span className="font-normal text-neutral-500">(opcional)</span>
              </label>

              <div className="relative mt-3">
                <textarea
                  id="team-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value.slice(0, 300))
                  }
                  placeholder="Describe el propósito o los objetivos del equipo..."
                  className="min-h-[140px] w-full resize-none border border-neutral-200 bg-white px-4 py-4 pr-16 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

                <span className="absolute bottom-4 right-4 text-xs text-neutral-400">
                  {description.length}/300
                </span>
              </div>
            </div>
            <div>
              <label
                htmlFor="member-search"
                className="text-sm font-semibold text-neutral-950"
              >
                Invitar miembros
              </label>

              <div className="relative mt-3">
                <div className="flex min-h-12 w-full flex-wrap items-center gap-2 border border-neutral-200 bg-white px-3 py-2 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
                  {selectedMembers.map((member) => (
                    <span
                      key={member.id}
                      className="inline-flex h-8 items-center gap-2 bg-neutral-100 px-3 text-sm text-neutral-700"
                    >
                      {member.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-neutral-500 transition hover:text-neutral-900"
                        aria-label={`Quitar ${member.name}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}

                  <input
                    id="member-search"
                    value={memberSearch}
                    onChange={(event) => setMemberSearch(event.target.value)}
                    placeholder={
                      selectedMembers.length > 0
                        ? "Buscar personas..."
                        : "Busca personas para invitar..."
                    }
                    className="h-8 min-w-[180px] flex-1 border-0 bg-transparent px-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                  />
                </div>

                {filteredCandidates.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-y-auto border border-neutral-200 bg-white shadow-lg">
                    {filteredCandidates.map((candidate) => (
                      <button
                        key={candidate.id}
                        type="button"
                        onClick={() => handleSelectMember(candidate)}
                        className="flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-neutral-50"
                      >
                        <Avatar
                          name={candidate.name}
                          src={candidate.avatarUrl}
                          size="sm"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-neutral-950">
                            {candidate.name}
                          </p>
                          <p className="truncate text-xs text-neutral-500">
                            {candidate.role}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="mt-2 text-xs text-neutral-500">
                Puedes invitar más miembros después.
              </p>
            </div>
          </div>
        </div>

        <footer className="border-t border-neutral-100 bg-white px-8 py-5">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 min-w-32 items-center justify-center border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!canCreateTeam}
              className="inline-flex h-11 min-w-40 items-center justify-center bg-primary-2 px-5 text-sm font-medium text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              {isSubmitting ? "Creando..." : "Crear equipo"}
            </button>
          </div>
        </footer>
      </form>
    </>
  );
}
