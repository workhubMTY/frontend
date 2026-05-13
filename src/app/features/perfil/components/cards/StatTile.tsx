import type { ReactNode } from "react";

type StatTileProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
};

export function StatTile({ icon, label, value }: StatTileProps) {
  return (
    <div className="flex min-h-[96px] flex-col justify-between border-l border-neutral-200 px-6 py-3 first:border-l-0">
      <div className="flex h-10 w-10 items-center justify-center bg-purple-50 text-purple-700">
        {icon}
      </div>

      <div>
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
          {value}
        </p>
      </div>
    </div>
  );
}
