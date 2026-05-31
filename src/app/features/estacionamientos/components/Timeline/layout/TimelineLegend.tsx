import { cn } from "@/app/features/reservaciones/lib/cn";

export function TimelineLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-600">
      <LegendItem label="Disponibilidad" markerClassName="bg-slate-300" />
      <LegendItem label="Tu selección" markerClassName="bg-violet-700" />
      <LegendItem label="Alta ocupación" markerClassName="bg-orange-400" />

      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-sm bg-[repeating-linear-gradient(135deg,#fb923c_0px,#fb923c_2px,transparent_2px,transparent_5px)]" />
        <span>Sin cupo / conflicto</span>
      </div>
    </div>
  );
}

type LegendItemProps = {
  label: string;
  markerClassName: string;
};

function LegendItem({ label, markerClassName }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-4 w-4 rounded-sm", markerClassName)} />
      <span>{label}</span>
    </div>
  );
}