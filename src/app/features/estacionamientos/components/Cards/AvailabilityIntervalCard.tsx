"use client";

import {
  AlertTriangle,
  CarFront,
  Gauge,
  LineChart,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import { Card } from "@/app/shared/components/Card";
import { cn } from "@/app/shared/lib/cn";

type AvailabilityStatus = "available" | "partial" | "conflict";

type AvailabilityIntervalCardProps = {
  status: AvailabilityStatus;
  minimumFreeSpots: number;
  maximumOccupiedSpots: number;
  capacity: number;
  saturationRange?: string;
  onViewCapacityDetail?: () => void;
};

const statusContent = {
  available: {
    title: "Disponible",
    description: "El intervalo seleccionado tiene suficiente capacidad.",
    icon: CheckCircle2,
    wrapperClass: "border-emerald-100 bg-emerald-50",
    iconClass: "bg-emerald-500 text-white",
    titleClass: "text-emerald-700",
  },
  partial: {
    title: "Disponible parcialmente",
    description: "Ajusta tus horarios para evitar el tramo con saturación.",
    icon: Gauge,
    wrapperClass: "border-orange-100 bg-orange-50",
    iconClass: "bg-orange-500 text-white",
    titleClass: "text-orange-700",
  },
  conflict: {
    title: "Sin cupo / conflicto",
    description: "Hay un tramo donde no se puede garantizar disponibilidad.",
    icon: AlertTriangle,
    wrapperClass: "border-red-100 bg-red-50",
    iconClass: "bg-red-500 text-white",
    titleClass: "text-red-700",
  },
};

export function AvailabilityIntervalCard({
  status,
  minimumFreeSpots,
  maximumOccupiedSpots,
  capacity,
  saturationRange,
  onViewCapacityDetail,
}: AvailabilityIntervalCardProps) {
  const content = statusContent[status];
  const StatusIcon = content.icon;

  return (
    <Card className="p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-950">
        Disponibilidad del intervalo
      </h2>

      <div className={cn("mb-5 rounded-xl border p-4", content.wrapperClass)}>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              content.iconClass,
            )}
          >
            <StatusIcon className="h-5 w-5" />
          </div>

          <div>
            <p className={cn("font-semibold", content.titleClass)}>
              {content.title}
            </p>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              {content.description}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-600">
            <CarFront className="h-5 w-5 text-emerald-500" />
            <span>Cajones libres mínimos</span>
          </div>

          <span className="font-semibold text-slate-950">
            {minimumFreeSpots}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-600">
            <LineChart className="h-5 w-5 text-violet-600" />
            <span>Ocupación máxima en tu rango</span>
          </div>

          <span className="font-semibold text-slate-950">
            {maximumOccupiedSpots} / {capacity}
          </span>
        </div>

        {saturationRange ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-slate-600">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Tramo con saturación</span>
            </div>

            <span className="font-semibold text-slate-950">
              {saturationRange}
            </span>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onViewCapacityDetail}
        className="mt-6 flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
      >
        Ver detalle de capacidad
        <ChevronRight className="h-4 w-4" />
      </button>
    </Card>
  );
}
