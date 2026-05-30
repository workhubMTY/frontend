import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { TeamMembersState, TeamSummary } from "../types";
import { getInitials } from "../../../../lib/formatting";
import { TeamMembersPanel } from "./TeamMembersPanel";

type TeamListItemProps = {
  team: TeamSummary;
  isOpen: boolean;
  membersState: TeamMembersState;
  onToggle: () => void;
  onManage: () => void;
};

export function TeamListItem({
  team,
  isOpen,
  membersState,
  onToggle,
  onManage,
}: TeamListItemProps) {
  const membersPanelId = `team-members-${team.id}`;

  return (
    <article className="px-8 py-6">
      <div className="grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-4">
        <button
          type="button"
          onClick={onToggle}
          className="contents text-left"
          aria-expanded={isOpen}
          aria-controls={membersPanelId}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700">
            {getInitials(team.name)}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-neutral-950">
              {team.name}
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              {team.memberCount} miembros
              {team.userRole ? ` · ${team.userRole}` : ""}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={onManage}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950"
        >
          <Settings size={15} />
          Administrar
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          aria-label={isOpen ? "Ocultar miembros" : "Ver miembros"}
          aria-expanded={isOpen}
          aria-controls={membersPanelId}
        >
          {isOpen ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
        </button>
      </div>

      {isOpen && (
        <TeamMembersPanel id={membersPanelId} membersState={membersState} />
      )}
    </article>
  );
}