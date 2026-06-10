"use client";

import { ScanLine, QrCode } from "lucide-react";
import PageTransition from "@/app/shared/components/PageTransition/PageTransition";
import { QrScannerComponent } from "@/app/features/guard-checkin/components/QrScanner";
import { CheckinResultModal } from "@/app/features/guard-checkin/components/CheckinResultModal";
import { useGuardCheckin } from "@/app/features/guard-checkin/hooks/useGuardCheckin";

export default function ParkingCheckinPage() {
  const { result, handleScan, reset } = useGuardCheckin();

  const isProcessing =
    result.status === "loading" ||
    result.status === "success" ||
    result.status === "error" ||
    result.status === "invalid";

  return (
    <PageTransition>
      <div className="flex flex-col items-center px-4 py-10 gap-8 max-w-2xl mx-auto w-full">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-1/10 px-4 py-1.5 mb-4">
            <ScanLine className="h-4 w-4 text-primary-1" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-1">
              Sistema de Acceso
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">
            Control de Asistencia de Estacionamiento
          </h1>
          <p className="mt-2 text-sm text-on-background-2 max-w-md mx-auto">
            Utilice esta pantalla para validar reservas de estacionamiento mediante códigos QR.
          </p>
        </div>

        <div className="w-full rounded-xl border border-container-border bg-container p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-1/10">
              <QrCode className="h-4 w-4 text-primary-1" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-background">Instrucciones de uso</p>
              <p className="mt-1 text-sm leading-6 text-on-background-2">
                Puede escanear un código QR utilizando la cámara del dispositivo o mediante un
                lector conectado al sistema. Una vez leído el código, la reserva será validada
                automáticamente.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full rounded-xl border border-container-border bg-container p-6 shadow-sm flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-dashed border-primary-1/30">
              <ScanLine className="h-9 w-9 text-primary-1/60" />
              <span className="absolute inset-0 rounded-full animate-ping bg-primary-1/10" />
            </div>
            <p className="text-sm font-medium text-on-background-2">Esperando escaneo de QR…</p>
          </div>
          <div className="w-full border-t border-neutral-1" />
          <QrScannerComponent onScan={handleScan} active={!isProcessing} />
        </div>
      </div>

      <CheckinResultModal result={result} onClose={reset} />
    </PageTransition>
  );
}
