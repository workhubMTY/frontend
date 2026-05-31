// "use client";

// import { CalendarDays, MapPin, Settings } from "lucide-react";

// import { Card } from "@/app/shared/components/Card";

// type ParkingReservationHeaderCardProps = {
//   parkingName: string;
//   dateRangeLabel: string;
//   selectedCount: number;
//   blockCount: number;
//   partialConflictsCount: number;
//   minimumAvailableSpots: number;
//   onOpenSettings?: () => void;
// };

// export function ParkingReservationHeaderCard({
//   parkingName,
//   dateRangeLabel,
//   selectedCount,
//   blockCount,
//   partialConflictsCount,
//   minimumAvailableSpots,
//   onOpenSettings,
// }: ParkingReservationHeaderCardProps) {
//   return (
//     <Card className="p-5">
//       <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
//             Reserva tu estacionamiento
//           </h1>

//           <p className="mt-1 text-sm text-slate-500">
//             Consulta la disponibilidad por capacidad y ajusta tus horarios antes
//             de guardar.
//           </p>

//           <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
//             <span className="inline-flex items-center gap-2">
//               <MapPin className="h-4 w-4 text-violet-600" />
//               {parkingName}
//             </span>

//             <span className="text-slate-300">•</span>

//             <span className="inline-flex items-center gap-2">
//               <CalendarDays className="h-4 w-4 text-violet-600" />
//               {dateRangeLabel}
//             </span>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={onOpenSettings}
//           className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
//         >
//           <Settings className="h-4 w-4" />
//           Preconfiguración
//         </button>
//       </div>

//       <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
//         <SummaryMetric
//           label="Días seleccionados"
//           value={selectedCount.toString()}
//         />

//         <SummaryMetric
//           label="Bloques de horario"
//           value={blockCount.toString()}
//         />

//         <SummaryMetric
//           label="Conflictos parciales"
//           value={partialConflictsCount.toString()}
//         />

//         <SummaryMetric
//           label="Cupo mínimo disponible"
//           value={minimumAvailableSpots.toString()}
//         />
//       </div>
//     </Card>
//   );
// }

// type SummaryMetricProps = {
//   label: string;
//   value: string;
// };

// function SummaryMetric({ label, value }: SummaryMetricProps) {
//   return (
//     <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
//       <p className="text-xs font-medium text-slate-500">{label}</p>
//       <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
//     </div>
//   );
// }
