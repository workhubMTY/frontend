import { Calendar, Clock, LogOut, Users } from "lucide-react";

import type { ReservationDraft, ReservationSession } from "../types";

type ReservationSummaryCardProps = {
  reservationDraft: ReservationDraft | null;
  sessions: ReservationSession[];
};

export function ReservationSummaryCard({
  reservationDraft,
  sessions,
}: ReservationSummaryCardProps) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-lg font-bold text-gray-900">
          {reservationDraft?.reservableName ?? "Espacio"}
        </span>
        <span className="text-xs font-medium text-gray-400">
          {reservationDraft?.reservableId ?? "N/A"}
        </span>
      </div>

      <div className="mb-3 flex items-center gap-1.5 text-gray-500">
        <Users size={16} />
        <span className="text-sm font-medium">--</span>
      </div>

      <div className="mb-5 flex h-40 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-300 to-slate-400 text-sm text-slate-500">
        No me jaló la imagen
      </div>

      <div className="flex flex-col gap-5">
        <div className="mb-1 grid grid-cols-3 gap-1.5 px-2">
          <div className="flex justify-center">
            <Calendar size={15} className="text-gray-400" />
          </div>
          <div className="flex justify-center">
            <Clock size={15} className="text-gray-400" />
          </div>
          <div className="flex justify-center">
            <LogOut size={15} className="text-gray-400" />
          </div>
        </div>

        {sessions.map((session) => (
          <div
            key={`${session.dateLabel}-${session.startLabel}-${session.endLabel}`}
            className="grid grid-cols-3 gap-1.5 border border-gray-100 bg-gray-50 px-2 py-2.5"
          >
            <span className="text-center text-xs font-semibold text-gray-700">
              {session.dateLabel}
            </span>
            <span className="text-center text-xs font-semibold text-gray-700">
              {session.startLabel}
            </span>
            <span className="text-center text-xs font-semibold text-gray-700">
              {session.endLabel}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
