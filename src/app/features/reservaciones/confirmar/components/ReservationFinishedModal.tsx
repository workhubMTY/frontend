"use client";

type ReservationFinishedModalProps = {
  isOpen: boolean;
  onBackToReservations: () => void;
};

export function ReservationFinishedModal({
  isOpen,
  onBackToReservations,
}: ReservationFinishedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-2xl bg-white px-8 py-9 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-2xl">
          ✓
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-950">
          Reserva finalizada
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          La reservación fue creada correctamente. Se enviará correo de
          invitación a los contactos seleccionados.
        </p>

        <button
          type="button"
          onClick={onBackToReservations}
          className="mt-7 w-full rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-800"
        >
          Regresar a reservas
        </button>
      </section>
    </div>
  );
}