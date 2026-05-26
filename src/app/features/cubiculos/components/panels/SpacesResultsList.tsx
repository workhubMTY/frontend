"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, UsersRound } from "lucide-react";
import type {
  ReservableSpace,
  SpaceStatus,
} from "../../types/reservableSpaces";

type SpacesResultsListProps = {
  spaces: ReservableSpace[];
  selectedSpaceCode?: string;
  onSelectSpace: (spaceCode: string) => void;
  pageSize?: number;
};

function getStatusColor(status: SpaceStatus) {
  if (status === "available") return "text-green-600";
  if (status === "occupied") return "text-red-600";
  if (status === "soon") return "text-orange-500";
  return "text-blue-600";
}

function getStatusDot(status: SpaceStatus) {
  if (status === "available") return "bg-green-500";
  if (status === "occupied") return "bg-red-500";
  if (status === "soon") return "bg-orange-500";
  return "bg-blue-500";
}

function getSpaceDisplayName(space: ReservableSpace) {
  if (space.name) {
    return `${space.code} ${space.name}`;
  }

  return space.code;
}

export function SpacesResultsList({
  spaces,
  selectedSpaceCode,
  onSelectSpace,
  pageSize = 5,
}: SpacesResultsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = spaces.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedSpaces = useMemo(() => {
    return spaces.slice(startIndex, endIndex);
  }, [spaces, startIndex, endIndex]);

  const spacesSignature = useMemo(() => {
    return spaces.map((space) => space.code).join("|");
  }, [spaces]);

  useEffect(() => {
    setCurrentPage(1);
  }, [spacesSignature]);

  useEffect(() => {
    if (!selectedSpaceCode) {
      return;
    }

    const selectedIndex = spaces.findIndex(
      (space) => space.code === selectedSpaceCode,
    );

    if (selectedIndex === -1) {
      return;
    }

    const selectedPage = Math.floor(selectedIndex / pageSize) + 1;

    setCurrentPage((current) => {
      if (current === selectedPage) {
        return current;
      }

      return selectedPage;
    });
  }, [selectedSpaceCode, spaces, pageSize]);

  function goToPreviousPage() {
    setCurrentPage((current) => Math.max(1, current - 1));
  }

  function goToNextPage() {
    setCurrentPage((current) => Math.min(totalPages, current + 1));
  }

  function handlePageSelect(value: string) {
    setCurrentPage(Number(value));
  }

  const isFirstPage = safeCurrentPage === 1;
  const isLastPage = safeCurrentPage === totalPages;

  return (
    <section className="border border-slate-200 bg-container p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-950">
            Espacios encontrados
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {totalItems === 0
              ? "No hay espacios que coincidan con la búsqueda."
              : `Mostrando ${startIndex + 1}–${endIndex} de ${totalItems}`}
          </p>
        </div>

        <span className="shrink-0 border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
          {totalItems} espacios
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {paginatedSpaces.map((space) => {
          const isSelected = selectedSpaceCode === space.code;

          return (
            <button
              key={space.id}
              type="button"
              onClick={() => onSelectSpace(space.code)}
              className={[
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition",
                isSelected
                  ? "border-purple-500 bg-purple-50"
                  : "border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50",
              ].join(" ")}
            >
              <div
                className={[
                  "grid h-9 w-9 shrink-0 place-items-center rounded-md",
                  isSelected
                    ? "bg-purple-100 text-purple-700"
                    : "bg-slate-100 text-slate-500",
                ].join(" ")}
              >
                <UsersRound className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={[
                    "truncate text-sm font-semibold",
                    isSelected ? "text-purple-700" : "text-slate-950",
                  ].join(" ")}
                >
                  {getSpaceDisplayName(space)}
                </p>

                <p className="text-xs text-slate-500">
                  Piso {space.floor} · {space.capacity}{" "}
                  {space.capacity === 1 ? "persona" : "personas"}
                </p>
              </div>

              <div
                className={[
                  "hidden items-center gap-2 text-xs font-semibold sm:flex",
                  getStatusColor(space.status),
                ].join(" ")}
              >
                <span
                  className={[
                    "h-2 w-2 rounded-full",
                    getStatusDot(space.status),
                  ].join(" ")}
                />
                {space.statusLabel}
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-slate-500" />
            </button>
          );
        })}
      </div>

      {totalItems > pageSize ? (
        <footer className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Página {safeCurrentPage} de {totalPages}
          </p>

          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={isFirstPage}
              className="inline-flex h-9 items-center gap-1 border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>

            <label className="sr-only" htmlFor="spaces-page-select">
              Seleccionar página
            </label>

            <select
              id="spaces-page-select"
              value={safeCurrentPage}
              onChange={(event) => handlePageSelect(event.target.value)}
              className="h-9 max-w-[96px] border border-slate-200 bg-white px-2 text-sm font-medium text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            >
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;

                return (
                  <option key={page} value={page}>
                    {page} / {totalPages}
                  </option>
                );
              })}
            </select>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={isLastPage}
              className="inline-flex h-9 items-center gap-1 border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </footer>
      ) : null}
    </section>
  );
}
