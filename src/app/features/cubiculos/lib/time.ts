type NormalizedTimeResult = {
  isValid: boolean;
  value: string;
};

export function normalizeTimeInput(rawValue: string): NormalizedTimeResult {
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

export function timeToMinutes(time: string): number | null {
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
