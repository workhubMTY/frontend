"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  Loader2,
  RotateCcw,
  Save,
  Trash2,
  UserMinus,
  X,
} from "lucide-react";

import type { User } from "../../../types/profile";
import type { TeamMembersState, TeamSummary } from "./types";
import type { UpdateTeamPayload } from "../../../data/hooks";
import { Avatar } from "./TeamsDrawer";
import { SearchSelectionBox } from "../../utils/SearchSelectionBox";
import { useDebouncedSearch } from "@/app/features/perfil/hooks/useDebouncedSearch";
type BuildUpdateTeamPayloadParams = {
  originalName: string;
  nextName: string;
  originalDescription?: string | null;
  nextDescription: string;
  addedMemberEIds: Array<string | number>;
  removedMemberEIds: Array<string | number>;
};

export function buildUpdateTeamPayload({
  originalName,
  nextName,
  originalDescription,
  nextDescription,
  addedMemberEIds,
  removedMemberEIds,
}: BuildUpdateTeamPayloadParams): UpdateTeamPayload {
  const payload: UpdateTeamPayload = {};

  const normalizedOriginalName = originalName.trim();
  const normalizedNextName = nextName.trim();

  const normalizedOriginalDescription = (originalDescription ?? "").trim();
  const normalizedNextDescription = nextDescription.trim();

  if (normalizedNextName !== normalizedOriginalName) {
    payload.name = normalizedNextName;
  }

  if (normalizedNextDescription !== normalizedOriginalDescription) {
    payload.description = normalizedNextDescription;
  }

  const addMemberEIds = uniqueStringIds(addedMemberEIds);
  const removeMemberEIds = uniqueStringIds(removedMemberEIds);

  const removeSet = new Set(removeMemberEIds);

  const safeAddMemberEIds = addMemberEIds.filter(
    (memberEId) => !removeSet.has(memberEId),
  );

  if (safeAddMemberEIds.length > 0) {
    payload.addMemberEIds = safeAddMemberEIds;
  }

  if (removeMemberEIds.length > 0) {
    payload.removeMemberEIds = removeMemberEIds;
  }

  return payload;
}

function uniqueStringIds(ids: Array<string | number>): string[] {
  return Array.from(
    new Set(
      ids
        .map((id) => String(id).trim())
        .filter((id) => id.length > 0),
    ),
  );
}
type ManageTeamModeProps = {
  team: TeamSummary;
  membersState: TeamMembersState;
  onGetCandidates: (query: string) => Promise<User[]>;
  onBack: () => void;
  onClose: () => void;
  onUpdateTeam: (teamId: string, payload: UpdateTeamPayload) => Promise<void>;
};

