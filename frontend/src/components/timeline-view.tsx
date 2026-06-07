"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../context/socket-provider";
import { Trash } from "@phosphor-icons/react";

interface Cue {
  id: string;
  name: string;
  color: string;
}

interface TimelineEvent {
  id: string;
  cueId: string;
  timestampMs: number;
}

export function TimelineView() {
  const { socket, isConnected } = useSocket();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [cues, setCues] = useState<Record<string, Cue>>({});

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("operator:timeline-update", (data: { events: TimelineEvent[] }) => {
      setEvents(data.events);
    });

    socket.on("operator:cues-update", (data: { cues: Cue[] }) => {
      const cueMap: Record<string, Cue> = {};
      data.cues.forEach(c => (cueMap[c.id] = c));
      setCues(cueMap);
    });

    return () => {
      socket.off("operator:timeline-update");
      socket.off("operator:cues-update");
    };
  }, [socket, isConnected]);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleDelete = (id: string) => {
    if (socket) socket.emit("operator:delete-timeline-event", id);
  };

  return (
    <div className="flex flex-col gap-4 border border-zinc-200 bg-white p-6">
      <div className="flex justify-between items-end border-b border-zinc-200 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950">Timeline</h3>
        <span className="text-[10px] font-bold text-zinc-500 uppercase">{events.length} Events</span>
      </div>

      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-zinc-300 text-xs font-bold text-zinc-500 uppercase">
            No events programmed.
          </div>
        ) : (
          events.map((evt) => {
            const cue = cues[evt.cueId];
            return (
              <div key={evt.id} className="flex items-center justify-between p-3 border border-zinc-200 bg-white">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold font-mono text-zinc-950 w-12">
                    {formatTime(evt.timestampMs)}
                  </span>
                  <div
                    className="w-4 h-4 rounded-full border border-zinc-300 flex-shrink-0"
                    style={{ backgroundColor: cue?.color || "#fff" }}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-700">
                    {cue ? cue.name : "Unknown Cue"}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(evt.id)}
                  className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                >
                  <Trash size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
