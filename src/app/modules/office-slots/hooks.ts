"use client";

import { useQuery } from "@tanstack/react-query";
import { officeSlotsApi } from "./api";
import type { GetEventsQuery } from "./types";

export function useMyReservations() {
  const query = useQuery({
    queryKey: ["reservations", "me"],
    queryFn: () => officeSlotsApi.getMyReservations(),
  });

  return {
    ...query,
  };
}

export function useFriendsReservations() {
  const query = useQuery({
    queryKey: ["reservations", "friends"],
    queryFn: () => officeSlotsApi.getFriendsReservations(),
  });

  return {
    ...query,
  };
}

export function useReservationDetail(id: number | null) {
  const query = useQuery({
    queryKey: ["reservations", "detail", id],
    queryFn: () => officeSlotsApi.getReservationDetail(id as number),
    enabled: id !== null,
  });

  return {
    ...query,
  };
}

export function useEvents(query?: GetEventsQuery) {
  const queryResult = useQuery({
    queryKey: ["reservations", "events", query ?? {}],
    queryFn: () => officeSlotsApi.getEvents(query),
  });

  return {
    ...queryResult,
  };
}
