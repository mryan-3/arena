"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export function QrModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setJoinUrl(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/fixture`);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-zinc-900 bg-white hover:bg-zinc-100 text-zinc-950 p-4 text-xs font-bold uppercase tracking-widest transition-colors font-mono"
      >
        {isOpen ? "Hide Join QR Code" : "Show Join QR Code"}
      </button>

      {isOpen && joinUrl && (
        <div className="flex flex-col items-center justify-center p-6 border border-zinc-300 bg-white gap-4">
          <QRCodeSVG value={joinUrl} size={200} className="border border-zinc-200 p-2 bg-white" />
          <div className="text-center flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-950 uppercase tracking-wider">
              Scan to Connect Device
            </span>
            <span className="text-[9px] font-semibold text-zinc-600 break-all select-all font-mono">
              {joinUrl}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
