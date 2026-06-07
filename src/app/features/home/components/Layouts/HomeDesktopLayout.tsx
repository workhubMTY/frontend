import { PanelRed } from "@/app/features/home/components/Panels/PanelRed";
import { HomeAgendaPanel } from "@/app/features/home/components/Panels/HomeAgendaPanel";

import type { Persona, DiaInvitaciones } from "@/app/features/home/types/types";
import type { ExternalEvent } from "@/app/features/home/types/Agenda";

type HomeDesktopLayoutProps = {
  personas: Persona[];
  invitaciones: DiaInvitaciones[];
  externalEvents: ExternalEvent[];

  selectedPerson: number | null;
  selectedInvitationId: string | null;

  onPersonClick: (personIndex: number) => void;
  onInvitationClick: (dayIndex: number, invitationIndex: number) => void;
};

export function HomeDesktopLayout({
  personas,
  invitaciones,
  externalEvents,
  selectedPerson,
  selectedInvitationId,
  onPersonClick,
  onInvitationClick,
}: HomeDesktopLayoutProps) {
  return (
    <div className="desktop-grid hidden sm:flex flex-1 min-h-0 flex-col">
      <div className="col-left flex flex-col bg-container shadow-sm border border-neutral-1 overflow-hidden p-4 min-h-0">
        <PanelRed
          selectedPerson={selectedPerson}
          onPersonClick={onPersonClick}
          personas={personas}
        />
      </div>

      <div className="col-center flex flex-col gap-3">
        <HomeAgendaPanel
          externalEvents={externalEvents}
        />
      </div>
    </div>
  );
}