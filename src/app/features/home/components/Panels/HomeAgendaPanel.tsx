"use client";

import { useState } from "react";
import AgendaRapida from "@/app/features/home/components/AgendaRapida/AgendaRapida";
import { useReservationEvents } from "@/app/features/home/hooks/useReservationEvents";
import { useFriends } from "@/app/features/home/hooks/useFriends";

import type { AgendaFilter } from "@/app/features/home/hooks/useHomePage";

type HomeAgendaPanelProps = {
  agendaFilter:     AgendaFilter[];
  selectedFriendId: string | null;
  variant?:         "desktop" | "mobile";
};

export function HomeAgendaPanel({
  agendaFilter,
  selectedFriendId,
  variant = "desktop",
}: HomeAgendaPanelProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const { events, loading } = useReservationEvents({
    weekOffset,
    selectedFriendId,
    agendaFilter,
  });

<<<<<<< HEAD
  // console.log("weekOffset:", weekOffset);
  // console.log("agendaFilter:", agendaFilter);
  // console.log("events:", events);
  // console.log("loading:", loading);
=======
  // Obtener nombre del amigo para la leyenda
  const { friends } = useFriends();
  const friendName = selectedFriendId
    ? (friends.find((f) => (f.eId ?? (f as any).e_id) === selectedFriendId)?.name ?? null)
    : null;
>>>>>>> a6230e462562de8c5c9f37de4e5a1d52e3a7d7ac

  const containerClass =
    variant === "mobile"
      ? "flex-1 min-h-0 overflow-hidden rounded-xl shadow-sm border border-gray-100 bg-white"
      : "flex-1 min-h-0 overflow-hidden shadow-sm border border-neutral-100 rounded-xl bg-white";

  return (
    <div className="flex flex-col min-h-0 gap-3 flex-1">
      <div className={containerClass}>
        <AgendaRapida
          externalEvents={events}
          loading={loading}
          friendName={friendName}
          onWeekOffsetChange={setWeekOffset}
        />
      </div>
    </div>
  );
}