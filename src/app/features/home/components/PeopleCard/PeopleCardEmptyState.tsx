"use client";

type PeopleCardEmptyStateProps = {
  children: React.ReactNode;
};

export function PeopleCardEmptyState({ children }: PeopleCardEmptyStateProps) {
  return (
    <div className="bg-slate-50 px-3 py-4 text-center text-xs text-slate-400">
      {children}
    </div>
  );
}