import { PanelRed } from "@/app/features/home/components/unused/Panels/PanelRed";
import { HomeAgendaPanel } from "@/app/features/home/components/unused/Panels/HomeAgendaPanel";

import type { Persona, DiaInvitaciones } from "@/app/features/home/types/unused/types";
import type { ExternalEvent } from "@/app/features/home/types/unused/Agenda";
import type { AgendaFilter } from "@/app/features/home/hooks/unused/useHomePage";

type HomeDesktopLayoutProps = {
  personas:          Persona[];
  invitaciones:      DiaInvitaciones[];
  externalEvents:    ExternalEvent[];      // legacy — ya no se usa en agenda
  agendaFilter:      AgendaFilter[];
  selectedPerson:    number | null;
  selectedFriendId:  string | null;
  selectedInvitationId: string | null;
  onPersonClick:     (i: number) => void;
  onFriendClick:     (eId: string) => void;
  onInvitationClick: (d: number, i: number) => void;
};

export function HomeDesktopLayout({
  agendaFilter,
  selectedFriendId,
  onFriendClick,
}: HomeDesktopLayoutProps) {
  return (
    <div className="desktop-grid flex-1 min-h-0">
      <div className="col-left flex flex-col bg-white shadow-sm border border-neutral-100 rounded-xl overflow-hidden min-h-0">
        <PanelRed
          selectedFriendId={selectedFriendId}
          onFriendClick={onFriendClick}
        />
      </div>
      <div className="col-center flex flex-col gap-3 min-h-0">
        <HomeAgendaPanel
          agendaFilter={agendaFilter}
          selectedFriendId={selectedFriendId}
        />
      </div>
    </div>
  );
}