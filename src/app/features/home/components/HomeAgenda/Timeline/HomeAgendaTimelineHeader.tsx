"use client";

import {
  formatHourLabel,
  HOME_AGENDA_END_HOUR,
  HOME_AGENDA_HOUR_LABELS,
  HOME_AGENDA_START_HOUR,
} from "../../../lib/homeAgendaTimeline";

export function HomeAgendaTimelineHeader() {
  return (
    <div className="shrink-0 border-b border-slate-100 px-6 py-2">
      <div className="grid grid-cols-[42px_minmax(0,1fr)]">
        <div />

        <div className="relative h-6">
          {HOME_AGENDA_HOUR_LABELS.map((hour) => {
            const left =
              ((hour - HOME_AGENDA_START_HOUR) /
                (HOME_AGENDA_END_HOUR - HOME_AGENDA_START_HOUR)) *
              100;

            return (
              <div
                key={hour}
                className="absolute top-0 -translate-x-1/2 text-xs font-medium text-slate-400"
                style={{ left: `${left}%` }}
              >
                {formatHourLabel(hour)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}