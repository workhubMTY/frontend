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
