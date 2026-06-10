import { useState } from "react";

import type { EventoGeneral } from "@/app/features/home/types/unused/types";

type UseEventCarouselParams = {
  eventosGenerales: EventoGeneral[];
  onViewEventInAgenda: (eventTitle: string) => void;
};

export function useEventCarousel({
  eventosGenerales,
  onViewEventInAgenda,
}: UseEventCarouselParams) {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const currentEvent =
    eventosGenerales[currentEventIndex] ?? eventosGenerales[0];

  const goToPreviousEvent = () => {
    setCurrentEventIndex(
      (currentIndex) =>
        (currentIndex - 1 + eventosGenerales.length) %
        eventosGenerales.length,
    );
  };

  const goToNextEvent = () => {
    setCurrentEventIndex(
      (currentIndex) => (currentIndex + 1) % eventosGenerales.length,
    );
  };

  const viewCurrentEventInAgenda = () => {
    if (!currentEvent) return;

    onViewEventInAgenda(currentEvent.titulo);
  };

  return {
    currentEvent,
    currentEventIndex,
    setCurrentEventIndex,
    carouselProps: {
      evento: currentEvent,
      onPrev: goToPreviousEvent,
      onNext: goToNextEvent,
      dotCount: eventosGenerales.length,
      dotActive: currentEventIndex,
      onDot: setCurrentEventIndex,
      onViewInAgenda: viewCurrentEventInAgenda,
    },
  };
}