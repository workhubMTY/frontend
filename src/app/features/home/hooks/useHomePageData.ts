import { useMemo } from "react";

import { useFriends } from "@/app/shared/data/friendships/hooks";

import {
  useEvents,
  useFriendsReservations,
  useMyReservations,
} from "@/app/features/cubiculos/data/hooks";

import { getInitials } from "@/app/features/home/utils/utils";

import type {
  DiaInvitaciones,
  EventoGeneral,
  Persona,
} from "@/app/features/home/types/types";

import type { ExternalEvent } from "@/app/features/home/types/Agenda";

import {
  DIAS,
  getEmptyEventoGeneral,
  mapEventToEventoGeneral,
  mapPendingReservationToInvitacion,
  mapReservationToReserva,
} from "@/app/features/home/lib/homeMappers";

type UseHomePageDataParams = {
  selectedPerson: number | null;
  selectedInvitationId: string | null;
  eventOnAgenda: string | null;
};

export function useHomePageData({
  selectedPerson,
  selectedInvitationId,
  eventOnAgenda,
}: UseHomePageDataParams) {
  const { data: friends = [] } = useFriends();
  const { data: friendsReservations = [] } = useFriendsReservations();
  const { data: myReservationsData } = useMyReservations();
  const { data: eventsData = [] } = useEvents();

  const personas = useMemo<Persona[]>(() => {
    return friends.map((friend: any) => {
      const friendReservations = friendsReservations.find(
        (item: any) => item.user_id === friend.eId,
      );

      const reservas = (friendReservations?.reservations ?? [])
        .filter((reservation: any) => reservation.status === "ACCEPTED")
        .map(mapReservationToReserva);

      return {
        id: friend.eId,
        initials: getInitials(friend.name),
        name: friend.name,
        role: friend.roleName,
        userId: friend.eId,
        reservas,
      };
    });
  }, [friends, friendsReservations]);

  const invitaciones = useMemo<DiaInvitaciones[]>(() => {
    const groupedInvitations = new Map<number, DiaInvitaciones["items"]>();

    (myReservationsData?.reservations ?? [])
      .filter((reservation: any) => reservation.status === "PENDING")
      .forEach((reservation: any) => {
        const invitation = mapPendingReservationToInvitacion(reservation);
        const dayInvitations = groupedInvitations.get(invitation.day) ?? [];

        groupedInvitations.set(invitation.day, [
          ...dayInvitations,
          invitation,
        ]);
      });

    return Array.from(groupedInvitations.entries())
      .sort(([firstDay], [secondDay]) => firstDay - secondDay)
      .map(([dayIndex, items]) => ({
        dia: DIAS[dayIndex],
        dayIndex,
        items,
      }));
  }, [myReservationsData]);

  const eventosGenerales = useMemo<EventoGeneral[]>(() => {
    if (!eventsData.length) {
      return [getEmptyEventoGeneral()];
    }

    return eventsData.map(mapEventToEventoGeneral);
  }, [eventsData]);

  const myAcceptedReservations = useMemo(() => {
    return (myReservationsData?.reservations ?? [])
      .filter((reservation: any) => reservation.status === "ACCEPTED")
      .map(mapReservationToReserva);
  }, [myReservationsData]);

  const externalEvents = useMemo<ExternalEvent[]>(() => {
    const events: ExternalEvent[] = [];

    myAcceptedReservations.forEach((reservation) => {
      events.push({
        day: reservation.day,
        start: reservation.start,
        end: reservation.end,
        label: reservation.titulo,
        sublabel: reservation.lugar,
        kind: "friend",
      });
    });

    if (selectedPerson !== null) {
      const person = personas[selectedPerson];

      person?.reservas.forEach((reservation) => {
        events.push({
          day: reservation.day,
          start: reservation.start,
          end: reservation.end,
          label: reservation.titulo,
          sublabel: reservation.lugar,
          kind: "friend",
        });
      });
    }

    if (selectedInvitationId !== null) {
      invitaciones.forEach((section) => {
        section.items.forEach((invitation, invitationIndex) => {
          const invitationId = `inv_${section.dayIndex}_${invitationIndex}`;

          if (selectedInvitationId !== invitationId) return;

          events.push({
            day: invitation.day,
            start: invitation.start,
            end: invitation.end,
            label: invitation.nombre,
            sublabel: invitation.sala,
            kind: "invitation",
          });
        });
      });
    }

    eventosGenerales.forEach((event) => {
      if (event.tipo !== "Festivo") return;

      events.push({
        day: event.day,
        start: 6,
        end: 18,
        label: event.titulo,
        kind: "holiday",
      });
    });

    if (eventOnAgenda) {
      const selectedEvent = eventosGenerales.find(
        (event) => event.titulo === eventOnAgenda,
      );

      if (selectedEvent) {
        events.push({
          day: selectedEvent.day,
          start: selectedEvent.start,
          end: selectedEvent.end,
          label: selectedEvent.titulo,
          sublabel: selectedEvent.descripcion,
          kind: "holiday",
        });
      }
    }

    return events;
  }, [
    myAcceptedReservations,
    selectedPerson,
    personas,
    selectedInvitationId,
    invitaciones,
    eventosGenerales,
    eventOnAgenda,
  ]);

  return {
    personas,
    invitaciones,
    eventosGenerales,
    externalEvents,
  };
}