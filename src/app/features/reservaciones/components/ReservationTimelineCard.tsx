import { CalendarCheck, Lock, Users } from "lucide-react";

import type { TimeBlock, TimelineEvent } from "../types/reservaciones";
import { getOverlapSegments } from "../lib/conflicts";
import { Card } from "./Card";
import { TimelineAxis } from "./Timeline/TimelineAxis";
import { TimelineBlock } from "./Timeline/TimelineBlock";
import { SelectionBlock } from "./Timeline/SelectionBlock";

type ReservationTimelineCardProps = {
  activeDayId: string;
  activeBlocks: TimeBlock[];
  pendingBlocks: TimeBlock[];
  spaceReservationsForActiveDay: TimelineEvent[];
  externalTimelineEventsForActiveDay: TimelineEvent[];
};

export function ReservationTimelineCard({
  activeDayId,
  activeBlocks,
  pendingBlocks,
  spaceReservationsForActiveDay,
  externalTimelineEventsForActiveDay,
}: ReservationTimelineCardProps) {
  return (
    <Card className="p-5">
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[880px]">
          <TimelineAxis />

          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-[128px_1fr] border-b border-slate-200">
              <div className="flex items-center gap-3 border-r border-slate-200 bg-white px-3 py-5">
                <Lock className="h-4 w-4" />
                <p className="text-xs font-semibold leading-tight text-slate-800">
                  Espacio
                  <br />
                  ocupado
                </p>
              </div>

              <div className="relative min-h-[72px] bg-[linear-gradient(to_right,rgba(148,163,184,.18)_1px,transparent_1px)] bg-[length:calc(100%/24)_100%]">
                {spaceReservationsForActiveDay.map((event) => (
                  <TimelineBlock
                    key={event.id}
                    event={event}
                    variant="reserved"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[128px_1fr] border-b border-slate-200">
              <div className="flex items-center gap-3 border-r border-slate-200 bg-white px-3 py-5">
                <CalendarCheck className="h-4 w-4" />
                <p className="text-xs font-semibold leading-tight text-violet-700">
                  Selección
                  <br />
                  actual
                </p>
              </div>

              <div className="relative min-h-[72px] bg-[linear-gradient(to_right,rgba(148,163,184,.18)_1px,transparent_1px)] bg-[length:calc(100%/24)_100%]">
                {activeBlocks.slice(0, 3).map((block) => (
                  <SelectionBlock
                    key={`${activeDayId}-${block.id}`}
                    block={block}
                    variant="saved"
                    conflictSegments={getOverlapSegments(block, [
                      ...pendingBlocks,
                      ...spaceReservationsForActiveDay,
                    ])}
                  />
                ))}

                {pendingBlocks.slice(0, 3).map((block) => (
                  <SelectionBlock
                    key={`pending-${block.id}`}
                    block={block}
                    variant="pending"
                    conflictSegments={getOverlapSegments(block, [
                      ...activeBlocks,
                      ...pendingBlocks.filter(
                        (pendingBlock) => pendingBlock.id !== block.id,
                      ),
                      ...spaceReservationsForActiveDay,
                    ])}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[128px_1fr]">
              <div className="flex items-center gap-3 border-r border-slate-200 bg-white px-3 py-5">
                <Users className="h-4 w-4" />
                <p className="text-xs font-semibold leading-tight text-slate-800">
                  Eventos
                  <br />
                  externos
                </p>
              </div>

              <div className="relative min-h-[72px] bg-[linear-gradient(to_right,rgba(148,163,184,.18)_1px,transparent_1px)] bg-[length:calc(100%/24)_100%]">
                {externalTimelineEventsForActiveDay.map((event) => (
                  <TimelineBlock
                    key={event.id}
                    event={event}
                    variant="external"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-slate-600">
        <span className="flex items-center gap-2">
          <span className="h-4 w-7 rounded border border-slate-400 bg-slate-100" />
          Horario guardado
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-7 rounded border border-violet-600 bg-violet-50" />
          Horario a aplicar
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-7 rounded border border-red-300 bg-[repeating-linear-gradient(135deg,rgba(248,113,113,.25)_0,rgba(248,113,113,.25)_4px,transparent_4px,transparent_8px)]" />
          Conflicto
        </span>
      </div>
    </Card>
  );
}
