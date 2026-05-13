import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Search,
  UsersRound,
} from "lucide-react";

type ReservationFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function ReservationFilters({
  search,
  onSearchChange,
}: ReservationFiltersProps) {
  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1.7fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(180px,1fr)_180px]">
        <label className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
          <Search className="h-5 w-5 shrink-0 text-slate-500" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por identificador"
            className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
          />
        </label>

        <button className="flex h-12 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300">
          <span className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-slate-500" />
            Horario
          </span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>

        <button className="flex h-12 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300">
          <span className="flex items-center gap-3">
            <UsersRound className="h-5 w-5 text-slate-500" />
            Capacidad
          </span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>

        <button className="flex h-12 items-center justify-between rounded-lg border border-purple-300 bg-purple-50 px-4 text-sm font-semibold text-purple-700 transition hover:border-purple-500">
          <span className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5" />
            Periodo
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>

        <button className="h-12 rounded-lg bg-purple-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800">
          Buscar espacios
        </button>
      </div>
    </section>
  );
}
