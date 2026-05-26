import type { LucideIcon } from "lucide-react";

interface EstadisticasCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  valueClassName?: string;
  iconClassName?: string;
}

export function EstadisticaCard({
  icon: Icon,
  label,
  value,
  valueClassName = "text-neutral-950",
  iconClassName = "bg-purple-50 text-purple-700",
}: EstadisticasCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 border border-neutral-200 bg-neutral-50 p-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-full ${iconClassName}`}>
        <Icon size={20} />
      </div>
      <p className="text-center text-xs text-neutral-500">{label}</p>
      <p className={`text-center text-2xl font-semibold tracking-tight ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}