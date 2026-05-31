import { Users } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="mb-4 grid size-12 place-items-center bg-neutral-100 text-neutral-500">
        <Users size={22} />
      </div>

      <h3 className="text-base font-semibold text-neutral-950">{title}</h3>

      <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>
    </div>
  );
}