"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, CameraOff, Loader2 } from "lucide-react";

type QrScannerProps = {
  /** Called with the raw scanned value. Caller is responsible for parsing. */
  onScan: (raw: string) => void;
  active: boolean;
};

export function QrScanner({ onScan, active }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const scannerRef = useRef<any>(null);
  const lastScannedRef = useRef<string | null>(null);

  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setScanning(false);
    setStarted(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (!videoRef.current) return;
    setError(null);
    setScanning(true);
    lastScannedRef.current = null;

    try {
      const QrScannerLib = (await import("qr-scanner")).default;

      const scanner = new QrScannerLib(
        videoRef.current,
        (result) => {
          const raw = result.data;
          if (raw === lastScannedRef.current) return;
          lastScannedRef.current = raw;
          onScan(raw);
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current = scanner;
      await scanner.start();
      setStarted(true);
    } catch {
      setError("No se pudo acceder a la cámara. Verifique los permisos.");
      setScanning(false);
    }
  }, [onScan]);

  useEffect(() => {
    if (!active && scannerRef.current) stopScanner();
  }, [active, stopScanner]);

  useEffect(() => () => stopScanner(), [stopScanner]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 aspect-square flex items-center justify-center">
        <video
          ref={videoRef}
          className={started ? "w-full h-full object-cover" : "hidden"}
          muted
          playsInline
        />
        {!started && (
          <div className="flex flex-col items-center gap-3 text-slate-400 p-6 text-center">
            <Camera className="h-12 w-12 opacity-40" />
            <p className="text-sm">
              {scanning ? "Iniciando cámara…" : "La cámara no está activa"}
            </p>
          </div>
        )}
        {started && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary-1 rounded-tl" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary-1 rounded-tr" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary-1 rounded-bl" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary-1 rounded-br" />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 w-full max-w-sm">
          <CameraOff className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={started ? stopScanner : startScanner}
        disabled={scanning && !started}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {scanning && !started ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Iniciando…</>
        ) : started ? (
          <><CameraOff className="h-4 w-4" />Detener cámara</>
        ) : (
          <><Camera className="h-4 w-4" />Activar cámara</>
        )}
      </button>
    </div>
  );
}
