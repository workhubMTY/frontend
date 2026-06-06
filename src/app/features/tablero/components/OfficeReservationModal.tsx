
"use client";

import { useEffect } from "react";
import type { OfficeReservations } from "../data/types";

type Props = {
  reservation: OfficeReservations;
  onClose: () => void;
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  CHECKED_OUT: "bg-sky-50 text-sky-600 border border-sky-200",
  NOT_ARRIVED: "bg-amber-50 text-amber-600 border border-amber-200",
  FROZEN: "bg-red-50 text-red-500 border border-red-200",
  SOFT: "bg-violet-50 text-violet-600 border border-violet-200",
  UNKNOWN: "bg-slate-100 text-slate-400 border border-slate-200",
};

function StatusBadge({ status }: { status?: string }) {
  const key   = (status ?? "UNKNOWN").toUpperCase();
  const style = STATUS_STYLES[key] ?? STATUS_STYLES.UNKNOWN;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${style}`}>
      {key.replace(/_/g, " ")}
    </span>
  );
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const AVATAR_BG = [
  "bg-violet-100 text-violet-600",
  "bg-sky-100 text-sky-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
];

export function OfficeReservationModal({ reservation: r, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const hasTeam = Array.isArray(r.participants) && r.participants.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-0.5">
              Reservación de cubículo
            </p>
            <h2 className="text-slate-800 font-semibold text-base leading-tight">
              {r.reservable?.name ?? "—"}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Piso {r.reservable?.floor_id} · Cap. {r.reservable?.capacity}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={r.lifecycle_status} />
            <StatusBadge status={r.attendance_status} />
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-slate-100 text-slate-500 border border-slate-200">
              {r.category}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-slate-400 uppercase text-[10px] tracking-wider mb-1">Inicio</p>
              <p className="text-slate-700 text-sm font-medium">{formatDate(r.start_time)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-slate-400 uppercase text-[10px] tracking-wider mb-1">Fin</p>
              <p className="text-slate-700 text-sm font-medium">{formatDate(r.end_time)}</p>
            </div>
          </div>
          {r.description && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-slate-400 uppercase text-[10px] tracking-wider mb-1">Descripción</p>
              <p className="text-slate-700 text-sm">{r.description}</p>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-slate-400 uppercase text-[10px] tracking-wider font-medium">
                {hasTeam ? "Equipo" : "Participantes"}
              </p>
              {hasTeam && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-600 border border-violet-200">
                  {r.participants.length} miembro{r.participants.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {!hasTeam ? (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <p className="text-slate-400 text-xs">Reservación individual</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {r.participants.map((p, i) => {
                  const avatarClass = AVATAR_BG[i % AVATAR_BG.length];
                  const attendanceStyle = STATUS_STYLES[(p.attendance_status ?? "UNKNOWN").toUpperCase()] ?? STATUS_STYLES.UNKNOWN;

                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className={`w-8 h-8 rounded-full ${avatarClass} flex items-center justify-center text-xs font-semibold shrink-0`}>
                        {p.user_id ? String(p.user_id).slice(0, 2).toUpperCase() : "—"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-700 text-sm font-medium">
                          {p.user_id ? `Usuario ${p.user_id}` : "Sin asignar"}
                        </p>
                        {p.ownership_priority !== null && (
                          <p className="text-slate-400 text-xs">Prioridad {p.ownership_priority}</p>
                        )}
                      </div>
                      {p.attendance_status && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${attendanceStyle}`}>
                          {p.attendance_status.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-lg transition-all"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}