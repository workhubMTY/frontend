import { PanelRed } from "@/app/features/home/components/PanelRed";
import { PanelInvitaciones } from "@/app/features/home/components/PanelInvitaciones";
import { HomeAgendaPanel } from "@/app/features/home/components/HomeAgendaPanel";

import type { MobileTab } from "@/app/features/home/hooks/useHomePage";
import type { Persona, DiaInvitaciones } from "@/app/features/home/types/types";
import type { ExternalEvent } from "@/app/features/home/types/Agenda";
import type { EventoGeneralDetail } from "@/app/features/home/components/EventoGeneralDetail";

type HomeMobileLayoutProps = {
  mobileTab: MobileTab;

  personas: Persona[];
  invitaciones: DiaInvitaciones[];
  externalEvents: ExternalEvent[];
  carouselProps: React.ComponentProps<typeof EventoGeneralDetail>;

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
  carouselProps,
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
          carouselProps={carouselProps}
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

      {mobileTab === "invitaciones" && (
        <div className="flex flex-1 min-h-0 flex-col rounded-xl bg-white shadow-sm border border-gray-100 p-4 overflow-hidden">
          <PanelInvitaciones
            selInv={selectedInvitationId}
            onInvClick={onInvitationClick}
            invitaciones={invitaciones}
          />
        </div>
      )}
    </div>
  );
}