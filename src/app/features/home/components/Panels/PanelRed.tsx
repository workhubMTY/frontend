import { Search, Users } from "lucide-react";
import { getUserColor } from "../../utils/utils";
import { Persona } from "../../types/types";

export function PanelRed({
  selectedPerson,
  onPersonClick,
  personas,
}: {
  selectedPerson: number | null;
  onPersonClick: (i: number) => void;
  personas: Persona[];
}) {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 pb-3">
        <div className="flex items-center gap-3">
          <Users size={18} className="text-neutral-700" />
          <h2 className="text-l font-semibold tracking-tight text-neutral-950">
            Red personal
          </h2>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        {selectedPerson !== null && personas[selectedPerson] && (
          <div className="border-l-4 border-purple-700 bg-purple-50/70 px-4 py-3">
            <p className="text-sm text-purple-900">
              Mostrando horarios de{" "}
              <strong>{personas[selectedPerson].name.split(" ")[0]}</strong> en
              la agenda
            </p>
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col divide-y divide-neutral-100 overflow-y-auto">
          {personas.map((p, i) => {
            const color = getUserColor(p.id);
            const isSelected = selectedPerson === i;

            return (
              <button
                type="button"
                key={p.id + p.initials}
                onClick={() => onPersonClick(i)}
                className={[
                  "grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-4 text-left transition",
                  isSelected
                    ? "border-l-4 border-purple-700 bg-purple-50/70 pl-2"
                    : "border-l-4 border-transparent hover:bg-neutral-50",
                ].join(" ")}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    background: color.bg,
                    color: color.text,
                  }}
                >
                  {p.initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-neutral-950">
                    {p.name}
                  </p>
                  <p className="truncate text-sm text-neutral-500">{p.role}</p>
                </div>

                <span
                  className={[
                    "text-sm font-medium transition",
                    isSelected
                      ? "text-purple-700"
                      : "text-neutral-400 group-hover:text-neutral-700",
                  ].join(" ")}
                >
                  {isSelected ? "Activo" : "Ver"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-3 border border-neutral-200 bg-white px-4 py-3">
            <Search size={18} className="shrink-0 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar persona..."
              className="w-full bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
