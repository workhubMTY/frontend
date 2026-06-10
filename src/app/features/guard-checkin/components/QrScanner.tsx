"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Camera, CameraOff, Loader2 } from "lucide-react";

type QrScannerProps = {
  onScan: (raw: string) => void;
  active: boolean;
};

export function QrScannerComponent({
  onScan,
  active,
}: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  const [started, setStarted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopScanner = useCallback(async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }

      const video = videoRef.current;

      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;

        stream.getTracks().forEach((track) => {
          track.stop();
        });

        video.srcObject = null;
      }
    } catch (err) {
      console.error(err);
    }

    setStarted(false);
    setScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (!videoRef.current) {
      console.error("videoRef.current is null");
      return;
    }

    setError(null);
    setScanning(true);
    lastScannedRef.current = null;

    try {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          const raw =
            typeof result === "string"
              ? result
              : result.data;

          if (raw === lastScannedRef.current) return;

          lastScannedRef.current = raw;
          onScan(raw);
        },
        {
          preferredCamera: "environment",
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current = scanner;

      await scanner.start();

      const video = videoRef.current;

      console.log("Scanner started");
      console.log("readyState:", video.readyState);

      setTimeout(() => {
        console.log("videoWidth:", video.videoWidth);
        console.log("videoHeight:", video.videoHeight);
        console.log("clientWidth:", video.clientWidth);
        console.log("clientHeight:", video.clientHeight);
        console.log("srcObject:", video.srcObject);
      }, 1000);

      setStarted(true);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo acceder a la cámara."
      );

      setScanning(false);
      setStarted(false);
    }
  }, [onScan]);

  useEffect(() => {
    if (!active) {
      stopScanner();
    }
  }, [active, stopScanner]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full max-w-sm aspect-square overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-black">
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />

        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-100 text-slate-400 p-6 text-center">
            <Camera className="h-12 w-12 opacity-40" />
            <p className="text-sm">
              {scanning
                ? "Iniciando cámara..."
                : "La cámara no está activa"}
            </p>
          </div>
        )}

        {started && (
          <div className="pointer-events-none absolute inset-0">
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
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Iniciando...
          </>
        ) : started ? (
          <>
            <CameraOff className="h-4 w-4" />
            Detener cámara
          </>
        ) : (
          <>
            <Camera className="h-4 w-4" />
            Activar cámara
          </>
        )}
      </button>
    </div>
  );
}