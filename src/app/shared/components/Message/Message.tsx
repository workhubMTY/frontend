import { X } from "lucide-react";

type MessageProps = {
  message: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  onDismiss?: () => void;
};

export function Message({ message, borderColor, bgColor, textColor, onDismiss }: MessageProps) {
  return (
    <div className={`mx-8 mt-4 flex items-center justify-between gap-3 border ${borderColor} ${bgColor} px-4 py-3 text-sm font-medium ${textColor}`}>
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={`${textColor} transition hover:opacity-80`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
