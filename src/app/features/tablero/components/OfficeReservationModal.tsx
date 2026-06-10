"use client";

import { useEffect, useState } from "react";
import type { OfficeReservations, Users } from "../data/types";
import { listUsers } from "../data/api";

type Props = {
  reservation: OfficeReservations;
  onClose: () => void;
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:      "bg-emerald-50 text-emerald-600 border border-emerald-200",
  CHECKED_OUT: "bg-sky-50 text-sky-600 border border-sky-200",
  NOT_ARRIVED: "bg-amber-50 text-amber-600 border border-amber-200",
  FROZEN:      "bg-red-50 text-red-500 border border-red-200",
  SOFT:        "bg-violet-50 text-violet-600 border border-violet-200",
  UNKNOWN:     "bg-slate-100 text-slate-400 border border-slate-200",
  NO_SHOW:     "bg-red-50 text-red-500 border border-red-200",
  FINALIZED:   "bg-slate-100 text-slate-500 border border-slate-200",
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

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export function OfficeReservationModal({ reservation: r, onClose }: Props) {
  const [users, setUsers] = useState<Users[]>([]);

  useEffect(() => {
    listUsers.getUsers()
      .then((data: any) => setUsers(Array.isArray(data) ? data : (data?.items ?? [])))
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Todos los participantes, incluyendo nullos
  const participants = r.participants ?? [];
  const hasParticipants = participants.length > 0;

  function resolveUserName(userId: string | null): string {
    if (!userId) return "Sin asignar";
    const found = users.find((u) => u.eId === userId);
    return found?.name ?? userId;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden"
        style={{ maxHeight: "85vh" }}
      >
        {/* Header — fijo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-0.5">
              Reservación de cubículo
            </p>
            <h2 className="text-slate-800 font-semibold text-base leading-tight">
              {r.reservable?.code ?? "—"}
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

        {/* Contenido — scrolleable */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">

          {/* Statuses */}
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={r.lifecycle_status} />
            <StatusBadge status={r.attendance_status} />
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-slate-100 text-slate-500 border border-slate-200">
              {r.category}
            </span>
          </div>

          {/* Horario */}
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

          {/* Descripción */}
          {r.description && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-slate-400 uppercase text-[10px] tracking-wider mb-1">Descripción</p>
              <p className="text-slate-700 text-sm">{r.description}</p>
            </div>
          )}

          {/* Participantes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-slate-400 uppercase text-[10px] tracking-wider font-medium">
                Participantes
              </p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-600 border border-violet-200">
                {participants.length}
              </span>
            </div>

            {!hasParticipants ? (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <p className="text-slate-400 text-xs">Sin participantes</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
                {participants.map((p, i) => {
                  const name = resolveUserName(p.user_id ?? null);
                  const avatarClass = AVATAR_BG[i % AVATAR_BG.length];
                  const isUnassigned = !p.user_id;
                  const attendanceStyle = STATUS_STYLES[(p.attendance_status ?? "UNKNOWN").toUpperCase()] ?? STATUS_STYLES.UNKNOWN;

                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border shrink-0 ${
                        isUnassigned
                          ? "bg-slate-50 border-slate-100 opacity-60"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                        isUnassigned ? "bg-slate-200 text-slate-400" : avatarClass
                      }`}>
                        {isUnassigned ? "?" : getInitials(name)}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${isUnassigned ? "text-slate-400 italic" : "text-slate-700"}`}>
                          {name}
                        </p>
                        {p.user_id && (
                          <p className="text-slate-400 text-xs font-mono">{p.user_id}</p>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {p.ownership_priority === 0 && (
                          <span className="text-[10px] text-violet-500 font-semibold">Dueño</span>
                        )}
                        {p.attendance_status ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${attendanceStyle}`}>
                            {p.attendance_status.replace(/_/g, " ")}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-400 border border-slate-200">
                            Sin estado
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer — fijo */}
        <div className="px-6 py-3 border-t border-slate-100 flex justify-end shrink-0">
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