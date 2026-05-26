"use client";

import { Search } from "lucide-react";

type SearchInputFilterProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function SearchInputFilter({
  search,
  onSearchChange,
}: SearchInputFilterProps) {
  return (
    <label className="flex h-12 items-center gap-3 border border-neutral-300 bg-white px-4 text-sm text-neutral-700 transition hover:border-primary-2 hover:text-primary-2 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
      <Search className="h-5 w-5 shrink-0 text-neutral-700" />

      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por identificador"
        className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-700"
      />
    </label>
  );
}
