"use client";

import { useEffect, useMemo, useState } from "react";
import { getInitials } from "../../../lib/formatting";
import type { User } from "../../../types/profile";
import { CreateTeamPayload, TeamSummary } from "./types";
import { TeamsListMode } from "./TeamsListMode";
import { CreateTeamMode } from "./TeamsCreateMode";
import { useCreateTeam, useTeamMembers } from "../../../data/hooks";

type TeamsDrawerProps = {
  open: boolean;
  teams: TeamSummary[];
  initialOpenTeamId?: string | null;
  initialTeamDrawerMode?: "list" | "create";
  getUsers: (query: string) => Promise<User[]>;
  onClose: () => void;
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
}: TeamsDrawerProps) {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(
    initialTeamDrawerMode,
  );

  const [search, setSearch] = useState("");
  const [openTeamId, setOpenTeamId] = useState<string | null>(null);

  const createTeamMutation = useCreateTeam();

  const teamMembersQuery = useTeamMembers(openTeamId, {
    enabled: open,
  });

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
    setOpenTeamId(initialOpenTeamId ?? null);
  }, [open, initialOpenTeamId, initialTeamDrawerMode]);

  function handleToggleTeam(teamId: string) {
    setOpenTeamId((current) => (current === teamId ? null : teamId));
  }

  function handleClose() {
    setDrawerMode("list");
    setOpenTeamId(null);
    setSearch("");
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
            selectedTeamMembersState={{
              loading: teamMembersQuery.isLoading,
              error: teamMembersQuery.isError
                ? "No se pudieron cargar los miembros."
                : undefined,
              members: teamMembersQuery.data ?? [],
            }}
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
              await createTeamMutation.mutateAsync(payload);
              setDrawerMode("list");
            }}
          />
        )}
      </aside>
    </div>
  );
}