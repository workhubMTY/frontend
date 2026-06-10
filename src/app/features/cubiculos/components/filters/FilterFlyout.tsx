import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/app/shared/lib/cn";

type FilterFlyoutPanelSize = "sm" | "md" | "lg";

type FilterFlyoutProps = {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  children: ReactNode;
  align?: "left" | "right";
  panelSize?: FilterFlyoutPanelSize;
  panelClassName?: string;
};

const panelSizeClassName: Record<FilterFlyoutPanelSize, string> = {
  sm: "w-[min(320px,calc(100vw-2rem))]",
  md: "w-[min(360px,calc(100vw-2rem))]",
  lg: "w-[min(420px,calc(100vw-2rem))]",
};

export function FilterFlyout({
  icon,
  label,
  isOpen,
  isActive,
  onToggle,
  children,
  align = "left",
  panelSize = "md",
  panelClassName,
}: FilterFlyoutProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex h-10 w-full items-center justify-between border bg-white px-4 text-xs font-medium transition",
          isOpen || isActive
            ? "border-primary-2 text-primary-2 ring-2 ring-purple-100"
            : "border-neutral-300 text-neutral-700 hover:border-primary-2 hover:text-primary-2",
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          {icon}
          <span className="truncate">{label}</span>
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-neutral-700 transition",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-[calc(100%+10px)] z-40 border border-neutral-200 bg-white p-4 shadow-lg",
            "max-h-[min(520px,calc(100vh-8rem))] overflow-auto",
            panelSizeClassName[panelSize],
            align === "right" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}