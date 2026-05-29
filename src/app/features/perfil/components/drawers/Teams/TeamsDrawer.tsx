"use client";

import { useEffect, useMemo, useState } from "react";
import { getInitials } from "../../../lib/formatting";
import type { User } from "../../../types/profile";
import { CreateTeamPayload, TeamMembersState, TeamSummary } from "./types";
import { TeamsListMode } from "./TeamsListMode";
import { CreateTeamMode } from "./TeamsCreateMode";

type TeamsDrawerProps = {
  open: boolean;
  teams: TeamSummary[];
  initialOpenTeamId?: string | null;
  initialTeamDrawerMode?: "list" | "create";
  getUsers: (query?: string) => Promise<User[]>;
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
  getUsers,
  initialOpenTeamId,
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
            onGetCandidates={getUsers}
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
