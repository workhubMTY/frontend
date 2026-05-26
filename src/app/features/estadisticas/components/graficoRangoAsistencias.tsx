"use client";
import { useEffect, useRef } from "react";
import type { EstadisticasBucket} from "../data/estadisticas";

export function AttendanceRateChart({ buckets }: { buckets: EstadisticasBucket[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || buckets.length === 0) return;
    const load = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new Chart(canvasRef.current!, {
        type: "line",
        data: {
          labels: buckets.map((b) => b.period_label),
          datasets: [
            {
              label: "% asistencia",
              data: buckets.map((b) => Math.round(b.attendance_rate)),
              borderColor: "#16a34a",
              backgroundColor: "#dcfce7",
              borderWidth: 2,
              pointBackgroundColor: "#16a34a",
              pointRadius: 4,
              tension: 0.35,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: "#f3f4f6" }, ticks: { font: { size: 11 }, color: "#9ca3af", maxRotation: 30, autoSkip: false } },
            y: { min: 0, max: 100, grid: { color: "#f3f4f6" }, ticks: { font: { size: 11 }, color: "#9ca3af", callback: (v: any) => v + "%" } },
          },
        },
      });
    };
    load();
    return () => { chartRef.current?.destroy(); };
  }, [buckets]);

  return (
    <div className="relative w-full" style={{ height: 200 }}>
      <canvas ref={canvasRef} aria-label="Gráfica de tasa de asistencia porcentual" />
    </div>
  );
}