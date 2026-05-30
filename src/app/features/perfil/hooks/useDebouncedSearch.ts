// hooks/useDebouncedSearch.ts
"use client";

import { useEffect, useState } from "react";

type UseDebouncedSearchParams<T> = {
  searchTerm: string;
  searchFn: (query: string) => Promise<T[]>;
  delay?: number;
  enabled?: boolean;
};

export function useDebouncedSearch<T>({
  searchTerm,
  searchFn,
  delay = 350,
  enabled = true,
}: UseDebouncedSearchParams<T>) {
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const normalizedSearch = searchTerm.trim();

    if (!enabled || !normalizedSearch) {
      setResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    let isActive = true;

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setHasSearched(true);

        const incomingResults = await searchFn(normalizedSearch);

        if (isActive) {
          setResults(incomingResults);
        }
      } catch (error) {
        console.error("Error searching:", error);

        if (isActive) {
          setResults([]);
        }
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    }, delay);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm, searchFn, delay, enabled]);

  return {
    results,
    isSearching,
    hasSearched,
    hasSearchTerm: searchTerm.trim().length > 0,
  };
}