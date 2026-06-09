"use client";

import { Download } from "lucide-react";
import type { Period, GlobalAttendanceSummary, GlobalReservationSummary, TopUser } from "../data/stats.types";
import { PeriodTabs } from "./stats/PeriodTabs";
import { DateRangePicker } from "./stats/DateRangePicker";
import { KpiRow } from "./stats/KpiRow";
import { TopUsersSection } from "./stats/TopUsersSection";
import { GroupedBarChart } from "./stats/GroupedBarChart";
import { StackedBarChart } from "./stats/StackedBarChart";
import { LineChart } from "./stats/LineChart";

type StatsViewProps = {
    period: Period;
    onPeriodChange: (p: Period) => void;
    from: string;
    to: string;
    onFromChange: (v: string) => void;
    onToChange: (v: string) => void;
    onApply: () => void;
    onExport: () => void;
    exporting: boolean;
    globalAttendance: GlobalAttendanceSummary | null;
    globalAttendanceLoading: boolean;
    globalAttendanceError: string | null;
    globalReservations: GlobalReservationSummary | null;
    globalReservationsLoading: boolean;
    globalReservationsError: string | null;
    topUsers: TopUser[];
    topUsersLoading: boolean;
    topUsersError: string | null;
};

export function StatsView({
    period, onPeriodChange,
    from, to, onFromChange, onToChange, onApply,
    onExport, exporting,
    globalAttendance, globalAttendanceLoading, globalAttendanceError,
    globalReservations, globalReservationsLoading, globalReservationsError,
    topUsers, topUsersLoading, topUsersError,
}: StatsViewProps) {
    const attBuckets  = globalAttendance?.buckets  ?? [];
    const resvBuckets = globalReservations?.buckets ?? [];

    return (
        <div className="flex flex-col gap-5 pb-8">

            {/* ── Toolbar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
                <PeriodTabs value={period} onChange={onPeriodChange} />
                <DateRangePicker
                    from={from} to={to}
                    onFromChange={onFromChange}
                    onToChange={onToChange}
                    onApply={onApply}
                />
                {/* Botón exportar */}
                <button
                    onClick={onExport}
                    disabled={exporting}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-slate-200 text-slate-600 bg-white rounded-lg hover:border-violet-300 hover:text-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                >
                    <Download size={13} />
                    {exporting ? "Descargando..." : "Exportar XLSX"}
                </button>
            </div>

            {/* ── KPI cards ── */}
            <KpiRow
                data={globalAttendance}
                loading={globalAttendanceLoading}
                error={globalAttendanceError}
            />

            {/* ── Main bar chart ── */}
            <GroupedBarChart
                buckets={attBuckets}
                loading={globalAttendanceLoading}
            />

            {/* ── Bottom row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <StackedBarChart
                    buckets={resvBuckets}
                    loading={globalReservationsLoading}
                />
                <LineChart
                    buckets={attBuckets}
                    loading={globalAttendanceLoading}
                />
            </div>

            {/* ── Top users ── */}
            <TopUsersSection
                users={topUsers}
                loading={topUsersLoading}
                error={topUsersError}
            />
        </div>
    );
}