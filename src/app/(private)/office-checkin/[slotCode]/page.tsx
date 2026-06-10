"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ScanLine } from "lucide-react";
import PageTransition from "@/app/shared/components/PageTransition/PageTransition";
import { CheckinResultModal } from "@/app/features/guard-checkin/components/CheckinResultModal";
import { useOfficeCheckin } from "@/app/features/office-checkin/hooks/useOfficeCheckin";

export default function OfficeCheckinSlotPage() {
  const params = useParams();
  const router = useRouter();
  const { result, processSlot, reset } = useOfficeCheckin();
  const didProcess = useRef(false);

  const slotCode = params?.slotCode
    ? decodeURIComponent(String(params.slotCode))
    : null;

  useEffect(() => {
    if (!slotCode || didProcess.current) return;
    didProcess.current = true;
    processSlot(slotCode);
  }, [slotCode, processSlot]);

  const handleClose = () => {
    reset();
    router.push("/office-checkin");
  };

  return (
    <PageTransition>
      <div className="flex flex-col items-center px-4 py-10 gap-6 max-w-2xl mx-auto w-full">
        <div className="w-full">
          <button
            onClick={() => router.push("/office-checkin")}
            className="flex items-center gap-1.5 text-sm text-on-background-2 hover:text-on-background transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al escáner
          </button>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-1/10 px-4 py-1.5 mb-4">
            <ScanLine className="h-4 w-4 text-primary-1" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-1">
              Espacio {slotCode ?? "—"}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">
            Check-in de Espacio
          </h1>
          <p className="mt-2 text-sm text-on-background-2">
            Validando tu reservación…
          </p>
        </div>
      </div>
      <CheckinResultModal result={result} onClose={handleClose} />
    </PageTransition>
  );
}
