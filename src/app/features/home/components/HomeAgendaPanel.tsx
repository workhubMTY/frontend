import AgendaRapida from "@/app/features/home/components/AgendaRapida/AgendaRapida";
import { EventoGeneralDetail } from "@/app/features/home/components/EventoGeneralDetail";

import type { ExternalEvent } from "@/app/features/home/types/Agenda";

type HomeAgendaPanelProps = {
  externalEvents: ExternalEvent[];
  carouselProps: React.ComponentProps<typeof EventoGeneralDetail>;
  variant?: "desktop" | "mobile";
};

export function HomeAgendaPanel({
  externalEvents,
  carouselProps,
  variant = "desktop",
}: HomeAgendaPanelProps) {
  const agendaContainerClass =
    variant === "mobile"
      ? "flex-1 min-h-0 overflow-hidden rounded-xl shadow-sm border border-gray-100 bg-white"
      : "flex-1 min-h-0 overflow-hidden shadow-sm border border-neutral-1 bg-container";

  return (
    <div className="flex flex-col min-h-0 gap-3 flex-1">
      <div className={agendaContainerClass}>
        <AgendaRapida externalEvents={externalEvents} />
      </div>

      <EventoGeneralDetail {...carouselProps} />
    </div>
  );
}