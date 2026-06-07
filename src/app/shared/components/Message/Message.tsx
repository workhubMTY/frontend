import { X } from "lucide-react";
import { useEffect } from "react";

type MessageProps =
  | {
      children: React.ReactNode;
      extendClass?: string;
      autoDismiss: true;
      onDismiss: () => void; // requerido
      delay: number; // requerido
    }
  | {
      children: React.ReactNode;
      extendClass?: string;
      autoDismiss?: false; // opcional o false
      onDismiss?: () => void; // opcional
      delay?: number; // opcional
    };

export function Message({
  children,
  extendClass,
  autoDismiss,
  delay,
  onDismiss,
}: MessageProps) {
  useEffect(() => {
    if (autoDismiss && onDismiss && delay) {
      const timeoutId = window.setTimeout(() => {
        onDismiss();
      }, delay);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [autoDismiss, delay, onDismiss]);

  return (
    <div
      className={`flex items-center justify-between gap-3 border px-4 py-3 text-sm font-medium ${extendClass}`}
    >
      <span>{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="transition hover:opacity-80"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
