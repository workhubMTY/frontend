export function getTimeButtonLabel(startTime: string, endTime: string) {
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

export function getCapacityButtonLabel(
  minCapacity: string,
  maxCapacity: string,
) {
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

type CalendarCellForLabel = {
  id: string;
  date: Date;
};

export function getPeriodButtonLabel(
  dateIds: string[],
  calendarCells: CalendarCellForLabel[],
) {
  if (dateIds.length === 0) return "Periodo";

  if (dateIds.length === 1) {
    const cell = calendarCells.find((calendarCell) =>
      dateIds.includes(calendarCell.id),
    );

    return (
      cell?.date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
      }) ?? "1 día"
    );
  }

  return `${dateIds.length} días seleccionados`;
}
