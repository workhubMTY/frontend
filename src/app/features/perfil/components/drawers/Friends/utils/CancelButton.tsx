import { Loader2, X } from "lucide-react";

type CancelButtonProps = {
  onAction: (id: string) => void;   // callback genérico
  itemId: string;                   // id del elemento (ej. request.eId)
  isLoading?: boolean;              // estado de carga
  disabled?: boolean;               // opcional para deshabilitar manualmente
};

export function CancelButton({
  onAction,
  itemId,
  isLoading = false,
  disabled = false,
}: CancelButtonProps) {
  return (
    <button
      type="button"
      disabled={isLoading || disabled}
      onClick={() => onAction(itemId)}
      className="inline-flex h-9 items-center gap-2 border border-red-200 bg-white px-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <X size={16} />
      )}
    </button>
  );
}
