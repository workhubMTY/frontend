import { useState } from "react";

import { useHomePageData } from "@/app/features/home/hooks/unused/useHomePageData";
import { useEventCarousel } from "@/app/features/home/hooks/unused/useEventCarrousel";

export type MobileTab = "agenda" | "red" | "invitaciones";
export type AgendaFilter = "juntas" | "coworking" | "estacionamientos" | "eventos";

export const ALL_AGENDA_FILTERS: AgendaFilter[] = [
  "juntas",
  "coworking",
  "estacionamientos",
  "eventos",
];

export function useHomePage() {
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);
  const [eventOnAgenda, setEventOnAgenda] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("agenda");
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  const [agendaFilter, setAgendaFilter] = useState<AgendaFilter[]>([...ALL_AGENDA_FILTERS]);

  const { personas, invitaciones, eventosGenerales, externalEvents } =
    useHomePageData({ selectedPerson, selectedInvitationId, eventOnAgenda });

  const handlePersonClick = (personIndex: number) => {
    const next = selectedPerson === personIndex ? null : personIndex;
    setSelectedPerson(next);
    if (next !== null) setMobileTab("agenda");
  };

  const handleInvitationClick = (dayIndex: number, invitationIndex: number) => {
    const id = `inv_${dayIndex}_${invitationIndex}`;
    const next = selectedInvitationId === id ? null : id;
    setSelectedInvitationId(next);
    if (next !== null) setMobileTab("agenda");
  };

  const handleFriendClick = (eId: string) => {
    const next = selectedFriendId === eId ? null : eId;
    setSelectedFriendId(next);
    if (next !== null) setMobileTab("agenda");
  };

  const handleAgendaFilterChange = (filters: AgendaFilter[]) => {
    setAgendaFilter(filters);
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
    selectedFriendId,
    agendaFilter,
    mobileTab,
    setMobileTab,
    handlePersonClick,
    handleInvitationClick,
    handleFriendClick,
    handleAgendaFilterChange,
  };
}