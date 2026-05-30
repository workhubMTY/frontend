"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/app/shared/auth/useAuth";
import { useDebouncedSearch } from "@/app/features/perfil/hooks/useDebouncedSearch";

import type { User } from "../../../../../types/profile";
import type { CreateTeamPayload } from "../../types";

type UseCreateTeamModeParams = {
  onGetCandidates: (query: string) => Promise<User[]>;
  onCreateTeam: (payload: CreateTeamPayload) => Promise<void>;
};

export function useCreateTeamMode({
  onGetCandidates,
  onCreateTeam,
}: UseCreateTeamModeParams) {
  const { user } = useAuth();

  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    results: candidates,
    isSearching: isSearchingMembers,
    hasSearched: hasSearchedMembers,
  } = useDebouncedSearch<User>({
    searchTerm: memberSearch,
    searchFn: onGetCandidates,
    delay: 350,
    enabled: true,
  });

  const selectedMemberIds = useMemo(() => {
    return new Set(selectedMembers.map((member) => String(member.eId)));
  }, [selectedMembers]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(
      (candidate) => !selectedMemberIds.has(String(candidate.eId)),
    );
  }, [candidates, selectedMemberIds]);

  const canCreateTeam =
    teamName.trim().length >= 3 && !isSubmitting && Boolean(user?.eId);

  function handleToggleMember(member: User) {
    setSelectedMembers((current) => {
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

  function handleRemoveMember(memberId: string) {
    setSelectedMembers((current) =>
      current.filter((member) => String(member.eId) !== String(memberId)),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canCreateTeam || !user?.eId) return;

    try {
      setIsSubmitting(true);

      await onCreateTeam({
        name: teamName.trim(),
        description: description.trim(),
        memberEIds: [
          ...selectedMembers.map((member) => member.eId),
          user.eId,
        ],
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    teamName,
    setTeamName,

    description,
    setDescription,

    memberSearch,
    setMemberSearch,

    selectedMembers,
    selectedMemberIds,
    filteredCandidates,

    isSearchingMembers,
    hasSearchedMembers,

    isSubmitting,
    canCreateTeam,

    handleToggleMember,
    handleRemoveMember,
    handleSubmit,
  };
}