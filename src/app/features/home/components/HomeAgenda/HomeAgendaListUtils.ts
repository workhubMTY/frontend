import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";

import { timeToMinutes } from "../../lib/homeAgendaTimeline";

export function sortItemsByTime(items: ScheduleItem[]) {
  return [...items].sort((a, b) => {
    const startDiff = timeToMinutes(a.start) - timeToMinutes(b.start);

    if (startDiff !== 0) return startDiff;

    return timeToMinutes(a.end) - timeToMinutes(b.end);
  });
}

export function getItemLocation(item: ScheduleItem) {
  return item.location ?? item.reservableName ?? "Sin ubicación";
}