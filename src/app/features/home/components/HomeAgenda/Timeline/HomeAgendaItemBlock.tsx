"use client";

import { cn } from "@/app/shared/lib/cn";

import type { PositionedAgendaItem } from "../../../lib/homeAgendaTimeline";

import { getAgendaItemStyles } from "../../../lib/homeAgendaStyles";
import {
  formatAgendaItemRange,
  HOME_AGENDA_LANE_GAP,
  HOME_AGENDA_LANE_HEIGHT,
} from "../../../lib/homeAgendaTimeline";

type HomeAgendaItemBlockProps = {
  item: PositionedAgendaItem;
  onClick?: () => void;
};

export function HomeAgendaItemBlock({
  item,
  onClick,
}: HomeAgendaItemBlockProps) {
  const styles = getAgendaItemStyles(item);
  const Icon = styles.icon;

  const top = 12 + item.lane * (HOME_AGENDA_LANE_HEIGHT + HOME_AGENDA_LANE_GAP);

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${item.title} · ${formatAgendaItemRange(item)}`}
      className={cn(
        "absolute overflow-hidden rounded-md border px-2 py-1 text-left text-xs shadow-sm transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/20",
        onClick && "cursor-pointer hover:border-slate-300 hover:brightness-[0.98]",
        styles.className,
      )}
      style={{
        left: `${item.leftPercent}%`,
        width: `${item.widthPercent}%`,
        top,
        height: HOME_AGENDA_LANE_HEIGHT,
      }}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <Icon className="size-3 shrink-0" />
        <span className="truncate font-semibold">{item.title}</span>
      </div>

      <p className="mt-0.5 truncate text-[10px] opacity-75">
        {formatAgendaItemRange(item)}
      </p>
    </button>
  );
}