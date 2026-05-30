"use client";

import type { User } from "../../../../types/profile";
import type { CreateTeamPayload } from "../types";

import { useCreateTeamMode } from "./hooks/useCreateMode";
import { TeamsCreateHeader } from "./TeamsCreateHeader";
import { TeamDetailsFields } from "./TeamDetailsFields";
import { TeamMemberSelector } from "./TeamMemberSelector";
import { TeamsCreateFooter } from "./TeamsCreateFooter";

type CreateTeamModeProps = {
  onGetCandidates: (query: string) => Promise<User[]>;
  onBack: () => void;
  onClose: () => void;
  onCreateTeam: (payload: CreateTeamPayload) => Promise<void>;
};

export function CreateTeamMode({
  onGetCandidates,
  onBack,
  onClose,
  onCreateTeam,
}: CreateTeamModeProps) {
  const createTeam = useCreateTeamMode({
    onGetCandidates,
    onCreateTeam,
  });

  return (
    <>
      <TeamsCreateHeader onBack={onBack} onClose={onClose} />

      <form
        onSubmit={createTeam.handleSubmit}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="space-y-7">
            <TeamDetailsFields
              teamName={createTeam.teamName}
              description={createTeam.description}
              onTeamNameChange={createTeam.setTeamName}
              onDescriptionChange={createTeam.setDescription}
            />

            <TeamMemberSelector
              memberSearch={createTeam.memberSearch}
              onMemberSearchChange={createTeam.setMemberSearch}
              selectedMembers={createTeam.selectedMembers}
              selectedMemberIds={createTeam.selectedMemberIds}
              candidates={createTeam.filteredCandidates}
              isSearchingMembers={createTeam.isSearchingMembers}
              hasSearchedMembers={createTeam.hasSearchedMembers}
              onToggleMember={createTeam.handleToggleMember}
              onRemoveMember={createTeam.handleRemoveMember}
            />
          </div>
        </div>

        <TeamsCreateFooter
          canCreateTeam={createTeam.canCreateTeam}
          isSubmitting={createTeam.isSubmitting}
          onCancel={onBack}
        />
      </form>
    </>
  );
}