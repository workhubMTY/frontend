import { X } from "lucide-react";

type SuccessMessageProps = {
  message: string;
  onDismiss?: () => void;
};

export function SuccessMessage({ message, onDismiss }: SuccessMessageProps) {
  return (
    <div className="mx-8 mt-4 flex items-center justify-between gap-3 border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
      <span>{message}</span>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-green-700 transition hover:text-green-900"
          aria-label="Cerrar mensaje"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}