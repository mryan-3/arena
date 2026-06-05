"use client";

import { useState } from "react";
import { useSocket } from "../context/socket-provider";

export function CueBuilder() {
  const { socket, isConnected } = useSocket();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [brightness, setBrightness] = useState(100);

  const handleSave = () => {
    if (!name.trim() || !socket || !isConnected) return;
    
    const newCue = {
      id: `cue_${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      color,
      brightness,
      duration: 0,
    };
    
    socket.emit("operator:save-cue", newCue);
    setName(""); // reset name input
  };

  return (
    <div className="flex flex-col gap-4 border border-zinc-200 bg-white p-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950">Cue Builder</h3>
      
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-zinc-500">Cue Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Walk In, Blackout..."
            className="border border-zinc-300 p-2 text-xs text-zinc-950 focus:outline-none focus:border-zinc-900 font-mono"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-bold uppercase text-zinc-500">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-8 cursor-pointer border border-zinc-300"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-bold uppercase text-zinc-500">
              Brightness ({brightness}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full h-8 accent-zinc-900"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!name.trim()}
        className="mt-2 border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:border-zinc-300 disabled:text-zinc-500 p-3 text-xs font-bold uppercase tracking-widest transition-colors font-mono"
      >
        Save As New Cue
      </button>
    </div>
  );
}
