import { PanelRed } from "@/app/features/home/components/Panels/PanelRed";
import { HomeAgendaPanel } from "@/app/features/home/components/Panels/HomeAgendaPanel";

import type { MobileTab } from "@/app/features/home/hooks/useHomePage";
import type { Persona, DiaInvitaciones } from "@/app/features/home/types/types";
import type { ExternalEvent } from "@/app/features/home/types/Agenda";

type HomeMobileLayoutProps = {
  mobileTab: MobileTab;

  personas: Persona[];
  invitaciones: DiaInvitaciones[];
  externalEvents: ExternalEvent[];

  selectedPerson: number | null;
  selectedInvitationId: string | null;

  onPersonClick: (personIndex: number) => void;
  onInvitationClick: (dayIndex: number, invitationIndex: number) => void;
};

export function HomeMobileLayout({
  mobileTab,
  personas,
  invitaciones,
  externalEvents,
  selectedPerson,
  selectedInvitationId,
  onPersonClick,
  onInvitationClick,
}: HomeMobileLayoutProps) {
  return (
    <div className="flex sm:hidden flex-1 min-h-0 flex-col">
      {mobileTab === "agenda" && (
        <HomeAgendaPanel
          variant="mobile"
          externalEvents={externalEvents}
        />
      )}

      {mobileTab === "red" && (
        <div className="flex flex-1 min-h-0 flex-col rounded-xl bg-white shadow-sm border border-gray-100 p-4 overflow-hidden">
          <PanelRed
            selectedPerson={selectedPerson}
            onPersonClick={onPersonClick}
            personas={personas}
          />
        </div>
      )}
    </div>
  );
}