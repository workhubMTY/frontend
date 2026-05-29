import { PanelRed } from "@/app/features/home/components/Panels/PanelRed";
import { PanelInvitaciones } from "@/app/features/home/components/Panels/PanelInvitaciones";
import { HomeAgendaPanel } from "@/app/features/home/components/Panels/HomeAgendaPanel";

import type { Persona, DiaInvitaciones } from "@/app/features/home/types/types";
import type { ExternalEvent } from "@/app/features/home/types/Agenda";
import type { EventoGeneralDetail } from "@/app/features/home/components/EventoGeneralDetail";

type HomeDesktopLayoutProps = {
  personas: Persona[];
  invitaciones: DiaInvitaciones[];
  externalEvents: ExternalEvent[];
  carouselProps: React.ComponentProps<typeof EventoGeneralDetail>;

  selectedPerson: number | null;
  selectedInvitationId: string | null;

  onPersonClick: (personIndex: number) => void;
  onInvitationClick: (dayIndex: number, invitationIndex: number) => void;
};

export function HomeDesktopLayout({
  personas,
  invitaciones,
  externalEvents,
  carouselProps,
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

      <div className="col-center flex flex-col min-h-0 gap-3">
        <HomeAgendaPanel
          externalEvents={externalEvents}
          carouselProps={carouselProps}
        />
      </div>

      <div className="col-right flex flex-col bg-white shadow-sm border border-gray-100 overflow-hidden p-4 min-h-0">
        <PanelInvitaciones
          selInv={selectedInvitationId}
          onInvClick={onInvitationClick}
          invitaciones={invitaciones}
        />
      </div>
    </div>
  );
}