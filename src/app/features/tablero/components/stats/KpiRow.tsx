"use client";

import { CalendarDays, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { KpiCard } from "./KpiCard";
import type { GlobalAttendanceSummary } from "../../data/types";

type KpiRowProps = {
    data: GlobalAttendanceSummary | null;
    loading: boolean;
    error: string | null;
};

export function KpiRow({ data, loading, error }: KpiRowProps) {
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiCard
                label="Total reservaciones"
                value={data?.total ?? 0}
                Icon={CalendarDays}
                iconColor="text-slate-400"
                loading={loading}
            />
            <KpiCard
                label="Asistencias"
                value={data?.attended ?? 0}
                Icon={CheckCircle2}
                iconColor="text-violet-500"
                valueColor="text-violet-700"
                loading={loading}
            />
            <KpiCard
                label="Faltas"
                value={data?.missed ?? 0}
                Icon={XCircle}
                iconColor="text-rose-400"
                valueColor="text-rose-500"
                loading={loading}
            />
            <KpiCard
                label="Tasa de asistencia"
                value={loading ? "—" : `${data?.attendance_rate ?? 0}%`}
                Icon={TrendingUp}
                iconColor="text-emerald-500"
                valueColor="text-emerald-600"
                loading={loading}
            />
        </div>
    );
}
