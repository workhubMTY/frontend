"use client";

import { useMemo } from "react";
import { useWeekReservations } from "./useWeekReservations";
import { parkingToEvents, officeToEvents, filterEvents } from "../utils/reservationToEvent";
import type { AgendaFilter } from "./useHomePage";
import type { ExternalEvent } from "../types/Agenda";

type Params = {
  weekOffset:       number;
  selectedFriendId: string | null;
  agendaFilter:     AgendaFilter[];
};

export function useReservationEvents({ weekOffset, selectedFriendId, agendaFilter }: Params) {
  // Propias: siempre con /me (sin userId)
  const own = useWeekReservations({ weekOffset });

  // Amigo: solo si hay uno seleccionado
  const friend = useWeekReservations({
    weekOffset,
    userId: selectedFriendId ?? undefined,
  });

  const events = useMemo<ExternalEvent[]>(() => {
    const ownParking = parkingToEvents(own.parking, false, weekOffset);
    const ownOffice  = officeToEvents(own.office,   false, weekOffset);
    const frdParking = selectedFriendId ? parkingToEvents(friend.parking, true, weekOffset) : [];
    const frdOffice  = selectedFriendId ? officeToEvents(friend.office,   true, weekOffset) : [];

    const all = [...ownParking, ...ownOffice, ...frdParking, ...frdOffice];
    
    console.log("all events before filter:", all.length);
    const filtered = filterEvents(all, agendaFilter);
    console.log("filtered events:", filtered.length);
    
    return filtered;
  }, [own.parking, own.office, friend.parking, friend.office, selectedFriendId, agendaFilter, weekOffset]);

  return {
    events,
    loading: own.loading || (!!selectedFriendId && friend.loading),
    error:   own.error ?? friend.error,
  };
}