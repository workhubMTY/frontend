export function timeToPercent(time: string) {
  const [hoursPart, minutesPart] = time.split(":").map(Number);
  const totalMinutes = hoursPart * 60 + minutesPart;

  return (totalMinutes / 1440) * 100;
}

export function getDurationPercent(start: string, end: string) {
  return Math.max(timeToPercent(end) - timeToPercent(start), 0);
}

export function blockStyle(start: string, end: string) {
  const left = timeToPercent(start);
  const width = Math.max(timeToPercent(end) - left, 3);

  return {
    left: `${left}%`,
    width: `${width}%`,
  };
}

export function timeValueToMinutes(value: string) {
  const normalizedValue = value.trim();

  if (normalizedValue.includes("AM") || normalizedValue.includes("PM")) {
    const [timePart, period] = normalizedValue.split(" ");
    const [rawHour, minute] = timePart.split(":").map(Number);

    let hour = rawHour;

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return hour * 60 + minute;
  }

  const [hour, minute] = normalizedValue.split(":").map(Number);
  return hour * 60 + minute;
}

export function to24Hour(value: string) {
  const [timePart, period] = value.split(" ");
  const [rawHour, minute] = timePart.split(":").map(Number);

  let hour = rawHour;

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}


export function parseTimeToMinutes(value: string): number | null {
  const trimmed = value.trim().toLowerCase();

  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);

  if (!match) return null;

  const [, hourText, minuteText = "00", period] = match;

  let hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  if (minute < 0 || minute > 59) return null;

  if (period) {
    if (hour < 1 || hour > 12) return null;

    if (period === "am") {
      hour = hour === 12 ? 0 : hour;
    }

    if (period === "pm") {
      hour = hour === 12 ? 12 : hour + 12;
    }
  } else {
    if (hour < 0 || hour > 23) return null;
  }

  return hour * 60 + minute;
}

export function normalizeTimeInput(value: string): string | null {
  const minutes = parseTimeToMinutes(value);

  if (minutes === null) return null;

  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function isValidTimeRange(start: string, end: string) {
  const startMinutes = parseTimeToMinutes(start);
  const endMinutes = parseTimeToMinutes(end);

  if (startMinutes === null || endMinutes === null) return false;

  return startMinutes < endMinutes;
}