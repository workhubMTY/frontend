import { Users } from "lucide-react";

export function EmptyUsersState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-3 grid size-12 place-items-center bg-neutral-100 text-neutral-500">
        <Users size={22} />
      </div>

      <h3 className="text-sm font-semibold text-neutral-950">{title}</h3>

      <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>
    </div>
  );
}
