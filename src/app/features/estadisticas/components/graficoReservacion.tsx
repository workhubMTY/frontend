"use client";
import { useEffect, useRef } from "react";
import type { ReservationBucket } from "../data/estadisticas";

export function ReservationsChart({ buckets }: { buckets: ReservationBucket[] }) {
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
            { label: "Con check-in", data: buckets.map((b) => b.checked_in), backgroundColor: "#7c3aed", stack: "r", borderRadius: 0 },
            { label: "Sin check-in", data: buckets.map((b) => b.not_checked_in), backgroundColor: "#ddd6fe", stack: "r", borderRadius: 3 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { stacked: true, grid: { color: "#f3f4f6" }, ticks: { font: { size: 11 }, color: "#9ca3af", maxRotation: 30, autoSkip: false } },
            y: { stacked: true, grid: { color: "#f3f4f6" }, ticks: { font: { size: 11 }, color: "#9ca3af" }, beginAtZero: true },
          },
        },
      });
    };
    load();
    return () => { chartRef.current?.destroy(); };
  }, [buckets]);

  return (
    <div className="relative w-full" style={{ height: 200 }}>
      <canvas ref={canvasRef} aria-label="Gráfica de reservaciones con y sin check-in" />
    </div>
  );
}