export function ManageTeamMode({
  team,
  membersState,
  onGetCandidates,
  onBack,
  onClose,
  onUpdateTeam,
}: ManageTeamModeProps) {
  const [teamName, setTeamName] = useState(team.name);
  const [description, setDescription] = useState(team.description ?? "");

  const [memberSearch, setMemberSearch] = useState("");
  const [addedMembers, setAddedMembers] = useState<User[]>([]);
  const [removedMemberIds, setRemovedMemberIds] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    results: candidates,
    isSearching: isSearchingMembers,
    hasSearched: hasSearchedMembers,
  } = useDebouncedSearch<User>({
    searchTerm: memberSearch,
    searchFn: onGetCandidates,
    enabled: true,
  });

  useEffect(() => {
    setTeamName(team.name);
    setDescription(team.description ?? "");
    setMemberSearch("");
    setAddedMembers([]);
    setRemovedMemberIds([]);
  }, [team.id, team.name, team.description]);

  const originalMembers = membersState.members;

  const activeOriginalMemberIds = useMemo(() => {
    return new Set(
      originalMembers
        .filter((member) => !removedMemberIds.includes(String(member.eId)))
        .map((member) => String(member.eId)),
    );
  }, [originalMembers, removedMemberIds]);

  const addedMemberIds = useMemo(() => {
    return new Set(addedMembers.map((member) => String(member.eId)));
  }, [addedMembers]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const candidateId = String(candidate.eId);

      const isOriginalMember = originalMembers.some(
        (member) => String(member.eId) === candidateId,
      );

      const isAlreadyAdded = addedMemberIds.has(candidateId);

      return !isOriginalMember && !isAlreadyAdded;
    });
  }, [candidates, originalMembers, addedMemberIds]);
  const updatePayload = useMemo(() => {
    return buildUpdateTeamPayload({
      originalName: team.name,
      nextName: teamName,
      originalDescription: team.description,
      nextDescription: description,
      addedMemberEIds: addedMembers.map((member) => member.eId),
      removedMemberEIds: removedMemberIds,
    });
  }, [
    team.name,
    team.description,
    teamName,
    description,
    addedMembers,
    removedMemberIds,
  ]);
  const hasChanges = Object.keys(updatePayload).length > 0;

  const canSave =
    teamName.trim().length >= 1 &&
    hasChanges &&
    !isSubmitting &&
    !membersState.loading;

  function handleToggleCandidate(member: User) {
    setAddedMembers((current) => {
      const exists = current.some(
        (selectedMember) => String(selectedMember.eId) === String(member.eId),
      );

      if (exists) {
        return current.filter(
          (selectedMember) => String(selectedMember.eId) !== String(member.eId),
        );
      }

      return [...current, member];
    });
  }

  function handleRemoveAddedMember(memberId: string) {
    setAddedMembers((current) =>
      current.filter((member) => String(member.eId) !== String(memberId)),
    );
  }

  function handleMarkOriginalMemberForRemoval(memberId: string) {
    setRemovedMemberIds((current) => {
      if (current.includes(memberId)) return current;

      return [...current, memberId];
    });
  }

  function handleUndoRemoveOriginalMember(memberId: string) {
    setRemovedMemberIds((current) =>
      current.filter((currentMemberId) => currentMemberId !== memberId),
    );
  }
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave) return;

    try {
      setIsSubmitting(true);

      await onUpdateTeam(team.id, updatePayload);

      onBack();
    } finally {
      setIsSubmitting(false);
    }
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
              Administrar equipo
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Edita la información y administra los miembros antes de guardar.
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
          <div className="space-y-8">
            <section className="space-y-7">
              <div>
                <label
                  htmlFor="manage-team-name"
                  className="text-sm font-semibold text-neutral-950"
                >
                  Nombre del equipo
                </label>

                <input
                  id="manage-team-name"
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
                  htmlFor="manage-team-description"
                  className="text-sm font-semibold text-neutral-950"
                >
                  Descripción{" "}
                  <span className="font-normal text-neutral-500">
                    (opcional)
                  </span>
                </label>

                <div className="relative mt-3">
                  <textarea
                    id="manage-team-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value.slice(0, 300))
                    }
                    placeholder="Describe el propósito o los objetivos del equipo..."
                    className="min-h-[120px] w-full resize-none border border-neutral-200 bg-white px-4 py-4 pr-16 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                  <span className="absolute bottom-4 right-4 text-xs text-neutral-400">
                    {description.length}/300
                  </span>
                </div>
              </div>
            </section>

            <section className="border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-5 py-4">
                <h3 className="text-sm font-semibold text-neutral-950">
                  Miembros actuales
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  Los cambios se aplicarán cuando guardes.
                </p>
              </div>

              {membersState.loading && (
                <div className="flex items-center gap-3 px-5 py-6 text-sm text-neutral-500">
                  <Loader2 size={17} className="animate-spin" />
                  Cargando miembros...
                </div>
              )}

              {membersState.error && (
                <div className="px-5 py-6 text-sm text-red-600">
                  {membersState.error}
                </div>
              )}

              {!membersState.loading &&
                !membersState.error &&
                originalMembers.length === 0 && (
                  <div className="px-5 py-6 text-sm text-neutral-500">
                    Este equipo todavía no tiene miembros registrados.
                  </div>
                )}

              {!membersState.loading &&
                !membersState.error &&
                originalMembers.length > 0 && (
                  <div className="divide-y divide-neutral-100">
                    {originalMembers.map((member) => {
                      const memberId = String(member.eId);
                      const willBeRemoved = removedMemberIds.includes(memberId);

                      return (
                        <div
                          key={memberId}
                          className="flex items-center justify-between gap-4 px-5 py-4"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar name={member.name} src={member.avatarUrl} />

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold text-neutral-950">
                                  {member.name}
                                </p>

                                {willBeRemoved && (
                                  <span className="shrink-0 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                                    Se quitará
                                  </span>
                                )}
                              </div>

                              <p className="truncate text-xs text-neutral-500">
                                {member.email}
                              </p>
                            </div>
                          </div>

                          {willBeRemoved ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleUndoRemoveOriginalMember(memberId)
                              }
                              className="inline-flex items-center gap-1 text-sm font-medium text-purple-700 transition hover:text-purple-900"
                            >
                              <RotateCcw size={15} />
                              Reagregar
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleMarkOriginalMemberForRemoval(memberId)
                              }
                              className="inline-flex items-center gap-1 text-sm font-medium text-red-600 transition hover:text-red-700"
                            >
                              <UserMinus size={15} />
                              Quitar
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
            </section>

            <SearchSelectionBox<User>
              id="manage-member-search"
              label="Agregar miembros"
              searchValue={memberSearch}
              onSearchChange={setMemberSearch}
              selectedItems={addedMembers}
              results={filteredCandidates}
              isSearching={isSearchingMembers}
              hasSearched={hasSearchedMembers}
              selectedLabel="Miembros por agregar"
              resultsLabel="Resultados"
              selectedCountLabel={`${addedMembers.length} por agregar`}
              selectedItemsPlacement="below-results"
              placeholder="Buscar por nombre, correo o rol"
              searchPlaceholderWhenSelected="Buscar más personas..."
              getItemId={(member) => String(member.eId)}
              getItemName={(member) => member.name}
              getItemAvatarUrl={(member) => member.avatarUrl}
              getItemDescription={(member) => member.email}
              onSelectItem={handleToggleCandidate}
              onRemoveItem={(memberId) => handleRemoveAddedMember(memberId)}
              isItemSelected={(member) =>
                addedMemberIds.has(String(member.eId))
              }
              renderItemStatus={(member, { isSelected }) => {
                if (isSelected) {
                  return (
                    <span className="whitespace-nowrap bg-purple-700 px-3 py-1 text-xs font-medium text-white">
                      Se agregará
                    </span>
                  );
                }

                return (
                  <span className="whitespace-nowrap border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700">
                    Agregar
                  </span>
                );
              }}
              renderSelectedItems={(selectedItems, helpers) => (
                <section className="mt-6 border border-purple-100 bg-purple-50">
                  <div className="border-b border-purple-100 px-5 py-4">
                    <h3 className="text-sm font-semibold text-purple-950">
                      Miembros por agregar
                    </h3>

                    <p className="mt-1 text-xs text-purple-700">
                      Se agregarán cuando guardes los cambios.
                    </p>
                  </div>

                  <div className="divide-y divide-purple-100">
                    {selectedItems.map((member) => {
                      const memberId = helpers.getItemId(member);
                      const memberName = helpers.getItemName(member);
                      const memberDescription =
                        helpers.getItemDescription?.(member);
                      const avatarUrl = helpers.getItemAvatarUrl?.(member);

                      return (
                        <div
                          key={memberId}
                          className="flex items-center justify-between gap-4 px-5 py-4"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar name={memberName} src={avatarUrl} />

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold text-neutral-950">
                                  {memberName}
                                </p>

                                <span className="shrink-0 bg-white px-2 py-0.5 text-xs font-medium text-purple-700">
                                  Se agregará
                                </span>
                              </div>

                              {memberDescription && (
                                <p className="truncate text-xs text-neutral-500">
                                  {memberDescription}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => helpers.onRemoveItem(memberId)}
                            className="text-sm font-medium text-red-600 transition hover:text-red-700"
                          >
                            Quitar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            />
          </div>
        </div>

        <footer className="border-t border-neutral-100 bg-white px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-neutral-500">
              {hasChanges
                ? "Tienes cambios sin guardar."
                : "No hay cambios pendientes."}
            </div>

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
                disabled={!canSave}
                className="inline-flex h-11 min-w-40 items-center justify-center gap-2 bg-primary-2 px-5 text-sm font-medium text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-300"
              >
                <Save size={16} />
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </footer>
      </form>
    </>
  );
}
