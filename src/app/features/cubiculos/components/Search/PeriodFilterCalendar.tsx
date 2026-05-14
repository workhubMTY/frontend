"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/app/features/cubiculos/lib/cn";

type CalendarMode = "single" | "range";

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type PeriodFilterCalendarProps = {
  mode: CalendarMode;
  value: DateRange;
  onChange: (value: DateRange) => void;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(date: Date, startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) return false;

  const time = startOfDay(date).getTime();
  const start = startOfDay(startDate).getTime();
  const end = startOfDay(endDate).getTime();

  return time > start && time < end;
}

function formatRangeTitle(date: Date) {
  return date.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });
}

function getMonthDays(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const placeholders = Array.from(
    { length: firstDay.getDay() },
    (_, index) => ({
      id: `placeholder-${index}`,
      date: null,
    }),
  );

  const days = Array.from({ length: lastDay.getDate() }, (_, index) => ({
    id: `${year}-${month + 1}-${index + 1}`,
    date: new Date(year, month, index + 1),
  }));

  return [...placeholders, ...days];
}

export function PeriodFilterCalendar({
  mode,
  value,
  onChange,
}: PeriodFilterCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());

  const calendarCells = useMemo(() => {
    return getMonthDays(visibleMonth);
  }, [visibleMonth]);

  function goToPreviousMonth() {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
  }

  function goToNextMonth() {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
  }

  function handleSelectDate(date: Date) {
    const selectedDate = startOfDay(date);

    if (mode === "single") {
      onChange({
        startDate: selectedDate,
        endDate: selectedDate,
      });

      return;
    }

    if (!value.startDate || value.endDate) {
      onChange({
        startDate: selectedDate,
        endDate: null,
      });

      return;
    }

    if (selectedDate.getTime() < value.startDate.getTime()) {
      onChange({
        startDate: selectedDate,
        endDate: value.startDate,
      });

      return;
    }

    onChange({
      startDate: value.startDate,
      endDate: selectedDate,
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="flex h-8 w-8 items-center justify-center border border-transparent text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="text-sm font-semibold capitalize text-neutral-900">
          {formatRangeTitle(visibleMonth)}
        </p>

        <button
          type="button"
          onClick={goToNextMonth}
          className="flex h-8 w-8 items-center justify-center border border-transparent text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid select-none grid-cols-7 gap-y-2 text-center text-xs">
        {["D", "L", "M", "M", "J", "V", "S"].map((dayLabel, index) => (
          <div
            key={`${dayLabel}-${index}`}
            className="pb-2 text-xs font-semibold text-neutral-500"
          >
            {dayLabel}
          </div>
        ))}

        {calendarCells.map((cell) => {
          if (!cell.date) {
            return <div key={cell.id} aria-hidden="true" />;
          }

          const isStart = isSameDay(cell.date, value.startDate);
          const isEnd = isSameDay(cell.date, value.endDate);
          const isInRange = isBetween(
            cell.date,
            value.startDate,
            value.endDate,
          );
          const isSelected = isStart || isEnd;

          return (
            <button
              key={cell.id}
              type="button"
              onClick={() => handleSelectDate(cell.date!)}
              className={cn(
                "mx-auto flex h-10 w-10 items-center justify-center text-sm font-medium transition",
                "border border-transparent hover:border-primary-2 hover:bg-purple-50 hover:text-primary-2",
                isInRange && "bg-purple-50 text-primary-2",
                isSelected &&
                  "border-primary-2 bg-primary-2 text-on-primary shadow-sm hover:bg-primary-2 hover:text-on-primary",
              )}
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
