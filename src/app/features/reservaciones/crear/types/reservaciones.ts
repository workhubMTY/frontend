export type SelectionMode = "single" | "multiple" | "repeat";

export type CalendarCell = {
  id: string;
  date: Date;
  dayNumber: number;
  shortLabel: string;
  monthShort: string;
  isStartMonth: boolean;
  isMonthBoundary: boolean;
  isWeekend: boolean;
};

export type TimeBlock = {
  id: string;
  label: string;
  start: string;
  end: string;
  conflict?: boolean;
  applyToAllSelected?: boolean;
};

export type TimelineEvent = {
  id: string;
  dateId: string;
  label: string;
  title: string;
  start: string;
  end: string;
  row: "reserved" | "external";
};

export type DayEvent = {
  id: string;
  dateId: string;
  title: string;
  location: string;
  time: string;
  start: string;
  end: string;
  status: "normal" | "conflict" | "partial";
  source: "space" | "user" | "external";
};

export type ApiReservation = {
  id: string;
  dateId: string;
  title: string;
  location: string;
  start: string;
  end: string;
};

export type CalendarSelectionAction =
  | {
      type: "day";
      dayId: string;
    }
  | {
      type: "range";
      dateIds: string[];
    };