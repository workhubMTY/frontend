"use client";

import { useState } from "react";
import AgendaRapida from "@/app/features/home/components/AgendaRapida/AgendaRapida";
import { useReservationEvents } from "@/app/features/home/hooks/useReservationEvents";

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

  console.log("weekOffset:", weekOffset);
  console.log("agendaFilter:", agendaFilter);
  console.log("events:", events);
  console.log("loading:", loading);

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
          onWeekOffsetChange={setWeekOffset}
        />
      </div>
    </div>
  );
}