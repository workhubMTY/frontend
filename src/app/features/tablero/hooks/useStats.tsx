"use client";

import { useState, useEffect, useCallback } from "react";
import { listStats } from "../data/api";
import type {
    Period,
    GlobalAttendanceSummary,
    GlobalReservationSummary,
    TopUser,
} from "../data/stats.types";

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function defaultFrom(period: Period): string {
    const d = new Date();
    if (period === "day")   d.setDate(d.getDate() - 30);
    if (period === "week")  d.setDate(d.getDate() - 84);
    if (period === "month") d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().slice(0, 10);
}

export type StatsView = "global" | "user";

export function useStats() {
    const [statsView, setStatsView] = useState<StatsView>("global");
    const [period, setPeriod]       = useState<Period>("week");
    const [from, setFrom]           = useState<string>(() => defaultFrom("week"));
    const [to, setTo]               = useState<string>(todayISO);

    // Global attendance
    const [globalAttendance, setGlobalAttendance] = useState<GlobalAttendanceSummary | null>(null);
    const [globalAttendanceLoading, setGlobalAttendanceLoading] = useState(false);
    const [globalAttendanceError, setGlobalAttendanceError]     = useState<string | null>(null);

    // Global reservations
    const [globalReservations, setGlobalReservations] = useState<GlobalReservationSummary | null>(null);
    const [globalReservationsLoading, setGlobalReservationsLoading] = useState(false);
    const [globalReservationsError, setGlobalReservationsError]     = useState<string | null>(null);

    // Top users
    const [topUsers, setTopUsers]           = useState<TopUser[]>([]);
    const [topUsersLoading, setTopUsersLoading] = useState(false);
    const [topUsersError, setTopUsersError]     = useState<string | null>(null);

    const params = { period, from, to };

    const fetchGlobal = useCallback(async () => {
        setGlobalAttendanceLoading(true);
        setGlobalAttendanceError(null);
        setGlobalReservationsLoading(true);
        setGlobalReservationsError(null);
        setTopUsersLoading(true);
        setTopUsersError(null);

        await Promise.allSettled([
            listStats.getGlobalAttendance(params)
                .then((d: any) => setGlobalAttendance(d?.data ?? d))
                .catch(() => setGlobalAttendanceError("Error al cargar asistencia global"))
                .finally(() => setGlobalAttendanceLoading(false)),

            listStats.getGlobalReservations(params)
                .then((d: any) => setGlobalReservations(d?.data ?? d))
                .catch(() => setGlobalReservationsError("Error al cargar reservaciones globales"))
                .finally(() => setGlobalReservationsLoading(false)),

            listStats.getTopUsers({ ...params, limit: 10 })
                .then((d: any) => setTopUsers(Array.isArray(d) ? d : (d?.data ?? [])))
                .catch(() => setTopUsersError("Error al cargar top usuarios"))
                .finally(() => setTopUsersLoading(false)),
        ]);
    }, [period, from, to]);

    useEffect(() => {
        if (statsView === "global") fetchGlobal();
    }, [statsView, fetchGlobal]);

    // When period changes, auto-adjust from
    const handlePeriodChange = (p: Period) => {
        setPeriod(p);
        setFrom(defaultFrom(p));
        setTo(todayISO());
    };

    return {
        statsView,
        setStatsView,
        period,
        setPeriod: handlePeriodChange,
        from,
        setFrom,
        to,
        setTo,
        globalAttendance,
        globalAttendanceLoading,
        globalAttendanceError,
        globalReservations,
        globalReservationsLoading,
        globalReservationsError,
        topUsers,
        topUsersLoading,
        topUsersError,
        refetch: fetchGlobal,
    };
}