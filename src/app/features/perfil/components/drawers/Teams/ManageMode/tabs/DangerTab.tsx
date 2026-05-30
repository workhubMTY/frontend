import { Trash2 } from "lucide-react";

import type { TeamSummary } from "../../types";

type DangerTabProps = {
  team: TeamSummary;
  isDeleting: boolean;
  isSubmitting: boolean;
  showDeleteConfirm: boolean;
  onShowDeleteConfirm: () => void;
  onHideDeleteConfirm: () => void;
  onDeleteTeam: () => void;
};

export function DangerTab({
  team,
  isDeleting,
  isSubmitting,
  showDeleteConfirm,
  onShowDeleteConfirm,
  onHideDeleteConfirm,
  onDeleteTeam,
}: DangerTabProps) {
  return (
    <section className="border border-red-200 bg-red-50 px-5 py-5">
      <div>
        <h3 className="text-base font-semibold text-red-700">
          Zona de peligro
        </h3>

        <p className="mt-2 text-sm text-red-600">
          Eliminar este equipo es una acción permanente. Se quitará de tu lista
          y no podrás recuperar sus miembros desde esta vista.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-4 border border-red-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-950">
            Eliminar “{team.name}”
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <button
          type="button"
          onClick={onShowDeleteConfirm}
          disabled={isDeleting || isSubmitting}
          className="inline-flex h-10 items-center justify-center gap-2 border border-red-300 bg-white px-4 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={16} />
          Eliminar equipo
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="mt-4 border border-red-200 bg-white p-4">
          <p className="text-sm font-semibold text-neutral-950">
            ¿Seguro que quieres eliminar “{team.name}”?
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            Esta acción no se puede deshacer.
          </p>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onHideDeleteConfirm}
              disabled={isDeleting}
              className="inline-flex h-9 items-center justify-center border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onDeleteTeam}
              disabled={isDeleting}
              className="inline-flex h-9 items-center justify-center bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}