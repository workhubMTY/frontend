"use client";

import { useMemo } from "react";
import { ChartCard } from "./ChartCard";
import { ReservationBucket } from "../../data/stats.types";

type StackedBarChartProps = {
    buckets: ReservationBucket[];
    loading?: boolean;
};

function shortLabel(label: string): string {
    if (/\d{4}-W\d+/.test(label)) return label.slice(5);
    if (/\d{4}-\d{2}$/.test(label)) return label.slice(5);
    if (/\d{4}-\d{2}-\d{2}/.test(label)) return label.slice(8);
    return label;
}

const W = 680, H = 200, PAD_L = 36, PAD_B = 32, PAD_T = 12, PAD_R = 12;
const CHART_W = W - PAD_L - PAD_R;
const CHART_H = H - PAD_T - PAD_B;

function buildTicks(max: number): number[] {
    if (max === 0) return [0, 2, 4, 6, 8, 10, 12];
    const step = Math.ceil(max / 5);
    const top  = step * 5;
    return Array.from({ length: 6 }, (_, i) => i * step).filter((v) => v <= top);
}

export function StackedBarChart({ buckets, loading }: StackedBarChartProps) {
    const isEmpty = !loading && buckets.length === 0;

    const { ticks, topTick, pts } = useMemo(() => {
        const maxVal = Math.max(...buckets.map((b) => b.total), 0);
        const t = buildTicks(maxVal);
        const top = t[t.length - 1] || 12;
        const groupW = CHART_W / Math.max(buckets.length, 1);
        const barW   = Math.min(groupW * 0.5, 28);
        const baseY  = PAD_T + CHART_H;

        const pts = buckets.map((b, i) => {
            const cx        = PAD_L + i * groupW + groupW / 2;
            const checkedH  = (b.checked_in    / top) * CHART_H;
            const restH     = (b.not_checked_in / top) * CHART_H;
            return { b, cx, barW, baseY, checkedH, restH };
        });

        return { ticks: t, topTick: top, pts };
    }, [buckets]);

    return (
        <ChartCard
            title="Volumen de reservaciones"
            legend={[
                { color: "#7c3aed", label: "Con check-in" },
                { color: "#ddd6fe", label: "Sin check-in" },
            ]}
            loading={loading}
            empty={isEmpty}
        >
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
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

                {pts.map(({ b, cx, barW, baseY, checkedH, restH }) => {
                    const x = cx - barW / 2;
                    return (
                        <g key={b.period_label}>
                            {/* not checked (top, lighter) */}
                            <rect
                                x={x}
                                y={baseY - checkedH - Math.max(restH, restH > 0 ? 1 : 0)}
                                width={barW}
                                height={Math.max(restH, restH > 0 ? 1 : 0)}
                                fill="#ddd6fe"
                                rx="2"
                            >
                                <title>{b.period_label} · Sin check-in: {b.not_checked_in}</title>
                            </rect>
                            {/* checked (bottom, solid) */}
                            <rect
                                x={x}
                                y={baseY - Math.max(checkedH, 1)}
                                width={barW}
                                height={Math.max(checkedH, 1)}
                                fill="#7c3aed"
                                rx="2"
                            >
                                <title>{b.period_label} · Con check-in: {b.checked_in}</title>
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
