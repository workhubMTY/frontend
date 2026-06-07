import type { GuestKind } from "../types";

type AvatarProps = {
  name: string;
  variant?: GuestKind;
  size?: "sm" | "md";
};

export function Avatar({ name, variant = "colaborador", size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = size === "sm" ? "h-9 w-9 text-xs" : "h-10 w-10 text-sm";
  const colorClasses =
    variant === "colaborador"
      ? "bg-violet-100 text-violet-700"
      : "bg-sky-100 text-sky-700";

  return (
    <div
      className={`${sizeClasses} ${colorClasses} flex shrink-0 items-center justify-center rounded-full font-semibold`}
    >
      {initials}
    </div>
  );
}
