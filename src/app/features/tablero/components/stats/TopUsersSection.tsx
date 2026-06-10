"use client";

import { Trophy } from "lucide-react";
import { TopUser } from "../../data/stats.types";

const AVATAR_BG = [
    "bg-violet-100 text-violet-600",
    "bg-sky-100 text-sky-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600",
    "bg-rose-100 text-rose-600",
    "bg-indigo-100 text-indigo-600",
];

function getInitials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

type TopUsersSectionProps = {
    users: TopUser[];
    loading: boolean;
    error: string | null;
};

export function TopUsersSection({ users, loading, error }: TopUsersSectionProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <Trophy size={14} className="text-amber-400" />
                <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">
                    Top 10 · Mayor asistencia
                </p>
            </div>

            <div className="p-5">
                {loading && (
                    <div className="flex flex-col gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <p className="text-red-400 text-sm">{error}</p>
                )}

                {!loading && !error && users.length === 0 && (
                    <div className="flex flex-col items-center py-10 text-slate-300 gap-2">
                        <Trophy size={28} className="opacity-40" />
                        <p className="text-xs">Sin datos en el rango seleccionado</p>
                    </div>
                )}

                {!loading && !error && users.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                        {users.map((u, i) => {
                            const avatarClass = AVATAR_BG[i % AVATAR_BG.length];
                            return (
                                <div
                                    key={u.user_id}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                                >
                                    <span className="text-slate-300 font-mono text-xs w-5 shrink-0 text-center">
                                        {i + 1}
                                    </span>
                                    <div
                                        className={`w-8 h-8 rounded-full ${avatarClass} flex items-center justify-center text-xs font-semibold shrink-0`}
                                    >
                                        {getInitials(u.user_name)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-slate-700 text-sm font-medium truncate leading-tight">
                                            {u.user_name}
                                        </p>
                                        <p className="text-slate-400 text-xs font-mono">{u.user_id}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-slate-500 text-xs font-medium">
                                                {u.attended}/{u.total}
                                            </p>
                                            <p className="text-slate-400 text-[10px]">asistencias</p>
                                        </div>
                                        <div className="w-16 hidden md:block">
                                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-violet-500 rounded-full transition-all"
                                                    style={{ width: `${u.attendance_rate}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-600 border border-violet-200 min-w-[3.5rem] text-center">
                                            {u.attendance_rate}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
