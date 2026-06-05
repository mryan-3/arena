"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../context/socket-provider";
import { CueItem } from "./cue-item";
import { GoButton } from "./go-button";

interface Cue {
  id: string;
  name: string;
  color: string;
  brightness: number;
}

export function CueList() {
  const { socket, isConnected } = useSocket();
  const [cues, setCues] = useState<Cue[]>([]);
  const [activeCueId, setActiveCueId] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("operator:cues-update", (data: { cues: Cue[]; activeCueId: string | null }) => {
      setCues(data.cues);
      setActiveCueId(data.activeCueId);
    });

    return () => {
      socket.off("operator:cues-update");
    };
  }, [socket, isConnected]);

  const handleTrigger = (id: string) => {
    if (socket) socket.emit("operator:trigger-cue", id);
  };

  const handleDelete = (id: string) => {
    if (socket) socket.emit("operator:delete-cue", id);
  };

  const handleGo = () => {
    if (!socket || cues.length === 0) return;
    const currentIndex = cues.findIndex(c => c.id === activeCueId);
    // If no cue active, or at the end, trigger the first one. Otherwise, trigger next.
    const nextIndex = (currentIndex >= 0 && currentIndex < cues.length - 1) ? currentIndex + 1 : 0;
    socket.emit("operator:trigger-cue", cues[nextIndex].id);
  };

  return (
    <div className="flex flex-col gap-4 border border-zinc-200 bg-white p-6">
      <div className="flex justify-between items-end border-b border-zinc-200 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950">Cue List</h3>
        <span className="text-[10px] font-bold text-zinc-500 uppercase">{cues.length} Cues</span>
      </div>

      <GoButton onGo={handleGo} disabled={cues.length === 0} />

      <div className="flex flex-col gap-2 mt-2 max-h-[400px] overflow-y-auto pr-1">
        {cues.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-zinc-300 text-xs font-bold text-zinc-500 uppercase">
            No cues created. Use the builder to add some.
          </div>
        ) : (
          cues.map((cue) => (
            <CueItem
              key={cue.id}
              {...cue}
              isActive={cue.id === activeCueId}
              onTrigger={handleTrigger}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
