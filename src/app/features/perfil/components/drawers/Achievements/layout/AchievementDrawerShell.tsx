import type { ReactNode } from "react";

type AchievementDrawerShellProps = {
  children: ReactNode;
  onClose: () => void;
};

export function AchievementDrawerShell({
  children,
  onClose,
}: AchievementDrawerShellProps) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar panel de logros"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[860px] flex-col border-l border-neutral-200 bg-white shadow-2xl">
        {children}
      </aside>
    </div>
  );
}