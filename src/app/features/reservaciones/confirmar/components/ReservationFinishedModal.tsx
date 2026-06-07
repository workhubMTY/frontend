type ReservationFinishedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBackToReservations: () => void;
};

export function ReservationFinishedModal({
  isOpen,
  onClose,
  onBackToReservations,
}: ReservationFinishedModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-md animate-in flex-col items-center gap-6 bg-white px-10 py-10 shadow-2xl fade-in zoom-in-95 duration-200 mx-6">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Reserva finalizada
        </h2>
        <p className="text-center text-base leading-relaxed text-gray-500">
          Se ha enviado correo de invitación a los contactos seleccionados.
        </p>
        <button
          onClick={onBackToReservations}
          className="w-full max-w-xs cursor-pointer border-none bg-violet-700 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-violet-800"
        >
          Regresar a reservas
        </button>
      </div>
    </div>
  );
}
