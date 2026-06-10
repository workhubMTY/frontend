"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/app/shared/socket/socket.context";
import type { OfficeUpdateMessage } from "@/app/shared/socket/socket.context";

import { activeReservationsApi } from "./activeReservationsApi";
import type {
  ActiveReservation,
  ReservationInvitation,
  UpdateParticipantAttendancePayload,
} from "../types/activeReservations";

export const activeReservationKeys = {
  all: ["active-reservations"] as const,

  mine: (userId: string) =>
    [...activeReservationKeys.all, "mine", userId] as const,

  invitations: (userId: string) =>
    [...activeReservationKeys.all, "invitations", userId] as const,
};

const RESERVATION_MUTATION_EVENTS: OfficeUpdateMessage["type"][] = [
  "reservation.created",
  "reservation.canceled",
  "reservation.checkedin",
  "reservation.checkedout",
  "reservation.noshow",
  "reservation.attendance_updated",
  "participant.updated",
];

function useInvalidateOnOfficeUpdate(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useEffect(() => {
    function onOfficeUpdate(msg: OfficeUpdateMessage) {
      if (RESERVATION_MUTATION_EVENTS.includes(msg.type)) {
        queryClient.invalidateQueries({ queryKey });
      }
    }

    socket.on("officeUpdate", onOfficeUpdate);
    return () => {
      socket.off("officeUpdate", onOfficeUpdate);
    };
  }, [socket, queryClient, queryKey]);
}

export function useUserActiveReservations(myUserId: string) {
  const queryKey = activeReservationKeys.mine(myUserId);
  const queryClient = useQueryClient();

  useInvalidateOnOfficeUpdate(queryKey);

  const query = useQuery<ActiveReservation[]>({
    queryKey,
    queryFn: () => activeReservationsApi.getMyActiveReservations(myUserId),
    enabled: Boolean(myUserId),
    staleTime: 1000 * 30,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey });

  const checkin = useMutation({
    mutationFn: (reservationId: number) => {
      const reservation = query.data?.find((r) => r.id === reservationId);
      if (!reservation) throw new Error("Reservación no encontrada");
      if (reservation.myAttendanceStatus !== "NOT_ARRIVED") {
        throw new Error(
          `No puedes hacer checkin desde el estado "${reservation.myAttendanceStatus}"`,
        );
      }
      return activeReservationsApi.checkinReservation(reservationId);
    },
    onSuccess: invalidate,
  });

  const checkout = useMutation({
    mutationFn: (reservationId: number) => {
      const reservation = query.data?.find((r) => r.id === reservationId);
      if (!reservation) throw new Error("Reservación no encontrada");
      if (reservation.myAttendanceStatus !== "CHECKED_IN") {
        throw new Error(
          `No puedes hacer checkout desde el estado "${reservation.myAttendanceStatus}"`,
        );
      }
      return activeReservationsApi.checkoutReservation(reservationId);
    },
    onSuccess: invalidate,
  });

  const cancel = useMutation({
    mutationFn: (reservationId: number) => {
      const reservation = query.data?.find((r) => r.id === reservationId);
      if (!reservation) throw new Error("Reservación no encontrada");
      if (reservation.myAttendanceStatus !== "NOT_ARRIVED") {
        throw new Error(
          `No puedes cancelar desde el estado "${reservation.myAttendanceStatus}"`,
        );
      }
      return activeReservationsApi.cancelReservation(reservationId);
    },
    onSuccess: invalidate,
  });

  const addParticipant = useMutation({
    mutationFn: ({
      reservationId,
      userId,
    }: {
      reservationId: number;
      userId: string;
    }) =>
      activeReservationsApi.addParticipantToReservation(reservationId, userId),
    onSuccess: invalidate,
  });

  const removeParticipant = useMutation({
    mutationFn: ({
      reservationId,
      participantId,
    }: {
      reservationId: number;
      participantId: number;
    }) =>
      activeReservationsApi.removeParticipantFromReservation(
        reservationId,
        participantId,
      ),
    onSuccess: invalidate,
  });

  return {
    reservations: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    checkin,
    checkout,
    cancel,
    addParticipant,
    removeParticipant,
  };
}

export function useUserReservationInvitations(myUserId: string) {
  const queryKey = activeReservationKeys.invitations(myUserId);
  const queryClient = useQueryClient();

  useInvalidateOnOfficeUpdate(queryKey);

  const query = useQuery<ReservationInvitation[]>({
    queryKey,
    queryFn: () => activeReservationsApi.getMyInvitations(myUserId),
    enabled: Boolean(myUserId),
    staleTime: 1000 * 30,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey });

  const accept = useMutation({
    mutationFn: ({
      reservationId,
      participantId,
    }: {
      reservationId: number;
      participantId: number;
    }) => {
      const invitation = query.data?.find((r) => r.id === reservationId);
      if (!invitation) throw new Error("Invitación no encontrada");
      if (invitation.myAttendanceStatus !== "INVITED") {
        throw new Error("Solo puedes aceptar una invitación en estado INVITED");
      }

      const payload: UpdateParticipantAttendancePayload = {
        reservationId,
        participantId,
        attendance_status: "NOT_ARRIVED",
      };
      return activeReservationsApi.updateParticipantAttendance(payload);
    },
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({
        queryKey: activeReservationKeys.mine(myUserId),
      });
    },
  });

  const reject = useMutation({
    mutationFn: ({
      reservationId,
      participantId,
    }: {
      reservationId: number;
      participantId: number;
    }) => {
      const invitation = query.data?.find((r) => r.id === reservationId);
      if (!invitation) throw new Error("Invitación no encontrada");
      if (invitation.myAttendanceStatus !== "INVITED") {
        throw new Error("Solo puedes rechazar una invitación en estado INVITED");
      }

      const payload: UpdateParticipantAttendancePayload = {
        reservationId,
        participantId,
        attendance_status: "REJECTED",
      };
      return activeReservationsApi.updateParticipantAttendance(payload);
    },
    onSuccess: invalidate,
  });

  return {
    invitations: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    pendingCount: query.data?.length ?? 0,

    accept,
    reject,
  };
}
