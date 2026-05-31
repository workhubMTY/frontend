"use client";

import type { ParkingReservations } from "../data/types";

type Props = {
  parkingReservations: ParkingReservations[];
  loading: boolean;
  error: string | null;
  search: string;
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
    day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

function ParkingCard({ r }: { r: ParkingReservations }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-xs">#{r.id}</span>
          <span className="text-slate-300 text-xs">·</span>
          <span className="text-slate-600 text-sm font-medium">{r.user_id}</span>
        </div>
        <StatusBadge status={r.lifecycle_status} />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-slate-400 uppercase text-[10px] tracking-wider mb-0.5">Inicio</p>
          <p className="text-slate-700 text-sm">{formatDate(r.start_time)}</p>
        </div>
        <div>
          <p className="text-slate-400 uppercase text-[10px] tracking-wider mb-0.5">Fin</p>
          <p className="text-slate-700 text-sm">{formatDate(r.end_time)}</p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <StatusBadge status={r.attendance_status} />
        <StatusBadge status={r.allocation_state} />
      </div>
    </div>
  );
}

function OfficeColumn() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-300">
      <p className="text-sm">Próximamente</p>
    </div>
  );
}

export function ReservationsList({ parkingReservations, loading, error, search }: Props) {
  const filtered = parkingReservations.filter(
    (r) =>
      r.user_id.toLowerCase().includes(search.toLowerCase()) ||
      String(r.id).includes(search) ||
      r.lifecycle_status?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, col) => (
          <div key={col} className="flex flex-col gap-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-700 font-semibold text-sm">Estacionamientos</h3>
          <span className="text-slate-400 text-xs">{filtered.length} reservaciones</span>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-slate-300">
            <p className="text-sm">Sin resultados</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((r) => <ParkingCard key={r.id} r={r} />)}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-700 font-semibold text-sm">Cubículos / Oficinas</h3>
          <span className="text-slate-400 text-xs">— reservaciones</span>
        </div>
        <OfficeColumn />
      </div>
    </div>
  );
}