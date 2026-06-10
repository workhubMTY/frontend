"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { useAuth } from "@/app/shared/auth/useAuth";
import { useReceivedFriendRequests } from "@/app/shared/data/friendships/hooks";
import type { FriendRequest } from "@/app/shared/data/friendships/types";
import {
  useUserReservationInvitations,
} from "@/app/features/reservaciones/crear/data/useActiveReservations";
import type { ReservationInvitation } from "@/app/features/reservaciones/crear/types/activeReservations";

type NotificationTab = "requests" | "invites";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);

  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m}m`;

  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;

  return `hace ${Math.floor(h / 24)}d`;
}

function FriendRequestItem({
  req,
  onAccept,
  onReject,
  pending,
}: {
  req: FriendRequest;
  onAccept: (fromUser: string) => void;
  onReject: (fromUser: string) => void;
  pending?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-slate-50">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-violet-50 text-violet-700">
        <span className="material-symbols-outlined text-[18px]">
          person_add
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-slate-950">
          {req.fromUser}
        </div>

        <div className="mt-0.5 text-xs leading-5 text-slate-600">
          quiere ser tu amigo
        </div>

        <div className="mt-1 text-[11px] text-slate-400">
          {timeAgo(req.createdAt)}
        </div>
      </div>

      <div className="flex shrink-0 gap-1.5">
        <button
          type="button"
          onClick={() => onAccept(req.fromUser)}
          disabled={pending}
          className="rounded-md bg-violet-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60"
        >
          Aceptar
        </button>

        <button
          type="button"
          onClick={() => onReject(req.fromUser)}
          disabled={pending}
          className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-wait disabled:opacity-60"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}

function ReservationInviteItem({
  reservation,
  onAccept,
  onReject,
  pending,
}: {
  reservation: ReservationInvitation;
  onAccept: (reservationId: number, participantId: number) => void;
  onReject: (reservationId: number, participantId: number) => void;
  pending?: boolean;
}) {
  const title = reservation.reservableName ?? reservation.reservableCode;
  const location = reservation.reservableName || reservation.reservableCode;
  const myParticipantId = reservation.myParticipantId;

  const startTime = reservation.startTime;
  const endTime = reservation.endTime;

  const dateLabel = startTime
    ? new Intl.DateTimeFormat("es-MX", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(new Date(startTime))
    : "Fecha pendiente";

  const timeLabel =
    startTime && endTime
      ? `${new Intl.DateTimeFormat("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(startTime))} - ${new Intl.DateTimeFormat("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(endTime))}`
      : "Horario pendiente";

  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-slate-50">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
        <span className="material-symbols-outlined text-[18px]">
          event_available
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-slate-950">
          {title}
        </div>

        <div className="mt-0.5 text-xs leading-5 text-slate-600">
          Te invitaron a una reservación en {location}
        </div>

        <div className="mt-1 text-[11px] text-slate-400">
          {dateLabel} · {timeLabel}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1.5">
        <button
          type="button"
          onClick={() => {
            if (myParticipantId == null) return;
            onAccept(reservation.id, myParticipantId);
          }}
          disabled={pending || myParticipantId == null}
          className="rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
        >
          Aceptar
        </button>

        <button
          type="button"
          onClick={() => {
            if (myParticipantId == null) return;
            onReject(reservation.id, myParticipantId);
          }}
          disabled={pending || myParticipantId == null}
          className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-wait disabled:opacity-60"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>("requests");
  const panelRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const myUserId = user?.eId ? String(user.eId) : null;

  const friendRequestsQuery = useReceivedFriendRequests();
  const invitedReservationsQuery = useUserReservationInvitations(myUserId ?? "");

  const requests = friendRequestsQuery.data ?? [];
  const invitedReservations = invitedReservationsQuery.invitations;

  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleAccept = async (fromUser: string) => {
    await friendRequestsQuery.acceptFriendRequest.mutateAsync({ fromUser });
  };

  const handleReject = async (fromUser: string) => {
    await friendRequestsQuery.rejectFriendRequest.mutateAsync(fromUser);
  };

  const handleAcceptInvitation = async (
    reservationId: number,
    participantId: number,
  ) => {
    await invitedReservationsQuery.accept.mutateAsync({
      reservationId,
      participantId,
    });
  };

  const handleRejectInvitation = async (
    reservationId: number,
    participantId: number,
  ) => {
    await invitedReservationsQuery.reject.mutateAsync({
      reservationId,
      participantId,
    });
  };

  const totalNotifications = requests.length + invitedReservations.length;
  const friendRequestPending =
    friendRequestsQuery.acceptFriendRequest.isPending ||
    friendRequestsQuery.rejectFriendRequest.isPending;
  const reservationInvitePending =
    invitedReservationsQuery.accept.isPending ||
    invitedReservationsQuery.reject.isPending;

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notificaciones"
        className="relative flex items-center justify-center rounded-full bg-background-page p-2 text-on-background-2 transition-colors hover:bg-slate-200/70"
      >
        <span className="material-symbols-outlined text-[22px] select-none">
          notifications
        </span>

        {totalNotifications > 0 && (
          <span className="pointer-events-none absolute right-[3px] top-[3px] flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold leading-none text-white">
            {totalNotifications > 99 ? "99+" : totalNotifications}
          </span>
        )}
      </button>

      {open && (
        <div className="select-none absolute right-0 top-[calc(100%+10px)] z-[100] flex max-h-[560px] w-[400px] animate-[panelIn_0.18s_cubic-bezier(.22,1,.36,1)_both] flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14),0_2px_8px_rgba(15,23,42,0.08)] max-[480px]:right-[-8px] max-[480px]:w-[calc(100vw-16px)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 pb-2.5 pt-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-slate-950">
                Notificaciones
              </span>

              {totalNotifications > 0 && (
                <span className="text-xs font-semibold text-slate-500">
                  {totalNotifications} pendiente
                  {totalNotifications !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 rounded-[10px] bg-slate-100 p-[3px] select-none">
              <button
                type="button"
                onClick={() => setActiveTab("requests")}
                className={`flex-1 rounded-lg px-2.5 py-[7px] text-xs font-semibold transition-all ${
                  activeTab === "requests"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-950"
                }`}
              >
                Solicitudes
                {requests.length > 0 ? ` (${requests.length})` : ""}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("invites")}
                className={`flex-1 rounded-lg px-2.5 py-[7px] text-xs font-semibold transition-all ${
                  activeTab === "invites"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-950"
                }`}
              >
                Invitaciones
                {invitedReservations.length > 0
                  ? ` (${invitedReservations.length})`
                  : ""}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-1 [scrollbar-width:thin] [scrollbar-color:#e2e8f0_transparent] select-none">
            {activeTab === "requests" ? (
              friendRequestsQuery.isLoading ? (
                <NotificationLoading>Cargando...</NotificationLoading>
              ) : requests.length === 0 ? (
                <NotificationEmpty icon="group_off">
                  No tienes solicitudes pendientes
                </NotificationEmpty>
              ) : (
                requests.map((r) => (
                  <FriendRequestItem
                    key={r.id}
                    req={r}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    pending={friendRequestPending}
                  />
                ))
              )
            ) : invitedReservationsQuery.isLoading ? (
              <NotificationLoading>Cargando invitaciones...</NotificationLoading>
            ) : invitedReservations.length === 0 ? (
              <NotificationEmpty icon="event_busy">
                No tienes invitaciones pendientes
              </NotificationEmpty>
            ) : (
              invitedReservations.map((reservation) => (
                <ReservationInviteItem
                  key={reservation.id}
                  reservation={reservation}
                  onAccept={handleAcceptInvitation}
                  onReject={handleRejectInvitation}
                  pending={reservationInvitePending}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationLoading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center p-8 text-[13px] text-slate-400">
      {children}
    </div>
  );
}

function NotificationEmpty({
  icon,
  children,
}: {
  icon: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-slate-400">
      <span className="material-symbols-outlined text-4xl">{icon}</span>
      <p className="m-0 text-[13px]">{children}</p>
    </div>
  );
}
