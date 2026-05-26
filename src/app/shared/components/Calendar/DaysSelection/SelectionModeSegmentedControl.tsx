"use client";

import { cn } from "@/app/features/reservaciones/lib/cn";

import type { SelectionMode } from "@/app/features/reservaciones/types/reservaciones";

type SelectionModeOption = {
  value: SelectionMode;
  label: string;
};

const SELECTION_MODE_OPTIONS: SelectionModeOption[] = [
  {
    value: "single",
    label: "Un día",
  },
  {
    value: "multiple",
    label: "Varios días",
  },
  {
    value: "repeat",
    label: "Repetir",
  },
];

type SelectionModeSegmentedControlProps = {
  value: SelectionMode;
  onChange: (mode: SelectionMode) => void;
  className?: string;
};

export function SelectionModeSegmentedControl({
  value,
  onChange,
  className,
}: SelectionModeSegmentedControlProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 border border-neutral-200 bg-neutral-50 p-1",
        className,
      )}
    >
      {SELECTION_MODE_OPTIONS.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "h-10 text-sm font-medium transition",
              isActive
                ? "bg-primary-2 text-on-primary shadow-sm"
                : "text-neutral-700 hover:bg-white",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
