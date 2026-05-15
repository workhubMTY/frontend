const PERSON_COLORS = [
  { bg: "#EEEDFE", text: "#534AB7" },
  { bg: "#DDEEFE", text: "#185FA5" },
  { bg: "#D6F5E6", text: "#0F6E56" },
  { bg: "#FDECEC", text: "#B42318" },
  { bg: "#FFF4D6", text: "#B54708" },
  { bg: "#F3E8FF", text: "#7A3EA1" },
  { bg: "#E0F2FE", text: "#0369A1" },
];

function hashString(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // convierte a int32
  }

  return Math.abs(hash);
}

export function getUserColor(userId?: string | null) {
  const safeUserId = (userId ?? "").trim();
  const hash = hashString(safeUserId);

  return PERSON_COLORS[hash % PERSON_COLORS.length];
}

export function getInitials(name?: string | null): string {
  const safeName = (name ?? "").trim();
  if (!safeName) return "--";

  let initials = "";
  safeName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => (initials += token.at(0) ?? ""));

  return initials.toUpperCase() || "--";
}

export function formatEventTime(start: number, end: number) {
  const formatHour = (hour: number) => {
    const normalizedHour = Math.floor(hour);
    const minutes = Math.round((hour - normalizedHour) * 60);

    return `${String(normalizedHour).padStart(2, "0")}:${String(
      minutes,
    ).padStart(2, "0")}`;
  };

  return `${formatHour(start)} - ${formatHour(end)}`;
}

export function getDayLabel(day: number) {
  const days = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  return days[day] ?? `Día ${day + 1}`;
}

export function toDate(value: string) {
  return new Date(value);
}

export function toAgendaDay(date: Date) {
  return (date.getDay() + 6) % 7;
}

export function toDecimalHour(date: Date) {
  return date.getHours() + date.getMinutes() / 60;
}

export function formatHourRange(startIso: string, endIso: string) {
  const start = toDate(startIso);
  const end = toDate(endIso);
  const fmt = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  return `${fmt(start)}-${fmt(end)}`;
}
