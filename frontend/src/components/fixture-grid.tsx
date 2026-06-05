"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../context/socket-provider";

interface Fixture {
  id: string;
  name: string;
  status: "online" | "offline";
  state: { color: string; brightness: number };
}

export function FixtureGrid() {
  const { socket, isConnected } = useSocket();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("operator:register");

    socket.on("operator:fixtures-update", (data: Fixture[]) => {
      setFixtures(data);
    });

    return () => {
      socket.off("operator:fixtures-update");
    };
  }, [socket, isConnected]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950">
        Connected Fixtures ({fixtures.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {fixtures.length === 0 ? (
          <div className="col-span-full border border-dashed border-zinc-400 p-8 text-center text-zinc-900 uppercase text-xs font-bold">
            No fixtures connected. Scan QR or open /fixture.
          </div>
        ) : (
          fixtures.map((f) => (
            <div key={f.id} className="border border-zinc-200 bg-white p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm uppercase truncate text-zinc-950">{f.name}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 ${f.status === 'online' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {f.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: f.state.color }} />
                {f.state.color}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
