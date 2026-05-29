import { useState } from "react";

import { useHomePageData } from "@/app/features/home/hooks/useHomePageData";
import { useEventCarousel } from "@/app/features/home/hooks/useEventCarrousel";

export type MobileTab = "agenda" | "red" | "invitaciones";

export function useHomePage() {
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(
    null,
  );
  const [eventOnAgenda, setEventOnAgenda] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("agenda");

  const { personas, invitaciones, eventosGenerales, externalEvents } =
    useHomePageData({
      selectedPerson,
      selectedInvitationId,
      eventOnAgenda,
    });

  const handlePersonClick = (personIndex: number) => {
    const nextPerson = selectedPerson === personIndex ? null : personIndex;

    setSelectedPerson(nextPerson);

    if (nextPerson !== null) {
      setMobileTab("agenda");
    }
  };

  const handleInvitationClick = (dayIndex: number, invitationIndex: number) => {
    const invitationId = `inv_${dayIndex}_${invitationIndex}`;
    const nextInvitationId =
      selectedInvitationId === invitationId ? null : invitationId;

    setSelectedInvitationId(nextInvitationId);

    if (nextInvitationId !== null) {
      setMobileTab("agenda");
    }
  };

  const { carouselProps } = useEventCarousel({
    eventosGenerales,
    onViewEventInAgenda: (eventTitle) => {
      setEventOnAgenda(eventTitle);
      setMobileTab("agenda");
    },
  });

  return {
    personas,
    invitaciones,
    externalEvents,
    carouselProps,

    selectedPerson,
    selectedInvitationId,

    mobileTab,
    setMobileTab,

    handlePersonClick,
    handleInvitationClick,
  };
}