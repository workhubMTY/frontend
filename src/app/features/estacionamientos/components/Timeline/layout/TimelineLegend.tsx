import { cn } from "@/app/features/reservaciones/lib/cn";
export function TimelineLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
      <LegendItem
        markerClassName="bg-slate-300"
        label="Ocupación normal"
      />

      <LegendItem
        markerClassName="bg-orange-400"
        label="Alta ocupación"
      />

      <LegendItem
        markerClassName="bg-blue-600"
        label="Mi reservación"
      />

      <LegendItem
        markerClassName="bg-violet-700"
        label="Mi selección"
      />

      <LegendItem
        markerClassName="bg-[repeating-linear-gradient(135deg,#f97316_0px,#f97316_4px,transparent_4px,transparent_8px)] border border-orange-300"
        label="Empalme"
      />
    </div>
  );
}

type LegendItemProps = {
  markerClassName: string;
  label: string;
};

function LegendItem({ markerClassName, label }: LegendItemProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className={`h-3 w-5 rounded-sm ${markerClassName}`} />
      <span>{label}</span>
    </div>
  );
}