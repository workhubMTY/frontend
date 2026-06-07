"use client";

import { useState } from "react";
import type { ParkingReservations, OfficeReservations } from "../data/types";
import { OfficeReservationModal } from "./OfficeReservationModal.tsx";

type Props = {
  parkingReservations?: ParkingReservations[];
  officeReservations?: OfficeReservations[];
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
  const key  = (status ?? "UNKNOWN").toUpperCase();
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

function OfficeCard({ r, onClick }: { r: OfficeReservations; onClick: () => void }) {
  const hasTeam = Array.isArray(r.participants) && r.participants.length > 0;
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-violet-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-xs">#{r.id}</span>
          <span className="text-slate-300 text-xs">·</span>
          <span className="text-slate-600 text-sm font-medium">{r.reservable?.name ?? "—"}</span>
          {hasTeam && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-600 border border-violet-200">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {r.participants.length}
            </span>
          )}
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
      <div className="flex items-center justify-between">
        <StatusBadge status={r.attendance_status} />
        <span className="text-slate-300 text-xs group-hover:text-violet-400 transition-colors">
          Ver detalles →
        </span>
      </div>
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-12 text-slate-300">
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ReservationsList({
  parkingReservations = [],
  officeReservations = [],
  loading,
  error,
  search,
}: Props) {
  const [selectedOffice, setSelectedOffice] = useState<OfficeReservations | null>(null);

  const filteredParking = parkingReservations.filter(
    (r) =>
      r.user_id?.toLowerCase().includes(search.toLowerCase()) ||
      String(r.id).includes(search) ||
      r.lifecycle_status?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOffice = officeReservations.filter(
    (o) =>
      o.reservable?.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search) ||
      o.lifecycle_status?.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-700 font-semibold text-sm">Estacionamientos</h3>
            <span className="text-slate-400 text-xs">{filteredParking.length} reservaciones</span>
          </div>
          {loading ? <LoadingSkeleton /> : filteredParking.length === 0 ? (
            <EmptyState label="Sin resultados" />
          ) : (
            <div className="flex flex-col gap-3">
              {filteredParking.map((r) => <ParkingCard key={r.id} r={r} />)}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-700 font-semibold text-sm">Cubículos / Oficinas</h3>
            <span className="text-slate-400 text-xs">{filteredOffice.length} reservaciones</span>
          </div>
          {loading ? <LoadingSkeleton /> : filteredOffice.length === 0 ? (
            <EmptyState label="Sin resultados" />
          ) : (
            <div className="flex flex-col gap-3">
              {filteredOffice.map((o) => (
                <OfficeCard key={o.id} r={o} onClick={() => setSelectedOffice(o)} />
              ))}
            </div>
          )}
        </div>

      </div>

      {selectedOffice && (
        <OfficeReservationModal
          reservation={selectedOffice}
          onClose={() => setSelectedOffice(null)}
        />
      )}
    </>
  );
}