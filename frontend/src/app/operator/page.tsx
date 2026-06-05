"use client";

import Link from "next/link";
import { ColorControls } from "../../components/color-controls";
import { FixtureGrid } from "../../components/fixture-grid";
import { QrModal } from "../../components/qr-modal";
import { useSocket } from "../../context/socket-provider";

export default function OperatorPage() {
  const { isConnected } = useSocket();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-8">
        
        {/* Header */}
        <header className="flex justify-between items-end border-b border-zinc-200 pb-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold uppercase tracking-tighter text-zinc-950">Arena Console</h1>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-900">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-zinc-900">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500"}`} />
              {isConnected ? "Connected" : "Disconnected"}
            </div>
            <Link
              href="/"
              className="text-xs uppercase font-bold text-zinc-900 hover:text-black transition-colors"
            >
              Exit
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Controls Column (Left) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <ColorControls />
            <QrModal />
          </div>
          
          {/* Status Column (Right) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <FixtureGrid />
          </div>

        </div>
      </div>
    </div>
  );
}
