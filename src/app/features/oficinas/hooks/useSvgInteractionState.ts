import { useCallback, useEffect, useState } from "react";

type StateOptions = {
  defaultHighlightedIds?: string[];
  defaultDisabledIds?: string[];
  defaultReservedIds?: string[];
  defaultSelectedId?: string | null;
  onHighlightedIdsChange?: (ids: string[]) => void;
  onDisabledIdsChange?: (ids: string[]) => void;
  onReservedIdsChange?: (ids: string[]) => void;
  onHoveredIdChange?: (id: string | null) => void;
  onSelectedIdChange?: (id: string | null) => void;
};

export type SvgInteractionState = {
  highlightedIds: string[];
  disabledIds: string[];
  reservedIds: string[];
  hoveredId: string | null;
  selectedId: string | null;

  setHighlightedIds: (ids: string[]) => void;
  setDisabledIds: (ids: string[]) => void;
  setReservedIds: (ids: string[]) => void;
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;

  toggleHighlighted: (id: string) => void;
  clearHighlights: () => void;
  clearSelection: () => void;
  clearAll: () => void;
};

function normalizeIds(ids: string[]) {
  return [...new Set(ids.filter(Boolean))];
}

function areSameIds(first: string[], second: string[]) {
  if (first.length !== second.length) {
    return false;
  }

  return first.every((entry, index) => entry === second[index]);
}

export function useSvgInteractionState({
  defaultHighlightedIds = [],
  defaultDisabledIds = [],
  defaultReservedIds = [],
  defaultSelectedId = null,
  onHighlightedIdsChange,
  onDisabledIdsChange,
  onReservedIdsChange,
  onHoveredIdChange,
  onSelectedIdChange,
}: StateOptions): SvgInteractionState {
  const [highlightedIds, setHighlightedIdsState] = useState<string[]>(() =>
    normalizeIds(defaultHighlightedIds),
  );

  const [disabledIds, setDisabledIdsState] = useState<string[]>(() =>
    normalizeIds(defaultDisabledIds),
  );

  const [reservedIds, setReservedIdsState] = useState<string[]>(() =>
    normalizeIds(defaultReservedIds),
  );

  const [hoveredId, setHoveredIdState] = useState<string | null>(null);

  const [selectedId, setSelectedIdState] = useState<string | null>(
    defaultSelectedId,
  );

  const setHighlightedIds = useCallback((ids: string[]) => {
    const next = normalizeIds(ids);

    setHighlightedIdsState((current) => {
      if (areSameIds(current, next)) {
        return current;
      }

      return next;
    });
  }, []);

  const setDisabledIds = useCallback((ids: string[]) => {
    const next = normalizeIds(ids);

    setDisabledIdsState((current) => {
      if (areSameIds(current, next)) {
        return current;
      }

      return next;
    });
  }, []);

  const setReservedIds = useCallback((ids: string[]) => {
    const next = normalizeIds(ids);

    setReservedIdsState((current) => {
      if (areSameIds(current, next)) {
        return current;
      }

      return next;
    });
  }, []);

  const setHoveredId = useCallback((id: string | null) => {
    setHoveredIdState((current) => {
      if (current === id) {
        return current;
      }

      return id;
    });
  }, []);

  const setSelectedId = useCallback((id: string | null) => {
    setSelectedIdState((current) => {
      if (current === id) {
        return current;
      }

      return id;
    });
  }, []);

  const toggleHighlighted = useCallback((id: string) => {
    setHighlightedIdsState((current) => {
      if (current.includes(id)) {
        return current.filter((entry) => entry !== id);
      }

      return [...current, id];
    });
  }, []);

  const clearHighlights = useCallback(() => {
    setHighlightedIdsState([]);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIdState(null);
  }, []);

  const clearAll = useCallback(() => {
    setHoveredIdState(null);
    setDisabledIdsState([]);
    setReservedIdsState([]);
    setSelectedIdState(null);
    setHighlightedIdsState([]);
  }, []);

  useEffect(() => {
    onHighlightedIdsChange?.(highlightedIds);
  }, [highlightedIds, onHighlightedIdsChange]);

  useEffect(() => {
    onDisabledIdsChange?.(disabledIds);
  }, [disabledIds, onDisabledIdsChange]);

  useEffect(() => {
    onReservedIdsChange?.(reservedIds);
  }, [reservedIds, onReservedIdsChange]);

  useEffect(() => {
    onHoveredIdChange?.(hoveredId);
  }, [hoveredId, onHoveredIdChange]);

  useEffect(() => {
    onSelectedIdChange?.(selectedId);
  }, [selectedId, onSelectedIdChange]);

  return {
    highlightedIds,
    disabledIds,
    reservedIds,
    hoveredId,
    selectedId,

    setHighlightedIds,
    setDisabledIds,
    setReservedIds,
    setHoveredId,
    setSelectedId,

    toggleHighlighted,
    clearHighlights,
    clearSelection,
    clearAll,
  };
}
