"use client";

//@ts-ignore
import QRCode from "react-qr-code";

type ReservationQrProps = {
  url: string;
  label?: string;
  size?: number;
};

export function ReservationQr({ url, label, size = 180 }: ReservationQrProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <QRCode value={url} size={size} />
      </div>
      <p className="text-center text-xs text-slate-500 max-w-[220px] break-all">
        {label ?? url}
      </p>
    </div>
  );
}
