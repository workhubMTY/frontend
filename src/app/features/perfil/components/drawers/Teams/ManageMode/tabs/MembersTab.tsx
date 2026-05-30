import { Check, Loader2, RotateCcw, UserMinus } from "lucide-react";

import type { User } from "../../../../../types/profile";
import type { TeamMembersState } from "../../types";
import { Avatar } from "../../TeamsDrawer";
import { SearchSelectionBox } from "../../../../utils/SearchSelectionBox";

type MembersTabProps = {
  membersState: TeamMembersState;

  memberSearch: string;
  onMemberSearchChange: (value: string) => void;

  addedMembers: User[];
  removedMemberIds: string[];

  activeOriginalMemberIds: Set<string>;
  addedMemberIds: Set<string>;
  filteredCandidates: User[];

  isSearchingMembers: boolean;
  hasSearchedMembers: boolean;

  onToggleCandidate: (member: User) => void;
  onRemoveAddedMember: (memberId: string) => void;
  onMarkOriginalMemberForRemoval: (memberId: string) => void;
  onUndoRemoveOriginalMember: (memberId: string) => void;
};

export function MembersTab({
  membersState,

  memberSearch,
  onMemberSearchChange,

  addedMembers,
  removedMemberIds,

  activeOriginalMemberIds,
  addedMemberIds,
  filteredCandidates,

  isSearchingMembers,
  hasSearchedMembers,

  onToggleCandidate,
  onRemoveAddedMember,
  onMarkOriginalMemberForRemoval,
  onUndoRemoveOriginalMember,
}: MembersTabProps) {
  const originalMembers = membersState.members;

  return (
    <div className="space-y-8">
      <section className="border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-neutral-950">
            Miembros actuales
          </h3>

          <p className="mt-1 text-xs text-neutral-500">
            Los cambios se aplicarán cuando guardes.
          </p>
        </div>

        {membersState.loading && (
          <div className="flex items-center gap-3 px-5 py-6 text-sm text-neutral-500">
            <Loader2 size={17} className="animate-spin" />
            Cargando miembros...
          </div>
        )}

        {membersState.error && (
          <div className="px-5 py-6 text-sm text-red-600">
            {membersState.error}
          </div>
        )}

        {!membersState.loading &&
          !membersState.error &&
          originalMembers.length === 0 && (
            <div className="px-5 py-6 text-sm text-neutral-500">
              Este equipo todavía no tiene miembros registrados.
            </div>
          )}

        {!membersState.loading &&
          !membersState.error &&
          originalMembers.length > 0 && (
            <div className="divide-y divide-neutral-100">
              {originalMembers.map((member) => {
                const memberId = String(member.eId);
                const willBeRemoved = removedMemberIds.includes(memberId);

                return (
                  <div
                    key={memberId}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={member.name} src={member.avatarUrl} />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-neutral-950">
                            {member.name}
                          </p>

                          {willBeRemoved && (
                            <span className="shrink-0 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                              Se quitará
                            </span>
                          )}
                        </div>

                        <p className="truncate text-xs text-neutral-500">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    {willBeRemoved ? (
                      <button
                        type="button"
                        onClick={() => onUndoRemoveOriginalMember(memberId)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-purple-700 transition hover:text-purple-900"
                      >
                        <RotateCcw size={15} />
                        Reagregar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onMarkOriginalMemberForRemoval(memberId)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-red-600 transition hover:text-red-700"
                      >
                        <UserMinus size={15} />
                        Quitar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
      </section>

      <SearchSelectionBox<User>
        id="manage-member-search"
        label="Agregar miembros"
        searchValue={memberSearch}
        onSearchChange={onMemberSearchChange}
        selectedItems={addedMembers}
        results={filteredCandidates}
        isSearching={isSearchingMembers}
        hasSearched={hasSearchedMembers}
        selectedLabel="Miembros por agregar"
        resultsLabel="Resultados"
        selectedCountLabel={`${addedMembers.length} por agregar`}
        selectedItemsPlacement="below-results"
        placeholder="Buscar por nombre, correo o rol"
        searchPlaceholderWhenSelected="Buscar más personas..."
        getItemId={(member) => String(member.eId)}
        getItemName={(member) => member.name}
        getItemAvatarUrl={(member) => member.avatarUrl}
        getItemDescription={(member) => member.email}
        onSelectItem={onToggleCandidate}
        onRemoveItem={onRemoveAddedMember}
        isItemSelected={(member) => addedMemberIds.has(String(member.eId))}
        isItemDisabled={(member) =>
          activeOriginalMemberIds.has(String(member.eId))
        }
        renderItemStatus={(_, { isSelected, isDisabled }) => {
          if (isDisabled) {
            return (
              <span className="whitespace-nowrap border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500">
                Ya es miembro
              </span>
            );
          }

          if (isSelected) {
            return (
              <span className="inline-flex items-center gap-1 whitespace-nowrap bg-purple-700 px-3 py-1 text-xs font-medium text-white">
                <Check size={13} />
                Se agregará
              </span>
            );
          }

          return (
            <span className="whitespace-nowrap border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700">
              Agregar
            </span>
          );
        }}
        renderSelectedItems={(selectedItems, helpers) => (
          <section className="mt-6 border border-purple-100 bg-purple-50">
            <div className="border-b border-purple-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-purple-950">
                Miembros por agregar
              </h3>

              <p className="mt-1 text-xs text-purple-700">
                Se agregarán cuando guardes los cambios.
              </p>
            </div>

            <div className="divide-y divide-purple-100">
              {selectedItems.map((member) => {
                const memberId = helpers.getItemId(member);
                const memberName = helpers.getItemName(member);
                const memberDescription = helpers.getItemDescription?.(member);
                const avatarUrl = helpers.getItemAvatarUrl?.(member);

                return (
                  <div
                    key={memberId}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={memberName} src={avatarUrl} />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-neutral-950">
                            {memberName}
                          </p>

                          <span className="shrink-0 bg-white px-2 py-0.5 text-xs font-medium text-purple-700">
                            Se agregará
                          </span>
                        </div>

                        {memberDescription && (
                          <p className="truncate text-xs text-neutral-500">
                            {memberDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => helpers.onRemoveItem(memberId)}
                      className="text-sm font-medium text-red-600 transition hover:text-red-700"
                    >
                      Quitar
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      />
    </div>
  );
}