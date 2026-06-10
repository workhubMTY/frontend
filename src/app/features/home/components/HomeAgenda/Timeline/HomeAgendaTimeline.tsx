"use client";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type { HomeAgendaDay } from "../../../types/homeAgenda";

import { HomeAgendaTimelineHeader } from "./HomeAgendaTimelineHeader";
import { HomeAgendaDayRow } from "./HomeAgendaDayRow";

type HomeAgendaTimelineProps = {
  days: HomeAgendaDay[];
  itemsByDate: Record<string, ScheduleItem[]>;
  disabledDateIds?: string[];
  isLoading?: boolean;
};

export function HomeAgendaTimeline({
  days,
  itemsByDate,
  disabledDateIds = [],
  isLoading = false,
}: HomeAgendaTimelineProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 px-6 py-2">
        <div className="space-y-2">
          {days.map((day) => (
            <HomeAgendaDayRow
              key={day.id}
              day={day}
              items={itemsByDate[day.id] ?? []}
              isDisabled={disabledDateIds.includes(day.id)}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
      <HomeAgendaTimelineHeader />
    </div>
  );
}
