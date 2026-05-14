"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Search,
  UsersRound,
} from "lucide-react";

type ReservationFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

type NormalizedTimeResult = {
  isValid: boolean;
  value: string;
};

function normalizeTimeInput(rawValue: string): NormalizedTimeResult {
  const value = rawValue.trim().toLowerCase().replace(/\s+/g, "");

  if (!value) {
    return {
      isValid: true,
      value: "",
    };
  }

  /**
   * Acepta:
   * 3pm
   * 3 pm
   * 3:00pm
   * 3:30pm
   * 03:30 pm
   */
  const twelveHourMatch = value.match(/^(\d{1,2})(?::([0-5]\d))?(am|pm)$/);

  if (twelveHourMatch) {
    const hour = Number(twelveHourMatch[1]);
    const minutes = twelveHourMatch[2] ?? "00";
    const period = twelveHourMatch[3];

    if (hour < 1 || hour > 12) {
      return {
        isValid: false,
        value: rawValue,
      };
    }

    return {
      isValid: true,
      value: `${hour}:${minutes}${period}`,
    };
  }

  /**
   * Opcional: acepta formato 24 horas:
   * 15:00 -> 3:00pm
   * 08:30 -> 8:30am
   */
  const twentyFourHourMatch = value.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);

  if (twentyFourHourMatch) {
    const hour24 = Number(twentyFourHourMatch[1]);
    const minutes = twentyFourHourMatch[2];

    const period = hour24 >= 12 ? "pm" : "am";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

    return {
      isValid: true,
      value: `${hour12}:${minutes}${period}`,
    };
  }

  return {
    isValid: false,
    value: rawValue,
  };
}
function timeToMinutes(time: string): number | null {
  const normalized = normalizeTimeInput(time);

  if (!normalized.isValid || !normalized.value) {
    return null;
  }

  const match = normalized.value.match(/^(\d{1,2}):([0-5]\d)(am|pm)$/);

  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  let hour24 = hour;

  if (period === "pm" && hour !== 12) {
    hour24 += 12;
  }

  if (period === "am" && hour === 12) {
    hour24 = 0;
  }

  return hour24 * 60 + minutes;
}

function getTimeButtonLabel(startTime: string, endTime: string) {
  if (startTime && endTime) {
    return `${startTime} - ${endTime}`;
  }

  if (startTime) {
    return `Desde ${startTime}`;
  }

  if (endTime) {
    return `Hasta ${endTime}`;
  }

  return "Horario";
}

function normalizeCapacityInput(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return {
      isValid: true,
      value: "",
    };
  }

  const numberValue = Number(trimmedValue);

  if (!Number.isInteger(numberValue) || numberValue < 1) {
    return {
      isValid: false,
      value: trimmedValue,
    };
  }

  return {
    isValid: true,
    value: String(numberValue),
  };
}

