import {
  Armchair,
  Building2,
  ChevronDown,
  ChevronUp,
  UsersRound,
} from "lucide-react";
import type {
  ReservableSpace,
  SpaceStatus,
} from "../../types/reservableSpaces";

type FloorMapCardProps = {
  spaces: ReservableSpace[];
  selectedSpaceId?: string;
  onSelectSpace: (spaceId: string) => void;
};

function getMapSpaceClass(status: SpaceStatus, isSelected: boolean) {
  if (isSelected) {
    return "border-purple-700 bg-purple-100 text-purple-800 shadow-[0_0_0_1px_rgba(126,34,206,0.25)]";
  }

  if (status === "occupied") {
    return "border-slate-300 bg-slate-100 text-slate-500";
  }

  if (status === "soon") {
    return "border-orange-300 bg-orange-50 text-orange-700";
  }

  if (status === "partial") {
    return "border-blue-300 bg-blue-50 text-blue-700";
  }

  return "border-slate-300 bg-white text-slate-700 hover:border-purple-400 hover:bg-purple-50";
}

export function FloorMapCard({
  spaces,
  selectedSpaceId,
  onSelectSpace,
}: FloorMapCardProps) {
  return (
    <section className="min-h-[560px] border border-slate-200 bg-container p-4 shadow-sm md:p-5">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Mapa 2D del piso 1
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Selecciona un espacio en el mapa para ver su disponibilidad.
          </p>
        </div>

        <div className="inline-grid w-fit grid-cols-3 overflow-hidden border border-slate-200 bg-white text-sm">
          <button className="border-r border-slate-200 bg-purple-50 px-5 py-2 font-semibold text-purple-700">
            Piso 1
          </button>
          <button className="border-r border-slate-200 px-5 py-2 text-slate-600 hover:bg-slate-50">
            Piso 2
          </button>
          <button className="px-5 py-2 text-slate-600 hover:bg-slate-50">
            Piso 3
          </button>
        </div>
      </div>

      <div className="relative h-[480px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <div className="absolute inset-6 rounded-sm border-2 border-slate-300 bg-white" />

        {/* zonas estructurales */}
        <div className="absolute left-[6%] top-[14%] h-[22%] w-[38%] border border-slate-300 bg-white/90">
          <div className="flex h-full flex-col items-center justify-center text-xs font-medium text-slate-500">
            <UsersRound className="mb-1 h-5 w-5" />
            Cubículos
          </div>
        </div>

        <div className="absolute left-[6%] top-[42%] h-[16%] w-[12%] border border-slate-300 bg-white/90">
          <div className="flex h-full items-center justify-center text-xs font-medium text-slate-500">
            Escaleras
          </div>
        </div>

        <div className="absolute left-[6%] top-[60%] h-[12%] w-[12%] border border-slate-300 bg-white/90">
          <div className="flex h-full items-center justify-center text-xs font-medium text-slate-500">
            Elevadores
          </div>
        </div>

        <div className="absolute left-[22%] top-[43%] h-[22%] w-[26%] border border-slate-300 bg-white/90">
          <div className="flex h-full flex-col items-center justify-center text-xs font-medium text-slate-500">
            <Building2 className="mb-1 h-5 w-5" />
            Recepción
          </div>
        </div>

        <div className="absolute left-[76%] top-[15%] h-[20%] w-[15%] border border-slate-300 bg-white/90">
          <div className="flex h-full items-center justify-center text-xs font-medium text-slate-500">
            Baños
          </div>
        </div>

        <div className="absolute left-[7%] top-[75%] h-[16%] w-[26%] border border-slate-300 bg-slate-100/80">
          <div className="flex h-full flex-col items-center justify-center text-xs font-medium text-slate-500">
            <UsersRound className="mb-1 h-5 w-5" />
            Área de eventos
          </div>
        </div>

        {/* pasillos */}
        <div className="absolute left-[18%] top-[38%] h-[5%] w-[72%] border-y border-slate-300 bg-white" />
        <div className="absolute left-[48%] top-[36%] h-[55%] w-[5%] border-x border-slate-300 bg-white" />

        {/* thumbnail */}
        <div className="absolute bottom-5 left-5 h-24 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
          <div className="flex h-full items-end bg-gradient-to-br from-slate-100 to-slate-300 p-3">
            <div className="h-8 w-full rounded bg-white/70" />
          </div>
        </div>
      </div>
    </section>
  );
}
