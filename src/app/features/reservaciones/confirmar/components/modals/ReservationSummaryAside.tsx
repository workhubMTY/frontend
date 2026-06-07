"use client";

import { CalendarDays, Clock, DoorOpen, Hash } from "lucide-react";

import type {
  ReservationDraft,
  ReservationSession,
} from "../../types/confirmation";

type ReservationSummaryAsideProps = {
  reservationDraft: ReservationDraft | null;
  sessions: ReservationSession[];
};

export function ReservationSummaryAside({
  reservationDraft,
  sessions,
}: ReservationSummaryAsideProps) {
  const summary = getReservationSummary(sessions);

  return (
    <aside className="hidden w-80 shrink-0 border-r border-slate-200 bg-slate-50 p-6 lg:flex lg:flex-col">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
          Confirmación
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
          Revisa tu reserva
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Confirma los detalles principales antes de enviar las invitaciones.
        </p>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <DoorOpen size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Espacio
            </p>

            <p className="mt-1 truncate text-base font-bold text-slate-950">
              {reservationDraft?.reservableName ?? "Cubículo"}
            </p>

            <div className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-400">
              <Hash size={12} />
              <span>{reservationDraft?.reservableId ?? "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="my-5 h-px bg-slate-100" />

        <div className="space-y-4">
          <SummaryRow
            icon={<CalendarDays size={17} />}
            label="Fechas"
            value={summary.primaryDateLabel}
            helper={summary.secondaryDateLabel}
          />

          <SummaryRow
            icon={<Clock size={17} />}
            label="Horario"
            value={summary.primaryTimeLabel}
            helper={summary.secondaryTimeLabel}
          />
        </div>
      </section>

    </aside>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-bold text-slate-900">
          {value}
        </p>

        {helper && (
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            {helper}
          </p>
        )}
      </div>
    </div>
  );
}

function getReservationSummary(sessions: ReservationSession[]) {
  if (sessions.length === 0) {
    return {
      primaryDateLabel: "Sin fechas",
      secondaryDateLabel: "No hay horarios seleccionados.",
      primaryTimeLabel: "Sin horario",
      secondaryTimeLabel: undefined,
    };
  }

  const dateLabels = sessions.map((session) => session.dateLabel);
  const uniqueDateLabels = Array.from(new Set(dateLabels));

  const timeLabels = sessions.map(
    (session) => `${session.startLabel} – ${session.endLabel}`,
  );
  const uniqueTimeLabels = Array.from(new Set(timeLabels));

  const firstDate = uniqueDateLabels[0];
  const lastDate = uniqueDateLabels[uniqueDateLabels.length - 1];

  const primaryDateLabel =
    uniqueDateLabels.length === 1
      ? firstDate
      : `${firstDate} – ${lastDate}`;

  const secondaryDateLabel =
    uniqueDateLabels.length === 1
      ? "1 día seleccionado"
      : `${uniqueDateLabels.length} días seleccionados`;

  const primaryTimeLabel =
    uniqueTimeLabels.length === 1
      ? uniqueTimeLabels[0]
      : `${uniqueTimeLabels.length} horarios distintos`;

  const secondaryTimeLabel =
    uniqueTimeLabels.length === 1
      ? `${sessions.length} sesión${sessions.length === 1 ? "" : "es"} programada${sessions.length === 1 ? "" : "s"}`
      : uniqueTimeLabels.slice(0, 2).join(", ") +
        (uniqueTimeLabels.length > 2 ? "…" : "");

  return {
    primaryDateLabel,
    secondaryDateLabel,
    primaryTimeLabel,
    secondaryTimeLabel,
  };
}