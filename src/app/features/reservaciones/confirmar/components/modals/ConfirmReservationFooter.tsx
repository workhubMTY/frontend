"use client";

type ConfirmReservationFooterProps = {
  submitError: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export function ConfirmReservationFooter({
  submitError,
  isSubmitting,
  onCancel,
  onSubmit,
}: ConfirmReservationFooterProps) {
  return (
    <footer className="flex shrink-0 flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {submitError ? (
          <p className="text-sm font-semibold text-red-600">{submitError}</p>
        ) : (
          <p className="text-sm text-slate-500">
            Se enviará invitación por correo a los contactos seleccionados.
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-xl bg-violet-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? "Finalizando..." : "Finalizar reserva"}
        </button>
      </div>
    </footer>
  );
}