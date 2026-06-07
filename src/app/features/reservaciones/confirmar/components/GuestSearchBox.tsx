import { RefObject } from "react";
import { Search, Users } from "lucide-react";

import type { PersonOption, WorkGroupOption } from "../types";
import { Avatar } from "./Avatar";

type GuestSearchBoxProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  searchTerm: string;
  people: PersonOption[];
  workGroups: WorkGroupOption[];
  isOpen: boolean;
  onSearchTermChange: (value: string) => void;
  onOpen: () => void;
  onPersonSelect: (person: PersonOption) => void;
  onWorkGroupSelect: (workGroup: WorkGroupOption) => void;
};

export function GuestSearchBox({
  containerRef,
  searchTerm,
  people,
  workGroups,
  isOpen,
  onSearchTermChange,
  onOpen,
  onPersonSelect,
  onWorkGroupSelect,
}: GuestSearchBoxProps) {
  return (
    <div
      ref={containerRef}
      className="relative shrink-0 border border-gray-200 bg-white px-6 py-5 shadow-sm"
    >
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 text-gray-400">
          <Search size={17} />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          onFocus={onOpen}
          placeholder="Buscar un correo, nombre o equipo para invitar"
          className="box-border w-full border border-gray-200 bg-white py-3 pl-10 pr-3.5 text-sm text-gray-700 outline-none transition-colors focus:border-violet-400 font-[inherit]"
        />

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 rounded-b-xl border border-t-0 border-violet-400 bg-white shadow-xl">
            <div className="px-4 pb-1 pt-2.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Recientes
              </span>
            </div>

            {people.map((person) => (
              <button
                key={person.id}
                onClick={() => onPersonSelect(person)}
                className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-2.5 text-left transition-colors hover:bg-gray-50 font-[inherit]"
              >
                <Avatar name={person.name} variant={person.kind} size="sm" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {person.name}
                  </div>
                  <div className="text-xs text-gray-400">{person.email}</div>
                </div>
              </button>
            ))}

            <div className="mt-1 border-t border-gray-100 px-4 pb-1 pt-2.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Equipos
              </span>
            </div>

            <div className="flex flex-wrap gap-2 px-4 pb-3.5 pt-2">
              {workGroups.map((workGroup) => (
                <button
                  key={workGroup.id}
                  onClick={() => onWorkGroupSelect(workGroup)}
                  className={`flex cursor-pointer items-center gap-1.5 border-none px-3.5 py-1.5 text-sm font-semibold text-gray-700 transition-opacity hover:opacity-75 font-[inherit] ${workGroup.colorClassName}`}
                >
                  <Users size={13} />
                  {workGroup.name}
                  <span className="text-[11px] text-gray-500">
                    ({workGroup.members})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
