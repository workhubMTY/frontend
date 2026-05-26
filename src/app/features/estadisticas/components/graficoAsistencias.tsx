"use client";
import { useEffect, useRef } from "react";
import type { EstadisticasBucket } from "../data/estadisticas";

export function AttendanceChart({ buckets }: { buckets: EstadisticasBucket[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || buckets.length === 0) return;
    const load = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new Chart(canvasRef.current!, {
        type: "bar",
        data: {
          labels: buckets.map((b) => b.period_label),
          datasets: [
            { label: "Asistencias", data: buckets.map((b) => b.attended), backgroundColor: "#7c3aed", borderRadius: 3, barPercentage: 0.6 },
            { label: "Faltas", data: buckets.map((b) => b.missed), backgroundColor: "#fca5a5", borderRadius: 3, barPercentage: 0.6 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: "#f3f4f6" }, ticks: { font: { size: 11 }, color: "#9ca3af", maxRotation: 30, autoSkip: false } },
            y: { grid: { color: "#f3f4f6" }, ticks: { font: { size: 11 }, color: "#9ca3af" }, beginAtZero: true },
          },
        },
      });
    };
    load();
    return () => { chartRef.current?.destroy(); };
  }, [buckets]);

  return (
    <div className="relative w-full" style={{ height: 220 }}>
      <canvas ref={canvasRef} aria-label="Gráfica de asistencias y faltas" />
    </div>
  );
}