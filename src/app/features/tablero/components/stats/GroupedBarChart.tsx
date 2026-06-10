"use client";

import { useMemo } from "react";
import { ChartCard } from "./ChartCard";
import { ReportsBucket } from "../../data/stats.types";

type GroupedBarChartProps = {
    buckets: ReportsBucket[];
    loading?: boolean;
};

function shortLabel(label: string): string {
    // "2024-W22" → "W22" | "2024-05" → "may" | "2024-05-01" → "01"
    if (/\d{4}-W\d+/.test(label)) return label.slice(5);
    if (/\d{4}-\d{2}$/.test(label)) return label.slice(5);
    if (/\d{4}-\d{2}-\d{2}/.test(label)) return label.slice(8);
    return label;
}

const W = 680, H = 200, PAD_L = 36, PAD_B = 32, PAD_T = 12, PAD_R = 12;
const CHART_W = W - PAD_L - PAD_R;
const CHART_H = H - PAD_T - PAD_B;

function buildTicks(max: number): number[] {
    if (max === 0) return [0, 2, 4, 6, 8, 10];
    const step = Math.ceil(max / 5);
    const top  = step * 5;
    return Array.from({ length: 6 }, (_, i) => i * step).filter((v) => v <= top);
}

export function GroupedBarChart({ buckets, loading }: GroupedBarChartProps) {
    const isEmpty = !loading && buckets.length === 0;

    const { ticks, topTick, pts } = useMemo(() => {
        const maxVal = Math.max(...buckets.flatMap((b) => [b.attended, b.missed]), 0);
        const t = buildTicks(maxVal);
        const top = t[t.length - 1] || 10;
        const groupW = CHART_W / Math.max(buckets.length, 1);
        const barW   = Math.min(groupW * 0.3, 22);
        const gap    = barW * 0.35;
        const baseY  = PAD_T + CHART_H;

        const pts = buckets.map((b, i) => {
            const cx = PAD_L + i * groupW + groupW / 2;
            return {
                b, cx, barW, gap, baseY,
                attendedH: (b.attended / top) * CHART_H,
                missedH:   (b.missed   / top) * CHART_H,
            };
        });

        return { ticks: t, topTick: top, pts };
    }, [buckets]);

    return (
        <ChartCard
            title="Asistencias vs Faltas"
            legend={[
                { color: "#7c3aed", label: "Asistencias" },
                { color: "#fca5a5", label: "Faltas" },
            ]}
            loading={loading}
            empty={isEmpty}
        >
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
                {/* grid */}
                {ticks.map((t) => {
                    const y = PAD_T + CHART_H - (t / topTick) * CHART_H;
                    return (
                        <g key={t}>
                            <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y}
                                stroke="#f1f5f9" strokeWidth="1" />
                            <text x={PAD_L - 5} y={y + 4} textAnchor="end"
                                fontSize="10" fill="#cbd5e1">{t}</text>
                        </g>
                    );
                })}

                {/* bars */}
                {pts.map(({ b, cx, barW, gap, baseY, attendedH, missedH }) => {
                    const aX = cx - gap / 2 - barW;
                    const mX = cx + gap / 2;
                    return (
                        <g key={b.period_label}>
                            <rect x={aX} y={baseY - Math.max(attendedH, 1)}
                                width={barW} height={Math.max(attendedH, 1)}
                                fill="#7c3aed" rx="2">
                                <title>{b.period_label} · Asistencias: {b.attended}</title>
                            </rect>
                            <rect x={mX} y={baseY - Math.max(missedH, 1)}
                                width={barW} height={Math.max(missedH, 1)}
                                fill="#fca5a5" rx="2">
                                <title>{b.period_label} · Faltas: {b.missed}</title>
                            </rect>
                            <text x={cx} y={H - 4} textAnchor="middle"
                                fontSize="10" fill="#94a3b8">
                                {shortLabel(b.period_label)}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </ChartCard>
    );
}
