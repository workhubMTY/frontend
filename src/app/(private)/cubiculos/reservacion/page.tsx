"use client";

import PageTransition from "@/app/shared/components/PageTransition/PageTransition";
import { ReservationSchedulerContent } from "@/app/features/reservaciones/crear/components/ReservationSchedulerContent";

export default function ReservationSchedulerPage() {
  return (
    <PageTransition>
      <ReservationSchedulerContent />
    </PageTransition>
  );
}