function getCapacityButtonLabel(minCapacity: string, maxCapacity: string) {
  if (minCapacity && maxCapacity) {
    return `${minCapacity} - ${maxCapacity} personas`;
  }

  if (minCapacity) {
    return `Desde ${minCapacity} personas`;
  }

  if (maxCapacity) {
    return `Hasta ${maxCapacity} personas`;
  }

  return "Capacidad";
}
export function ReservationFilters({
  search,
  onSearchChange,
}: ReservationFiltersProps) {
  const [showFilterSelectHour, setShowFilterSelectHour] = useState(false);

  const [appliedStartTime, setAppliedStartTime] = useState("");
  const [appliedEndTime, setAppliedEndTime] = useState("");

  const [draftStartTime, setDraftStartTime] = useState("");
  const [draftEndTime, setDraftEndTime] = useState("");

  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);

  const hourFilterRef = useRef<HTMLDivElement | null>(null);

  const hasActiveHourFilter = Boolean(appliedStartTime || appliedEndTime);

  const [showCapacityFilter, setShowCapacityFilter] = useState(false);

  const [appliedMinCapacity, setAppliedMinCapacity] = useState("");
  const [appliedMaxCapacity, setAppliedMaxCapacity] = useState("");

  const [draftMinCapacity, setDraftMinCapacity] = useState("");
  const [draftMaxCapacity, setDraftMaxCapacity] = useState("");

  const [minCapacityError, setMinCapacityError] = useState(false);
  const [maxCapacityError, setMaxCapacityError] = useState(false);

  const capacityFilterRef = useRef<HTMLDivElement | null>(null);

  const hasActiveCapacityFilter = Boolean(
    appliedMinCapacity || appliedMaxCapacity,
  );
  function openCapacityFilter() {
    setDraftMinCapacity(appliedMinCapacity);
    setDraftMaxCapacity(appliedMaxCapacity);
    setMinCapacityError(false);
    setMaxCapacityError(false);
    setShowCapacityFilter((current) => !current);
  }

  function handleCancelCapacityFilter() {
    setAppliedMinCapacity("");
    setAppliedMaxCapacity("");
    setDraftMinCapacity("");
    setDraftMaxCapacity("");
    setMinCapacityError(false);
    setMaxCapacityError(false);
    setShowCapacityFilter(false);
  }

  function handleApplyCapacityFilter() {
    const normalizedMin = normalizeCapacityInput(draftMinCapacity);
    const normalizedMax = normalizeCapacityInput(draftMaxCapacity);

    setMinCapacityError(!normalizedMin.isValid);
    setMaxCapacityError(!normalizedMax.isValid);

    if (!normalizedMin.isValid || !normalizedMax.isValid) {
      return;
    }

    const minValue = normalizedMin.value ? Number(normalizedMin.value) : null;
    const maxValue = normalizedMax.value ? Number(normalizedMax.value) : null;

    if (minValue !== null && maxValue !== null && minValue > maxValue) {
      setMinCapacityError(true);
      setMaxCapacityError(true);
      return;
    }

    setAppliedMinCapacity(normalizedMin.value);
    setAppliedMaxCapacity(normalizedMax.value);

    setDraftMinCapacity(normalizedMin.value);
    setDraftMaxCapacity(normalizedMax.value);

    setShowCapacityFilter(false);
  }

  function handleMinCapacityBlur() {
    const normalized = normalizeCapacityInput(draftMinCapacity);

    setMinCapacityError(!normalized.isValid);

    if (normalized.isValid) {
      setDraftMinCapacity(normalized.value);
    }
  }

  function handleMaxCapacityBlur() {
    const normalized = normalizeCapacityInput(draftMaxCapacity);

    setMaxCapacityError(!normalized.isValid);

    if (normalized.isValid) {
      setDraftMaxCapacity(normalized.value);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        hourFilterRef.current &&
        !hourFilterRef.current.contains(event.target as Node)
      ) {
        setShowFilterSelectHour(false);
        setDraftStartTime(appliedStartTime);
        setDraftEndTime(appliedEndTime);
        setStartTimeError(false);
        setEndTimeError(false);
      }
      if (
        capacityFilterRef.current &&
        !capacityFilterRef.current.contains(event.target as Node)
      ) {
        setShowCapacityFilter(false);
        setDraftMinCapacity(appliedMinCapacity);
        setDraftMaxCapacity(appliedMaxCapacity);
        setMinCapacityError(false);
        setMaxCapacityError(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowFilterSelectHour(false);
        setDraftStartTime(appliedStartTime);
        setDraftEndTime(appliedEndTime);
        setStartTimeError(false);
        setEndTimeError(false);

        setShowCapacityFilter(false);
        setDraftMinCapacity(appliedMinCapacity);
        setDraftMaxCapacity(appliedMaxCapacity);
        setMinCapacityError(false);
        setMaxCapacityError(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [
    appliedStartTime,
    appliedEndTime,
    appliedMinCapacity,
    appliedMaxCapacity,
  ]);

  function openHourFilter() {
    setDraftStartTime(appliedStartTime);
    setDraftEndTime(appliedEndTime);
    setStartTimeError(false);
    setEndTimeError(false);
    setShowFilterSelectHour((current) => !current);
  }

  function handleCancelHourFilter() {
    setAppliedStartTime("");
    setAppliedEndTime("");
    setDraftStartTime("");
    setDraftEndTime("");
    setStartTimeError(false);
    setEndTimeError(false);
    setShowFilterSelectHour(false);
  }

  function handleApplyHourFilter() {
    const normalizedStart = normalizeTimeInput(draftStartTime);
    const normalizedEnd = normalizeTimeInput(draftEndTime);

    if (!normalizedStart.isValid || !normalizedEnd.isValid) {
      return;
    }
    const startMinutes = timeToMinutes(normalizedStart.value);
    const endMinutes = timeToMinutes(normalizedEnd.value);

    if (
      startMinutes !== null &&
      endMinutes !== null &&
      startMinutes >= endMinutes
    ) {
      setStartTimeError(true);
      setEndTimeError(true);
      return;
    }

    setStartTimeError(!normalizedStart.isValid);
    setEndTimeError(!normalizedEnd.isValid);

    if (!normalizedStart.isValid || !normalizedEnd.isValid) {
      return;
    }

    setAppliedStartTime(normalizedStart.value);
    setAppliedEndTime(normalizedEnd.value);

    setDraftStartTime(normalizedStart.value);
    setDraftEndTime(normalizedEnd.value);

    setShowFilterSelectHour(false);
  }

  function handleStartBlur() {
    const normalized = normalizeTimeInput(draftStartTime);

    setStartTimeError(!normalized.isValid);

    if (normalized.isValid) {
      setDraftStartTime(normalized.value);
    }
  }

  function handleEndBlur() {
    const normalized = normalizeTimeInput(draftEndTime);

    setEndTimeError(!normalized.isValid);

    if (normalized.isValid) {
      setDraftEndTime(normalized.value);
    }
  }

  return (
    <section className="w-full border border-neutral-300 bg-white p-3 shadow-sm">
      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1.7fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(180px,1fr)_180px]">
        <label className="flex h-12 items-center gap-3 border border-neutral-300 bg-white px-4 text-sm text-neutral-700 transition hover:border-primary-2 hover:text-primary-2 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
          <Search className="h-5 w-5 shrink-0 text-neutral-700" />

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por identificador"
            className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-700"
          />
        </label>

        <div ref={hourFilterRef} className="relative">
          <button
            type="button"
            onClick={openHourFilter}
            className={`flex h-12 w-full items-center justify-between border bg-white px-4 text-sm font-medium transition ${
              showFilterSelectHour || hasActiveHourFilter
                ? "border-primary-2 text-primary-2 ring-2 ring-purple-100"
                : "border-neutral-300 text-neutral-700 hover:border-primary-2 hover:text-primary-2"
            }`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <Clock3 className="h-5 w-5 shrink-0 text-neutral-700" />

              <span className="truncate">
                {getTimeButtonLabel(appliedStartTime, appliedEndTime)}
              </span>
            </span>

            <ChevronDown
              className={`h-4 w-4 shrink-0 text-neutral-700 transition ${
                showFilterSelectHour ? "rotate-180" : ""
              }`}
            />
          </button>

          {showFilterSelectHour && (
            <div className="absolute left-0 top-[calc(100%+10px)] z-30 w-[430px] border border-neutral-200 bg-white p-4 shadow-lg">
              <div className="mb-3">
                <p className="text-sm font-semibold text-neutral-900">
                  Selecciona un horario
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Puedes escribir solo inicio, solo fin, o ambos. Ejemplo: 3pm,
                  8:30am, 15:00.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-neutral-800">
                    Hora de inicio
                  </span>

                  <input
                    value={draftStartTime}
                    onChange={(event) => {
                      setDraftStartTime(event.target.value);
                      setStartTimeError(false);
                    }}
                    onBlur={handleStartBlur}
                    placeholder="Ej. 3pm"
                    className={`h-12 border bg-white px-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-purple-100 ${
                      startTimeError
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-300 hover:border-primary-2 focus:border-primary-2"
                    }`}
                  />

                  {startTimeError && (
                    <span className="text-xs font-medium text-red-600">
                      Usa un formato válido y asegúrate de que sea menor a la
                      hora de fin.
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-neutral-800">
                    Hora de fin
                  </span>

                  <input
                    value={draftEndTime}
                    onChange={(event) => {
                      setDraftEndTime(event.target.value);
                      setEndTimeError(false);
                    }}
                    onBlur={handleEndBlur}
                    placeholder="Ej. 5pm"
                    className={`h-12 border bg-white px-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-purple-100 ${
                      endTimeError
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-300 hover:border-primary-2 focus:border-primary-2"
                    }`}
                  />
                  {endTimeError && (
                    <span className="text-xs font-medium text-red-600">
                      Usa un formato válido y asegúrate de que sea mayor a la
                      hora de inicio.
                    </span>
                  )}
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={handleCancelHourFilter}
                  className="h-10 border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleApplyHourFilter}
                  className="h-10 border border-primary-2 bg-primary-2 px-4 text-sm font-medium text-on-primary transition hover:opacity-90"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>

        <div ref={capacityFilterRef} className="relative">
          <button
            type="button"
            onClick={openCapacityFilter}
            className={`flex h-12 w-full items-center justify-between border bg-white px-4 text-sm font-medium transition ${
              showCapacityFilter || hasActiveCapacityFilter
                ? "border-primary-2 text-primary-2 ring-2 ring-purple-100"
                : "border-neutral-300 text-neutral-700 hover:border-primary-2 hover:text-primary-2"
            }`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <UsersRound className="h-5 w-5 shrink-0 text-neutral-700" />

              <span className="truncate">
                {getCapacityButtonLabel(appliedMinCapacity, appliedMaxCapacity)}
              </span>
            </span>

            <ChevronDown
              className={`h-4 w-4 shrink-0 text-neutral-700 transition ${
                showCapacityFilter ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCapacityFilter && (
            <div className="absolute left-0 top-[calc(100%+10px)] z-30 w-[430px] border border-neutral-200 bg-white p-4 shadow-lg">
              <div className="mb-3">
                <p className="text-sm font-semibold text-neutral-900">
                  Selecciona capacidad
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Puedes indicar capacidad mínima, máxima o un rango.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-neutral-800">
                    Capacidad mínima
                  </span>

                  <input
                    value={draftMinCapacity}
                    onChange={(event) => {
                      setDraftMinCapacity(event.target.value);
                      setMinCapacityError(false);
                    }}
                    onBlur={handleMinCapacityBlur}
                    inputMode="numeric"
                    placeholder="Ej. 4"
                    className={`h-12 border bg-white px-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-purple-100 ${
                      minCapacityError
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-300 hover:border-primary-2 focus:border-primary-2"
                    }`}
                  />

                  {minCapacityError && (
                    <span className="text-xs font-medium text-red-600">
                      Usa un número válido y menor o igual a la capacidad
                      máxima.
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-neutral-800">
                    Capacidad máxima
                  </span>

                  <input
                    value={draftMaxCapacity}
                    onChange={(event) => {
                      setDraftMaxCapacity(event.target.value);
                      setMaxCapacityError(false);
                    }}
                    onBlur={handleMaxCapacityBlur}
                    inputMode="numeric"
                    placeholder="Ej. 12"
                    className={`h-12 border bg-white px-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-purple-100 ${
                      maxCapacityError
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-300 hover:border-primary-2 focus:border-primary-2"
                    }`}
                  />

                  {maxCapacityError && (
                    <span className="text-xs font-medium text-red-600">
                      Usa un número válido y mayor o igual a la capacidad
                      mínima.
                    </span>
                  )}
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={handleCancelCapacityFilter}
                  className="h-10 border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleApplyCapacityFilter}
                  className="h-10 border border-primary-2 bg-primary-2 px-4 text-sm font-medium text-on-primary transition hover:opacity-90"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-12 items-center justify-between border border-neutral-300 px-4 text-sm font-semibold text-neutral-700 transition hover:border-primary-2 hover:text-primary-2"
        >
          <span className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5" />
            Periodo
          </span>

          <ChevronDown className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="h-12 border border-primary-2 px-5 text-sm font-medium text-primary-2 transition hover:bg-primary-2 hover:text-on-primary focus:bg-primary-2 focus:text-on-primary"
        >
          Buscar espacios
        </button>
      </div>
    </section>
  );
}
