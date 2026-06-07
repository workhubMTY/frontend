import { TeamMembersState, TeamSummary } from "../types";
import { TeamListItem } from "./TeamsListItem";
import { TeamsEmptyState } from "./TeamsEmptyState";
import { TeamsListFooter } from "./TeamsListFooter";
import { TeamsListHeader } from "./TeamsListHeader";
import { Message } from "../../../../../../shared/components/Message/Message";

type TeamsListModeProps = {
  search: string;
  teams: TeamSummary[];
  openTeamId: string | null;
  selectedTeamMembersState: TeamMembersState;
  onSearchChange: (value: string) => void;
  onClose: () => void;
  onToggleTeam: (teamId: string) => void;
  onManageTeam: (teamId: string) => void;
  successMessage?: string | null;
  onDismissSuccessMessage: () => void;
  onCreateMode: () => void;
};

export function TeamsListMode({
  search,
  teams,
  openTeamId,
  selectedTeamMembersState,
  onSearchChange,
  onClose,
  onToggleTeam,
  onManageTeam,
  onCreateMode,
  successMessage,
  onDismissSuccessMessage,
}: TeamsListModeProps) {
  const hasTeams = teams.length > 0;

  return (
    <>
      <TeamsListHeader
        search={search}
        onSearchChange={onSearchChange}
        onClose={onClose}
      />

      {successMessage && (
        <Message
          extendClass="bg-green-50 border-green-200 text-green-700"
          autoDismiss={true}
          delay={4000}
          onDismiss={onDismissSuccessMessage}
        >
          {successMessage}
        </Message>
      )}

      <div className="flex-1 overflow-y-auto">
        {hasTeams ? (
          <div className="divide-y divide-neutral-100">
            {teams.map((team) => (
              <TeamListItem
                key={team.id}
                team={team}
                isOpen={openTeamId === team.id}
                membersState={selectedTeamMembersState}
                onToggle={() => onToggleTeam(team.id)}
                onManage={() => onManageTeam(team.id)}
              />
            ))}
          </div>
        ) : (
          <TeamsEmptyState />
        )}
      </div>

      <TeamsListFooter onCreateMode={onCreateMode} />
    </>
  );
}
