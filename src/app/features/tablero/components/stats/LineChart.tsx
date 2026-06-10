"use client";

import { useMemo } from "react";
import { ChartCard } from "./ChartCard";
import { ReportsBucket } from "../../data/stats.types";

type LineChartProps = {
    buckets: ReportsBucket[];
    loading?: boolean;
};

function shortLabel(label: string): string {
    if (/\d{4}-W\d+/.test(label)) return label.slice(5);
    if (/\d{4}-\d{2}$/.test(label)) return label.slice(5);
    if (/\d{4}-\d{2}-\d{2}/.test(label)) return label.slice(8);
    return label;
}

const W = 680, H = 200, PAD_L = 40, PAD_B = 32, PAD_T = 12, PAD_R = 12;
const CHART_W = W - PAD_L - PAD_R;
const CHART_H = H - PAD_T - PAD_B;
const Y_TICKS = [0, 20, 40, 60, 80, 100];

export function LineChart({ buckets, loading }: LineChartProps) {
    const isEmpty = !loading && buckets.length === 0;

    const pts = useMemo(() =>
        buckets.map((b, i) => ({
            x: PAD_L + (i / Math.max(buckets.length - 1, 1)) * CHART_W,
            y: PAD_T + CHART_H - (Math.min(b.attendance_rate, 100) / 100) * CHART_H,
            label: b.period_label,
            rate:  b.attendance_rate,
        })),
        [buckets]
    );

    const pathD = pts.length > 1
        ? pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")
        : "";

    const areaD = pts.length > 1
        ? `${pathD} L${pts[pts.length - 1].x.toFixed(1)},${(PAD_T + CHART_H).toFixed(1)} L${pts[0].x.toFixed(1)},${(PAD_T + CHART_H).toFixed(1)} Z`
        : "";

    return (
        <ChartCard
            title="Tasa de asistencia %"
            legend={[{ color: "#10b981", label: "% asistencia" }]}
            loading={loading}
            empty={isEmpty}
        >
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
                <defs>
                    <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#10b981" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* grid */}
                {Y_TICKS.map((t) => {
                    const y = PAD_T + CHART_H - (t / 100) * CHART_H;
                    return (
                        <g key={t}>
                            <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y}
                                stroke="#f1f5f9" strokeWidth="1" />
                            <text x={PAD_L - 5} y={y + 4} textAnchor="end"
                                fontSize="10" fill="#cbd5e1">{t}%</text>
                        </g>
                    );
                })}

                {/* area fill */}
                {areaD && <path d={areaD} fill="url(#lineAreaGrad)" />}

                {/* line */}
                {pathD && (
                    <path d={pathD} fill="none"
                        stroke="#10b981" strokeWidth="2.5"
                        strokeLinejoin="round" strokeLinecap="round" />
                )}

                {/* dots + x-labels */}
                {pts.map((p) => (
                    <g key={p.label}>
                        <circle cx={p.x} cy={p.y} r="4"
                            fill="#10b981" stroke="white" strokeWidth="2">
                            <title>{p.label}: {p.rate}%</title>
                        </circle>
                        {buckets.length <= 16 && (
                            <text x={p.x} y={H - 4} textAnchor="middle"
                                fontSize="10" fill="#94a3b8">
                                {shortLabel(p.label)}
                            </text>
                        )}
                    </g>
                ))}
            </svg>
        </ChartCard>
    );
}
