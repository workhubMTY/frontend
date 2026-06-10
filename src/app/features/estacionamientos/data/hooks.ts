"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/app/shared/socket/socket.context";

import { parkingLotsApi, parkingReservationsApi } from "./api";
import type {
  ParkingLot,
  UpdateParkingLot,
  CreateParkingLot,
  ListReservationsQuery,
  ReservationBucketsQuery,
  CreateParkingReservation,
  PatchAttendance,
  ParkingReservation,
  ParkingUpdateMessage,
  ParkingReservationPublic,
  ListReservationsResponse,
  ReservationDetailResponse,
} from "./types";
export const parkingKeys = {
  all: () => ["parking"] as const,
  lots: () => ["parking", "lots"] as const,
  lotDetail: (id: number) => ["parking", "lots", id] as const,

  reservations: () => ["parking", "reservations"] as const,
  reservationsList: (q?: ListReservationsQuery) =>
    ["parking", "reservations", "list", q ?? {}] as const,

  myReservations: (q?: ListReservationsQuery) =>
    ["parking", "reservations", "me", q ?? {}] as const,

  reservationDetail: (id: number) =>
    ["parking", "reservations", "detail", id] as const,

  buckets: (q?: ReservationBucketsQuery) =>
    ["parking", "buckets", q ?? {}] as const,
} as const;

function patchReservationInList(
  existing: ListReservationsResponse,
  pub: ParkingReservationPublic,
): ListReservationsResponse {
  return {
    items: existing.items.map((r) =>
      r.id === pub.id
        ? {
          ...r,
          lifecycle_status: pub.lifecycle_status,
          attendance_status: pub.attendance_status,
          allocation_state: pub.allocation_state,
          updated_at: pub.updated_at,
        }
        : r,
    ),
  };
}

function patchReservationDetail(
  existing: ReservationDetailResponse,
  pub: ParkingReservationPublic,
): ReservationDetailResponse {
  return {
    ...existing,
    reservation: {
      ...existing.reservation,
      lifecycle_status: pub.lifecycle_status,
      attendance_status: pub.attendance_status,
      allocation_state: pub.allocation_state,
      updated_at: pub.updated_at,
    },
  };
}

function useJoinParkingRoom() {
  const socket = useSocket();

  useEffect(() => {
    socket.emit("joinParkingRoom");
    return () => {
      socket.emit("leaveParkingRoom");
    };
  }, [socket]);
}

export function useParkingLots() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinParkingRoom();

  const query = useQuery({
    queryKey: parkingKeys.lots(),
    queryFn: () => parkingLotsApi.getAll(),
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    function onParkingUpdate(msg: ParkingUpdateMessage) {
      if (msg.type === "lot.created") {
        queryClient.setQueryData<ParkingLot[]>(parkingKeys.lots(), (prev) => {
          if (!prev) return prev;
          const exists = prev.some((l) => l.id === msg.payload.id);
          return exists ? prev : [...prev, msg.payload];
        });
        return;
      }

      if (msg.type === "lot.updated") {
        queryClient.setQueryData<ParkingLot[]>(parkingKeys.lots(), (prev) => {
          if (!prev) return prev;
          return prev.map((l) => (l.id === msg.payload.id ? msg.payload : l));
        });
        queryClient.setQueryData<ParkingLot>(
          parkingKeys.lotDetail(msg.payload.id),
          (prev) => (prev ? msg.payload : prev),
        );
        return;
      }

      if (msg.type === "lot.deleted") {
        queryClient.invalidateQueries({ queryKey: parkingKeys.lots() });
        queryClient.removeQueries({
          queryKey: parkingKeys.lotDetail(msg.payload.id),
        });
      }
    }

    socket.on("parkingUpdate", onParkingUpdate);
    return () => {
      socket.off("parkingUpdate", onParkingUpdate);
    };
  }, [socket, queryClient]);

  const createLot = useMutation({
    mutationFn: (payload: CreateParkingLot) => parkingLotsApi.create(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: parkingKeys.lots() }),
  });

  const updateLot = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateParkingLot }) =>
      parkingLotsApi.update(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: parkingKeys.lots() }),
  });

  const deleteLot = useMutation({
    mutationFn: (id: number) => parkingLotsApi.remove(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: parkingKeys.lots() }),
  });

  return { ...query, createLot, updateLot, deleteLot };
}

