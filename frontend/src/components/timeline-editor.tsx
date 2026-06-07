"use client";

import { useState, useEffect } from "react";
import { useSocket } from "../context/socket-provider";

interface Cue {
  id: string;
  name: string;
}

export function TimelineEditor() {
  const { socket, isConnected } = useSocket();
  const [cues, setCues] = useState<Cue[]>([]);
  const [selectedCueId, setSelectedCueId] = useState<string>("");
  const [timeInput, setTimeInput] = useState<string>("00:00");

  useEffect(() => {
    if (!socket || !isConnected) return;
    socket.on("operator:cues-update", (data: { cues: Cue[] }) => {
      setCues(data.cues);
      if (data.cues.length > 0 && !selectedCueId) {
        setSelectedCueId(data.cues[0].id);
      }
    });
    return () => {
      socket.off("operator:cues-update");
    };
  }, [socket, isConnected, selectedCueId]);

  const handleAdd = () => {
    if (!socket || !selectedCueId) return;

    // Parse time (MM:SS) to ms
    const parts = timeInput.split(":");
    let ms = 0;
    if (parts.length === 2) {
      ms = (parseInt(parts[0]) * 60 + parseInt(parts[1])) * 1000;
    } else {
      ms = parseInt(timeInput) * 1000; // fallback to raw seconds
    }

    if (isNaN(ms)) ms = 0;

    socket.emit("operator:add-to-timeline", {
      id: `evt_${Math.random().toString(36).substring(2, 9)}`,
      cueId: selectedCueId,
      timestampMs: ms,
    });
  };

  return (
    <div className="flex flex-col gap-4 border border-zinc-200 bg-white p-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950">Add to Timeline</h3>
      
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-zinc-500">Select Cue</label>
          <select
            value={selectedCueId}
            onChange={(e) => setSelectedCueId(e.target.value)}
            className="border border-zinc-300 p-2 text-xs text-zinc-950 focus:outline-none focus:border-zinc-900 font-mono"
          >
            {cues.length === 0 && <option value="">No cues available</option>}
            {cues.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-zinc-500">Timestamp (MM:SS)</label>
          <input
            type="text"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            placeholder="00:00"
            className="border border-zinc-300 p-2 text-xs text-zinc-950 focus:outline-none focus:border-zinc-900 font-mono"
          />
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={cues.length === 0}
        className="mt-2 border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:border-zinc-300 disabled:text-zinc-500 p-3 text-xs font-bold uppercase tracking-widest transition-colors font-mono"
      >
        Add Event
      </button>
    </div>
  );
}
