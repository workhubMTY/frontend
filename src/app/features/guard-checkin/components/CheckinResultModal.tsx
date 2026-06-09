"use client";

import { CheckCircle, XCircle, AlertTriangle, Loader2, Clock } from "lucide-react";
import { cn } from "@/app/shared/lib/cn";
import type { CheckinResult, EarlyReservationSummary, EarlyNextReservation } from "../types";

type CheckinResultModalProps = {
  result: CheckinResult;
  onClose: () => void;
};

export function CheckinResultModal({ result, onClose }: CheckinResultModalProps) {
  const visible =
    result.status === "loading" ||
    result.status === "success" ||
    result.status === "error" ||
    result.status === "invalid" ||
    result.status === "early";

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-md overflow-hidden border border-slate-200 bg-white shadow-2xl rounded-xl">
        {result.status === "loading" && <LoadingState />}

        {result.status === "success" && (
          <SuccessState
            successContent={result.successContent}
            closeLabel={result.closeLabel ?? "Aceptar"}
            onClose={onClose}
          />
        )}

        {(result.status === "error" || result.status === "invalid") && (
          <ErrorState
            message={result.message}
            isValidation={result.status === "invalid"}
            onClose={onClose}
          />
        )}

        {result.status === "early" && (
          <EarlyState
            message={result.message}
            minutesUntil={result.minutesUntil}
            nextReservation={result.nextReservation}
            todayReservations={result.todayReservations}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-4 px-8 py-10">
      <Loader2 className="h-10 w-10 animate-spin text-primary-1" />
      <p className="text-sm font-medium text-slate-600">Procesando reservación…</p>
    </div>
  );
}

function SuccessState({
  successContent,
  closeLabel,
  onClose,
}: {
  successContent: React.ReactNode;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500 to-transparent" />
      <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="h-9 w-9 text-emerald-500" />
        </div>
        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Check-in exitoso
          </p>
          {successContent}
        </div>
        <button
          onClick={onClose}
          className="mt-2 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          {closeLabel}
        </button>
      </div>
    </>
  );
}

function ErrorState({
  message,
  isValidation,
  onClose,
}: {
  message: string;
  isValidation: boolean;
  onClose: () => void;
}) {
  const Icon = isValidation ? AlertTriangle : XCircle;
  const accentColor = isValidation ? "text-amber-500" : "text-red-500";
  const bgColor = isValidation ? "bg-amber-50" : "bg-red-50";
  const btnColor = isValidation
    ? "bg-amber-600 hover:bg-amber-700"
    : "bg-red-600 hover:bg-red-700";
  const gradientColor = isValidation ? "from-amber-500" : "from-red-500";

  return (
    <>
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r to-transparent",
          gradientColor
        )}
      />
      <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
        <div className={cn("flex h-16 w-16 items-center justify-center rounded-full", bgColor)}>
          <Icon className={cn("h-9 w-9", accentColor)} />
        </div>
        <div>
          <p className={cn("text-xs font-semibold uppercase tracking-[0.18em]", accentColor)}>
            {isValidation ? "No es posible realizar el check-in" : "Error"}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            {isValidation ? "Reserva no válida" : "Ocurrió un problema"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
        </div>
        <button
          onClick={onClose}
          className={cn(
            "mt-2 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition active:scale-[0.98]",
            btnColor
          )}
        >
          Intentar de nuevo
        </button>
      </div>
    </>
  );
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function EarlyState({
  minutesUntil,
  nextReservation,
  todayReservations,
  onClose,
}: {
  message: string;
  minutesUntil: number;
  nextReservation: EarlyNextReservation | null;
  todayReservations: EarlyReservationSummary[];
  onClose: () => void;
}) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-500 to-transparent" />
      <div className="flex flex-col gap-4 px-8 py-10">
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Clock className="h-9 w-9 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Aún no disponible
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Check-in no habilitado
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Faltan{" "}
              <span className="font-semibold text-slate-900">
                {formatMinutes(minutesUntil)}
              </span>{" "}
              para que se habilite el check-in de tu próxima reservación.
            </p>
          </div>
        </div>

        {/* Next reservation */}
        {nextReservation && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
              Próxima reservación
            </p>
            <p className="font-semibold text-slate-900">{nextReservation.reservable_code}</p>
            <p className="text-slate-600">
              {formatTime(nextReservation.start_time)} – {formatTime(nextReservation.end_time)}
            </p>
          </div>
        )}

        {/* Today's remaining reservations */}
        {todayReservations.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Otras reservaciones de hoy
            </p>
            <ul className="flex flex-col gap-2">
              {todayReservations.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-800">{r.reservable_code}</span>
                  <div className="text-right">
                    <span className="text-slate-600">
                      {formatTime(r.start_time)} – {formatTime(r.end_time)}
                    </span>
                    {r.minutesUntilCheckin !== undefined && (
                      <p className="text-xs text-slate-400">
                        Checkin en {formatMinutes(r.minutesUntilCheckin)}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-1 w-full rounded-lg bg-slate-800 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900 active:scale-[0.98]"
        >
          Entendido
        </button>
      </div>
    </>
  );
}
