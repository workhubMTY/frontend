import { Info } from "lucide-react";

type AchievementDrawerFooterProps = {
  isComparing: boolean;
  friendName?: string;
  onClose: () => void;
};

export function AchievementDrawerFooter({
  isComparing,
  friendName,
  onClose,
}: AchievementDrawerFooterProps) {
  return (
    <footer className="border-t border-neutral-100 bg-white px-8 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Info size={16} />

          {isComparing && friendName
            ? `Comparando con ${friendName}`
            : "Mostrando tus logros personales"}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 items-center justify-center bg-purple-700 px-5 text-sm font-medium text-white transition hover:bg-purple-800"
        >
          Listo
        </button>
      </div>
    </footer>
  );
}