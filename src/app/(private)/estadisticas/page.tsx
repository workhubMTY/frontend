"use client";
import { useState } from "react";
import {
  CalendarCheck,
  CircleCheck,
  CircleX,
  TrendingUp,
} from "lucide-react";
import { EstadisticaCard } from "../../features/estadisticas/components/estadisticaCard";
import { PeriodSelector } from "../../features/estadisticas/components/selector";
import { AttendanceChart } from "../../features/estadisticas/components/graficoAsistencias";
import { ReservationsChart } from "../../features/estadisticas/components/graficoReservacion";
import { AttendanceRateChart } from "../../features/estadisticas/components/graficoRangoAsistencias";
import { Chart } from "../../features/estadisticas/components/chart";
import type { Period } from "../../features/estadisticas/data/estadisticas";

const MOCK = {
  day: {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    attended: [8, 5, 9, 7, 10, 3, 1],
    missed: [2, 3, 1, 2, 1, 1, 0],
    checked_in: [8, 5, 9, 7, 10, 3, 1],
    not_checked_in: [2, 3, 1, 2, 1, 1, 0],
  },
  week: {
    labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"],
    attended: [32, 28, 35, 40, 30, 22, 38, 20],
    missed: [8, 12, 5, 10, 7, 6, 4, 9],
    checked_in: [32, 28, 35, 40, 30, 22, 38, 20],
    not_checked_in: [8, 12, 5, 10, 7, 6, 4, 9],
  },
  month: {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    attended: [120, 98, 135, 140, 110, 95, 130, 145, 125, 108, 88, 60],
    missed: [30, 22, 15, 20, 18, 25, 10, 15, 22, 32, 20, 15],
    checked_in: [120, 98, 135, 140, 110, 95, 130, 145, 125, 108, 88, 60],
    not_checked_in: [30, 22, 15, 20, 18, 25, 10, 15, 22, 32, 20, 15],
  },
};

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>("day");

  const data = MOCK[period];
  const total = data.attended.reduce((s, v) => s + v, 0) + data.missed.reduce((s, v) => s + v, 0);
  const attended = data.attended.reduce((s, v) => s + v, 0);
  const missed = data.missed.reduce((s, v) => s + v, 0);
  const rate = total > 0 ? Math.round((attended / total) * 100) : 0;

  const attendanceBuckets = data.labels.map((label, i) => {
    const t = data.attended[i] + data.missed[i];
    return {
      period_label: label,
      total: t,
      attended: data.attended[i],
      missed: data.missed[i],
      attendance_rate: t > 0 ? Math.round((data.attended[i] / t) * 100) : 0,
    };
  });

  const reservationBuckets = data.labels.map((label, i) => ({
    period_label: label,
    total: data.checked_in[i] + data.not_checked_in[i],
    checked_in: data.checked_in[i],
    not_checked_in: data.not_checked_in[i],
  }));

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Estadísticas</h1>
              <p className="mt-0.5 text-sm text-neutral-500">Asistencias y reservaciones</p>
            </div>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <EstadisticaCard
              icon={CalendarCheck}
              label="Total reservaciones"
              value={total.toLocaleString("es-MX")}
            />
            <EstadisticaCard
              icon={CircleCheck}
              label="Asistencias"
              value={attended.toLocaleString("es-MX")}
              valueClassName="text-purple-700"
            />
            <EstadisticaCard
              icon={CircleX}
              label="Faltas"
              value={missed.toLocaleString("es-MX")}
              valueClassName="text-red-600"
              iconClassName="bg-red-50 text-red-600"
            />
            <EstadisticaCard
              icon={TrendingUp}
              label="Tasa de asistencia"
              value={`${rate}%`}
              valueClassName="text-green-700"
              iconClassName="bg-green-50 text-green-700"
            />
          </div>

          <section className="border border-neutral-200 bg-white p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-400">
              Asistencias vs faltas
            </p>
            <Chart
              items={[
                { color: "#7c3aed", label: "Asistencias" },
                { color: "#fca5a5", label: "Faltas" },
              ]}
            />
            <AttendanceChart buckets={attendanceBuckets} />
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="border border-neutral-200 bg-white p-5">
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-400">
                Volumen de reservaciones
              </p>
              <Chart
                items={[
                  { color: "#7c3aed", label: "Con check-in" },
                  { color: "#ddd6fe", label: "Sin check-in" },
                ]}
              />
              <ReservationsChart buckets={reservationBuckets} />
            </section>

            <section className="border border-neutral-200 bg-white p-5">
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-400">
                Tasa de asistencia %
              </p>
              <Chart items={[{ color: "#16a34a", label: "% asistencia" }]} />
              <AttendanceRateChart buckets={attendanceBuckets} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}