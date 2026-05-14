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
    <section className="w-full border border-neutral-300 bg-white p-3 shadow-sm">
      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1.7fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(180px,1fr)_180px]">
        <label className="flex h-12 items-center gap-3  border border-neutral-300 bg-white px-4 text-sm text-neutral-700 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100  transition hover:border-primary-2 hover:text-primary-2">
          <Search className="h-5 w-5 shrink-0 text-neutral-700" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por identificador"
            className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-700 "
          />
        </label>

        <button className="flex h-12 items-center justify-between border border-neutral-300 bg-white px-4 text-sm font-medium text-slate-700  transition hover:border-primary-2 hover:text-primary-2">
          <span className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-neutral-700" />
            Horario
          </span>
          <ChevronDown className="h-4 w-4 text-neutral-700" />
        </button>

        <button className="flex h-12 items-center justify-between border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700  transition hover:border-primary-2 hover:text-primary-2">
          <span className="flex items-center gap-3">
            <UsersRound className="h-5 w-5 text-neutral-700" />
            Capacidad
          </span>
          <ChevronDown className="h-4 w-4 text-neutral-700" />
        </button>

        <button className="flex h-12 items-center justify-between border border-neutral-300 px-4 text-sm font-semibold text-neutral-700 transition hover:border-primary-2 hover:text-primary-2">
          <span className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5" />
            Periodo
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>

        <button className="h-12 px-5 text-sm hover:bg-primary-2 hover:text-on-primary focus:bg-primary-2 focus:text-on-primary px-5 text-sm font-medium text-primary-2 transition border border-primary-2">
          Buscar espacios
        </button>
      </div>
    </section>
  );
}
