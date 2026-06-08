import { PanelRed } from "@/app/features/home/components/Panels/PanelRed";
import { HomeAgendaPanel } from "@/app/features/home/components/Panels/HomeAgendaPanel";

import type { MobileTab } from "@/app/features/home/hooks/useHomePage";
import type { Persona, DiaInvitaciones } from "@/app/features/home/types/types";
import type { ExternalEvent } from "@/app/features/home/types/Agenda";
import type { AgendaFilter } from "@/app/features/home/hooks/useHomePage";

type HomeMobileLayoutProps = {
  mobileTab: MobileTab;
  personas: Persona[];
  invitaciones: DiaInvitaciones[];
  externalEvents: ExternalEvent[];
  agendaFilter: AgendaFilter[];
  selectedPerson: number | null;
  selectedFriendId: string | null;
  selectedInvitationId: string | null;
  onPersonClick: (i: number) => void;
  onFriendClick: (eId: string) => void;
  onInvitationClick: (d: number, i: number) => void;
};

export function HomeMobileLayout({
  mobileTab,
  agendaFilter,
  selectedFriendId,
  onFriendClick,
}: HomeMobileLayoutProps) {
  return (
    <div className="flex sm:hidden flex-1 min-h-0 flex-col">
      {mobileTab === "agenda" && (
        <HomeAgendaPanel
          variant="mobile"
          agendaFilter={agendaFilter}
          selectedFriendId={selectedFriendId}
        />
      )}

      {mobileTab === "red" && (
        <div className="flex flex-1 min-h-0 flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <PanelRed
            selectedFriendId={selectedFriendId}
            onFriendClick={onFriendClick}
          />
        </div>
      )}

      {mobileTab === "invitaciones" && (
        <div className="flex flex-1 min-h-0 flex-col rounded-xl bg-white shadow-sm border border-gray-100 p-4 overflow-hidden items-center justify-center">
          <p className="text-sm text-neutral-400">Sin invitaciones pendientes</p>
        </div>
      )}
    </div>
  );
}