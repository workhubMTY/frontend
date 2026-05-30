import { Loader2 } from "lucide-react";
import { TeamMembersState } from "../types";
import { Avatar } from "../TeamsDrawer";

type TeamMembersPanelProps = {
  id: string;
  membersState: TeamMembersState;
};

export function TeamMembersPanel({ id, membersState }: TeamMembersPanelProps) {
  const isLoading = membersState?.loading;
  const error = membersState?.error;
  const members = membersState?.members ?? [];

  return (
    <div id={id} className="mt-5 border border-neutral-200 bg-white">
      <div className="grid grid-cols-[1fr_auto] border-b border-neutral-100 px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
        <span>Miembros</span>
        <span>Miembro desde</span>
      </div>

      {isLoading && <TeamMembersLoading />}

      {error && <TeamMembersError message={error} />}

      {!isLoading && !error && members.length === 0 && <TeamMembersEmpty />}

      {!isLoading && !error && members.length > 0 && (
        <div className="max-h-[280px] overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.eId}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-100 px-5 py-4 last:border-b-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={member.name} src={member.avatarUrl} />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-950">
                    {member.name}
                  </p>

                  <p className="truncate text-xs text-neutral-500">
                    {member.email}
                  </p>
                </div>
              </div>

              {"joinedAt" in member && (
                <p className="whitespace-nowrap text-sm text-neutral-500">
                  {String(member.joinedAt ?? "—")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamMembersLoading() {
  return (
    <div className="flex items-center gap-3 px-5 py-6 text-sm text-neutral-500">
      <Loader2 size={17} className="animate-spin" />
      Cargando miembros...
    </div>
  );
}

function TeamMembersError({ message }: { message: string }) {
  return <div className="px-5 py-6 text-sm text-red-600">{message}</div>;
}

function TeamMembersEmpty() {
  return (
    <div className="px-5 py-6 text-sm text-neutral-500">
      Este equipo todavía no tiene miembros registrados.
    </div>
  );
}