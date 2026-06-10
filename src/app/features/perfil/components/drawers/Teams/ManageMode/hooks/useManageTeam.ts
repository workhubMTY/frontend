"use client";

import { useEffect, useMemo, useState } from "react";

import type { User } from "../../../../../types/profile";
import type { TeamMembersState, TeamSummary } from "../../types";
import { useDebouncedSearch } from "@/app/features/perfil/hooks/useDebouncedSearch";
import { buildUpdateTeamPayload } from "../utils/teamUpdatePayload";
import { UpdateTeamPayload } from "@/app/features/perfil/data/types";

export type ManageTeamTab = "details" | "members" | "danger";

type UseManageTeamModeParams = {
  team: TeamSummary;
  membersState: TeamMembersState;
  onGetCandidates: (query: string) => Promise<User[]>;
  onBack: () => void;
  onUpdateTeam: (teamId: string, payload: UpdateTeamPayload) => Promise<void>;
  onDeleteTeam: (teamId: string) => Promise<void>;
};

export function useManageTeamMode({
  team,
  membersState,
  onGetCandidates,
  onBack,
  onUpdateTeam,
  onDeleteTeam,
}: UseManageTeamModeParams) {
  const [activeTab, setActiveTab] = useState<ManageTeamTab>("details");

  const [teamName, setTeamName] = useState(team.name);
  const [description, setDescription] = useState(team.description ?? "");
  const [memberSearch, setMemberSearch] = useState("");

  const [addedMembers, setAddedMembers] = useState<User[]>([]);
  const [removedMemberIds, setRemovedMemberIds] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    results: candidates,
    isSearching: isSearchingMembers,
    hasSearched: hasSearchedMembers,
  } = useDebouncedSearch<User>({
    searchTerm: memberSearch,
    searchFn: onGetCandidates,
    enabled: activeTab === "members",
  });

  useEffect(() => {
    setActiveTab("details");
    setTeamName(team.name);
    setDescription(team.description ?? "");
    setMemberSearch("");
    setAddedMembers([]);
    setRemovedMemberIds([]);
    setShowDeleteConfirm(false);
    setIsSubmitting(false);
    setIsDeleting(false);
  }, [team.id, team.name, team.description]);

  const originalMembers = membersState.members;

  const originalMemberIds = useMemo(() => {
    return new Set(originalMembers.map((member) => String(member.eId)));
  }, [originalMembers]);

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

      const isOriginalMember = originalMemberIds.has(candidateId);
      const isAlreadyAdded = addedMemberIds.has(candidateId);

      return !isOriginalMember && !isAlreadyAdded;
    });
  }, [candidates, originalMemberIds, addedMemberIds]);

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

  const pendingMemberChangesCount = addedMembers.length + removedMemberIds.length;

  const canSave =
    teamName.trim().length >= 1 &&
    hasChanges &&
    !isSubmitting &&
    !isDeleting &&
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

  async function handleDeleteTeam() {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await onDeleteTeam(team.id);
      onBack();
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    activeTab,
    setActiveTab,

    teamName,
    setTeamName,
    description,
    setDescription,

    memberSearch,
    setMemberSearch,
    addedMembers,
    removedMemberIds,

    originalMembers,
    activeOriginalMemberIds,
    addedMemberIds,
    filteredCandidates,

    isSearchingMembers,
    hasSearchedMembers,

    isSubmitting,
    isDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,

    hasChanges,
    canSave,
    pendingMemberChangesCount,

    handleToggleCandidate,
    handleRemoveAddedMember,
    handleMarkOriginalMemberForRemoval,
    handleUndoRemoveOriginalMember,
    handleSubmit,
    handleDeleteTeam,
  };
}