import { Check } from "lucide-react";

import type { User } from "../../../../types/profile";
import { SearchSelectionBox } from "../../../utils/SearchSelectionBox";

type TeamMemberSelectorProps = {
  memberSearch: string;
  onMemberSearchChange: (value: string) => void;

  selectedMembers: User[];
  selectedMemberIds: Set<string>;
  candidates: User[];

  isSearchingMembers: boolean;
  hasSearchedMembers: boolean;

  onToggleMember: (member: User) => void;
  onRemoveMember: (memberId: string) => void;
};

export function TeamMemberSelector({
  memberSearch,
  onMemberSearchChange,
  selectedMembers,
  selectedMemberIds,
  candidates,
  isSearchingMembers,
  hasSearchedMembers,
  onToggleMember,
  onRemoveMember,
}: TeamMemberSelectorProps) {
  return (
    <SearchSelectionBox<User>
      id="member-search"
      label="Invitar miembros"
      searchValue={memberSearch}
      onSearchChange={onMemberSearchChange}
      selectedItems={selectedMembers}
      results={candidates}
      isSearching={isSearchingMembers}
      hasSearched={hasSearchedMembers}
      selectedLabel="Miembros seleccionados"
      resultsLabel="Resultados"
      placeholder="Buscar por nombre, correo o rol"
      searchPlaceholderWhenSelected="Buscar personas..."
      getItemId={(member) => String(member.eId)}
      getItemName={(member) => member.name}
      getItemAvatarUrl={(member) => member.avatarUrl}
      getItemDescription={(member) => member.email}
      onSelectItem={onToggleMember}
      onRemoveItem={onRemoveMember}
      isItemSelected={(member) => selectedMemberIds.has(String(member.eId))}
      renderItemStatus={(_, { isSelected }) =>
        isSelected ? (
          <span className="inline-flex items-center gap-1 whitespace-nowrap bg-purple-700 px-3 py-1 text-xs font-medium text-white">
            <Check size={13} />
            Seleccionado
          </span>
        ) : (
          <span className="whitespace-nowrap border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
            Seleccionar
          </span>
        )
      }
    />
  );
}