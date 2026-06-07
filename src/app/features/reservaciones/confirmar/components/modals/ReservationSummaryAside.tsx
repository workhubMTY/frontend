"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  DoorOpen,
  Hash,
  Mail,
} from "lucide-react";

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

  const spaceName =
    reservationDraft?.reservableName || reservationDraft?.reservableCode || "Cubículo";

  const spaceCode =
    reservationDraft?.reservableCode ?? reservationDraft?.reservableId ?? "N/A";

  return (
    <aside className="hidden w-[340px] shrink-0 border-r border-slate-200 bg-slate-50 lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
          Confirmación
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
          Resumen de reserva
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Revisa los detalles antes de finalizar.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-6 py-5">
        <section className="border border-slate-200 bg-white p-5 ">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <DoorOpen size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Espacio
              </p>

              <p className="mt-1 truncate text-lg font-bold text-slate-950">
                {spaceName}
              </p>

              <div className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-400">
                <Hash size={12} />
                <span>{spaceCode}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <MetricCard
            icon={<CalendarDays size={16} />}
            label="Días"
            value={String(summary.dayCount)}
            helper={summary.dayCount === 1 ? "seleccionado" : "seleccionados"}
          />

          <MetricCard
            icon={<CheckCircle2 size={16} />}
            label="Sesiones"
            value={String(summary.sessionCount)}
            helper={summary.sessionCount === 1 ? "programada" : "programadas"}
          />
        </section>

        <section className="mt-4  border border-slate-200 bg-white p-5 ">
          <SummaryBlock
            icon={<CalendarDays size={17} />}
            label="Rango de fechas"
            value={summary.primaryDateLabel}
            helper={summary.secondaryDateLabel}
          />

          <div className="my-4 h-px bg-slate-100" />

          <SummaryBlock
            icon={<Clock size={17} />}
            label="Horario"
            value={summary.primaryTimeLabel}
            helper={summary.secondaryTimeLabel}
          />
        </section>

      </div>
    </aside>
  );
}

function MetricCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className=" border border-slate-200 bg-white p-4 ">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <div className="text-slate-400">{icon}</div>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-0.5 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function SummaryBlock({
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
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-bold leading-5 text-slate-950">
          {value}
        </p>

        {helper && (
          <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
        )}
      </div>
    </div>
  );
}

function getReservationSummary(sessions: ReservationSession[]) {
  if (sessions.length === 0) {
    return {
      dayCount: 0,
      sessionCount: 0,
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
    uniqueDateLabels.length === 1 ? firstDate : `${firstDate} – ${lastDate}`;

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
      ? `${sessions.length} sesión${sessions.length === 1 ? "" : "es"} programada${
          sessions.length === 1 ? "" : "s"
        }`
      : uniqueTimeLabels.slice(0, 2).join(", ") +
        (uniqueTimeLabels.length > 2 ? "…" : "");

  return {
    dayCount: uniqueDateLabels.length,
    sessionCount: sessions.length,
    primaryDateLabel,
    secondaryDateLabel,
    primaryTimeLabel,
    secondaryTimeLabel,
  };
}