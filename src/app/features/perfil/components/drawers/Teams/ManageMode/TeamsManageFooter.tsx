import { Save } from "lucide-react";

type ManageTeamFooterProps = {
  hasChanges: boolean;
  canSave: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  onCancel: () => void;
};

export function ManageTeamFooter({
  hasChanges,
  canSave,
  isSubmitting,
  isDeleting,
  onCancel,
}: ManageTeamFooterProps) {
  return (
    <footer className="border-t border-neutral-100 bg-white px-8 py-5">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-neutral-500">
          {hasChanges
            ? "Tienes cambios sin guardar."
            : "No hay cambios pendientes."}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || isDeleting}
            className="inline-flex h-11 min-w-32 items-center justify-center border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={!canSave}
            className="inline-flex h-11 min-w-40 items-center justify-center gap-2 bg-primary-2 px-5 text-sm font-medium text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-300"
          >
            <Save size={16} />
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </footer>
  );
}