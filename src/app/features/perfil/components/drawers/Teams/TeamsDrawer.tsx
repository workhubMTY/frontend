"use client";

import { useEffect, useMemo, useState } from "react";
import { getInitials } from "../../../lib/formatting";
import type { User } from "../../../types/profile";
import { CreateTeamPayload, TeamSummary } from "./types";
import { TeamsListMode } from "./ListMode/TeamsListMode";
import { CreateTeamMode } from "./CreateMode/TeamsCreateMode";
import { ManageTeamMode } from "./ManageMode/TeamsManageMode";
import { useCreateTeam, useDeleteTeam, useTeamMembers, useUpdateTeam } from "../../../data/hooks/useTeams";
import { UpdateTeamPayload } from "../../../data/types";

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

type DrawerMode = "list" | "create" | "manage";

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
  const [managedTeamId, setManagedTeamId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();

  const teamMembersQuery = useTeamMembers(openTeamId, {
    enabled: open && drawerMode === "list" && Boolean(openTeamId),
  });

  const managedTeamMembersQuery = useTeamMembers(managedTeamId, {
    enabled: open && drawerMode === "manage" && Boolean(managedTeamId),
  });

  const managedTeam = useMemo(() => {
    if (!managedTeamId) return null;

    return teams.find((team) => team.id === managedTeamId) ?? null;
  }, [teams, managedTeamId]);

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
    setManagedTeamId(null);
    setSuccessMessage(null);
  }, [open, initialOpenTeamId, initialTeamDrawerMode]);

  function handleToggleTeam(teamId: string) {
    setOpenTeamId((current) => (current === teamId ? null : teamId));
  }

  function handleManageTeam(teamId: string) {
    setSuccessMessage(null);
    setManagedTeamId(teamId);
    setDrawerMode("manage");
  }

  function handleBackToList() {
    setDrawerMode("list");
    setManagedTeamId(null);
  }

  function handleClose() {
    setDrawerMode("list");
    setOpenTeamId(null);
    setManagedTeamId(null);
    setSearch("");
    setSuccessMessage(null);
    onClose();
  }

  async function handleCreateTeam(payload: CreateTeamPayload) {
    await createTeamMutation.mutateAsync(payload);

    setDrawerMode("list");
    setSuccessMessage("Se ha creado el equipo correctamente.");
  }

  async function handleUpdateTeam(teamId: string, payload: UpdateTeamPayload) {
    await updateTeamMutation.mutateAsync({ teamId, payload });

    setDrawerMode("list");
    setManagedTeamId(null);
    setSuccessMessage("Se han guardado los cambios del equipo.");
  }

  async function handleDeleteTeam(teamId: string) {
    const deletedTeamName = managedTeam?.name ?? "el equipo";

    setDrawerMode("list");
    setManagedTeamId(null);
    setOpenTeamId(null);

    await deleteTeamMutation.mutateAsync(teamId);

    setSuccessMessage(`Se ha borrado el equipo “${deletedTeamName}”.`);
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
        {drawerMode === "list" && (
          <TeamsListMode
            search={search}
            teams={filteredTeams}
            openTeamId={openTeamId}
            successMessage={successMessage}
            onDismissSuccessMessage={() => setSuccessMessage(null)}
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
            onManageTeam={handleManageTeam}
            onCreateMode={() => {
              setSuccessMessage(null);
              setDrawerMode("create");
            }}
          />
        )}

        {drawerMode === "create" && (
          <CreateTeamMode
            onGetCandidates={getUsers}
            onBack={() => setDrawerMode("list")}
            onClose={handleClose}
            onCreateTeam={handleCreateTeam}
          />
        )}

        {drawerMode === "manage" && managedTeam && (
          <ManageTeamMode
            team={managedTeam}
            membersState={{
              loading: managedTeamMembersQuery.isLoading,
              error: managedTeamMembersQuery.isError
                ? "No se pudieron cargar los miembros."
                : undefined,
              members: managedTeamMembersQuery.data ?? [],
            }}
            onGetCandidates={(query) => getUsers(query)}
            onBack={handleBackToList}
            onClose={handleClose}
            onUpdateTeam={handleUpdateTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        )}
      </aside>
    </div>
  );
}
