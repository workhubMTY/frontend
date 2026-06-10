"use client";

import { CalendarDays, Clock } from "lucide-react";

import { cn } from "@/app/shared/lib/cn";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";

import { getAgendaItemStyles } from "../../../lib/homeAgendaStyles";
import { formatAgendaItemRange } from "../../../lib/homeAgendaTimeline";

import { getItemLocation } from "./HomeAgendaListUtils";

type HomeAgendaListItemProps = {
  item: ScheduleItem;
};

export function HomeAgendaListItem({ item }: HomeAgendaListItemProps) {
  const styles = getAgendaItemStyles(item);
  const Icon = styles.icon;

  const location = getItemLocation(item);

  return (
    <article className="rounded-md border border-slate-200 bg-white px-2.5 py-2 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
      <div className="flex min-w-0 items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <h4 className="truncate text-xs font-semibold text-slate-800">
              {item.title}
            </h4>
          </div>

          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            {location}
          </p>
        </div>
      </div>

      <div className="mt-1.5 flex min-w-0 items-center gap-1.5">
        <span className="inline-flex shrink-0 items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
          <Clock className="size-2.5" />
          {formatAgendaItemRange(item)}
        </span>

        <span
          className={cn(
            "truncate rounded border px-1.5 py-0.5 text-[10px] font-medium",
            styles.className,
          )}
        >
          {item.sourceLabel}
        </span>
      </div>
    </article>
  );
}