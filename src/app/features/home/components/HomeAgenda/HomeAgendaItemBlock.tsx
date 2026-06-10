"use client";

import { cn } from "@/app/shared/lib/cn";

import { getAgendaItemStyles } from "../../lib/homeAgendaStyles";
import {
  formatAgendaItemRange,
  HOME_AGENDA_LANE_GAP,
  HOME_AGENDA_LANE_HEIGHT,
  type PositionedAgendaItem,
} from "../../lib/homeAgendaTimeline";

type HomeAgendaItemBlockProps = {
  item: PositionedAgendaItem;
};

export function HomeAgendaItemBlock({ item }: HomeAgendaItemBlockProps) {
  const styles = getAgendaItemStyles(item);
  const Icon = styles.icon;

  return (
    <div
      className={cn(
        "absolute z-10 flex h-[30px] min-w-[72px] items-center gap-2 overflow-hidden rounded-lg border px-2 text-[11px] font-medium shadow-sm transition hover:z-20 hover:shadow-md",
        styles.className,
      )}
      style={{
        left: `${item.leftPercent}%`,
        width: `${item.widthPercent}%`,
        top: 12 + item.lane * (HOME_AGENDA_LANE_HEIGHT + HOME_AGENDA_LANE_GAP),
      }}
      title={`${item.title} · ${formatAgendaItemRange(item)}`}
    >
      <Icon className="size-3 shrink-0" />

      <div className="min-w-0 flex-1 truncate">
        <span className="truncate">{item.title}</span>
      </div>

      <span
        className={cn(
          "hidden shrink-0 text-[10px] font-semibold lg:inline",
          styles.labelClassName,
        )}
      >
        {item.start}
      </span>
    </div>
  );
}