import type { GuestKind } from "../types/confirmation";

type AvatarProps = {
  name: string;
  kind?: GuestKind;
  size?: "sm" | "md";
};

export function Avatar({
  name,
  kind = "colaborador",
  size = "md",
}: AvatarProps) {
  const initials = getInitials(name);

  const sizeClassName =
    size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  const colorClassName =
    kind === "invitado"
      ? "bg-sky-100 text-sky-700"
      : "bg-violet-100 text-violet-700";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizeClassName} ${colorClassName}`}
    >
      {initials}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}