export function useParkingLotDetail(id: number) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinParkingRoom();

  const query = useQuery({
    queryKey: parkingKeys.lotDetail(id),
    queryFn: () => parkingLotsApi.getById(id),
    enabled: id > 0,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    function onParkingUpdate(msg: ParkingUpdateMessage) {
      if (msg.type === "lot.updated" && msg.payload.id === id) {
        queryClient.setQueryData<ParkingLot>(
          parkingKeys.lotDetail(id),
          (prev) => (prev ? msg.payload : prev),
        );
      }
      if (msg.type === "lot.deleted" && msg.payload.id === id) {
        queryClient.removeQueries({ queryKey: parkingKeys.lotDetail(id) });
      }
    }

    socket.on("parkingUpdate", onParkingUpdate);
    return () => {
      socket.off("parkingUpdate", onParkingUpdate);
    };
  }, [socket, queryClient, id]);

  return query;
} export function useParkingReservations(
  query?: ListReservationsQuery,
  options?: {
    enabled?: boolean;
  },
) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinParkingRoom();

  const queryResult = useQuery({
    queryKey: parkingKeys.reservationsList(query),
    queryFn: () => parkingReservationsApi.list(query),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    const key = parkingKeys.reservationsList(query);

    function onParkingUpdate(msg: ParkingUpdateMessage) {
      if (msg.type === "reservation.created") {
        console.log("llego un reservation.created")
        queryClient.invalidateQueries({ queryKey: key });
        return;
      }

      if (
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.attendance_updated" ||
        msg.type === "reservation.no_show"
      ) {
        queryClient.setQueryData<ListReservationsResponse>(key, (prev) => {
          if (!prev) return prev;
          return patchReservationInList(prev, msg.payload);
        });
      }
    }

    socket.on("parkingUpdate", onParkingUpdate);
    return () => {
      socket.off("parkingUpdate", onParkingUpdate);
    };
  }, [socket, queryClient, query]);

  const createReservation = useMutation({
    mutationFn: (payload: CreateParkingReservation) =>
      parkingReservationsApi.create(payload),
    onSuccess: () =>
    {
      queryClient.invalidateQueries({ queryKey: parkingKeys.reservations() })
      queryClient.invalidateQueries({ queryKey: parkingKeys.myReservations() })
    },
  });

  const cancelReservation = useMutation({
    mutationFn: (id: number) => parkingReservationsApi.cancel(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: parkingKeys.reservations() }),
  });

  const patchAttendance = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PatchAttendance }) =>
      parkingReservationsApi.patchAttendance(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: parkingKeys.reservations() }),
  });

  return {
    ...queryResult,
    createReservation,
    cancelReservation,
    patchAttendance,
  };
}

export function useParkingReservationDetail(id: number) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinParkingRoom();

  const query = useQuery({
    queryKey: parkingKeys.reservationDetail(id),
    queryFn: () => parkingReservationsApi.getDetail(id),
    enabled: id > 0,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    function onParkingUpdate(msg: ParkingUpdateMessage) {
      // Solo los eventos con ParkingReservationPublic como payload
      if (
        msg.type !== "reservation.canceled" &&
        msg.type !== "reservation.attendance_updated" &&
        msg.type !== "reservation.no_show"
      ) return;

      if (msg.payload.id !== id) return;

      queryClient.setQueryData<ReservationDetailResponse>(
        parkingKeys.reservationDetail(id),
        (prev) => (prev ? patchReservationDetail(prev, msg.payload) : prev),
      );
    }

    socket.on("parkingUpdate", onParkingUpdate);
    return () => {
      socket.off("parkingUpdate", onParkingUpdate);
    };
  }, [socket, queryClient, id]);

  const cancelReservation = useMutation({
    mutationFn: () => parkingReservationsApi.cancel(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: parkingKeys.reservationDetail(id),
      }),
  });

  const patchAttendance = useMutation({
    mutationFn: (payload: PatchAttendance) =>
      parkingReservationsApi.patchAttendance(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: parkingKeys.reservationDetail(id),
      }),
  });

  return { ...query, cancelReservation, patchAttendance };
}
export function useParkingBuckets(
  query?: ReservationBucketsQuery,
  options?: {
    enabled?: boolean;
  },
) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinParkingRoom();

  const queryResult = useQuery({
    queryKey: parkingKeys.buckets(query),
    queryFn: () => parkingReservationsApi.getBuckets(query!),
    enabled:
      Boolean(query?.start_time && query?.end_time) &&
      (options?.enabled ?? true),
    staleTime: 1000 * 15,
  });

  useEffect(() => {
    if (!query) return;

    function onParkingUpdate(msg: ParkingUpdateMessage) {
      if (
        msg.type === "reservation.created" ||
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.no_show"
      ) {
        queryClient.invalidateQueries({
          queryKey: parkingKeys.buckets(query),
        });
      }
    }

    socket.on("parkingUpdate", onParkingUpdate);
    return () => {
      socket.off("parkingUpdate", onParkingUpdate);
    };
  }, [socket, queryClient, query]);

  return queryResult;
}
export function useMyParkingReservations(
  query?: ListReservationsQuery,
  options?: { enabled?: boolean },
) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useJoinParkingRoom();

  const queryResult = useQuery({
    queryKey: parkingKeys.myReservations(query),
    queryFn: () => parkingReservationsApi.getMyReservations(query),
    enabled: Boolean(query) && (options?.enabled ?? true),
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (!query) return;

    const key = parkingKeys.myReservations(query);

    function onParkingUpdate(msg: ParkingUpdateMessage) {
      if (msg.type === "reservation.created") {
        queryClient.invalidateQueries({ queryKey: key });
        return;
      }

      if (
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.attendance_updated" ||
        msg.type === "reservation.no_show"
      ) {
        queryClient.setQueryData<ListReservationsResponse>(key, (prev) => {
          if (!prev) return prev;
          return patchReservationInList(prev, msg.payload);
        });
      }
    }

    socket.on("parkingUpdate", onParkingUpdate);
    return () => {
      socket.off("parkingUpdate", onParkingUpdate);
    };
  }, [socket, queryClient, query]);

  return queryResult;
}