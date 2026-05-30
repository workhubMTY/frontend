"use client";

import type { ReactNode } from "react";
import { Search, Users, X } from "lucide-react";
import { Avatar } from "./Avatar";

type SearchSelectionBoxProps<T> = {
  id: string;
  label: string;

  searchValue: string;
  onSearchChange: (value: string) => void;

  selectedItems: T[];
  results: T[];

  isSearching: boolean;
  hasSearched: boolean;

  getItemId: (item: T) => string;
  getItemName: (item: T) => string;
  getItemAvatarUrl?: (item: T) => string | undefined;
  getItemDescription?: (item: T) => string | undefined;

  onSelectItem: (item: T) => void;
  onRemoveItem: (itemId: string) => void;

  selectedLabel?: string;
  resultsLabel?: string;
  selectedCountLabel?: string;

  placeholder?: string;
  searchPlaceholderWhenSelected?: string;

  isItemSelected?: (item: T) => boolean;
  isItemDisabled?: (item: T) => boolean;

  renderItemStatus?: (
    item: T,
    context: { isSelected: boolean; isDisabled: boolean },
  ) => ReactNode;

  initialTitle?: string;
  initialDescription?: string;

  emptyTitle?: string;
  emptyDescription?: string;

  loadingLabel?: string;

  helperText?: string;
};

export function SearchSelectionBox<T>({
  id,
  label,

  searchValue,
  onSearchChange,

  selectedItems,
  results,

  isSearching,
  hasSearched,

  getItemId,
  getItemName,
  getItemAvatarUrl,
  getItemDescription,

  onSelectItem,
  onRemoveItem,

  selectedLabel = "Personas seleccionadas",
  resultsLabel = "Resultados",
  selectedCountLabel,

  placeholder = "Buscar por nombre, correo o rol",
  searchPlaceholderWhenSelected = "Buscar personas...",

  isItemSelected,
  isItemDisabled,

  renderItemStatus,

  initialTitle = "Busca una persona",
  initialDescription = "Escribe un nombre, correo o rol para encontrar personas.",

  emptyTitle = "No hay resultados",
  emptyDescription = "Intenta buscar por nombre, correo o usuario.",

  loadingLabel = "Buscando personas...",

  helperText,
}: SearchSelectionBoxProps<T>) {
  const hasSearchValue = searchValue.trim().length > 0;

  function getSelectedState(item: T) {
    if (isItemSelected) return isItemSelected(item);

    const itemId = getItemId(item);

    return selectedItems.some(
      (selectedItem) => getItemId(selectedItem) === itemId,
    );
  }

  return (
    <div>
      <div>
        <label htmlFor={id} className="text-sm font-semibold text-neutral-950">
          {label}
        </label>

        <div className="relative mt-3">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
          />

          <input
            id={id}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={
              selectedItems.length > 0 ? searchPlaceholderWhenSelected : placeholder
            }
            className="h-11 w-full border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
          />
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-neutral-950">
            {selectedLabel}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedItems.map((item) => {
              const itemId = getItemId(item);
              const itemName = getItemName(item);

              return (
                <span
                  key={itemId}
                  className="inline-flex h-8 items-center gap-2 bg-neutral-100 px-3 text-sm text-neutral-700"
                >
                  {itemName}

                  <button
                    type="button"
                    onClick={() => onRemoveItem(itemId)}
                    className="text-neutral-500 transition hover:text-neutral-900"
                    aria-label={`Quitar ${itemName}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-950">
            {resultsLabel}
          </p>

          <p className="text-xs text-neutral-500">
            {selectedCountLabel ?? `${selectedItems.length} seleccionados`}
          </p>
        </div>

        <div className="border border-neutral-200">
          {!hasSearchValue ? (
            <SearchSelectionInitialState
              title={initialTitle}
              description={initialDescription}
            />
          ) : isSearching ? (
            <div className="px-5 py-10 text-center text-sm text-neutral-500">
              {loadingLabel}
            </div>
          ) : hasSearched && results.length > 0 ? (
            <div className="max-h-[360px] overflow-y-auto divide-y divide-neutral-100">
              {results.map((item) => {
                const itemId = getItemId(item);
                const itemName = getItemName(item);
                const itemDescription = getItemDescription?.(item);
                const avatarUrl = getItemAvatarUrl?.(item);
                const isSelected = getSelectedState(item);
                const disabled = isItemDisabled?.(item) ?? false;

                return (
                  <button
                    key={itemId}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectItem(item)}
                    className={[
                      "grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 text-left transition",
                      disabled
                        ? "cursor-not-allowed bg-neutral-50 opacity-70"
                        : "hover:bg-neutral-50",
                      isSelected ? "bg-purple-50" : "",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={itemName} avatarUrl={avatarUrl} />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-neutral-950">
                          {itemName}
                        </p>

                        {itemDescription && (
                          <p className="truncate text-xs text-neutral-500">
                            {itemDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    {renderItemStatus?.(item, {
                      isSelected,
                      isDisabled: disabled,
                    })}
                  </button>
                );
              })}
            </div>
          ) : (
            <SearchSelectionEmptyState
              title={emptyTitle}
              description={emptyDescription}
            />
          )}
        </div>
      </div>

      {helperText && <p className="mt-2 text-xs text-neutral-500">{helperText}</p>}
    </div>
  );
}

function SearchSelectionInitialState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-3 grid size-12 place-items-center bg-neutral-100 text-neutral-500">
        <Search size={22} />
      </div>

      <h3 className="text-sm font-semibold text-neutral-950">{title}</h3>

      <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>
    </div>
  );
}

function SearchSelectionEmptyState({
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