"use client";

import type { User } from "../../../../types/profile";
import type { TeamMembersState, TeamSummary } from "../types";

import { useManageTeamMode } from "./hooks/useManageTeam";
import { ManageTeamHeader } from "./layout/TeamsManageHeader";
import { ManageTeamTabs } from "./tabs/Tabs";
import { DetailsTab } from "./tabs/DetailsTab";
import { MembersTab } from "./tabs/MembersTab";
import { DangerTab } from "./tabs/DangerTab";
import { ManageTeamFooter } from "./layout/TeamsManageFooter";
import { UpdateTeamPayload } from "@/app/features/perfil/data/types";

type ManageTeamModeProps = {
  team: TeamSummary;
  membersState: TeamMembersState;
  onGetCandidates: (query: string) => Promise<User[]>;
  onBack: () => void;
  onClose: () => void;
  onUpdateTeam: (teamId: string, payload: UpdateTeamPayload) => Promise<void>;
  onDeleteTeam: (teamId: string) => Promise<void>;
};

export function ManageTeamMode({
  team,
  membersState,
  onGetCandidates,
  onBack,
  onClose,
  onUpdateTeam,
  onDeleteTeam,
}: ManageTeamModeProps) {
  const manageTeam = useManageTeamMode({
    team,
    membersState,
    onGetCandidates,
    onBack,
    onUpdateTeam,
    onDeleteTeam,
  });

  return (
    <>
      <header className="border-b border-neutral-100 px-8 py-6">
        <ManageTeamHeader onBack={onBack} onClose={onClose} />

        <ManageTeamTabs
          activeTab={manageTeam.activeTab}
          pendingMemberChangesCount={manageTeam.pendingMemberChangesCount}
          onChange={manageTeam.setActiveTab}
        />
      </header>

      <form
        onSubmit={manageTeam.handleSubmit}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex-1 overflow-y-auto px-8 py-7">
          {manageTeam.activeTab === "details" && (
            <DetailsTab
              teamName={manageTeam.teamName}
              description={manageTeam.description}
              onTeamNameChange={manageTeam.setTeamName}
              onDescriptionChange={manageTeam.setDescription}
            />
          )}

          {manageTeam.activeTab === "members" && (
            <MembersTab
              membersState={membersState}
              memberSearch={manageTeam.memberSearch}
              onMemberSearchChange={manageTeam.setMemberSearch}
              addedMembers={manageTeam.addedMembers}
              removedMemberIds={manageTeam.removedMemberIds}
              activeOriginalMemberIds={manageTeam.activeOriginalMemberIds}
              addedMemberIds={manageTeam.addedMemberIds}
              filteredCandidates={manageTeam.filteredCandidates}
              isSearchingMembers={manageTeam.isSearchingMembers}
              hasSearchedMembers={manageTeam.hasSearchedMembers}
              onToggleCandidate={manageTeam.handleToggleCandidate}
              onRemoveAddedMember={manageTeam.handleRemoveAddedMember}
              onMarkOriginalMemberForRemoval={
                manageTeam.handleMarkOriginalMemberForRemoval
              }
              onUndoRemoveOriginalMember={
                manageTeam.handleUndoRemoveOriginalMember
              }
            />
          )}

          {manageTeam.activeTab === "danger" && (
            <DangerTab
              team={team}
              isDeleting={manageTeam.isDeleting}
              isSubmitting={manageTeam.isSubmitting}
              showDeleteConfirm={manageTeam.showDeleteConfirm}
              onShowDeleteConfirm={() => manageTeam.setShowDeleteConfirm(true)}
              onHideDeleteConfirm={() => manageTeam.setShowDeleteConfirm(false)}
              onDeleteTeam={manageTeam.handleDeleteTeam}
            />
          )}
        </div>

        <ManageTeamFooter
          hasChanges={manageTeam.hasChanges}
          canSave={manageTeam.canSave}
          isSubmitting={manageTeam.isSubmitting}
          isDeleting={manageTeam.isDeleting}
          onCancel={onBack}
        />
      </form>
    </>
  );
}