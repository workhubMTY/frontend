type TeamsCreateFooterProps = {
  canCreateTeam: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
};

export function TeamsCreateFooter({
  canCreateTeam,
  isSubmitting,
  onCancel,
}: TeamsCreateFooterProps) {
  return (
    <footer className="border-t border-neutral-100 bg-white px-8 py-5">
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex h-11 min-w-32 items-center justify-center border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={!canCreateTeam}
          className="inline-flex h-11 min-w-40 items-center justify-center bg-primary-2 px-5 text-sm font-medium text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-300"
        >
          {isSubmitting ? "Creando..." : "Crear equipo"}
        </button>
      </div>
    </footer>
  );
}