"use client";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type { HomeAgendaDay } from "../../../types/homeAgenda";

import { HomeAgendaDayRow } from "./HomeAgendaDayRow";
import { HomeAgendaTimelineHeader } from "./HomeAgendaTimelineHeader";

type HomeAgendaTimelineProps = {
  days: HomeAgendaDay[];
  itemsByDate: Record<string, ScheduleItem[]>;
  disabledDateIds: string[];
  isLoading?: boolean;
  onSelectItem?: (item: ScheduleItem) => void;
};

export function HomeAgendaTimeline({
  days,
  itemsByDate,
  disabledDateIds,
  isLoading = false,
  onSelectItem,
}: HomeAgendaTimelineProps) {
  const disabledIds = new Set(disabledDateIds);

  return (
    <div className="h-full min-h-0 overflow-auto px-5 py-4">
      <HomeAgendaTimelineHeader />

      <div className="mt-3 space-y-3">
        {days.map((day) => (
          <HomeAgendaDayRow
            key={day.id}
            day={day}
            items={itemsByDate[day.id] ?? []}
            isDisabled={disabledIds.has(day.id)}
            isLoading={isLoading}
            onSelectItem={onSelectItem}
          />
        ))}
      </div>
    </div>
  );
}