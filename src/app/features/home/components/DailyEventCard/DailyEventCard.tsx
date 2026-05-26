interface Event {
  id: number;
  title: string;
  location: {
    id: number;
    name: string;
  };
  startDate: string;
  endDate: string;
}

function EventCard({ id, title, location, startDate, endDate }: Event) {
  const startDateFormatted = new Date(startDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endDateFormatted = new Date(endDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="bg-container-on-container flex flex-col rounded p-4 mb-4 gap-1 select-none">
      <h4 className="text-md font-bold">{title}</h4>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-xs">location_on</span>
        <span className="text-sm">
          {location.id} - {location.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-xs">schedule</span>
        <span className="text-sm">
          {startDateFormatted} - {endDateFormatted}
        </span>
      </div>
    </div>
  );
}

interface DailyEventCardProps {
  events: Event[];
}

const DAYS = ["D", "L", "M", "M", "J", "V", "S"];
export default function DailyEventCard({ events }: DailyEventCardProps) {
  return (
    <div className="flex flex-col bg-container rounded gap-2 p-4 flex-1">
      <h3 className="text-lg font-bold">Tus eventos del día seleccionado</h3>
      <hr className="text-grid-lines" />
      <div className="grid grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}
