"use client";

import { BarChart2 } from "lucide-react";

type LegendItem = { color: string; label: string };

type ChartCardProps = {
    title: string;
    legend?: LegendItem[];
    children: React.ReactNode;
    loading?: boolean;
    empty?: boolean;
};

function LoadingSkeleton() {
    return (
        <div className="flex flex-col gap-3 py-2">
            <div className="h-3 bg-slate-100 rounded-full w-40 animate-pulse" />
            <div className="h-44 bg-slate-100 rounded-xl animate-pulse" />
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-44 gap-2 text-slate-300">
            <BarChart2 size={28} className="opacity-40" />
            <p className="text-xs">Sin datos en el rango seleccionado</p>
        </div>
    );
}

export function ChartCard({ title, legend, children, loading, empty }: ChartCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">
                    {title}
                </p>
                {legend && legend.length > 0 && (
                    <div className="flex items-center gap-4">
                        {legend.map((item) => (
                            <span
                                key={item.label}
                                className="flex items-center gap-1.5 text-[11px] text-slate-500"
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-sm inline-block"
                                    style={{ backgroundColor: item.color }}
                                />
                                {item.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="px-5 pt-4 pb-5">
                {loading ? <LoadingSkeleton /> : empty ? <EmptyState /> : children}
            </div>
        </div>
    );
}
