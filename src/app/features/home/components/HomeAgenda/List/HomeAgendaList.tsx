"use client";

import { useState } from "react";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type { HomeAgendaDay } from "../../../types/homeAgenda";

import { HomeAgendaColumn } from "./HomeAgendaColumn";
import { sortItemsByTime } from "./HomeAgendaListUtils";

type HomeAgendaListProps = {
  days: HomeAgendaDay[];
  itemsByDate: Record<string, ScheduleItem[]>;
  disabledDateIds: string[];
  isLoading?: boolean;
  onSelectItem?: (item: ScheduleItem) => void;
};

export const MAX_VISIBLE_ITEMS_PER_DAY = 3;

export function HomeAgendaList({
  days,
  itemsByDate,
  disabledDateIds,
  isLoading = false,
  onSelectItem,
}: HomeAgendaListProps) {
  const [expandedDateIds, setExpandedDateIds] = useState<Set<string>>(
    () => new Set(),
  );

  const disabledIds = new Set(disabledDateIds);

  function toggleDayExpansion(dateId: string) {
    setExpandedDateIds((current) => {
      const next = new Set(current);

      if (next.has(dateId)) {
        next.delete(dateId);
      } else {
        next.add(dateId);
      }

      return next;
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <span className="text-sm text-slate-400">Cargando agenda...</span>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-hidden bg-slate-50/60">
      <div className="grid h-full min-h-0 grid-cols-5 divide-x divide-slate-200">
        {days.map((day) => {
          const isDisabled = disabledIds.has(day.id);
          const items = isDisabled
            ? []
            : sortItemsByTime(itemsByDate[day.id] ?? []);

          return (
            <HomeAgendaColumn
              key={day.id}
              day={day}
              items={items}
              isDisabled={isDisabled}
              isExpanded={expandedDateIds.has(day.id)}
              onToggleExpanded={() => toggleDayExpansion(day.id)}
              onSelectItem={onSelectItem}
            />
          );
        })}
      </div>
    </div>
  );
}