export function getHourFromTimeLabel(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours + minutes / 60;
}