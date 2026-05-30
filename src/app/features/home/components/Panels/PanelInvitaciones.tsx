import { Calendar, Clock, MapPin } from "lucide-react";
import { DiaInvitaciones } from "../../types/types";

export function PanelInvitaciones({
  selInv,
  onInvClick,
  invitaciones,
}: {
  selInv: string | null;
  onInvClick: (dayIndex: number, ii: number) => void;
  invitaciones: DiaInvitaciones[];
}) {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 pb-3">
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-neutral-700" />
          <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
            Invitaciones
          </h2>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        {selInv !== null && (
          <div className="border-l-4 border-purple-700 bg-purple-50/70 px-4 py-3">
            <p className="text-xs text-purple-900">
              Invitación marcada en la agenda
            </p>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {invitaciones.map((sec, si) => (
            <div key={si} className="pb-2">
              <p className="px-3 pb-2 pt-1 text-xs uppercase tracking-wide text-neutral-400">
                {sec.dia}
              </p>

              <div className="divide-y divide-neutral-100">
                {sec.items.map((item, ii) => {
                  const id = `inv_${sec.dayIndex}_${ii}`;
                  const isSelected = selInv === id;

                  return (
                    <button
                      type="button"
                      key={ii}
                      onClick={() => onInvClick(sec.dayIndex, ii)}
                      className={[
                        "w-full border-l-4 px-3 py-4 text-left transition",
                        isSelected
                          ? "border-purple-700 bg-purple-50/70"
                          : "border-transparent hover:bg-neutral-50",
                      ].join(" ")}
                    >
                      <p className="font-semibold text-neutral-950 text-sm">
                        {item.nombre}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{item.sala}</span>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                        <Clock size={12} className="shrink-0" />
                        <span>{item.hora}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <footer className="shrink-0 border-t border-neutral-100 pt-4">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Mostrar todas
          </button>
        </footer>
      </div>
    </section>
  );
}
