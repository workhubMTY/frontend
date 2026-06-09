"use client";

import type { LucideIcon } from "lucide-react";

type KpiCardProps = {
    label: string;
    value: number | string;
    Icon: LucideIcon;
    iconColor?: string;
    valueColor?: string;
    loading?: boolean;
};

export function KpiCard({
    label,
    value,
    Icon,
    iconColor = "text-slate-400",
    valueColor = "text-slate-800",
    loading = false,
}: KpiCardProps) {
    if (loading) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center gap-3">
                <div className="w-6 h-6 bg-slate-100 rounded-full animate-pulse" />
                <div className="h-3 bg-slate-100 rounded-full w-28 animate-pulse" />
                <div className="h-8 bg-slate-100 rounded-full w-16 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center gap-2 hover:shadow-sm hover:border-slate-300 transition-all">
            <Icon size={22} className={iconColor} strokeWidth={1.8} />
            <p className="text-slate-400 text-xs font-medium text-center">{label}</p>
            <p className={`text-3xl font-bold leading-none ${valueColor}`}>{value}</p>
        </div>
    );
}
