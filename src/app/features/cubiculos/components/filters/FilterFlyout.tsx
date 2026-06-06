import { ChevronDown } from "lucide-react";
type FilterFlyoutProps = {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  align?: "left" | "right";
};

export function FilterFlyout({
  icon,
  label,
  isOpen,
  isActive,
  onToggle,
  children,
  align = "left",
}: FilterFlyoutProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-10 w-full items-center justify-between border bg-white px-4 text-xs font-medium transition ${
          isOpen || isActive
            ? "border-primary-2 text-primary-2 ring-2 ring-purple-100"
            : "border-neutral-300 text-neutral-700 hover:border-primary-2 hover:text-primary-2"
        }`}
      >
        <span className="flex min-w-0 items-center gap-3">
          {icon}
          <span className="truncate">{label}</span>
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-neutral-700 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-[calc(100%+10px)] z-40 border border-neutral-200 bg-white p-4 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
