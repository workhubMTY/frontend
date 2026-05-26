import type { CSSProperties } from "react";
import { cn } from "../../lib/cn";

type ConflictOverlayProps = {
  className?: string;
  style?: CSSProperties;
};

export function ConflictOverlay({ className, style }: ConflictOverlayProps) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-y-0 rounded-sm border-x border-red-300",
        "bg-[repeating-linear-gradient(135deg,rgba(248,113,113,.24)_0,rgba(248,113,113,.24)_4px,transparent_4px,transparent_8px)]",
        className,
      )}
      style={style}
    />
  );
}
